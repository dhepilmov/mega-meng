# Launcher Dual Rotation System

## Overview
The launcher features a sophisticated dual rotation system with 20 configurable layers for PNG images. Each PNG can have TWO independent rotations - allowing for complex animations where images can rotate on their own axis AND orbit around the app center simultaneously.

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
├── rotate_config.tsx       # Dual rotation configuration (20 items)
├── rotate_logic.tsx        # Dual rotation positioning and logic
├── rotate_anim.tsx         # Dual rotation animation manager
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
     itemCode: 'item_4',
     itemName: 'your_image',           // PNG filename without extension
     itemPath: 'res/your_image.png',
     itemLayer: 4,                     // Layer position (1 = back, 20 = front)
     itemSize: 60,                     // Size percentage from its own center
     itemDisplay: 'yes',               // 'yes' to show PNG, 'no' or '' to hide PNG
     rotation1: {
       enabled: 'yes',                 // 'yes' to animate, 'no' for static display
       itemTiltPosition: 0,            // Initial tilt angle
       itemAxisX: 50,                  // Rotation axis X (% from image center)
       itemAxisY: 50,                  // Rotation axis Y (% from image center)
       itemPositionX: 0,               // Position X (% from dot mark)
       itemPositionY: 0,               // Position Y (% from dot mark)
       rotationSpeed: 30,              // Seconds per full rotation
       rotationWay: '+',               // '+' clockwise, '-' anti-clockwise, 'no'/'' = no rotate
     },
     rotation2: {
       enabled: 'no',                  // Enable/disable second rotation
       itemTiltPosition: 0,
       itemAxisX: 75,                  // Different axis for orbital movement
       itemAxisY: 25,
       itemPositionX: 20,              // Orbital offset from center
       itemPositionY: -10,
       rotationSpeed: 45,
       rotationWay: '-',
     },
   }
   ```

## Dual Rotation System Properties

### Basic Properties
- **itemCode**: Unique identifier (item_1 to item_20)
- **itemName**: PNG filename without extension
- **itemPath**: File path relative to res/ folder
- **itemLayer**: Z-index layer (1 = back, 20 = front)
- **itemSize**: Size as percentage from its own center
- **itemDisplay**: 'yes' to show PNG, 'no' or '' to hide PNG completely

### ROTATION 1 Properties
- **enabled**: 'yes' to animate, 'no' to display static (PNG still shows if itemDisplay is 'yes')
- **itemTiltPosition**: Initial rotation angle in degrees
- **itemAxisX**: Rotation axis X position (% from image's own center)
- **itemAxisY**: Rotation axis Y position (% from image's own center)
- **itemPositionX**: Horizontal offset percentage from dot mark center
- **itemPositionY**: Vertical offset percentage from dot mark center
- **rotationSpeed**: Seconds for one complete rotation
- **rotationWay**: '+' for clockwise, '-' for anti-clockwise, 'no'/'' for no rotation

### ROTATION 2 Properties
Same properties as ROTATION 1, allowing for independent dual rotation behavior.

## Animation Capabilities

### Single Rotation Examples:
- **Self-spinning**: Image rotates on its own center (axis 50%, 50%)
- **Off-center spinning**: Image rotates on custom axis point (axis 25%, 75%)
- **Orbital motion**: Image orbits around app center with position offsets
- **Static positioning**: No rotation, just positioned

### Dual Rotation Examples:
- **Planet system**: ROTATION 1 = self-spin, ROTATION 2 = orbit around center
- **Complex gears**: Different axis points and speeds for mechanical effects
- **Layered motion**: Combine different rotation behaviors for rich animations

## Current Active Layers

1. **Layer 1**: clockBG (60s clockwise, self-rotation only)
2. **Layer 2**: minutes_circle (30s clockwise, self-rotation only)  
3. **Layer 3**: outer_circle (45s anti-clockwise, self-rotation only)
4. **Layers 4-20**: Available for new dual-rotation images

## Advanced Features

- ✅ **Dual independent rotations** per PNG
- ✅ **Custom rotation axis** within each image
- ✅ **Flexible positioning** relative to app center
- ✅ **Direction control** (clockwise/anti-clockwise/none)
- ✅ **Speed control** (seconds per rotation)
- ✅ **Layer management** (20 configurable layers)
- ✅ **Dynamic image loading** with existence checking
- ✅ **Performance optimizations** (CSS transforms, will-change)
- ✅ **Hover to pause** individual animations
- ✅ **TypeScript support** with complete type safety

## Performance Notes

- Images are dynamically imported only when needed
- CSS animations use `transform` for optimal performance
- `will-change` and `backface-visibility` optimizations
- Multiple animations can run simultaneously without performance issues
- Animation state can be controlled globally or per-item

## Usage Examples

### Display Static Image (No Animation)
```tsx
itemDisplay: 'yes'
rotation1: { enabled: 'no', itemAxisX: 50, itemAxisY: 50 }
rotation2: { enabled: 'no' }
```

### Simple Self-Rotation
```tsx
itemDisplay: 'yes'
rotation1: { enabled: 'yes', itemAxisX: 50, itemAxisY: 50, rotationSpeed: 20, rotationWay: '+' }
rotation2: { enabled: 'no' }
```

### Orbital Motion
```tsx
itemDisplay: 'yes'
rotation1: { enabled: 'yes', itemPositionX: 30, itemPositionY: 0, rotationSpeed: 15, rotationWay: '+' }
rotation2: { enabled: 'no' }
```

### Planet System (Dual Rotation)
```tsx
itemDisplay: 'yes'
rotation1: { enabled: 'yes', itemAxisX: 50, itemAxisY: 50, rotationSpeed: 5, rotationWay: '+' }  // Self-spin
rotation2: { enabled: 'yes', itemPositionX: 40, itemPositionY: 0, rotationSpeed: 20, rotationWay: '+' }  // Orbit
```

### Hide PNG Completely
```tsx
itemDisplay: 'no'
// rotation settings are ignored when itemDisplay is 'no'
```