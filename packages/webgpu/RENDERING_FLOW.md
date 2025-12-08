# WebGPU Rendering Flow - Technical Specification
# WebGPU レンダリングフロー - 技術仕様書

This document describes the WebGPU rendering pipeline implementation, based on the WebGL version.

このドキュメントは、WebGL版を基にしたWebGPUレンダリングパイプラインの実装を説明します。

---

## Table of Contents / 目次

1. [High-Level Architecture](#1-high-level-architecture)
2. [WebGL to WebGPU Key Differences](#2-webgl-to-webgpu-key-differences)
3. [Rendering Pipeline](#3-rendering-pipeline)
4. [Context and State Management](#4-context-and-state-management)
5. [Path Command Processing](#5-path-command-processing)
6. [Mesh Generation with Loop-Blinn](#6-mesh-generation-with-loop-blinn)
7. [Shader System](#7-shader-system)
8. [Resource Management](#8-resource-management)
9. [Instanced Rendering](#9-instanced-rendering)
10. [Mask System](#10-mask-system)
11. [Blend Mode System](#11-blend-mode-system)
12. [Data Structures](#12-data-structures)

---

## 1. High-Level Architecture

### System Overview / システム概要

```mermaid
graph TB
    subgraph "Application Layer / アプリケーション層"
        RQ[RenderQueue<br/>レンダーキュー]
    end

    subgraph "WebGPU Package / WebGPUパッケージ"
        CTX[Context.ts<br/>メインコンテキスト]

        subgraph "Path Processing / パス処理"
            PC[PathCommand<br/>パスコマンド]
            BC[BezierConverter<br/>ベジェ変換]
        end

        subgraph "Geometry / ジオメトリ"
            MESH[Mesh<br/>メッシュ生成]
            BUF[BufferManager<br/>バッファ管理]
        end

        subgraph "Rendering / レンダリング"
            PM[PipelineManager<br/>パイプライン管理]
            SS[ShaderSource<br/>シェーダーソース]
            BLEND[Blend<br/>ブレンド]
            MASK[Mask<br/>マスク]
        end

        subgraph "Resource Management / リソース管理"
            FBM[FrameBufferManager<br/>FBO管理]
            ATT[AttachmentManager<br/>アタッチメント管理]
            ATLAS[AtlasManager<br/>アトラス管理]
            TEX[TextureManager<br/>テクスチャ管理]
            GRAD[GradientLUTGenerator<br/>グラデーションLUT]
        end
    end

    subgraph "GPU / GPU"
        WGPU[WebGPU API]
    end

    RQ --> CTX
    CTX --> PC
    PC --> BC
    BC --> MESH
    MESH --> BUF
    BUF --> PM
    PM --> SS
    SS --> WGPU

    CTX --> BLEND
    CTX --> MASK

    BLEND --> PM
    MASK --> PM

    FBM --> WGPU
    ATT --> FBM
    ATLAS --> FBM
    TEX --> WGPU
    GRAD --> TEX
```

---

## 2. WebGL to WebGPU Key Differences

### API Differences / API差分

| Feature | WebGL2 | WebGPU |
|---------|--------|--------|
| Context Creation | `getContext('webgl2')` | `navigator.gpu.requestAdapter()` |
| State Management | Global mutable state | Immutable pipeline state |
| Shaders | GLSL ES 3.0 | WGSL |
| Buffer Binding | `gl.bindBuffer()` | BindGroup + Pipeline |
| Texture Binding | `gl.activeTexture()` + `gl.bindTexture()` | BindGroup |
| Draw Calls | `gl.drawArrays()` | `renderPass.draw()` |
| Frame Buffer | FBO with attachments | GPUTexture + RenderPassDescriptor |
| Blend State | `gl.blendFunc()` | Pipeline blend state |
| Stencil State | `gl.stencilFunc()` | Pipeline stencil state |

### Architecture Changes / アーキテクチャ変更

```mermaid
flowchart LR
    subgraph "WebGL / WebGL"
        GL_STATE[Global State<br/>グローバルステート]
        GL_BIND[Bind Resources<br/>リソースバインド]
        GL_DRAW[Draw Call<br/>描画コール]
    end

    subgraph "WebGPU / WebGPU"
        GPU_PIPELINE[Pipeline<br/>パイプライン]
        GPU_BIND[BindGroup<br/>バインドグループ]
        GPU_ENCODER[CommandEncoder<br/>コマンドエンコーダー]
        GPU_PASS[RenderPass<br/>レンダーパス]
    end

    GL_STATE --> GL_BIND --> GL_DRAW

    GPU_PIPELINE --> GPU_ENCODER
    GPU_BIND --> GPU_ENCODER
    GPU_ENCODER --> GPU_PASS
```

---

## 3. Rendering Pipeline

### Main Rendering Flow / メインレンダリングフロー

```mermaid
flowchart TB
    subgraph "1. Initialization / 初期化"
        INIT[Context初期化]
        INIT --> GET_ADAPTER[GPUAdapter取得]
        GET_ADAPTER --> GET_DEVICE[GPUDevice取得]
        GET_DEVICE --> INIT_MANAGERS[Manager初期化<br/>Pipeline, Buffer, FBM]
    end

    subgraph "2. Frame Begin / フレーム開始"
        FRAME_START[beginFrame]
        FRAME_START --> CREATE_ENCODER[CommandEncoder作成]
        CREATE_ENCODER --> CREATE_PASS[RenderPass開始]
        CREATE_PASS --> CLEAR[画面クリア]
    end

    subgraph "3. Shape Rendering / シェイプレンダリング"
        RENDER[レンダリング処理]
        RENDER --> BEGIN_PATH[beginPath]
        BEGIN_PATH --> PATH_CMDS[パスコマンド実行<br/>moveTo/lineTo/curveTo]
        PATH_CMDS --> FILL_TYPE{fillタイプ?}

        FILL_TYPE -->|Solid| SOLID_FILL[fill<br/>Loop-Blinn描画]
        FILL_TYPE -->|Gradient| GRADIENT_FILL[gradientFill]
        FILL_TYPE -->|Bitmap| BITMAP_FILL[bitmapFill]
        FILL_TYPE -->|Stroke| STROKE[stroke<br/>ストロークメッシュ生成]
    end

    subgraph "4. Atlas Rendering / アトラス描画"
        SOLID_FILL --> DRAW_INSTANCED{インスタンス配列?}
        GRADIENT_FILL --> DRAW_INSTANCED
        BITMAP_FILL --> DRAW_INSTANCED
        STROKE --> DRAW_INSTANCED

        DRAW_INSTANCED -->|Full| FLUSH[drawArraysInstanced<br/>アトラス一括描画]
        DRAW_INSTANCED -->|Continue| ACCUMULATE[インスタンス配列蓄積]
    end

    subgraph "5. Frame End / フレーム終了"
        FLUSH --> END_PASS[RenderPass終了]
        END_PASS --> SUBMIT[CommandBuffer送信]
        SUBMIT --> FRAME_END[endFrame]
    end

    INIT_MANAGERS --> FRAME_START
    FRAME_START --> RENDER
    ACCUMULATE --> RENDER
```

---

## 4. Context and State Management

### State Stack / ステートスタック

```mermaid
stateDiagram-v2
    [*] --> Initial: Context作成

    Initial --> Saved: save()
    Saved --> Saved: save() (nested)
    Saved --> Restored: restore()
    Restored --> Saved: save()
    Restored --> Initial: restore() (empty stack)

    state Initial {
        [*] --> DefaultState
        DefaultState: $matrix = identity<br/>$globalAlpha = 1.0<br/>$fillStyle = [1,1,1,1]<br/>$strokeStyle = [0,0,0,1]
    }

    state Saved {
        [*] --> PushStack
        PushStack: $stack.push({<br/>matrix, alpha, blend,<br/>fillStyle, strokeStyle})
    }

    state Restored {
        [*] --> PopStack
        PopStack: state = $stack.pop()
    }
```

### Context State Variables / コンテキスト状態変数

| Variable | Type | Description |
|----------|------|-------------|
| `$matrix` | `Float32Array[9]` | Current 3x3 transformation matrix |
| `$stack` | `Array<CanvasState>` | Save/restore state stack |
| `$globalAlpha` | `number` | Global alpha value (0.0-1.0) |
| `$fillStyle` | `Float32Array[4]` | Current fill color (RGBA) |
| `$strokeStyle` | `Float32Array[4]` | Current stroke color (RGBA) |
| `thickness` | `number` | Current stroke width |

---

## 5. Path Command Processing

### Path Data Flow / パスデータフロー

```mermaid
flowchart TB
    subgraph Input["Input / 入力"]
        MOVE[moveTo x,y]
        LINE[lineTo x,y]
        QUAD[quadraticCurveTo<br/>cx,cy, x,y]
        CUBIC[bezierCurveTo<br/>c1x,c1y, c2x,c2y, x,y]
        ARC[arc<br/>cx,cy, radius]
    end

    subgraph Process["PathCommand Processing / PathCommand処理"]
        BEGIN[beginPath<br/>currentPath = empty<br/>vertices = empty]
        ADD_MOVE["currentPath = [x, y, false]"]
        ADD_LINE["currentPath.push(x, y, false)"]
        ADD_QUAD["currentPath.push(<br/>cx, cy, true,<br/>x, y, false)"]
        CONVERT_CUBIC[Cubic to Quadratic変換<br/>4分割近似]
    end

    subgraph Output["Output / 出力"]
        CLOSE[closePath<br/>始点に戻る直線追加]
        GET_VERTICES["$getVertices<br/>全パス配列を取得"]
        RESULT["IPath[] = [[x,y,flag], ...]"]
    end

    BEGIN --> MOVE
    MOVE --> ADD_MOVE
    ADD_MOVE --> LINE
    LINE --> ADD_LINE
    ADD_LINE --> QUAD
    QUAD --> ADD_QUAD
    ADD_QUAD --> CUBIC
    CUBIC --> CONVERT_CUBIC
    CONVERT_CUBIC --> CLOSE
    CLOSE --> GET_VERTICES
    GET_VERTICES --> RESULT
```

### Path Format / パスフォーマット

```
IPath = [x, y, isControlPoint, x, y, isControlPoint, ...]

isControlPoint:
  - false: 通常の頂点または終点 (lineTo endpoint)
  - true:  二次ベジェ曲線の制御点 (quadratic control point)

Example - Rectangle:
  [0, 0, false,  100, 0, false,  100, 100, false,  0, 100, false]

Example - Quadratic curve:
  [0, 0, false,  50, -50, true,  100, 0, false]
```

---

## 6. Mesh Generation with Loop-Blinn

### Loop-Blinn Method Overview / Loop-Blinn法概要

GPU Gems 3 Chapter 25に基づく二次ベジェ曲線のGPUアンチエイリアシング実装。

Reference: https://developer.nvidia.com/gpugems/gpugems3/part-iv-image-effects/chapter-25-rendering-vector-art-gpu

```mermaid
flowchart TB
    subgraph "Input / 入力"
        PATH["Path vertices<br/>[x, y, isControl, ...]"]
    end

    subgraph "Triangle Processing / 三角形処理"
        EXTRACT["点を抽出<br/>線分 vs 曲線判定"]

        LINEAR["線分三角形<br/>bezier = (0, 1)"]
        CURVE["曲線三角形<br/>P0: (0, 0)<br/>P1: (0.5, 0) control<br/>P2: (1, 1)"]
    end

    subgraph "Vertex Format / 頂点フォーマット"
        VERTEX["17 floats per vertex:<br/>position(2) + bezier(2) +<br/>color(4) + matrix(9)"]
    end

    subgraph "Fragment Shader / フラグメントシェーダー"
        IMPLICIT["暗黙的関数: f(u,v) = u² - v"]
        GRADIENT["勾配計算: ∇f"]
        DISTANCE["符号付き距離: f / |∇f|"]
        AA["smoothstep(-0.5, 0.5, dist)"]
    end

    PATH --> EXTRACT
    EXTRACT --> LINEAR
    EXTRACT --> CURVE
    LINEAR --> VERTEX
    CURVE --> VERTEX
    VERTEX --> IMPLICIT
    IMPLICIT --> GRADIENT
    GRADIENT --> DISTANCE
    DISTANCE --> AA
```

### Bezier Coordinate Assignment / ベジェ座標割り当て

```
Triangle for linear segment:
  P0: bezier = (0, 1)  // Always inside
  P1: bezier = (0, 1)  // Always inside
  P2: bezier = (0, 1)  // Always inside

Triangle for quadratic curve (P0 → Control → P2):
  P0 (start):   bezier = (0, 0)    // f = 0² - 0 = 0 (on curve)
  P1 (control): bezier = (0.5, 0)  // f = 0.25 - 0 = 0.25 (outside)
  P2 (end):     bezier = (1, 1)    // f = 1² - 1 = 0 (on curve)
```

### Vertex Data Layout (17 floats) / 頂点データレイアウト

```
Total: 68 bytes per vertex / 頂点あたり68バイト

┌─────────────────────────────────────────────────────────────────┐
│ Attribute    │ Location │ Type    │ Count │ Description         │
├─────────────────────────────────────────────────────────────────┤
│ position     │ 0        │ float32 │ 2     │ Position x, y       │
│ bezier       │ 1        │ float32 │ 2     │ Bezier u, v coords  │
│ color        │ 2        │ float32 │ 4     │ RGBA (premultiplied)│
│ matrix0      │ 3        │ float32 │ 3     │ Matrix column 0     │
│ matrix1      │ 4        │ float32 │ 3     │ Matrix column 1     │
│ matrix2      │ 5        │ float32 │ 3     │ Matrix column 2     │
└─────────────────────────────────────────────────────────────────┘

Stride = 68 bytes
```

---

## 7. Shader System

### Fill Vertex Shader / フィル頂点シェーダー

```wgsl
struct VertexInput {
    @location(0) position: vec2<f32>,
    @location(1) bezier: vec2<f32>,
    @location(2) color: vec4<f32>,
    @location(3) matrix0: vec3<f32>,
    @location(4) matrix1: vec3<f32>,
    @location(5) matrix2: vec3<f32>,
}

@vertex
fn main(input: VertexInput) -> VertexOutput {
    // Build 3x3 matrix from vertex attributes
    let matrix = mat3x3<f32>(
        input.matrix0, input.matrix1, input.matrix2
    );

    // Transform position
    let transformed = matrix * vec3<f32>(input.position, 1.0);

    // Normalize to viewport
    let pos = transformed.xy / uniforms.viewportSize;

    // Convert to NDC and flip Y
    let ndc = pos * 2.0 - 1.0;
    output.position = vec4<f32>(ndc.x, -ndc.y, 0.0, 1.0);

    // Pass through bezier coords and color (already premultiplied)
    output.bezier = input.bezier;
    output.color = input.color;
}
```

### Fill Fragment Shader with Loop-Blinn AA / フィルフラグメントシェーダー（Loop-Blinn AA）

```wgsl
@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
    // Loop-Blinn implicit function: f(u,v) = u² - v
    let f_val = input.bezier.x * input.bezier.x - input.bezier.y;

    // Screen-space gradient
    let dx = dpdx(f_val);
    let dy = dpdy(f_val);

    // Signed distance normalized by gradient
    let dist = f_val / length(vec2<f32>(dx, dy));

    // Anti-aliasing with smoothstep (~1 pixel transition)
    let aa = smoothstep(0.5, -0.5, dist);

    if (aa <= 0.001) {
        discard;
    }

    // Color is already premultiplied, apply AA factor
    return input.color * aa;
}
```

### Premultiplied Alpha Flow / プリマルチプライドアルファフロー

```mermaid
flowchart LR
    subgraph "CPU Side / CPU側"
        FILL_STYLE["fillStyle<br/>[R, G, B, A]"]
        PREMULT["Premultiply<br/>R*A, G*A, B*A, A"]
        MESH_GEN["Mesh Generation<br/>color = premultiplied"]
    end

    subgraph "GPU Side / GPU側"
        VERTEX["Vertex Shader<br/>Pass through color"]
        FRAGMENT["Fragment Shader<br/>color * aa"]
        BLEND["Blend: src + (1-srcA)*dst"]
    end

    FILL_STYLE --> PREMULT --> MESH_GEN --> VERTEX --> FRAGMENT --> BLEND
```

---

## 8. Resource Management

### Buffer Management / バッファ管理

```mermaid
flowchart TB
    subgraph "BufferManager"
        CREATE["createVertexBuffer<br/>createUniformBuffer<br/>createIndexBuffer"]
        CACHE["Buffer Cache<br/>Map<string, GPUBuffer>"]
        RELEASE["releaseBuffer<br/>destroy + delete"]
    end

    subgraph "Usage"
        FILL["Fill vertices"]
        STROKE["Stroke vertices"]
        UNIFORM["Uniform data"]
        INSTANCE["Instance data"]
    end

    FILL --> CREATE
    STROKE --> CREATE
    UNIFORM --> CREATE
    INSTANCE --> CREATE
    CREATE --> CACHE
    CACHE --> RELEASE
```

### Pipeline Management / パイプライン管理

```mermaid
flowchart TB
    subgraph "PipelineManager"
        INIT["initialize<br/>Create all pipelines"]
        GET["getPipeline(type)"]
        LAYOUT["getBindGroupLayout(type)"]
    end

    subgraph "Pipeline Types"
        BASIC["basic: Simple color"]
        FILL["fill: Loop-Blinn"]
        MASK["mask: Stencil"]
        INSTANCE["instanced: Atlas"]
        GRADIENT["gradient: LUT"]
        BLEND["blend: Composite"]
    end

    INIT --> BASIC
    INIT --> FILL
    INIT --> MASK
    INIT --> INSTANCE
    INIT --> GRADIENT
    INIT --> BLEND

    GET --> BASIC
    GET --> FILL
    GET --> MASK
    GET --> INSTANCE
    GET --> GRADIENT
    GET --> BLEND
```

### FrameBuffer Management / フレームバッファ管理

```mermaid
flowchart TB
    subgraph "FrameBufferManager"
        CREATE_ATT["createAttachment<br/>GPUTexture + View"]
        GET_ATT["getAttachment"]
        PASS_DESC["createRenderPassDescriptor"]
    end

    subgraph "Attachments"
        ATLAS["atlas: 4096x4096<br/>Main atlas texture"]
        MASK["mask: Variable size<br/>Stencil operations"]
        TEMP["temp: Variable size<br/>Filter operations"]
    end

    CREATE_ATT --> ATLAS
    CREATE_ATT --> MASK
    CREATE_ATT --> TEMP
```

---

## 9. Instanced Rendering

### Atlas-Based Instanced Draw / アトラスベースのインスタンス描画

```mermaid
flowchart TB
    subgraph "Accumulation / 蓄積"
        DO1["DisplayObject 1"]
        DO2["DisplayObject 2"]
        DO3["DisplayObject N"]
        ARRAY["instanceArray<br/>Float32Array[]"]
    end

    subgraph "Instance Data / インスタンスデータ"
        FORMAT["Per instance: 32 floats<br/>textureRect(4) + textureDim(4) +<br/>matrixTx(4) + matrixScale(4) +<br/>mulColor(4) + addColor(4)"]
    end

    subgraph "Draw / 描画"
        FLUSH["drawArraysInstanced"]
        PIPELINE["instanced pipeline"]
        BIND["BindGroup: sampler + atlas"]
        DRAW["renderPass.draw(6, N)"]
    end

    DO1 --> ARRAY
    DO2 --> ARRAY
    DO3 --> ARRAY
    ARRAY --> FORMAT
    FORMAT --> FLUSH
    FLUSH --> PIPELINE
    PIPELINE --> BIND
    BIND --> DRAW
```

### Instanced Vertex Shader / インスタンス頂点シェーダー

```wgsl
struct VertexInput {
    @location(0) position: vec2<f32>,  // Quad vertex (0-1)
    @location(1) texCoord: vec2<f32>,  // UV (0-1)
}

struct InstanceInput {
    @location(2) textureRect: vec4<f32>,   // x, y, w, h in atlas
    @location(3) textureDim: vec4<f32>,    // w, h, viewportW, viewportH
    @location(4) matrixTx: vec4<f32>,      // tx, ty, pad, pad
    @location(5) matrixScale: vec4<f32>,   // scale0, rotate0, scale1, rotate1
    @location(6) mulColor: vec4<f32>,      // Color multiply
    @location(7) addColor: vec4<f32>,      // Color add
}

@vertex
fn main(input: VertexInput, instance: InstanceInput) -> VertexOutput {
    // Calculate texture coordinates in atlas
    let texX = instance.textureRect.x + input.texCoord.x * instance.textureRect.z;
    let texY = instance.textureRect.y + input.texCoord.y * instance.textureRect.w;

    // Apply transformation
    let pos = input.position * instance.textureDim.xy;
    let transformed = mat2x2 * pos + instance.matrixTx.xy;

    // Convert to NDC
    let ndc = (transformed / instance.textureDim.zw) * 2.0 - 1.0;
    output.position = vec4(ndc.x, 1.0 - ndc.y * 2.0, 0.0, 1.0);
}
```

### Color Transform in Fragment / フラグメントでのカラー変換

```wgsl
@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    var src = textureSample(atlas, sampler, input.texCoord);

    // Unpremultiply
    let unpremultiplied = vec4(src.rgb / max(0.0001, src.a), src.a);

    // Apply color transform: multiply + add
    var transformed = clamp(
        unpremultiplied * input.mulColor + input.addColor,
        vec4(0.0), vec4(1.0)
    );

    // Premultiply again
    return vec4(transformed.rgb * transformed.a, transformed.a);
}
```

---

## 10. Mask System

### Mask Rendering Flow / マスクレンダリングフロー

```mermaid
flowchart TB
    subgraph "Begin Mask / マスク開始"
        BEGIN[beginMask]
        SAVE_STATE["Save render state"]
        BIND_MASK["Bind mask attachment"]
        CLEAR_STENCIL["Clear stencil to 0"]
    end

    subgraph "Render Mask Shape / マスク形状描画"
        DRAW_MASK["Draw mask shape"]
        WRITE_STENCIL["Write 1 to stencil"]
    end

    subgraph "End Mask / マスク終了"
        END_BEGIN[endMask]
        SET_TEST["Set stencil test: == 1"]
    end

    subgraph "Render Content / コンテンツ描画"
        DRAW_CONTENT["Draw masked content"]
        STENCIL_PASS["Only where stencil == 1"]
    end

    subgraph "Remove Mask / マスク解除"
        RESTORE[restore]
        UNBIND["Unbind mask attachment"]
        DISABLE["Disable stencil test"]
    end

    BEGIN --> SAVE_STATE --> BIND_MASK --> CLEAR_STENCIL
    CLEAR_STENCIL --> DRAW_MASK --> WRITE_STENCIL
    WRITE_STENCIL --> END_BEGIN --> SET_TEST
    SET_TEST --> DRAW_CONTENT --> STENCIL_PASS
    STENCIL_PASS --> RESTORE --> UNBIND --> DISABLE
```

### Stencil Pipeline Configuration / ステンシルパイプライン設定

```typescript
// Mask write pipeline (write 1 to stencil)
depthStencil: {
    format: "stencil8",
    stencilFront: {
        compare: "always",
        passOp: "replace"
    },
    stencilWriteMask: 0xFF,
    stencilReadMask: 0xFF
}

// Masked content pipeline (test stencil == 1)
depthStencil: {
    format: "stencil8",
    stencilFront: {
        compare: "equal",
        passOp: "keep"
    },
    stencilReference: 1
}
```

---

## 11. Blend Mode System

### Supported Blend Modes / サポートされるブレンドモード

| Mode | WebGPU Blend State |
|------|-------------------|
| normal | src + (1-srcA) * dst |
| add | src + dst |
| multiply | src * dst |
| screen | src + dst - src * dst |
| overlay | Shader-based |
| hardlight | Shader-based |
| difference | Shader-based |

### Hardware Blend Configuration / ハードウェアブレンド設定

```typescript
// Normal blend (premultiplied alpha)
blend: {
    color: {
        srcFactor: "one",
        dstFactor: "one-minus-src-alpha",
        operation: "add"
    },
    alpha: {
        srcFactor: "one",
        dstFactor: "one-minus-src-alpha",
        operation: "add"
    }
}
```

---

## 12. Data Structures

### IAttachmentObject

```typescript
interface IAttachmentObject {
    texture: GPUTexture;
    view: GPUTextureView;
    width: number;
    height: number;
    colorTexture?: {
        texture: GPUTexture;
        view: GPUTextureView;
    };
    stencilTexture?: {
        texture: GPUTexture;
        view: GPUTextureView;
    };
}
```

### IMeshData

```typescript
interface IMeshData {
    buffer: Float32Array;  // 17 floats per vertex
    indexCount: number;    // Number of vertices to draw
}
```

### CanvasState

```typescript
interface CanvasState {
    matrix: Float32Array;
    globalAlpha: number;
    fillStyle: Float32Array;
    strokeStyle: Float32Array;
    imageSmoothingEnabled: boolean;
}
```

---

## Summary / まとめ

WebGPU版は以下の主要な特徴を持ちます：

1. **Loop-Blinn法**: 二次ベジェ曲線のGPUベースアンチエイリアシング
2. **プリマルチプライドアルファ**: CPU側で事前乗算、GPUはAAのみ適用
3. **インスタンス描画**: アトラステクスチャとバッチ描画による効率化
4. **イミュータブルパイプライン**: WebGPUのパイプライン事前定義
5. **カラートランスフォーム**: unpremultiply → transform → premultiply

WebGL版との互換性を維持しつつ、WebGPUの特性を活かした実装になっています。
