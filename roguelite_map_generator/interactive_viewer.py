import pygame
import os
from config import *
from PIL import Image

# ---------------- CLASS COLORS FOR DECKS ----------------
CLASS_COLORS = {
    "Red": (200, 50, 50),
    "Green": (60, 180, 90),
    "Blue": (80, 150, 255),
    "Purple": (180, 90, 200),
    "Gray": (180, 180, 180),
    "Dark": (60, 40, 60)
}

# ---------------- PLAYER CLASS ----------------
class Player:
    def __init__(self, sprite, deck_color, max_health=100):
        self.sprite = sprite
        self.deck_color = deck_color
        self.max_health = max_health
        self.health = max_health
        self.deck_logo = self.generate_deck_logo(deck_color)
        self.deck = []  # Full deck
        self.hand = []  # Cards in hand
        self.max_hand_size = 5

    def draw_health_bar(self, screen, x, y):
        bar_width = 120
        bar_height = 16
        health_ratio = self.health / self.max_health
        pygame.draw.rect(screen, (100, 100, 100), (x - bar_width//2, y, bar_width, bar_height))
        pygame.draw.rect(screen, (200, 50, 50), (x - bar_width//2, y, int(bar_width * health_ratio), bar_height))
        pygame.draw.rect(screen, (0, 0, 0), (x - bar_width//2, y, bar_width, bar_height), 2)

    def generate_deck_logo(self, color_name):
        size = (96, 96)
        surf = pygame.Surface(size, pygame.SRCALPHA)
        base_color = CLASS_COLORS.get(color_name, (200, 50, 50))
        for y in range(size[1]):
            ratio = y / size[1]
            r = int(base_color[0] * (0.5 + 0.5*ratio))
            g = int(base_color[1] * (0.5 + 0.5*ratio))
            b = int(base_color[2] * (0.5 + 0.5*ratio))
            pygame.draw.line(surf, (r, g, b), (0, y), (size[0], y))
        pygame.draw.rect(surf, (255, 255, 255), surf.get_rect(), 3)
        font = pygame.font.SysFont(None, 40, bold=True)
        letter = font.render(color_name[0], True, (255, 255, 255))
        lw, lh = letter.get_size()
        surf.blit(letter, ((size[0]-lw)//2, (size[1]-lh)//2))
        return surf

    def draw(self, screen, x, y):
        w, h = self.sprite.get_size()
        # Draw sprite
        screen.blit(self.sprite, (x - w//2, y - h//2))
        # Draw health bar above sprite
        self.draw_health_bar(screen, x, y - h//2 - 20)

    def draw_cards(self, screen, button_rect):
        slot_width, slot_height = 80, 120
        padding = 10
        max_hand_width = button_rect.x - 30
        hand_width = len(self.hand)*(slot_width+padding)-padding
        start_x = 30
        if hand_width > max_hand_width:
            start_x = button_rect.x - hand_width - 10
        y = MAP_HEIGHT - slot_height - 20

        for i, card in enumerate(self.hand):
            rect = pygame.Rect(start_x + i*(slot_width+padding), y, slot_width, slot_height)
            pygame.draw.rect(screen, (50, 50, 50), rect)
            pygame.draw.rect(screen, (200, 200, 200), rect, 2)
            if hasattr(card, "image") and card.image:
                img = pygame.transform.smoothscale(card.image, (slot_width-4, slot_height-4))
                screen.blit(img, (rect.x+2, rect.y+2))

    def draw_card_from_deck(self):
        if self.deck and len(self.hand) < self.max_hand_size:
            card = self.deck.pop(0)
            self.hand.append(card)

    def start_combat(self):
        # Example deck: 10 dummy cards
        class DummyCard:
            def __init__(self, name): self.name=name; self.image=None
        self.deck = [DummyCard(f"Card {i+1}") for i in range(10)]
        self.hand = []
        for _ in range(min(5, len(self.deck))):
            self.draw_card_from_deck()

# ---------------- INTERACTIVE MAP ----------------
def run_interactive(graph, icons):
    pygame.init()
    screen = pygame.display.set_mode((MAP_WIDTH, MAP_HEIGHT))
    pygame.display.set_caption("Roguelite Map Progression")
    clock = pygame.time.Clock()

    font_large = pygame.font.SysFont(None, 48)
    font_small = pygame.font.SysFont(None, 32)

    # Load background
    parchment = pygame.image.load(PARCHMENT_PATH).convert_alpha()
    parchment = pygame.transform.smoothscale(parchment, (MAP_WIDTH, MAP_HEIGHT))

    # Scene backgrounds
    scene_backgrounds = {}
    for node_type in ["battle", "rest", "treasure", "elite", "boss"]:
        path = os.path.join(SCENES_DIR, f"{node_type}.png")
        if os.path.exists(path):
            img = pygame.image.load(path).convert_alpha()
            img = pygame.transform.smoothscale(img, (MAP_WIDTH, MAP_HEIGHT))
            scene_backgrounds[node_type] = img
        else:
            surface = pygame.Surface((MAP_WIDTH, MAP_HEIGHT))
            surface.fill((30, 20, 10))
            scene_backgrounds[node_type] = surface
    scene_backgrounds["event"] = scene_backgrounds.get("treasure")

    # Load player sprites
    PLAYER_SPRITES_DIR = os.path.join("assets", "playable_characters")
    player_sprites = {
        "male": pygame.image.load(os.path.join(PLAYER_SPRITES_DIR, "male.png")).convert_alpha(),
        "female": pygame.image.load(os.path.join(PLAYER_SPRITES_DIR, "female.png")).convert_alpha()
    }
    for key in player_sprites:
        player_sprites[key] = pygame.transform.smoothscale(player_sprites[key], (400, 400))

    # Gender selection
    selected_gender = None
    selecting = True
    while selecting:
        screen.fill((20, 20, 20))
        msg = font_large.render("Choose Gender: M = Male, F = Female", True, (255, 255, 255))
        screen.blit(msg, (MAP_WIDTH//2 - msg.get_width()//2, MAP_HEIGHT//2 - msg.get_height()//2))
        pygame.display.flip()
        for event in pygame.event.get():
            if event.type == pygame.QUIT: pygame.quit(); exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_m: selected_gender = "male"; selecting = False
                elif event.key == pygame.K_f: selected_gender = "female"; selecting = False

    # Deck color selection
    selected_color = None
    selecting_color = True
    while selecting_color:
        screen.fill((20, 20, 20))
        msg = font_large.render("Choose Deck Color: R/G/B/P/Gray/D", True, (255, 255, 255))
        screen.blit(msg, (MAP_WIDTH//2 - msg.get_width()//2, MAP_HEIGHT//2 - msg.get_height()//2))
        pygame.display.flip()
        for event in pygame.event.get():
            if event.type == pygame.QUIT: pygame.quit(); exit()
            if event.type == pygame.KEYDOWN:
                keymap = {pygame.K_r:"Red", pygame.K_g:"Green", pygame.K_b:"Blue",
                          pygame.K_p:"Purple", pygame.K_d:"Dark", pygame.K_e:"Gray"}
                if event.key in keymap: selected_color = keymap[event.key]; selecting_color = False

    # Create player
    player = Player(player_sprites[selected_gender], selected_color)

    current_node = next(n for n in graph.nodes.values() if n.type=="start")
    game_state = "map"
    active_scene_node = None

    # ---------------- Next Button ----------------
    deck_width, deck_height = player.deck_logo.get_size()
    button_width, button_height = 220, 70
    button_rect = pygame.Rect(MAP_WIDTH - deck_width - button_width - 40, MAP_HEIGHT - 100, button_width, button_height)
    game_over_timer = None

    while True:
        clock.tick(60)
        for event in pygame.event.get():
            if event.type == pygame.QUIT: pygame.quit(); exit()
            if event.type == pygame.MOUSEBUTTONDOWN:
                mx, my = pygame.mouse.get_pos()

                if game_state=="map":
                    for nid in current_node.connections:
                        node = graph.nodes[nid]
                        if node.is_clicked(mx, my, NODE_RADIUS):
                            current_node = node
                            active_scene_node = node
                            if node.type in ["battle","elite","boss"]:
                                player.start_combat()
                                game_state="scene"
                            elif node.type!="start":
                                game_state="scene"
                            break

                elif game_state=="scene":
                    # Handle card clicks
                    slot_width, slot_height = 80, 120
                    padding = 10
                    max_hand_width = button_rect.x - 30
                    hand_width = len(player.hand)*(slot_width+padding)-padding
                    start_x = 30
                    if hand_width > max_hand_width:
                        start_x = button_rect.x - hand_width - 10
                    y = MAP_HEIGHT - slot_height - 20

                    clicked_hand = False
                    for i in range(len(player.hand)):
                        rect = pygame.Rect(start_x + i*(slot_width+padding), y, slot_width, slot_height)
                        if rect.collidepoint(mx,my):
                            player.hand.pop(i)
                            clicked_hand = True
                            break

                    if not clicked_hand and len(player.hand) < player.max_hand_size:
                        player.draw_card_from_deck()

                    if button_rect.collidepoint(mx,my):
                        if active_scene_node.type=="boss":
                            game_state="game_over"
                            game_over_timer = None
                        else:
                            game_state="map"

            if game_state=="game_over" and game_over_timer is not None:
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_r:
                        return run_interactive(graph, icons)
                    elif event.key == pygame.K_q:
                        pygame.quit(); exit()

        # ---------------- DRAW ----------------
        if game_state=="map":
            screen.blit(parchment,(0,0))
            visible_rows=[current_node.row,current_node.row+1]
            for node in graph.nodes.values():
                if node.row not in visible_rows: continue
                for tid in node.connections:
                    target = graph.nodes[tid]
                    if target.row in visible_rows:
                        pygame.draw.line(screen, LINE_COLOR, (node.x,node.y), (target.x,target.y), LINE_WIDTH)
            for node in graph.nodes.values():
                if node.row not in visible_rows: continue
                icon = icons[node.type]
                w,h = icon.get_size()
                screen.blit(icon, (node.x-w//2,node.y-h//2))

        elif game_state=="scene":
            bg = scene_backgrounds.get(active_scene_node.type)
            screen.blit(bg, (0,0))

            if active_scene_node.type in ["battle","elite","boss"]:
                player_x = MAP_WIDTH//3
                player_y = MAP_HEIGHT - 350
                player.draw(screen, player_x, player_y)
                player.draw_cards(screen, button_rect)
                lw, lh = player.deck_logo.get_size()
                screen.blit(player.deck_logo, (MAP_WIDTH-lw-20, MAP_HEIGHT-lh-20))

            title = font_large.render(f"{active_scene_node.type.upper()} NODE", True, (230,210,170))
            screen.blit(title, (MAP_WIDTH//2 - title.get_width()//2, 150))
            desc = font_small.render("Scene placeholder content", True, (220,200,160))
            screen.blit(desc, (MAP_WIDTH//2 - desc.get_width()//2, 240))

            pygame.draw.rect(screen,(110,80,40), button_rect)
            pygame.draw.rect(screen,(220,190,140), button_rect,3)
            btn_text = font_small.render("Next", True, (255,240,200))
            screen.blit(btn_text, (button_rect.x + (button_rect.width-btn_text.get_width())//2,
                                   button_rect.y + (button_rect.height-btn_text.get_height())//2))

        elif game_state=="game_over":
            if game_over_timer is None:
                game_over_timer = pygame.time.get_ticks()
            screen.fill((10,10,10))
            msg = font_large.render("YOU BEAT THE BOSS!", True, (255,215,0))
            screen.blit(msg, (MAP_WIDTH//2 - msg.get_width()//2, MAP_HEIGHT//2 - msg.get_height()//2))
            elapsed = (pygame.time.get_ticks() - game_over_timer)/1000
            if elapsed > 15:
                prompt = font_small.render("Press R to Restart or Q to Quit", True, (255,255,255))
                screen.blit(prompt, (MAP_WIDTH//2 - prompt.get_width()//2, MAP_HEIGHT//2 + 50))

        pygame.display.flip()