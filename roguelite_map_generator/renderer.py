from PIL import Image, ImageDraw
from config import *
import os

def render_map(graph, icons):
    bg = Image.open(PARCHMENT_PATH).resize((MAP_WIDTH, MAP_HEIGHT)).convert("RGBA")
    draw = ImageDraw.Draw(bg)

    # Draw connections
    for node in graph.nodes.values():
        for tid in node.connections:
            target = graph.nodes[tid]
            draw.line(
                [(node.x, node.y), (target.x, target.y)],
                fill=LINE_COLOR,
                width=LINE_WIDTH
            )

    # Draw node icons
    for node in graph.nodes.values():
        icon = icons[node.type]
        w, h = icon.size
        bg.paste(icon, (node.x - w//2, node.y - h//2), icon)

    os.makedirs("output", exist_ok=True)
    bg.save("output/map.png")
