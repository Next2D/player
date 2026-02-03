# Filters

Next2D Player provides various visual filters that can be applied to DisplayObjects.

## Applying Filters

```javascript
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

## BlurFilter

Applies a blur effect.

```javascript
const { BlurFilter } = next2d.filters;

new BlurFilter(blurX, blurY, quality);
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| blurX | Number | 4 | Horizontal blur amount |
| blurY | Number | 4 | Vertical blur amount |
| quality | Number | 1 | Number of blur passes |

## DropShadowFilter

Applies a drop shadow effect.

```javascript
const { DropShadowFilter } = next2d.filters;

new DropShadowFilter(
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

```javascript
const { GlowFilter } = next2d.filters;

new GlowFilter(
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

```javascript
const { Sprite } = next2d.display;
const { GlowFilter } = next2d.filters;

const button = new Sprite();

button.addEventListener("rollOver", function() {
    button.filters = [
        new GlowFilter(0x00ff00, 0.8, 10, 10)
    ];
});

button.addEventListener("rollOut", function() {
    button.filters = null;
});
```

### Text with Shadow

```javascript
const { TextField } = next2d.text;
const { DropShadowFilter } = next2d.filters;

const textField = new TextField();
textField.text = "Hello World";
textField.filters = [
    new DropShadowFilter(2, 45, 0x000000, 0.5, 2, 2)
];
```

### Combined Filters

```javascript
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

## Related

- [DisplayObject](../display-object.md)
- [MovieClip](../movie-clip.md)
