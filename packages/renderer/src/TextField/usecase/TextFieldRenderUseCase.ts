import type { Node } from "@next2d/texture-packer";
import type { ITextFieldAutoSize } from "../../interface/ITextFieldAutoSize";
import type { ITextSetting } from "../../interface/ITextSetting";
import { $cacheStore } from "@next2d/cache";
import { decodeTextData } from "@next2d/render-queue";
import { execute as displayObjectGetBlendModeService } from "../../DisplayObject/service/DisplayObjectGetBlendModeService";
import { execute as textFieldDrawOffscreenCanvasUseCase } from "./TextFieldDrawOffscreenCanvasUseCase";
import { $context } from "../../RendererUtil";

/**
 * @type {TextDecoder}
 * @private
 */
const $textDecoder: TextDecoder = new TextDecoder();

// drawElement consumes the canvas image synchronously on both backends.
// Keep at most one small scratch canvas; large rasters are not retained.
let $textCanvas: OffscreenCanvas | null = null;

/**
 * @description TextFieldの描画を実行します。
 *              Execute the drawing of TextField.
 *
 * @param  {Float32Array} render_queue
 * @param  {number} index
 * @return {number}
 * @method
 * @protected
 */
export const execute = (render_queue: Float32Array, index: number): number =>
{
    const matrix = render_queue.subarray(index, index + 6);
    index += 6;

    const colorTransformIndex = index;
    index += 8;

    const bounds = render_queue.subarray(index, index + 4);
    index += 4;

    // baseBounds
    const xMin = render_queue[index++];
    const yMin = render_queue[index++];
    const xMax = render_queue[index++];
    const yMax = render_queue[index++];

    // cache uniqueKey
    const uniqueKey = `${render_queue[index++]}`;
    const cacheKey  = `${render_queue[index++]}`;

    // text state (bit 0 = changed, bit 1 = cacheAsBitmap)
    const changedFlag = render_queue[index++];
    const changed = Boolean(changedFlag & 1);
    const isCacheAsBitmap = Boolean(changedFlag & 2);

    const xScale = render_queue[index++];
    const yScale = render_queue[index++];

    // フィルターキャッシュ用のユニークキー（instanceId）
    // 文字列化はフィルター使用時のみ行う
    const filterKeyNumber = render_queue[index++];

    let node: Node;
    const hasCache = render_queue[index++];
    if (!hasCache) {

        const width  = Math.ceil(Math.abs(xMax - xMin) * xScale);
        const height = Math.ceil(Math.abs(yMax - yMin) * yScale);

        const hasNode = Boolean(render_queue[index++]);

        if (hasNode) {
            node = $cacheStore.get(uniqueKey, cacheKey) as Node;
        } else {
            // TextFieldResetUseCase 等で Main 側のみ wipe された場合、
            // Worker の旧 Node は同寸法なら保持し、寸法変更時は解放して作り直す
            const oldNode = $cacheStore.get(uniqueKey, cacheKey) as Node | null;
            if (oldNode && oldNode.w === width && oldNode.h === height
                && $context.reuseNode(oldNode)
            ) {
                node = oldNode;
            } else {
                if (oldNode) {
                    $context.removeNode(oldNode);
                }
                node = $context.createNode(width, height);
            }
            $cacheStore.set(uniqueKey, cacheKey, node);
        }

        const length = render_queue[index++];

        // テキストバイト列は4バイト/floatでパックされている
        // (TextFieldGenerateRenderQueueUseCase参照)。lengthはバイト数。
        const buffer = new Uint8Array(
            render_queue.buffer,
            render_queue.byteOffset + index * 4,
            length
        );
        index += Math.ceil(length / 4);

        let autoSize: ITextFieldAutoSize = "none";
        switch (render_queue[index++]) {

            case 0:
                autoSize = "center";
                break;

            case 1:
                autoSize = "left";
                break;

            case 2:
                autoSize = "none";
                break;

            case 3:
                autoSize = "right";
                break;

        }

        const textSetting: ITextSetting = {
            "width": width,
            "height": height,
            "autoSize": autoSize,
            "stopIndex": render_queue[index++],
            "scrollX": render_queue[index++],
            "scrollY": render_queue[index++],
            "textWidth": render_queue[index++],
            "textHeight": render_queue[index++],
            "rawWidth": render_queue[index++],
            "rawHeight": render_queue[index++],
            "focusIndex": render_queue[index++],
            "selectIndex": render_queue[index++],
            "focusVisible": Boolean(render_queue[index++]),
            "thickness": render_queue[index++],
            "thicknessColor": render_queue[index++],
            "wordWrap": Boolean(render_queue[index++]),
            "border": Boolean(render_queue[index++]),
            "borderColor": render_queue[index++],
            "background": Boolean(render_queue[index++]),
            "backgroundColor": render_queue[index++],
            "defaultColor": render_queue[index++],
            "defaultSize": render_queue[index++]
        };

        const canvas = textFieldDrawOffscreenCanvasUseCase(
            decodeTextData($textDecoder.decode(buffer)),
            textSetting,
            xScale, yScale, $textCanvas
        );
        $textCanvas = width * height <= 1024 * 1024 ? canvas : null;

        if (!("queueTextElement" in $context) || !$context.queueTextElement(node, canvas)) {
            // fixed logic
            const currentAttachment = $context.currentAttachmentObject;
            const atlasAttachment = $context.atlasAttachmentObject;
            if (atlasAttachment) {
                $context.bind(atlasAttachment as any);
            }

            $context.reset();
            $context.beginNodeRendering(node);

            const offsetY = atlasAttachment ? atlasAttachment.height - node.y - height : 0;
            $context.setTransform(1, 0, 0, 1,
                node.x,
                offsetY
            );

            $context.drawElement(node, canvas);

            $context.endNodeRendering();

            if (currentAttachment) {
                $context.bind(currentAttachment as any);
            }
        }

    } else {
        node = $cacheStore.get(uniqueKey, cacheKey) as Node;
        if (!node) {
            return index;
        }
    }

    const blendMode = render_queue[index++];

    // フィルター設定があればフィルターを実行
    const useFilfer = Boolean(render_queue[index++]);
    if (useFilfer) {
        const updated = Boolean(render_queue[index++]);
        const filterBounds = render_queue.subarray(index, index + 4);
        index += 4;

        const length = render_queue[index++];
        const params = render_queue.subarray(index, index + length);

        const width  = Math.ceil(Math.abs(bounds[2] - bounds[0]));
        const height = Math.ceil(Math.abs(bounds[3] - bounds[1]));

        const colorTransform = render_queue.subarray(colorTransformIndex, colorTransformIndex + 8);
        $context.applyFilter(
            node, `${filterKeyNumber}`, Boolean(Math.max(+changed, +updated)),
            width, height, false,
            matrix, colorTransform, displayObjectGetBlendModeService(blendMode),
            filterBounds, params
        );

        index += length;

        return index;
    }

    $context.globalAlpha = Math.min(Math.max(0,
        render_queue[colorTransformIndex + 3] + render_queue[colorTransformIndex + 7] / 255), 1);
    $context.imageSmoothingEnabled = true;
    $context.globalCompositeOperation = displayObjectGetBlendModeService(blendMode);

    if (isCacheAsBitmap) {

        // cacheAsBitmap: Bitmapと同様の描画パスで、cacheScaleを補正
        // baseBounds原点(xMin,yMin)のスクリーン座標をtranslationに反映
        const screenX = matrix[0] * xMin + matrix[2] * yMin + matrix[4];
        const screenY = matrix[1] * xMin + matrix[3] * yMin + matrix[5];

        $context.setTransform(
            matrix[0] / xScale, matrix[1] / xScale,
            matrix[2] / yScale, matrix[3] / yScale,
            screenX, screenY
        );

    } else {

        const radianX = Math.atan2(matrix[1], matrix[0]);
        const radianY = Math.atan2(-matrix[2], matrix[3]);
        if (radianX || radianY) {

            const tx = xMin * xScale;
            const ty = yMin * yScale;

            const cosX = Math.cos(radianX);
            const sinX = Math.sin(radianX);
            const cosY = Math.cos(radianY);
            const sinY = Math.sin(radianY);

            $context.setTransform(
                cosX, sinX, -sinY, cosY,
                tx * cosX - ty * sinY + matrix[4],
                tx * sinX + ty * cosY + matrix[5]
            );

        } else {

            $context.setTransform(1, 0, 0, 1,
                bounds[0], bounds[1]
            );

        }

    }

    // 描画範囲をinstanced arrayに設定
    $context.drawDisplayObject(
        node,
        bounds[0], bounds[1], bounds[2], bounds[3],
        render_queue, colorTransformIndex
    );

    return index;
};
