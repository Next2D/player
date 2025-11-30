# WebGPU Texture Lifecycle Issue - FIXED

## Problem
Error: "Destroyed texture [Texture "IOSurface(...)"] used in a submit."

## Root Cause
The `getCurrentTexture()` was being called once per frame and stored, but then the texture reference was being cleared (set to `null`) at frame end in `endFrame()`. When `submit()` was called later, WebGPU would validate that the texture in the command buffer was still valid, but since we cleared our reference, the texture might be considered destroyed.

## WebGPU Texture Lifecycle Rules

### Per-Frame Texture from Canvas
1. **Call `getCurrentTexture()` ONCE per frame** - This gets the current surface texture for rendering
2. **DO NOT destroy this texture** - It's managed by the canvas context
3. **Clear the reference after submit** - Set to null so next frame gets a fresh texture
4. **Texture becomes invalid after present** - Each frame needs a new texture

### Render Target Textures (Atlas, Filters, etc.)
1. **Create once, reuse multiple frames** - These are persistent
2. **Destroy when no longer needed** - Explicit cleanup required
3. **Can be used across command encoders** - Different from surface textures

## Fixed Implementation

### Before (BROKEN):
```typescript
private endFrame(): void {
    if (this.commandEncoder) {
        const commandBuffer = this.commandEncoder.finish();
        this.device.queue.submit([commandBuffer]);
    }
    
    // ❌ WRONG: Clearing texture before present
    this.mainTexture = null;
    this.mainTextureView = null;
}
```

### After (FIXED):
```typescript
private endFrame(): void {
    if (this.commandEncoder) {
        const commandBuffer = this.commandEncoder.finish();
        this.device.queue.submit([commandBuffer]);
    }
    
    // ✅ CORRECT: Clear references after submit
    // The texture is used in the command buffer and must remain valid until present
    // Setting to null here ensures next frame gets a new texture via getCurrentTexture()
    this.commandEncoder = null;
    this.renderPassEncoder = null;
    this.mainTexture = null;
    this.mainTextureView = null;
    this.currentRenderTarget = null;
}
```

## Rendering Flow (from README.md Flowchart)

### 1. Cache Miss Flow (新規描画)
```
Shape/TextField/Video
  ↓
maskCheck? → NO
  ↓
cacheExists? → NO
  ↓
TextureAtlas (Binary Tree Packing)
  ↓
Get Coordinates (x, y, w, h)
  ↓
Render to Atlas Texture
  ↓
Store in Cache
```

### 2. Cache Hit Flow (キャッシュ使用)
```
Shape/TextField/Video
  ↓
maskCheck? → NO
  ↓
cacheExists? → YES
  ↓
Get Coordinates from DB
  ↓
filterOrBlend? → NO
  ↓
Add to Instanced Arrays
  (matrix, colorTransform, coordinates)
  ↓
drawArraysInstanced (Batch Rendering)
  ↓
Final Rendering to Main Framebuffer
```

### 3. Filter/Blend Flow (フィルター・ブレンド)
```
filterOrBlend? → YES
  ↓
cacheExists? → NO → Render to Cache
  ↓
Texture Cache
  ↓
drawArrays (individual call)
  ↓
Apply Filter/Blend
  ↓
Final Rendering
```

### 4. Mask Flow (マスク)
```
maskCheck? → YES
  ↓
Direct Rendering to Main Framebuffer
  ↓
drawArrays (with stencil buffer)
```

## Implementation Status

### ✅ Fixed
- Texture lifecycle management in `Context.ts`
- Proper `endFrame()` implementation
- Comment clarification
- Made `beginFrame()` and `endFrame()` public for external use
- Texture reference cleanup after submit (not before)

### 🔨 TODO - Critical for Full Functionality

#### 1. Instanced Array Rendering (High Priority)
The core rendering optimization relies on instanced arrays:
- Port `ShaderInstancedManager` from WebGL to WebGPU
- Implement `drawArraysInstanced()` method
- Create instanced vertex buffers with matrix, colorTransform, and coordinates
- Batch multiple objects into a single draw call

#### 2. Atlas Texture Management (High Priority)
Texture atlas is used to cache rendered content:
- Implement atlas texture creation and management
- Port `AtlasManager` functionality
- Implement `beginNodeRendering()` and `endNodeRendering()` properly
- Handle texture packer integration

#### 3. Shader System (High Priority)
Port WebGL GLSL shaders to WGSL:
- Basic fill/stroke shaders
- Gradient shaders (linear, radial)
- Bitmap texture shaders
- Filter shaders (blur, glow, etc.)
- Blend mode shaders

#### 4. Frame Buffer Management (Medium Priority)
- Complete `FrameBufferManager` implementation
- Handle multiple render targets
- Implement texture transfer between framebuffers
- Support for read/write framebuffer operations

#### 5. Filter & Blend System (Medium Priority)
- Port filter implementations (BlurFilter, GlowFilter, etc.)
- Implement blend modes (normal, multiply, add, etc.)
- Handle filter chains
- Cache filtered results

#### 6. Mask Rendering (Medium Priority)
- Implement stencil buffer for masking
- Port mask begin/end logic
- Handle nested masks

#### 7. Path Rendering (Low Priority - Basic Implementation Exists)
- Complete `PathCommand` implementation
- Mesh generation for fills and strokes
- Bezier curve tesselation

### Current Architecture

```
Context (Main Entry Point)
  ├── BufferManager (Vertex/Index/Uniform buffers)
  ├── TextureManager (Texture creation/management)
  ├── FrameBufferManager (Render targets)
  ├── PipelineManager (Render pipelines/shaders)
  ├── DrawManager (Draw operations)
  └── PathCommand (Path generation)
```

### Next Steps

1. **Immediate**: Verify the texture lifecycle fix resolves the "Destroyed texture" error
2. **Short-term**: Implement basic instanced rendering for simple shapes
3. **Mid-term**: Port shader system and atlas management
4. **Long-term**: Complete filter, blend, and mask systems
