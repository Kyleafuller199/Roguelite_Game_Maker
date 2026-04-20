class UIState:
    def __init__(self, player, combat):
        self.player = player
        self.combat = combat

    # ---------------- CORE STATE ----------------
    def get_state(self):
        return {
            "type": "combat",
            "player": {
                "health": self.player.health,
                "max_health": self.player.max_health,
                "hand": self._get_hand(),
                "deck_count": len(self.player.deck)
            },
            "combat": {
                "turn": self.combat.turn,
                "energy": self.combat.energy,
                "player_block": self.combat.player_block,
                "enemy_block": self.combat.monster_block
            },
            "monster": self._get_monster(),
            "actions": {
                "can_play": self.combat.turn == "player",
                "can_end_turn": self.combat.turn == "player"
            }
        }

    # ---------------- HAND ----------------
    def _get_hand(self):
        return [
            {
                "index": i,
                "id": c.id,
                "name": c.name,
                "cost": c.cost,
                "type": c.type,
                "rarity": c.rarity,
                "effects": c.effects
            }
            for i, c in enumerate(self.player.hand)
        ]

    # ---------------- MONSTER ----------------
    def _get_monster(self):
        m = self.combat.monster

        if not m:
            return None

        return {
            "health": m.health,
            "max_health": m.max_health,
            "intent": self.combat.get_enemy_move()["id"]
        }

    # ---------------- CARD PLAY ----------------
    def play_card(self, index):
        if self.combat.turn != "player":
            return {"success": False, "reason": "not_player_turn"}

        if index < 0 or index >= len(self.player.hand):
            return {"success": False, "reason": "invalid_card"}

        card = self.player.hand[index]

        if not self.combat.play_card(card):
            return {"success": False, "reason": "not_enough_energy"}

        self.player.hand.pop(index)

        return {"success": True}

    # ---------------- TURN END ----------------
    def end_turn(self):
        self.combat.end_player_turn()
        return {"success": True}