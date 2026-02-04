# フィルター

Next2D Playerは、DisplayObjectに適用できる様々なビジュアルフィルターを提供しています。

## フィルターの適用方法

```typescript
const { Sprite } = next2d.display;
const { BlurFilter, DropShadowFilter, GlowFilter } = next2d.filters;

const sprite = new Sprite();

// 単一のフィルター
sprite.filters = [new BlurFilter(4, 4)];

// 複数のフィルター
sprite.filters = [
    new DropShadowFilter(4, 45, 0x000000, 0.5),
    new GlowFilter(0xff0000, 1, 8, 8)
];

// フィルターの削除
sprite.filters = null;
```

## 利用可能なフィルター

| フィルター | 説明 |
|-----------|------|
| BlurFilter | ぼかし効果 |
| DropShadowFilter | ドロップシャドウ効果 |
| GlowFilter | グロー効果 |
| BevelFilter | ベベル効果 |
| ColorMatrixFilter | カラーマトリックス変換 |
| ConvolutionFilter | 畳み込み効果 |
| DisplacementMapFilter | 変位マップ効果 |
| GradientBevelFilter | グラデーションベベル効果 |
| GradientGlowFilter | グラデーショングロー効果 |

---

## BlurFilter

ぼかし効果を適用します。ソフトフォーカスからガウスぼかしまで作成できます。

```typescript
const { BlurFilter } = next2d.filters;

new BlurFilter(blurX, blurY, quality);
```

### プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| blurX | number | 4 | 水平方向のぼかし量（0〜255） |
| blurY | number | 4 | 垂直方向のぼかし量（0〜255） |
| quality | number | 1 | ぼかしの実行回数（0〜15） |

---

## DropShadowFilter

ドロップシャドウ効果を適用します。内側シャドウ、外側シャドウ、ノックアウトモードなどのスタイルオプションがあります。

```typescript
const { DropShadowFilter } = next2d.filters;

new DropShadowFilter(
    distance, angle, color, alpha,
    blurX, blurY, strength, quality,
    inner, knockout, hideObject
);
```

### プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| alpha | number | 1 | シャドウのアルファ透明度（0〜1） |
| angle | number | 45 | シャドウの角度（-360〜360度） |
| blurX | number | 4 | 水平方向のぼかし量（0〜255） |
| blurY | number | 4 | 垂直方向のぼかし量（0〜255） |
| color | number | 0 | シャドウの色（0x000000〜0xFFFFFF） |
| distance | number | 4 | シャドウのオフセット距離（-255〜255ピクセル） |
| hideObject | boolean | false | オブジェクトを非表示にするかどうか |
| inner | boolean | false | 内側シャドウにするかどうか |
| knockout | boolean | false | ノックアウト効果を適用するかどうか |
| quality | number | 1 | ぼかしの実行回数（0〜15） |
| strength | number | 1 | インプリントの強さ（0〜255） |

---

## GlowFilter

グロー効果を適用します。内側グロー、外側グロー、ノックアウトモードなどのスタイルオプションがあります。

```typescript
const { GlowFilter } = next2d.filters;

new GlowFilter(
    color, alpha, blurX, blurY,
    strength, quality, inner, knockout
);
```

### プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| alpha | number | 1 | グローのアルファ透明度（0〜1） |
| blurX | number | 4 | 水平方向のぼかし量（0〜255） |
| blurY | number | 4 | 垂直方向のぼかし量（0〜255） |
| color | number | 0 | グローの色（0x000000〜0xFFFFFF） |
| inner | boolean | false | 内側グローにするかどうか |
| knockout | boolean | false | ノックアウト効果を適用するかどうか |
| quality | number | 1 | ぼかしの実行回数（0〜15） |
| strength | number | 1 | インプリントの強さ（0〜255） |

---

## BevelFilter

ベベル効果を適用します。オブジェクトを3次元的に表現できます。

```typescript
const { BevelFilter } = next2d.filters;

new BevelFilter(
    distance, angle, highlightColor, highlightAlpha,
    shadowColor, shadowAlpha, blurX, blurY,
    strength, quality, type, knockout
);
```

### プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| angle | number | 45 | ベベルの角度（-360〜360度） |
| blurX | number | 4 | 水平方向のぼかし量（0〜255） |
| blurY | number | 4 | 垂直方向のぼかし量（0〜255） |
| distance | number | 4 | ベベルのオフセット距離（-255〜255ピクセル） |
| highlightAlpha | number | 1 | ハイライトのアルファ透明度（0〜1） |
| highlightColor | number | 0xFFFFFF | ハイライトの色（0x000000〜0xFFFFFF） |
| knockout | boolean | false | ノックアウト効果を適用するかどうか |
| quality | number | 1 | ぼかしの実行回数（0〜15） |
| shadowAlpha | number | 1 | シャドウのアルファ透明度（0〜1） |
| shadowColor | number | 0 | シャドウの色（0x000000〜0xFFFFFF） |
| strength | number | 1 | インプリントの強さ（0〜255） |
| type | string | "inner" | ベベルの配置（"inner"、"outer"、"full"） |

---

## ColorMatrixFilter

4x5カラーマトリックス変換を適用します。明度、コントラスト、彩度、色相などを調整できます。

```typescript
const { ColorMatrixFilter } = next2d.filters;

new ColorMatrixFilter(matrix);
```

### プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| matrix | number[] | 単位行列 | 4x5カラー変換用の20個の要素を持つ配列 |

### マトリックスのデフォルト値（単位行列）
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

マトリックス畳み込みフィルター効果を適用します。ぼかし、エッジ検出、シャープ、エンボス、ベベルなどの効果を実現できます。

```typescript
const { ConvolutionFilter } = next2d.filters;

new ConvolutionFilter(
    matrixX, matrixY, matrix, divisor, bias,
    preserveAlpha, clamp, color, alpha
);
```

### プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| alpha | number | 0 | 範囲外ピクセルのアルファ透明度（0〜1） |
| bias | number | 0 | マトリックス変換結果に加算するバイアス量 |
| clamp | boolean | true | イメージをクランプするかどうか |
| color | number | 0 | 範囲外ピクセルの置換色（0x000000〜0xFFFFFF） |
| divisor | number | 1 | マトリックス変換中の除数 |
| matrix | number[] \| null | null | マトリックス変換に使用する値の配列 |
| matrixX | number | 0 | マトリックスのX次元（列数、0〜15） |
| matrixY | number | 0 | マトリックスのY次元（行数、0〜15） |
| preserveAlpha | boolean | true | アルファチャンネルを維持するかどうか |

---

## DisplacementMapFilter

BitmapDataオブジェクトのピクセル値を使用して、オブジェクトの変位を実行します。

```typescript
const { DisplacementMapFilter } = next2d.filters;

new DisplacementMapFilter(
    bitmapBuffer, bitmapWidth, bitmapHeight,
    mapPointX, mapPointY, componentX, componentY,
    scaleX, scaleY, mode, color, alpha
);
```

### プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| alpha | number | 0 | 範囲外変位のアルファ透明度（0〜1） |
| bitmapBuffer | Uint8Array \| null | null | 変位マップデータを含むバッファ |
| bitmapHeight | number | 0 | 変位マップデータの高さ |
| bitmapWidth | number | 0 | 変位マップデータの幅 |
| color | number | 0 | 範囲外変位に使用する色（0x000000〜0xFFFFFF） |
| componentX | number | 0 | X変位に使用するカラーチャンネル |
| componentY | number | 0 | Y変位に使用するカラーチャンネル |
| mapPointX | number | 0 | マップポイントのXオフセット |
| mapPointY | number | 0 | マップポイントのYオフセット |
| mode | string | "wrap" | フィルターモード（"wrap"、"clamp"、"ignore"、"color"） |
| scaleX | number | 0 | X変位結果の乗数（-65535〜65535） |
| scaleY | number | 0 | Y変位結果の乗数（-65535〜65535） |

---

## GradientBevelFilter

グラデーションベベル効果を適用します。グラデーションカラーで強調された斜めのエッジでオブジェクトを3次元的に見せます。

```typescript
const { GradientBevelFilter } = next2d.filters;

new GradientBevelFilter(
    distance, angle, colors, alphas, ratios,
    blurX, blurY, strength, quality, type, knockout
);
```

### プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| alphas | number[] \| null | null | カラー配列の各色に対応するアルファ値の配列（各値0〜1） |
| angle | number | 45 | ベベルの角度（-360〜360度） |
| blurX | number | 4 | 水平方向のぼかし量（0〜255） |
| blurY | number | 4 | 垂直方向のぼかし量（0〜255） |
| colors | number[] \| null | null | グラデーションで使用するRGB 16進数カラー値の配列 |
| distance | number | 4 | ベベルのオフセット距離（-255〜255ピクセル） |
| knockout | boolean | false | ノックアウト効果を適用するかどうか |
| quality | number | 1 | ぼかしの実行回数（0〜15） |
| ratios | number[] \| null | null | カラー配列の各色に対応する色分布比率の配列（各値0〜255） |
| strength | number | 1 | インプリントの強さ（0〜255） |
| type | string | "inner" | ベベルの配置（"inner"、"outer"、"full"） |

---

## GradientGlowFilter

グラデーショングロー効果を適用します。制御可能なカラーグラデーションによるリアルな輝きを表現できます。

```typescript
const { GradientGlowFilter } = next2d.filters;

new GradientGlowFilter(
    distance, angle, colors, alphas, ratios,
    blurX, blurY, strength, quality, type, knockout
);
```

### プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| alphas | number[] \| null | null | カラー配列の各色に対応するアルファ値の配列（各値0〜1） |
| angle | number | 45 | グローの角度（-360〜360度） |
| blurX | number | 4 | 水平方向のぼかし量（0〜255） |
| blurY | number | 4 | 垂直方向のぼかし量（0〜255） |
| colors | number[] \| null | null | グラデーションで使用するRGB 16進数カラー値の配列 |
| distance | number | 4 | グローのオフセット距離（-255〜255ピクセル） |
| knockout | boolean | false | ノックアウト効果を適用するかどうか |
| quality | number | 1 | ぼかしの実行回数（0〜15） |
| ratios | number[] \| null | null | カラー配列の各色に対応する色分布比率の配列（各値0〜255） |
| strength | number | 1 | インプリントの強さ（0〜255） |
| type | string | "outer" | グローの配置（"inner"、"outer"、"full"） |

---

## 使用例

### ボタンのホバー効果

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

### 影付きテキスト

```typescript
const { TextField } = next2d.text;
const { DropShadowFilter } = next2d.filters;

const textField = new TextField();
textField.text = "Hello World";
textField.filters = [
    new DropShadowFilter(2, 45, 0x000000, 0.5, 2, 2)
];
```

### 複合フィルター

```typescript
const { GlowFilter, DropShadowFilter, BlurFilter } = next2d.filters;

sprite.filters = [
    // 外側のグロー
    new GlowFilter(0x0088ff, 0.8, 15, 15, 2, 1, false),
    // ドロップシャドウ
    new DropShadowFilter(4, 45, 0x000000, 0.6, 4, 4),
    // 軽いぼかし
    new BlurFilter(1, 1, 1)
];
```

### カラーマトリックスによるグレースケール

```typescript
const { ColorMatrixFilter } = next2d.filters;

// グレースケール変換マトリックス
const grayscaleMatrix = [
    0.299, 0.587, 0.114, 0, 0,
    0.299, 0.587, 0.114, 0, 0,
    0.299, 0.587, 0.114, 0, 0,
    0,     0,     0,     1, 0
];

sprite.filters = [new ColorMatrixFilter(grayscaleMatrix)];
```

### グラデーショングロー効果

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

## 関連項目

- [DisplayObject](/ja/reference/player/display-object)
- [MovieClip](/ja/reference/player/movie-clip)
