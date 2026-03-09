import pygame
import os
import random
import json
from config import *

# ---------------- RUN CONFIG ----------------
def load_run_config(path="run_config.json"):
    with open(path, "r") as f:
        return json.load(f)

# ---------------- CONFIG ----------------
CLASS_COLORS = {
    "Red": (200, 50, 50),
    "Green": (60, 180, 90),
    "Blue": (80, 150, 255),
    "Purple": (180, 90, 200),
    "Gray": (180, 180, 180),
    "Dark": (60, 40, 60)
}

UI_PANEL_HEIGHT = 250
FADE_DURATION = 300
CARD_WIDTH = 160
CARD_HEIGHT = 220

# ---------------- CARD ----------------
class Card:
    def __init__(self, card_data):
        self.id = card_data["id"]
        self.name = card_data["name"]
        self.type = card_data["type"]
        self.rarity = card_data["rarity"]
        self.cost = card_data["cost"]
        self.effects = card_data.get("effects", [])
        self.image = None

        # Load image from assets/playable_cards or your chosen folder
        image_url = card_data.get("imageUrl")
        if image_url:

            path = os.path.join("assets", "cards", image_url)  # <- change "cards" to match your folder
            if os.path.exists(path):
                try:
                    self.image = pygame.image.load(path).convert_alpha()
                except Exception as e:
                    print(f"Failed to load card image {path}: {e}")
                    self.image = None
            else:
                print(f"Card image not found: {path}")

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
        base = CLASS_COLORS.get(color_name, (200,50,50))
        for y in range(size[1]):
            ratio = y / size[1]
            r = int(base[0]*(0.5+0.5*ratio))
            g = int(base[1]*(0.5+0.5*ratio))
            b = int(base[2]*(0.5+0.5*ratio))
            pygame.draw.line(surf,(r,g,b),(0,y),(size[0],y))
        pygame.draw.rect(surf,(255,255,255),surf.get_rect(),3)
        font = pygame.font.SysFont(None,40,bold=True)
        letter = font.render(color_name[0],True,(255,255,255))
        lw, lh = letter.get_size()
        surf.blit(letter,((size[0]-lw)//2,(size[1]-lh)//2))
        return surf

    def draw(self, screen, x, y):
        w,h = self.sprite.get_size()
        screen.blit(self.sprite,(x-w//2,y-h//2))
        self.draw_health_bar(screen,x,y-h//2-20)

    def draw_health_bar(self, screen, x, y):
        bar_w, bar_h = 140,18
        ratio = self.health/self.max_health
        pygame.draw.rect(screen,(80,80,80),(x-bar_w//2,y,bar_w,bar_h))
        pygame.draw.rect(screen,(200,50,50),(x-bar_w//2,y,int(bar_w*ratio),bar_h))
        pygame.draw.rect(screen,(0,0,0),(x-bar_w//2,y,bar_w,bar_h),2)

    def start_combat(self, run_config):
        self.deck = []
        self.hand = []

        card_map = run_config["cardMap"]
        starting_deck = run_config["character"]["startingDeck"]

        for entry in starting_deck:
            card_id = entry["cardId"]
            count = entry["count"]
            if card_id in card_map:
                for _ in range(count):
                    self.deck.append(Card(card_map[card_id]))

        while len(self.deck) < 10:
            card_id = random.choice(run_config["cardPool"])
            self.deck.append(Card(card_map[card_id]))

        random.shuffle(self.deck)

        for _ in range(min(self.max_hand_size,len(self.deck))):
            self.draw_card()

    def draw_card(self):
        if self.deck and len(self.hand) < self.max_hand_size:
            self.hand.append(self.deck.pop(0))

    def draw_cards(self, screen, rect, next_button_rect=None):
        padding = 12
        card_count = len(self.hand)
        max_hand_width = rect.width - 220
        slot_w = min(CARD_WIDTH, (max_hand_width - (card_count - 1) * padding) // max(1, card_count))
        slot_h = CARD_HEIGHT
        # start X shifted right to avoid deck button
        start_x = rect.x + 140
        y = rect.y + 20

        font_small = pygame.font.SysFont(None, 22)
        font_medium = pygame.font.SysFont(None, 26, bold=True)

        for i, card in enumerate(self.hand):
            r = pygame.Rect(start_x + i * (slot_w + padding), y, slot_w, slot_h)
            pygame.draw.rect(screen, (50, 50, 50), r)
            pygame.draw.rect(screen, (200, 200, 200), r, 2)

            # cost circle
            pygame.draw.circle(screen, (255, 255, 0), (r.x + 18, r.y + 18), 16)
            cost_text = font_small.render(str(card.cost), True, (0, 0, 0))
            screen.blit(cost_text, (r.x + 12, r.y + 10))

            # name
            name_text = font_medium.render(card.name, True, (255, 255, 255))
            screen.blit(name_text, (r.x + 40, r.y + 2))

            # image
            img_height = slot_h - 130
            img_width = slot_w - 12
            if card.image:
                img = pygame.transform.smoothscale(card.image, (img_width, img_height))
                screen.blit(img, (r.x + 4, r.y + 40))

            # type + rarity
            type_y = r.y + 40 + img_height + 4
            type_text = font_small.render(f"{card.type} | {card.rarity}", True, (200, 200, 0))
            screen.blit(type_text, (r.x + 4, type_y))
            pygame.draw.line(screen, (255, 255, 255), (r.x + 2, type_y + 18), (r.x + slot_w - 2, type_y + 18))

            # effects
            for ei, eff in enumerate(card.effects):
                eff_text = font_small.render(f"{eff['effectType']} {eff.get('baseValue', '')}", True, (180, 255, 180))
                screen.blit(eff_text, (r.x + 4, type_y + 22 + ei * 18))

# ---------------- MONSTER ----------------
class Monster:
    def __init__(self, sprite, max_health=50):
        self.sprite = sprite
        self.max_health = max_health
        self.health = max_health

    def draw(self, screen, x, y):
        w,h = self.sprite.get_size()
        screen.blit(self.sprite,(x-w//2,y-h//2))
        self.draw_health_bar(screen,x,y-h//2-20)

    def draw_health_bar(self, screen, x, y):
        bar_w, bar_h = 140,18
        ratio = self.health/self.max_health
        pygame.draw.rect(screen,(80,80,80),(x-bar_w//2,y,bar_w,bar_h))
        pygame.draw.rect(screen,(50,200,50),(x-bar_w//2,y,int(bar_w*ratio),bar_h))
        pygame.draw.rect(screen,(0,0,0),(x-bar_w//2,y,bar_w,bar_h),2)

# ---------------- SCENE LOADER ----------------
def preload_scene_backgrounds():
    folder_map = {"battle":"battle","elite":"battle","boss":"battle","rest":"rest","treasure":"treasure","event":"treasure"}
    scenes = {}
    for node_type, folder in folder_map.items():
        scenes[node_type] = []
        path = os.path.join(SCENES_DIR, folder)
        if not os.path.exists(path):
            continue
        for f in os.listdir(path):
            if f.lower().endswith((".png",".jpg",".jpeg")):
                img = pygame.image.load(os.path.join(path,f)).convert_alpha()
                img = pygame.transform.smoothscale(img,(MAP_WIDTH,MAP_HEIGHT-UI_PANEL_HEIGHT))
                scenes[node_type].append(img)
    return scenes

# ---------------- MONSTERS ----------------
def load_monsters():
    monster_dir = os.path.join("assets","monsters")
    monster_types = ["basic","elite","boss"]
    monster_dict = {t:[] for t in monster_types}
    for t in monster_types:
        path = os.path.join(monster_dir,t)
        if not os.path.exists(path):
            continue
        for f in os.listdir(path):
            if f.lower().endswith((".png",".jpg",".jpeg")):
                img = pygame.image.load(os.path.join(path,f)).convert_alpha()
                img = pygame.transform.smoothscale(img,(300,300))
                monster_dict[t].append(img)
    return monster_dict

# ---------------- INTERACTIVE ----------------
def run_interactive(graph, icons):
    pygame.init()
    run_config = load_run_config()
    project_name = run_config.get("projectName","Roguelite Viewer")

    screen = pygame.display.set_mode((MAP_WIDTH,MAP_HEIGHT))
    pygame.display.set_caption(project_name)
    clock = pygame.time.Clock()

    # load parchment for map
    parchment_path = os.path.join(ICONS_DIR, "parchment.png")
    if os.path.exists(parchment_path):
        parchment = pygame.image.load(parchment_path).convert_alpha()
        parchment = pygame.transform.smoothscale(parchment,(MAP_WIDTH,MAP_HEIGHT))
    else:
        print("Warning: parchment.png not found in icons folder")
        parchment = pygame.Surface((MAP_WIDTH,MAP_HEIGHT))
        parchment.fill((30,30,30))

    scene_backgrounds = preload_scene_backgrounds()
    monsters = load_monsters()

    PLAYER_DIR = os.path.join("assets","playable_characters")
    json_image = run_config["character"].get("imageUrl")
    sprite_path = os.path.join(PLAYER_DIR,json_image)
    sprite = pygame.image.load(sprite_path).convert_alpha()
    sprite = pygame.transform.smoothscale(sprite,(300,300))
    player = Player(sprite,"Red")

    player.deck_logo = player.generate_deck_logo("Red")

    # UI rects
    ui_rect = pygame.Rect(0, MAP_HEIGHT-UI_PANEL_HEIGHT, MAP_WIDTH, UI_PANEL_HEIGHT)
    hand_start_rect = pygame.Rect(0, MAP_HEIGHT-UI_PANEL_HEIGHT, MAP_WIDTH, UI_PANEL_HEIGHT)
    deck_rect = pygame.Rect(20, MAP_HEIGHT-UI_PANEL_HEIGHT+30, 96, 96)
    next_button = pygame.Rect(MAP_WIDTH-160, MAP_HEIGHT-UI_PANEL_HEIGHT+50, 140, 50)

    current_node = next(n for n in graph.nodes.values() if n.type=="start")
    game_state = "map"
    fade_alpha = 0
    fade_direction = None
    fade_start_time = 0
    next_state = None
    active_scene_node = None
    active_scene_background = None
    active_monster = None

    while True:
        clock.tick(60)
        for e in pygame.event.get():
            if e.type==pygame.QUIT:
                pygame.quit()
                exit()
            if e.type==pygame.MOUSEBUTTONDOWN and not fade_direction:
                mx,my = pygame.mouse.get_pos()
                if game_state=="map":
                    for nid in current_node.connections:
                        node = graph.nodes[nid]
                        if node.is_clicked(mx,my,NODE_RADIUS):
                            current_node=node
                            active_scene_node=node
                            if node.type in ["battle","elite","boss"]:
                                player.start_combat(run_config)
                                act = run_config["acts"]["1"]
                                enemy_list = []
                                if node.type=="battle":
                                    enemy_list = act["basics"]
                                elif node.type=="elite":
                                    enemy_list = act["elites"]
                                elif node.type=="boss":
                                    enemy_list = act["bosses"]
                                enemy_id = random.choice(enemy_list) if enemy_list else None
                                if enemy_id:
                                    enemy_data = run_config["enemyMap"][enemy_id]
                                    pool = monsters.get("basic",[])
                                    sprite = random.choice(pool) if pool else None
                                    if sprite:
                                        active_monster = Monster(sprite, enemy_data.get("identity",{}).get("startingHealth",50))
                                    else:
                                        active_monster = None
                                else:
                                    active_monster = None
                                pool = scene_backgrounds.get(node.type,[])
                                active_scene_background = random.choice(pool) if pool else None
                                fade_direction="out"
                                fade_start_time=pygame.time.get_ticks()
                                next_state="scene"
                            else:
                                active_monster=None
                                pool = scene_backgrounds.get(node.type,[])
                                active_scene_background = random.choice(pool) if pool else None
                                fade_direction="out"
                                fade_start_time=pygame.time.get_ticks()
                                next_state="scene"
                            break
                elif game_state=="scene":
                    if deck_rect.collidepoint(mx,my):
                        player.draw_card()
                    else:
                        slot_w, slot_h = CARD_WIDTH, CARD_HEIGHT
                        padding = 12
                        hand_width = len(player.hand)*(slot_w+padding)-padding
                        start_x = hand_start_rect.x + 100
                        y = hand_start_rect.y + 20
                        for i,card in enumerate(player.hand):
                            r = pygame.Rect(start_x+i*(slot_w+padding),y,slot_w,slot_h)
                            if r.collidepoint(mx,my):
                                player.hand.pop(i)
                                break
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
                icon_w, icon_h = 48, 48
                icon_scaled = pygame.transform.smoothscale(icon, (icon_w, icon_h))
                screen.blit(icon_scaled, (node.x-icon_w//2, node.y-icon_h//2))
        elif game_state=="scene":
            if active_scene_background:
                screen.blit(active_scene_background,(0,0))
            pygame.draw.rect(screen,(50,30,10),ui_rect)
            player_y = MAP_HEIGHT - UI_PANEL_HEIGHT - 150
            monster_y = player_y
            player.draw(screen, MAP_WIDTH//3, player_y)
            if active_monster:
                active_monster.draw(screen, MAP_WIDTH*2//3, monster_y)
            player.draw_cards(screen, hand_start_rect)
            screen.blit(player.deck_logo,(deck_rect.x,deck_rect.y))
            deck_count_text = pygame.font.SysFont(None,22).render(f"{len(player.deck)}", True, (255,255,255))
            text_x = deck_rect.x + (deck_rect.width - deck_count_text.get_width())//2
            text_y = deck_rect.y + deck_rect.height + 5
            screen.blit(deck_count_text,(text_x,text_y))
            pygame.draw.rect(screen,(110,80,40),next_button)
            pygame.draw.rect(screen,(220,190,140),next_button,3)
            t = pygame.font.SysFont(None,32).render("Next",True,(255,255,255))
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
                fade_alpha = 255-alpha
                if fade_alpha<=0:
                    fade_direction=None
                    fade_alpha=0
            fade_surf = pygame.Surface((MAP_WIDTH,MAP_HEIGHT))
            fade_surf.set_alpha(fade_alpha)
            fade_surf.fill((0,0,0))
            screen.blit(fade_surf,(0,0))

        pygame.display.flip()