# Shape

Shape is a class dedicated to vector graphics drawing. Unlike Sprite, it cannot hold child objects, but it is lightweight and offers better performance.

## Inheritance

```mermaid
classDiagram
    DisplayObject <|-- Shape

    class Shape {
        +graphics: Graphics
    }
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `graphics` | Graphics | Graphics drawing object |

## Difference Between Sprite and Shape

| Feature | Shape | Sprite |
|---------|-------|--------|
| Child objects | Cannot hold | Can hold |
| Interaction | None | Click etc. possible |
| Performance | Lightweight | Slightly heavier |
| Use case | Static backgrounds, decorations | Buttons, containers |

## Usage Examples

### Basic Drawing

```typescript
import { Shape } from "@next2d/player";

const shape: Shape = new Shape();

// Filled rectangle
shape.graphics.beginFill(0x3498db);
shape.graphics.drawRect(0, 0, 150, 100);
shape.graphics.endFill();

stage.addChild(shape);
```

### Compound Shape Drawing

```typescript
import { Shape } from "@next2d/player";
import type { Graphics } from "@next2d/player";

const shape: Shape = new Shape();
const g: Graphics = shape.graphics;

// Background
g.beginFill(0xecf0f1);
g.drawRoundRect(0, 0, 200, 150, 10, 10);
g.endFill();

// Border
g.lineStyle(2, 0x2c3e50);
g.drawRoundRect(0, 0, 200, 150, 10, 10);

// Inner decoration
g.beginFill(0xe74c3c);
g.drawCircle(100, 75, 30);
g.endFill();

stage.addChild(shape);
```

### Path Drawing

```typescript
import { Shape } from "@next2d/player";
import type { Graphics } from "@next2d/player";

const shape: Shape = new Shape();
const g: Graphics = shape.graphics;

g.beginFill(0x9b59b6);

// Draw star shape
g.moveTo(50, 0);
g.lineTo(61, 35);
g.lineTo(98, 35);
g.lineTo(68, 57);
g.lineTo(79, 91);
g.lineTo(50, 70);
g.lineTo(21, 91);
g.lineTo(32, 57);
g.lineTo(2, 35);
g.lineTo(39, 35);
g.lineTo(50, 0);

g.endFill();

stage.addChild(shape);
```

### Bezier Curves

```typescript
import { Shape } from "@next2d/player";
import type { Graphics } from "@next2d/player";

const shape: Shape = new Shape();
const g: Graphics = shape.graphics;

g.lineStyle(3, 0x1abc9c);

// Quadratic bezier curve
g.moveTo(0, 100);
g.curveTo(50, 0, 100, 100);  // control point, end point

g.curveTo(150, 200, 200, 100);

stage.addChild(shape);
```

### Gradient Background

```typescript
import { Shape, Matrix } from "@next2d/player";
import type { Graphics } from "@next2d/player";

const shape: Shape = new Shape();
const g: Graphics = shape.graphics;

// Matrix for gradient
const matrix: Matrix = new Matrix();
matrix.createGradientBox(
  stage.stageWidth,
  stage.stageHeight,
  Math.PI / 2,  // 90 degrees (vertical)
  0, 0
);

// Radial gradient
g.beginGradientFill(
  "radial",
  [0x667eea, 0x764ba2],
  [1, 1],
  [0, 255],
  matrix
);
g.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
g.endFill();

// Place at back
stage.addChildAt(shape, 0);
```

### Dynamic Redrawing

```typescript
import { Shape } from "@next2d/player";
import type { Graphics } from "@next2d/player";

const shape: Shape = new Shape();
stage.addChild(shape);

let angle: number = 0;

// Redraw each frame
stage.addEventListener("enterFrame", (): void => {
  const g: Graphics = shape.graphics;

  // Clear previous drawing
  g.clear();

  // Draw at new position
  const x: number = 200 + Math.cos(angle) * 100;
  const y: number = 150 + Math.sin(angle) * 100;

  g.beginFill(0xe74c3c);
  g.drawCircle(x, y, 20);
  g.endFill();

  angle += 0.05;
});
```

### Composed of Multiple Shapes

```typescript
import { Shape } from "@next2d/player";

// Background layer
const bgShape: Shape = new Shape();
bgShape.graphics.beginFill(0x2c3e50);
bgShape.graphics.drawRect(0, 0, 400, 300);
bgShape.graphics.endFill();

// Decoration layer
const decorShape: Shape = new Shape();
decorShape.graphics.beginFill(0x3498db, 0.5);
decorShape.graphics.drawCircle(100, 100, 80);
decorShape.graphics.drawCircle(300, 200, 60);
decorShape.graphics.endFill();

// Front layer
const frontShape: Shape = new Shape();
frontShape.graphics.lineStyle(2, 0xecf0f1);
frontShape.graphics.drawRect(50, 50, 300, 200);

stage.addChild(bgShape);
stage.addChild(decorShape);
stage.addChild(frontShape);
```

## Performance Tips

1. **Use Shape for static drawing**: Shape is optimal for backgrounds and decorations that don't need interaction
2. **Minimize drawing**: Only draw once if content doesn't change frequently
3. **Use clear()**: Always call clear() when dynamically redrawing
4. **Cache complex shapes**: Cache drawing with cacheAsBitmap property

```typescript
// Cache complex shapes as bitmap
shape.cacheAsBitmap = true;
```

## Related

- [DisplayObject](./display-object.md)
- [Sprite](./sprite.md)
- [Filters](./filters/index.md)
