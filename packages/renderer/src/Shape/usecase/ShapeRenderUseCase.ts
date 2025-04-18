import type { Node } from "@next2d/texture-packer";
import { $cacheStore } from "@next2d/cache";
import { execute as shapeCommandService } from "../service/ShapeCommandService";
import { execute as displayObjectGetBlendModeService } from "../../DisplayObject/service/DisplayObjectGetBlendModeService";
import { $context } from "../../RendererUtil";

/**
 * @description Shapeの描画を実行します。
 *              Execute the drawing of Shape.
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

    const isGridEnabled = Boolean(render_queue[index++]);
    const isDrawable    = Boolean(render_queue[index++]);
    const isBitmap      = Boolean(render_queue[index++]);

    // cache uniqueKey
    const uniqueKey = `${render_queue[index++]}`;
    const cacheKey  = render_queue[index++];

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

        const gridData = isGridEnabled
            ? new Float32Array(28)
            : null;

        if (gridData) {
            gridData.set(render_queue.subarray(index, index + 24));
            index += 24;
        }

        $context.useGrid(gridData);

        const length = render_queue[index++];
        const commands = render_queue.subarray(index, index + length);

        if (isBitmap && !isGridEnabled) {

            // Bitmapなので、スケールなし
            const width  = Math.ceil(Math.abs(xMax - xMin));
            const height = Math.ceil(Math.abs(yMax - yMin));

            // fixed logic
            node = $context.createNode(width, height);
            $cacheStore.set(uniqueKey, `${cacheKey}`, node);

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

            if (isDrawable) {
                shapeCommandService(commands);
                $context.drawFill();
            } else {
                $context.drawPixels(node, new Uint8Array(commands));
            }

            $context.endNodeRendering();

            if (currentAttachment) {
                $context.bind(currentAttachment);
            }

        } else {

            const width  = Math.ceil(Math.abs(xMax - xMin) * xScale);
            const height = Math.ceil(Math.abs(yMax - yMin) * yScale);

            // fixed logic
            node = $context.createNode(width, height);
            $cacheStore.set(uniqueKey, `${cacheKey}`, node);

            // fixed logic
            const currentAttachment = $context.currentAttachmentObject;
            $context.bind($context.atlasAttachmentObject);

            // 初期化して、描画範囲を初期化
            $context.reset();
            $context.beginNodeRendering(node);

            // matrix設定
            const offsetY = $context.atlasAttachmentObject.height - node.y - height;
            $context.setTransform(
                xScale, 0, 0, yScale,
                -xMin * xScale + node.x,
                -yMin * yScale + offsetY
            );

            if (gridData) {
                gridData[24] = node.x;
                gridData[25] = offsetY;
            }

            // 描画コマンドを実行
            shapeCommandService(commands);

            // 描画実行
            $context.drawFill();

            // 描画終了
            $context.endNodeRendering();

            if (currentAttachment) {
                $context.bind(currentAttachment);
            }
        }

        index += length;

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
            node, uniqueKey, updated,
            width, height, isBitmap,
            matrix, colorTransform, displayObjectGetBlendModeService(blendMode),
            filterBounds, params
        );

        index += length;

        return index;
    }

    $context.globalAlpha = Math.min(Math.max(0, colorTransform[3] + colorTransform[7] / 255), 1);
    $context.imageSmoothingEnabled = true;
    $context.globalCompositeOperation = displayObjectGetBlendModeService(blendMode);

    if (isBitmap && !isGridEnabled) {
        $context.setTransform(
            matrix[0], matrix[1],
            matrix[2], matrix[3],
            matrix[4], matrix[5]
        );

        $context.drawDisplayObject(
            node,
            bounds[0], bounds[1], bounds[2], bounds[3],
            colorTransform
        );
    } else {

        const radianX = Math.atan2(matrix[1], matrix[0]);
        const radianY = Math.atan2(-matrix[2], matrix[3]);
        if (radianX || radianY) {

            const tx = xMin * Math.sqrt(
                matrix[0] * matrix[0]
                + matrix[1] * matrix[1]
            );
            const ty = yMin * Math.sqrt(
                matrix[2] * matrix[2]
                + matrix[3] * matrix[3]
            );

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

    }

    return index;
};