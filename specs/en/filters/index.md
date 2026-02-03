# Filters

Next2D Player provides various visual filters that can be applied to DisplayObjects.

## Applying Filters

```typescript
const { Sprite } = next2d.display;
const { BlurFilter, DropShadowFilter, GlowFilter } = next2d.filters;

const sprite = new Sprite();

// Single filter
sprite.filters = [new BlurFilter(4, 4)];

// Multiple filters
sprite.filters = [
    new DropShadowFilter(4, 45, 0x000000, 0.5),
    new GlowFilter(0xff0000, 1, 8, 8)
];

// Remove filters
sprite.filters = null;
```

## Available Filters

| Filter | Description |
|--------|-------------|
| BlurFilter | Blur effect |
| DropShadowFilter | Drop shadow effect |
| GlowFilter | Glow effect |
| BevelFilter | Bevel effect |
| ColorMatrixFilter | Color matrix transformation |
| ConvolutionFilter | Convolution effect |
| DisplacementMapFilter | Displacement map effect |
| GradientBevelFilter | Gradient bevel effect |
| GradientGlowFilter | Gradient glow effect |

---

## BlurFilter

Applies a blur effect. You can create blurs ranging from a softly unfocused look to a Gaussian blur.

```typescript
const { BlurFilter } = next2d.filters;

new BlurFilter(blurX, blurY, quality);
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| blurX | number | 4 | The amount of horizontal blur (0-255) |
| blurY | number | 4 | The amount of vertical blur (0-255) |
| quality | number | 1 | The number of times to perform the blur (0-15) |

---

## DropShadowFilter

Applies a drop shadow effect. Style options include inner shadow, outer shadow, and knockout mode.

```typescript
const { DropShadowFilter } = next2d.filters;

new DropShadowFilter(
    distance, angle, color, alpha,
    blurX, blurY, strength, quality,
    inner, knockout, hideObject
);
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| alpha | number | 1 | The alpha transparency value for the shadow (0-1) |
| angle | number | 45 | The angle of the shadow (-360 to 360 degrees) |
| blurX | number | 4 | The amount of horizontal blur (0-255) |
| blurY | number | 4 | The amount of vertical blur (0-255) |
| color | number | 0 | The color of the shadow (0x000000-0xFFFFFF) |
| distance | number | 4 | The offset distance for the shadow (-255 to 255 pixels) |
| hideObject | boolean | false | Indicates whether or not the object is hidden |
| inner | boolean | false | Specifies whether the shadow is an inner shadow |
| knockout | boolean | false | Specifies whether the object has a knockout effect |
| quality | number | 1 | The number of times to perform the blur (0-15) |
| strength | number | 1 | The strength of the imprint or spread (0-255) |

---

## GlowFilter

Applies a glow effect. Style options include inner glow, outer glow, and knockout mode.

```typescript
const { GlowFilter } = next2d.filters;

new GlowFilter(
    color, alpha, blurX, blurY,
    strength, quality, inner, knockout
);
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| alpha | number | 1 | The alpha transparency value for the glow (0-1) |
| blurX | number | 4 | The amount of horizontal blur (0-255) |
| blurY | number | 4 | The amount of vertical blur (0-255) |
| color | number | 0 | The color of the glow (0x000000-0xFFFFFF) |
| inner | boolean | false | Specifies whether the glow is an inner glow |
| knockout | boolean | false | Specifies whether the object has a knockout effect |
| quality | number | 1 | The number of times to perform the blur (0-15) |
| strength | number | 1 | The strength of the imprint or spread (0-255) |

---

## BevelFilter

Applies a bevel effect. Gives objects a three-dimensional look.

```typescript
const { BevelFilter } = next2d.filters;

new BevelFilter(
    distance, angle, highlightColor, highlightAlpha,
    shadowColor, shadowAlpha, blurX, blurY,
    strength, quality, type, knockout
);
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| angle | number | 45 | The angle of the bevel (-360 to 360 degrees) |
| blurX | number | 4 | The amount of horizontal blur (0-255) |
| blurY | number | 4 | The amount of vertical blur (0-255) |
| distance | number | 4 | The offset distance for the bevel (-255 to 255 pixels) |
| highlightAlpha | number | 1 | The alpha transparency value for the highlight color (0-1) |
| highlightColor | number | 0xFFFFFF | The highlight color of the bevel (0x000000-0xFFFFFF) |
| knockout | boolean | false | Specifies whether the object has a knockout effect |
| quality | number | 1 | The number of times to perform the blur (0-15) |
| shadowAlpha | number | 1 | The alpha transparency value for the shadow color (0-1) |
| shadowColor | number | 0 | The shadow color of the bevel (0x000000-0xFFFFFF) |
| strength | number | 1 | The strength of the imprint or spread (0-255) |
| type | string | "inner" | The placement of the bevel ("inner", "outer", "full") |

---

## ColorMatrixFilter

Applies a 4x5 color matrix transformation. Can adjust brightness, contrast, saturation, hue, and more.

```typescript
const { ColorMatrixFilter } = next2d.filters;

new ColorMatrixFilter(matrix);
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| matrix | number[] | Identity matrix | An array of 20 items for 4x5 color transform |

### Default Matrix Value (Identity Matrix)
```typescript
[
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, 1, 0
]
```

---

## ConvolutionFilter

Applies a matrix convolution filter effect. Can achieve blur, edge detection, sharpen, emboss, bevel, and more.

```typescript
const { ConvolutionFilter } = next2d.filters;

new ConvolutionFilter(
    matrixX, matrixY, matrix, divisor, bias,
    preserveAlpha, clamp, color, alpha
);
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| alpha | number | 0 | The alpha transparency value for out-of-bounds pixels (0-1) |
| bias | number | 0 | The amount of bias to add to the result of the matrix transformation |
| clamp | boolean | true | Indicates whether the image should be clamped |
| color | number | 0 | The hexadecimal color to substitute for out-of-bounds pixels (0x000000-0xFFFFFF) |
| divisor | number | 1 | The divisor used during matrix transformation |
| matrix | number[] \| null | null | An array of values used for matrix transformation |
| matrixX | number | 0 | The x dimension of the matrix (number of columns, 0-15) |
| matrixY | number | 0 | The y dimension of the matrix (number of rows, 0-15) |
| preserveAlpha | boolean | true | Indicates if the alpha channel is preserved without the filter effect |

---

## DisplacementMapFilter

Uses the pixel values from a BitmapData object to perform a displacement of an object.

```typescript
const { DisplacementMapFilter } = next2d.filters;

new DisplacementMapFilter(
    bitmapBuffer, bitmapWidth, bitmapHeight,
    mapPointX, mapPointY, componentX, componentY,
    scaleX, scaleY, mode, color, alpha
);
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| alpha | number | 0 | The alpha transparency value for out-of-bounds displacements (0-1) |
| bitmapBuffer | Uint8Array \| null | null | A buffer containing the displacement map data |
| bitmapHeight | number | 0 | The height of the displacement map image |
| bitmapWidth | number | 0 | The width of the displacement map image |
| color | number | 0 | The color to use for out-of-bounds displacements (0x000000-0xFFFFFF) |
| componentX | number | 0 | The color channel to use in the map image to displace the x result |
| componentY | number | 0 | The color channel to use in the map image to displace the y result |
| mapPointX | number | 0 | The X offset of the map point |
| mapPointY | number | 0 | The Y offset of the map point |
| mode | string | "wrap" | The mode for the filter ("wrap", "clamp", "ignore", "color") |
| scaleX | number | 0 | The multiplier to scale the x displacement result (-65535 to 65535) |
| scaleY | number | 0 | The multiplier to scale the y displacement result (-65535 to 65535) |

---

## GradientBevelFilter

Applies a gradient bevel effect. A beveled edge enhanced with gradient color makes objects look three-dimensional.

```typescript
const { GradientBevelFilter } = next2d.filters;

new GradientBevelFilter(
    distance, angle, colors, alphas, ratios,
    blurX, blurY, strength, quality, type, knockout
);
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| alphas | number[] \| null | null | An array of alpha transparency values for the corresponding colors (each value 0-1) |
| angle | number | 45 | The angle of the bevel (-360 to 360 degrees) |
| blurX | number | 4 | The amount of horizontal blur (0-255) |
| blurY | number | 4 | The amount of vertical blur (0-255) |
| colors | number[] \| null | null | An array of RGB hexadecimal color values to use in the gradient |
| distance | number | 4 | The offset distance for the bevel (-255 to 255 pixels) |
| knockout | boolean | false | Specifies whether the object has a knockout effect |
| quality | number | 1 | The number of times to perform the blur (0-15) |
| ratios | number[] \| null | null | An array of color distribution ratios for the corresponding colors (each value 0-255) |
| strength | number | 1 | The strength of the imprint or spread (0-255) |
| type | string | "inner" | The placement of the bevel ("inner", "outer", "full") |

---

## GradientGlowFilter

Applies a gradient glow effect. A realistic-looking glow with a controllable color gradient.

```typescript
const { GradientGlowFilter } = next2d.filters;

new GradientGlowFilter(
    distance, angle, colors, alphas, ratios,
    blurX, blurY, strength, quality, type, knockout
);
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| alphas | number[] \| null | null | An array of alpha transparency values for the corresponding colors (each value 0-1) |
| angle | number | 45 | The angle of the glow (-360 to 360 degrees) |
| blurX | number | 4 | The amount of horizontal blur (0-255) |
| blurY | number | 4 | The amount of vertical blur (0-255) |
| colors | number[] \| null | null | An array of RGB hexadecimal color values to use in the gradient |
| distance | number | 4 | The offset distance for the glow (-255 to 255 pixels) |
| knockout | boolean | false | Specifies whether the object has a knockout effect |
| quality | number | 1 | The number of times to perform the blur (0-15) |
| ratios | number[] \| null | null | An array of color distribution ratios for the corresponding colors (each value 0-255) |
| strength | number | 1 | The strength of the imprint or spread (0-255) |
| type | string | "outer" | The placement of the glow ("inner", "outer", "full") |

---

## Usage Examples

### Button Hover Effect

```typescript
const { Sprite } = next2d.display;
const { GlowFilter } = next2d.filters;

const button = new Sprite();

button.addEventListener("rollOver", () => {
    button.filters = [
        new GlowFilter(0x00ff00, 0.8, 10, 10)
    ];
});

button.addEventListener("rollOut", () => {
    button.filters = null;
});
```

### Text with Shadow

```typescript
const { TextField } = next2d.text;
const { DropShadowFilter } = next2d.filters;

const textField = new TextField();
textField.text = "Hello World";
textField.filters = [
    new DropShadowFilter(2, 45, 0x000000, 0.5, 2, 2)
];
```

### Combined Filters

```typescript
const { GlowFilter, DropShadowFilter, BlurFilter } = next2d.filters;

sprite.filters = [
    // Outer glow
    new GlowFilter(0x0088ff, 0.8, 15, 15, 2, 1, false),
    // Drop shadow
    new DropShadowFilter(4, 45, 0x000000, 0.6, 4, 4),
    // Slight blur
    new BlurFilter(1, 1, 1)
];
```

### Grayscale with ColorMatrixFilter

```typescript
const { ColorMatrixFilter } = next2d.filters;

// Grayscale transformation matrix
const grayscaleMatrix = [
    0.299, 0.587, 0.114, 0, 0,
    0.299, 0.587, 0.114, 0, 0,
    0.299, 0.587, 0.114, 0, 0,
    0,     0,     0,     1, 0
];

sprite.filters = [new ColorMatrixFilter(grayscaleMatrix)];
```

### Gradient Glow Effect

```typescript
const { GradientGlowFilter } = next2d.filters;

sprite.filters = [
    new GradientGlowFilter(
        4, 45,
        [0xff0000, 0x00ff00, 0x0000ff], // colors
        [1, 1, 1],                       // alphas
        [0, 128, 255],                   // ratios
        10, 10, 2, 1, "outer", false
    )
];
```

---

## Related

- [DisplayObject](../display-object.md)
- [MovieClip](../movie-clip.md)
