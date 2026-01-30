from map_generator import generate_map
from renderer import render_map
from interactive_viewer import run_interactive
from PIL import Image
import pygame
import os
from config import ICONS_DIR, MAP_WIDTH, MAP_HEIGHT

def load_icons_pygame():
    pygame.init()
    pygame.display.set_mode((MAP_WIDTH, MAP_HEIGHT))  # Required for convert_alpha()

    icons = {}
    for name in ["start", "battle", "rest", "treasure", "elite", "event", "boss"]:
        path = os.path.join(ICONS_DIR, f"{name}.png")
        icon = pygame.image.load(path).convert_alpha()
        icon = pygame.transform.smoothscale(icon, (48, 48))
        icons[name] = icon
    return icons

def load_icons_pil():
    icons = {}
    for name in ["start", "battle", "rest", "treasure", "elite", "event", "boss"]:
        path = os.path.join(ICONS_DIR, f"{name}.png")
        icons[name] = Image.open(path).convert("RGBA")
    return icons

def main():
    graph = generate_map(seed=None)

    # Render printable map
    icons_pil = load_icons_pil()
    render_map(graph, icons_pil)

    # Load pygame icons
    icons_pygame = load_icons_pygame()

    # Run interactive map
    run_interactive(graph, icons_pygame)

if __name__ == "__main__":
    main()
