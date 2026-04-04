import type { IStencilBufferObject } from "./IStencilBufferObject";

/**
 * @description WebGPU用カラーバッファオブジェクトインターフェース
 *              WebGPU color buffer object interface
 *
 * WebGLのIColorBufferObjectと同様の構造を持ちますが、
 * リソースはGPUTextureを使用します。
 */
export interface IColorBufferObject
{
    /**
     * @description GPUテクスチャリソース
     *              GPU texture resource
     */
    resource: GPUTexture;
    /**
     * @description テクスチャビュー（レンダーパスへのアタッチ用）
     *              Texture view for attaching to render passes
     */
    view: GPUTextureView;
    /**
     * @description 対応するステンシルバッファオブジェクト
     *              Associated stencil buffer object
     */
    stencil: IStencilBufferObject;
    /**
     * @description カラーバッファの幅（ピクセル）
     *              Width of the color buffer in pixels
     */
    width: number;
    /**
     * @description カラーバッファの高さ（ピクセル）
     *              Height of the color buffer in pixels
     */
    height: number;
    /**
     * @description バッファの面積（width × height）
     *              Area of the buffer (width × height)
     */
    area: number;
    /**
     * @description バッファが変更されたかどうか
     *              Whether the buffer has been modified
     */
    dirty: boolean;
}
