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

```javascript
const bounds = displayObject.getBounds(stage);
console.log(bounds.x, bounds.y, bounds.width, bounds.height);
```

### globalToLocal(point)

Converts global coordinates to local coordinates.

```javascript
const { Point } = next2d.geom;

const globalPoint = new Point(100, 100);
const localPoint = displayObject.globalToLocal(globalPoint);
```

### localToGlobal(point)

Converts local coordinates to global coordinates.

```javascript
const { Point } = next2d.geom;

const localPoint = new Point(0, 0);
const globalPoint = displayObject.localToGlobal(localPoint);
```

### hitTestPoint(x, y, shapeFlag)

Performs collision detection with specified coordinates.

```javascript
// Detection with bounding box
const hit1 = displayObject.hitTestPoint(100, 100, false);

// Detection with actual shape
const hit2 = displayObject.hitTestPoint(100, 100, true);
```

### hitTestObject(obj)

Performs collision detection with another DisplayObject.

```javascript
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

```javascript
const { Sprite } = next2d.display;
const { BlurFilter } = next2d.filters;

const sprite = new Sprite();

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

- [MovieClip](./movie-clip.md)
- [Sprite](./sprite.md)
