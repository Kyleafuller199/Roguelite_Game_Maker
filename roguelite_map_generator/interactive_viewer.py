import pygame
from config import *

def run_interactive(graph, icons):
    pygame.init()
    screen = pygame.display.set_mode((MAP_WIDTH, MAP_HEIGHT))
    pygame.display.set_caption("Roguelite Map Progression")

    # Load parchment
    parchment = pygame.image.load(PARCHMENT_PATH).convert_alpha()
    parchment = pygame.transform.smoothscale(parchment, (MAP_WIDTH, MAP_HEIGHT))

    clock = pygame.time.Clock()
    current_node = next(n for n in graph.nodes.values() if n.type == "start")

    running = True
    while running:
        clock.tick(60)
        screen.blit(parchment, (0, 0))

        cur_row = current_node.row
        visible_rows = [cur_row, cur_row + 1]  # Fog-of-war: current + next

        # Draw connections
        for node in graph.nodes.values():
            if node.row not in visible_rows:
                continue
            for tid in node.connections:
                target = graph.nodes[tid]
                if target.row in visible_rows:
                    pygame.draw.line(
                        screen, LINE_COLOR, (node.x, node.y), (target.x, target.y), LINE_WIDTH
                    )

        # Draw node icons
        for node in graph.nodes.values():
            if node.row not in visible_rows:
                continue
            icon = icons[node.type]
            w, h = icon.get_size()
            screen.blit(icon, (node.x - w//2, node.y - h//2))

        # Handle clicks
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            if event.type == pygame.MOUSEBUTTONDOWN:
                mx, my = pygame.mouse.get_pos()
                for nid in current_node.connections:
                    node = graph.nodes[nid]
                    icon = icons[node.type]
                    w, h = icon.get_size()
                    if node.is_clicked(mx, my, NODE_RADIUS):
                        current_node = node

                        print(f"Entered {node.type} node (row {node.row})")
                        break

        pygame.display.flip()

    pygame.quit()
