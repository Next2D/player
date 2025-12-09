import type { IAttachmentObject } from "../interface/IAttachmentObject";

/**
 * @description 解像度別のAttachmentObjectキャッシュ
 *              Attachment object cache by resolution
 *              注意: グラデーションLUTは共有テクスチャに描画されるため、
 *              キャッシュは使用しません。各フレームで再描画が必要です。
 *              Note: Gradient LUT is drawn to a shared texture, so caching
 *              is not used. Re-drawing is required each frame.
 *
 * @type {Map<number, IAttachmentObject>}
 * @private
 */
const $gradientAttachmentObjects: Map<number, IAttachmentObject> = new Map();

/**
 * @description GPUDeviceの参照
 * @private
 */
let $device: GPUDevice | null = null;

/**
 * @description GPUDeviceを設定
 *              Set GPUDevice
 *
 * @param  {GPUDevice} device
 * @return {void}
 * @method
 * @protected
 */
export const $setGradientLUTDevice = (device: GPUDevice): void =>
{
    $device = device;
};

/**
 * @description 指定解像度のAttachmentObjectを返却
 *              Returns AttachmentObject with specified resolution
 *
 * @param  {number} resolution
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const $getGradientAttachmentObjectWithResolution = (resolution: number): IAttachmentObject =>
{
    if (!$gradientAttachmentObjects.has(resolution) && $device) {
        // 1xN テクスチャを作成
        const texture = $device.createTexture({
            size: { width: resolution, height: 1 },
            format: "rgba8unorm",
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
        });

        const attachment: IAttachmentObject = {
            id: resolution,
            width: resolution,
            height: 1,
            clipLevel: 0,
            msaa: false,
            mask: false,
            color: null,
            texture: {
                id: resolution,
                resource: texture,
                view: texture.createView(),
                width: resolution,
                height: 1,
                area: resolution,
                smooth: true
            },
            stencil: null
        };

        $gradientAttachmentObjects.set(resolution, attachment);
    }

    return $gradientAttachmentObjects.get(resolution) as NonNullable<IAttachmentObject>;
};

/**
 * @description デフォルトの256解像度のAttachmentObjectを返却
 *              Returns default 256 resolution AttachmentObject
 *
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const $getGradientAttachmentObject = (): IAttachmentObject =>
{
    return $getGradientAttachmentObjectWithResolution(256);
};

/**
 * @description 全ての共有アタッチメントを破棄してクリア
 *              Destroy and clear all shared attachments
 *
 * @return {void}
 * @method
 * @protected
 */
export const $clearGradientAttachmentObjects = (): void =>
{
    for (const attachment of $gradientAttachmentObjects.values()) {
        if (attachment.texture?.resource) {
            attachment.texture.resource.destroy();
        }
    }
    $gradientAttachmentObjects.clear();
};
