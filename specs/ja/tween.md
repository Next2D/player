# Tweenアニメーション

Next2D Playerでは、`@next2d/ui`パッケージのTweenシステムを使用して、プログラムによるアニメーションを実装できます。位置、サイズ、透明度などのプロパティを滑らかに変化させることができます。

## Tweenの基本概念

```mermaid
flowchart LR
    Start["開始値"] -->|イージング関数| Progress["進行度 0→1"]
    Progress --> End["終了値"]

    subgraph Easing["イージング"]
        Linear["linear"]
        InQuad["inQuad"]
        OutQuad["outQuad"]
        InOutQuad["inOutQuad"]
    end
```

## Tween.add()

`Tween.add()`メソッドでアニメーション用の`Job`インスタンスを作成します。

```typescript
const { Tween, Easing } = next2d.ui;

const job = Tween.add(
    target,    // アニメーション対象オブジェクト
    from,      // 開始プロパティ値
    to,        // 終了プロパティ値
    delay,     // 遅延時間（秒、デフォルト: 0）
    duration,  // アニメーション時間（秒、デフォルト: 1）
    ease       // イージング関数（デフォルト: linear）
);

// アニメーションを開始
job.start();
```

### パラメータ

| パラメータ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| `target` | any | - | アニメーション対象オブジェクト |
| `from` | object | - | 開始プロパティ値 |
| `to` | object | - | 終了プロパティ値 |
| `delay` | number | 0 | アニメーション開始前の遅延（秒） |
| `duration` | number | 1 | アニメーション継続時間（秒） |
| `ease` | Function \| null | null | イージング関数（デフォルトはlinear） |

### 戻り値

`Job` - アニメーションジョブインスタンス

## Job クラス

Jobクラスは個別のアニメーションジョブを管理します。EventDispatcherを継承しています。

### メソッド

| メソッド | 戻り値 | 説明 |
|---------|--------|------|
| `start()` | void | アニメーションを開始します |
| `stop()` | void | アニメーションを停止します |
| `chain(nextJob: Job \| null)` | Job \| null | このジョブの完了後に別のジョブを連結します |

### プロパティ

| プロパティ | 型 | 説明 |
|-----------|------|------|
| `target` | any | 対象オブジェクト |
| `from` | object | 開始値 |
| `to` | object | 終了値 |
| `delay` | number | 遅延時間 |
| `duration` | number | 継続時間 |
| `ease` | Function | イージング関数 |
| `currentTime` | number | 現在のアニメーション時間 |
| `nextJob` | Job \| null | 次の連結ジョブ |

### イベント

| イベント | 説明 |
|----------|------|
| `enterFrame` | 各アニメーションフレームで発行 |
| `complete` | アニメーション完了時に発行 |

## イージング関数

`Easing`クラスは、11種類のイージングタイプでIn、Out、InOutのバリエーションを含む32種類のイージング関数を提供します。

### Linear / リニア
- `Easing.linear` - 一定速度

### Quadratic (Quad) / 二次関数
- `Easing.inQuad` - ゼロ速度から加速
- `Easing.outQuad` - ゼロ速度まで減速
- `Easing.inOutQuad` - 中間まで加速、その後減速

### Cubic / 三次関数
- `Easing.inCubic` / `Easing.outCubic` / `Easing.inOutCubic`

### Quartic (Quart) / 四次関数
- `Easing.inQuart` / `Easing.outQuart` / `Easing.inOutQuart`

### Quintic (Quint) / 五次関数
- `Easing.inQuint` / `Easing.outQuint` / `Easing.inOutQuint`

### Sinusoidal (Sine) / 正弦波
- `Easing.inSine` / `Easing.outSine` / `Easing.inOutSine`

### Exponential (Expo) / 指数関数
- `Easing.inExpo` / `Easing.outExpo` / `Easing.inOutExpo`

### Circular (Circ) / 円形
- `Easing.inCirc` / `Easing.outCirc` / `Easing.inOutCirc`

### Elastic / 弾性
- `Easing.inElastic` / `Easing.outElastic` / `Easing.inOutElastic`

### Back / バック
- `Easing.inBack` / `Easing.outBack` / `Easing.inOutBack`

### Bounce / バウンス
- `Easing.inBounce` / `Easing.outBounce` / `Easing.inOutBounce`

### イージング関数のパラメータ

すべてのイージング関数は4つのパラメータを受け取ります：

```typescript
ease(t: number, b: number, c: number, d: number): number
```

- `t` - 現在の時間 (0 to d)
- `b` - 開始値
- `c` - 変化量 (終了値 - 開始値)
- `d` - 継続時間

## 使用例

### 基本的な移動アニメーション

```typescript
const { Tween, Easing } = next2d.ui;

const sprite = new Sprite();
stage.addChild(sprite);

// xを0から400に1秒かけて移動
const job = Tween.add(
    sprite,
    { x: 0, y: 100 },
    { x: 400, y: 100 },
    0,
    1,
    Easing.outQuad
);

job.start();
```

### 複数プロパティの同時アニメーション

```typescript
const { Tween, Easing } = next2d.ui;

// 移動 + 拡大 + フェードイン
const job = Tween.add(
    sprite,
    { x: 0, y: 0, scaleX: 1, scaleY: 1, alpha: 0 },
    { x: 200, y: 150, scaleX: 2, scaleY: 2, alpha: 1 },
    0,
    0.5,
    Easing.outCubic
);

job.start();
```

### アニメーションの連結 (chain)

```typescript
const { Tween, Easing } = next2d.ui;

// 最初のアニメーション
const job1 = Tween.add(
    sprite,
    { x: 0 },
    { x: 100 },
    0, 1,
    Easing.outQuad
);

// 2つ目のアニメーション
const job2 = Tween.add(
    sprite,
    { x: 100 },
    { x: 200 },
    0, 1,
    Easing.inQuad
);

// 連結して実行
job1.chain(job2);
job1.start();
```

### 遅延付きアニメーション

```typescript
const { Tween, Easing } = next2d.ui;

// 0.5秒遅延後に1秒かけてフェードアウト
const job = Tween.add(
    sprite,
    { alpha: 1 },
    { alpha: 0 },
    0.5,
    1,
    Easing.inQuad
);

job.start();
```

### イベントの活用

```typescript
const { Tween, Easing } = next2d.ui;

const job = Tween.add(
    sprite,
    { x: 0 },
    { x: 300 },
    0, 2,
    Easing.inOutQuad
);

// フレームごとの処理
job.addEventListener("enterFrame", (event) => {
    console.log("進行中:", job.currentTime);
});

// 完了時の処理
job.addEventListener("complete", (event) => {
    console.log("アニメーション完了!");
});

job.start();
```

### ゲームでの活用例

#### キャラクタージャンプ

```typescript
const { Tween, Easing } = next2d.ui;

function jump(character) {
    const startY = character.y;
    const jumpHeight = 100;

    // 上昇
    const upJob = Tween.add(
        character,
        { y: startY },
        { y: startY - jumpHeight },
        0, 0.3,
        Easing.outQuad
    );

    // 下降
    const downJob = Tween.add(
        character,
        { y: startY - jumpHeight },
        { y: startY },
        0, 0.3,
        Easing.inQuad
    );

    // 上昇 → 下降を連結
    upJob.chain(downJob);
    upJob.start();
}
```

#### UI表示アニメーション

```typescript
const { Tween, Easing } = next2d.ui;

function showPopup(popup) {
    popup.scaleX = 0;
    popup.scaleY = 0;
    popup.alpha = 0;

    const job = Tween.add(
        popup,
        { scaleX: 0, scaleY: 0, alpha: 0 },
        { scaleX: 1, scaleY: 1, alpha: 1 },
        0, 0.4,
        Easing.outBack
    );

    job.start();
}

function hidePopup(popup) {
    const job = Tween.add(
        popup,
        { scaleX: 1, scaleY: 1, alpha: 1 },
        { scaleX: 0, scaleY: 0, alpha: 0 },
        0, 0.2,
        Easing.inQuad
    );

    job.addEventListener("complete", () => {
        popup.visible = false;
    });

    job.start();
}
```

#### コイン取得エフェクト

```typescript
const { Tween, Easing } = next2d.ui;

function coinCollectEffect(coin) {
    const job = Tween.add(
        coin,
        { y: coin.y, alpha: 1, scaleX: 1, scaleY: 1 },
        { y: coin.y - 50, alpha: 0, scaleX: 0.5, scaleY: 0.5 },
        0, 0.5,
        Easing.outQuad
    );

    job.addEventListener("enterFrame", () => {
        coin.rotation += 15;
    });

    job.addEventListener("complete", () => {
        coin.parent?.removeChild(coin);
    });

    job.start();
}
```

### 停止と制御

```typescript
const { Tween, Easing } = next2d.ui;

const job = Tween.add(
    sprite,
    { x: 0 },
    { x: 400 },
    0, 2,
    Easing.linear
);

job.start();

// 途中で停止
stopButton.addEventListener("pointerDown", () => {
    job.stop();
});
```

## 関連項目

- [DisplayObject](/ja/reference/player/display-object)
- [イベントシステム](/ja/reference/player/events)
