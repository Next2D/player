# Development Environments

## Project Overview
Next2D Player は、リッチでインタラクティブなグラフィックス、ゲーム、クロスプラットフォームアプリケーションを作成するための WebGL/WebGPU ベースの 2D グラフィックスレンダリングエンジンです。ハードウェアアクセラレーションによるグラフィックス処理と、OffscreenCanvas + Web Worker によるマルチスレッドレンダリングを採用しています。

Next2D Player is a WebGL/WebGPU-based 2D graphics rendering engine for creating rich, interactive graphics, games, and cross-platform applications. It uses hardware acceleration for graphics processing and OffscreenCanvas with web workers for multi-threaded rendering performance.

## Version 
Middleware required for development and supported versions
```
node >= v22.x
TypeScript ES2020 target
```

## Initial Settings
```
git clone git@github.com:Next2D/player.git
cd player
npm install
```

## Start Development
```
npm start
```

## Unit Test
```
npm test
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

## ESLint
```
npm run lint
```

## Build
```bash
npm run build:vite   # Build production bundle
npm run clean        # Clean build artifacts
```

## concept
各 `class` の `method` は `usecase` もしくは `service` で実装しています。但し、`service` から `service` をコールするのは禁止しています。`method` が簡素な場合は、`service` を直接コールし、複雑な場合や、複数の `service` を呼び出したい場合は `usecase` を実装しています。ロジックは `usecase` もしくは `service` に責務を置き、 `method` の役割は、 `private` や `protected` など、`class` 変数への値のセットまでとしています。

The `method` of each `class` is implemented by `usecase` or `service`. However, calling `service` from `service` is prohibited. If the `method` is simple, call `service` directly. If the `method` is complex or you want to call multiple `service`, implement `usecase`. The logic places the responsibility on the `usecase` or `service`, and the role of the `method` is limited to setting values in `class` variables, such as `private` or `protected`.

### dependency diagram

#### case1
```
class => method => service
```

#### case2
```
class => method => usecase => service
```

### directory structure example
```
packages/webgl/src/
  Context.ts                              # Main class
  Context/
    service/ContextResetService.ts        # Simple operations
    service/ContextResetService.test.ts
    usecase/ContextBindUseCase.ts         # Complex operations
    usecase/ContextBindUseCase.test.ts
```

## packages
`packages` ディレクトリの依存関係で注意する点は以下の通りです。
- `@next2d/core` は他の `packages` からの参照を禁止しています。
- `@next2d/events`, `@next2d/cache`, `@next2d/filters`, `@next2d/geom`, `@next2d/texture-packer`, `@next2d/render-queue` は疎結合で設計されている為、他の `packages` の `import` を禁止しています。
- `@next2d/renderer` はOffscreenCanvasがworkerで処理されるため、 `@next2d/webgl`,`@next2d/webgpu` のみ `import` を許可しています。

The dependencies to note in the `packages` directory are as follows
- `@next2d/core` does not allow references from other `packages`.
- `@next2d/events`, `@next2d/cache`, `@next2d/filters`, `@next2d/geom`, `@next2d/texture-packer` and `@next2d/render-queue` are designed to be loosely coupled, so `import` of other `packages` is prohibited.
- `@next2d/renderer` allows `import` only for `@next2d/webgl`,`@next2d/webgpu`, because OffscreenCanvas is processed by the worker.

### Package Structure (Monorepo with npm workspaces)

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

## Rendering Pipeline

Playerは2スレッド構成で動作します。
1. **メインスレッド**: DisplayObjectツリーの管理、イベント処理、アニメーションロジック
2. **ワーカースレッド**: OffscreenCanvas経由のWebGL/WebGPUレンダリング

The player uses a two-thread architecture:
1. **Main thread**: DisplayObject tree management, event handling, animation logic
2. **Worker thread**: WebGL/WebGPU rendering via OffscreenCanvas

Flow: DisplayObjects -> RenderQueue -> Worker -> WebGL Context -> Canvas

Key rendering features:
- Texture Atlas with binary tree packing for efficient GPU memory
- Instanced array rendering for batch drawing
- Filter/blend effects rendered to texture cache
- Mask rendering with stencil buffer

## WebGL/WebGPU Renderer Switching

The renderer backend is controlled by the `useWebGPU` flag in:
`packages/renderer/src/Command/service/CommandInitializeContextService.ts`

- `const useWebGPU: boolean = true;` → WebGPU renderer
- `const useWebGPU: boolean = false;` → WebGL renderer

E2E tests use whichever renderer is set by this flag. To compare WebGL vs WebGPU output:
1. Set `useWebGPU = false`, run e2e tests for WebGL snapshots
2. Set `useWebGPU = true`, run e2e tests for WebGPU snapshots
3. Compare the generated snapshots

## E2E Tests

E2E tests use Playwright. Run from the `e2e/` directory:
```bash
cd e2e
npx playwright test tests/sprite.spec.ts --project=webgl --update-snapshots
npx playwright test tests/sprite.spec.ts --project=webgpu --update-snapshots
```

Snapshots are saved to:
- `e2e/snapshots/webgl/{spec}-snapshots/`
- `e2e/snapshots/webgpu/{spec}-snapshots/`

## Performance Benchmarks

フレームタイム（median/p95）を計測するベンチマークです。`PERF=1` が設定されたときのみ実行され、通常のe2e実行ではスキップされます。シナリオ: sprites / filters / text / blend（`e2e/pages/perf/`）。閾値（`e2e/tests/perf.spec.ts`）はマシン依存です。

Frame-time benchmarks (median/p95) run via Playwright, gated behind `PERF=1`
(skipped in normal e2e runs). Scenarios: sprites / filters / text / blend
(`e2e/pages/perf/`). Thresholds in `e2e/tests/perf.spec.ts` are machine-dependent.

```bash
npm run test:e2e:perf         # both renderers (respects useWebGPU flag pairing)
npm run test:e2e:perf:webgl   # WebGL only (set useWebGPU=false first)
npm run test:e2e:perf:webgpu  # WebGPU only (set useWebGPU=true first)
```

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](LICENSE) file for details.
