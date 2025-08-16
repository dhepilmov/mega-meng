# Launcher Rotation System

## Overview
The launcher now features a complete rotation system with 20 configurable layers for PNG images. All images are centered using the dot mark as reference and can rotate independently.

## File Structure
```
/src/launcher/
├── launcher_UI.tsx          # Main launcher component
├── launcher_logic.tsx       # Core launcher logic and localStorage
├── launcher_hook.tsx        # React hooks for launcher state
├── launcher_effect.tsx      # Custom effect hooks
├── launcher_animation.tsx   # General animation utilities
├── launcher.css            # Launcher styles
├── dot_mark.tsx            # Center reference dot
├── rotate_config.tsx       # Rotation configuration (20 items)
├── rotate_logic.tsx        # Rotation positioning and logic
├── rotate_anim.tsx         # Rotation animation manager
└── res/                    # PNG image resources
    ├── clockBG.png         # Background clock layer
    ├── minutes_circle.png  # Minutes circle layer
    └── outer_circle.png    # Outer circle layer
```

## How to Add New PNG Images

1. **Add PNG file** to `/src/launcher/res/` folder
2. **Edit rotate_config.tsx** - find an unused item (item_4 to item_20)
3. **Update the configuration**:
   ```tsx
   {
     code: 'item_4',
     path: 'res/your_image.png',
     itemName: 'your_image',        // PNG filename without extension
     display: 'yes',                // 'yes' to show, 'no' to hide
     layer: 4,                      // Layer position (1 = bottom, 20 = top)
     itemSize: 60,                  // Size percentage from center
     rotationSpeed: 25,             // Seconds per full rotation
     rotation: 'clockwise',         // 'clockwise' or 'anti-clockwise'
     itemPositionX: 0,              // X offset percentage from center
     itemPositionY: 0,              // Y offset percentage from center
     tiltPosition: 0,               // Initial rotation angle
   }
   ```

## Configuration Properties

- **code**: Unique identifier (item_1 to item_20)
- **path**: File path relative to res/ folder
- **itemName**: PNG filename without extension
- **display**: 'yes' to show, 'no' to hide
- **layer**: Z-index layer (1 = bottom, 20 = top)
- **itemSize**: Size as percentage from center (50 = 50% of container)
- **rotationSpeed**: Seconds for one complete rotation
- **rotation**: Direction - 'clockwise' or 'anti-clockwise'
- **itemPositionX**: Horizontal offset percentage from center
- **itemPositionY**: Vertical offset percentage from center
- **tiltPosition**: Initial rotation angle in degrees

## Current Active Layers

1. **Layer 1**: clockBG (60s clockwise)
2. **Layer 2**: minutes_circle (30s clockwise)  
3. **Layer 3**: outer_circle (45s anti-clockwise)
4. **Layers 4-20**: Available for new images

## Features

- ✅ 20 configurable rotation layers
- ✅ Automatic PNG file detection
- ✅ Independent rotation speed and direction per item
- ✅ Centered positioning using dot mark reference
- ✅ Smooth CSS animations with performance optimization
- ✅ Hover to pause animation
- ✅ Responsive design
- ✅ TypeScript support with full type safety

## Performance Notes

- Images are dynamically imported only when needed
- CSS animations use `transform` for optimal performance
- `will-change` and `backface-visibility` optimizations applied
- Animation state can be paused/resumed globally