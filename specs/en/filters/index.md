# Filters

Next2D Player provides various visual filters that can be applied to DisplayObjects.

## Applying Filters

```typescript
import { next2d } from "@next2d/player";
import type { Sprite } from "@next2d/player";

const sprite: Sprite = new next2d.display.Sprite();

// Single filter
sprite.filters = [new next2d.filters.BlurFilter(4, 4)];

// Multiple filters
sprite.filters = [
  new next2d.filters.DropShadowFilter(4, 45, 0x000000, 0.5),
  new next2d.filters.GlowFilter(0xff0000, 1, 8, 8)
];

// Remove filters
sprite.filters = null;
```

## Available Filters

| Filter | Description |
|--------|-------------|
| [BlurFilter](./blur.md) | Blur effect |
| [DropShadowFilter](./drop-shadow.md) | Drop shadow effect |
| [GlowFilter](./glow.md) | Glow effect |
| [BevelFilter](./bevel.md) | Bevel effect |
| [ColorMatrixFilter](./color-matrix.md) | Color matrix transformation |
| [ConvolutionFilter](./convolution.md) | Convolution effect |
| [DisplacementMapFilter](./displacement-map.md) | Displacement map effect |
| [GradientBevelFilter](./gradient-bevel.md) | Gradient bevel effect |
| [GradientGlowFilter](./gradient-glow.md) | Gradient glow effect |

## BlurFilter

Applies a blur effect.

```typescript
new next2d.filters.BlurFilter(blurX, blurY, quality);
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| blurX | Number | 4 | Horizontal blur amount |
| blurY | Number | 4 | Vertical blur amount |
| quality | Number | 1 | Number of blur passes |

## DropShadowFilter

Applies a drop shadow effect.

```typescript
new next2d.filters.DropShadowFilter(
  distance, angle, color, alpha,
  blurX, blurY, strength, quality,
  inner, knockout, hideObject
);
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| distance | Number | 4 | Shadow offset distance |
| angle | Number | 45 | Shadow angle (degrees) |
| color | uint | 0x000000 | Shadow color |
| alpha | Number | 1 | Shadow transparency |
| blurX | Number | 4 | Horizontal blur amount |
| blurY | Number | 4 | Vertical blur amount |
| strength | Number | 1 | Shadow strength |
| quality | Number | 1 | Number of blur passes |
| inner | Boolean | false | Inner shadow |
| knockout | Boolean | false | Knockout effect |
| hideObject | Boolean | false | Hide object |

## GlowFilter

Applies a glow effect.

```typescript
new next2d.filters.GlowFilter(
  color, alpha, blurX, blurY,
  strength, quality, inner, knockout
);
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| color | uint | 0xff0000 | Glow color |
| alpha | Number | 1 | Glow transparency |
| blurX | Number | 6 | Horizontal blur amount |
| blurY | Number | 6 | Vertical blur amount |
| strength | Number | 2 | Glow strength |
| quality | Number | 1 | Number of blur passes |
| inner | Boolean | false | Inner glow |
| knockout | Boolean | false | Knockout effect |

## Usage Examples

### Button Hover Effect

```typescript
import type { Sprite } from "@next2d/player";

const button: Sprite = new next2d.display.Sprite();

button.addEventListener("rollOver", (): void => {
  button.filters = [
    new next2d.filters.GlowFilter(0x00ff00, 0.8, 10, 10)
  ];
});

button.addEventListener("rollOut", (): void => {
  button.filters = null;
});
```

### Text with Shadow

```typescript
import type { TextField } from "@next2d/player";

const textField: TextField = new next2d.text.TextField();
textField.text = "Hello World";
textField.filters = [
  new next2d.filters.DropShadowFilter(2, 45, 0x000000, 0.5, 2, 2)
];
```

### Combined Filters

```typescript
sprite.filters = [
  // Outer glow
  new next2d.filters.GlowFilter(0x0088ff, 0.8, 15, 15, 2, 1, false),
  // Drop shadow
  new next2d.filters.DropShadowFilter(4, 45, 0x000000, 0.6, 4, 4),
  // Slight blur
  new next2d.filters.BlurFilter(1, 1, 1)
];
```

## Related

- [DisplayObject](../display-object.md)
- [MovieClip](../movie-clip.md)
