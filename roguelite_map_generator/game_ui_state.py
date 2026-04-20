import pygame


class UIState:
    def __init__(self, player, combat):
        self.player = player
        self.combat = combat

        self.card_rects = []

        self.card_width = 160
        self.card_height = 220
        self.padding = 12

    # ---------------- LAYOUT ----------------
    def build_hand_layout(self, screen_rect):
        self.card_rects = []

        hand = self.player.hand
        count = len(hand)

        if count == 0:
            return

        max_width = screen_rect.width - 220
        slot_w = min(
            self.card_width,
            (max_width - (count - 1) * self.padding) // max(1, count)
        )

        start_x = screen_rect.x + 140
        y = screen_rect.y + 20

        for i in range(count):
            self.card_rects.append(
                pygame.Rect(
                    start_x + i * (slot_w + self.padding),
                    y,
                    slot_w,
                    self.card_height
                )
            )

    # ---------------- CLICK HANDLER ----------------
    def handle_click(self, mx, my):
        for i, rect in enumerate(self.card_rects):
            if rect.collidepoint(mx, my):
                card = self.player.hand[i]

                success = self.combat.play_card(card)

                if success:
                    self.player.hand.pop(i)
                    return "card_played"

                return "blocked"

        return "empty"

    # ---------------- TURN END ----------------
    def end_turn(self):
        self.combat.end_player_turn()

    # ---------------- DRAW ----------------
    def draw_hand(self, screen):
        font_small = pygame.font.SysFont(None, 22)
        font_medium = pygame.font.SysFont(None, 26, bold=True)

        for i, rect in enumerate(self.card_rects):
            if i >= len(self.player.hand):
                continue

            card = self.player.hand[i]

            pygame.draw.rect(screen, (50, 50, 50), rect)
            pygame.draw.rect(screen, (200, 200, 200), rect, 2)

            pygame.draw.circle(screen, (255, 255, 0), (rect.x + 18, rect.y + 18), 16)
            cost_text = font_small.render(str(card.cost), True, (0, 0, 0))
            screen.blit(cost_text, (rect.x + 12, rect.y + 10))

            name_text = font_medium.render(card.name, True, (255, 255, 255))
            screen.blit(name_text, (rect.x + 40, rect.y + 2))

            img_height = rect.height - 130
            img_width = rect.width - 12

            if card.image:
                img = pygame.transform.smoothscale(card.image, (img_width, img_height))
                screen.blit(img, (rect.x + 4, rect.y + 40))

            type_y = rect.y + 40 + img_height + 4
            type_text = font_small.render(
                f"{card.type} | {card.rarity}",
                True,
                (200, 200, 0)
            )
            screen.blit(type_text, (rect.x + 4, type_y))

            for ei, eff in enumerate(card.effects):
                eff_text = font_small.render(
                    f"{eff['effectType']} {eff.get('baseValue', '')}",
                    True,
                    (180, 255, 180)
                )
                screen.blit(eff_text, (rect.x + 4, type_y + 22 + ei * 18))