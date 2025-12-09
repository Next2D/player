# 16. Data Structures / データ構造

[← Back to Index](./README.md) | [← Previous: Resources](./09-resources.md)

---

## Core Interfaces / コアインターフェース

```typescript
// IAttachmentObject - フレームバッファアタッチメント
interface IAttachmentObject {
    id: number;                           // 一意のID
    width: number;                        // 幅
    height: number;                       // 高さ
    clipLevel: number;                    // クリップレベル
    msaa: boolean;                        // MSAAフラグ
    mask: boolean;                        // マスクフラグ
    color: IColorBufferObject | null;     // カラーバッファ
    texture: ITextureObject | null;       // テクスチャ
    stencil: IStencilBufferObject | null; // ステンシルバッファ
}

// IBounds - 境界情報
interface IBounds {
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
}

// IBlendMode - ブレンドモード (15 modes)
type IBlendMode =
    | "normal" | "layer" | "add" | "subtract" | "multiply"
    | "screen" | "lighten" | "darken" | "difference"
    | "overlay" | "hardlight" | "invert" | "alpha" | "erase" | "copy";

// IFillType - フィルタイプ
type IFillType = "fill" | "linear" | "radial" | "bitmap" | "stroke";

// IGradientType - グラデーションタイプ
type IGradientType = 0 | 1; // 0: linear, 1: radial

// ISpreadMethod - グラデーション拡張方法
type ISpreadMethod = 0 | 1 | 2; // 0: pad, 1: reflect, 2: repeat

// IInterpolationMethod - 補間方法
type IInterpolationMethod = 0 | 1; // 0: RGB, 1: linearRGB

// IJointStyle - 線接続スタイル
type IJointStyle = 0 | 1 | 2; // 0: round, 1: bevel, 2: miter

// IPath - パスデータ
type IPath = number[]; // [x, y, flag, x, y, flag, ...]

// IFillMesh - フィルメッシュ
interface IFillMesh {
    buffer: Float32Array;  // 頂点データバッファ
    indexCount: number;    // インデックス数
}

// IPoint - 点情報
interface IPoint {
    x: number;
    y: number;
}

// ITextureObject - テクスチャオブジェクト
interface ITextureObject {
    resource: WebGLTexture;
    width: number;
    height: number;
    smoothing: boolean;
}

// IColorBufferObject - カラーバッファオブジェクト
interface IColorBufferObject {
    id: number;
    resource: WebGLRenderbuffer;
    width: number;
    height: number;
    samples: number;
}

// IStencilBufferObject - ステンシルバッファオブジェクト
interface IStencilBufferObject {
    id: number;
    resource: WebGLRenderbuffer;
    width: number;
    height: number;
    samples: number;
}

// IProgramObject - シェーダープログラム
interface IProgramObject {
    id: number;
    resource: WebGLProgram;
}

// IUniformData - ユニフォーム変数
interface IUniformData {
    location: WebGLUniformLocation;
    type: string;
    array: Int32Array | Float32Array;
}

// IVertexArrayObject - VAOオブジェクト
interface IVertexArrayObject {
    id: string;
    resource: WebGLVertexArrayObject;
    vertexBuffer: WebGLBuffer;
    vertexLength: number;
}

// IStrokeVertexArrayObject - ストローク用VAO（IVertexArrayObject拡張）
interface IStrokeVertexArrayObject extends IVertexArrayObject {
    indexBuffer: WebGLBuffer;
    indexLength: number;
    indexCount: number;
}

// IClipObject - クリッピングオブジェクト（3x3行列+ビューポート）
interface IClipObject {
    vertexArrayObject: WebGLVertexArrayObject;
    matrixA-I: number;                // 3x3 matrix components (9)
    viewportWidth: number;
    viewportHeight: number;
}

// IGrid - グリッド情報（9-slice用）
interface IGrid {
    x: number;
    y: number;
    w: number;
    h: number;
}
```

---

## Global Data Storage / グローバルデータストレージ

```typescript
// TextureManager.ts - テクスチャユニット管理
export let $activeTextureUnit: number = -1;
export const $boundTextures: Array<ITextureObject | null> = [null, null, null]; // 3スロット
$setActiveTextureUnit(unit: number): void

// Bitmap.ts - ビットマップデータ配列
export const $bitmapData: Array<boolean | number | Uint8Array | Float32Array> = [];

// Gradient.ts - グラデーションデータ配列
export const $gradientData: Array<number | number[] | Float32Array> = [];

// Grid.ts - グリッドデータキャッシュ
export const $gridDataMap: Map<number, Float32Array | null> = new Map();
export const $terminateGrid = (): void  // グリッドデータクリア
```

---

## Context API Methods / Context APIメソッド

```typescript
// Context.ts - Public API

// コンテキスト管理
constructor(gl: WebGL2RenderingContext, samples: number, device_pixel_ratio?: number)
clearTransferBounds(): void
updateBackgroundColor(red: number, green: number, blue: number, alpha: number): void
fillBackgroundColor(): void
resize(width: number, height: number, cache_clear?: boolean): void
clearRect(x: number, y: number, w: number, h: number): void
reset(): void

// 変換管理
save(): void
restore(): void
setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void
transform(a: number, b: number, c: number, d: number, e: number, f: number): void

// パス描画
beginPath(): void
moveTo(x: number, y: number): void
lineTo(x: number, y: number): void
quadraticCurveTo(cx: number, cy: number, x: number, y: number): void
bezierCurveTo(cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number): void
arc(x: number, y: number, radius: number): void
closePath(): void

// スタイル設定
fillStyle(red: number, green: number, blue: number, alpha: number): void
strokeStyle(red: number, green: number, blue: number, alpha: number): void

// 描画実行
fill(): void
stroke(): void
clip(): void

// グラデーション・ビットマップ
gradientFill(type: number, stops: number[], matrix: Float32Array, spread: number, interpolation: number, focal: number): void
gradientStroke(type: number, stops: number[], matrix: Float32Array, spread: number, interpolation: number, focal: number): void
bitmapFill(pixels: Uint8Array, matrix: Float32Array, width: number, height: number, repeat: boolean, smooth: boolean): void
bitmapStroke(pixels: Uint8Array, matrix: Float32Array, width: number, height: number, repeat: boolean, smooth: boolean): void

// ノード・インスタンス描画
createNode(width: number, height: number): Node
removeNode(node: Node): void
beginNodeRendering(node: Node): void
endNodeRendering(): void
drawFill(): void
drawDisplayObject(node: Node, x_min: number, y_min: number, x_max: number, y_max: number, color_transform: Float32Array): void
drawArraysInstanced(): void
clearArraysInstanced(): void

// フレームバッファ操作
bind(attachment_object: IAttachmentObject): void
transferMainCanvas(): void
drawPixels(node: Node, pixels: Uint8Array): void
drawElement(node: Node, element: OffscreenCanvas | ImageBitmap): void

// マスク処理
beginMask(): void
setMaskBounds(x_min: number, y_min: number, x_max: number, y_max: number): void
endMask(): void
leaveMask(): void

// その他
useGrid(grid_data: Float32Array | null): void
applyFilter(node: Node, unique_key: string, updated: boolean, width: number, height: number, is_bitmap: boolean, matrix: Float32Array, color_transform: Float32Array, blend_mode: IBlendMode, bounds: Float32Array, params: Float32Array): void
createImageBitmap(width: number, height: number): Promise<ImageBitmap>

// ゲッター
get currentAttachmentObject(): IAttachmentObject | null
get atlasAttachmentObject(): IAttachmentObject
```

---

## Utility Functions (WebGLUtil.ts) / ユーティリティ関数

```typescript
// 配列プーリング
$getArray(...args: any[]): any[]
$poolArray(array: any[]): void
$getFloat32Array4/6/9(...): Float32Array
$poolFloat32Array4/6/9(array: Float32Array): void
$getInt32Array4(...): Int32Array
$poolInt32Array4(array: Int32Array): void

// 行列操作
$inverseMatrix(m: Float32Array): Float32Array
$multiplyMatrices(a: Float32Array, b: Float32Array): Float32Array
$linearGradientXY(matrix: Float32Array): Float32Array

// ユーティリティ
$clamp(value: number, min: number, max: number, default_value?: number): number
$upperPowerOfTwo(v: number): number
$getUUID(): string

// グローバル状態
$setRenderMaxSize(size: number): void
$setWebGL2RenderingContext(gl: WebGL2RenderingContext): void
$setSamples(samples: number): void
$setContext(context: Context): void
$setDevicePixelRatio(device_pixel_ratio: number): void
$getDevicePixelRatio(): number
$setViewportSize(viewport_width: number, viewport_height: number): void
$getViewportWidth(): number
$getViewportHeight(): number
```

---

[Next: WebGPU Porting Notes →](./11-webgpu-porting.md)
