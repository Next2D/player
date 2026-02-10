# @next2d/webgl

WebGL2-based rendering engine for Next2D Player / Next2D Player用のWebGL2ベースレンダリングエンジン

## Overview / 概要

The `@next2d/webgl` package is the main rendering backend for Next2D Player, providing a high-performance, shader-based drawing pipeline built on WebGL2. This package handles all graphics rendering operations including vector shapes, bitmaps, filters, and effects.

`@next2d/webgl`パッケージは、Next2D Playerのメインレンダリングバックエンドであり、WebGL2上に構築された高性能なシェーダーベースの描画パイプラインを提供します。このパッケージは、ベクター図形、ビットマップ、フィルター、エフェクトなど、すべてのグラフィックスレンダリング操作を処理します。

### Key Features / 主な特徴

- **WebGL2-based rendering** - Hardware-accelerated graphics using modern WebGL2 API / WebGL2 APIを使用したハードウェアアクセラレーション
- **Shader-based pipeline** - Efficient GLSL shader processing for all rendering operations / すべてのレンダリング操作に対する効率的なGLSLシェーダー処理
- **Texture atlas management** - Optimized texture packing and management / 最適化されたテクスチャパッキングと管理
- **Advanced filters** - Full support for color matrix, blur, glow, displacement map and more / カラーマトリックス、ブラー、グロー、ディスプレースメントマップなどのフルサポート
- **Blend modes** - Multiple blend mode support with stencil operations / ステンシル操作による複数のブレンドモードサポート
- **Masking system** - Stencil buffer-based masking for complex clipping / 複雑なクリッピングのためのステンシルバッファベースのマスキング

## Installation / インストール

```bash
npm install @next2d/webgl
```

## Directory Structure / ディレクトリ構造

```
src/
├── Context.ts                      # Main rendering context / メインレンダリングコンテキスト
├── Context/
│   ├── service/                    # Context services / コンテキストサービス
│   └── usecase/                    # Context use cases / コンテキストユースケース
├── AtlasManager.ts                 # Texture atlas management / テクスチャアトラス管理
├── FrameBufferManager.ts           # Framebuffer object management / フレームバッファオブジェクト管理
├── Blend.ts                        # Blend mode handling / ブレンドモード処理
├── Mask.ts                         # Stencil-based masking / ステンシルベースのマスキング
├── Mesh.ts                         # Mesh generation for fills and strokes / 塗りと線のメッシュ生成
├── PathCommand.ts                  # Path command processing / パスコマンド処理
├── Filter.ts                       # Filter base functionality / フィルター基本機能
├── Filter/                         # Filter implementations / フィルター実装
│   ├── BevelFilter/                # Bevel filter / ベベルフィルター
│   ├── BitmapFilter/               # Bitmap filter / ビットマップフィルター
│   ├── BlurFilter/                 # Blur filter / ブラーフィルター
│   ├── ColorMatrixFilter/          # Color matrix filter / カラーマトリックスフィルター
│   ├── ConvolutionFilter/          # Convolution filter / コンボリューションフィルター
│   ├── DisplacementMapFilter/      # Displacement map filter / ディスプレースメントマップフィルター
│   ├── DropShadowFilter/           # Drop shadow filter / ドロップシャドウフィルター
│   ├── GlowFilter/                 # Glow filter / グローフィルター
│   ├── GradientBevelFilter/        # Gradient bevel filter / グラデーションベベルフィルター
│   └── GradientGlowFilter/         # Gradient glow filter / グラデーショングローフィルター
├── Shader/                         # GLSL shader system / GLSLシェーダーシステム
│   ├── Fragment/                   # Fragment shaders / フラグメントシェーダー
│   ├── Vertex/                     # Vertex shaders / バーテックスシェーダー
│   ├── ShaderManager.ts            # Shader program management / シェーダープログラム管理
│   ├── ShaderInstancedManager.ts   # Instanced rendering manager / インスタンスレンダリング管理
│   ├── GradientLUTGenerator.ts     # Gradient LUT generation / グラデーションLUT生成
│   └── Variants/                   # Shader variants / シェーダーバリアント
├── VertexArrayObject.ts            # VAO management / VAO管理
├── TextureManager.ts               # Texture management / テクスチャ管理
├── ColorBufferObject.ts            # Color buffer management / カラーバッファ管理
├── StencilBufferObject.ts          # Stencil buffer management / ステンシルバッファ管理
├── Stencil.ts                      # Stencil operations / ステンシル操作
├── Gradient.ts                     # Gradient processing / グラデーション処理
├── Grid.ts                         # Grid system for rendering / レンダリング用グリッドシステム
├── Bitmap.ts                       # Bitmap handling / ビットマップ処理
├── BezierConverter.ts              # Bezier curve conversion / ベジェ曲線変換
├── WebGLUtil.ts                    # WebGL utility functions / WebGLユーティリティ関数
└── interface/                      # TypeScript interfaces / TypeScript インターフェース
```

## Rendering Pipeline / レンダリングパイプライン

The WebGL package implements a sophisticated rendering pipeline that processes graphics commands through multiple stages:

WebGLパッケージは、複数のステージを通じてグラフィックスコマンドを処理する洗練されたレンダリングパイプラインを実装しています:

```mermaid
flowchart TB
    Start([Start Rendering])
    Context[Context<br/>レンダリングコンテキスト]
    PathCommand[PathCommand<br/>パスコマンド処理]
    Mesh[Mesh<br/>メッシュ生成]
    Shader[Shader<br/>シェーダー実行]
    FrameBuffer[FrameBuffer<br/>フレームバッファ]
    Atlas[AtlasManager<br/>テクスチャアトラス]
    Filter[Filter<br/>フィルター処理]
    Blend[Blend<br/>ブレンド処理]
    Mask[Mask<br/>マスク処理]
    Output([Output to Canvas])

    Start --> Context
    Context --> PathCommand
    PathCommand --> Mesh
    Mesh --> Shader
    Shader --> FrameBuffer

    Context -.-> Atlas
    Atlas -.-> Shader

    FrameBuffer --> Filter
    Filter --> Blend
    Blend --> Mask
    Mask --> Output

    style Context fill:#e1f5ff
    style Shader fill:#fff4e1
    style FrameBuffer fill:#f0e1ff
    style Atlas fill:#e1ffe1
```

### Pipeline Stages / パイプラインステージ

1. **Context**: Main rendering context that manages the WebGL state and coordinates all rendering operations
   - **コンテキスト**: WebGL状態を管理し、すべてのレンダリング操作を調整するメインレンダリングコンテキスト

2. **PathCommand**: Processes vector path commands (moveTo, lineTo, curveTo, etc.) into renderable primitives
   - **パスコマンド**: ベクターパスコマンド（moveTo、lineTo、curveToなど）をレンダリング可能なプリミティブに処理

3. **Mesh**: Generates triangle meshes from path data for fills and strokes
   - **メッシュ**: 塗りと線のパスデータから三角形メッシュを生成

4. **Shader**: Executes GLSL shaders to render meshes with appropriate materials and effects
   - **シェーダー**: 適切なマテリアルとエフェクトでメッシュをレンダリングするGLSLシェーダーを実行

5. **FrameBuffer**: Manages render targets and intermediate rendering buffers
   - **フレームバッファ**: レンダーターゲットと中間レンダリングバッファを管理

6. **AtlasManager**: Optimizes texture usage through texture atlas packing
   - **アトラスマネージャー**: テクスチャアトラスパッキングによりテクスチャ使用を最適化

7. **Filter**: Applies post-processing effects (blur, glow, color matrix, etc.)
   - **フィルター**: ポストプロセスエフェクト（ブラー、グロー、カラーマトリックスなど）を適用

8. **Blend**: Handles blend mode operations for compositing
   - **ブレンド**: 合成のためのブレンドモード操作を処理

9. **Mask**: Implements stencil-based masking for clipping and complex shapes
   - **マスク**: クリッピングと複雑な形状のためのステンシルベースのマスキングを実装

## Atlas-Based Rendering Approach / アトラスベースのレンダリングアプローチ

The WebGL package uses a texture atlas system to optimize rendering performance:

WebGLパッケージは、レンダリングパフォーマンスを最適化するためにテクスチャアトラスシステムを使用しています:

### Benefits / 利点

- **Reduced draw calls**: Multiple textures are packed into a single atlas, reducing the number of texture bindings
  - **描画コールの削減**: 複数のテクスチャが単一のアトラスにパックされ、テクスチャバインディングの数が削減されます

- **Memory efficiency**: Optimal packing algorithm minimizes wasted GPU memory
  - **メモリ効率**: 最適なパッキングアルゴリズムにより、無駄なGPUメモリが最小化されます

- **Cache coherency**: Better GPU cache utilization through spatial locality
  - **キャッシュコヒーレンシー**: 空間的局所性による優れたGPUキャッシュ利用

### Atlas Management / アトラス管理

The `AtlasManager` component uses the `@next2d/texture-packer` package to:

`AtlasManager`コンポーネントは`@next2d/texture-packer`パッケージを使用して以下を実行します:

- Dynamically pack textures into optimal atlas layouts
  - テクスチャを最適なアトラスレイアウトに動的にパック
- Track texture usage and automatically manage atlas allocation
  - テクスチャ使用状況を追跡し、アトラス割り当てを自動管理
- Support multiple atlas instances when texture requirements exceed single atlas capacity
  - テクスチャ要件が単一のアトラス容量を超える場合、複数のアトラスインスタンスをサポート

### Rendering with Atlases / アトラスを使用したレンダリング

1. Textures are uploaded to GPU and registered with the atlas manager
   - テクスチャがGPUにアップロードされ、アトラスマネージャーに登録されます

2. The atlas manager assigns UV coordinates for each texture region
   - アトラスマネージャーが各テクスチャ領域のUV座標を割り当てます

3. Shaders use these UV coordinates to sample from the correct atlas region
   - シェーダーがこれらのUV座標を使用して正しいアトラス領域からサンプリングします

4. Multiple objects can be rendered in a single draw call using the same atlas
   - 同じアトラスを使用して複数のオブジェクトを単一の描画コールでレンダリング可能

## Architecture Patterns / アーキテクチャパターン

The codebase follows a clean architecture approach with clear separation of concerns:

コードベースは、関心事の明確な分離を伴うクリーンアーキテクチャアプローチに従っています:

### Service Layer / サービス層

Services contain low-level operations and business logic. They are pure functions that perform specific tasks.

サービスは低レベルの操作とビジネスロジックを含みます。特定のタスクを実行する純粋な関数です。

### Use Case Layer / ユースケース層

Use cases orchestrate multiple services to accomplish higher-level operations. They represent application-specific business rules.

ユースケースは、より高レベルの操作を達成するために複数のサービスを調整します。アプリケーション固有のビジネスルールを表します。

## Dependencies / 依存関係

- `@next2d/texture-packer`: Texture atlas packing and management / テクスチャアトラスのパッキングと管理
- `@next2d/render-queue`: Rendering operation queue management / レンダリング操作キュー管理

## License / ライセンス

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](LICENSE) file for details.

このプロジェクトは[MITライセンス](https://opensource.org/licenses/MIT)の下でライセンスされています - 詳細は[LICENSE](LICENSE)ファイルを参照してください。
