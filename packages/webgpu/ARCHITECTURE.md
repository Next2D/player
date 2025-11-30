# WebGPU Implementation Architecture

## Overview

This document describes the architecture of the Next2D WebGPU rendering implementation.

## Directory Structure

```
packages/webgpu/
├── src/
│   ├── Context.ts              # Main rendering context
│   ├── WebGPUUtil.ts           # Utility functions and global state
│   ├── PathCommand.ts          # Path command processing
│   ├── BufferManager.ts        # Buffer management
│   ├── TextureManager.ts       # Texture management
│   ├── FrameBufferManager.ts   # Frame buffer management
│   ├── DrawManager.ts          # High-level drawing operations
│   ├── Shader/
│   │   ├── ShaderSource.ts     # WGSL shader sources
│   │   └── PipelineManager.ts  # Pipeline management
│   ├── interface/
│   │   ├── IAttachmentObject.ts
│   │   ├── IBlendMode.ts
│   │   ├── IBounds.ts
│   │   └── IPoint.ts
│   └── index.ts                # Public API exports
├── examples/
│   └── basic-usage.ts          # Usage examples
└── README.md                   # Package documentation

Total: ~660 lines of TypeScript code
```

## Core Components

### 1. Context (`Context.ts`)

The main rendering context that provides the public API.

**Key Features:**
- Drawing API compatible with WebGL version
- Path rendering (moveTo, lineTo, bezierCurveTo, etc.)
- Fill and stroke operations
- Transform management (save, restore, setTransform, transform)
- Color and style management
- Integration with all manager classes

**Public Methods:**
```typescript
// Path commands
beginPath(), moveTo(), lineTo(), quadraticCurveTo()
bezierCurveTo(), arc(), closePath()

// Drawing
fill(), stroke(), fillStyle(), strokeStyle()
gradientFill(), bitmapFill(), gradientStroke(), bitmapStroke()

// Transform
save(), restore(), setTransform(), transform()

// Background
updateBackgroundColor(), fillBackgroundColor()

// Advanced
resize(), clearRect(), clip(), submit()
createNode(), removeNode(), createImageBitmap()
```

### 2. WebGPUUtil (`WebGPUUtil.ts`)

Utility class for managing global WebGPU state.

**Responsibilities:**
- Store GPUDevice reference
- Store GPUCanvasContext reference
- Manage preferred texture format
- Track device pixel ratio
- Provide factory methods for typed arrays

### 3. PathCommand (`PathCommand.ts`)

Handles path creation and vertex generation.

**Features:**
- Path command accumulation
- Bezier curve tessellation
- Arc generation
- Triangle generation from paths
- Path closing

**Algorithm:**
- Quadratic/Cubic bezier curves are tessellated into line segments
- Arcs are approximated with 32 segments
- Paths are triangulated using fan triangulation

### 4. BufferManager (`BufferManager.ts`)

Manages vertex and uniform buffers.

**Capabilities:**
- Create and cache vertex buffers
- Create and update uniform buffers
- Generate rectangle vertices
- Buffer lifecycle management

**Buffer Types:**
- Vertex buffers: Position + TexCoord (Float32Array)
- Uniform buffers: Matrix, color, alpha data

### 5. TextureManager (`TextureManager.ts`)

Manages textures and samplers.

**Features:**
- Create textures from dimensions
- Create textures from pixel data
- Create textures from ImageBitmap
- Multiple sampler types (linear, nearest, repeat)
- Texture updates

**Sampler Types:**
- `linear`: Linear filtering, clamp to edge
- `nearest`: Nearest filtering, clamp to edge
- `repeat`: Linear filtering, repeat mode

### 6. FrameBufferManager (`FrameBufferManager.ts`)

Manages render targets and attachments.

**Responsibilities:**
- Create/destroy attachment objects
- Track current attachment
- Generate render pass descriptors
- Resize attachments

**Attachment Structure:**
```typescript
interface IAttachmentObject {
    width: number;
    height: number;
    texture: GPUTexture;
    textureView: GPUTextureView;
}
```

### 7. PipelineManager (`Shader/PipelineManager.ts`)

Manages render pipelines and bind group layouts.

**Pipeline Types:**
1. **Basic Pipeline**: Solid color rendering
2. **Texture Pipeline**: Textured rendering
3. **Gradient Pipeline**: Gradient rendering
4. **Blend Pipeline**: Blend mode rendering

**Configuration:**
- All pipelines use alpha blending
- Triangle list topology
- No culling
- 4-component vertex format (position + texcoord)

### 8. ShaderSource (`Shader/ShaderSource.ts`)

Provides WGSL shader sources.

**Shader Categories:**
1. **Vertex Shaders**
   - Basic vertex shader with matrix transform
   
2. **Fragment Shaders**
   - Basic: Solid color output
   - Texture: Textured rendering
   - Gradient: Linear/radial gradients
   - Blend: Multiple blend modes

**Blend Modes Supported:**
- Normal, Multiply, Screen, Add (more to be implemented)

### 9. DrawManager (`DrawManager.ts`)

High-level drawing operations.

**Features:**
- Create bind groups
- Draw rectangles
- Draw textured rectangles
- Manage draw state

## Data Flow

```
User Code
    ↓
Context.beginPath() → PathCommand.beginPath()
Context.moveTo()    → PathCommand.moveTo()
Context.lineTo()    → PathCommand.lineTo()
Context.fill()      → PathCommand.generateVertices()
    ↓
DrawManager.drawRect()
    ↓
BufferManager.createVertexBuffer()
BufferManager.createUniformBuffer()
    ↓
PipelineManager.getPipeline()
    ↓
GPURenderPassEncoder.draw()
    ↓
Context.submit() → GPUQueue.submit()
```

## Rendering Pipeline

1. **Command Encoding**
   - Commands are encoded into GPUCommandEncoder
   - Multiple render passes can be created

2. **Render Pass**
   - Each render pass targets a texture view
   - Clear or load previous content
   - Execute draw commands
   - Store results

3. **Draw Call**
   - Set pipeline
   - Set vertex buffers
   - Set bind groups (uniforms, textures, samplers)
   - Issue draw command

4. **Submission**
   - Finish command encoder
   - Submit to GPU queue

## Memory Management

### Buffer Lifecycle
- Buffers are created on-demand
- Cached by name in BufferManager
- Destroyed explicitly or on dispose

### Texture Lifecycle
- Textures created via TextureManager
- Cached by name
- Destroyed on removeTexture() or dispose()

### Resource Cleanup
```typescript
// Proper cleanup order
drawManager.dispose();
pipelineManager.dispose();
frameBufferManager.dispose();
textureManager.dispose();
bufferManager.dispose();
```

## Performance Considerations

1. **Batch Rendering**: Group similar draw calls
2. **Buffer Reuse**: Cache frequently used buffers
3. **Texture Atlasing**: Combine textures when possible
4. **Pipeline State**: Minimize pipeline switches
5. **Memory**: Release unused resources

## Future Enhancements

### Planned Features
- [ ] Complete filter implementation
- [ ] Instanced rendering support
- [ ] Compute shader integration
- [ ] Advanced blend modes
- [ ] Mesh-based rendering
- [ ] Performance profiling tools

### Optimization Opportunities
- [ ] Buffer pooling
- [ ] Texture compression
- [ ] Geometry batching
- [ ] Indirect drawing
- [ ] Multi-threading with workers

## Compatibility Layer

The WebGPU implementation maintains API compatibility with WebGL:

```typescript
// Same API for both renderers
const ctx = isWebGPU ? webgpuContext : webglContext;

ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(100, 100);
ctx.fillStyle(1, 0, 0, 1);
ctx.fill();
```

This allows applications to switch between renderers without code changes.

## Testing Strategy

1. **Unit Tests**: Individual component testing
2. **Integration Tests**: Component interaction testing
3. **Visual Tests**: Rendering output comparison
4. **Performance Tests**: Benchmark against WebGL
5. **Browser Tests**: Cross-browser compatibility

## References

- [WebGPU Specification](https://www.w3.org/TR/webgpu/)
- [WGSL Specification](https://www.w3.org/TR/WGSL/)
- [WebGPU Best Practices](https://toji.github.io/webgpu-best-practices/)
