import pygame
import os
from config import *

def run_interactive(graph, icons):
    pygame.init()
    screen = pygame.display.set_mode((MAP_WIDTH, MAP_HEIGHT))
    pygame.display.set_caption("Roguelite Map Progression")

    clock = pygame.time.Clock()

    # -----------------------------
    # Fonts
    # -----------------------------
    font_large = pygame.font.SysFont(None, 48)
    font_small = pygame.font.SysFont(None, 32)

    # -----------------------------
    # Map Background (Parchment)
    # -----------------------------
    parchment = pygame.image.load(PARCHMENT_PATH).convert_alpha()
    parchment = pygame.transform.smoothscale(parchment, (MAP_WIDTH, MAP_HEIGHT))

    # --------------------------------------------------
    # Scene Backgrounds (WITH DEBUG OUTPUT)
    # --------------------------------------------------
    scene_backgrounds = {}

    def load_scene(name, file_name):
        path = os.path.join(SCENES_DIR, file_name)

        if os.path.exists(path):
            print(f"Loaded scene: {file_name}")
            img = pygame.image.load(path).convert_alpha()
            img = pygame.transform.smoothscale(img, (MAP_WIDTH, MAP_HEIGHT))
            scene_backgrounds[name] = img
        else:
            print(f"Missing scene file: {path}")

    # Explicit loads
    load_scene("battle", "battle.png")
    load_scene("rest", "rest.png")
    load_scene("treasure", "treasure.png")
    load_scene("elite", "elite.png")
    load_scene("boss", "boss.png")

    # Event uses treasure background
    scene_backgrounds["event"] = scene_backgrounds.get("treasure")

    # --------------------------------------------------
    # Game State
    # --------------------------------------------------
    current_node = next(n for n in graph.nodes.values() if n.type == "start")

    game_state = "map"
    active_scene_node = None

    # Next button
    button_width = 220
    button_height = 70
    button_rect = pygame.Rect(
        MAP_WIDTH // 2 - button_width // 2,
        MAP_HEIGHT - 120,
        button_width,
        button_height
    )

    running = True
    while running:
        clock.tick(60)

        # =============================
        # EVENT HANDLING
        # =============================
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

            if event.type == pygame.MOUSEBUTTONDOWN:
                mx, my = pygame.mouse.get_pos()

                # ---------------- MAP STATE ----------------
                if game_state == "map":
                    for nid in current_node.connections:
                        node = graph.nodes[nid]

                        if node.is_clicked(mx, my, NODE_RADIUS):
                            current_node = node
                            active_scene_node = node

                            # Do not open scene for start node
                            if node.type != "start":
                                print("Opening scene:", node.type)
                                game_state = "scene"

                            break

                # ---------------- SCENE STATE ----------------
                elif game_state == "scene":
                    if button_rect.collidepoint(mx, my):
                        print("Returning to map")
                        game_state = "map"

        # =============================
        # DRAWING
        # =============================

        # ---------- MAP SCREEN ----------
        if game_state == "map":
            screen.blit(parchment, (0, 0))

            cur_row = current_node.row
            visible_rows = [cur_row, cur_row + 1]

            # Draw connections
            for node in graph.nodes.values():
                if node.row not in visible_rows:
                    continue

                for tid in node.connections:
                    target = graph.nodes[tid]
                    if target.row in visible_rows:
                        pygame.draw.line(
                            screen,
                            LINE_COLOR,
                            (node.x, node.y),
                            (target.x, target.y),
                            LINE_WIDTH
                        )

            # Draw nodes
            for node in graph.nodes.values():
                if node.row not in visible_rows:
                    continue

                icon = icons[node.type]
                w, h = icon.get_size()
                screen.blit(icon, (node.x - w//2, node.y - h//2))

        # ---------- SCENE SCREEN ----------
        elif game_state == "scene":

            bg = scene_backgrounds.get(active_scene_node.type)

            if bg:
                screen.blit(bg, (0, 0))
            else:
                screen.fill((30, 20, 10))  # fallback color

            # Title
            title = font_large.render(
                f"{active_scene_node.type.upper()} NODE",
                True,
                (230, 210, 170)
            )
            screen.blit(
                title,
                (MAP_WIDTH // 2 - title.get_width() // 2, 150)
            )

            # Placeholder text
            description = font_small.render(
                "Scene placeholder content",
                True,
                (220, 200, 160)
            )
            screen.blit(
                description,
                (MAP_WIDTH // 2 - description.get_width() // 2, 240)
            )

            # Draw Next button
            pygame.draw.rect(screen, (110, 80, 40), button_rect)
            pygame.draw.rect(screen, (220, 190, 140), button_rect, 3)

            button_text = font_small.render("Next", True, (255, 240, 200))
            screen.blit(
                button_text,
                (
                    button_rect.centerx - button_text.get_width() // 2,
                    button_rect.centery - button_text.get_height() // 2
                )
            )

        pygame.display.flip()

    pygame.quit()
