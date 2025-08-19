# WebGPU Implementation Example

このファイルは、WebGPU版 Next2D の基本的な使用方法を示します。  
This file demonstrates the basic usage of the WebGPU version of Next2D.

## Basic Usage / 基本的な使用方法

```typescript
import { initializeWebGPU, Context, isWebGPUSupported } from "@next2d/webgpu";

// WebGPUサポートをチェック
// Check WebGPU support
if (!isWebGPUSupported()) {
    throw new Error("WebGPU is not supported in this browser");
}

// HTMLキャンバス要素を取得
// Get HTML canvas element
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

// WebGPUコンテキストを初期化
// Initialize WebGPU context
const context = await initializeWebGPU({
    canvas: canvas,
    devicePixelRatio: window.devicePixelRatio,
    samples: 4, // MSAA サンプル数 / MSAA sample count
    powerPreference: "high-performance"
});

// 基本的な描画操作
// Basic drawing operations
context.clearRect(0, 0, canvas.width, canvas.height);
context.beginPath();
context.moveTo(100, 100);
context.lineTo(200, 200);
context.stroke();
```

## Advanced Usage / 高度な使用方法

```typescript
import { 
    initializeWebGPU, 
    $createRenderPipeline,
    TEXTURE_TEMPLATE as VERTEX_TEMPLATE,
    TEXTURE_TEMPLATE as FRAGMENT_TEMPLATE
} from "@next2d/webgpu";

// カスタムシェーダーを使用したレンダリングパイプライン作成
// Create rendering pipeline with custom shaders
const context = await initializeWebGPU({ canvas });

// デバイス参照を取得
// Get device reference
const device = context.$device; // Note: This would need to be exposed in the Context class

// レンダーパイプラインを作成
// Create render pipeline
const pipeline = $createRenderPipeline(
    device,
    VERTEX_TEMPLATE(),
    FRAGMENT_TEMPLATE()
);

// テクスチャ管理
// Texture management
import { $createTextureObject, $bindTexture } from "@next2d/webgpu";

const textureObject = $createTextureObject(device, 256, 256, true);
$bindTexture(textureObject, 0);
```

## Key Differences from WebGL / WebGLとの主な違い

### 1. Initialization / 初期化
- **WebGL**: `new Context(gl, samples, devicePixelRatio)`
- **WebGPU**: `await initializeWebGPU({ canvas, samples, devicePixelRatio })`

### 2. Shader Language / シェーダー言語
- **WebGL**: GLSL ES 3.0 (`#version 300 es`)
- **WebGPU**: WGSL (`@vertex fn main()`, `@fragment fn main()`)

### 3. Pipeline Management / パイプライン管理
- **WebGL**: Program objects (`WebGLProgram`)
- **WebGPU**: Render pipelines (`GPURenderPipeline`)

### 4. Resource Management / リソース管理
- **WebGL**: Manual resource cleanup
- **WebGPU**: Automatic garbage collection + explicit `.destroy()`

## Performance Considerations / パフォーマンスの考慮事項

1. **Async Initialization / 非同期初期化**: WebGPUの初期化は非同期のため、適切にawaitする必要があります。
2. **Pipeline Caching / パイプラインキャッシュ**: レンダーパイプラインの作成はコストが高いため、キャッシュを活用します。
3. **Buffer Management / バッファ管理**: WebGPUではバッファの更新方法が異なります。

## Browser Support / ブラウザサポート

WebGPUは以下のブラウザでサポートされています：
WebGPU is supported in the following browsers:

- Chrome 113+ (Stable)
- Edge 113+ (Stable)  
- Firefox (Experimental, behind flag)
- Safari (Experimental, Technology Preview)

## Migration Guide / 移行ガイド

WebGL版からWebGPU版への移行時の主な変更点：
Main changes when migrating from WebGL to WebGPU version:

1. **Initialization**: `new Context()` → `await initializeWebGPU()`
2. **Shader syntax**: GLSL → WGSL
3. **Error handling**: Synchronous → Asynchronous (for device creation)
4. **Feature detection**: Check `isWebGPUSupported()` before use

詳細な移行ガイドは、WebGL版のAPIとの対応表を参照してください。
For detailed migration guide, refer to the API correspondence table with the WebGL version.