from map_generator import generate_map
from renderer import render_map
from PIL import Image
import os
from config import ICONS_DIR

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

    # ---------------- STATIC EXPORT ----------------
    icons_pil = load_icons(
        loader=lambda p: Image.open(p).convert("RGBA")
    )
    render_map(graph, icons_pil)

    # ---------------- GAME DATA OUTPUT ----------------
    # Instead of pygame runtime, you should export state
    print("Map generated successfully.")
    print("Run config / graph ready for frontend.")

    # OPTIONAL: save graph for frontend
    import json

    with open("exported_graph.json", "w") as f:
        json.dump(graph.to_dict(), f, indent=2)


if __name__ == "__main__":
    main()