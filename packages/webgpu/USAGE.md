# WebGPU v3 Implementation Guide

This guide explains how to use the new WebGPU backend in Next2D Player v3.

## Quick Start

### Automatic Backend Selection (Recommended)

```typescript
import { execute as initializeContext } from "@next2d/renderer/Command/service/CommandInitializeUnifiedContextService";

// Automatically select the best available backend (WebGPU preferred, fallback to WebGL)
const canvas = new OffscreenCanvas(800, 600);
const usedBackend = await initializeContext(canvas, devicePixelRatio);
console.log(`Using backend: ${usedBackend}`); // "webgpu" or "webgl"
```

### Manual Backend Selection

```typescript
// Force WebGPU
try {
    const backend = await initializeContext(canvas, devicePixelRatio, "webgpu");
} catch (error) {
    console.log("WebGPU not available:", error);
}

// Force WebGL
const backend = await initializeContext(canvas, devicePixelRatio, "webgl");

// Check available backends
import { detectAvailableBackends } from "@next2d/renderer/Command/service/CommandInitializeUnifiedContextService";
const { webgl, webgpu } = await detectAvailableBackends();
```

## WebGPU Context Usage

The WebGPU Context provides the same API as the WebGL Context for compatibility:

```typescript
import { Context } from "@next2d/webgpu";

// Context is automatically created by the initialization service
// Access it through the renderer utilities
import { $context } from "@next2d/renderer/RendererUtil";

// All familiar methods are available
$context.save();
$context.setTransform(a, b, c, d, e, f);
$context.beginPath();
$context.moveTo(x, y);
$context.lineTo(x, y);
$context.fill();
$context.restore();
```

## Advanced WebGPU Features

### Using ShaderManager

```typescript
import { ShaderManager } from "@next2d/webgpu";
import { basicVertexShader, basicFragmentShader } from "@next2d/webgpu";

// Create render pipeline
const shaderManager = new ShaderManager(
    basicVertexShader,
    basicFragmentShader
);

// Update uniforms
const mvpMatrix = new Float32Array(16); // Your MVP matrix
const color = new Float32Array([1.0, 0.0, 0.0, 1.0]); // Red color
shaderManager.updateUniforms(mvpMatrix, 0);
shaderManager.updateUniforms(color, 16);

// Use in render pass
const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
shaderManager.useRenderPipeline(passEncoder);
// ... draw commands
passEncoder.end();
```

### Using TextureManager

```typescript
import { TextureManager } from "@next2d/webgpu";

// Create texture from ImageBitmap
const imageBitmap = await createImageBitmap(imageData);
const textureObject = TextureManager.createTextureFromImageBitmap(imageBitmap);

// Create texture from raw data
const pixelData = new ArrayBuffer(width * height * 4);
const textureObject2 = TextureManager.createTextureFromArrayBuffer(
    pixelData, 
    width, 
    height
);

// Get managed texture
const texture = TextureManager.getTexture(256, 256, "rgba8unorm", true);

// Release when done
TextureManager.releaseTexture(texture);
```

## Performance Benefits

WebGPU provides several performance advantages:

1. **Modern GPU Architecture**: Better utilization of modern GPU capabilities
2. **Compute Shaders**: Support for general-purpose GPU computing
3. **Reduced CPU Overhead**: More efficient command submission
4. **Explicit Resource Management**: Better control over GPU memory

## Browser Support

WebGPU is currently supported in:
- Chrome 113+ (stable)
- Firefox 115+ (behind flag)
- Safari (experimental)

The implementation automatically falls back to WebGL in unsupported browsers.

## Migration from WebGL

No code changes are required! The WebGPU implementation maintains full API compatibility with the existing WebGL Context. Simply enable WebGPU and your existing code will work.

## Troubleshooting

### WebGPU Not Available
- Ensure your browser supports WebGPU
- Check that hardware acceleration is enabled
- Verify the page is served over HTTPS (required for WebGPU)

### Performance Issues
- Use TextureManager for texture pooling
- Batch similar rendering operations
- Consider using compute shaders for complex operations

## Future Enhancements

Planned features for future releases:
- FrameBufferManager for advanced render targets
- Vertex buffer management system
- WebGPU-specific rendering optimizations
- Advanced compute shader examples