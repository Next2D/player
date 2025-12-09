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
}
