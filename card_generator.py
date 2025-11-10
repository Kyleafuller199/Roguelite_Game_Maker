from PIL import Image, ImageDraw, ImageFont, ImageOps
import os, textwrap

# Output folder
OUTDIR = "sts_class_cards"
os.makedirs(OUTDIR, exist_ok=True)

# Colors by character class (STS-style)
CLASS_COLORS = {
    "A": (200, 50, 50),      # red
    "B": (60, 180, 90),        # green
    "C": (80, 150, 255),       # blue
    "D": (180, 90, 200),      # purple
    "E": (180, 180, 180),   # gray
    "F": (60, 40, 60)           # dark
}

# Utility font loader
def font(sz, bold=False):
    try:
        if bold:
            return ImageFont.truetype("DejaVuSans-Bold.ttf", sz)
        return ImageFont.truetype("DejaVuSans.ttf", sz)
    except Exception:
        return ImageFont.load_default()

FONT_NAME = font(22, True)
FONT_BODY = font(17)
FONT_COST = font(40, True)
FONT_LABEL = font(16, True)

class Card:
    def __init__(self, name, description, cost, card_class="colorless", 
                 type="attack", rarity="common", art_path=None,
                 size=(420, 600)):
        self.name = name
        self.description = description
        self.cost = cost
        self.card_class = card_class if card_class in CLASS_COLORS else "colorless"
        self.type = type
        self.rarity = rarity
        self.art_path = art_path
        self.w, self.h = size

    def render(self):
        card = Image.new("RGBA", (self.w, self.h), (30, 30, 30, 255))
        draw = ImageDraw.Draw(card)

        # Border color based on class
        border_color = CLASS_COLORS[self.card_class]
        draw.rounded_rectangle(
            [(5,5),(self.w-5,self.h-5)], radius=28, outline=border_color+(255,), width=10
        )

        # Name bar
        name_bar_h = 60
        draw.rounded_rectangle([(20,20),(self.w-20,20+name_bar_h)], radius=12, fill=(20,20,20))
        name_w, name_h = draw.textsize(self.name, font=FONT_NAME)
        draw.text(((self.w-name_w)/2, 20+(name_bar_h-name_h)/2),
                  self.name, font=FONT_NAME, fill=(255,255,255))

        # Cost circle
        c_r = 44
        cx, cy = 20 + c_r, 20 + name_bar_h//2
        draw.ellipse([(cx-c_r,cy-c_r),(cx+c_r,cy+c_r)], fill=(0,0,0), outline=(255,255,255), width=3)
        cost_text = str(self.cost)
        tw, th = draw.textsize(cost_text, font=FONT_COST)
        draw.text((cx - tw/2, cy - th/2), cost_text, font=FONT_COST, fill=(255,255,255))

        # Art area
        art_box = (30, 100, self.w-30, 360)
        if self.art_path and os.path.exists(self.art_path):
            art = Image.open(self.art_path).convert("RGBA")
            art = ImageOps.fit(art, (art_box[2]-art_box[0], art_box[3]-art_box[1]))
            card.paste(art, art_box[:2])
        else:
            # Placeholder art background
            draw.rectangle(art_box, fill=(45,45,45))
            for i in range(art_box[0], art_box[2], 15):
                draw.line([(i,art_box[1]), (art_box[0], art_box[1]+(i-art_box[0]))], fill=(60,60,60))

        # Description area
        desc_top = art_box[3] + 20
        desc_margin = 30
        text_box = (desc_margin, desc_top, self.w-desc_margin, self.h-80)
        wrapped = textwrap.fill(self.description, width=38)
        draw.multiline_text((text_box[0], text_box[1]), wrapped, font=FONT_BODY, fill=(235,235,235), spacing=4)

        # Bottom label (Type • Rarity)
        label_text = f"{self.type.upper()} • {self.rarity.upper()}"
        label_w, label_h = draw.textsize(label_text, font=FONT_LABEL)
        label_x = (self.w - label_w)/2
        label_y = self.h - label_h - 25
        draw.rectangle([(label_x-8,label_y-4),(label_x+label_w+8,label_y+label_h+4)], fill=border_color+(230,))
        draw.text((label_x,label_y), label_text, font=FONT_LABEL, fill=(15,15,15))

        return card

    def save(self, path):
        img = self.render()
        img.save(path)
        print(f"Saved: {path}")

# --- Create example cards ---
cards = [
    Card("Strike", "Deal 6 damage.", 1, card_class="A", type="attack", rarity="common"),
    Card("Defend", "Gain 5 Block.", 1, card_class="B", type="skill", rarity="common"),
    Card("Zap", "Channel 1 Lightning.", 1, card_class="C", type="skill", rarity="common"),
    Card("Eruption", "Enter Wrath. Deal 9 damage.", 2, card_class="D", type="attack", rarity="uncommon"),
    Card("Bandage Up", "Heal 4 HP. Exhaust.", 0, card_class="E", type="skill", rarity="uncommon"),
    Card("Regret", "At the end of your turn, lose HP equal to number of cards in hand.", 0, card_class="F", type="status", rarity="curse"),
]

for c in cards:
    path = os.path.join(OUTDIR, f"{c.name.replace(' ','_')}.png")
    c.save(path)
