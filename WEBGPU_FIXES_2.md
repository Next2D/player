# WebGPU Implementation Fixes - Session 2

## Summary
This document outlines the fixes applied to resolve critical WebGPU rendering issues.

## Issues Fixed

### 1. HTMLCanvasElement Reference Error
**Error**: `Uncaught (in promise) ReferenceError: HTMLCanvasElement is not defined`

**Fix**: Simplified canvas resizing logic in `Context.ts` to use generic property access instead of instanceof checks, which fail in Worker contexts.

**Files Modified**:
- `packages/webgpu/src/Context.ts` - resize() method

### 2. Instance Buffer Size Mismatch
**Error**: `Instance range (first: 0, count: 3) requires a larger buffer (280) than the bound buffer size (264)`

**Root Cause**: The instance buffer structure had vec2 padding issues. WebGPU requires vec4 alignment for buffer attributes.

**Fix**: 
- Modified instance data to use 24 floats per instance (instead of 22) by padding the matrixTx vec2 to vec4
- Updated pipeline stride from 88 bytes to 96 bytes
- Updated shader to expect vec4 for matrixTx instead of vec2

**Files Modified**:
- `packages/webgpu/src/Blend/BlendInstancedManager.ts` - Added padding to renderQueue.push()
- `packages/webgpu/src/Shader/PipelineManager.ts` - Updated arrayStride and attribute offsets
- `packages/webgpu/src/Shader/ShaderSource.ts` - Updated InstanceInput struct

### 3. createImageBitmap Error
**Error**: `Uncaught (in promise) Error: Not implemented yet`

**Fix**: Implemented proper createImageBitmap() method that:
- Reads from atlas texture instead of main texture
- Properly handles premultiplied alpha conversion
- Uses GPU buffer for pixel readback
- Throws error if createImageBitmap is not available (instead of falling back)

**Files Modified**:
- `packages/webgpu/src/Context.ts` - createImageBitmap() method

### 4. Bitmap Color Issues (Sepia Tone)
**Error**: Bitmap images displaying with incorrect sepia coloring

**Root Cause**: Incorrect premultipliedAlpha flag when copying external images to texture

**Fix**: Changed `premultipliedAlpha: true` to `premultipliedAlpha: false` in drawElement() method, and added element.width/height fallback

**Files Modified**:
- `packages/webgpu/src/Context.ts` - drawElement() method

### 5. Atlas Size Configuration
**Error**: `Failed to create node: 2660x1497 - atlas full`

**Fix**: Set render max size to match WebGL's approach (half of max texture size, capped at 4096) in constructor

**Files Modified**:
- `packages/webgpu/src/Context.ts` - constructor

## Technical Details

### Instance Buffer Layout (24 floats = 96 bytes)
```
Offset  | Size | Field           | Type
--------|------|-----------------|------
0       | 16   | textureRect     | vec4
16      | 16   | textureDim      | vec4
32      | 16   | matrixTx+pad    | vec4 (was vec2)
48      | 16   | matrixScale     | vec4
64      | 16   | mulColor        | vec4
80      | 16   | addColor        | vec4
Total   | 96   |                 |
```

### Premultiplied Alpha Handling
WebGL creates textures with premultiplied alpha by default. The WebGPU implementation now:
1. Accepts external images as non-premultiplied
2. Converts to premultiplied in shader if needed
3. Properly handles alpha in color transforms

## Remaining Issues

### 1. Shape Rendering (Bezier Curves)
The bezier curve anti-aliasing shader needs proper implementation with two-pass rendering:
- Pass 1: Stencil buffer setup using mask shader
- Pass 2: Final rendering with color

### 2. Mask Processing
Mask rendering is not yet implemented. Requires:
- Stencil buffer attachment
- Two-pass rendering approach from WebGL
- Proper stencil operations

### 3. "Destroyed texture" Error
This occurs when getCurrentTexture() is called multiple times per frame or when textures are used after being released. Current mitigation:
- Single getCurrentTexture() call per frame in beginFrame()
- Proper cleanup in endFrame()

## Testing Recommendations

1. Test with various bitmap sizes to ensure atlas packing works
2. Verify color accuracy of rendered bitmaps
3. Test instanced rendering with multiple objects
4. Verify shape rendering once bezier shader is implemented
5. Test mask operations once implemented

## Notes

- The WebGPU implementation uses premultiplied alpha throughout, matching WebGL
- Buffer alignment requirements are stricter in WebGPU than WebGL
- Vec2 attributes should be padded to vec4 for optimal performance
- Texture lifecycle management is critical - only call getCurrentTexture() once per frame
