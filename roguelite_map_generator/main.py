from map_generator import generate_map
from renderer import render_map
from interactive_viewer import run_interactive
from PIL import Image
import pygame
import os
from config import ICONS_DIR, MAP_WIDTH, MAP_HEIGHT

NODE_TYPES = ["start", "battle", "rest", "treasure", "elite", "event", "boss"]

def load_icons(loader, post_process=None):
    icons = {}
    for name in NODE_TYPES:
        path = os.path.join(ICONS_DIR, f"{name}.png")
        icon = loader(path)
        if post_process:
            icon = post_process(icon)
        icons[name] = icon
    return icons


def main():
    graph = generate_map(seed=None)

    # Render printable map (PIL)
    icons_pil = load_icons(
        loader=lambda p: Image.open(p).convert("RGBA")
    )
    render_map(graph, icons_pil)

    # Interactive map (pygame)
    pygame.init()
    pygame.display.set_mode((MAP_WIDTH, MAP_HEIGHT))

    icons_pygame = load_icons(
        loader=lambda p: pygame.image.load(p).convert_alpha(),
        post_process=lambda i: pygame.transform.smoothscale(i, (48, 48))
    )
    run_interactive(graph, icons_pygame)


if __name__ == "__main__":
    main()
