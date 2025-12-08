@next2d/cache
=============

Next2Dプレイヤーのレンダリングキャッシュを管理するパッケージです。DisplayObjectの描画結果に対応するアトラステクスチャ上の位置情報をキャッシュし、再描画時のパフォーマンスを向上させます。

## Overview

`@next2d/cache`は、DisplayObjectの描画結果をアトラステクスチャ上の位置情報（`@next2d/texture-packer`の`Node`）としてキャッシュし、同じ描画内容を再利用することでレンダリングパフォーマンスを最適化します。

メインスレッドと描画スレッド（Worker）の両方でキャッシュを管理しています：

- **メインスレッド**: 同じキーでキャッシュが存在するかをbooleanで管理（`true`をvalueにセット）
- **Workerスレッド（描画スレッド）**: `@next2d/texture-packer`の`Node`オブジェクトをキャッシュ。`Node`にはアトラステクスチャに描画された矩形の座標情報（index, x, y, w, h）が含まれており、Instanced Array描画時にこれらの情報を使用してアトラステクスチャから正しい領域をサンプリングします。

キャッシュキーはスケール、アルファ値、フィルターパラメータから生成され、変換行列やフィルターの変更を検知して適切にキャッシュを更新します。

### キャッシュの仕組み

1. **描画結果のアトラス登録**: DisplayObjectの描画結果はアトラステクスチャに格納される
2. **Node情報のキャッシュ**: アトラステクスチャ上の矩形位置（x, y, width, height）とインデックスを`Node`としてキャッシュ
3. **Instanced描画での利用**: キャッシュされた`Node`の座標情報を使用し、Instanced Arrayで効率的に描画

## Directory Structure

```
src/
├── index.ts                    # エクスポート定義
├── CacheStore.ts               # キャッシュ管理メインクラス
├── CacheUtil.ts                # ユーティリティ関数
└── CacheStore/
    └── service/
        ├── CacheStoreDestroyService.ts              # キャッシュ破棄
        ├── CacheStoreGenerateFilterKeysService.ts   # フィルターキー生成
        ├── CacheStoreGenerateKeysService.ts         # キャッシュキー生成
        ├── CacheStoreGetService.ts                  # キャッシュ取得
        ├── CacheStoreHasService.ts                  # キャッシュ存在確認
        ├── CacheStoreRemoveByIdService.ts           # ID指定削除
        ├── CacheStoreRemoveService.ts               # キャッシュ削除
        ├── CacheStoreRemoveTimerScheduledCacheService.ts  # タイマー削除実行
        ├── CacheStoreRemoveTimerService.ts          # タイマー削除登録
        ├── CacheStoreResetService.ts                # 全キャッシュリセット
        └── CacheStoreSetService.ts                  # キャッシュ保存
```

## Key Components

### CacheStore
キャッシュの中心となるクラスで、以下の機能を提供します：

- **キャッシュストア**: unique_keyとキャッシュキーのペアで`Node`データを格納するMap
- **キャッシュトラッシュ**: 削除予定のキャッシュを一時保管
- **タイマー制御**: 遅延削除によるキャッシュライフサイクル管理
- **Canvasプール**: 一時的な描画用HTMLCanvasElementの再利用プール

### Node（@next2d/texture-packer）
キャッシュされるデータの実体で、以下の情報を持ちます：

- `index`: アトラステクスチャの識別番号
- `x`, `y`: アトラステクスチャ上の矩形のx,y座標
- `w`, `h`: 矩形の幅と高さ

## Data Flow

```mermaid
sequenceDiagram
    participant DO as DisplayObject
    participant CS as CacheStore
    participant Atlas as AtlasManager
    participant Store as Cache Store (Node)

    DO->>CS: generateKeys(scale, alpha)
    CS-->>DO: cacheKey
    DO->>CS: has(uniqueKey, cacheKey)
    alt キャッシュあり
        CS->>Store: get(uniqueKey, cacheKey)
        Store-->>DO: cached Node (x, y, w, h, index)
        Note over DO: Instanced Arrayで描画<br/>Node座標でアトラスをサンプリング
    else キャッシュなし
        Note over DO: 新規描画処理
        DO->>Atlas: アトラスに描画結果を登録
        Atlas-->>DO: Node (座標情報)
        DO->>CS: set(uniqueKey, cacheKey, Node)
        CS->>Store: store Node
    end
```

## Cache and Instanced Rendering

```mermaid
flowchart TD
    subgraph "キャッシュ登録フロー"
        A[DisplayObject描画] --> B[アトラステクスチャに描画]
        B --> C[Node取得<br/>index, x, y, w, h]
        C --> D[CacheStoreにNodeを保存]
    end

    subgraph "キャッシュ利用フロー"
        E[DisplayObject再描画] --> F{キャッシュ存在?}
        F -->|Yes| G[Nodeを取得]
        G --> H[Instanced Array描画]
        H --> I[Node座標でアトラスをサンプリング]
        F -->|No| A
    end

    subgraph "Instanced Array データ"
        J["Instance Data:<br/>- rect (Node.x, Node.y, Node.w, Node.h)<br/>- atlas index (Node.index)<br/>- transform matrix<br/>- color transform"]
    end

    I --> J
```

## Cache Lifecycle

```mermaid
flowchart TD
    A[DisplayObject描画リクエスト] --> B{キャッシュ存在?}
    B -->|Yes| C[キャッシュからNode取得]
    B -->|No| D[新規描画・アトラス登録]
    D --> E[Node情報をキャッシュに保存]
    C --> G[Instanced Arrayで描画]
    E --> G
```

### 削除フロー（遅延削除メカニズム）

タイマーによる遅延削除で、一時的に非表示になったオブジェクトの再描画コストを削減します。

```mermaid
flowchart TD
    H[DisplayObject削除要求] --> I["removeTimer呼び出し<br/>trashフラグ設定"]
    I --> J["trashStoreに登録<br/>1秒タイマー開始"]
    J --> K{タイマー中に<br/>再アクセス?}

    K -->|Yes| L["get()でtrashフラグ削除"]
    L --> M[削除キャンセル<br/>キャッシュ継続利用]

    K -->|No| N["タイマー完了<br/>$removeCache = true"]
    N --> O["removeTimerScheduledCache<br/>trashフラグ確認"]
    O --> P{trashフラグ<br/>残存?}
    P -->|Yes| Q[removeById実行]
    Q --> R[キャッシュ完全削除]
    R --> S[Nodeをrelease<br/>アトラス領域を解放]
    P -->|No| T[削除スキップ]
```

### 削除フローの詳細

1. **removeTimer**: DisplayObject削除時に呼び出し、`trash`フラグを設定してtrashStoreに登録、1秒タイマー開始
2. **get()でのフラグ解除**: タイマー中に`get()`でキャッシュにアクセスすると、`data.delete("trash")`でフラグが削除される
3. **removeTimerScheduledCache**: タイマー完了後、`trash`フラグが残っているエントリのみを実際に削除

## Thread Architecture

```mermaid
flowchart LR
    subgraph "Main Thread"
        MC[CacheStore]
        MB["Boolean Cache<br/>(存在確認用)"]
        MC --> MB
    end

    subgraph "Worker Thread (Renderer)"
        WC[CacheStore]
        WN["Node Cache<br/>(座標情報)"]
        WC --> WN
    end

    subgraph "Atlas Texture"
        AT[アトラステクスチャ<br/>2048x2048]
        R1[Region 1<br/>Node.x,y,w,h]
        R2[Region 2<br/>Node.x,y,w,h]
        RN[Region N...]
        AT --> R1
        AT --> R2
        AT --> RN
    end

    MB -.->|同じキーで存在確認| WN
    WN -.->|座標情報参照| AT
```

### スレッド間のキャッシュ連携

| スレッド | キャッシュ内容 | 用途 |
|---------|--------------|------|
| メインスレッド | `boolean` (`true`) | キャッシュの存在確認、描画コマンド生成の判断 |
| Workerスレッド | `Node` (index, x, y, w, h) | Instanced Array描画時のアトラス座標参照 |

両スレッドで同じキー（unique_key + cacheKey）を使用することで、キャッシュの整合性を保っています。

## Installation

```
npm install @next2d/cache
```

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](LICENSE) file for details.
