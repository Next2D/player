# Next2D Player

Next2D Playerは、WebGL/WebGPUを用いた高速2Dレンダリングエンジンです。Flash Playerのような機能をWeb上で実現し、ベクター描画、Tweenアニメーション、テキスト、音声、動画など、さまざまな要素をサポートしています。

## 主な特徴

- **高速レンダリング**: WebGL/WebGPUを活用した高速2D描画
- **マルチプラットフォーム**: デスクトップからモバイルまで対応
- **Flash互換API**: swf2jsから派生した馴染みやすいAPI設計
- **豊富なフィルター**: Blur、DropShadow、Glow、Bevelなど多数のフィルターをサポート

## レンダリングパイプライン

Next2D Playerの高速レンダリングを実現するパイプラインの全体像です。

```mermaid
flowchart TB
    %% Main Drawing Flow Chart
    subgraph MainFlow["描画フローチャート - メインレンダリングパイプライン"]
        direction TB

        subgraph Inputs["表示オブジェクト"]
            Shape["Shape<br/>(Bitmap/Vector)"]
            TextField["TextField<br/>(canvas2d)"]
            Video["Video Element"]
        end

        Shape --> MaskCheck
        TextField --> MaskCheck
        Video --> MaskCheck

        MaskCheck{"マスク<br/>レンダリング?"}

        MaskCheck -->|YES| DirectRender["直接レンダリング"]
        DirectRender -->|drawArrays| FinalRender

        MaskCheck -->|NO| CacheCheck1{"キャッシュ<br/>あり?"}

        CacheCheck1 -->|NO| TextureAtlas["テクスチャアトラス<br/>(二分木パッキング)"]
        TextureAtlas --> Coordinates

        CacheCheck1 -->|YES| Coordinates["座標データベース<br/>(x, y, w, h)"]

        Coordinates --> FilterBlendCheck{"フィルター or<br/>ブレンド?"}

        FilterBlendCheck -->|NO| MainArrays
        FilterBlendCheck -->|YES| NeedCache{"キャッシュ<br/>あり?"}

        NeedCache -->|NO| CacheRender["キャッシュにレンダリング"]
        CacheRender --> TextureCache
        NeedCache -->|YES| TextureCache["テクスチャキャッシュ"]

        TextureCache -->|drawArrays| FinalRender

        MainArrays["インスタンス配列<br/>━━━━━━━━━━━━━━━<br/>matrix<br/>colorTransform<br/>Coordinates<br/>━━━━━━━━━━━━━━━<br/><b>バッチレンダリング</b>"]

        MainArrays -->|drawArraysInstanced<br/><b>複数オブジェクトを1回で描画</b>| FinalRender["最終レンダリング"]

        FinalRender -->|60fps| MainFramebuffer["メインフレームバッファ<br/>(ディスプレイ)"]
    end

    %% Branch Flow for Filter/Blend/Mask
    subgraph BranchFlow["フィルター/ブレンド/マスク - 分岐処理"]
        direction TB

        subgraph FilterInputs["表示オブジェクト"]
            Shape2["Shape<br/>(Bitmap/Vector)"]
            TextField2["TextField<br/>(canvas2d)"]
            Video2["Video Element"]
        end

        Shape2 --> CacheCheck2
        TextField2 --> CacheCheck2
        Video2 --> CacheCheck2

        CacheCheck2{"キャッシュ<br/>あり?"}

        CacheCheck2 -->|NO| EffectRender["エフェクトレンダリング"]
        CacheCheck2 -->|YES| BranchArrays
        EffectRender --> BranchArrays

        BranchArrays["インスタンス配列<br/>━━━━━━━━━━━━━━━<br/>matrix<br/>colorTransform<br/>Coordinates<br/>━━━━━━━━━━━━━━━<br/><b>バッチレンダリング</b>"]

        BranchArrays -->|drawArraysInstanced<br/><b>複数オブジェクトを1回で描画</b>| BranchRender["エフェクト結果"]

        BranchRender -->|filter/blend| TextureCache
    end

    %% Connections between flows
    FilterBlendCheck -.->|"分岐フローを<br/>トリガー"| BranchFlow
    BranchArrays -.->|"レンダリング情報<br/>(座標)"| MainArrays
```

### パイプラインの特徴

- **バッチレンダリング**: 複数のオブジェクトを1回のGPUコールで描画
- **テクスチャキャッシュ**: フィルターやブレンド効果を効率的に処理
- **二分木パッキング**: テクスチャアトラスで最適なメモリ使用
- **60fps描画**: 高フレームレートでのスムーズなアニメーション

## DisplayListアーキテクチャ

Next2D Playerは、Flash Playerと同様のDisplayListアーキテクチャを採用しています。

### 主要クラス階層

```
DisplayObject (基底クラス)
├── InteractiveObject
│   ├── DisplayObjectContainer
│   │   ├── Sprite
│   │   ├── MovieClip
│   │   └── Stage
│   └── TextField
├── Shape
├── Video
└── Bitmap
```

### DisplayObjectContainer

子オブジェクトを持つことができるコンテナクラス：

- `addChild(child)`: 子要素を最前面に追加
- `addChildAt(child, index)`: 指定インデックスに子要素を追加
- `removeChild(child)`: 子要素を削除
- `getChildAt(index)`: インデックスから子要素を取得
- `getChildByName(name)`: 名前から子要素を取得

### MovieClip

タイムラインアニメーションを持つDisplayObject：

- `play()`: タイムラインを再生
- `stop()`: タイムラインを停止
- `gotoAndPlay(frame)`: 指定フレームに移動して再生
- `gotoAndStop(frame)`: 指定フレームに移動して停止
- `currentFrame`: 現在のフレーム番号
- `totalFrames`: 総フレーム数

## 基本的な使い方

```typescript
const { MovieClip } = next2d.display;
const { DropShadowFilter } = next2d.filters;

// ルートMovieClipを作成
const root = await next2d.createRootMovieClip(800, 600, 60, {
    tagId: "container",
    bgColor: "#ffffff"
});

// MovieClipの作成
const mc = new MovieClip();
root.addChild(mc);

// 位置とサイズの設定
mc.x = 100;
mc.y = 100;
mc.scaleX = 2;
mc.scaleY = 2;
mc.rotation = 45;

// フィルターの適用
mc.filters = [
    new DropShadowFilter(4, 45, 0x000000, 0.5)
];
```

## JSONデータの読み込み

Open Animation Toolで作成したJSONファイルを読み込んで描画：

```typescript
const { Loader } = next2d.display;
const { URLRequest } = next2d.net;

const loader = new Loader();
await loader.load(new URLRequest("animation.json"));

// 読み込み完了後、直接contentにアクセス
const mc = loader.content;
stage.addChild(mc);
```

## 関連ドキュメント

### 表示オブジェクト
- [DisplayObject](/ja/reference/player/display-object) - 全ての表示オブジェクトの基底クラス
- [MovieClip](/ja/reference/player/movie-clip) - タイムラインアニメーション
- [Sprite](/ja/reference/player/sprite) - グラフィックス描画とインタラクション
- [Shape](/ja/reference/player/shape) - 軽量なベクター描画
- [TextField](/ja/reference/player/text-field) - テキスト表示と入力
- [Video](/ja/reference/player/video) - 動画再生

### システム
- [イベントシステム](/ja/reference/player/events) - マウス、キーボード、タッチイベント
- [フィルター](/ja/reference/player/filters) - Blur、DropShadow、Glowなど
- [サウンド](/ja/reference/player/sound) - 音声再生とサウンドエフェクト
- [Tweenアニメーション](/ja/reference/player/tween) - プログラムによるアニメーション
