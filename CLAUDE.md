# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next2D Player is a WebGL/WebGPU-based 2D graphics rendering engine for creating rich, interactive graphics, games, and cross-platform applications. It uses hardware acceleration for graphics processing and OffscreenCanvas with web workers for multi-threaded rendering performance.

## Build & Development Commands

```bash
npm install          # Install dependencies
npm start            # Start dev server with Vite (opens index.html)
npm test             # Run all tests with Vitest
npm run lint         # ESLint for src/**/*.ts and packages/**/*.ts
npm run build:vite   # Build production bundle
npm run clean        # Clean build artifacts
```

### Running a Single Test

Tests use Vitest. To run a specific test file:
```bash
npx vitest packages/webgl/src/Blend/service/BlendAddService.test.ts
```

Or run tests matching a pattern:
```bash
npx vitest --testNamePattern "BlendAddService"
```

## Architecture

### Package Structure (Monorepo with npm workspaces)

The `packages/` directory contains modular packages with strict dependency rules:

**Core packages (loosely coupled, no cross-imports allowed):**
- `@next2d/events` - Event system
- `@next2d/cache` - Caching utilities
- `@next2d/filters` - Image filters
- `@next2d/geom` - Geometry/matrix utilities
- `@next2d/texture-packer` - Texture atlas packing
- `@next2d/render-queue` - Render command queue

**Rendering layer:**
- `@next2d/webgl` - WebGL rendering context and operations
- `@next2d/webgpu` - WebGPU rendering (alternative backend)
- `@next2d/renderer` - OffscreenCanvas worker-based renderer (imports only `@next2d/webgl`)

**Display layer:**
- `@next2d/display` - DisplayObject hierarchy (Shape, MovieClip, Bitmap, etc.)
- `@next2d/text` - TextField rendering
- `@next2d/media` - Audio/Video support
- `@next2d/ui` - UI components
- `@next2d/net` - Network/loading utilities

**Entry point:**
- `@next2d/core` - Main Next2D class, Player, Canvas (references other packages but cannot be referenced BY other packages)

### Code Organization Pattern

Each class follows a `usecase`/`service` pattern for method implementation:

```
class => method => service           (simple operations)
class => method => usecase => service (complex operations)
```

Key rules:
- Logic lives in `usecase` or `service` files, not in class methods
- Services cannot call other services directly
- Usecases orchestrate multiple services
- Methods only set class variables (`private`/`protected`)

Directory structure example:
```
packages/webgl/src/
  Context.ts                              # Main class
  Context/
    service/ContextResetService.ts        # Simple operations
    service/ContextResetService.test.ts
    usecase/ContextBindUseCase.ts         # Complex operations
    usecase/ContextBindUseCase.test.ts
```

### Rendering Pipeline

The player uses a two-thread architecture:
1. **Main thread**: DisplayObject tree management, event handling, animation logic
2. **Worker thread**: WebGL/WebGPU rendering via OffscreenCanvas

Flow: DisplayObjects -> RenderQueue -> Worker -> WebGL Context -> Canvas

Key rendering features:
- Texture Atlas with binary tree packing for efficient GPU memory
- Instanced array rendering for batch drawing
- Filter/blend effects rendered to texture cache
- Mask rendering with stencil buffer

## Requirements

- Node.js >= v22.x
- TypeScript ES2020 target
