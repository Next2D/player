# 8. Gradient System / グラデーションシステム

[← Back to Index](./README.md) | [← Previous: Fill & Stroke](./04-fill-stroke.md)

---

## Gradient LUT Generation / グラデーションLUT生成

```mermaid
flowchart TB
    subgraph "Input"
        STOPS[colorStops array]
        SPREAD[spreadMethod]
    end

    subgraph "Adaptive Resolution"
        CHECK_STOPS{stops count?}
        RES_256[256x1]
        RES_512[512x1]
        RES_1024[1024x1]
    end

    subgraph "LUT Generation"
        CREATE_TEX[create texture]
        INTERPOLATE[interpolate pixels]
        UPLOAD[upload to WebGL]
    end

    subgraph "Shader Usage"
        SAMPLE[texture sample]
    end

    STOPS --> CHECK_STOPS
    CHECK_STOPS -->|1-4| RES_256
    CHECK_STOPS -->|5-8| RES_512
    CHECK_STOPS -->|9+| RES_1024
    RES_256 --> CREATE_TEX
    RES_512 --> CREATE_TEX
    RES_1024 --> CREATE_TEX
    CREATE_TEX --> INTERPOLATE
    INTERPOLATE --> UPLOAD
    UPLOAD --> SAMPLE
```

**GradientLUTGenerator.ts - Adaptive Resolution / 適応解像度:**
```typescript
$getAdaptiveResolution(stopsLength: number): number
  - stopsLength ≤ 4 → 256
  - stopsLength ≤ 8 → 512
  - stopsLength > 8 → 1024

// Color space conversion tables
$rgbToLinearTable: Float32Array(256)  // pow(t, 2.23333333)
$rgbIdentityTable: Float32Array(256)  // linear t
```

---

## Linear Gradient Calculation / 線形グラデーション計算

```mermaid
flowchart LR
    subgraph "Input"
        P0[start point]
        P1[end point]
        FRAG[fragment P]
    end

    subgraph "Calculation"
        AB[ab = P1 - P0]
        AP[ap = P - P0]
        DOT[calc t value]
    end

    subgraph "Spread"
        SPREAD_CHECK{spread}
        PAD[pad: clamp]
        REPEAT[repeat: fract]
        REFLECT[reflect]
    end

    subgraph "Output"
        SAMPLE[sample LUT]
    end

    P0 --> AB
    P1 --> AB
    FRAG --> AP
    P0 --> AP
    AB --> DOT
    AP --> DOT

    DOT --> SPREAD_CHECK
    SPREAD_CHECK -->|pad| PAD
    SPREAD_CHECK -->|repeat| REPEAT
    SPREAD_CHECK -->|reflect| REFLECT

    PAD --> SAMPLE
    REPEAT --> SAMPLE
    REFLECT --> SAMPLE
```

---

## Radial Gradient Calculation / 放射グラデーション計算

```mermaid
flowchart TB
    subgraph "Input"
        CENTER[center]
        RADIUS[radius]
        FOCAL[focal point]
        FRAG[fragment P]
    end

    subgraph "Basic Radial"
        DIST[calc distance]
        T_BASIC[t = dist / radius]
    end

    subgraph "Focal Radial"
        RAY[ray from focal]
        INTERSECT[ray-circle intersect]
        T_FOCAL[calc focal t]
    end

    subgraph "Output"
        SPREAD[spread process]
        COLOR[sample LUT]
    end

    CENTER --> DIST
    FRAG --> DIST
    DIST --> T_BASIC
    RADIUS --> T_BASIC

    FOCAL --> RAY
    FRAG --> RAY
    CENTER --> INTERSECT
    RADIUS --> INTERSECT
    RAY --> INTERSECT
    INTERSECT --> T_FOCAL

    T_BASIC --> SPREAD
    T_FOCAL --> SPREAD
    SPREAD --> COLOR
```

---

[Next: Blend Mode & Mask System →](./06-blend-mask.md)
