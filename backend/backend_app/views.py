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
        self.id      = data.get('id', '')
        self.name    = data.get('name', '')
        self.cost    = data.get('cost', 0)
        self.type    = data.get('type', 'Attack')
        self.rarity  = data.get('rarity', 'Common')
        self.effects = data.get('effects', [])


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

        # Assign the real deck we built at session creation and draw opening hand
        game.player.deck = list(game._pending_deck)
        for _ in range(5):
            game.player.draw_card()

        # Include monster display info so the frontend knows the name,
        # image filename, and which subfolder the image lives in.
        monster_folder = {'basics': 'basic', 'elites': 'elite', 'bosses': 'boss'}.get(pool_key, 'basic')
        return JsonResponse({
            'state': game.get_state(),
            'monster_info': {
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


@require_http_methods(['GET'])
def get_map(request):
    """
    GET /api/game/map/
    Calls Kyle's generate_map() and returns the node graph as JSON.
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
    into the roguelite_map_generator directory for Kyle's viewer to read.
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
