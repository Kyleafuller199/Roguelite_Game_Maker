from PIL import Image, ImageDraw, ImageOps, ImageFont
import os, textwrap

# Output folder
OUTDIR = "sts_class_cards"
os.makedirs(OUTDIR, exist_ok=True)

# Colors by character class
CLASS_COLORS = {
    "Red": (200, 50, 50),
    "Green": (60, 180, 90),
    "Blue": (80, 150, 255),
    "Purple": (180, 90, 200),
    "Gray": (180, 180, 180),
    "Dark": (60, 40, 60)
}

CARD_TYPES = ["attack", "skill", "power", "status"]
RARITIES = ["common", "uncommon", "rare", "curse"]

# Pillow default font (fixed-size but safe)
FONT_NAME  = ImageFont.load_default()
FONT_BODY  = ImageFont.load_default()
FONT_COST  = ImageFont.load_default()
FONT_LABEL = ImageFont.load_default()

class Card:
    def __init__(self, name, description, cost, card_class,
                 card_type, rarity, art_path=None,
                 size=(420, 600)):

        self.w, self.h = size
        self.name = name
        self.description = description
        self.cost = str(cost)
        self.card_class = card_class
        self.card_type = card_type
        self.rarity = rarity
        self.art_path = art_path

    def render(self):
        card = Image.new("RGBA", (self.w, self.h), (30, 30, 30, 255))
        draw = ImageDraw.Draw(card)

        border_color = CLASS_COLORS.get(self.card_class, (150, 150, 150))

        # Border
        draw.rectangle(
            [(5, 5), (self.w - 5, self.h - 5)],
            outline=border_color + (255,),
            width=5
        )

        # ─── Name Bar ─────────────────────
        draw.rectangle((20, 20, self.w - 20, 65), fill=(20, 20, 20))

        nb = draw.textbbox((0, 0), self.name, font=FONT_NAME)
        nw, nh = nb[2] - nb[0], nb[3] - nb[1]
        draw.text(
            ((self.w - nw) // 2, 20 + (45 - nh) // 2),
            self.name,
            fill="white",
            font=FONT_NAME
        )

        # ─── Cost Circle ──────────────────
        cx, cy, r = 42, 42, 18
        draw.ellipse(
            [(cx - r, cy - r), (cx + r, cy + r)],
            fill=(0, 0, 0),
            outline="white",
            width=2
        )

        cb = draw.textbbox((0, 0), self.cost, font=FONT_COST)
        cw, ch = cb[2] - cb[0], cb[3] - cb[1]
        draw.text(
            (cx - cw // 2, cy - ch // 2),
            self.cost,
            fill="white",
            font=FONT_COST
        )

        # ─── Art Box ──────────────────────
        art_box = (30, 90, self.w - 30, 330)
        if self.art_path and os.path.exists(self.art_path):
            art = Image.open(self.art_path).convert("RGBA")
            art = ImageOps.fit(
                art,
                (art_box[2] - art_box[0], art_box[3] - art_box[1])
            )
            card.paste(art, art_box[:2])
        else:
            draw.rectangle(art_box, fill=(50, 50, 50))

        # ─── Description ──────────────────
        wrapped = textwrap.fill(self.description, width=45)
        draw.multiline_text(
            (30, 350),
            wrapped,
            fill=(230, 230, 230),
            font=FONT_BODY,
            spacing=6
        )

        # ─── Bottom Label ─────────────────
        label = f"{self.card_type.upper()} - {self.rarity.upper()}"
        lb = draw.textbbox((0, 0), label, font=FONT_LABEL)
        lw = lb[2] - lb[0]
        draw.text(
            ((self.w - lw) // 2, self.h - 34),
            label,
            fill=border_color,
            font=FONT_LABEL
        )

        return card

    def save(self, path):
        img = self.render()
        img.save(path)
        print(f"Saved: {path}")

# ─── Interactive Creation ───────────────
num_cards = int(input("How many cards would you like to create? "))

for i in range(num_cards):
    print(f"\n--- Card {i+1} ---")
    name = input("Card name: ")
    description = input("Card description: ")

    while True:
        cost = input("Card cost (number): ")
        if cost.isdigit():
            break

    while True:
        print(f"Available classes: {', '.join(CLASS_COLORS)}")
        card_class = input("Card class: ").title()
        if card_class in CLASS_COLORS:
            break

    while True:
        card_type = input("Card type (attack/skill/power/status): ").lower()
        if card_type in CARD_TYPES:
            break

    while True:
        rarity = input("Card rarity (common/uncommon/rare/curse): ").lower()
        if rarity in RARITIES:
            break

    art_path = input("Artwork path (leave blank for none): ").strip() or None

    card = Card(name, description, cost, card_class, card_type, rarity, art_path)
    card.save(os.path.join(OUTDIR, f"{name.replace(' ', '_')}.png"))

print("\nAll cards created!")
