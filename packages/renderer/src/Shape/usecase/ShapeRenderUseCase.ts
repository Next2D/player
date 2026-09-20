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
    // フィルター以外はスカラーで読むことでShape毎の一時ビュー生成を避ける。
    // Only filters need a matrix view; ordinary drawing reads scalar values.
    const matrixIndex = index;
    const a = render_queue[index++];
    const b = render_queue[index++];
    const c = render_queue[index++];
    const d = render_queue[index++];
    const e = render_queue[index++];
    const f = render_queue[index++];

    const colorTransformIndex = index;
    index += 8;

    const boundsXMin = render_queue[index++];
    const boundsYMin = render_queue[index++];
    const boundsXMax = render_queue[index++];
    const boundsYMax = render_queue[index++];

    // baseBounds
    const xMin = render_queue[index++];
    const yMin = render_queue[index++];
    const xMax = render_queue[index++];
    const yMax = render_queue[index++];

    const isGridEnabled = Boolean(render_queue[index++]);
    const isDrawable    = Boolean(render_queue[index++]);
    const renderMode    = render_queue[index++]; // 0=vector, 1=bitmap, 2=cacheAsBitmap
    const isBitmap      = renderMode === 1;
    const isCacheAsBitmap = renderMode === 2;

    // cache uniqueKey
    const uniqueKey = `${render_queue[index++]}`;
    const cacheKey  = `${render_queue[index++]}`;

    const xScale = render_queue[index++];
    const yScale = render_queue[index++];

    // フィルターキャッシュ用のユニークキー（instanceId）
    // 文字列化はフィルター使用時のみ行う
    const filterKeyNumber = render_queue[index++];

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

        // ビットマップのピクセルは4バイト/floatでパックされている
        // (ShapeGenerateRenderQueueUseCase参照)。lengthはバイト数。
        // 条件はwriter側の分岐(!(isDrawable || isGridEnabled))と完全一致させる
        const isPackedPixels = !isDrawable && !isGridEnabled;
        const commands = isPackedPixels
            ? null
            : render_queue.subarray(index, index + length);

        if (isBitmap && !isGridEnabled) {

            // Bitmapなので、スケールなし
            const width  = Math.ceil(Math.abs(xMax - xMin));
            const height = Math.ceil(Math.abs(yMax - yMin));

            // ShapeClearBitmapBufferUseCase 等で Main 側のみ wipe された場合、
            // Worker には旧 Node が残っているため、新規作成前に解放してアトラスリーク防止
            const oldBitmapNode = $cacheStore.get(uniqueKey, cacheKey) as Node | null;
            if (oldBitmapNode) {
                $context.removeNode(oldBitmapNode);
            }
            node = $context.createNode(width, height);
            $cacheStore.set(uniqueKey, cacheKey, node);

            // fixed logic
            const currentAttachment = $context.currentAttachmentObject;
            const atlasAttachment   = $context.atlasAttachmentObject;
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

            if (isDrawable) {
                shapeCommandService(commands as Float32Array);
                $context.drawFill();
            } else {
                // パックされたバイト列をビューで復元(GLアップロードは同期のためコピー不要)
                $context.drawPixels(node, new Uint8Array(
                    render_queue.buffer,
                    render_queue.byteOffset + index * 4,
                    length
                ));
            }

            $context.endNodeRendering();

            if (currentAttachment) {
                $context.bind(currentAttachment as any);
            }

        } else {

            const width  = Math.ceil(Math.abs(xMax - xMin) * xScale);
            const height = Math.ceil(Math.abs(yMax - yMin) * yScale);

            // ShapeClearBitmapBufferUseCase 等で Main 側のみ wipe された場合、
            // Worker には旧 Node が残っているため、新規作成前に解放してアトラスリーク防止
            const oldNode = $cacheStore.get(uniqueKey, cacheKey) as Node | null;
            if (oldNode) {
                $context.removeNode(oldNode);
            }
            node = $context.createNode(width, height);
            $cacheStore.set(uniqueKey, cacheKey, node);

            // fixed logic
            const currentAttachment = $context.currentAttachmentObject;
            const atlasAttachment = $context.atlasAttachmentObject;
            if (atlasAttachment) {
                $context.bind(atlasAttachment as any);
            }

            // 初期化して、描画範囲を初期化
            $context.reset();
            $context.beginNodeRendering(node);

            // matrix設定
            const offsetY = atlasAttachment ? atlasAttachment.height - node.y - height : 0;
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
            shapeCommandService(commands as Float32Array);

            // 描画実行
            $context.drawFill();

            // 描画終了
            $context.endNodeRendering();

            if (currentAttachment) {
                $context.bind(currentAttachment as any);
            }
        }

        index += isPackedPixels ? Math.ceil(length / 4) : length;

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

        const width  = Math.ceil(Math.abs(boundsXMax - boundsXMin));
        const height = Math.ceil(Math.abs(boundsYMax - boundsYMin));
        const matrix = render_queue.subarray(matrixIndex, matrixIndex + 6);
        const colorTransform = render_queue.subarray(colorTransformIndex, colorTransformIndex + 8);

        $context.applyFilter(
            node, `${filterKeyNumber}`, updated,
            width, height, isBitmap,
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

    if (isBitmap && !isGridEnabled) {
        $context.setTransform(
            a, b, c, d, e, f
        );

        $context.drawDisplayObject(
            node,
            boundsXMin, boundsYMin, boundsXMax, boundsYMax,
            render_queue, colorTransformIndex
        );
    } else if (isCacheAsBitmap) {

        // cacheAsBitmap: Bitmapと同様の描画パスで、cacheScaleを補正
        // baseBounds原点(xMin,yMin)のスクリーン座標をtranslationに反映
        const screenX = a * xMin + c * yMin + e;
        const screenY = b * xMin + d * yMin + f;

        $context.setTransform(
            a / xScale, b / xScale,
            c / yScale, d / yScale,
            screenX, screenY
        );

        $context.drawDisplayObject(
            node,
            boundsXMin, boundsYMin, boundsXMax, boundsYMax,
            render_queue, colorTransformIndex
        );
    } else {

        const radianX = Math.atan2(b, a);
        const radianY = Math.atan2(-c, d);
        if (radianX || radianY) {

            const tx = xMin * xScale;
            const ty = yMin * yScale;

            const cosX = Math.cos(radianX);
            const sinX = Math.sin(radianX);
            // 両軸の角度が完全一致する場合だけ再利用し、せん断や符号付きゼロを保つ。
            const sameAngle = Object.is(radianX, radianY);
            const cosY = sameAngle ? cosX : Math.cos(radianY);
            const sinY = sameAngle ? sinX : Math.sin(radianY);

            $context.setTransform(
                cosX, sinX, -sinY, cosY,
                tx * cosX - ty * sinY + e,
                tx * sinX + ty * cosY + f
            );

        } else {

            $context.setTransform(1, 0, 0, 1,
                boundsXMin, boundsYMin
            );

        }

        // 描画範囲をinstanced arrayに設定
        $context.drawDisplayObject(
            node,
            boundsXMin, boundsYMin, boundsXMax, boundsYMax,
            render_queue, colorTransformIndex
        );

    }

    return index;
};
