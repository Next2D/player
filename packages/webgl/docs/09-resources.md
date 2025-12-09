# 13. FrameBuffer Management / フレームバッファ管理

[← Back to Index](./README.md) | [← Previous: Shader](./08-shader.md)

---

## FrameBuffer Types / フレームバッファタイプ

```mermaid
flowchart TB
    subgraph "FrameBuffer Objects"
        READ[$readFrameBuffer]
        DRAW[$drawFrameBuffer]
        ATLAS[$atlasFrameBuffer]
        READ_BMP[$readBitmapFramebuffer]
        DRAW_BMP[$drawBitmapFramebuffer]
        PIXEL[$pixelFrameBuffer]
    end

    subgraph "PBO"
        PBO[$pixelBufferObject]
    end
```

**FrameBufferManager State Functions / フレームバッファ状態関数:**
```typescript
// フレームバッファオブジェクト
$readFrameBuffer: WebGLFramebuffer          // READ_FRAMEBUFFER専用
$drawFrameBuffer: WebGLFramebuffer | null   // DRAW_FRAMEBUFFER専用
$atlasFrameBuffer: WebGLFramebuffer | null  // アトラス専用
$objectPool: IAttachmentObject[]            // AttachmentObjectプール

// フレームバッファ初期化
$setReadFrameBuffer(gl: WebGL2RenderingContext): void
$setDrawFrameBuffer(gl: WebGL2RenderingContext): void
$setAtlasFrameBuffer(gl: WebGL2RenderingContext, texture_object: ITextureObject): void

// ビットマップ専用フレームバッファ
$setBitmapFrameBuffer(gl: WebGL2RenderingContext): void
$getReadBitmapFrameBuffer(): WebGLFramebuffer
$getDrawBitmapFrameBuffer(): WebGLFramebuffer

// PBO (Pixel Buffer Object) 操作
$getPixelFrameBuffer(): WebGLFramebuffer
$getPixelBufferObject(): WebGLBuffer

// アタッチメント状態管理
$setCurrentAttachment(attachment_object: IAttachmentObject | null): void
$getCurrentAttachment(): IAttachmentObject | null
$setFramebufferBound(state: boolean): void
$useFramebufferBound(): boolean
```

---

## Attachment Object Interface / アタッチメントオブジェクトインターフェース

```typescript
interface IAttachmentObject {
    id: number;                           // 一意のID
    width: number;                        // 幅
    height: number;                       // 高さ
    clipLevel: number;                    // クリップレベル
    msaa: boolean;                        // MSAAフラグ
    mask: boolean;                        // マスクフラグ
    color: IColorBufferObject | null;     // カラーバッファ
    texture: ITextureObject | null;       // テクスチャ
    stencil: IStencilBufferObject | null; // ステンシルバッファ
}
```

---

## Attachment Object Pool / アタッチメントオブジェクトプール

```mermaid
flowchart TB
    subgraph "Object Pool"
        POOL[$objectPool]
        CURRENT[$currentAttachment]
        BOUND[$isFramebufferBound]
    end

    subgraph "Operations"
        GET[GetAttachmentObject]
        BIND[Bind]
        RELEASE[ReleaseAttachmentObject]
        TRANSFER[TransferMainCanvas]
    end

    GET --> POOL
    BIND --> CURRENT
    RELEASE --> POOL
```

---

## ColorBufferObject Pool Management / カラーバッファプール管理

```typescript
// ColorBufferObject.ts
$objectPool: IColorBufferObject[]              // カラーバッファプール

// ColorBufferObject/service/
ColorBufferObjectCreateService                 // 新規カラーバッファ作成
ColorBufferObjectMeguruBinarySearchService     // 二分探索によるプール検索最適化

// ColorBufferObject/usecase/
ColorBufferObjectAcquireObjectUseCase          // width/heightマッチでプールから取得
ColorBufferObjectReleaseColorBufferObjectUseCase  // プールに返却
ColorBufferObjectGetColorBufferObjectUseCase   // 取得または新規作成
```

---

## StencilBufferObject Pool Management / ステンシルバッファプール管理

```typescript
// StencilBufferObject.ts
$objectPool: IStencilBufferObject[]            // ステンシルバッファプール

// StencilBufferObject/service/
StencilBufferObjectCreateService               // 新規ステンシルバッファ作成
StencilBufferObjectReleaseColorBufferObjectService  // プールに返却

// StencilBufferObject/usecase/
StencilBufferObjectAcquireObjectUseCase        // width/heightマッチでプールから取得
StencilBufferObjectGetStencilBufferObjectUseCase   // 取得または新規作成
```

---

## FrameBuffer Workflow / フレームバッファワークフロー

```mermaid
sequenceDiagram
    participant App as Application
    participant FBM as FrameBufferManager
    participant GL as WebGL2
    participant Atlas as AtlasManager

    Note over App,Atlas: Render to temporary buffer

    App->>FBM: createAttachment(width, height)
    FBM->>FBM: Check pool for reusable object
    alt Pool has matching object
        FBM->>FBM: Return from pool
    else No match
        FBM->>GL: glGenFramebuffer()
        FBM->>GL: glGenTexture() or glGenRenderbuffer()
        FBM->>GL: glFramebufferTexture2D() or glFramebufferRenderbuffer()
    end

    App->>FBM: bind(attachment)
    FBM->>GL: glBindFramebuffer(GL_FRAMEBUFFER, fbo)
    FBM->>GL: glViewport(0, 0, width, height)

    Note over App,GL: Render content
    App->>GL: draw calls...

    App->>FBM: unbind()
    FBM->>GL: glBindFramebuffer(GL_FRAMEBUFFER, null)

    App->>FBM: transferToAtlas(attachment, atlasNode)
    FBM->>Atlas: Get atlas texture coordinates
    FBM->>GL: glCopyTexSubImage2D(atlas, ...)

    App->>FBM: releaseAttachment(attachment)
    FBM->>FBM: Return to pool
```

---

## MSAA vs Texture Mode / MSAA vs テクスチャモード

```mermaid
flowchart TB
    CHECK{MSAA required?}

    subgraph "MSAA Mode"
        MSAA_CREATE[Renderbuffer + MSAA]
        MSAA_RENDER[Render to MSAA buffer]
        MSAA_RESOLVE[glBlitFramebuffer]
    end

    subgraph "Texture Mode"
        TEX_CREATE[Texture attachment]
        TEX_RENDER[Render to texture]
        TEX_USE[Use texture directly]
    end

    CHECK -->|Yes| MSAA_CREATE
    MSAA_CREATE --> MSAA_RENDER
    MSAA_RENDER --> MSAA_RESOLVE

    CHECK -->|No| TEX_CREATE
    TEX_CREATE --> TEX_RENDER
    TEX_RENDER --> TEX_USE
```

---

# 14. Atlas Management / アトラス管理

## Atlas Manager State / アトラスマネージャー状態

```typescript
// AtlasManager.ts - 状態変数
$activeAtlasIndex: number = 0;                          // アクティブなアトラスインデックス
$currentAtlasIndex: number = 0;                         // 現在のアトラスインデックス
$atlasAttachmentObjects: IAttachmentObject[] = [];      // アタッチメントオブジェクト配列
$rootNodes: TexturePacker[] = [];                       // ルートノード配列
$atlasTexture: ITextureObject | null = null;            // アトラステクスチャ
$transferBounds: Float32Array[] = [];                   // 転送範囲（ノード描画時）
$allTransferBounds: Float32Array[] = [];                // 全転送範囲（切り替え時）

// AtlasManager.ts - 状態関数
$setActiveAtlasIndex(index: number): void
$getActiveAtlasIndex(): number
$setCurrentAtlasIndex(index: number): void
$getCurrentAtlasIndex(): number

// 転送範囲管理
$getActiveTransferBounds(index: number): Float32Array
$getActiveAllTransferBounds(index: number): Float32Array
$clearTransferBounds(): void

// アタッチメント管理
$getAtlasAttachmentObjects(): IAttachmentObject[]
$setAtlasAttachmentObject(attachment_object: IAttachmentObject): void
$getAtlasAttachmentObject(): IAttachmentObject
$hasAtlasAttachmentObject(): boolean

// テクスチャ取得
$getAtlasTextureObject(): ITextureObject
```

---

## Binary Tree Packing Algorithm / バイナリツリーパッキングアルゴリズム

```mermaid
flowchart TB
    subgraph "TexturePacker"
        ROOT[Root Node]

        subgraph "Binary Tree"
            N1[Node A]
            N2[Node B]
            N3[Node C]
            N4[Node D]
        end
    end

    subgraph "Insert Algorithm"
        INSERT[createNode]
        CHECK_FIT{fits?}
        CHECK_LEAF{is leaf?}
        SPLIT[split node]
        OCCUPY[return Node]
        TRY_CHILDREN[try children]
    end

    ROOT --> N1
    ROOT --> N2
    N1 --> N3
    N1 --> N4

    INSERT --> CHECK_FIT
    CHECK_FIT -->|No| FAIL[null]
    CHECK_FIT -->|Yes| CHECK_LEAF
    CHECK_LEAF -->|empty| SPLIT
    CHECK_LEAF -->|occupied| FAIL
    CHECK_LEAF -->|not leaf| TRY_CHILDREN
    SPLIT --> OCCUPY
    TRY_CHILDREN --> CHECK_FIT
```

---

## Atlas Transfer Flow / アトラス転送フロー

```mermaid
sequenceDiagram
    participant CTX as Context
    participant Atlas as AtlasManager
    participant GL as WebGL2

    Note over CTX,GL: Node creation and rendering

    CTX->>Atlas: createNode(width, height)
    Atlas->>Atlas: atlasManagerCreateNodeService
    Atlas-->>CTX: Return Node {x, y, w, h}

    CTX->>CTX: beginNodeRendering(node)
    CTX->>CTX: contextUpdateTransferBoundsService(node)
    CTX->>CTX: contextBeginNodeRenderingService

    Note over CTX,GL: Draw content
    CTX->>GL: fill(), stroke(), etc.

    CTX->>CTX: endNodeRendering()
    CTX->>CTX: contextEndNodeRenderingService

    Note over CTX,GL: DisplayObject rendering
    CTX->>CTX: drawDisplayObject(node, ...)
    CTX->>CTX: contextUpdateAllTransferBoundsService(node)
    CTX->>CTX: blnedDrawDisplayObjectUseCase

    Note over CTX,GL: Final instanced draw
    CTX->>CTX: drawArraysInstanced()
    CTX->>GL: Instanced quad rendering
```

---

## Multi-Atlas Management / マルチアトラス管理

```mermaid
flowchart TB
    subgraph "Atlas Manager"
        ROOT_NODES[$rootNodes]
        ATLAS_OBJS[$atlasAttachmentObjects]
        TRANSFER[$transferBounds]
        ALL_TRANSFER[$allTransferBounds]
    end

    subgraph "Index Management"
        ACTIVE[$activeAtlasIndex]
        CURRENT[$currentAtlasIndex]
    end

    subgraph "Atlas Texture"
        TEX[$atlasTexture]
        SIZE[RENDER_MAX_SIZE]
    end

    ROOT_NODES --> ACTIVE
    ATLAS_OBJS --> CURRENT
    TEX --> SIZE
```

---

## Transfer Bounds Management / 転送範囲管理

```typescript
// 転送範囲の初期値
const $MAX_VALUE = Number.MAX_VALUE;
const $MIN_VALUE = -Number.MAX_VALUE;

// 転送範囲の構造
$transferBounds[index] = new Float32Array([
    $MAX_VALUE,   // xMin
    $MAX_VALUE,   // yMin
    $MIN_VALUE,   // xMax
    $MIN_VALUE    // yMax
]);

// クリア処理 ($clearTransferBounds)
bounds[0] = bounds[1] = $MAX_VALUE;
bounds[2] = bounds[3] = $MIN_VALUE;
```

---

# 15. Vertex Array Object / 頂点配列オブジェクト

## VAO Management / VAO管理

**VertexArrayObject.ts Global Variables / グローバル変数:**
```typescript
$objectPool: IVertexArrayObject[]        // フィル用VAOプール
$strokeObjectPool: IStrokeVertexArrayObject[]  // ストローク用VAOプール
$vertexBufferData: Float32Array          // 頂点バッファデータ [0,0,0,1,1,0,1,1]
$attributeWebGLBuffer: WebGLBuffer       // インスタンス用WebGLBuffer
$instancedVertexArrayObject: IVertexArrayObject  // インスタンス用VAO

// Functions
$setAttributeWebGLBuffer(gl): void       // インスタンス用バッファ初期化
$setInstancedVertexArrayObject(vao): void  // インスタンス用VAOセット
$getRectVertexArrayObject(): IVertexArrayObject  // 矩形描画用VAO取得（遅延初期化）
```

```mermaid
flowchart TB
    subgraph "Object Pool"
        FILL_POOL[$objectPool fill]
        STROKE_POOL[$strokeObjectPool]
    end

    subgraph "VAO Structure"
        VAO[WebGLVertexArrayObject]
        VBO[Vertex Buffer]
        IBO[Index Buffer]
        ATTRS[Attribute Pointers]
    end

    subgraph "Operations"
        CREATE[create]
        BINDVAO[bind]
        UNBIND[unbind]
        DRAW[draw]
        RELEASE[release]
    end

    CREATE --> VAO
    VAO --> VBO
    VAO --> IBO
    VAO --> ATTRS

    BINDVAO --> VAO
    DRAW --> VAO
    UNBIND --> VAO
    RELEASE --> FILL_POOL
    RELEASE --> STROKE_POOL
```

---

## Instance Vertex Layout / インスタンス頂点レイアウト

```
Total: 88 bytes per instance / インスタンスあたり88バイト

┌─────────────────────────────────────────────────────────────────────┐
│ Attribute      │ Type       │ Size   │ Offset │ Divisor │ Desc     │
├─────────────────────────────────────────────────────────────────────┤
│ a_rect         │ vec4       │ 16B    │ 0      │ 1       │ x,y,w,h  │
│ a_size         │ vec2       │ 8B     │ 16     │ 1       │ tex size │
│ a_offset       │ vec2       │ 8B     │ 24     │ 1       │ uv offset│
│ a_matrix       │ mat3 (3xv3)│ 36B    │ 32     │ 1       │ transform│
│ a_mul          │ vec4       │ 16B    │ 68     │ 1       │ color mul│
│ a_add          │ vec4       │ 16B    │ 84     │ 1       │ color add│
└─────────────────────────────────────────────────────────────────────┘

Stride = 100 bytes (aligned to 4) / ストライド = 100バイト
```

---

## Buffer Growth Strategy / バッファ成長戦略

```mermaid
flowchart TB
    CHECK{data > buffer?}

    GROW[next power of 2]
    REALLOC[bufferData newSize]

    NO_GROW[use existing buffer]
    UPDATE[bufferSubData]

    CHECK -->|Yes| GROW
    GROW --> REALLOC
    REALLOC --> UPDATE

    CHECK -->|No| NO_GROW
    NO_GROW --> UPDATE
```

---

[Next: Data Structures →](./10-data-structures.md)
