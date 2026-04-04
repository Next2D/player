/**
 * @description テクスチャオブジェクトのインターフェース
 *              Texture object interface for WebGPU
 *
 * WebGLのITextureObjectと互換性を持つために
 * resourceプロパティを持ちます。
 */
export interface ITextureObject
{
    /**
     * @description テクスチャの一意な識別子
     *              Unique identifier for the texture
     */
    id: number;
    /**
     * @description GPUテクスチャリソース
     *              GPU texture resource
     */
    resource: GPUTexture;
    /**
     * @description テクスチャビュー（シェーダーバインド用）
     *              Texture view for shader binding
     */
    view: GPUTextureView;
    /**
     * @description テクスチャの幅（ピクセル）
     *              Width of the texture in pixels
     */
    width: number;
    /**
     * @description テクスチャの高さ（ピクセル）
     *              Height of the texture in pixels
     */
    height: number;
    /**
     * @description テクスチャの面積（width × height）
     *              Area of the texture (width × height)
     */
    area: number;
    /**
     * @description スムージング（バイリニアフィルタリング）が有効かどうか
     *              Whether smoothing (bilinear filtering) is enabled
     */
    smooth: boolean;
}
