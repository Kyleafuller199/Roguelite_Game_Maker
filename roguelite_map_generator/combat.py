import random


class Combat:
    def __init__(self, player, monster, run_config):
        self.player = player
        self.monster = monster
        self.run_config = run_config

        self.turn = "player"
        self.energy = 3
        self.max_energy = 3

        self.player_block = 0
        self.monster_block = 0

        self.turn_count = 1
        self.enemy_move_index = 0

    # ---------------- TURN FLOW ----------------
    def start_player_turn(self):
        self.turn = "player"
        self.energy = self.max_energy
        self.player_block = 0

        self.player.draw_card()
        self.player.draw_card()

    def end_player_turn(self):
        if self.turn != "player":
            return

        self.turn = "enemy"
        self.execute_enemy_turn()

    def execute_enemy_turn(self):
        move = self.get_enemy_move()

        for effect in move.get("effects", []):
            repeat = int(effect.get("repeat", 1))
            for _ in range(repeat):
                self.apply_effect(effect, source="enemy")

        self.turn_count += 1
        self.start_player_turn()

    # ---------------- ENEMY AI ----------------
    def get_enemy_move(self):
        behavior = self.monster.data.get("behavior", {})
        cycle = behavior.get("cycleOrder", [])

        if not cycle:
            return {"effects": []}

        move_id = cycle[self.enemy_move_index % len(cycle)]
        self.enemy_move_index += 1

        for m in self.monster.data.get("moves", []):
            if m["id"] == move_id:
                return m

        return {"effects": []}

    # ---------------- CARD PLAY ----------------
    def play_card(self, card):
        if self.turn != "player":
            return False

        if card.cost > self.energy:
            return False

        self.energy -= card.cost

        for effect in card.effects:
            repeat = int(effect.get("repeat", 1))
            for _ in range(repeat):
                self.apply_effect(effect, source="player")

        return True

    # ---------------- EFFECT SYSTEM ----------------
    def apply_effect(self, effect, source):
        effect_type = effect.get("effectType")
        value       = effect.get("baseValue", 0)
        target      = effect.get("target")

        # Target sets that apply to the monster vs the player.
        # Enemy targets cover all valid editor options for player cards
        # (selectedEnemy, randomEnemy, allEnemies) as well as legacy "enemy".
        ENEMY_TARGETS  = {"selectedEnemy", "randomEnemy", "allEnemies", "enemy"}
        PLAYER_TARGETS = {"player", "self"}

        if effect_type == "damage":
            if target in ENEMY_TARGETS:
                self.deal_damage_to_monster(value)
            elif target in PLAYER_TARGETS:
                self.deal_damage_to_player(value)

        elif effect_type == "block":
            if source == "player":
                self.player_block += value
            else:
                self.monster_block += value

        elif effect_type == "heal":
            if source == "player":
                self.player.health = min(
                    self.player.max_health,
                    self.player.health + value
                )

        elif effect_type == "gainEnergy":
            self.energy += value

        elif effect_type == "draw":
            for _ in range(int(value)):
                self.player.draw_card()

    # ---------------- DAMAGE ----------------
    def deal_damage_to_monster(self, amount):
        if self.monster_block > 0:
            absorbed = min(amount, self.monster_block)
            self.monster_block -= absorbed
            amount -= absorbed

        if amount > 0:
            self.monster.health -= amount

    def deal_damage_to_player(self, amount):
        if self.player_block > 0:
            absorbed = min(amount, self.player_block)
            self.player_block -= absorbed
            amount -= absorbed

        if amount > 0:
            self.player.health -= amount