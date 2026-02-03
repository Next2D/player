# イベントシステム

Next2D Playerは、Flash Playerと同様のイベントモデルを採用しています。

## EventDispatcher

すべてのイベント発行可能なオブジェクトの基底クラスです。

### addEventListener(type, listener, useCapture, priority)

イベントリスナーを登録します。

```typescript
displayObject.addEventListener("click", (event) => {
    console.log("クリックされました");
});

// キャプチャフェーズで受け取る
displayObject.addEventListener("click", handler, true);

// 優先度を指定
displayObject.addEventListener("click", handler, false, 10);
```

### removeEventListener(type, listener, useCapture)

イベントリスナーを削除します。

```typescript
displayObject.removeEventListener("click", handler);
```

### hasEventListener(type)

指定タイプのリスナーが登録されているか確認します。

```typescript
if (displayObject.hasEventListener("click")) {
    console.log("クリックリスナーが登録されています");
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
| `cancelable` | Boolean | キャンセル可能か |

### メソッド

| メソッド | 説明 |
|----------|------|
| `stopPropagation()` | 伝播を停止 |
| `stopImmediatePropagation()` | 伝播を即座に停止 |
| `preventDefault()` | デフォルト動作をキャンセル |

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

## マウス・タッチイベント

### マウスイベント

| イベント | 説明 |
|----------|------|
| `click` | クリック |
| `doubleClick` | ダブルクリック |
| `mouseDown` | マウスボタン押下 |
| `mouseUp` | マウスボタン解放 |
| `mouseMove` | マウス移動 |
| `mouseOver` | マウスオーバー |
| `mouseOut` | マウスアウト |
| `rollOver` | ロールオーバー |
| `rollOut` | ロールアウト |

```typescript
sprite.addEventListener("click", (event) => {
    console.log("クリック位置:", event.localX, event.localY);
});

sprite.addEventListener("mouseMove", (event) => {
    console.log("マウス位置:", event.stageX, event.stageY);
});
```

### タッチイベント

| イベント | 説明 |
|----------|------|
| `touchBegin` | タッチ開始 |
| `touchEnd` | タッチ終了 |
| `touchMove` | タッチ移動 |
| `touchTap` | タップ |

```typescript
sprite.addEventListener("touchTap", (event) => {
    console.log("タッチID:", event.touchPointID);
    console.log("タッチ位置:", event.localX, event.localY);
});
```

## キーボードイベント

| イベント | 説明 |
|----------|------|
| `keyDown` | キー押下 |
| `keyUp` | キー解放 |

```typescript
stage.addEventListener("keyDown", (event) => {
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

1. **キャプチャフェーズ**: rootからtargetへ
2. **ターゲットフェーズ**: targetで処理
3. **バブリングフェーズ**: targetからrootへ

```typescript
// キャプチャフェーズで処理
parent.addEventListener("click", handler, true);

// バブリングフェーズで処理（デフォルト）
child.addEventListener("click", handler, false);
```

## 関連項目

- [DisplayObject](./display-object.md)
- [MovieClip](./movie-clip.md)
