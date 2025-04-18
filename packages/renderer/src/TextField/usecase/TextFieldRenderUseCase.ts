import type { Node } from "@next2d/texture-packer";
import type { ITextFieldAutoSize } from "../../interface/ITextFieldAutoSize";
import type { ITextSetting } from "../../interface/ITextSetting";
import { $cacheStore } from "@next2d/cache";
import { execute as displayObjectGetBlendModeService } from "../../DisplayObject/service/DisplayObjectGetBlendModeService";
import { execute as textFieldDrawOffscreenCanvasUseCase } from "./TextFieldDrawOffscreenCanvasUseCase";
import { $context } from "../../RendererUtil";

/**
 * @type {TextDecoder}
 * @private
 */
const $textDecoder: TextDecoder = new TextDecoder();

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

    const colorTransform = render_queue.subarray(index, index + 8);
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
    const cacheKey  = render_queue[index++];

    // text state
    const changed = Boolean(render_queue[index++]);

    const xScale = Math.round(Math.sqrt(
        matrix[0] * matrix[0]
        + matrix[1] * matrix[1]
    ) * 10) / 10;

    const yScale = Math.round(Math.sqrt(
        matrix[2] * matrix[2]
        + matrix[3] * matrix[3]
    ) * 10) / 10;

    let node: Node;
    const hasCache = render_queue[index++];
    if (!hasCache) {

        const width  = Math.ceil(Math.abs(xMax - xMin) * xScale);
        const height = Math.ceil(Math.abs(yMax - yMin) * yScale);

        const hasNode = Boolean(render_queue[index++]);

        node = hasNode
            ? $cacheStore.get(uniqueKey, `${cacheKey}`) as Node
            : $context.createNode(width, height);

        if (!hasNode) {
            $cacheStore.set(uniqueKey, `${cacheKey}`, node);
        }

        const length = render_queue[index++];
        const buffer = new Uint8Array(render_queue.subarray(index, index + length));
        index += length;

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
            JSON.parse($textDecoder.decode(buffer)),
            textSetting,
            xScale, yScale
        );

        // fixed logic
        const currentAttachment = $context.currentAttachmentObject;
        $context.bind($context.atlasAttachmentObject);

        $context.reset();
        $context.beginNodeRendering(node);

        const offsetY = $context.atlasAttachmentObject.height - node.y - height;
        $context.setTransform(1, 0, 0, 1,
            node.x,
            offsetY
        );

        $context.drawElement(node, canvas);

        $context.endNodeRendering();

        if (currentAttachment) {
            $context.bind(currentAttachment);
        }

    } else {
        node = $cacheStore.get(uniqueKey, `${cacheKey}`) as Node;
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

        $context.applyFilter(
            node, uniqueKey, Boolean(Math.max(+changed, +updated)),
            width, height, false,
            matrix, colorTransform, displayObjectGetBlendModeService(blendMode),
            filterBounds, params
        );

        index += length;

        return index;
    }

    $context.globalAlpha = Math.min(Math.max(0, colorTransform[3] + colorTransform[7] / 255), 1);
    $context.imageSmoothingEnabled = true;
    $context.globalCompositeOperation = displayObjectGetBlendModeService(blendMode);

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

    // 描画範囲をinstanced arrayに設定
    $context.drawDisplayObject(
        node,
        bounds[0], bounds[1], bounds[2], bounds[3],
        colorTransform
    );

    return index;
};