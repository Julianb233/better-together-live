#!/usr/bin/env python3
"""
Better Together Mobile - Asset Generator
Generates all required visual assets for App Store submission
"""

from PIL import Image, ImageDraw, ImageFont
import math

# Brand Colors from constants.ts
COLORS = {
    'primary': '#FF6B9D',      # Vibrant Pink
    'secondary': '#C44569',     # Deep Rose
    'accent': '#FFA07A',        # Coral/Salmon
    'background': '#FFFFFF',    # White
}

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_gradient(draw, width, height, color1, color2, vertical=False):
    """Create a gradient fill"""
    rgb1 = hex_to_rgb(color1)
    rgb2 = hex_to_rgb(color2)

    steps = height if vertical else width

    for i in range(steps):
        ratio = i / steps
        r = int(rgb1[0] * (1 - ratio) + rgb2[0] * ratio)
        g = int(rgb1[1] * (1 - ratio) + rgb2[1] * ratio)
        b = int(rgb1[2] * (1 - ratio) + rgb2[2] * ratio)

        if vertical:
            draw.rectangle([(0, i), (width, i + 1)], fill=(r, g, b))
        else:
            draw.rectangle([(i, 0), (i + 1, height)], fill=(r, g, b))

def draw_heart(draw, center_x, center_y, size, color, rotation=0):
    """Draw a heart shape"""
    # Heart path using bezier-like curves approximated with polygons
    scale = size / 100  # Base size 100

    points = []
    # Create heart shape using parametric equations
    for i in range(360):
        t = math.radians(i)
        # Heart curve equation
        x = 16 * math.sin(t) ** 3
        y = -(13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t))

        # Apply rotation
        if rotation != 0:
            rad = math.radians(rotation)
            x_rot = x * math.cos(rad) - y * math.sin(rad)
            y_rot = x * math.sin(rad) + y * math.cos(rad)
            x, y = x_rot, y_rot

        points.append((center_x + x * scale, center_y + y * scale))

    draw.polygon(points, fill=hex_to_rgb(color))

def draw_interlocking_hearts(draw, width, height, use_gradient=False):
    """Draw two interlocking hearts - the app's logo"""
    center_x = width // 2
    center_y = height // 2

    # Heart size based on canvas
    heart_size = min(width, height) * 0.35

    # Offset for interlocking effect
    offset = heart_size * 0.3

    if use_gradient:
        # Create hearts with gradient colors
        # Left heart (slightly rotated left)
        draw_heart(draw, center_x - offset, center_y, heart_size, COLORS['primary'], rotation=-10)
        # Right heart (slightly rotated right)
        draw_heart(draw, center_x + offset, center_y, heart_size, COLORS['accent'], rotation=10)
    else:
        # Simpler version for smaller icons
        draw_heart(draw, center_x - offset, center_y, heart_size, COLORS['primary'], rotation=-10)
        draw_heart(draw, center_x + offset, center_y, heart_size, COLORS['accent'], rotation=10)

def create_app_icon(output_path, size=1024):
    """
    Create the main app icon - 1024x1024
    Two interlocking hearts in gradient pink to coral
    """
    print(f"Creating app icon: {output_path}")

    # Create white background
    img = Image.new('RGB', (size, size), hex_to_rgb(COLORS['background']))
    draw = ImageDraw.Draw(img)

    # Draw interlocking hearts
    draw_interlocking_hearts(draw, size, size, use_gradient=True)

    # Save
    img.save(output_path, 'PNG', quality=100)
    print(f"✓ Saved {output_path}")

def create_splash_screen(output_path, width=2048, height=2732):
    """
    Create splash screen - 2048x2732 (iPad Pro portrait)
    Centered logo with app name
    """
    print(f"Creating splash screen: {output_path}")

    # Create white background
    img = Image.new('RGB', (width, height), hex_to_rgb(COLORS['background']))
    draw = ImageDraw.Draw(img)

    # Draw hearts in center (smaller than full size)
    center_y = height // 2 - 100  # Slightly higher for text below
    heart_size = min(width, height) * 0.25

    offset = heart_size * 0.3
    center_x = width // 2

    draw_heart(draw, center_x - offset, center_y, heart_size, COLORS['primary'], rotation=-10)
    draw_heart(draw, center_x + offset, center_y, heart_size, COLORS['accent'], rotation=10)

    # Add "Better Together" text below (we'll use simple text rendering)
    # For production, you'd use a custom font, but we'll keep it simple
    try:
        # Try to use a nice font if available
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
    except:
        # Fallback to default font
        font = ImageFont.load_default()

    text = "Better Together"
    # Get text bounding box
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    text_x = (width - text_width) // 2
    text_y = center_y + heart_size + 80

    draw.text((text_x, text_y), text, fill=hex_to_rgb(COLORS['primary']), font=font)

    # Save
    img.save(output_path, 'PNG', quality=100)
    print(f"✓ Saved {output_path}")

def create_adaptive_icon(output_path, size=1024):
    """
    Create Android adaptive icon - 1024x1024 with transparency
    Foreground element only
    """
    print(f"Creating adaptive icon: {output_path}")

    # Create transparent background
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # Draw hearts (will be composited with Android's background)
    draw_interlocking_hearts(draw, size, size, use_gradient=True)

    # Save with transparency
    img.save(output_path, 'PNG', quality=100)
    print(f"✓ Saved {output_path}")

def create_favicon(output_path, size=256):
    """
    Create favicon - 256x256
    Simplified version of app icon
    """
    print(f"Creating favicon: {output_path}")

    # Create white background
    img = Image.new('RGB', (size, size), hex_to_rgb(COLORS['background']))
    draw = ImageDraw.Draw(img)

    # Draw simplified hearts
    draw_interlocking_hearts(draw, size, size, use_gradient=False)

    # Save
    img.save(output_path, 'PNG', quality=100)
    print(f"✓ Saved {output_path}")

def main():
    """Generate all assets"""
    import os

    # Base directory
    base_dir = "/root/github-repos/better-together-live/mobile/assets"

    # Ensure directory exists
    os.makedirs(base_dir, exist_ok=True)

    print("\n🎨 Better Together - Asset Generator")
    print("=" * 50)
    print(f"Brand Colors:")
    print(f"  Primary: {COLORS['primary']} (Vibrant Pink)")
    print(f"  Accent:  {COLORS['accent']} (Coral/Salmon)")
    print(f"  Background: {COLORS['background']} (White)")
    print("=" * 50)
    print()

    # Generate all assets
    assets = [
        ("icon.png", lambda: create_app_icon(f"{base_dir}/icon.png", 1024)),
        ("splash.png", lambda: create_splash_screen(f"{base_dir}/splash.png", 2048, 2732)),
        ("adaptive-icon.png", lambda: create_adaptive_icon(f"{base_dir}/adaptive-icon.png", 1024)),
        ("favicon.png", lambda: create_favicon(f"{base_dir}/favicon.png", 256)),
    ]

    for name, generator in assets:
        try:
            generator()
        except Exception as e:
            print(f"✗ Error creating {name}: {e}")

    print()
    print("=" * 50)
    print("✓ Asset generation complete!")
    print(f"📁 Assets saved to: {base_dir}")
    print("=" * 50)
    print()
    print("Next steps:")
    print("1. Update app.json to reference these assets")
    print("2. Test on iOS simulator and Android emulator")
    print("3. Verify assets meet App Store guidelines")
    print()

if __name__ == "__main__":
    main()
