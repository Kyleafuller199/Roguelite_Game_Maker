import os

MAP_WIDTH = 900
MAP_HEIGHT = 1300

ROWS = 7
MIN_NODES_PER_ROW = 2
MAX_NODES_PER_ROW = 4

TOP_MARGIN = 120
BOTTOM_MARGIN = 140
SIDE_MARGIN = 120

LINE_COLOR = (90, 60, 30)
LINE_WIDTH = 4

NODE_RADIUS = 26
VISIBLE_AHEAD = 1  # Only show current + next row

ASSETS_DIR = "assets"
ICONS_DIR = os.path.join(ASSETS_DIR, "icons")
FONTS_DIR = os.path.join(ICONS_DIR, "fonts")

PARCHMENT_PATH = os.path.join(ICONS_DIR, "parchment.png")

NODE_PROBABILITIES = {
    "battle": 0.55,
    "rest": 0.15,
    "treasure": 0.15,
    "elite": 0.10,
    "event": 0.05
}

FONT_SIZES = {
    "map_node": 18,
    "card_title": 32,
    "card_body": 22,
    "ui_small": 16
}
