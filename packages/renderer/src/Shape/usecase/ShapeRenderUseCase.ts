import type { Node } from "@next2d/texture-packer";
import { $cacheStore } from "@next2d/cache";
import { execute as shapeCommandService } from "../service/ShapeCommandService"; 
import { execute as displayObjectCalcBoundsMatrixService } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService"; 
import { $clamp } from "../../../../webgl/src/WebGLUtil";
import {
    $context,
    $poolArray
} from "../../RendererUtil";

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

    // baseBounds
    const xMin = render_queue[index++];
    const yMin = render_queue[index++];
    const xMax = render_queue[index++];
    const yMax = render_queue[index++];

    const hasGrid    = render_queue[index++];
    const isDrawable = Boolean(render_queue[index++]);
    const isBitmap   = Boolean(render_queue[index++]);

    // cache uniqueKey
    const uniqueKey = `${render_queue[index++]}`; 
    const cacheKey  = render_queue[index++];

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
        
        const length = render_queue[index++];
        const commands = render_queue.subarray(index, index + length);

        if (isBitmap) {

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
            $context.setTransform(1, 0, 0, 1, 0, 0);

            if (isDrawable) {
                console.log("koko");
                shapeCommandService(commands, Boolean(hasGrid));
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

            // 初期化して、描画範囲とmatrix設定
            $context.reset();
            $context.beginNodeRendering(node);
            $context.setTransform(
                xScale, 0, 0, yScale,
                -xMin * xScale,
                -yMin * yScale
            );

            shapeCommandService(commands, Boolean(hasGrid));

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

    // todo
    $context.globalAlpha = $clamp(colorTransform[3] + colorTransform[7] / 255, 0, 1, 0);
    $context.imageSmoothingEnabled = true;
    $context.globalCompositeOperation = "normal";

    if (isBitmap) {
        $context.setTransform(
            matrix[0], matrix[1], 
            matrix[2], matrix[3],
            matrix[4], matrix[5]
        );

        $context.drawDisplayObject(
            node,
            xMin, yMin, xMax, yMax,
            colorTransform
        );
    } else {

        // calc bounds
        const bounds = displayObjectCalcBoundsMatrixService(
            xMin, yMin, xMax, yMax, matrix
        );

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

        $poolArray(bounds);

    }

    return index;
};