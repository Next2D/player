@next2d/webgpu
=============

Next2D WebGPU Rendering Package - Modern GPU-accelerated rendering for Next2D Player

## Overview

This package provides WebGPU-based rendering implementation for Next2D Player. It offers modern GPU-accelerated rendering while maintaining API compatibility with the WebGL version.

## Features

- **Modern GPU API**: Built on WebGPU for improved performance and modern graphics features
- **Compatible API**: Same interface as WebGL version for easy migration
- **Advanced Rendering**: Supports gradients, textures, blend modes, and filters
- **Path Rendering**: Full support for bezier curves, arcs, and complex paths
- **Shader Pipeline**: Modular shader system with multiple rendering modes

## Architecture

### Core Components

- **Context**: Main rendering context with drawing API
- **PathCommand**: Path creation and management
- **BufferManager**: Vertex and uniform buffer management
- **TextureManager**: Texture creation and sampling
- **FrameBufferManager**: Render target management
- **PipelineManager**: Shader pipeline management
- **DrawManager**: High-level drawing operations

### Shader Types

- Basic shader (solid colors)
- Texture shader (bitmap rendering)
- Gradient shader (linear and radial gradients)
- Blend shader (blend modes support)

## Installation

```
npm install @next2d/webgpu
```

## Usage

```typescript
// Initialize WebGPU
const adapter = await navigator.gpu?.requestAdapter();
const device = await adapter?.requestDevice();
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('webgpu');

if (device && context) {
  const preferredFormat = navigator.gpu.getPreferredCanvasFormat();
  
  // Create Next2D WebGPU Context
  const next2dContext = new Context(device, context, preferredFormat);
  
  // Animation loop
  function render() {
    // フレーム開始（重要！）
    next2dContext.beginFrame();
    
    // Use the context for drawing
    next2dContext.beginPath();
    next2dContext.moveTo(10, 10);
    next2dContext.lineTo(100, 100);
    next2dContext.fillStyle(1, 0, 0, 1); // Red
    next2dContext.fill();
    
    // フレーム終了（コマンド送信）
    next2dContext.endFrame();
    
    requestAnimationFrame(render);
  }
  
  render();
}
```

**重要**: WebGPUでは各フレームの開始時に`beginFrame()`を、終了時に`endFrame()`を呼び出す必要があります。これにより、テクスチャのライフサイクルが適切に管理されます。

## API Reference

### Drawing Methods

- `beginPath()`: Start a new path
- `moveTo(x, y)`: Move to position
- `lineTo(x, y)`: Draw line to position
- `quadraticCurveTo(cx, cy, x, y)`: Draw quadratic curve
- `bezierCurveTo(cx1, cy1, cx2, cy2, x, y)`: Draw cubic curve
- `arc(x, y, radius)`: Draw arc
- `closePath()`: Close current path
- `fill()`: Fill current path
- `stroke()`: Stroke current path

### Style Methods

- `fillStyle(r, g, b, a)`: Set fill color
- `strokeStyle(r, g, b, a)`: Set stroke color
- `gradientFill(...)`: Apply gradient fill
- `bitmapFill(...)`: Apply bitmap fill

### Transform Methods

- `save()`: Save transformation state
- `restore()`: Restore transformation state
- `setTransform(...)`: Set transformation matrix
- `transform(...)`: Apply transformation

## Compatibility

This package is designed to work alongside the WebGL version. Applications can choose between WebGL and WebGPU based on browser support.

## Browser Support

WebGPU is supported in:
- Chrome 113+
- Edge 113+
- Other browsers: Check [Can I use WebGPU](https://caniuse.com/webgpu)

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](LICENSE) file for details.
