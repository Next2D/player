import type { IAttachmentObject } from "../interface/IAttachmentObject";

/**
 * @description フィルター用グラデーションLUTの共有アタッチメント
 *              Shared attachment for filter gradient LUT
 *              注意: グラデーションLUTは共有テクスチャに描画されるため、
 *              キャッシュは使用しません。各フレームで再描画が必要です。
 *              Note: Gradient LUT is drawn to a shared texture, so caching
 *              is not used. Re-drawing is required each frame.
 *
 * @type {IAttachmentObject | null}
 * @private
 */
let $filterGradientAttachment: IAttachmentObject | null = null;

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
export const $setFilterGradientLUTDevice = (device: GPUDevice): void =>
{
    $device = device;
};

/**
 * @description フィルター用グラデーションLUTのAttachmentObjectを返却
 *              Returns AttachmentObject for filter gradient LUT
 *
 * @return {IAttachmentObject}
 * @method
 * @protected
 */
export const $getFilterGradientAttachmentObject = (): IAttachmentObject =>
{
    if (!$filterGradientAttachment && $device) {
        const resolution = 256;

        // 1xN テクスチャを作成
        const texture = $device.createTexture({
            size: { width: resolution, height: 1 },
            format: "rgba8unorm",
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
        });

        $filterGradientAttachment = {
            id: -256, // フィルター用に負のIDを使用
            width: resolution,
            height: 1,
            clipLevel: 0,
            msaa: false,
            mask: false,
            color: null,
            texture: {
                id: -256,
                resource: texture,
                view: texture.createView(),
                width: resolution,
                height: 1,
                area: resolution,
                smooth: true
            },
            stencil: null
        };
    }

    return $filterGradientAttachment as NonNullable<IAttachmentObject>;
};

/**
 * @description フィルター用グラデーションLUTの共有アタッチメントを破棄してクリア
 *              Destroy and clear filter gradient LUT shared attachment
 *
 * @return {void}
 * @method
 * @protected
 */
export const $clearFilterGradientAttachment = (): void =>
{
    if ($filterGradientAttachment?.texture?.resource) {
        $filterGradientAttachment.texture.resource.destroy();
    }
    $filterGradientAttachment = null;
};
