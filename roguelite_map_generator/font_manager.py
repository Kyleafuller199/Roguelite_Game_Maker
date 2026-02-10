import os
from PIL import ImageFont
import pygame
from config import FONTS_DIR

FONT_FILES = {
    ("arial", False): "arial.ttf",
    ("arial", True):  "arial-Bold.ttf",
}

_pillow_cache = {}
_pygame_cache = {}

def get_pillow_font(size=24, bold=False):
    """Return a Pillow font, cached by size and bold flag."""
    key = (size, bold)
    if key not in _pillow_cache:
        try:
            path = os.path.join(FONTS_DIR, FONT_FILES[("arial", bold)])
            if os.path.exists(path):
                _pillow_cache[key] = ImageFont.truetype(path, size)
            else:
                raise FileNotFoundError(f"Font not found: {path}")
        except Exception as e:
            print(f"Warning: {e}. Using default Pillow font.")
            _pillow_cache[key] = ImageFont.load_default()
    return _pillow_cache[key]

def get_pygame_font(size=24, bold=False):
    """Return a Pygame font, cached by size and bold flag."""
    key = (size, bold)
    if key not in _pygame_cache:
        try:
            path = os.path.join(FONTS_DIR, FONT_FILES[("arial", bold)])
            if os.path.exists(path):
                _pygame_cache[key] = pygame.font.Font(path, size)
            else:
                raise FileNotFoundError(f"Font not found: {path}")
        except Exception as e:
            print(f"Warning: {e}. Using default Pygame font.")
            _pygame_cache[key] = pygame.font.SysFont(None, size)
    return _pygame_cache[key]
