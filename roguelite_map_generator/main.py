import pygame
import json
import os
from map_generator import generate_map
from renderer import render_map

from combat import Combat
from game_ui_state import UIState

from config import MAP_WIDTH, MAP_HEIGHT


# ---------------- LOAD RUN CONFIG ----------------
def load_run_config(path="run_config.json"):
    if not os.path.exists(path):
        print("No run_config.json found, generating default.")
        return None

    with open(path, "r") as f:
        return json.load(f)


# ---------------- ENTRY ----------------
def main():
    pygame.init()
    screen = pygame.display.set_mode((MAP_WIDTH, MAP_HEIGHT))
    pygame.display.set_caption("Roguelite Debug Viewer")

    clock = pygame.time.Clock()

    run_config = load_run_config()

    # fallback if editor hasn't started run yet
    if not run_config:
        print("No run config, exiting safely.")
        return

    # ---------------- BUILD MAP ----------------
    graph = generate_map(seed=None)
    nodes = list(graph.nodes.values())

    game_state = "map"
    selected_node = None

    # fake placeholder combat trigger (for testing UI system)
    combat_session = None
    ui = None

    print("Viewer started in MAP MODE")

    # ---------------- MAIN LOOP ----------------
    running = True
    while running:
        clock.tick(60)

        # ---------------- INPUT ----------------
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

            # CLICK MAP NODE -> ENTER COMBAT TEST MODE
            if event.type == pygame.MOUSEBUTTONDOWN:
                mx, my = pygame.mouse.get_pos()

                if game_state == "map":
                    for node in nodes:
                        dx = node.x - mx
                        dy = node.y - my
                        if dx * dx + dy * dy < 30 * 30:
                            selected_node = node

                            print(f"Entering node: {node.type}")

                            # TEMP COMBAT TEST (stub monster)
                            from combat import Combat
                            from game_state import Player, Monster

                            player_sprite = pygame.Surface((50, 50))
                            player_sprite.fill((0, 200, 255))

                            monster_sprite = pygame.Surface((80, 80))
                            monster_sprite.fill((200, 50, 50))

                            player = Player(player_sprite)

                            monster_data = {
                                "identity": {"startingHealth": 40},
                                "moves": []
                            }

                            combat_session = Combat(player, Monster(monster_sprite, monster_data), run_config)
                            ui = UIState(player, combat_session)

                            combat_session.start_player_turn()

                            game_state = "scene"
                            break

                elif game_state == "scene":
                    if ui:
                        ui.handle_click(mx, my)

        # ---------------- DRAW MAP ----------------
        if game_state == "map":
            screen.fill((10, 10, 10))

            for node in nodes:
                color = (255, 255, 255)
                if node.type == "boss":
                    color = (255, 50, 50)
                elif node.type == "battle":
                    color = (200, 200, 255)

                pygame.draw.circle(screen, color, (node.x, node.y), 12)

                for conn in node.connections:
                    target = graph.nodes[conn]
                    pygame.draw.line(screen, (80, 80, 80),
                                     (node.x, node.y),
                                     (target.x, target.y), 2)

        # ---------------- DRAW COMBAT ----------------
        elif game_state == "scene":
            screen.fill((30, 30, 30))

            if combat_session:
                # fake monster/player rendering
                screen.blit(combat_session.player.sprite, (200, 300))
                screen.blit(combat_session.monster.sprite, (700, 300))

            if ui:
                ui.build_hand_layout(screen.get_rect())
                ui.draw_hand(screen)

        pygame.display.flip()

    pygame.quit()


if __name__ == "__main__":
    main()