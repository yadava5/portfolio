"""Generate an Open Graph thumbnail (1200×630) for the portfolio site."""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import os

W, H = 1200, 630
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "og-image.png")

# ── Colours from the portfolio CSS vars ──
BG = (3, 0, 20)  # --background: #030014
PURPLE = (139, 92, 246)  # --accent-primary: #8b5cf6
CYAN = (6, 182, 212)  # --accent-secondary: #06b6d4
WHITE = (240, 240, 245)  # --foreground: #f0f0f5
MUTED = (160, 160, 176)  # --foreground-muted: #a0a0b0


def lerp_color(c1: tuple, c2: tuple, t: float) -> tuple:
    return tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))


def draw_gradient_circle(draw: ImageDraw.Draw, cx: int, cy: int, r: int, color: tuple, alpha_max: int = 90):
    """Draw a soft radial glow."""
    for i in range(r, 0, -2):
        t = i / r
        a = int(alpha_max * (1 - t) ** 2)
        fill = (*color, a)
        draw.ellipse([cx - i, cy - i, cx + i, cy + i], fill=fill)


def generate():
    img = Image.new("RGBA", (W, H), (*BG, 255))
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # ── Background glow orbs ──
    draw_gradient_circle(draw, 200, 150, 350, PURPLE, alpha_max=70)
    draw_gradient_circle(draw, 1000, 480, 300, CYAN, alpha_max=55)
    draw_gradient_circle(draw, 600, 320, 250, PURPLE, alpha_max=35)

    # Blur the glow layer for softness
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=60))
    img = Image.alpha_composite(img, overlay)

    # ── Grid lines (subtle) ──
    grid = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    grid_draw = ImageDraw.Draw(grid)
    for x in range(0, W, 60):
        grid_draw.line([(x, 0), (x, H)], fill=(*WHITE, 8), width=1)
    for y in range(0, H, 60):
        grid_draw.line([(0, y), (W, y)], fill=(*WHITE, 8), width=1)
    img = Image.alpha_composite(img, grid)

    # ── Floating dots / particles ──
    particles = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    p_draw = ImageDraw.Draw(particles)
    import random
    random.seed(42)
    for _ in range(40):
        px = random.randint(0, W)
        py = random.randint(0, H)
        size = random.randint(1, 3)
        alpha = random.randint(30, 90)
        color = PURPLE if random.random() > 0.5 else CYAN
        p_draw.ellipse([px - size, py - size, px + size, py + size], fill=(*color, alpha))
    img = Image.alpha_composite(img, particles)

    # ── Holographic border accent (top & bottom strips) ──
    border = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(border)
    for x in range(W):
        t = x / W
        c = lerp_color(PURPLE, CYAN, t)
        b_draw.line([(x, 0), (x, 3)], fill=(*c, 200))
        b_draw.line([(x, H - 3), (x, H)], fill=(*c, 200))
    img = Image.alpha_composite(img, border)

    # ── Text layer ──
    text_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    t_draw = ImageDraw.Draw(text_layer)

    # Try to use a nice font, fall back to default
    def get_font(size: int, bold: bool = False):
        paths = [
            "/System/Library/Fonts/SFPro-Bold.otf" if bold else "/System/Library/Fonts/SFPro-Regular.otf",
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
        ]
        for p in paths:
            if os.path.exists(p):
                try:
                    return ImageFont.truetype(p, size)
                except Exception:
                    continue
        return ImageFont.load_default(size=size)

    font_name = get_font(72, bold=True)
    font_title = get_font(28, bold=False)
    font_tag = get_font(20, bold=False)

    # "AY" monogram — top-left with glow
    mono_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    m_draw = ImageDraw.Draw(mono_layer)
    m_draw.text((70, 45), "AY", fill=(*PURPLE, 255), font=get_font(36, bold=True))
    img = Image.alpha_composite(img, mono_layer)

    # Main name
    name = "Ayush Yadav"
    bbox = t_draw.textbbox((0, 0), name, font=font_name)
    tw = bbox[2] - bbox[0]
    name_x = (W - tw) // 2
    name_y = 200

    # Glow behind name
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)
    g_draw.text((name_x, name_y), name, fill=(*PURPLE, 80), font=font_name)
    glow = glow.filter(ImageFilter.GaussianBlur(radius=15))
    img = Image.alpha_composite(img, glow)

    # Actual name text
    t_draw.text((name_x, name_y), name, fill=(*WHITE, 255), font=font_name)

    # Subtitle
    subtitle = "Data Engineer & Full-Stack Developer"
    bbox2 = t_draw.textbbox((0, 0), subtitle, font=font_title)
    tw2 = bbox2[2] - bbox2[0]
    sub_x = (W - tw2) // 2
    sub_y = name_y + 90
    t_draw.text((sub_x, sub_y), subtitle, fill=(*MUTED, 255), font=font_title)

    # Gradient line under subtitle
    line_y = sub_y + 50
    line_w = 300
    line_x = (W - line_w) // 2
    for x in range(line_w):
        t = x / line_w
        c = lerp_color(PURPLE, CYAN, t)
        t_draw.line([(line_x + x, line_y), (line_x + x, line_y + 2)], fill=(*c, 200))

    # Tags / pills
    tags = ["Python", "SQL", "AWS", "React", "Data Pipelines", "ML"]
    tag_font = font_tag
    pill_y = line_y + 30
    # Measure total width
    pill_gap = 16
    pill_pad_x = 20
    pill_pad_y = 8
    pills = []
    total_w = 0
    for tag in tags:
        bb = t_draw.textbbox((0, 0), tag, font=tag_font)
        tw = bb[2] - bb[0]
        th = bb[3] - bb[1]
        pw = tw + pill_pad_x * 2
        ph = th + pill_pad_y * 2
        pills.append((tag, pw, ph, tw, th))
        total_w += pw + pill_gap
    total_w -= pill_gap
    start_x = (W - total_w) // 2
    cx = start_x
    for tag, pw, ph, tw, th in pills:
        # Pill background
        r = ph // 2
        t_draw.rounded_rectangle(
            [cx, pill_y, cx + pw, pill_y + ph],
            radius=r,
            fill=(255, 255, 255, 15),
            outline=(*PURPLE, 80),
            width=1,
        )
        # Pill text
        tx = cx + (pw - tw) // 2
        ty = pill_y + (ph - th) // 2 - 2
        t_draw.text((tx, ty), tag, fill=(*WHITE, 200), font=tag_font)
        cx += pw + pill_gap

    # Website url at bottom
    url = "yadava5.github.io/portfolio"
    bbox_url = t_draw.textbbox((0, 0), url, font=font_tag)
    uw = bbox_url[2] - bbox_url[0]
    t_draw.text(((W - uw) // 2, H - 60), url, fill=(*MUTED, 180), font=font_tag)

    img = Image.alpha_composite(img, text_layer)

    # ── Save ──
    final = img.convert("RGB")
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    final.save(OUT, "PNG", optimize=True)
    print(f"✓ OG image saved to {OUT} ({W}×{H})")


if __name__ == "__main__":
    generate()
