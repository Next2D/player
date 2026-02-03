# フィルター

Next2D Playerは、DisplayObjectに適用できる様々なビジュアルフィルターを提供しています。

## フィルターの適用方法

```javascript
import { next2d } from "@next2d/player";

const sprite = new next2d.display.Sprite();

// 単一のフィルター
sprite.filters = [new next2d.filters.BlurFilter(4, 4)];

// 複数のフィルター
sprite.filters = [
  new next2d.filters.DropShadowFilter(4, 45, 0x000000, 0.5),
  new next2d.filters.GlowFilter(0xff0000, 1, 8, 8)
];

// フィルターの削除
sprite.filters = null;
```

## 利用可能なフィルター

| フィルター | 説明 |
|-----------|------|
| [BlurFilter](./blur.md) | ぼかし効果 |
| [DropShadowFilter](./drop-shadow.md) | ドロップシャドウ効果 |
| [GlowFilter](./glow.md) | グロー効果 |
| [BevelFilter](./bevel.md) | ベベル効果 |
| [ColorMatrixFilter](./color-matrix.md) | カラーマトリックス変換 |
| [ConvolutionFilter](./convolution.md) | 畳み込み効果 |
| [DisplacementMapFilter](./displacement-map.md) | 変位マップ効果 |
| [GradientBevelFilter](./gradient-bevel.md) | グラデーションベベル効果 |
| [GradientGlowFilter](./gradient-glow.md) | グラデーショングロー効果 |

## BlurFilter

ぼかし効果を適用します。

```javascript
new next2d.filters.BlurFilter(blurX, blurY, quality);
```

| パラメータ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| blurX | Number | 4 | 水平方向のぼかし量 |
| blurY | Number | 4 | 垂直方向のぼかし量 |
| quality | Number | 1 | ぼかしの実行回数 |

## DropShadowFilter

ドロップシャドウ効果を適用します。

```javascript
new next2d.filters.DropShadowFilter(
  distance, angle, color, alpha,
  blurX, blurY, strength, quality,
  inner, knockout, hideObject
);
```

| パラメータ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| distance | Number | 4 | 影のオフセット距離 |
| angle | Number | 45 | 影の角度（度数法） |
| color | uint | 0x000000 | 影の色 |
| alpha | Number | 1 | 影の透明度 |
| blurX | Number | 4 | 水平方向のぼかし量 |
| blurY | Number | 4 | 垂直方向のぼかし量 |
| strength | Number | 1 | 影の強度 |
| quality | Number | 1 | ぼかしの実行回数 |
| inner | Boolean | false | インナーシャドウ |
| knockout | Boolean | false | ノックアウト効果 |
| hideObject | Boolean | false | オブジェクトを非表示 |

## GlowFilter

グロー効果を適用します。

```javascript
new next2d.filters.GlowFilter(
  color, alpha, blurX, blurY,
  strength, quality, inner, knockout
);
```

| パラメータ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| color | uint | 0xff0000 | グローの色 |
| alpha | Number | 1 | グローの透明度 |
| blurX | Number | 6 | 水平方向のぼかし量 |
| blurY | Number | 6 | 垂直方向のぼかし量 |
| strength | Number | 2 | グローの強度 |
| quality | Number | 1 | ぼかしの実行回数 |
| inner | Boolean | false | インナーグロー |
| knockout | Boolean | false | ノックアウト効果 |

## 使用例

### ボタンのホバー効果

```javascript
const button = new next2d.display.Sprite();

button.addEventListener("rollOver", () => {
  button.filters = [
    new next2d.filters.GlowFilter(0x00ff00, 0.8, 10, 10)
  ];
});

button.addEventListener("rollOut", () => {
  button.filters = null;
});
```

### 影付きテキスト

```javascript
const textField = new next2d.text.TextField();
textField.text = "Hello World";
textField.filters = [
  new next2d.filters.DropShadowFilter(2, 45, 0x000000, 0.5, 2, 2)
];
```

### 複合フィルター

```javascript
sprite.filters = [
  // 外側のグロー
  new next2d.filters.GlowFilter(0x0088ff, 0.8, 15, 15, 2, 1, false),
  // ドロップシャドウ
  new next2d.filters.DropShadowFilter(4, 45, 0x000000, 0.6, 4, 4),
  // 軽いぼかし
  new next2d.filters.BlurFilter(1, 1, 1)
];
```

## 関連項目

- [DisplayObject](../display-object.md)
- [MovieClip](../movie-clip.md)
