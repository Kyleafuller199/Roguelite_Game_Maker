import pygame
import random
import os
import json

from config import *
from combat import Combat
from game_ui_state import UIState


# ---------------- CONFIG ----------------
def load_run_config(path="run_config.json"):
    with open(path, "r") as f:
        return json.load(f)


# ---------------- PLAYER ----------------
class Player:
    def __init__(self, sprite, max_health=100):
        self.sprite = sprite
        self.max_health = max_health
        self.health = max_health

        self.deck = []
        self.hand = []
        self.max_hand_size = 5

    def draw_card(self):
        if self.deck and len(self.hand) < self.max_hand_size:
            self.hand.append(self.deck.pop(0))


# ---------------- MONSTER ----------------
class Monster:
    def __init__(self, sprite, data):
        self.sprite = sprite
        self.data = data

        self.max_health = data["identity"]["startingHealth"]
        self.health = self.max_health

    def draw(self, screen, x, y):
        w, h = self.sprite.get_size()
        screen.blit(self.sprite, (x - w // 2, y - h // 2))

        bar_w, bar_h = 140, 18
        ratio = self.health / self.max_health

        pygame.draw.rect(screen, (80, 80, 80), (x - bar_w // 2, y - 20, bar_w, bar_h))
        pygame.draw.rect(screen, (50, 200, 50), (x - bar_w // 2, y - 20, int(bar_w * ratio), bar_h))
        pygame.draw.rect(screen, (0, 0, 0), (x - bar_w // 2, y - 20, bar_w, bar_h), 2)


# ---------------- MAIN LOOP ----------------
def run_interactive(graph, icons):
    pygame.init()

    run_config = load_run_config()

    screen = pygame.display.set_mode((MAP_WIDTH, MAP_HEIGHT))
    clock = pygame.time.Clock()

    player_sprite = pygame.image.load(
        os.path.join("assets", "playable_characters", run_config["character"]["imageUrl"])
    ).convert_alpha()

    player = Player(player_sprite)

    combat = None
    ui = None
    active_monster = None

    game_state = "map"
    current_node = next(n for n in graph.nodes.values() if n.type == "start")

    while True:
        clock.tick(60)

        # ---------------- INPUT ----------------
        for e in pygame.event.get():
            if e.type == pygame.QUIT:
                pygame.quit()
                exit()

            if e.type == pygame.MOUSEBUTTONDOWN:
                mx, my = pygame.mouse.get_pos()

                if game_state == "scene" and combat:
                    ui.handle_click(mx, my)

        # ---------------- MAP ----------------
        if game_state == "map":
            screen.fill((0, 0, 0))

        # ---------------- SCENE ----------------
        elif game_state == "scene":
            screen.fill((30, 30, 30))

            player.draw(screen, 300, 400)

            if active_monster:
                active_monster.draw(screen, 900, 400)

            ui.build_hand_layout(pygame.Rect(0, MAP_HEIGHT - 250, MAP_WIDTH, 250))
            ui.draw_hand(screen)

        pygame.display.flip()