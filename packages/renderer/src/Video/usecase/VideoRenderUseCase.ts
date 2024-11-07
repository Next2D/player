import type { Node } from "@next2d/texture-packer";
import { $cacheStore } from "@next2d/cache";
import { $context } from "../../RendererUtil";
import { execute as displayObjectGetBlendModeService } from "../../DisplayObject/service/DisplayObjectGetBlendModeService"; 
import { $clamp } from "../../../../webgl/src/WebGLUtil";

/**
 * @description Videoの描画を実行します。
 *              Execute the drawing of Video.
 *
 * @param  {Float32Array} render_queue
 * @param  {number} index 
 * @param  {ImageBitmap[]} image_bitmaps 
 * @return {number}
 * @method
 * @protected
 */
export const execute = (
    render_queue: Float32Array,
    index: number,
    image_bitmaps: ImageBitmap[] | null
): number => {

    const matrix = render_queue.subarray(index, index + 6);
    index += 6;

    const colorTransform = render_queue.subarray(index, index + 8);
    index += 8;

    // baseBounds
    const xMin = render_queue[index++];
    const yMin = render_queue[index++];
    const xMax = render_queue[index++];
    const yMax = render_queue[index++];

    // cache uniqueKey
    const uniqueKey = `${render_queue[index++]}`; 
    const cacheKey  = "0";

    let xScale = Math.sqrt(
        matrix[0] * matrix[0]
        + matrix[1] * matrix[1]
    );
    if (!Number.isInteger(xScale)) {
        const value = xScale.toString();
        const index = value.indexOf("e");
        if (index !== -1) {
            xScale = +value.slice(0, index);
        }
        xScale = +xScale.toFixed(4);
    }

    let yScale = Math.sqrt(
        matrix[2] * matrix[2]
        + matrix[3] * matrix[3]
    );
    if (!Number.isInteger(yScale)) {
        const value = yScale.toString();
        const index = value.indexOf("e");
        if (index !== -1) {
            yScale = +value.slice(0, index);
        }
        yScale = +yScale.toFixed(4);
    }

    let node: Node;
    const hasCache = render_queue[index++];
    if (!hasCache) {

        const width  = Math.abs(xMax - xMin);
        const height = Math.abs(yMax - yMin);

        const hasNode = Boolean(render_queue[index++]);

        node = hasNode 
            ? $cacheStore.get(uniqueKey, `${cacheKey}`) as Node
            : $context.createNode(width, height);

        if (!hasNode) {
            $cacheStore.set(uniqueKey, `${cacheKey}`, node);
        }

        if (image_bitmaps && image_bitmaps.length) {

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

            const imageBitmap = image_bitmaps.shift() as ImageBitmap;
            $context.drawElement(node, imageBitmap);

            $context.endNodeRendering();

            if (currentAttachment) {
                $context.bind(currentAttachment);
            }

            imageBitmap.close();
        }
    } else {
        node = $cacheStore.get(uniqueKey, `${cacheKey}`) as Node;
        if (!node) {
            return index;
        }
    }

    const blendMode = render_queue[index++];

    $context.globalAlpha = $clamp(colorTransform[3] + colorTransform[7] / 255, 0, 1, 0);
    $context.imageSmoothingEnabled = true;
    $context.globalCompositeOperation = displayObjectGetBlendModeService(blendMode);

    const useFilfer = Boolean(render_queue[index++]);
    if (useFilfer) {

    }

    $context.setTransform(
        matrix[0], matrix[1], 
        matrix[2], matrix[3],
        matrix[4], matrix[5]
    );

    // 描画範囲をinstanced arrayに設定
    $context.drawDisplayObject(
        node,
        xMin, yMin, xMax, yMax,
        colorTransform
    );

    return index;
};