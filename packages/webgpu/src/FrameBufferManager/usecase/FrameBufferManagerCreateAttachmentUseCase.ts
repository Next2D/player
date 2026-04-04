import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { ITextureObject } from "../../interface/ITextureObject";
import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { $samples } from "../../WebGPUUtil";

/**
 * @description アタッチメントオブジェクトを作成
 *              Create attachment object
 *
 * @param  {GPUDevice} device - GPUデバイス
 * @param  {GPUTextureFormat} format - テクスチャフォーマット
 * @param  {Map<string, IAttachmentObject>} attachments - アタッチメント管理マップ
 * @param  {string} name - アタッチメント名
 * @param  {number} width - テクスチャ幅
 * @param  {number} height - テクスチャ高さ
 * @param  {boolean} msaa - MSAA有効フラグ
 * @param  {boolean} mask - マスク有効フラグ
 * @param  {{ nextId: number, textureId: number, stencilId: number }} id_counter - ID管理カウンタ
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
    id_counter: { nextId: number; textureId: number; stencilId: number }
): IAttachmentObject => {
    // アトラスかどうか判定（atlas, atlas_0, atlas_1, ...）
    const isAtlas = name === "atlas" || name.startsWith("atlas_");

    // アトラステクスチャと一時アタッチメントはRGBA8フォーマットを使用
    // （copyExternalImageToTextureとの互換性、およびcopyTextureToTextureでのフォーマット一致のため）
    // mainアタッチメントはスワップチェーンと同じbgra8unormフォーマットを使用
    const textureFormat = isAtlas || name.startsWith("temp_") ? "rgba8unorm" : format;

    // MSAAを使用するかどうか（アトラスでmsaa有効かつ$samples > 1の場合）
    // 現在はアトラスのみにMSAAを適用（他のアタッチメントはmsaa=falseで呼び出される）
    const useMsaa = msaa || isAtlas && $samples > 1;
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
        "id": id_counter.textureId++,
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
            "id": id_counter.textureId++,
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

    if (isAtlas || name === "main" || mask) {
        const stencilTexture = device.createTexture({
            "size": { width, height },
            "format": "stencil8",
            "usage": GPUTextureUsage.RENDER_ATTACHMENT
        });
        const stencilView = stencilTexture.createView();

        stencil = {
            "id": id_counter.stencilId++,
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
                "id": id_counter.stencilId++,
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
        "id": id_counter.nextId++,
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
