# install pip install Pillow==9.5.0

from PIL import Image, ImageDraw, ImageFont, ImageOps
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

# Utility font loader
def font(sz, bold=False):
    try:
        path = "C:/Windows/Fonts/DejaVuSans-Bold.ttf" if bold else "C:/Windows/Fonts/DejaVuSans.ttf"
        if not os.path.exists(path):
            raise FileNotFoundError(f"Font not found at {path}")
        return ImageFont.truetype(path, sz)
    except Exception as e:
        print(f"Warning: {e}. Using default font.")
        return ImageFont.load_default()

# Fonts
FONT_NAME = font(66, True)    # large for card title
FONT_BODY = font(48)          # description
FONT_COST = font(120, True)   # cost circle
FONT_LABEL = font(40, True)   # type/rarity label

class Card:
    def __init__(self, name, description, cost, card_class="Colorless",
                 type="attack", rarity="common", art_path=None,
                 size=(420, 600)):
        self.w, self.h = size
        self.name = name
        self.description = description
        self.cost = cost
        self.card_class = card_class if card_class in CLASS_COLORS else "Colorless"
        self.type = type
        self.rarity = rarity
        self.art_path = art_path

    def render(self):
        card = Image.new("RGBA", (self.w, self.h), (30, 30, 30, 255))
        draw = ImageDraw.Draw(card)

        # Border color
        border_color = CLASS_COLORS.get(self.card_class, (150,150,150))
        draw.rounded_rectangle([(5,5),(self.w-5,self.h-5)], radius=28, outline=border_color+(255,), width=10)

        # Name bar
        name_bar_h = 60
        draw.rounded_rectangle([(20,20),(self.w-20,20+name_bar_h)], radius=12, fill=(20,20,20))
        bbox = draw.textbbox((0,0), self.name, font=FONT_NAME)
        name_w = bbox[2] - bbox[0]
        name_h = bbox[3] - bbox[1]
        draw.text(((self.w-name_w)/2, 20+(name_bar_h-name_h)/2),
                  self.name, font=FONT_NAME, fill=(255,255,255))

        # Cost circle
        c_r = 44
        cx, cy = 20 + c_r, 20 + name_bar_h//2
        draw.ellipse([(cx-c_r,cy-c_r),(cx+c_r,cy+c_r)], fill=(0,0,0), outline=(255,255,255), width=3)
        cost_text = str(self.cost)
        bbox = draw.textbbox((0,0), cost_text, font=FONT_COST)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        draw.text((cx - tw/2, cy - th/2), cost_text, font=FONT_COST, fill=(255,255,255))

        # Art area
        art_box = (30, 100, self.w-30, 360)
        if self.art_path and os.path.exists(self.art_path):
            art = Image.open(self.art_path).convert("RGBA")
            art = ImageOps.fit(art, (art_box[2]-art_box[0], art_box[3]-art_box[1]))
            card.paste(art, art_box[:2])
        else:
            draw.rectangle(art_box, fill=(45,45,45))
            for i in range(art_box[0], art_box[2], 15):
                draw.line([(i,art_box[1]), (art_box[0], art_box[1]+(i-art_box[0]))], fill=(60,60,60))

        # Description area
        desc_top = art_box[3] + 20
        desc_margin = 30
        text_box = (desc_margin, desc_top, self.w-desc_margin, self.h-80)
        wrapped = textwrap.fill(self.description, width=38)
        draw.multiline_text((text_box[0], text_box[1]), wrapped, font=FONT_BODY, fill=(235,235,235), spacing=4)

        # Bottom label (ASCII-safe)
        label_text = f"{self.type.upper()} - {self.rarity.upper()}"  # <-- replace bullet with dash
        bbox = draw.textbbox((0,0), label_text, font=FONT_LABEL)
        label_w = bbox[2] - bbox[0]
        label_h = bbox[3] - bbox[1]
        label_x = (self.w - label_w)/2
        label_y = self.h - label_h - 25
        draw.rectangle([(label_x-8,label_y-4),(label_x+label_w+8,label_y+label_h+4)], fill=border_color+(230,))
        draw.text((label_x,label_y), label_text, font=FONT_LABEL, fill=(15,15,15))

        return card

    def save(self, path):
        img = self.render()
        img.save(path)
        print(f"Saved: {path}")

# --- Interactive card creation ---
num_cards = int(input("How many cards would you like to create? "))

for i in range(num_cards):
    print(f"\n--- Card {i+1} ---")
    name = input("Card name: ")
    description = input("Card description: ")

    # Validate cost
    while True:
        cost = input("Card cost (number): ")
        if cost.isdigit():
            cost = int(cost)
            break
        print("Invalid input. Please enter a number.")

    # Validate class
    while True:
        print(f"Available classes: {', '.join(CLASS_COLORS.keys())}")
        card_class = input("Card class: ").title()
        if card_class in CLASS_COLORS:
            break
        print("Invalid class. Please choose from the list.")

    # Validate type
    while True:
        type_ = input("Card type (attack/skill/power/status): ").lower()
        if type_ in CARD_TYPES:
            break
        print("Invalid type. Please choose from attack, skill, power, or status.")

    # Validate rarity
    while True:
        rarity = input("Card rarity (common/uncommon/rare/curse): ").lower()
        if rarity in RARITIES:
            break
        print("Invalid rarity. Please choose from common, uncommon, rare, or curse.")

    # Artwork
    art_path = input("Artwork path (leave blank for none): ").strip() or None

    card = Card(name, description, cost, card_class=card_class, type=type_, rarity=rarity, art_path=art_path)
    save_path = os.path.join(OUTDIR, f"{name.replace(' ','_')}.png")
    card.save(save_path)

print("\nAll cards created!")
