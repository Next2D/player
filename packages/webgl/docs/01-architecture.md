# 1. High-Level Architecture / アーキテクチャ

[← Back to Index](./README.md)

---

## System Overview / システム概要

```mermaid
graph TB
    subgraph "Application Layer"
        RQ[RenderQueue]
    end

    subgraph "WebGL Package"
        CTX[Context.ts]

        subgraph "Path Processing"
            PC[PathCommand]
            BC[BezierConverter]
        end

        subgraph "Geometry"
            MESH[Mesh]
            VAO[VertexArrayObject]
        end

        subgraph "Rendering"
            SHADER[ShaderManager]
            BLEND[Blend]
            MASK[Mask]
            FILTER[Filter]
        end

        subgraph "Resource Management"
            FBM[FrameBufferManager]
            ATLAS[AtlasManager]
            TEX[TextureManager]
            GRAD[GradientLUTGenerator]
        end
    end

    subgraph "GPU"
        GL[WebGL2 API]
    end

    RQ --> CTX
    CTX --> PC
    PC --> BC
    BC --> MESH
    MESH --> VAO
    VAO --> SHADER
    SHADER --> GL

    CTX --> BLEND
    CTX --> MASK
    CTX --> FILTER

    BLEND --> GL
    MASK --> GL
    FILTER --> SHADER

    FBM --> GL
    ATLAS --> FBM
    TEX --> GL
    GRAD --> TEX
```

---

# 2. Complete Rendering Pipeline / レンダリングパイプライン

## Main Rendering Flow / メインレンダリングフロー

```mermaid
flowchart TB
    subgraph "1. Initialization"
        INIT[Context Init]
        INIT --> CREATE_CTX[Create WebGL2Context]
        CREATE_CTX --> INIT_MANAGERS[Init Managers]
    end

    subgraph "2. Frame Begin"
        FRAME_START[Frame Start]
        FRAME_START --> CLEAR[Clear Screen]
        CLEAR --> SETUP_STATE[Setup State]
    end

    subgraph "3. DisplayObject Processing"
        PROCESS_DO[Process DO]
        PROCESS_DO --> CHECK_VISIBLE{visible?}
        CHECK_VISIBLE -->|No| SKIP[Skip]
        CHECK_VISIBLE -->|Yes| CALC_MATRIX[Calc Matrix]
        CALC_MATRIX --> CHECK_BOUNDS{in bounds?}
        CHECK_BOUNDS -->|No| SKIP
        CHECK_BOUNDS -->|Yes| CHECK_CACHE{cached?}
        CHECK_CACHE -->|Yes| USE_CACHE[Use Cache]
        CHECK_CACHE -->|No| RENDER_NEW[New Render]
    end

    subgraph "4. Shape Rendering"
        RENDER_NEW --> BEGIN_PATH[beginPath]
        BEGIN_PATH --> PATH_CMDS[Path Commands]
        PATH_CMDS --> FILL_OR_STROKE{fill/stroke?}

        FILL_OR_STROKE -->|Fill| FILL_TYPE{fill type?}
        FILL_TYPE -->|Solid| SOLID_FILL[solidFill]
        FILL_TYPE -->|Gradient| GRADIENT_FILL[gradientFill]
        FILL_TYPE -->|Bitmap| BITMAP_FILL[bitmapFill]

        FILL_OR_STROKE -->|Stroke| STROKE[stroke]
    end

    subgraph "5. Post Processing"
        SOLID_FILL --> CHECK_FILTER{has filter?}
        GRADIENT_FILL --> CHECK_FILTER
        BITMAP_FILL --> CHECK_FILTER
        STROKE --> CHECK_FILTER
        USE_CACHE --> CHECK_FILTER

        CHECK_FILTER -->|Yes| APPLY_FILTER[Apply Filter]
        CHECK_FILTER -->|No| CHECK_BLEND{blend mode?}
        APPLY_FILTER --> CHECK_BLEND

        CHECK_BLEND -->|Complex| BLEND_COMPOSITE[Shader Blend]
        CHECK_BLEND -->|Simple| BLEND_SIMPLE[WebGL Blend]
    end

    subgraph "6. Compositing"
        BLEND_COMPOSITE --> COMPOSITE[Transfer to Atlas]
        BLEND_SIMPLE --> COMPOSITE
        COMPOSITE --> NEXT_DO{next DO?}
        NEXT_DO -->|Yes| PROCESS_DO
        NEXT_DO -->|No| FINAL_COMPOSITE[Final Composite]
    end

    subgraph "7. Frame End"
        FINAL_COMPOSITE --> TRANSFER_CANVAS[Transfer to Canvas]
        TRANSFER_CANVAS --> FRAME_END[Frame End]
    end

    INIT_MANAGERS --> FRAME_START
```

---

[Next: Context State Management →](./02-context-state.md)
