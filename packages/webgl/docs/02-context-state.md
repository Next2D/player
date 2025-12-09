# 3. Context State Management / コンテキスト状態管理

[← Back to Index](./README.md) | [← Previous: Architecture](./01-architecture.md)

---

## State Stack / ステートスタック

```mermaid
stateDiagram-v2
    [*] --> Initial: Context Create

    Initial --> Saved: save()
    Saved --> Saved: save() nested
    Saved --> Restored: restore()
    Restored --> Saved: save()
    Restored --> Initial: restore() empty

    state Initial {
        [*] --> DefaultMatrix
        DefaultMatrix --> DefaultAlpha
        DefaultAlpha --> DefaultBlend
        DefaultBlend --> DefaultFill
    }

    state Saved {
        [*] --> PushStack
        PushStack: push matrix to stack
    }

    state Restored {
        [*] --> PopStack
        PopStack: pop matrix from stack
    }
```

---

## Context State Variables / コンテキスト状態変数

| Variable | Type | Description |
|----------|------|-------------|
| `$matrix` | `Float32Array[9]` | Current 3x3 transformation matrix |
| `$stack` | `Float32Array[]` | Save/restore matrix stack |
| `globalAlpha` | `number` | Global alpha value (0.0-1.0) |
| `globalCompositeOperation` | `IBlendMode` | Current blend mode |
| `$fillStyle` | `Float32Array[4]` | Current fill RGBA color |
| `$strokeStyle` | `Float32Array[4]` | Current stroke RGBA color |
| `imageSmoothingEnabled` | `boolean` | Texture smoothing flag |
| `$mainAttachmentObject` | `IAttachmentObject \| null` | Main attachment object |
| `$stackAttachmentObject` | `IAttachmentObject[]` | Attachment object stack |
| `maskBounds` | `IBounds` | Mask drawing bounds |
| `thickness` | `number` | Stroke thickness (default: 1) |
| `caps` | `number` | Stroke cap style (0=butt, 1=round, 2=square, default: 1) |
| `joints` | `number` | Stroke joint style (0=bevel, 1=round, 2=miter, default: 2) |
| `miterLimit` | `number` | Miter limit (default: 0) |
| `$clearColorR/G/B/A` | `number` | Background clear color |

---

## Transformation Matrix Operations / 変換行列操作

```mermaid
flowchart LR
    subgraph "Matrix Operations"
        TF[transform]
        SET[setTransform]
    end

    subgraph "Matrix Format 3x3"
        M[Float32Array 9]
    end

    TF --> M
    SET --> M
```

**Matrix Layout / 行列レイアウト:**
```
| m[0]  m[3]  m[6] |   | a  c  e |
| m[1]  m[4]  m[7] | = | b  d  f |
| m[2]  m[5]  m[8] |   | 0  0  1 |
```

---

## Global State Management (WebGLUtil.ts) / グローバル状態管理

| Variable | Type | Description |
|----------|------|-------------|
| `$RENDER_MAX_SIZE` | `number` | Maximum render size (default: 2048, max: 4096) |
| `$samples` | `number` | MSAA sample count (default: 4) |
| `$gl` | `WebGL2RenderingContext` | WebGL2 context |
| `$context` | `Context` | Context instance |
| `$devicePixelRatio` | `number` | Device pixel ratio (default: 1) |
| `$viewportWidth/Height` | `number` | Current viewport dimensions |

---

## Array Pooling System / 配列プーリングシステム

```mermaid
flowchart TB
    subgraph "Pool Types"
        ARR[$arrays]
        F4[$float32Array4]
        F6[$float32Array6]
        F9[$float32Array9]
        I4[$int32Array4]
    end

    subgraph "Operations"
        GET[getArray/getFloat32Array]
        POOL[poolArray/poolFloat32Array]
    end

    GET --> ARR
    GET --> F4
    GET --> F6
    GET --> F9
    GET --> I4
    POOL --> ARR
    POOL --> F4
    POOL --> F6
    POOL --> F9
    POOL --> I4
```

---

[Next: Path Command Processing →](./03-path-mesh.md)
