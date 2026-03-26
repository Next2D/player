import type { ITextureObject } from "../../interface/ITextureObject";

/**
 * @description テクスチャオブジェクトを新規作成
 *              Create a new texture object
 *
 * @param  {GPUDevice} device - GPUデバイス
 * @param  {number} width - テクスチャ幅
 * @param  {number} height - テクスチャ高さ
 * @param  {boolean} smooth - スムーズフィルタリングの有効フラグ
 * @param  {{ textureId: number }} id_counter - ID管理カウンタ
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    width: number,
    height: number,
    smooth: boolean,
    id_counter: { textureId: number }
): ITextureObject => {
    const texture = device.createTexture({
        "size": { width, height },
        "format": "rgba8unorm",
        "usage": GPUTextureUsage.RENDER_ATTACHMENT |
               GPUTextureUsage.TEXTURE_BINDING |
               GPUTextureUsage.COPY_SRC |
               GPUTextureUsage.COPY_DST
    });

    const view = texture.createView();

    return {
        "id": id_counter.textureId++,
        "resource": texture,
        view,
        width,
        height,
        "area": width * height,
        smooth
    };
};
