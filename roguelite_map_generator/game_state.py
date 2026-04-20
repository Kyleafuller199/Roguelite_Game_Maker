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


# ---------------- GAME STATE DRIVER ----------------
class GameState:
    def __init__(self, run_config):
        self.run_config = run_config

        self.player = None
        self.combat = None
        self.ui = None
        self.monster = None

        self.game_state = "map"
        self.current_node = None

    # ---------------- INIT COMBAT ----------------
    def start_combat(self, player_sprite, monster_sprite, monster_data):
        self.player = Player(player_sprite)

        self.combat = Combat(
            self.player,
            Monster(monster_sprite, monster_data),
            self.run_config
        )

        self.ui = UIState(self.player, self.combat)

        self.combat.start_player_turn()

        self.game_state = "scene"

    # ---------------- INPUT HANDLING ----------------
    def click(self, x, y, hand_index=None):
        if self.game_state != "scene":
            return None

        if hand_index is not None:
            return self.ui.play_card(hand_index)

        return {"success": False, "reason": "no_action"}

    def end_turn(self):
        if self.combat:
            return self.ui.end_turn()

    # ---------------- STATE OUTPUT ----------------
    def get_state(self):
        if not self.ui:
            return {"game_state": self.game_state}

        return self.ui.get_state()


# ---------------- RUNTIME BRIDGE ----------------
def run_game(run_config, player_sprite, monster_loader):
    """
    Entry point for running the game without pygame dependency.
    """

    state = GameState(run_config)

    act_nodes = run_config.get("acts", {}).get("1", {}).get("basics", [])

    if not act_nodes:
        print("No nodes found in run_config.")
        return state

    for node_id in act_nodes:

        monster_data = monster_loader(node_id)

        print(f"Entering node: {node_id}")

        state.start_combat(
            player_sprite=player_sprite,
            monster_sprite=monster_data["sprite"],
            monster_data=monster_data
        )

        while state.game_state == "scene":
            break

    return state