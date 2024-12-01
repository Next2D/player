import { $context } from "../../RendererUtil";
import { execute as shapeRenderUseCase } from "../../Shape/usecase/ShapeRenderUseCase";
import { execute as shapeClipRenderUseCase } from "../../Shape/usecase/ShapeClipRenderUseCase";
import { execute as textFieldRenderUseCase } from "../../TextField/usecase/TextFieldRenderUseCase";
import { execute as videoRenderUseCase } from "../../Video/usecase/VideoRenderUseCase";

/**
 * @description DisplayObjectContainerの描画を実行します。
 *              Execute the drawing of DisplayObjectContainer.
 *
 * @param  {Float32Array} render_queue
 * @param  {number} index
 * @param  {ImageBitmap[]} [image_bitmaps=null]
 * @return {number}
 * @method
 * @protected
 */
export const execute = (
    render_queue: Float32Array,
    index: number,
    image_bitmaps: ImageBitmap[] | null
): number => {

    const useMask = render_queue[index++];
    if (useMask) {

        // これまでの描画データを描画して初期化
        $context.drawArraysInstanced();

        // 設定値を保存
        $context.save();

        // マスク描画の開始準備
        $context.beginMask();

        $context.startMask(
            render_queue[index++],
            render_queue[index++],
            render_queue[index++],
            render_queue[index++]
        );

        const type = render_queue[index++];
        switch (type) {

            case 0x00: // container
                break;

            case 0x01: // shape
                index = shapeClipRenderUseCase(render_queue, index);
                break;

            case 0x02: // text
                break;

            case 0x03: // video
                break;

        }
        $context.endMask();
    }

    let endClipDepth = 0;
    let canRenderMask = true;

    const length = render_queue[index++];
    for (let idx = 0; length > idx; idx++) {

        const depth = render_queue[index++];
        const clipDepth = render_queue[index++];

        // end mask
        if (endClipDepth && depth > endClipDepth) {
            if (canRenderMask) {
                $context.restore();
                $context.leaveMask();
            }

            // reset
            endClipDepth  = 0;
            canRenderMask = true;
        }

        if (!canRenderMask) {
            continue;
        }

        // start mask
        if (clipDepth) {
            endClipDepth  = clipDepth;
            canRenderMask = Boolean(render_queue[index++]);
            if (!canRenderMask) {
                continue;
            }

            // これまでの描画データを描画して初期化
            $context.drawArraysInstanced();

            // 設定値を保存
            $context.save();

            // マスク描画の開始準備
            $context.beginMask();

            $context.startMask(
                render_queue[index++],
                render_queue[index++],
                render_queue[index++],
                render_queue[index++]
            );
            const type = render_queue[index++];
            switch (type) {

                case 0x00: // container
                    break;

                case 0x01: // shape
                    index = shapeClipRenderUseCase(render_queue, index);
                    break;

                case 0x02: // text
                    break;

                case 0x03: // video
                    break;

            }
            $context.endMask();

            continue;
        }

        // hidden
        if (!render_queue[index++]) {
            continue;
        }

        const type = render_queue[index++];
        switch (type) {

            case 0x00: // container
                index = execute(render_queue, index, image_bitmaps);
                break;

            case 0x01: // shape
                index = shapeRenderUseCase(render_queue, index);
                break;

            case 0x02: // text
                index = textFieldRenderUseCase(render_queue, index);
                break;

            case 0x03: // video
                index = videoRenderUseCase(render_queue, index, image_bitmaps);
                break;

            default:
                console.error("unknown type", type);
                break;

        }
    }

    // end mask
    if (endClipDepth || useMask) {
        $context.restore();
        $context.leaveMask();
    }

    return index;
};