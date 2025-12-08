# @next2d/webgpu

WebGPU-based rendering engine for Next2D (Experimental / Work in Progress)

WebGPU ベースのレンダリングエンジン（実験的 / 開発中）

---

## ⚠️ Warning / 警告

**This package is currently under development and NOT production-ready.**

**本パッケージは現在開発中であり、本番環境での使用には対応していません。**

- Many features are incomplete or placeholder implementations
- APIs may change without notice
- Performance has not been optimized
- Testing is incomplete

---

## Overview / 概要

This package provides a WebGPU-based rendering backend for Next2D Player, designed as an alternative to the existing WebGL implementation. WebGPU is a modern graphics API that offers better performance and more control over GPU resources.

本パッケージは Next2D Player 向けの WebGPU ベースのレンダリングバックエンドを提供します。既存の WebGL 実装の代替として設計されており、WebGPU は優れたパフォーマンスと GPU リソースに対するより細かい制御を提供する最新のグラフィックス API です。

### Key Features / 主な機能

- WGSL (WebGPU Shading Language) shader implementations
- Texture atlas management for efficient rendering
- Instance-based batch rendering
- Blend mode support
- Mask rendering capabilities
- Filter effects (Blur, Glow, Drop Shadow, Color Matrix)

---

## Directory Structure / ディレクトリ構造

```
src/
├── Context.ts                    # Main rendering context (WebGPU版のメインコンテキスト)
├── WebGPUUtil.ts                 # Utility functions and global state management
│
├── Managers / マネージャー
│   ├── AtlasManager.ts           # Atlas texture management (アトラステクスチャ管理)
│   ├── AttachmentManager.ts      # Offscreen attachment/FBO management (オフスクリーンアタッチメント管理)
│   ├── BufferManager.ts          # Vertex/Uniform buffer management (バッファ管理)
│   ├── DrawManager.ts            # Drawing operations helper (描画操作ヘルパー)
│   ├── FrameBufferManager.ts     # Framebuffer management (フレームバッファ管理)
│   └── TextureManager.ts         # Texture and sampler management (テクスチャ/サンプラー管理)
│
├── Core Components / コアコンポーネント
│   ├── PathCommand.ts            # Path drawing commands (moveTo, lineTo, bezierCurveTo, etc.)
│   ├── Mesh.ts                   # Mesh data structures and utilities
│   ├── Blend.ts                  # Blend mode state management
│   └── Mask.ts                   # Mask rendering state management
│
├── Shader/ シェーダー関連
│   ├── ShaderSource.ts           # WGSL shader source code
│   ├── PipelineManager.ts        # Render pipeline management
│   ├── ShaderInstancedManager.ts # Instance rendering shader management
│   ├── BlendModeShader.ts        # Blend mode shader implementations
│   └── GradientLUTGenerator.ts   # Gradient lookup table generation
│
├── Filter/ フィルター実装
│   ├── BlurFilterShader.ts       # Blur filter implementation
│   ├── GlowFilterShader.ts       # Glow filter implementation
│   ├── DropShadowFilterShader.ts # Drop shadow filter implementation
│   └── ColorMatrixFilterShader.ts # Color matrix filter implementation
│
├── Blend/ ブレンド関連
│   └── BlendInstancedManager.ts  # Instance-based blend rendering
│
├── Mask/ マスク関連
│   ├── service/
│   │   ├── MaskBeginMaskService.ts
│   │   ├── MaskEndMaskService.ts
│   │   ├── MaskSetMaskBoundsService.ts
│   │   └── MaskUnionMaskService.ts
│   └── usecase/
│       ├── MaskLeaveMaskUseCase.ts
│       └── MaskBindUseCase.ts
│
├── Mesh/ メッシュ関連
│   └── usecase/
│       └── MeshStrokeGenerateUseCase.ts # Stroke mesh generation
│
└── interface/ 型定義
    ├── IAttachmentObject.ts      # Attachment object interface
    ├── IBlendMode.ts             # Blend mode types
    ├── IBounds.ts                # Bounds rectangle interface
    ├── IFillType.ts              # Fill type definitions
    ├── IPoint.ts                 # Point interface
    └── ITextureObject.ts         # Texture object interface
```

---

## Implementation Status / 実装状況

### ✅ Implemented / 実装済み

#### Core Rendering / コア描画機能
- ✅ Basic initialization and device setup (基本的な初期化とデバイスセットアップ)
- ✅ Canvas context configuration (キャンバスコンテキストの設定)
- ✅ Frame lifecycle management (beginFrame/endFrame) (フレームライフサイクル管理)
- ✅ Transform matrix operations (save/restore/setTransform/transform) (変換行列操作)
- ✅ Background color fill (背景色の塗りつぶし)
- ✅ Resize handling (リサイズ処理)

#### Path Drawing / パス描画
- ✅ Path commands (beginPath, moveTo, lineTo, closePath) (パスコマンド)
- ✅ Bezier curves (quadraticCurveTo, bezierCurveTo) (ベジェ曲線)
- ✅ Arc drawing (円弧描画)
- ✅ Fill operations with solid colors (単色塗りつぶし)
- ✅ Stroke operations with mesh generation (ストローク描画とメッシュ生成)
- ✅ Vertex triangulation for path filling (パス塗りつぶし用の頂点三角形分割)

#### Texture & Atlas Management / テクスチャ・アトラス管理
- ✅ Atlas texture creation (4096x4096) (アトラステクスチャ作成)
- ✅ Node allocation in texture atlas (テクスチャアトラスのノード割り当て)
- ✅ Texture from pixels/ImageBitmap (ピクセル/ImageBitmapからのテクスチャ作成)
- ✅ Sampler creation (linear, nearest, repeat) (サンプラー作成)
- ✅ Texture pool management (テクスチャプール管理)

#### Buffer Management / バッファ管理
- ✅ Vertex buffer creation and management (頂点バッファ作成と管理)
- ✅ Uniform buffer creation and updates (Uniformバッファ作成と更新)
- ✅ Rectangle vertex generation (矩形頂点生成)

#### Offscreen Rendering / オフスクリーンレンダリング
- ✅ Attachment object pool (アタッチメントオブジェクトプール)
- ✅ Bind/unbind attachment operations (アタッチメントのバインド/アンバインド)
- ✅ Render target switching (レンダーターゲットの切り替え)
- ✅ Stencil texture creation (ステンシルテクスチャ作成)

#### Shader Pipelines / シェーダーパイプライン
- ✅ Fill pipeline (solid color) (単色塗りつぶしパイプライン)
- ✅ Mask pipeline (Bezier curve anti-aliasing) (マスクパイプライン - ベジェ曲線アンチエイリアス)
- ✅ Basic pipeline (基本パイプライン)
- ✅ Texture pipeline (テクスチャパイプライン)
- ✅ Instanced rendering pipeline (インスタンス描画パイプライン)
- ✅ Gradient pipeline structure (グラデーションパイプライン構造)
- ✅ Blend mode pipeline structure (ブレンドモードパイプライン構造)

#### Instance Rendering / インスタンス描画
- ✅ Instance data management (インスタンスデータ管理)
- ✅ Display object to instance array conversion (表示オブジェクトのインスタンス配列変換)
- ✅ Batch rendering with instancing (インスタンシングによるバッチ描画)
- ✅ Color transform (multiply/add) (カラー変換 - 乗算/加算)

#### Image Operations / 画像操作
- ✅ Draw pixels to atlas node (アトラスノードへのピクセル描画)
- ✅ Draw OffscreenCanvas/ImageBitmap to atlas (OffscreenCanvas/ImageBitmapのアトラス描画)
- ✅ Create ImageBitmap from GPU texture (GPUテクスチャからのImageBitmap作成)
- ✅ Premultiplied alpha conversion (プリマルチプライドアルファ変換)

### 🚧 Partially Implemented / 部分的に実装

#### Drawing Operations / 描画操作
- 🚧 Gradient fill (gradientFill) - Placeholder, falls back to solid fill
  - グラデーション塗りつぶし - プレースホルダー実装、単色塗りつぶしにフォールバック
- 🚧 Bitmap fill (bitmapFill) - Texture creation works, shader integration pending
  - ビットマップ塗りつぶし - テクスチャ作成は動作、シェーダー統合は保留
- 🚧 Gradient stroke (gradientStroke) - Placeholder
  - グラデーションストローク - プレースホルダー実装
- 🚧 Bitmap stroke (bitmapStroke) - Placeholder
  - ビットマップストローク - プレースホルダー実装

#### Masking / マスク処理
- 🚧 Clip operations (clip) - Basic structure, stencil buffer integration needed
  - クリッピング操作 - 基本構造はあるが、ステンシルバッファ統合が必要
- 🚧 Mask begin/end (beginMask, endMask, setMaskBounds, leaveMask) - Service layer exists
  - マスク開始/終了 - サービス層は存在

#### Filters / フィルター
- 🚧 applyFilter - Framework exists, filter shaders created but not integrated
  - フィルター適用 - フレームワークは存在、フィルターシェーダーは作成済みだが統合されていない
  - BlurFilterShader, GlowFilterShader, DropShadowFilterShader, ColorMatrixFilterShader

### ❌ TODO / 未実装

#### Core Features / コア機能
- ❌ Cache clearing implementation (resize時のキャッシュクリア)
- ❌ clearRect with scissor/clear operations (シザー/クリア操作によるclearRect)
- ❌ 9-slice grid transformation (useGrid) (9スライスグリッド変換)

#### Advanced Rendering / 高度なレンダリング
- ❌ Complete gradient LUT texture generation (完全なグラデーションLUTテクスチャ生成)
- ❌ Gradient shader parameter passing (グラデーションシェーダーのパラメータ渡し)
- ❌ Bitmap fill/stroke shader integration (ビットマップ塗りつぶし/ストロークシェーダー統合)
- ❌ Stencil buffer-based clipping (ステンシルバッファベースのクリッピング)
- ❌ Two-pass rendering for masks (マスク用の2パスレンダリング)

#### Blend Modes / ブレンドモード
- ❌ Full blend mode integration (multiply, screen, add, etc.)
  - 完全なブレンドモード統合（乗算、スクリーン、加算など）
- ❌ Advanced blend modes (overlay, hard-light, soft-light, etc.)
  - 高度なブレンドモード（オーバーレイ、ハードライト、ソフトライトなど）

#### Filters / フィルター
- ❌ Filter parameter binding and execution (フィルターパラメータバインディングと実行)
- ❌ Multi-pass filter rendering (複数パスフィルターレンダリング)
- ❌ Convolution filter (コンボリューションフィルター)
- ❌ Displacement map filter (ディスプレイスメントマップフィルター)

#### Optimization / 最適化
- ❌ Buffer reuse and pooling optimization (バッファ再利用とプール最適化)
- ❌ Command encoder reuse (コマンドエンコーダー再利用)
- ❌ Pipeline state caching (パイプライン状態キャッシング)
- ❌ Batch draw call optimization (バッチ描画コール最適化)

#### Testing & Documentation / テストとドキュメント
- ❌ Unit tests (ユニットテスト)
- ❌ Integration tests (統合テスト)
- ❌ Performance benchmarks (パフォーマンスベンチマーク)
- ❌ API documentation (API ドキュメント)

---

## Context.ts - Implementation Analysis / Context.ts 実装分析

The `Context.ts` file is the main entry point for the WebGPU rendering engine. Here's a detailed breakdown of its implementation status:

`Context.ts` ファイルは WebGPU レンダリングエンジンのメインエントリーポイントです。実装状況の詳細な内訳は以下の通りです：

### Fully Implemented Methods / 完全実装済みメソッド

| Method | Status | Notes |
|--------|--------|-------|
| `constructor` | ✅ Complete | Device, context, format initialization |
| `save` / `restore` | ✅ Complete | Matrix stack operations |
| `setTransform` / `transform` | ✅ Complete | 2D transformation matrix |
| `reset` | ✅ Complete | Reset context state |
| `beginPath` / `moveTo` / `lineTo` | ✅ Complete | Path command delegation |
| `quadraticCurveTo` / `bezierCurveTo` | ✅ Complete | Bezier curve support |
| `arc` / `closePath` | ✅ Complete | Path operations |
| `fillStyle` / `strokeStyle` | ✅ Complete | Color style setters |
| `fill` | ✅ Complete | Solid color fill with pipeline |
| `stroke` | ✅ Complete | Stroke with mesh generation |
| `updateBackgroundColor` | ✅ Complete | Background color update |
| `fillBackgroundColor` | ✅ Complete | Clear with background color |
| `resize` | ✅ Complete | Canvas resize (cache clear TODO) |
| `beginFrame` / `endFrame` | ✅ Complete | Frame lifecycle management |
| `bindAttachment` / `unbindAttachment` | ✅ Complete | Offscreen rendering |
| `getAttachmentObject` / `releaseAttachment` | ✅ Complete | Attachment management |
| `createNode` / `removeNode` | ✅ Complete | Atlas node management |
| `drawPixels` / `drawElement` | ✅ Complete | Pixel/element to atlas |
| `drawDisplayObject` | ✅ Complete | Instance array addition |
| `drawArraysInstanced` | ✅ Complete | Batch instance rendering |
| `clearArraysInstanced` | ✅ Complete | Clear instance data |
| `createImageBitmap` | ✅ Complete | GPU→ImageBitmap conversion |
| `beginMask` / `setMaskBounds` / `endMask` / `leaveMask` | ✅ Complete | Mask service delegation |

### Placeholder / Incomplete Methods / プレースホルダー/不完全なメソッド

| Method | Status | Notes |
|--------|--------|-------|
| `clearRect` | 🚧 Partial | Has console.log, needs scissor+clear implementation |
| `gradientFill` | 🚧 Placeholder | console.log + falls back to fill() |
| `bitmapFill` | 🚧 Partial | Creates texture but falls back to fill() |
| `gradientStroke` | 🚧 Placeholder | console.log + falls back to stroke() |
| `bitmapStroke` | 🚧 Placeholder | console.log + falls back to stroke() |
| `clip` | 🚧 Placeholder | console.log + falls back to fill() |
| `useGrid` | 🚧 Placeholder | console.log, 9-slice not implemented |
| `applyFilter` | 🚧 Placeholder | console.log, filter shaders not integrated |

### Debug Markers / デバッグマーカー

The code contains multiple `console.log` statements indicating work-in-progress areas:

コードには開発中の領域を示す複数の `console.log` 文が含まれています：

- Line 250: `clearRect()` - "TODO: シザーとクリアを使用した実装"
- Line 228: `resize()` - "TODO: キャッシュクリア実装"
- Line 270: `clearRect()` - "TODO: シザーとクリアを使用した実装"
- Line 781: `gradientFill()` - "TODO: グラデーションLUTテクスチャを生成"
- Line 790: `gradientFill()` - "TODO: グラデーション用のシェーダーを使用"
- Line 847: `bitmapFill()` - "TODO: ビットマップ塗りつぶし用のシェーダーを使用"
- Line 876: `gradientStroke()` - "TODO: グラデーションストローク実装"
- Line 901: `bitmapStroke()` - "TODO: ビットマップストローク実装"
- Line 918: `clip()` - "TODO: ステンシルバッファを使用したクリッピング実装"
- Line 962: `useGrid()` - "TODO: Grid/9-slice transformation implementation"
- Line 1312-1320: `applyFilter()` - Multiple filter TODOs
- Line 1660: `leaveMask()` - "TODO: WebGPU版のインスタンス描画を実装後に追加"

---

## Shader Implementation / シェーダー実装

### WGSL Shaders in ShaderSource.ts / ShaderSource.ts の WGSL シェーダー

The package includes complete WGSL shader implementations for:

パッケージには以下の完全な WGSL シェーダー実装が含まれています：

1. **Fill Shader** (単色塗りつぶし)
   - WebGL-compatible vertex transformation
   - Premultiplied alpha blending
   - Viewport normalization

2. **Mask Shader** (マスク)
   - Bezier curve rendering with anti-aliasing
   - Partial derivative-based edge smoothing

3. **Texture Shader** (テクスチャ)
   - Sampled texture rendering
   - Color modulation

4. **Instanced Shader** (インスタンス描画)
   - Per-instance transformation matrices
   - Color transform (multiply + add)
   - Atlas texture sampling
   - Unpremultiply → transform → premultiply workflow

5. **Gradient Shader** (グラデーション) - Structure only
   - Linear/Radial gradient support
   - LUT-based color lookup

6. **Blend Shader** (ブレンド) - Structure only
   - Normal, Multiply, Screen, Add modes
   - Dual texture sampling

---

## Pipeline Architecture / パイプラインアーキテクチャ

The `PipelineManager` creates and manages 6 render pipelines:

`PipelineManager` は 6 つのレンダーパイプラインを作成・管理します：

1. **fill** - Solid color fill (単色塗りつぶし)
2. **mask** - Stencil/clip operations (ステンシル/クリップ操作)
3. **basic** - Simple color rendering (シンプルカラーレンダリング)
4. **texture** - Textured quad rendering (テクスチャ付き矩形レンダリング)
5. **instanced** - Batch instance rendering (バッチインスタンス描画)
6. **gradient** - Gradient fill (グラデーション塗りつぶし) - Not yet integrated
7. **blend** - Blend mode operations (ブレンドモード操作) - Not yet integrated

All pipelines use:
- Premultiplied alpha blending
- Triangle list topology
- No backface culling

すべてのパイプラインは以下を使用：
- プリマルチプライドアルファブレンディング
- トライアングルリストトポロジー
- バックフェースカリング無効

---

## Known Limitations / 既知の制限事項

1. **Stencil Operations** - Depth-stencil attachment configuration incomplete
   - ステンシル操作 - Depth-stencilアタッチメント設定が不完全

2. **Filter Effects** - Shader code exists but parameter passing not implemented
   - フィルター効果 - シェーダーコードは存在するがパラメータ渡しが未実装

3. **Blend Modes** - Only normal blend mode fully functional
   - ブレンドモード - ノーマルブレンドモードのみ完全に機能

4. **Gradient Rendering** - LUT generation incomplete
   - グラデーションレンダリング - LUT生成が不完全

5. **Performance** - No optimization for buffer reuse, pipeline caching
   - パフォーマンス - バッファ再利用、パイプラインキャッシングの最適化なし

6. **Error Handling** - Limited validation and error recovery
   - エラーハンドリング - 検証とエラー回復が制限的

---

## Development Notes / 開発ノート

### Architecture / アーキテクチャ

The package follows a manager-based architecture similar to the WebGL implementation:

パッケージは WebGL 実装と同様のマネージャーベースアーキテクチャに従います：

- **Context**: Main rendering interface (メインレンダリングインターフェース)
- **Managers**: Resource lifecycle management (リソースライフサイクル管理)
- **Services/UseCases**: Business logic separation (ビジネスロジック分離)
- **Shaders**: WGSL source and pipeline configuration (WGSL ソースとパイプライン設定)

### Frame Lifecycle / フレームライフサイクル

```
clearTransferBounds()
  → beginFrame()
  → [drawing operations]
  → endFrame()/transferMainCanvas()
```

### Rendering Flow / レンダリングフロー

1. Acquire canvas texture (once per frame) (キャンバステクスチャ取得 - フレーム毎に1回)
2. Create command encoder (コマンドエンコーダー作成)
3. Begin render pass with load/clear (ロード/クリアでレンダーパス開始)
4. Set pipeline and bind resources (パイプライン設定とリソースバインド)
5. Draw commands (描画コマンド)
6. End render pass (レンダーパス終了)
7. Submit commands to queue (コマンドをキューに送信)

---

## Browser Compatibility / ブラウザ互換性

WebGPU support is required. As of 2024:

WebGPU サポートが必要です。2024年時点：

- ✅ Chrome/Edge 113+
- ✅ Firefox 131+ (experimental)
- ✅ Safari 18+ (experimental)
- ❌ Older browsers (need WebGL fallback)

---

## Usage / 使用方法

```typescript
import { Context } from "@next2d/webgpu";

// Get WebGPU adapter and device
const adapter = await navigator.gpu.requestAdapter();
const device = await adapter.requestDevice();

// Get canvas context
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("webgpu") as GPUCanvasContext;

// Get preferred format
const format = navigator.gpu.getPreferredCanvasFormat();

// Create rendering context
const ctx = new Context(device, context, format);

// Rendering
ctx.clearTransferBounds(); // Begin frame
ctx.fillStyle(1, 0, 0, 1); // Red
ctx.beginPath();
ctx.arc(100, 100, 50);
ctx.fill();
ctx.transferMainCanvas(); // End frame and submit
```

---

## Contributing / 貢献

As this package is work in progress, contributions are welcome! Priority areas:

このパッケージは開発中のため、貢献を歓迎します！優先領域：

1. Completing gradient and bitmap fill/stroke shaders
2. Implementing filter parameter binding
3. Stencil-based masking operations
4. Performance optimization (buffer pooling, pipeline caching)
5. Comprehensive testing

---

## License / ライセンス

MIT License

Copyright (c) 2021 Next2D

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## Related Packages / 関連パッケージ

- `@next2d/texture-packer` - Texture atlas management
- `@next2d/render-queue` - Render queue for batch operations

---

**Last Updated**: 2024-12-08

**Status**: 🚧 Experimental - Active Development
