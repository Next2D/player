import type { IColorBufferObject } from "./IColorBufferObject";
import type { ITextureObject } from "./ITextureObject";
import type { IStencilBufferObject } from "./IStencilBufferObject";

/**
 * @description WebGL互換のアタッチメントオブジェクトインターフェース
 *              WebGL-compatible attachment object interface
 *
 * WebGLと同じ構造を持つことで、rendererパッケージで両方のContextを
 * 同じように扱うことができます。
 */
export interface IAttachmentObject
{
    /**
     * @description アタッチメントの一意な識別子
     *              Unique identifier for the attachment
     */
    id: number;
    /**
     * @description アタッチメントの幅（ピクセル）
     *              Width of the attachment in pixels
     */
    width: number;
    /**
     * @description アタッチメントの高さ（ピクセル）
     *              Height of the attachment in pixels
     */
    height: number;
    /**
     * @description 現在のクリップ（マスク）ネストレベル
     *              Current clip (mask) nesting level
     */
    clipLevel: number;
    /**
     * @description MSAAが有効かどうか
     *              Whether MSAA is enabled
     */
    msaa: boolean;
    /**
     * @description マスクモードが有効かどうか
     *              Whether mask mode is enabled
     */
    mask: boolean;
    /**
     * @description カラーバッファオブジェクト
     *              Color buffer object
     */
    color: IColorBufferObject | null;
    /**
     * @description テクスチャオブジェクト
     *              Texture object
     */
    texture: ITextureObject | null;
    /**
     * @description ステンシルバッファオブジェクト
     *              Stencil buffer object
     */
    stencil: IStencilBufferObject | null;
    /**
     * @description MSAAテクスチャ（sampleCount > 1 の場合に使用）
     *              MSAA texture (used when sampleCount > 1)
     */
    msaaTexture: ITextureObject | null;
    /**
     * @description MSAAステンシルテクスチャ（sampleCount > 1 の場合に使用）
     *              MSAA stencil texture (used when sampleCount > 1)
     */
    msaaStencil: IStencilBufferObject | null;
    /**
     * @description ステンシルバッファのクリアが必要かどうか（マスク終了時）
     *              Whether stencil buffer needs to be cleared (on mask end)
     */
    needsStencilClear?: boolean;
    /**
     * @description クリアが必要なステンシルレベル（ネストマスク終了時）
     *              Stencil level that needs to be cleared (on nested mask end)
     */
    pendingStencilClearLevel?: number;
}
