# イベントシステム

Next2D Playerは、W3C DOMイベントモデルと同様の3フェーズイベントフロー機構を採用しています。

## EventDispatcher

すべてのイベント発行可能なオブジェクトの基底クラスです。

### addEventListener(type, listener, useCapture, priority)

イベントリスナーを登録します。

```typescript
const { PointerEvent } = next2d.events;

displayObject.addEventListener(PointerEvent.POINTER_DOWN, (event) => {
    console.log("ポインターが押されました");
});

// キャプチャフェーズで受け取る
displayObject.addEventListener(PointerEvent.POINTER_DOWN, handler, true);

// 優先度を指定
displayObject.addEventListener(PointerEvent.POINTER_DOWN, handler, false, 10);
```

### removeEventListener(type, listener, useCapture)

イベントリスナーを削除します。

```typescript
displayObject.removeEventListener(PointerEvent.POINTER_DOWN, handler);
```

### removeAllEventListener(type, useCapture)

特定タイプのすべてのイベントリスナーを削除します。

```typescript
displayObject.removeAllEventListener(PointerEvent.POINTER_DOWN);
```

### hasEventListener(type)

指定タイプのリスナーが登録されているか確認します。

```typescript
if (displayObject.hasEventListener(PointerEvent.POINTER_DOWN)) {
    console.log("ポインターダウンリスナーが登録されています");
}
```

### willTrigger(type)

このオブジェクトまたは祖先がイベントタイプのリスナーを持つか確認します。

```typescript
if (displayObject.willTrigger(PointerEvent.POINTER_DOWN)) {
    console.log("このオブジェクトまたは祖先にリスナーがあります");
}
```

### dispatchEvent(event)

イベントを発行します。

```typescript
const { Event } = next2d.events;

const event = new Event("customEvent");
displayObject.dispatchEvent(event);
```

## Event クラス

### プロパティ

| プロパティ | 型 | 説明 |
|-----------|------|------|
| `type` | String | イベントタイプ |
| `target` | Object | イベント発行元 |
| `currentTarget` | Object | 現在のリスナー登録先 |
| `eventPhase` | Number | イベントフェーズ |
| `bubbles` | Boolean | バブリングするか |

### メソッド

| メソッド | 説明 |
|----------|------|
| `stopPropagation()` | 伝播を停止 |
| `stopImmediatePropagation()` | 伝播を即座に停止 |

## 標準イベントタイプ

### 表示リスト関連

| イベント | 説明 |
|----------|------|
| `added` | DisplayObjectContainerに追加された |
| `addedToStage` | Stageに追加された |
| `removed` | DisplayObjectContainerから削除された |
| `removedFromStage` | Stageから削除された |

```typescript
sprite.addEventListener("addedToStage", (event) => {
    console.log("ステージに追加されました");
});
```

### タイムライン関連

| イベント | 説明 |
|----------|------|
| `enterFrame` | 各フレームで発生 |
| `frameConstructed` | フレーム構築完了 |
| `exitFrame` | フレーム離脱時 |

```typescript
movieClip.addEventListener("enterFrame", (event) => {
    // 毎フレーム実行される処理
    updatePosition();
});
```

### ロード関連

| イベント | 説明 |
|----------|------|
| `complete` | ロード完了 |
| `progress` | ロード進捗 |
| `ioError` | IOエラー |
| `httpStatus` | HTTPステータス受信 |

```typescript
const { Loader } = next2d.display;
const { URLRequest } = next2d.net;

const loader = new Loader();

// async/awaitを使用した読み込み
await loader.load(new URLRequest("animation.json"));
const content = loader.content;
stage.addChild(content);

// プログレスイベントを使用する場合
loader.contentLoaderInfo.addEventListener("progress", (event) => {
    const percent = (event.bytesLoaded / event.bytesTotal) * 100;
    console.log(`${percent}% ロード完了`);
});
```

## ポインターイベント

PointerEventはマウス、ペン、タッチなどのポインターデバイスの操作を統一的に処理します。

| イベント | 定数 | 説明 |
|----------|------|------|
| `pointerDown` | `PointerEvent.POINTER_DOWN` | ボタンの押下開始 |
| `pointerUp` | `PointerEvent.POINTER_UP` | ボタンの解放 |
| `pointerMove` | `PointerEvent.POINTER_MOVE` | ポインター座標の変化 |
| `pointerOver` | `PointerEvent.POINTER_OVER` | ポインターがヒットテスト境界に入った |
| `pointerOut` | `PointerEvent.POINTER_OUT` | ポインターがヒットテスト境界を出た |
| `pointerLeave` | `PointerEvent.POINTER_LEAVE` | ポインターが要素領域を離れた |
| `pointerCancel` | `PointerEvent.POINTER_CANCEL` | ポインター操作がキャンセルされた |
| `doubleClick` | `PointerEvent.DOUBLE_CLICK` | ダブルクリック/タップが発生 |

```typescript
const { PointerEvent } = next2d.events;

sprite.addEventListener(PointerEvent.POINTER_DOWN, (event) => {
    console.log("ポインターダウン:", event.localX, event.localY);
});

sprite.addEventListener(PointerEvent.POINTER_MOVE, (event) => {
    console.log("ポインター移動:", event.stageX, event.stageY);
});

sprite.addEventListener(PointerEvent.DOUBLE_CLICK, (event) => {
    console.log("ダブルクリック");
});
```

## キーボードイベント

| イベント | 定数 | 説明 |
|----------|------|------|
| `keyDown` | `KeyboardEvent.KEY_DOWN` | キー押下 |
| `keyUp` | `KeyboardEvent.KEY_UP` | キー解放 |

```typescript
const { KeyboardEvent } = next2d.events;

stage.addEventListener(KeyboardEvent.KEY_DOWN, (event) => {
    console.log("キーコード:", event.keyCode);

    switch (event.keyCode) {
        case 37: // 左矢印
            player.x -= 10;
            break;
        case 39: // 右矢印
            player.x += 10;
            break;
    }
});
```

## フォーカスイベント

| イベント | 定数 | 説明 |
|----------|------|------|
| `focusIn` | `FocusEvent.FOCUS_IN` | フォーカスを受け取った |
| `focusOut` | `FocusEvent.FOCUS_OUT` | フォーカスを失った |

```typescript
const { FocusEvent } = next2d.events;

textField.addEventListener(FocusEvent.FOCUS_IN, (event) => {
    console.log("フォーカスを受け取りました");
});
```

## ホイールイベント

| イベント | 定数 | 説明 |
|----------|------|------|
| `wheel` | `WheelEvent.WHEEL` | マウスホイールが回転した |

```typescript
const { WheelEvent } = next2d.events;

stage.addEventListener(WheelEvent.WHEEL, (event) => {
    console.log("ホイール回転");
});
```

## ビデオイベント

| イベント | 定数 | 説明 |
|----------|------|------|
| `play` | `VideoEvent.PLAY` | 再生がリクエストされた |
| `playing` | `VideoEvent.PLAYING` | 再生が開始された |
| `pause` | `VideoEvent.PAUSE` | 一時停止された |
| `seek` | `VideoEvent.SEEK` | シーク操作 |

## ジョブイベント

Tweenアニメーション用のイベントです。

| イベント | 定数 | 説明 |
|----------|------|------|
| `update` | `JobEvent.UPDATE` | プロパティが更新された |
| `stop` | `JobEvent.STOP` | ジョブが停止した |

## カスタムイベント

```typescript
const { Event } = next2d.events;

// カスタムイベントの定義
const customEvent = new Event("gameOver", true, true);

// イベントの発行
gameManager.dispatchEvent(customEvent);

// イベントのリッスン
gameManager.addEventListener("gameOver", (event) => {
    showGameOverScreen();
});
```

## イベントの伝播

イベントは3つのフェーズで伝播します：

1. **キャプチャフェーズ**: rootからtargetへ（eventPhase = 1）
2. **ターゲットフェーズ**: targetで処理（eventPhase = 2）
3. **バブリングフェーズ**: targetからrootへ（eventPhase = 3）

```typescript
const { PointerEvent } = next2d.events;

// キャプチャフェーズで処理
parent.addEventListener(PointerEvent.POINTER_DOWN, handler, true);

// バブリングフェーズで処理（デフォルト）
child.addEventListener(PointerEvent.POINTER_DOWN, handler, false);
```

## 関連項目

- [DisplayObject](/ja/reference/player/display-object)
- [MovieClip](/ja/reference/player/movie-clip)
