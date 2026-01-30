import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { ITextureObject } from "../../interface/ITextureObject";
import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { $samples } from "../../WebGPUUtil";

/**
 * @description アタッチメントオブジェクトを作成
 *              Create attachment object
 *
 * @param  {GPUDevice} device
 * @param  {GPUTextureFormat} format
 * @param  {Map<string, IAttachmentObject>} attachments
 * @param  {string} name
 * @param  {number} width
 * @param  {number} height
 * @param  {boolean} msaa
 * @param  {boolean} mask
 * @param  {{ nextId: number, textureId: number, stencilId: number }} idCounter
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const execute = (
    device: GPUDevice,
    format: GPUTextureFormat,
    attachments: Map<string, IAttachmentObject>,
    name: string,
    width: number,
    height: number,
    msaa: boolean,
    mask: boolean,
    idCounter: { nextId: number; textureId: number; stencilId: number }
): IAttachmentObject => {
    // アトラステクスチャと一時アタッチメントはRGBA8フォーマットを使用
    // （copyExternalImageToTextureとの互換性、およびcopyTextureToTextureでのフォーマット一致のため）
    const textureFormat = (name === "atlas" || name.startsWith("temp_")) ? "rgba8unorm" : format;

    // MSAAを使用するかどうか（アトラスでmsaa有効かつ$samples > 1の場合）
    // 現在はアトラスのみにMSAAを適用（他のアタッチメントはmsaa=falseで呼び出される）
    const useMsaa = msaa || name === "atlas" && $samples > 1;
    const sampleCount = useMsaa ? $samples : 1;

    const gpuTexture = device.createTexture({
        "size": { width, height },
        "format": textureFormat,
        "usage": GPUTextureUsage.RENDER_ATTACHMENT |
               GPUTextureUsage.TEXTURE_BINDING |
               GPUTextureUsage.COPY_SRC |
               GPUTextureUsage.COPY_DST
    });

    const textureView = gpuTexture.createView();

    // ITextureObject形式で格納（解決先テクスチャ）
    const texture: ITextureObject = {
        "id": idCounter.textureId++,
        "resource": gpuTexture,
        "view": textureView,
        width,
        height,
        "area": width * height,
        "smooth": true
    };

    // MSAAテクスチャを作成（sampleCount > 1の場合）
    let msaaTexture: ITextureObject | null = null;
    if (useMsaa) {
        const msaaGpuTexture = device.createTexture({
            "size": { width, height },
            "format": textureFormat,
            "sampleCount": sampleCount,
            "usage": GPUTextureUsage.RENDER_ATTACHMENT
        });
        const msaaTextureView = msaaGpuTexture.createView();

        msaaTexture = {
            "id": idCounter.textureId++,
            "resource": msaaGpuTexture,
            "view": msaaTextureView,
            width,
            height,
            "area": width * height,
            "smooth": true
        };
    }

    // アトラスとメインアタッチメント用にステンシルテクスチャを作成
    // アトラス: 2パスフィルレンダリング用
    // メイン: マスク描画用
    let stencil: IStencilBufferObject | null = null;
    let msaaStencil: IStencilBufferObject | null = null;

    if (name === "atlas" || name === "main") {
        const stencilTexture = device.createTexture({
            "size": { width, height },
            "format": "stencil8",
            "usage": GPUTextureUsage.RENDER_ATTACHMENT
        });
        const stencilView = stencilTexture.createView();

        stencil = {
            "id": idCounter.stencilId++,
            "resource": stencilTexture,
            "view": stencilView,
            width,
            height,
            "area": width * height,
            "dirty": false
        };

        // MSAAステンシルテクスチャを作成（sampleCount > 1の場合）
        if (useMsaa) {
            const msaaStencilTexture = device.createTexture({
                "size": { width, height },
                "format": "stencil8",
                "sampleCount": sampleCount,
                "usage": GPUTextureUsage.RENDER_ATTACHMENT
            });
            const msaaStencilView = msaaStencilTexture.createView();

            msaaStencil = {
                "id": idCounter.stencilId++,
                "resource": msaaStencilTexture,
                "view": msaaStencilView,
                width,
                height,
                "area": width * height,
                "dirty": false
            };
        }
    }

    const attachment: IAttachmentObject = {
        "id": idCounter.nextId++,
        width,
        height,
        "clipLevel": 0,
        "msaa": useMsaa,
        mask,
        "color": null,
        texture,
        stencil,
        msaaTexture,
        msaaStencil
    };

    attachments.set(name, attachment);
    return attachment;
};
