# 滤镜

Next2D Player 提供各种可应用于 DisplayObject 的视觉滤镜。

## 应用滤镜

```typescript
const { Sprite } = next2d.display;
const { BlurFilter, DropShadowFilter, GlowFilter } = next2d.filters;

const sprite = new Sprite();

// 单个滤镜
sprite.filters = [new BlurFilter(4, 4)];

// 多个滤镜
sprite.filters = [
    new DropShadowFilter(4, 45, 0x000000, 0.5),
    new GlowFilter(0xff0000, 1, 8, 8)
];

// 移除滤镜
sprite.filters = null;
```

## 可用滤镜

| 滤镜 | 说明 |
|------|------|
| BlurFilter | 模糊效果 |
| DropShadowFilter | 投影效果 |
| GlowFilter | 发光效果 |
| BevelFilter | 斜角效果 |
| ColorMatrixFilter | 颜色矩阵变换 |
| ConvolutionFilter | 卷积效果 |
| DisplacementMapFilter | 位移贴图效果 |
| GradientBevelFilter | 渐变斜角效果 |
| GradientGlowFilter | 渐变发光效果 |

---

## BlurFilter

应用模糊效果。您可以创建从柔和失焦到高斯模糊的各种模糊效果。

```typescript
const { BlurFilter } = next2d.filters;

new BlurFilter(blurX, blurY, quality);
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| blurX | number | 4 | 水平模糊量（0-255） |
| blurY | number | 4 | 垂直模糊量（0-255） |
| quality | number | 1 | 执行模糊的次数（0-15） |

---

## DropShadowFilter

应用投影效果。样式选项包括内阴影、外阴影和挖空模式。

```typescript
const { DropShadowFilter } = next2d.filters;

new DropShadowFilter(
    distance, angle, color, alpha,
    blurX, blurY, strength, quality,
    inner, knockout, hideObject
);
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| alpha | number | 1 | 阴影的 alpha 透明度值（0-1） |
| angle | number | 45 | 阴影的角度（-360 到 360 度） |
| blurX | number | 4 | 水平模糊量（0-255） |
| blurY | number | 4 | 垂直模糊量（0-255） |
| color | number | 0 | 阴影的颜色（0x000000-0xFFFFFF） |
| distance | number | 4 | 阴影的偏移距离（-255 到 255 像素） |
| hideObject | boolean | false | 指示对象是否被隐藏 |
| inner | boolean | false | 指定阴影是否为内阴影 |
| knockout | boolean | false | 指定对象是否具有挖空效果 |
| quality | number | 1 | 执行模糊的次数（0-15） |
| strength | number | 1 | 印记或扩展的强度（0-255） |

---

## GlowFilter

应用发光效果。样式选项包括内发光、外发光和挖空模式。

```typescript
const { GlowFilter } = next2d.filters;

new GlowFilter(
    color, alpha, blurX, blurY,
    strength, quality, inner, knockout
);
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| alpha | number | 1 | 发光的 alpha 透明度值（0-1） |
| blurX | number | 4 | 水平模糊量（0-255） |
| blurY | number | 4 | 垂直模糊量（0-255） |
| color | number | 0 | 发光的颜色（0x000000-0xFFFFFF） |
| inner | boolean | false | 指定发光是否为内发光 |
| knockout | boolean | false | 指定对象是否具有挖空效果 |
| quality | number | 1 | 执行模糊的次数（0-15） |
| strength | number | 1 | 印记或扩展的强度（0-255） |

---

## BevelFilter

应用斜角效果。使对象具有三维外观。

```typescript
const { BevelFilter } = next2d.filters;

new BevelFilter(
    distance, angle, highlightColor, highlightAlpha,
    shadowColor, shadowAlpha, blurX, blurY,
    strength, quality, type, knockout
);
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| angle | number | 45 | 斜角的角度（-360 到 360 度） |
| blurX | number | 4 | 水平模糊量（0-255） |
| blurY | number | 4 | 垂直模糊量（0-255） |
| distance | number | 4 | 斜角的偏移距离（-255 到 255 像素） |
| highlightAlpha | number | 1 | 高光颜色的 alpha 透明度值（0-1） |
| highlightColor | number | 0xFFFFFF | 斜角的高光颜色（0x000000-0xFFFFFF） |
| knockout | boolean | false | 指定对象是否具有挖空效果 |
| quality | number | 1 | 执行模糊的次数（0-15） |
| shadowAlpha | number | 1 | 阴影颜色的 alpha 透明度值（0-1） |
| shadowColor | number | 0 | 斜角的阴影颜色（0x000000-0xFFFFFF） |
| strength | number | 1 | 印记或扩展的强度（0-255） |
| type | string | "inner" | 斜角的位置（"inner"、"outer"、"full"） |

---

## ColorMatrixFilter

应用 4x5 颜色矩阵变换。可以调整亮度、对比度、饱和度、色调等。

```typescript
const { ColorMatrixFilter } = next2d.filters;

new ColorMatrixFilter(matrix);
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| matrix | number[] | 单位矩阵 | 用于 4x5 颜色变换的 20 个项目的数组 |

### 默认矩阵值（单位矩阵）
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

应用矩阵卷积滤镜效果。可以实现模糊、边缘检测、锐化、浮雕、斜角等效果。

```typescript
const { ConvolutionFilter } = next2d.filters;

new ConvolutionFilter(
    matrixX, matrixY, matrix, divisor, bias,
    preserveAlpha, clamp, color, alpha
);
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| alpha | number | 0 | 超出边界像素的 alpha 透明度值（0-1） |
| bias | number | 0 | 添加到矩阵变换结果的偏差量 |
| clamp | boolean | true | 指示图像是否应被钳位 |
| color | number | 0 | 用于超出边界像素的十六进制颜色（0x000000-0xFFFFFF） |
| divisor | number | 1 | 矩阵变换期间使用的除数 |
| matrix | number[] \| null | null | 用于矩阵变换的值数组 |
| matrixX | number | 0 | 矩阵的 x 维度（列数，0-15） |
| matrixY | number | 0 | 矩阵的 y 维度（行数，0-15） |
| preserveAlpha | boolean | true | 指示 alpha 通道是否在没有滤镜效果的情况下保留 |

---

## DisplacementMapFilter

使用 BitmapData 对象的像素值对对象执行位移。

```typescript
const { DisplacementMapFilter } = next2d.filters;

new DisplacementMapFilter(
    bitmapBuffer, bitmapWidth, bitmapHeight,
    mapPointX, mapPointY, componentX, componentY,
    scaleX, scaleY, mode, color, alpha
);
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| alpha | number | 0 | 超出边界位移的 alpha 透明度值（0-1） |
| bitmapBuffer | Uint8Array \| null | null | 包含位移贴图数据的缓冲区 |
| bitmapHeight | number | 0 | 位移贴图图像的高度 |
| bitmapWidth | number | 0 | 位移贴图图像的宽度 |
| color | number | 0 | 用于超出边界位移的颜色（0x000000-0xFFFFFF） |
| componentX | number | 0 | 用于位移 x 结果的贴图图像中的颜色通道 |
| componentY | number | 0 | 用于位移 y 结果的贴图图像中的颜色通道 |
| mapPointX | number | 0 | 贴图点的 X 偏移 |
| mapPointY | number | 0 | 贴图点的 Y 偏移 |
| mode | string | "wrap" | 滤镜的模式（"wrap"、"clamp"、"ignore"、"color"） |
| scaleX | number | 0 | 缩放 x 位移结果的乘数（-65535 到 65535） |
| scaleY | number | 0 | 缩放 y 位移结果的乘数（-65535 到 65535） |

---

## GradientBevelFilter

应用渐变斜角效果。使用渐变颜色增强的斜边使对象看起来具有三维效果。

```typescript
const { GradientBevelFilter } = next2d.filters;

new GradientBevelFilter(
    distance, angle, colors, alphas, ratios,
    blurX, blurY, strength, quality, type, knockout
);
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| alphas | number[] \| null | null | 相应颜色的 alpha 透明度值数组（每个值 0-1） |
| angle | number | 45 | 斜角的角度（-360 到 360 度） |
| blurX | number | 4 | 水平模糊量（0-255） |
| blurY | number | 4 | 垂直模糊量（0-255） |
| colors | number[] \| null | null | 用于渐变的 RGB 十六进制颜色值数组 |
| distance | number | 4 | 斜角的偏移距离（-255 到 255 像素） |
| knockout | boolean | false | 指定对象是否具有挖空效果 |
| quality | number | 1 | 执行模糊的次数（0-15） |
| ratios | number[] \| null | null | 相应颜色的颜色分布比例数组（每个值 0-255） |
| strength | number | 1 | 印记或扩展的强度（0-255） |
| type | string | "inner" | 斜角的位置（"inner"、"outer"、"full"） |

---

## GradientGlowFilter

应用渐变发光效果。具有可控颜色渐变的逼真发光效果。

```typescript
const { GradientGlowFilter } = next2d.filters;

new GradientGlowFilter(
    distance, angle, colors, alphas, ratios,
    blurX, blurY, strength, quality, type, knockout
);
```

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| alphas | number[] \| null | null | 相应颜色的 alpha 透明度值数组（每个值 0-1） |
| angle | number | 45 | 发光的角度（-360 到 360 度） |
| blurX | number | 4 | 水平模糊量（0-255） |
| blurY | number | 4 | 垂直模糊量（0-255） |
| colors | number[] \| null | null | 用于渐变的 RGB 十六进制颜色值数组 |
| distance | number | 4 | 发光的偏移距离（-255 到 255 像素） |
| knockout | boolean | false | 指定对象是否具有挖空效果 |
| quality | number | 1 | 执行模糊的次数（0-15） |
| ratios | number[] \| null | null | 相应颜色的颜色分布比例数组（每个值 0-255） |
| strength | number | 1 | 印记或扩展的强度（0-255） |
| type | string | "outer" | 发光的位置（"inner"、"outer"、"full"） |

---

## 使用示例

### 按钮悬停效果

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

### 带阴影的文本

```typescript
const { TextField } = next2d.text;
const { DropShadowFilter } = next2d.filters;

const textField = new TextField();
textField.text = "Hello World";
textField.filters = [
    new DropShadowFilter(2, 45, 0x000000, 0.5, 2, 2)
];
```

### 组合滤镜

```typescript
const { GlowFilter, DropShadowFilter, BlurFilter } = next2d.filters;

sprite.filters = [
    // 外发光
    new GlowFilter(0x0088ff, 0.8, 15, 15, 2, 1, false),
    // 投影
    new DropShadowFilter(4, 45, 0x000000, 0.6, 4, 4),
    // 轻微模糊
    new BlurFilter(1, 1, 1)
];
```

### 使用 ColorMatrixFilter 实现灰度

```typescript
const { ColorMatrixFilter } = next2d.filters;

// 灰度变换矩阵
const grayscaleMatrix = [
    0.299, 0.587, 0.114, 0, 0,
    0.299, 0.587, 0.114, 0, 0,
    0.299, 0.587, 0.114, 0, 0,
    0,     0,     0,     1, 0
];

sprite.filters = [new ColorMatrixFilter(grayscaleMatrix)];
```

### 渐变发光效果

```typescript
const { GradientGlowFilter } = next2d.filters;

sprite.filters = [
    new GradientGlowFilter(
        4, 45,
        [0xff0000, 0x00ff00, 0x0000ff], // 颜色
        [1, 1, 1],                       // alpha
        [0, 128, 255],                   // 比例
        10, 10, 2, 1, "outer", false
    )
];
```

---

## 相关

- [DisplayObject](/cn/reference/player/display-object)
- [MovieClip](/cn/reference/player/movie-clip)
