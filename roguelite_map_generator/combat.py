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

        # Status effects
        # Strength does NOT tick down — permanent flat damage bonus for the combat
        self.player_strength  = 0
        self.monster_strength = 0
        # Weakness, Vulnerable, Frail tick at the START of the affected entity's OWN turn
        self.player_weakness    = 0
        self.monster_weakness   = 0
        self.player_vulnerable  = 0
        self.monster_vulnerable = 0
        self.player_frail  = 0
        self.monster_frail = 0

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

        # Tick down player debuffs at the END of the player's turn so that debuffs
        # applied by the enemy are fully active for the entire next player turn.
        self.player_weakness   = max(0, self.player_weakness   - 1)
        self.player_vulnerable = max(0, self.player_vulnerable - 1)
        self.player_frail      = max(0, self.player_frail      - 1)

        self.turn = "enemy"
        self.execute_enemy_turn()

    def execute_enemy_turn(self):
        # Block resets at the start of the monster's turn
        self.monster_block = 0

        move = self.get_enemy_move()

        for effect in move.get("effects", []):
            repeat = int(effect.get("repeat", 1))
            for _ in range(repeat):
                self.apply_effect(effect, source="enemy")

        # Tick down monster debuffs at the END of the monster's turn so that debuffs
        # applied by the player are fully active for the entire next monster turn.
        self.monster_weakness   = max(0, self.monster_weakness   - 1)
        self.monster_vulnerable = max(0, self.monster_vulnerable - 1)
        self.monster_frail      = max(0, self.monster_frail      - 1)

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
                gain = int(value * 0.75) if self.player_frail > 0 else value
                self.player_block += gain
            else:
                gain = int(value * 0.75) if self.monster_frail > 0 else value
                self.monster_block += gain

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

        elif effect_type == "strength":
            # Strength on the player buffs the player; enemy-sourced strength buffs the monster
            if source == "player" or target in PLAYER_TARGETS:
                self.player_strength += value
            else:
                self.monster_strength += value

        elif effect_type in ("weak", "weakness"):
            if target in ENEMY_TARGETS:
                self.monster_weakness += value
            elif target in PLAYER_TARGETS or source == "enemy":
                self.player_weakness += value

        elif effect_type == "vulnerable":
            if target in ENEMY_TARGETS:
                self.monster_vulnerable += value
            elif target in PLAYER_TARGETS or source == "enemy":
                self.player_vulnerable += value

        elif effect_type == "frail":
            if target in ENEMY_TARGETS:
                self.monster_frail += value
            elif target in PLAYER_TARGETS or source == "enemy":
                self.player_frail += value

    # ---------------- DAMAGE ----------------
    def deal_damage_to_monster(self, amount):
        # Strength: permanent flat bonus to all attacks
        amount += self.player_strength
        # Weakness: attacker deals 25% less damage
        if self.player_weakness > 0:
            amount = int(amount * 0.75)
        # Vulnerable on the monster: takes 50% more damage
        if self.monster_vulnerable > 0:
            amount = int(amount * 1.5)

        if self.monster_block > 0:
            absorbed = min(amount, self.monster_block)
            self.monster_block -= absorbed
            amount -= absorbed

        if amount > 0:
            self.monster.health -= amount

    def deal_damage_to_player(self, amount):
        # Monster strength: permanent flat bonus to all its attacks
        amount += self.monster_strength
        # Monster weakness: it deals 25% less damage
        if self.monster_weakness > 0:
            amount = int(amount * 0.75)
        # Vulnerable on the player: takes 50% more damage
        if self.player_vulnerable > 0:
            amount = int(amount * 1.5)

        if self.player_block > 0:
            absorbed = min(amount, self.player_block)
            self.player_block -= absorbed
            amount -= absorbed

        if amount > 0:
            self.player.health -= amount