# @next2d/webgpu

WebGPU rendering engine for Next2D Player v3.

## Features

- High-performance WebGPU rendering backend
- Compatible with existing Next2D API
- Automatic fallback to WebGL when WebGPU is not available
- Modern GPU compute pipeline support

## Usage

```typescript
import { Context } from "@next2d/webgpu";

// WebGPU context will be created automatically
const context = new Context(device, canvas, samples, devicePixelRatio);
```

This package provides WebGPU equivalents for all WebGL functionality in the Next2D Player.