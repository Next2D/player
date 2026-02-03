# イベントシステム

Next2D Playerは、Flash Playerと同様のイベントモデルを採用しています。

## EventDispatcher

すべてのイベント発行可能なオブジェクトの基底クラスです。

### addEventListener(type, listener, useCapture, priority)

イベントリスナーを登録します。

```typescript
import type { Event } from "@next2d/player";

displayObject.addEventListener("click", (event: Event): void => {
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
import type { Event } from "@next2d/player";

const event: Event = new next2d.events.Event("customEvent");
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
import type { Event } from "@next2d/player";

sprite.addEventListener("addedToStage", (event: Event): void => {
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
import type { Event } from "@next2d/player";

movieClip.addEventListener("enterFrame", (event: Event): void => {
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
import type { Event, LoaderInfo, ProgressEvent, DisplayObject } from "@next2d/player";

loader.contentLoaderInfo.addEventListener("complete", (event: Event): void => {
  const loaderInfo: LoaderInfo = event.currentTarget as LoaderInfo;
  const content: DisplayObject = loaderInfo.content;
  stage.addChild(content);
});

loader.contentLoaderInfo.addEventListener("progress", (event: ProgressEvent): void => {
  const percent: number = (event.bytesLoaded / event.bytesTotal) * 100;
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
import type { MouseEvent } from "@next2d/player";

sprite.addEventListener("click", (event: MouseEvent): void => {
  console.log("クリック位置:", event.localX, event.localY);
});

sprite.addEventListener("mouseMove", (event: MouseEvent): void => {
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
import type { TouchEvent } from "@next2d/player";

sprite.addEventListener("touchTap", (event: TouchEvent): void => {
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
import type { KeyboardEvent } from "@next2d/player";

stage.addEventListener("keyDown", (event: KeyboardEvent): void => {
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
import type { Event } from "@next2d/player";

// カスタムイベントの定義
const customEvent: Event = new next2d.events.Event("gameOver", true, true);

// イベントの発行
gameManager.dispatchEvent(customEvent);

// イベントのリッスン
gameManager.addEventListener("gameOver", (event: Event): void => {
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
