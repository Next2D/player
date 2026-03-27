# DisplayObject

DisplayObjectは、Next2D Playerにおける全ての表示オブジェクトの基底クラスです。

## プロパティ (Properties)

### 読み取り専用プロパティ

| プロパティ | 型 | 説明 |
|-----------|------|------|
| `instanceId` | number | DisplayObjectのユニークなインスタンスID |
| `isSprite` | boolean | Spriteの機能を所持しているかを返却 |
| `isInteractive` | boolean | InteractiveObjectの機能を所持しているかを返却 |
| `isContainerEnabled` | boolean | コンテナの機能を所持しているかを返却 |
| `isTimelineEnabled` | boolean | MovieClipの機能を所持しているかを返却 |
| `isShape` | boolean | Shapeの機能を所持しているかを返却 |
| `isVideo` | boolean | Videoの機能を所持しているかを返却 |
| `isText` | boolean | Textの機能を所持しているかを返却 |
| `concatenatedMatrix` | Matrix | ルートレベルまでの結合された変換行列 |
| `dropTarget` | DisplayObject \| null | スプライトのドラッグ先またはドロップされた先の表示オブジェクト |
| `loaderInfo` | LoaderInfo \| null | この表示オブジェクトが属するファイルの読み込み情報 |
| `mouseX` | number | 対象のDisplayObjectの基準点からのマウスのX座標（ピクセル） |
| `mouseY` | number | 対象のDisplayObjectの基準点からのマウスのY座標（ピクセル） |
| `root` | MovieClip \| Sprite \| null | DisplayObjectのルートであるDisplayObjectContainer |

### 読み書きプロパティ

| プロパティ | 型 | 説明 |
|-----------|------|------|
| `name` | string | 名前。getChildByName()で使用される（デフォルト: ""） |
| `startFrame` | number | 開始フレーム（デフォルト: 1） |
| `endFrame` | number | 終了フレーム（デフォルト: 0） |
| `isMask` | boolean | マスクとしてDisplayObjectにセットされているかを示す（デフォルト: false） |
| `parent` | Sprite \| MovieClip \| null | このDisplayObjectの親のDisplayObjectContainer |
| `alpha` | number | アルファ透明度値（0.0～1.0、デフォルト: 1.0） |
| `blendMode` | string | 使用するブレンドモード（デフォルト: BlendMode.NORMAL） |
| `filters` | Array \| null | 表示オブジェクトに関連付けられている各フィルターオブジェクトの配列 |
| `height` | number | 表示オブジェクトの高さ（ピクセル単位） |
| `width` | number | 表示オブジェクトの幅（ピクセル単位） |
| `colorTransform` | ColorTransform | 表示オブジェクトのColorTransform |
| `matrix` | Matrix | 表示オブジェクトのMatrix |
| `rotation` | number | DisplayObjectインスタンスの回転角度（度単位） |
| `scale9Grid` | Rectangle \| null | 現在有効な拡大/縮小グリッド |
| `scaleX` | number | 基準点から適用されるオブジェクトの水平スケール値 |
| `scaleY` | number | 基準点から適用されるオブジェクトの垂直スケール値 |
| `visible` | boolean | 表示オブジェクトが可視かどうか（デフォルト: true） |
| `cacheAsBitmap` | Matrix \| null | ビットマップキャッシュ用のMatrix。1.0基準でdisplayObjectのscaleX/scaleYに適用される。キャッシュ品質 = 指定Matrix × 自身のスケール × stageスケール。先祖のMatrixの影響は受けないが、描画時には先祖のMatrixが適用される。ヒットテスト・幅・高さはベクター基準（デフォルト: null） |
| `x` | number | 親DisplayObjectContainerのローカル座標を基準にしたX座標 |
| `y` | number | 親DisplayObjectContainerのローカル座標を基準にしたY座標 |

## メソッド (Methods)

| メソッド | 戻り値 | 説明 |
|---------|--------|------|
| `getBounds(targetDisplayObject)` | Rectangle | 指定したDisplayObjectの座標系を基準にして、表示オブジェクトの領域を定義する矩形を返す |
| `globalToLocal(point)` | Point | pointオブジェクトをステージ（グローバル）座標から表示オブジェクトの（ローカル）座標に変換 |
| `localToGlobal(point)` | Point | pointオブジェクトを表示オブジェクトの（ローカル）座標からステージ（グローバル）座標に変換 |
| `hitTestObject(targetDisplayObject)` | boolean | DisplayObjectの描画範囲を評価して、重複または交差するかどうかを調べる |
| `hitTestPoint(x, y, shapeFlag)` | boolean | 表示オブジェクトを評価して、x および y パラメーターで指定されたポイントと重複または交差するかどうかを調べる |
| `getLocalVariable(key)` | any | クラスのローカル変数空間から値を取得 |
| `setLocalVariable(key, value)` | void | クラスのローカル変数空間へ値を保存 |
| `hasLocalVariable(key)` | boolean | クラスのローカル変数空間に値があるかどうかを判断 |
| `deleteLocalVariable(key)` | void | クラスのローカル変数空間の値を削除 |
| `getGlobalVariable(key)` | any | グローバル変数空間から値を取得 |
| `setGlobalVariable(key, value)` | void | グローバル変数空間へ値を保存 |
| `hasGlobalVariable(key)` | boolean | グローバル変数空間に値があるかどうかを判断 |
| `deleteGlobalVariable(key)` | void | グローバル変数空間の値を削除 |
| `clearGlobalVariable()` | void | グローバル変数空間の値を全てクリア |
| `remove()` | void | 親子関係を解除 |

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

### 座標変換の例

```typescript
const { Point } = next2d.geom;

// グローバル座標をローカル座標に変換
const globalPoint = new Point(100, 100);
const localPoint = displayObject.globalToLocal(globalPoint);

// ローカル座標をグローバル座標に変換
const localPos = new Point(0, 0);
const globalPos = displayObject.localToGlobal(localPos);
```

### 衝突判定の例

```typescript
// バウンディングボックスで判定
const hit1 = displayObject.hitTestPoint(100, 100, false);

// 実際の形状で判定
const hit2 = displayObject.hitTestPoint(100, 100, true);

// 他のDisplayObjectとの衝突判定
if (obj1.hitTestObject(obj2)) {
    console.log("衝突しました");
}
```

### 変数操作の例

```typescript
// ローカル変数の操作
displayObject.setLocalVariable("score", 100);
const score = displayObject.getLocalVariable("score");
if (displayObject.hasLocalVariable("score")) {
    displayObject.deleteLocalVariable("score");
}

// グローバル変数の操作
displayObject.setGlobalVariable("gameState", "playing");
const state = displayObject.getGlobalVariable("gameState");
displayObject.clearGlobalVariable(); // 全てクリア
```

### cacheAsBitmapの例

```typescript
const { Shape, Sprite } = next2d.display;
const { Matrix } = next2d.geom;

// 等倍でキャッシュ（1.0基準 = displayObjectのscaleX/scaleYに対する等倍）
const shape = new Shape();
shape.graphics.beginFill(0xFF0000).drawCircle(50, 50, 40).endFill();
shape.cacheAsBitmap = new Matrix(1, 0, 0, 1, 0, 0);

// 2倍の解像度でキャッシュ（自身のスケールの2倍品質）
const hqShape = new Shape();
hqShape.graphics.beginFill(0x00FF00).drawRect(0, 0, 100, 80).endFill();
hqShape.cacheAsBitmap = new Matrix(2, 0, 0, 2, 0, 0);

// scaleX/scaleYが反映される（キャッシュ品質 = Matrix × 自身のスケール × stageスケール）
shape.scaleX = 2; // キャッシュ品質: 1 × 2 × stageScale
shape.scaleY = 2;

// 親のスケールはキャッシュ品質に影響しない（描画位置には反映される）
const container = new Sprite();
container.scaleX = 3;
container.scaleY = 3;
container.addChild(shape);

// ヒットテスト・幅・高さはベクター基準
const bounds = shape.getBounds(shape); // ベクターの境界を返す

// キャッシュを解除
shape.cacheAsBitmap = null;
```

## 関連項目

- [MovieClip](/ja/reference/player/movie-clip)
- [Sprite](/ja/reference/player/sprite)
