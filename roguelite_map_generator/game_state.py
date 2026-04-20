import json
from combat import Combat
from game_ui_state import UIState


def load_run_config(path="run_config.json"):
    with open(path, "r") as f:
        return json.load(f)


class Player:
    def __init__(self, data):
        self.max_health = 100
        self.health = 100
        self.deck = []
        self.hand = []
        self.max_hand_size = 5
        self.data = data

    def draw_card(self):
        if self.deck and len(self.hand) < self.max_hand_size:
            self.hand.append(self.deck.pop(0))


class Monster:
    def __init__(self, data):
        self.data = data
        self.max_health = data["identity"]["startingHealth"]
        self.health = self.max_health


class GameState:
    def __init__(self, run_config):
        self.run_config = run_config

        self.player = None
        self.monster = None
        self.combat = None
        self.ui = None

        self.game_state = "map"
        self.current_node = None

    # ---------------- COMBAT START ----------------
    def start_combat(self, player_data, monster_data):
        self.player = Player(player_data)
        self.monster = Monster(monster_data)

        self.combat = Combat(
            self.player,
            self.monster,
            self.run_config
        )

        self.ui = UIState(self.player, self.combat)

        self.combat.start_player_turn()
        self.game_state = "scene"

    # ---------------- INPUT ----------------
    def click_card(self, index):
        if self.game_state != "scene":
            return {"success": False, "reason": "not_in_combat"}

        return self.ui.play_card(index)

    def end_turn(self):
        if self.game_state != "scene":
            return {"success": False, "reason": "not_in_combat"}

        return self.ui.end_turn()

    # ---------------- STATE ----------------
    def get_state(self):
        if not self.ui:
            return {
                "game_state": self.game_state
            }

        return {
            "game_state": self.game_state,
            "combat": self.ui.get_state()
        }

    # ---------------- MAP TRANSITION ----------------
    def set_node(self, node):
        self.current_node = node

        if node["type"] in ["battle", "elite", "boss"]:
            self.start_combat(
                player_data={},      # filled from run_config later
                monster_data=node["enemy"]
            )
        else:
            self.game_state = "map"