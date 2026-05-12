import json
import mimetypes
import os
import random
import subprocess
import uuid

from map_generator import generate_map
from game_state import GameState

from django.conf import settings
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from backend_app.models import EditorSnapshot

ASSETS_DIR = settings.GAME_ASSETS_DIR

# In-memory store of active game sessions.
# Key: session_id (UUID string)  Value: GameState instance
_sessions = {}


class Card:
    """
    Wraps a card dict from the run payload as an object.
    The combat engine accesses cards via attributes (card.cost, card.effects),
    but the payload stores them as dicts. This class bridges the two without
    changing any game logic files.
    """
    def __init__(self, data):
        self.id       = data.get('id', '')
        self.name     = data.get('name', '')
        self.cost     = data.get('cost', 0)
        self.type     = data.get('type', 'Attack')
        self.rarity   = data.get('rarity', 'Common')
        self.effects  = data.get('effects', [])
        self.imageUrl = data.get('imageUrl', '')

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'cost': self.cost,
            'type': self.type, 'rarity': self.rarity,
            'effects': self.effects, 'imageUrl': self.imageUrl,
        }


@require_http_methods(['GET'])
def list_assets(request):
    """
    GET /api/assets/list/?folder=monsters/basic
    Returns a sorted list of image filenames in the given subfolder.
    """
    folder = request.GET.get('folder', '')
    # Prevent path traversal
    if '..' in folder:
        return HttpResponseBadRequest('Invalid folder')

    path = ASSETS_DIR / folder
    if not path.exists() or not path.is_dir():
        return JsonResponse({'files': []})

    files = sorted(
        f for f in os.listdir(path)
        if f.lower().endswith(('.png', '.jpg', '.jpeg'))
    )
    return JsonResponse({'files': files})


@require_http_methods(['GET'])
def serve_asset(request):
    """
    GET /api/assets/file/?path=monsters/basic/goblin.png
    Serves the image file for preview in the editor.
    """
    file_path = request.GET.get('path', '')
    if '..' in file_path:
        return HttpResponseBadRequest('Invalid path')

    full_path = ASSETS_DIR / file_path
    if not full_path.exists() or not full_path.is_file():
        return HttpResponse(status=404)

    mime_type, _ = mimetypes.guess_type(str(full_path))
    with open(full_path, 'rb') as f:
        return HttpResponse(f.read(), content_type=mime_type or 'image/png')


@csrf_exempt
def editor_state(request):
    """
    GET  /api/state/?session=<uuid>  — return saved editor state (or null)
    POST /api/state/?session=<uuid>  — save editor state blob
    """
    session_key = request.GET.get('session', '')
    if not session_key:
        return HttpResponseBadRequest('Missing session key')

    if request.method == 'GET':
        try:
            snap = EditorSnapshot.objects.get(session_key=session_key)
            return JsonResponse({'state': snap.state})
        except EditorSnapshot.DoesNotExist:
            return JsonResponse({'state': None})

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return HttpResponseBadRequest('Invalid JSON')
        EditorSnapshot.objects.update_or_create(
            session_key=session_key,
            defaults={'state': data},
        )
        return JsonResponse({'status': 'ok'})

    return HttpResponse(status=405)


@csrf_exempt
@require_http_methods(['POST'])
def create_session(request):
    """
    POST /api/game/session/

    Called once when the player starts a run.
    Receives the run payload (built by the editor), creates a GameState,
    expands the starting deck into a flat shuffled list, and stores
    everything in _sessions under a new UUID.

    Returns: { session_id: string }
    The frontend stores this and sends it with every future game request.
    """
    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return HttpResponseBadRequest('Invalid JSON')

    # Create the game state — this holds the full run config (cards, enemies, acts)
    game = GameState(payload)

    # Expand startingDeck [{cardId, count}, ...] into a flat shuffled list of Card objects.
    # e.g. [{cardId: "strike", count: 5}] becomes 5 Card instances of Strike.
    deck = []
    for entry in payload.get('character', {}).get('startingDeck', []):
        card_data = payload.get('cardMap', {}).get(entry['cardId'])
        if card_data:
            for _ in range(entry.get('count', 1)):
                deck.append(Card(card_data))
    random.shuffle(deck)

    # Store the deck separately — it gets assigned to the player when
    # the first combat node is entered (see enter_node below).
    game._pending_deck = deck

    session_id = str(uuid.uuid4())
    _sessions[session_id] = game

    return JsonResponse({'session_id': session_id})


@csrf_exempt
@require_http_methods(['POST'])
def enter_node(request):
    """
    POST /api/game/node/
    Called when the player clicks a node on the map.

    Body: { session_id, node: { id, type, x, y, row, connections } }

    For battle/elite/boss nodes:
      - Picks a random enemy from the matching pool in the run config
      - Starts combat (creates player + monster, sets up combat engine)
      - Assigns the pending deck to the player and draws the opening hand
      - Returns the full combat state

    For rest/treasure/event nodes:
      - Updates position only (combat logic added later)
      - Returns a simple map state

    Returns: { state: { game_state, combat: { player, monster, hand, energy... } } }
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return HttpResponseBadRequest('Invalid JSON')

    session_id = data.get('session_id')
    node       = data.get('node')

    if not session_id or session_id not in _sessions:
        return HttpResponseBadRequest('Invalid or missing session_id')
    if not node:
        return HttpResponseBadRequest('Missing node')

    game      = _sessions[session_id]
    node_type = node.get('type')

    if node_type in ['battle', 'elite', 'boss']:
        # Map node type to the correct enemy pool key in the run config
        pool_key = {'battle': 'basics', 'elite': 'elites', 'boss': 'bosses'}.get(node_type, 'basics')
        pool     = game.run_config.get('acts', {}).get('1', {}).get(pool_key, [])

        if not pool:
            return HttpResponseBadRequest(f'No enemies in pool: {pool_key}')

        # Pick a random enemy from the pool and look up its full data
        enemy_id     = random.choice(pool)
        monster_data = game.run_config.get('enemyMap', {}).get(enemy_id)

        if not monster_data:
            return HttpResponseBadRequest('Enemy not found in enemyMap')

        # Start combat — internally creates the Player with an empty deck
        # and immediately tries to draw. Hand will be empty at this point.
        game.start_combat(player_data={}, monster_data=monster_data)

        # Restore HP carried over from the previous combat (if any).
        if hasattr(game, '_persistent_hp'):
            game.player.health = game._persistent_hp

        # Set up draw and discard piles for this combat.
        # Shuffle fresh every combat so reward cards don't always appear last.
        game.player.deck = list(game._pending_deck)
        random.shuffle(game.player.deck)
        game._discard    = []

        # Patch draw_card now that a fresh Player exists
        _patch_draw_card(game)

        # Draw opening hand of 5 cards using the patched method
        for _ in range(5):
            game.player.draw_card()

        # Include monster display info so the frontend knows the name,
        # image filename, and which subfolder the image lives in.
        monster_folder = {'basics': 'basic', 'elites': 'elite', 'bosses': 'boss'}.get(pool_key, 'basic')
        state = game.get_state()
        _inject_intent(game, state)
        return JsonResponse({
            'state': state,
            **_pile_data(game),
            'monster_info': {
                'id':        enemy_id,
                'name':      monster_data['identity']['name'],
                'imageUrl':  monster_data.get('imageUrl', ''),
                'folder':    monster_folder,
                'node_type': node_type,
            }
        })

    else:
        # Non-combat node — just update position for now
        game.game_state   = 'map'
        game.current_node = node

    return JsonResponse({'state': game.get_state()})


@csrf_exempt
@require_http_methods(['POST'])
def play_card(request):
    """
    POST /api/game/play-card/
    Plays a card from the player's hand by its index.

    Body: { session_id, card_index }

    Calls game.click_card(index) which spends energy and applies the card's
    effects (damage, block, heal, etc.) via the combat engine.
    Returns the updated game state and an outcome flag if the fight ended.
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return HttpResponseBadRequest('Invalid JSON')

    game = _sessions.get(data.get('session_id'))
    if not game:
        return HttpResponseBadRequest('Invalid session')

    card_index = data.get('card_index')

    # Capture the card object before the engine removes it from the hand
    hand = game.player.hand if game.player else []
    card_played = hand[card_index] if 0 <= card_index < len(hand) else None

    result = game.click_card(card_index)

    # On success, move the played card to the discard pile
    if result.get('success') and card_played is not None:
        game._discard.append(card_played)

    state = game.get_state()
    _inject_intent(game, state)
    outcome = _check_outcome(game)
    return JsonResponse({'result': result, 'state': state, 'outcome': outcome, **_pile_data(game)})


@csrf_exempt
@require_http_methods(['POST'])
def end_turn(request):
    """
    POST /api/game/end-turn/
    Ends the player's turn.

    Body: { session_id }

    Calls game.end_turn() which discards the hand, runs the enemy's next move,
    then starts the next player turn (draw 2 cards, restore energy).
    Returns the updated game state and an outcome flag if the fight ended.
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return HttpResponseBadRequest('Invalid JSON')

    game = _sessions.get(data.get('session_id'))
    if not game:
        return HttpResponseBadRequest('Invalid session')

    # Move remaining hand cards to discard before the turn ends.
    # This happens before end_turn() so the hand is empty when
    # start_player_turn() draws new cards for the next turn.
    if game.player:
        game._discard.extend(game.player.hand)
        game.player.hand = []

    result = game.end_turn()

    # start_player_turn() only draws 2 cards. Fill the hand up to max_hand_size (5).
    # draw_card() is patched with reshuffle logic so it handles an empty deck safely.
    if game.player:
        while len(game.player.hand) < game.player.max_hand_size:
            before = len(game.player.hand)
            game.player.draw_card()
            if len(game.player.hand) == before:
                break  # deck and discard both empty — stop trying

    state = game.get_state()
    _inject_intent(game, state)
    outcome = _check_outcome(game)
    return JsonResponse({'result': result, 'state': state, 'outcome': outcome, **_pile_data(game)})


def _patch_draw_card(game):
    """
    Replaces player.draw_card with a reshuffle-aware version.
    Exhausts remaining draw pile cards first, then shuffles discard back in
    before continuing — same behaviour as Slay the Spire.
    Must be called after start_combat creates a fresh Player instance.
    """
    player = game.player
    def draw_card():
        # Reshuffle only when the draw pile is completely empty
        if not player.deck and game._discard:
            new_deck = list(game._discard)
            random.shuffle(new_deck)
            player.deck = new_deck
            game._discard = []
        if player.deck and len(player.hand) < player.max_hand_size:
            player.hand.append(player.deck.pop(0))
    player.draw_card = draw_card


def _pile_data(game):
    """Returns serialized draw and discard piles for the frontend."""
    serialize = lambda cards: [c.to_dict() for c in cards if hasattr(c, 'to_dict')]
    return {
        'draw_count':   len(game.player.deck),
        'discard_count': len(game._discard),
        'draw_pile':    serialize(game.player.deck),
        'discard_pile': serialize(game._discard),
    }


def _inject_intent(game, state):
    """
    Adds the enemy's current move ID to the state dict.
    Peeks at the move index directly instead of calling get_enemy_move(),
    which has a side effect of incrementing the index on every call.
    """
    try:
        behavior = game.combat.monster.data.get('behavior', {})
        cycle    = behavior.get('cycleOrder', [])
        if cycle:
            move_id = cycle[game.combat.enemy_move_index % len(cycle)]
            state['combat']['monster']['intent'] = move_id
    except (AttributeError, KeyError, TypeError):
        pass
    return state


def _check_outcome(game):
    """
    Returns 'victory', 'defeat', or None based on current combat health.
    On victory, saves the player's remaining HP so it carries into the next fight.
    """
    if game.combat and game.combat.monster.health <= 0:
        game._persistent_hp = game.player.health
        return 'victory'
    if game.player and game.player.health <= 0:
        return 'defeat'
    return None


@csrf_exempt
@require_http_methods(['POST'])
def add_card_to_deck(request):
    """
    POST /api/game/add-card/

    Adds a card reward to the player's run deck after a combat victory.

    Body: { session_id, card_id }

    Looks up card_id in the run config's cardMap, wraps it in a Card object,
    and appends it to _pending_deck so it appears in all future combats.
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return HttpResponseBadRequest('Invalid JSON')

    session_id = data.get('session_id')
    card_id    = data.get('card_id')

    game = _sessions.get(session_id)
    if not game:
        return HttpResponseBadRequest('Invalid session')

    card_data = game.run_config.get('cardMap', {}).get(card_id)
    if not card_data:
        return HttpResponseBadRequest('Card not found in cardMap')

    game._pending_deck.append(Card(card_data))
    return JsonResponse({'status': 'ok', 'deck_size': len(game._pending_deck)})


@require_http_methods(['GET'])
def get_map(request):
    """
    GET /api/game/map/
    Calls generate_map() and returns the node graph as JSON.
    Each node has: id, type, x, y, row, connections (list of node ids).
    """
    graph = generate_map(seed=None)
    return JsonResponse(graph.to_dict())


@csrf_exempt
@require_http_methods(['POST'])
def start_run(request):
    """
    POST /api/start-run/
    Receives the run payload from the editor and writes run_config.json
    into the roguelite_map_generator directory for the viewer to read.
    """
    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return HttpResponseBadRequest('Invalid JSON')

    viewer_dir = ASSETS_DIR.parent
    config_path = viewer_dir / 'run_config.json'
    with open(config_path, 'w') as f:
        json.dump(payload, f, indent=2)

    # Launch the viewer as a detached subprocess (non-blocking)
    subprocess.Popen(['python3', 'main.py'], cwd=str(viewer_dir))

    return JsonResponse({'status': 'ok'})
