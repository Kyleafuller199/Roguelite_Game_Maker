class UIState:
    def __init__(self, player, combat):
        self.player = player
        self.combat = combat

    def get_state(self):
        return {
            "player": {
                "health": self.player.health,
                "max_health": self.player.max_health,
                "hand": self._hand()
            },
            "combat": {
                "turn": self.combat.turn,
                "energy": self.combat.energy,
                "player_block": self.combat.player_block,
                "enemy_block": self.combat.monster_block
            },
            "monster": {
                "health": self.combat.monster.health,
                "max_health": self.combat.monster.max_health
            }
        }

    def _hand(self):
        return [
            {
                "index": i,
                "id": c.id,
                "name": c.name,
                "cost": c.cost,
                "effects": c.effects
            }
            for i, c in enumerate(self.player.hand)
        ]

    def play_card(self, index):
        if self.combat.turn != "player":
            return {"success": False}

        if index < 0 or index >= len(self.player.hand):
            return {"success": False}

        card = self.player.hand[index]

        # Pre-check energy before touching the hand
        if card.cost > self.combat.energy:
            return {"success": False}

        # Remove the card from hand BEFORE effects fire so that draw effects
        # see the correct hand size (otherwise a full hand of 5 blocks draws).
        self.player.hand.pop(index)

        success = self.combat.play_card(card)

        if not success:
            # Shouldn't happen after the pre-check, but restore on failure
            self.player.hand.insert(index, card)
            return {"success": False}

        return {
            "success": True,
            "state": self.get_state()
        }

    def end_turn(self):
        self.combat.end_player_turn()
        return {
            "success": True,
            "state": self.get_state()
        }