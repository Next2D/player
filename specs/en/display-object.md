# DisplayObject

DisplayObject is the base class for all display objects in Next2D Player.

## Properties

### Read-only Properties

| Property | Type | Description |
|----------|------|-------------|
| `instanceId` | number | Unique instance ID of DisplayObject |
| `isSprite` | boolean | Returns whether Sprite functions are possessed |
| `isInteractive` | boolean | Returns whether InteractiveObject functions are possessed |
| `isContainerEnabled` | boolean | Returns whether the display object has container functionality |
| `isTimelineEnabled` | boolean | Returns whether the display object has MovieClip functionality |
| `isShape` | boolean | Returns whether the display object has Shape functionality |
| `isVideo` | boolean | Returns whether the display object has Video functionality |
| `isText` | boolean | Returns whether the display object has Text functionality |
| `concatenatedMatrix` | Matrix | Combined transformation matrix up to root level |
| `dropTarget` | DisplayObject \| null | Display object over which the sprite is being dragged or dropped |
| `loaderInfo` | LoaderInfo \| null | Loading information for the file to which this display object belongs |
| `mouseX` | number | X coordinate of the mouse relative to the DisplayObject's reference point (pixels) |
| `mouseY` | number | Y coordinate of the mouse relative to the DisplayObject's reference point (pixels) |
| `root` | MovieClip \| Sprite \| null | The root DisplayObjectContainer of the DisplayObject |

### Read-write Properties

| Property | Type | Description |
|----------|------|-------------|
| `dictionaryId` | number | Source ID of DisplayObject (default: -1) |
| `placeId` | number | ID of the PlaceObject of the display object (default: -1) |
| `placeObject` | IPlaceObject \| null | PlaceObject of the current frame of the display object |
| `characterId` | number | Character ID used for construction (default: -1) |
| `clipDepth` | number | Depth of the mask target (default: 0) |
| `name` | string | Name. Used by getChildByName() (default: "") |
| `startFrame` | number | Start frame (default: 1) |
| `endFrame` | number | End frame (default: 0) |
| `changed` | boolean | Indicates whether any changes related to drawing have been made (default: true) |
| `uniqueKey` | string | Unique key used for caching |
| `isMask` | boolean | Indicates whether the DisplayObject is set as a mask (default: false) |
| `parent` | Sprite \| MovieClip \| null | The DisplayObjectContainer parent of this DisplayObject |
| `alpha` | number | Alpha transparency value (0.0-1.0, default: 1.0) |
| `blendMode` | string | Blend mode to use (default: BlendMode.NORMAL) |
| `filters` | Array \| null | Array of filter objects associated with the display object |
| `height` | number | Height of the display object (in pixels) |
| `width` | number | Width of the display object (in pixels) |
| `colorTransform` | ColorTransform | ColorTransform of the display object |
| `matrix` | Matrix | Matrix of the display object |
| `rotation` | number | Rotation angle of the DisplayObject instance (in degrees) |
| `scale9Grid` | Rectangle \| null | Currently active scaling grid |
| `scaleX` | number | Horizontal scale value of the object applied from the reference point |
| `scaleY` | number | Vertical scale value of the object applied from the reference point |
| `visible` | boolean | Whether the display object is visible (default: true) |
| `x` | number | X coordinate relative to the local coordinates of the parent DisplayObjectContainer |
| `y` | number | Y coordinate relative to the local coordinates of the parent DisplayObjectContainer |

## Methods

| Method | Return Type | Description |
|--------|-------------|-------------|
| `getBounds(targetDisplayObject)` | Rectangle | Returns a rectangle that defines the area of the display object relative to the coordinate system of the specified DisplayObject |
| `globalToLocal(point)` | Point | Converts the point object from Stage (global) coordinates to the display object's (local) coordinates |
| `localToGlobal(point)` | Point | Converts the point object from the display object's (local) coordinates to Stage (global) coordinates |
| `hitTestObject(targetDisplayObject)` | boolean | Evaluates a DisplayObject's drawing range to see if it overlaps or intersects |
| `hitTestPoint(x, y, shapeFlag)` | boolean | Evaluates the display object to see if it overlaps or intersects with the point specified by x and y parameters |
| `getLocalVariable(key)` | any | Get a value from the local variable space of the class |
| `setLocalVariable(key, value)` | void | Store values in the local variable space of the class |
| `hasLocalVariable(key)` | boolean | Determines if there is a value in the local variable space of the class |
| `deleteLocalVariable(key)` | void | Remove values from the local variable space of the class |
| `getGlobalVariable(key)` | any | Get a value from the global variable space |
| `setGlobalVariable(key, value)` | void | Save values to global variable space |
| `hasGlobalVariable(key)` | boolean | Determines if there is a value in the global variable space |
| `deleteGlobalVariable(key)` | void | Remove values from global variable space |
| `clearGlobalVariable()` | void | Clear all values in the global variable space |
| `remove()` | void | Removes the parent-child relationship |

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

### Coordinate Transformation Example

```typescript
const { Point } = next2d.geom;

// Convert global coordinates to local coordinates
const globalPoint = new Point(100, 100);
const localPoint = displayObject.globalToLocal(globalPoint);

// Convert local coordinates to global coordinates
const localPos = new Point(0, 0);
const globalPos = displayObject.localToGlobal(localPos);
```

### Collision Detection Example

```typescript
// Detection with bounding box
const hit1 = displayObject.hitTestPoint(100, 100, false);

// Detection with actual shape
const hit2 = displayObject.hitTestPoint(100, 100, true);

// Collision detection with another DisplayObject
if (obj1.hitTestObject(obj2)) {
    console.log("Collision detected");
}
```

### Variable Operations Example

```typescript
// Local variable operations
displayObject.setLocalVariable("score", 100);
const score = displayObject.getLocalVariable("score");
if (displayObject.hasLocalVariable("score")) {
    displayObject.deleteLocalVariable("score");
}

// Global variable operations
displayObject.setGlobalVariable("gameState", "playing");
const state = displayObject.getGlobalVariable("gameState");
displayObject.clearGlobalVariable(); // Clear all
```

## Related

- [MovieClip](./movie-clip.md)
- [Sprite](./sprite.md)
