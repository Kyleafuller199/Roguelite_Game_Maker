class UIState:
    def __init__(self, player, combat):
        self.player = player
        self.combat = combat

    # ---------------- CORE STATE ----------------
    def get_state(self):
        """
        Single source of truth for frontend.
        This replaces ALL rendering.
        """

        return {
            "player": {
                "health": self.player.health,
                "max_health": self.player.max_health,
                "hand": self._get_hand_state(),
                "deck_count": len(self.player.deck)
            },
            "combat": {
                "turn": self.combat.turn,
                "energy": self.combat.energy,
                "player_block": self.combat.player_block,
                "enemy_block": self.combat.monster_block
            },
            "monster": self._get_monster_state(),
            "ui": {
                "actions": self._get_available_actions()
            }
        }

    # ---------------- HAND STATE ----------------
    def _get_hand_state(self):
        hand_state = []

        for i, card in enumerate(self.player.hand):
            hand_state.append({
                "index": i,
                "id": card.id,
                "name": card.name,
                "type": card.type,
                "rarity": card.rarity,
                "cost": card.cost,
                "effects": card.effects
            })

        return hand_state

    # ---------------- MONSTER STATE ----------------
    def _get_monster_state(self):
        monster = self.combat.monster

        if not monster:
            return None

        return {
            "id": getattr(monster, "id", None),
            "health": monster.health,
            "max_health": monster.max_health,
            "intent": self.combat.get_enemy_move()["id"]
            if hasattr(self.combat, "get_enemy_move") else None
        }

    # ---------------- ACTIONS ----------------
    def _get_available_actions(self):
        return {
            "can_play_cards": self.combat.turn == "player",
            "can_end_turn": self.combat.turn == "player"
        }

    # ---------------- INPUT HANDLING ----------------
    def play_card(self, card_index):
        """
        Called from frontend when a card is clicked.
        """

        if self.combat.turn != "player":
            return {"success": False, "reason": "not_player_turn"}

        if card_index < 0 or card_index >= len(self.player.hand):
            return {"success": False, "reason": "invalid_card"}

        card = self.player.hand[card_index]

        success = self.combat.play_card(card)

        if not success:
            return {"success": False, "reason": "not_enough_energy"}

        self.player.hand.pop(card_index)

        return {
            "success": True,
            "state": self.get_state()
        }

    # ---------------- TURN CONTROL ----------------
    def end_turn(self):
        """
        Ends player turn and triggers enemy logic.
        """

        if self.combat.turn != "player":
            return {"success": False, "reason": "not_player_turn"}

        self.combat.end_player_turn()

        return {
            "success": True,
            "state": self.get_state()
        }