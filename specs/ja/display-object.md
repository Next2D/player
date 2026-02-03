# DisplayObject

DisplayObjectは、Next2D Playerにおける全ての表示オブジェクトの基底クラスです。

## プロパティ

### 位置とサイズ

| プロパティ | 型 | 説明 |
|-----------|------|------|
| `x` | Number | X座標（親コンテナのローカル座標） |
| `y` | Number | Y座標（親コンテナのローカル座標） |
| `width` | Number | 幅（ピクセル） |
| `height` | Number | 高さ（ピクセル） |
| `scaleX` | Number | 水平方向の拡大率（1.0 = 100%） |
| `scaleY` | Number | 垂直方向の拡大率（1.0 = 100%） |
| `rotation` | Number | 回転角度（度数法） |

### 表示制御

| プロパティ | 型 | 説明 |
|-----------|------|------|
| `visible` | Boolean | 表示/非表示（デフォルト: true） |
| `alpha` | Number | 透明度（0.0～1.0） |
| `blendMode` | String | ブレンドモード |
| `filters` | Array | フィルターの配列 |
| `mask` | DisplayObject | マスクオブジェクト |

### 階層関係

| プロパティ | 型 | 説明 |
|-----------|------|------|
| `parent` | DisplayObjectContainer | 親コンテナ |
| `root` | DisplayObject | ルートオブジェクト |
| `stage` | Stage | ステージ |
| `name` | String | インスタンス名 |

## メソッド

### getBounds(targetCoordinateSpace)

指定座標系での境界矩形を取得します。

```typescript
const { Rectangle } = next2d.geom;

const bounds = displayObject.getBounds(stage);
console.log(bounds.x, bounds.y, bounds.width, bounds.height);
```

### globalToLocal(point)

グローバル座標をローカル座標に変換します。

```typescript
const { Point } = next2d.geom;

const globalPoint = new Point(100, 100);
const localPoint = displayObject.globalToLocal(globalPoint);
```

### localToGlobal(point)

ローカル座標をグローバル座標に変換します。

```typescript
const { Point } = next2d.geom;

const localPoint = new Point(0, 0);
const globalPoint = displayObject.localToGlobal(localPoint);
```

### hitTestPoint(x, y, shapeFlag)

指定座標との衝突判定を行います。

```typescript
// バウンディングボックスで判定
const hit1 = displayObject.hitTestPoint(100, 100, false);

// 実際の形状で判定
const hit2 = displayObject.hitTestPoint(100, 100, true);
```

### hitTestObject(obj)

他のDisplayObjectとの衝突判定を行います。

```typescript
if (obj1.hitTestObject(obj2)) {
    console.log("衝突しました");
}
```

## ブレンドモード

| 定数 | 説明 |
|------|------|
| `BlendMode.NORMAL` | 通常表示 |
| `BlendMode.ADD` | 加算 |
| `BlendMode.MULTIPLY` | 乗算 |
| `BlendMode.SCREEN` | スクリーン |
| `BlendMode.DARKEN` | 暗くする |
| `BlendMode.LIGHTEN` | 明るくする |
| `BlendMode.DIFFERENCE` | 差分 |
| `BlendMode.OVERLAY` | オーバーレイ |
| `BlendMode.HARDLIGHT` | ハードライト |
| `BlendMode.INVERT` | 反転 |
| `BlendMode.ALPHA` | アルファ |
| `BlendMode.ERASE` | 消去 |

## 使用例

```typescript
const { Sprite } = next2d.display;
const { BlurFilter } = next2d.filters;

const sprite = new Sprite();

// 位置とサイズ
sprite.x = 100;
sprite.y = 200;
sprite.scaleX = 1.5;
sprite.scaleY = 1.5;
sprite.rotation = 30;

// 表示制御
sprite.alpha = 0.8;
sprite.visible = true;
sprite.blendMode = "add";

// フィルター
sprite.filters = [
    new BlurFilter(4, 4)
];

// ステージに追加
stage.addChild(sprite);
```

## 関連項目

- [MovieClip](./movie-clip.md)
- [Sprite](./sprite.md)
