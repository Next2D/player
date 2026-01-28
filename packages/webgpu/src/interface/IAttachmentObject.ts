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
    id: number;
    width: number;
    height: number;
    clipLevel: number;
    msaa: boolean;
    mask: boolean;
    color: IColorBufferObject | null;
    texture: ITextureObject | null;
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
