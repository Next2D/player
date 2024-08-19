import type { INode } from "../../interface/INode";
import { $cacheStore } from "@next2d/cache";
import { execute as shapeCommandService } from "../service/ShapeCommandService"; 
import { $context, $poolArray } from "../../RendererUtil"; 
import { execute as displayObjectCalcBoundsMatrixService } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService"; 

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

    const hasGrid = render_queue[index++];

    // baseBounds
    const xMin = render_queue[index++];
    const yMin = render_queue[index++];
    const xMax = render_queue[index++];
    const yMax = render_queue[index++];

    // cache uniqueKey
    const uniqueKey = render_queue[index++] === 2 
        ? `${render_queue[index++]}@${render_queue[index++]}`
        : `${render_queue[index++]}`;

    const cacheKey = render_queue[index++];
    const hasCache = render_queue[index++];

    // calc bounds
    const bounds = displayObjectCalcBoundsMatrixService(
        xMin, yMin, xMax, yMax, matrix
    );

    let xScale: number = Math.sqrt(
        matrix[0] * matrix[0]
        + matrix[1] * matrix[1]
    );
    if (!Number.isInteger(xScale)) {
        const value: string = xScale.toString();
        const index: number = value.indexOf("e");
        if (index !== -1) {
            xScale = +value.slice(0, index);
        }
        xScale = +xScale.toFixed(4);
    }

    let yScale: number = Math.sqrt(
        matrix[2] * matrix[2]
        + matrix[3] * matrix[3]
    );
    if (!Number.isInteger(yScale)) {
        const value: string = yScale.toString();
        const index: number = value.indexOf("e");
        if (index !== -1) {
            yScale = +value.slice(0, index);
        }
        yScale = +yScale.toFixed(4);
    }

    let node: INode;
    if (!hasCache) {

        const currentAttachment = $context.currentAttachmentObject;
        $context.bind($context.atlasAttachmentObject);

        const width: number  = Math.ceil(Math.abs(xMax - xMin) * xScale);
        const height: number = Math.ceil(Math.abs(yMax - yMin) * yScale);

        node = $context.createNode(width, height);
        console.log("node", node);

        // 初期化して、描画範囲とmatrix設定
        $context.reset();
        $context.beginNode(node);
        $context.setTransform(
            xScale, 0, 0, yScale,
            -xMin * xScale,
            -yMin * yScale
        );

        // 描画コマンドを実行
        const length = render_queue[index++];
        const commands = render_queue.subarray(index, index + length);
        shapeCommandService(commands, Boolean(hasGrid));

        if (currentAttachment) {
            $context.bind(currentAttachment);
        }
        
        index += length;
        
    } else {
        node = $cacheStore.get(uniqueKey, `${cacheKey}`) as INode;
        if (!node) {
            return index;
        }
    }

    const radianX: number = Math.atan2(matrix[1], matrix[0]);
    const radianY: number = Math.atan2(-matrix[2], matrix[3]);
    if (radianX || radianY) {

        const tx: number = xMin * xScale;
        const ty: number = yMin * yScale;

        const cosX: number = Math.cos(radianX);
        const sinX: number = Math.sin(radianX);
        const cosY: number = Math.cos(radianY);
        const sinY: number = Math.sin(radianY);

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

    // todo
    $context.globalAlpha = 1;
    $context.imageSmoothingEnabled = true;
    $context.globalCompositeOperation = "normal";

    // 描画範囲をinstanced arrayに設定
    $context.drawInstance(
        node,
        bounds[0], bounds[1], bounds[2], bounds[3],
        colorTransform
    );

    $poolArray(bounds);

    return index;
};