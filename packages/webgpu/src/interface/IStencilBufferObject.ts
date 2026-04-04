/**
 * @description WebGPU用ステンシルバッファオブジェクトインターフェース
 *              WebGPU stencil buffer object interface
 *
 * WebGLのIStencilBufferObjectと同様の構造を持ちますが、
 * リソースはGPUTextureを使用します。
 */
export interface IStencilBufferObject
{
    /**
     * @description ステンシルバッファの一意な識別子
     *              Unique identifier for the stencil buffer
     */
    id: number;
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
     * @description ステンシルバッファの幅（ピクセル）
     *              Width of the stencil buffer in pixels
     */
    width: number;
    /**
     * @description ステンシルバッファの高さ（ピクセル）
     *              Height of the stencil buffer in pixels
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
