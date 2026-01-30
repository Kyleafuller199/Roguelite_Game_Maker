import os
from PIL import ImageFont
import pygame
from config import FONTS_DIR

FONT_FILES = {
    ("dejavu", False): "DejaVuSans.ttf",
    ("dejavu", True):  "DejaVuSans-Bold.ttf",
}

_pillow_cache = {}
_pygame_cache = {}

def get_pillow_font(size=24, bold=False):
    key = (size, bold)
    if key not in _pillow_cache:
        path = os.path.join(FONTS_DIR, FONT_FILES[("dejavu", bold)])
        _pillow_cache[key] = ImageFont.truetype(path, size)
    return _pillow_cache[key]

def get_pygame_font(size=24, bold=False):
    key = (size, bold)
    if key not in _pygame_cache:
        path = os.path.join(FONTS_DIR, FONT_FILES[("dejavu", bold)])
        _pygame_cache[key] = pygame.font.Font(path, size)
    return _pygame_cache[key]
