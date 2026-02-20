import os

# -------------------------------------------------
# MAP SIZE
# -------------------------------------------------
MAP_WIDTH = 1200
MAP_HEIGHT = 800

# -------------------------------------------------
# MAP GENERATION SETTINGS
# -------------------------------------------------
ROWS = 5
MIN_NODES_PER_ROW = 2
MAX_NODES_PER_ROW = 5

TOP_MARGIN = 100
BOTTOM_MARGIN = 100
SIDE_MARGIN = 100

# -------------------------------------------------
# VISUAL SETTINGS
# -------------------------------------------------
LINE_COLOR = (80, 50, 20)
LINE_WIDTH = 4

NODE_RADIUS = 30
VISIBLE_AHEAD = 1  # Only show current + next row

# -------------------------------------------------
# ASSET PATHS
# -------------------------------------------------
ASSETS_DIR = "assets"

# Node icons (used for map rendering)
ICONS_DIR = os.path.join(ASSETS_DIR, "icons")

# Player sprites (male.png, female.png)
PLAYER_SPRITES_DIR = os.path.join(ASSETS_DIR, "playable_characters")

# Scene backgrounds
SCENES_DIR = os.path.join(ASSETS_DIR, "scenes")

# Fonts
FONTS_DIR = os.path.join(ASSETS_DIR, "fonts")

# Parchment background for map
PARCHMENT_PATH = os.path.join(ICONS_DIR, "parchment.png")

# -------------------------------------------------
# NODE TYPES & PROBABILITIES
# -------------------------------------------------
NODE_TYPES = ["start", "battle", "rest", "treasure", "elite", "event", "boss"]

NODE_PROBABILITIES = {
    "battle": 0.55,
    "rest": 0.15,
    "treasure": 0.15,
    "elite": 0.10,
    "event": 0.05
}