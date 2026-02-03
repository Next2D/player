# DisplayObject

DisplayObject is the base class for all display objects in Next2D Player.

## Properties

### Position and Size

| Property | Type | Description |
|----------|------|-------------|
| `x` | Number | X coordinate (local coordinate of parent container) |
| `y` | Number | Y coordinate (local coordinate of parent container) |
| `width` | Number | Width (pixels) |
| `height` | Number | Height (pixels) |
| `scaleX` | Number | Horizontal scale (1.0 = 100%) |
| `scaleY` | Number | Vertical scale (1.0 = 100%) |
| `rotation` | Number | Rotation angle (degrees) |

### Display Control

| Property | Type | Description |
|----------|------|-------------|
| `visible` | Boolean | Show/hide (default: true) |
| `alpha` | Number | Transparency (0.0-1.0) |
| `blendMode` | String | Blend mode |
| `filters` | Array | Array of filters |
| `mask` | DisplayObject | Mask object |

### Hierarchy

| Property | Type | Description |
|----------|------|-------------|
| `parent` | DisplayObjectContainer | Parent container |
| `root` | DisplayObject | Root object |
| `stage` | Stage | Stage |
| `name` | String | Instance name |

## Methods

### getBounds(targetCoordinateSpace)

Gets the bounding rectangle in the specified coordinate system.

```typescript
import type { Rectangle, Stage } from "@next2d/player";

const bounds: Rectangle = displayObject.getBounds(stage);
console.log(bounds.x, bounds.y, bounds.width, bounds.height);
```

### globalToLocal(point)

Converts global coordinates to local coordinates.

```typescript
import { Point } from "@next2d/player";

const globalPoint: Point = new Point(100, 100);
const localPoint: Point = displayObject.globalToLocal(globalPoint);
```

### localToGlobal(point)

Converts local coordinates to global coordinates.

```typescript
import { Point } from "@next2d/player";

const localPoint: Point = new Point(0, 0);
const globalPoint: Point = displayObject.localToGlobal(localPoint);
```

### hitTestPoint(x, y, shapeFlag)

Performs collision detection with specified coordinates.

```typescript
// Detection with bounding box
const hit1: boolean = displayObject.hitTestPoint(100, 100, false);

// Detection with actual shape
const hit2: boolean = displayObject.hitTestPoint(100, 100, true);
```

### hitTestObject(obj)

Performs collision detection with another DisplayObject.

```typescript
if (obj1.hitTestObject(obj2)) {
  console.log("Collision detected");
}
```

## Blend Modes

| Constant | Description |
|----------|-------------|
| `BlendMode.NORMAL` | Normal display |
| `BlendMode.ADD` | Additive |
| `BlendMode.MULTIPLY` | Multiply |
| `BlendMode.SCREEN` | Screen |
| `BlendMode.DARKEN` | Darken |
| `BlendMode.LIGHTEN` | Lighten |
| `BlendMode.DIFFERENCE` | Difference |
| `BlendMode.OVERLAY` | Overlay |
| `BlendMode.HARDLIGHT` | Hard light |
| `BlendMode.INVERT` | Invert |
| `BlendMode.ALPHA` | Alpha |
| `BlendMode.ERASE` | Erase |

## Usage Example

```typescript
import { Sprite, BlurFilter } from "@next2d/player";
import type { Stage } from "@next2d/player";

const sprite: Sprite = new Sprite();

// Position and size
sprite.x = 100;
sprite.y = 200;
sprite.scaleX = 1.5;
sprite.scaleY = 1.5;
sprite.rotation = 30;

// Display control
sprite.alpha = 0.8;
sprite.visible = true;
sprite.blendMode = "add";

// Filters
sprite.filters = [
  new BlurFilter(4, 4)
];

// Add to stage
stage.addChild(sprite);
```

## Related

- [DisplayObjectContainer](./display-object-container.md)
- [MovieClip](./movie-clip.md)
- [Sprite](./sprite.md)
