# 6. Fill Operations / フィル操作

[← Back to Index](./README.md) | [← Previous: Path & Mesh](./03-path-mesh.md)

---

## Two-Pass Stencil Fill / 2パスステンシルフィル

```mermaid
sequenceDiagram
    participant App as Application
    participant CTX as Context
    participant GL as WebGL2
    participant Stencil as StencilBuffer

    App->>CTX: fill()

    Note over CTX,GL: Pass 1: Stencil Write
    CTX->>GL: glColorMask(false,false,false,false)
    CTX->>GL: glEnable(GL_STENCIL_TEST)
    CTX->>GL: glStencilFunc(GL_ALWAYS, 0, 0xFF)
    CTX->>GL: glStencilOp(GL_KEEP, GL_KEEP, GL_INCR_WRAP)
    CTX->>GL: glCullFace(GL_BACK)
    CTX->>GL: drawArrays(TRIANGLES) [CCW]
    GL->>Stencil: Increment on CCW

    CTX->>GL: glStencilOp(GL_KEEP, GL_KEEP, GL_DECR_WRAP)
    CTX->>GL: glCullFace(GL_FRONT)
    CTX->>GL: drawArrays(TRIANGLES) [CW]
    GL->>Stencil: Decrement on CW

    Note over CTX,GL: Pass 2: Color Fill
    CTX->>GL: glColorMask(true,true,true,true)
    CTX->>GL: glStencilFunc(GL_NOTEQUAL, 0, 0xFF)
    CTX->>GL: glStencilOp(GL_KEEP, GL_KEEP, GL_ZERO)
    CTX->>GL: drawArrays(TRIANGLE_STRIP) [fullscreen quad]
    GL->>Stencil: Clear stencil where drawn

    CTX->>GL: glDisable(GL_STENCIL_TEST)
```

---

## Fill Type Decision Flow / フィルタイプ決定フロー

```mermaid
flowchart TB
    FILL[fill call]

    CHECK_STYLE{fillStyle type?}

    subgraph "Solid Fill"
        SOLID[solidFill]
        SOLID --> SOLID_SHADER[SolidColorShader]
    end

    subgraph "Gradient Fill"
        GRAD_TYPE{gradient type?}
        LINEAR[linearGradient]
        RADIAL[radialGradient]

        LINEAR --> GEN_LUT_L[generate LUT]
        RADIAL --> GEN_LUT_R[generate LUT]

        GEN_LUT_L --> LINEAR_SHADER[LinearGradientShader]
        GEN_LUT_R --> RADIAL_SHADER[RadialGradientShader]
    end

    subgraph "Bitmap Fill"
        BITMAP[bitmapFill]
        BITMAP --> CHECK_REPEAT{repeat?}
        CHECK_REPEAT -->|Yes| REPEAT_SHADER[RepeatShader]
        CHECK_REPEAT -->|No| CLAMP_SHADER[ClampShader]
    end

    FILL --> CHECK_STYLE
    CHECK_STYLE -->|color| SOLID
    CHECK_STYLE -->|gradient| GRAD_TYPE
    GRAD_TYPE -->|linear| LINEAR
    GRAD_TYPE -->|radial| RADIAL
    CHECK_STYLE -->|bitmap| BITMAP
```

---

# 7. Stroke Operations / ストローク操作

## Stroke Processing Pipeline / ストローク処理パイプライン

```mermaid
flowchart TB
    subgraph "Input"
        PATH[Path Data]
        STYLE[strokeStyle]
    end

    subgraph "Stroke to Outline"
        EXPAND[expand stroke]

        subgraph "Line Segment"
            SEG_NORMAL[calc normal]
            SEG_OFFSET[offset vertices]
        end

        subgraph "Bezier Segment"
            BEZ_SUBDIVIDE[subdivide]
            BEZ_OFFSET[offset approx]
        end
    end

    subgraph "Join Generation"
        JOIN_TYPE{join type}

        BEVEL_JOIN[Bevel]
        MITER_JOIN[Miter]
        ROUND_JOIN[Round]
    end

    subgraph "Cap Generation"
        CAP_TYPE{cap type}

        NONE_CAP[None]
        SQUARE_CAP[Square]
        ROUND_CAP[Round]
    end

    subgraph "Output"
        OUTLINE[Outline Mesh]
        FILL_RENDER[render as fill]
    end

    PATH --> EXPAND
    STYLE --> EXPAND

    EXPAND --> SEG_NORMAL
    SEG_NORMAL --> SEG_OFFSET

    EXPAND --> BEZ_SUBDIVIDE
    BEZ_SUBDIVIDE --> BEZ_OFFSET

    SEG_OFFSET --> JOIN_TYPE
    BEZ_OFFSET --> JOIN_TYPE

    JOIN_TYPE -->|bevel| BEVEL_JOIN
    JOIN_TYPE -->|miter| MITER_JOIN
    JOIN_TYPE -->|round| ROUND_JOIN

    BEVEL_JOIN --> CAP_TYPE
    MITER_JOIN --> CAP_TYPE
    ROUND_JOIN --> CAP_TYPE

    CAP_TYPE -->|none| NONE_CAP
    CAP_TYPE -->|square| SQUARE_CAP
    CAP_TYPE -->|round| ROUND_CAP

    NONE_CAP --> OUTLINE
    SQUARE_CAP --> OUTLINE
    ROUND_CAP --> OUTLINE

    OUTLINE --> FILL_RENDER
```

---

[Next: Gradient System →](./05-gradient.md)
