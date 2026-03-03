import pygame
import os
import random
from config import *

# ---------------- CONFIG ----------------
CLASS_COLORS = {
    "Red": (200, 50, 50),
    "Green": (60, 180, 90),
    "Blue": (80, 150, 255),
    "Purple": (180, 90, 200),
    "Gray": (180, 180, 180),
    "Dark": (60, 40, 60)
}

UI_PANEL_HEIGHT = 220
FADE_DURATION = 300  # milliseconds

# ---------------- PLAYER ----------------
class Player:
    def __init__(self, sprite, deck_color, max_health=100):
        self.sprite = sprite
        self.deck_color = deck_color
        self.max_health = max_health
        self.health = max_health
        self.deck_logo = self.generate_deck_logo(deck_color)
        self.deck = []
        self.hand = []
        self.max_hand_size = 5

    def generate_deck_logo(self, color_name):
        size = (96, 96)
        surf = pygame.Surface(size, pygame.SRCALPHA)
        base = CLASS_COLORS.get(color_name, (200, 50, 50))
        for y in range(size[1]):
            ratio = y / size[1]
            r = int(base[0] * (0.5 + 0.5 * ratio))
            g = int(base[1] * (0.5 + 0.5 * ratio))
            b = int(base[2] * (0.5 + 0.5 * ratio))
            pygame.draw.line(surf, (r, g, b), (0, y), (size[0], y))
        pygame.draw.rect(surf, (255, 255, 255), surf.get_rect(), 3)
        font = pygame.font.SysFont(None, 40, bold=True)
        letter = font.render(color_name[0], True, (255, 255, 255))
        lw, lh = letter.get_size()
        surf.blit(letter, ((size[0]-lw)//2, (size[1]-lh)//2))
        return surf

    def draw(self, screen, x, y):
        w, h = self.sprite.get_size()
        screen.blit(self.sprite, (x - w//2, y - h//2))
        self.draw_health_bar(screen, x, y - h//2 - 20)

    def draw_health_bar(self, screen, x, y):
        bar_w, bar_h = 140, 18
        ratio = self.health / self.max_health
        pygame.draw.rect(screen, (80,80,80), (x-bar_w//2, y, bar_w, bar_h))
        pygame.draw.rect(screen, (200,50,50), (x-bar_w//2, y, int(bar_w*ratio), bar_h))
        pygame.draw.rect(screen, (0,0,0), (x-bar_w//2, y, bar_w, bar_h), 2)

    def start_combat(self):
        class DummyCard:
            def __init__(self, name):
                self.name = name
                self.image = None
        self.deck = [DummyCard(f"Card {i+1}") for i in range(10)]
        self.hand = []
        for _ in range(min(self.max_hand_size, len(self.deck))):
            self.draw_card()

    def draw_card(self):
        if self.deck and len(self.hand) < self.max_hand_size:
            self.hand.append(self.deck.pop(0))

    def draw_cards(self, screen, deck_rect):
        slot_w, slot_h = 80, 120
        padding = 10
        hand_width = len(self.hand)*(slot_w+padding)-padding
        start_x = deck_rect.x - hand_width - 10 if hand_width > deck_rect.x else 30
        y = deck_rect.y  # Cards level with deck logo inside UI panel
        for i, card in enumerate(self.hand):
            r = pygame.Rect(start_x + i*(slot_w+padding), y, slot_w, slot_h)
            pygame.draw.rect(screen, (50,50,50), r)
            pygame.draw.rect(screen, (200,200,200), r, 2)
            if hasattr(card, "image") and card.image:
                img = pygame.transform.smoothscale(card.image,(slot_w-4, slot_h-4))
                screen.blit(img,(r.x+2, r.y+2))

# ---------------- MONSTER ----------------
class Monster:
    def __init__(self, sprite, max_health=50):
        self.sprite = sprite
        self.max_health = max_health
        self.health = max_health

    def draw(self, screen, x, y):
        w,h = self.sprite.get_size()
        screen.blit(self.sprite,(x-w//2, y-h//2))
        self.draw_health_bar(screen, x, y - h//2 - 20)

    def draw_health_bar(self, screen, x, y):
        bar_w, bar_h = 140, 18
        ratio = self.health/self.max_health
        pygame.draw.rect(screen,(80,80,80),(x-bar_w//2,y,bar_w,bar_h))
        pygame.draw.rect(screen,(50,200,50),(x-bar_w//2,y,int(bar_w*ratio),bar_h))
        pygame.draw.rect(screen,(0,0,0),(x-bar_w//2,y,bar_w,bar_h),2)

# ---------------- SCENE & MONSTER LOADER ----------------
def preload_scene_backgrounds():
    folder_map = {"battle":"battle","elite":"battle","boss":"battle","rest":"rest","treasure":"treasure","event":"treasure"}
    scenes = {}
    for node_type, folder in folder_map.items():
        scenes[node_type]=[]
        path = os.path.join(SCENES_DIR, folder)
        if not os.path.exists(path): continue
        for f in os.listdir(path):
            if f.lower().endswith((".png",".jpg",".jpeg")):
                img = pygame.image.load(os.path.join(path,f)).convert_alpha()
                img = pygame.transform.smoothscale(img,(MAP_WIDTH,MAP_HEIGHT-UI_PANEL_HEIGHT))
                scenes[node_type].append(img)
    return scenes

def load_monsters():
    monster_dir = os.path.join("assets","monsters")
    monster_types = ["basic","elite","boss"]
    monster_dict = {t:[] for t in monster_types}
    for t in monster_types:
        path = os.path.join(monster_dir,t)
        if not os.path.exists(path): continue
        for f in os.listdir(path):
            if f.lower().endswith((".png",".jpg",".jpeg")):
                img = pygame.image.load(os.path.join(path,f)).convert_alpha()
                img = pygame.transform.smoothscale(img,(300,300))
                monster_dict[t].append(img)
    return monster_dict

# ---------------- INTERACTIVE ----------------
def run_interactive(graph, icons):
    pygame.init()
    screen = pygame.display.set_mode((MAP_WIDTH, MAP_HEIGHT))
    pygame.display.set_caption("Roguelite Map Progression")
    clock = pygame.time.Clock()
    font_small = pygame.font.SysFont(None,32)
    font_large = pygame.font.SysFont(None,48)

    parchment = pygame.image.load(PARCHMENT_PATH).convert_alpha()
    parchment = pygame.transform.smoothscale(parchment,(MAP_WIDTH,MAP_HEIGHT))

    scene_backgrounds = preload_scene_backgrounds()
    monsters = load_monsters()

    active_scene_node = None
    active_scene_background = None
    active_monster = None

    # -------- PLAYER DROP-DOWN --------
    PLAYER_DIR = os.path.join("assets","playable_characters")
    players = [f for f in os.listdir(PLAYER_DIR) if f.lower().endswith(".png")]
    selected_player = None
    selecting = True
    while selecting:
        screen.fill((20,20,20))
        title = font_large.render("Choose Character:", True, (255,255,255))
        screen.blit(title,(MAP_WIDTH//2-title.get_width()//2,100))
        mouse_x, mouse_y = pygame.mouse.get_pos()
        start_y = 200
        hover_idx = -1
        for i,fname in enumerate(players):
            y = start_y + i*60
            r = pygame.Rect(200,y,MAP_WIDTH-400,50)
            col = (180,180,50) if r.collidepoint(mouse_x,mouse_y) else (120,120,120)
            pygame.draw.rect(screen,col,r)
            pygame.draw.rect(screen,(255,255,255),r,2)
            t = font_small.render(fname.replace(".png",""),True,(255,255,255))
            screen.blit(t,(r.x+10,r.y+(50-t.get_height())//2))
            if r.collidepoint(mouse_x,mouse_y): hover_idx=i
        pygame.display.flip()
        for e in pygame.event.get():
            if e.type==pygame.QUIT: pygame.quit(); exit()
            if e.type==pygame.MOUSEBUTTONDOWN and hover_idx!=-1:
                selected_player = players[hover_idx]
                selecting=False

    sprite_path = os.path.join(PLAYER_DIR,selected_player)
    sprite = pygame.image.load(sprite_path).convert_alpha()
    sprite = pygame.transform.smoothscale(sprite,(300,300))
    player = Player(sprite,"Red")

    # -------- DECK COLOR DROP-DOWN --------
    deck_colors = ["Red","Green","Blue","Purple","Gray","Dark"]
    selected_color = None
    selecting_color = True
    while selecting_color:
        screen.fill((20,20,20))
        title = font_large.render("Choose Deck Color:", True, (255,255,255))
        screen.blit(title,(MAP_WIDTH//2-title.get_width()//2,100))
        mouse_x, mouse_y = pygame.mouse.get_pos()
        hover_idx=-1
        for i,color in enumerate(deck_colors):
            y = 200+i*60
            r = pygame.Rect(200,y,MAP_WIDTH-400,50)
            col = CLASS_COLORS[color]
            draw_col = (min(255,col[0]+60),min(255,col[1]+60),min(255,col[2]+60)) if r.collidepoint(mouse_x,mouse_y) else col
            pygame.draw.rect(screen,draw_col,r)
            pygame.draw.rect(screen,(255,255,255),r,2)
            t = font_small.render(color,True,(255,255,255))
            screen.blit(t,(r.x+10,r.y+(50-t.get_height())//2))
            if r.collidepoint(mouse_x,mouse_y): hover_idx=i
        pygame.display.flip()
        for e in pygame.event.get():
            if e.type==pygame.QUIT: pygame.quit(); exit()
            if e.type==pygame.MOUSEBUTTONDOWN and hover_idx!=-1:
                selected_color = deck_colors[hover_idx]
                selecting_color=False

    player.deck_color = selected_color
    player.deck_logo = player.generate_deck_logo(selected_color)

    # -------- GAME STATE INIT --------
    current_node = next(n for n in graph.nodes.values() if n.type=="start")
    game_state = "map"
    fade_alpha = 0
    fade_direction = None
    fade_start_time = 0
    next_state = None

    ui_rect = pygame.Rect(0,MAP_HEIGHT-UI_PANEL_HEIGHT,MAP_WIDTH,UI_PANEL_HEIGHT)
    deck_rect = pygame.Rect(MAP_WIDTH-120,MAP_HEIGHT-UI_PANEL_HEIGHT+40,96,96)
    next_button = pygame.Rect(deck_rect.x-160,MAP_HEIGHT-UI_PANEL_HEIGHT+65,140,50)

    while True:
        clock.tick(60)
        for e in pygame.event.get():
            if e.type==pygame.QUIT: pygame.quit(); exit()
            if e.type==pygame.MOUSEBUTTONDOWN and not fade_direction:
                mx,my = pygame.mouse.get_pos()
                if game_state=="map":
                    for nid in current_node.connections:
                        node = graph.nodes[nid]
                        if node.is_clicked(mx,my,NODE_RADIUS):
                            current_node=node
                            active_scene_node=node
                            if node.type in ["battle","elite","boss"]:
                                player.start_combat()
                                # Monster spawn only for battle/elite/boss
                                monster_type_map = {"battle": "basic","elite":"elite","boss":"boss"}
                                pool = monsters.get(monster_type_map[node.type],[])
                                active_monster = Monster(
                                    random.choice(pool),
                                    max_health=50 if node.type=="battle" else 120 if node.type=="elite" else 200
                                ) if pool else None
                                # Scene background
                                pool = scene_backgrounds.get(node.type,[])
                                active_scene_background = random.choice(pool) if pool else None
                                fade_direction="out"
                                fade_start_time=pygame.time.get_ticks()
                                next_state="scene"
                            else:
                                active_monster = None
                                pool = scene_backgrounds.get(node.type,[])
                                active_scene_background = random.choice(pool) if pool else None
                                fade_direction="out"
                                fade_start_time=pygame.time.get_ticks()
                                next_state="scene"
                            break
                elif game_state=="scene":
                    # Deck click
                    if deck_rect.collidepoint(mx,my):
                        player.draw_card()
                    else:
                        # Hand click
                        slot_w, slot_h = 80, 120
                        padding = 10
                        hand_width = len(player.hand)*(slot_w+padding)-padding
                        start_x = deck_rect.x - hand_width - 10 if hand_width > deck_rect.x else 30
                        y = deck_rect.y  # level with deck
                        for i, card in enumerate(player.hand):
                            rect = pygame.Rect(start_x + i*(slot_w+padding), y, slot_w, slot_h)
                            if rect.collidepoint(mx, my):
                                player.hand.pop(i)
                                break
                    # Next button
                    if next_button.collidepoint(mx,my):
                        fade_direction="out"
                        fade_start_time=pygame.time.get_ticks()
                        next_state="map"

        # ---------------- DRAW ----------------
        screen.fill((0,0,0))
        if game_state=="map":
            screen.blit(parchment,(0,0))
            visible_nodes = [current_node]+[graph.nodes[nid] for nid in current_node.connections]
            for node in visible_nodes:
                for tid in node.connections:
                    if graph.nodes[tid] in visible_nodes:
                        pygame.draw.line(screen, LINE_COLOR,(node.x,node.y),(graph.nodes[tid].x,graph.nodes[tid].y),LINE_WIDTH)
            for node in visible_nodes:
                icon = icons[node.type]
                w,h = icon.get_size()
                screen.blit(icon,(node.x-w//2,node.y-h//2))

        elif game_state=="scene":
            if active_scene_background: screen.blit(active_scene_background,(0,0))
            pygame.draw.rect(screen,(50,30,10),ui_rect)
            player_y = MAP_HEIGHT - UI_PANEL_HEIGHT - 150
            monster_y = player_y
            player.draw(screen, MAP_WIDTH//3, player_y)
            if active_monster:
                active_monster.draw(screen, MAP_WIDTH*2//3, monster_y)
            player.draw_cards(screen, deck_rect)
            screen.blit(player.deck_logo,(deck_rect.x, deck_rect.y))

            # Draw remaining cards count under deck
            deck_count_text = font_small.render(f"{len(player.deck)}", True, (255,255,255))
            text_x = deck_rect.x + (deck_rect.width - deck_count_text.get_width())//2
            text_y = deck_rect.y + deck_rect.height + 5
            screen.blit(deck_count_text, (text_x, text_y))

            pygame.draw.rect(screen,(110,80,40),next_button)
            pygame.draw.rect(screen,(220,190,140),next_button,3)
            t = font_small.render("Next",True,(255,255,255))
            screen.blit(t,(next_button.x+(next_button.width-t.get_width())//2,
                           next_button.y+(next_button.height-t.get_height())//2))

        # ---------------- FADE ----------------
        if fade_direction:
            elapsed = pygame.time.get_ticks()-fade_start_time
            alpha = int(255*elapsed/FADE_DURATION)
            if fade_direction=="out": fade_alpha=alpha
            if fade_alpha>=255:
                game_state = next_state
                fade_direction="in"
                fade_start_time=pygame.time.get_ticks()
                fade_alpha=255
            if fade_direction=="in":
                fade_alpha=255-alpha
                if fade_alpha<=0:
                    fade_direction=None
                    fade_alpha=0
            fade_surf = pygame.Surface((MAP_WIDTH,MAP_HEIGHT))
            fade_surf.set_alpha(fade_alpha)
            fade_surf.fill((0,0,0))
            screen.blit(fade_surf,(0,0))

        pygame.display.flip()