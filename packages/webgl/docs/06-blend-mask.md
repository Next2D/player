# 9. Blend Mode System / ブレンドモードシステム

[← Back to Index](./README.md) | [← Previous: Gradient](./05-gradient.md)

---

## Blend Mode Classification / ブレンドモード分類

```mermaid
flowchart TB
    BLEND[Blend Mode]

    SIMPLE{Simple Mode?}
    COMPLEX{Complex Mode?}

    subgraph "Simple Modes"
        NORMAL[normal]
        ADD[add]
        SCREEN[screen]
        ERASE[erase]
        COPY[copy]
    end

    subgraph "Complex Modes"
        MULTIPLY[multiply]
        OVERLAY[overlay]
        HARDLIGHT[hardlight]
        DARKEN[darken]
        LIGHTEN[lighten]
        DIFFERENCE[difference]
        SUBTRACT[subtract]
        INVERT[invert]
        ALPHA[alpha]
    end

    BLEND --> SIMPLE
    BLEND --> COMPLEX

    SIMPLE --> NORMAL
    SIMPLE --> ADD
    SIMPLE --> SCREEN
    SIMPLE --> ERASE
    SIMPLE --> COPY

    COMPLEX --> MULTIPLY
    COMPLEX --> OVERLAY
    COMPLEX --> HARDLIGHT
    COMPLEX --> DARKEN
    COMPLEX --> LIGHTEN
    COMPLEX --> DIFFERENCE
    COMPLEX --> SUBTRACT
    COMPLEX --> INVERT
    COMPLEX --> ALPHA
```

**Simple Blend Functions:**
- normal: SRC_ALPHA, ONE_MINUS_SRC_ALPHA
- add: SRC_ALPHA, ONE
- screen: ONE, ONE_MINUS_SRC_COLOR
- erase: ZERO, ONE_MINUS_SRC_ALPHA
- copy: ONE, ZERO

---

## Complex Blend Mode Rendering / 複雑ブレンドモードレンダリング

```mermaid
sequenceDiagram
    participant SRC as Source
    participant DST as Destination
    participant SHADER as BlendShader
    participant OUT as Output

    Note over SRC,OUT: 3-texture blend

    SRC->>SHADER: Bind texture0
    DST->>SHADER: Bind texture1

    SHADER->>SHADER: Sample colors
    SHADER->>SHADER: Apply blend formula

    SHADER->>OUT: Write result
```

**Complex Blend Formulas:**
- multiply: result = src * dst
- overlay: result = 2*src*dst (dark) or 1-2*(1-src)*(1-dst) (light)
- difference: result = abs(src - dst)

---

## Instanced Blend Rendering / インスタンスブレンドレンダリング

```mermaid
flowchart TB
    subgraph "Batching"
        COLLECT[collect same blend objects]
        INSTANCE_DATA[create instance data]
    end

    subgraph "Instanced Draw"
        BIND_VAO[bind VAO]
        SET_UNIFORMS[set uniforms]
        DRAW[drawArraysInstanced]
    end

    subgraph "Per-Instance Data"
        ATTR[attributes]
    end

    COLLECT --> INSTANCE_DATA
    INSTANCE_DATA --> BIND_VAO
    BIND_VAO --> SET_UNIFORMS
    SET_UNIFORMS --> DRAW
    ATTR -.-> DRAW
```

**Per-Instance Attributes:**
- a_rect: vec4 (x,y,w,h)
- a_size: vec2 (texW,texH)
- a_offset: vec2 (u,v offset)
- a_matrix: mat3 (transform)
- a_mul: vec4 (color multiply)
- a_add: vec4 (color add)

**Blend.ts State Functions / ブレンド状態関数:**
```typescript
$setCurrentBlendMode(blend_mode: IBlendMode): void
$getCurrentBlendMode(): IBlendMode

$setFuncCode(func_code: number): void    // default: 600
$getFuncCode(): number
```

---

# 10. Mask System / マスクシステム

## Stencil Mask Architecture / ステンシルマスクアーキテクチャ

```mermaid
flowchart TB
    subgraph "Stencil State"
        MODES[MASK=1 FILL=2]
        STATE[mode/colorMask/MSAA]
    end

    subgraph "Mask State"
        DRAWING[maskDrawingState]
        BOUNDS[clipBounds Map]
        LEVELS[clipLevels Map]
    end

    subgraph "Mask Operations"
        BEGIN[beginMask]
        SET_BOUNDS[setMaskBounds]
        END[endMask]
        LEAVE[leaveMask]
    end
```

**Stencil.ts State Functions / ステンシル状態関数:**
```typescript
// モード管理
$getStencilMode(): number
$setStencilMode(mode: number): void
$resetStencilMode(): void

// カラーマスク状態
$getColorMaskEnabled(): boolean
$setColorMaskEnabled(enabled: boolean): void

// MSAA SAMPLE_ALPHA_TO_COVERAGE状態
$getSampleAlphaToCoverageEnabled(): boolean
$setSampleAlphaToCoverageEnabled(enabled: boolean): void
```

**Mask.ts State Functions / マスク状態関数:**
```typescript
$setMaskDrawing(state: boolean): void
$isMaskDrawing(): boolean
$clipBounds: Map<number, Float32Array>  // レイヤーIDごとのクリップ境界
$clipLevels: Map<number, number>        // マスクネストレベル追跡
```

---

## Mask Begin/End Flow / マスク開始/終了フロー

```mermaid
sequenceDiagram
    participant App as Application
    participant Mask as MaskServices
    participant GL as WebGL2

    Note over App,GL: beginMask - マスク描画準備
    App->>Mask: beginMask()
    Mask->>Mask: $setMaskDrawing(true)
    Mask->>GL: ステンシル設定

    Note over App,GL: setMaskBounds - マスク範囲設定
    App->>Mask: setMaskBounds(xMin,yMin,xMax,yMax)
    Mask->>Mask: maskBounds更新

    Note over App,GL: Draw mask shape with clip()
    App->>App: clip()
    App->>GL: drawArrays(...) [mask geometry]

    Note over App,GL: endMask - マスク描画終了
    App->>Mask: endMask()
    Mask->>GL: ステンシル関数変更

    Note over App,GL: Draw content - コンテンツを描画
    App->>GL: drawArrays(...) [masked content]

    Note over App,GL: leaveMask - マスク終了処理
    App->>App: drawArraysInstanced()
    App->>Mask: leaveMask()
    Mask->>Mask: $setMaskDrawing(false)
    Mask->>GL: ステンシルリセット
```

---

## Union Mask (Level > 7) / ユニオンマスク (レベル > 7)

```mermaid
flowchart TB
    CHECK{clipLevel > 7?}

    subgraph "Normal Mask"
        NORMAL[level increment]
    end

    subgraph "Union Mask"
        UNION[merge masks]
        RENDER_ALL[render all paths]
        OR_OP[OR operation]
    end

    CHECK -->|No| NORMAL
    CHECK -->|Yes| UNION
    UNION --> RENDER_ALL
    RENDER_ALL --> OR_OP
```

---

[Next: Filter System →](./07-filter.md)
