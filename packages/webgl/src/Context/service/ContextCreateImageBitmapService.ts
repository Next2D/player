import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { execute as textureManagerBind0UseCase } from "../../TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as textureManagerGetMainTextureFromBoundsUseCase } from "../../TextureManager/usecase/TextureManagerGetMainTextureFromBoundsUseCase";
import {
    $readFrameBuffer,
    $getPixelFrameBuffer
} from "../../FrameBufferManager";
import {
    $context,
    $gl,
    $upperPowerOfTwo
} from "../../WebGLUtil";

/**
 * @type {number}
 * @private
 */
let $byteLength: number = 0;

/**
 * @description 0..255 の逆数テーブル（255/a）
 *              Inverse table of 0..255 (255/a)
 *
 * @type {Float32Array}
 * @private
 */
const $inv: Float32Array = new Float32Array(256);
$inv[0] = 0;
for (let a = 1; a < 256; a++) $inv[a] = 255 / a;

/**
 * @description OffscreenCanvas に描画して返却
 *              Draw to OffscreenCanvas and return
 *
 * @param  {number} width
 * @param  {number} height
 * @return {Promise<ImageBitmap>}
 * @method
 * @protected
 */
export const execute = async (width: number, height: number): Promise<ImageBitmap> =>
{
    // fixed logic
    const mainTextureObject = textureManagerGetMainTextureFromBoundsUseCase(0, 0, width, height);
    textureManagerBind0UseCase(mainTextureObject);

    $gl.bindFramebuffer($gl.FRAMEBUFFER, $getPixelFrameBuffer());
    $gl.framebufferTexture2D(
        $gl.FRAMEBUFFER, $gl.COLOR_ATTACHMENT0,
        $gl.TEXTURE_2D, mainTextureObject.resource, 0
    );

    const pixels = new Uint8Array(width * height * 4);
    const $mainAttachmentObject = $context.$mainAttachmentObject as IAttachmentObject;

    if (pixels.byteLength > $byteLength) {
        $byteLength = $upperPowerOfTwo(pixels.byteLength);
        $gl.bufferData($gl.PIXEL_PACK_BUFFER, $byteLength, $gl.STREAM_READ);
    }

    $gl.readPixels(
        0, $mainAttachmentObject.height - height,
        width, height, $gl.RGBA, $gl.UNSIGNED_BYTE, 0
    );

    const sync = $gl.fenceSync($gl.SYNC_GPU_COMMANDS_COMPLETE, 0) as WebGLSync;

    // 非同期 readPixels 用 PBO の設定
    await new Promise<void>((resolve): void =>
    {
        const wait = (): void =>
        {
            const status = $gl.clientWaitSync(sync, $gl.SYNC_FLUSH_COMMANDS_BIT, 0);
            if (status === $gl.TIMEOUT_EXPIRED) {
                requestAnimationFrame(wait);
                return ;
            }

            $gl.deleteSync(sync);
            $gl.getBufferSubData($gl.PIXEL_PACK_BUFFER, 0, pixels);

            return resolve();
        };
        wait();
    });
    $gl.bindFramebuffer($gl.FRAMEBUFFER, $readFrameBuffer);

    // 描画用の OffscreenCanvas に pixelsを描画
    const offscreenCanvas = new OffscreenCanvas(width, height);
    const context = offscreenCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        
    // アルファ補正
    for (let idx = 0; idx < pixels.length; idx += 4) {

        const alpha = pixels[idx + 3];

        // a=0は何もしない / a=255は既にストレートと同等
        if (alpha === 0 || alpha === 255) {
            continue;
        }
        
        const f = $inv[alpha];
        pixels[idx    ] = Math.min(255, Math.round(pixels[idx    ] * f));
        pixels[idx + 1] = Math.min(255, Math.round(pixels[idx + 1] * f));
        pixels[idx + 2] = Math.min(255, Math.round(pixels[idx + 2] * f));
    }

    const imageData = new ImageData(new Uint8ClampedArray(pixels), width, height);
    context.putImageData(imageData, 0, 0);

    // 反転してImageBitmapを返却
    return await createImageBitmap(offscreenCanvas, {
        "imageOrientation": "flipY",
        "premultiplyAlpha": "none"
    });
};