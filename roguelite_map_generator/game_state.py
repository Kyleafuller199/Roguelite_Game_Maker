import random
from combat import Combat
from game_ui_state import UIState


class GameState:
    """
    Controls FULL game flow:
    map -> scene -> combat -> reward -> map
    """

    def __init__(self, run_config, graph):
        self.run_config = run_config
        self.graph = graph

        # ---------------- CORE STATE ----------------
        self.player = None
        self.combat = None
        self.ui = None

        self.game_state = "map"  # map | scene | combat | reward
        self.current_node = self._find_start_node()

        self.active_monster_data = None

    # ---------------- NODE SYSTEM ----------------
    def _find_start_node(self):
        return next(n for n in self.graph.nodes.values() if n.type == "start")

    def get_map_state(self):
        """
        Frontend uses this to render nodes + connections
        """
        visible = [self.current_node] + [
            self.graph.nodes[nid] for nid in self.current_node.connections
        ]

        return {
            "type": "map",
            "current_node": self.current_node.id,
            "nodes": [
                {
                    "id": n.id,
                    "type": n.type,
                    "x": n.x,
                    "y": n.y,
                    "connections": n.connections
                }
                for n in visible
            ]
        }

    # ---------------- NODE TRANSITION ----------------
    def click_node(self, node_id):
        if self.game_state != "map":
            return {"success": False, "reason": "not_in_map"}

        if node_id not in self.graph.nodes:
            return {"success": False, "reason": "invalid_node"}

        node = self.graph.nodes[node_id]

        if node_id not in self.current_node.connections:
            return {"success": False, "reason": "not_connected"}

        self.current_node = node

        # ---------------- BRANCHING ----------------
        if node.type in ["battle", "elite", "boss"]:
            return self._start_encounter(node)

        self.game_state = "scene"
        return {"success": True, "state": self.get_state()}

    # ---------------- SCENE / ENCOUNTER ----------------
    def _start_encounter(self, node):
        self.game_state = "combat"

        enemy_id = random.choice(
            self.run_config["acts"]["1"][self._get_pool_type(node.type)]
        )

        self.active_monster_data = self.run_config["enemyMap"][enemy_id]

        # NOTE: player should already exist in frontend init
        if not self.player:
            raise Exception("Player not initialized in GameState")

        monster = self._create_monster(self.active_monster_data)

        self.combat = Combat(self.player, monster, self.run_config)
        self.ui = UIState(self.player, self.combat)

        self.combat.start_player_turn()

        return {"success": True, "state": self.get_state()}

    def _get_pool_type(self, node_type):
        if node_type == "battle":
            return "basics"
        if node_type == "elite":
            return "elites"
        return "bosses"

    def _create_monster(self, data):
        class Monster:
            def __init__(self, data):
                self.data = data
                self.max_health = data["identity"]["startingHealth"]
                self.health = self.max_health

        return Monster(data)

    # ---------------- INPUT (COMBAT) ----------------
    def play_card(self, index):
        if self.game_state != "combat":
            return {"success": False, "reason": "not_in_combat"}

        return self.ui.play_card(index)

    def end_turn(self):
        if self.game_state != "combat":
            return {"success": False, "reason": "not_in_combat"}

        result = self.ui.end_turn()

        return {
            "success": True,
            "state": self.get_state()
        }

    # ---------------- STATE OUTPUT ----------------
    def get_state(self):
        if self.game_state == "map":
            return self.get_map_state()

        if self.game_state == "combat":
            return self.ui.get_state()

        return {
            "type": self.game_state
        }