import { $context } from "../../RendererUtil";
import { $cacheStore } from "@next2d/cache";
import type { Node } from "@next2d/texture-packer";
import { execute as shapeRenderUseCase } from "../../Shape/usecase/ShapeRenderUseCase";
import { execute as shapeClipRenderUseCase } from "../../Shape/usecase/ShapeClipRenderUseCase";
import { execute as textFieldRenderUseCase } from "../../TextField/usecase/TextFieldRenderUseCase";
import { execute as videoRenderUseCase } from "../../Video/usecase/VideoRenderUseCase";
import { execute as displayObjectContainerClipRenderUseCase } from "./DisplayObjectContainerClipRenderUseCase";
import { execute as displayObjectGetBlendModeService } from "../../DisplayObject/service/DisplayObjectGetBlendModeService";

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

    let endClipDepth = 0;
    let canRenderMask = true;

    // use layer
    const blendMode = displayObjectGetBlendModeService(render_queue[index++]);
    const useLayer  = Boolean(render_queue[index++]);

    // layer size
    let layerWidth  = 0;
    let layerHeight = 0;

    let useFilter = false;
    let useCacheAsBitmap = false;
    let uniqueKey = "";
    let filterKey = "";
    let cacheRenderScaleX = 1;
    let cacheRenderScaleY = 1;
    let filterBounds: Float32Array | null = null;
    let filterParams: Float32Array | null = null;
    let matrix: Float32Array | null = null;
    let colorTransform: Float32Array | null = null;
    if (useLayer) {

        layerWidth  = render_queue[index++];
        layerHeight = render_queue[index++];

        const layerType = render_queue[index++]; // 0=blend, 1=filter, 2=cacheAsBitmap
        useFilter = layerType === 1;
        useCacheAsBitmap = layerType === 2;

        if (useCacheAsBitmap) {

            // cacheAsBitmapパス
            const cacheHit = Boolean(render_queue[index++]);
            uniqueKey = `${render_queue[index++]}`;
            filterKey = `${render_queue[index++]}`;

            // フィルター境界を読み取り
            filterBounds = render_queue.subarray(index, index + 4);
            index += 4;

            // renderScale（キャッシュ描画時のスケール）
            cacheRenderScaleX = render_queue[index++];
            cacheRenderScaleY = render_queue[index++];

            // 親matrix + スクリーン座標 (a, b, c, d, screenX, screenY)
            matrix = render_queue.subarray(index, index + 6);
            index += 6;

            colorTransform = render_queue.subarray(index, index + 8);
            index += 8;

            if (cacheHit) {
                // キャッシュ済み: Shapeと同様にmatrix/renderScaleで描画
                const cachedNode = $cacheStore.get(uniqueKey, "bNode") as Node;
                if (cachedNode) {
                    $context.globalAlpha = Math.min(Math.max(0, colorTransform[3] + colorTransform[7] / 255), 1);
                    $context.globalCompositeOperation = blendMode;
                    $context.setTransform(
                        matrix[0] / cacheRenderScaleX, matrix[1] / cacheRenderScaleX,
                        matrix[2] / cacheRenderScaleY, matrix[3] / cacheRenderScaleY,
                        matrix[4], matrix[5]
                    );
                    $context.drawDisplayObject(
                        cachedNode,
                        filterBounds[0], filterBounds[1],
                        filterBounds[2], filterBounds[3],
                        colorTransform
                    );
                }
                return index;
            }

            // 初回描画: フィルターパラメータをスキップ（アトラスパスでは不使用）
            index += render_queue[index] + 1;

            // containerBeginLayer → 子要素描画 → containerEndLayerでキャッシュ

        } else if (useFilter) {
            // フィルターパス: filterCache/uniqueKey/filterKey を読む
            const filterCache = Boolean(render_queue[index++]);
            uniqueKey = `${render_queue[index++]}`;
            filterKey = `${render_queue[index++]}`;
            if (filterCache) {
                filterBounds = render_queue.subarray(index, index + 4);
                index += 4;

                matrix = render_queue.subarray(index, index + 6);
                index += 6;

                colorTransform = render_queue.subarray(index, index + 8);
                index += 8;

                // キャッシュされたフィルターテクスチャを描画
                $context.containerDrawCachedFilter(
                    blendMode, matrix, colorTransform,
                    filterBounds, uniqueKey, filterKey
                );
                return index;
            }

            filterBounds = render_queue.subarray(index, index + 4);
            index += 4;

            matrix = render_queue.subarray(index, index + 6);
            index += 6;

            colorTransform = render_queue.subarray(index, index + 8);
            index += 8;

            const length = render_queue[index++];
            filterParams = render_queue.subarray(index, index + length);
            index += length;

        } else {
            // ブレンドのみパス: matrix + colorTransform
            matrix = render_queue.subarray(index, index + 6);
            index += 6;

            colorTransform = render_queue.subarray(index, index + 8);
            index += 8;
        }
    }

    // コンテナのフィルター/ブレンド用にレイヤーを開始
    let cacheNode: Node | null = null;
    if (useCacheAsBitmap) {
        // cacheAsBitmap: アトラスに直接描画（temp FBO不要）
        cacheNode = $context.containerBeginAtlasNode(layerWidth, layerHeight);
    } else if (useLayer) {
        $context.containerBeginLayer(layerWidth, layerHeight);
    }

    const useMaskDisplayObject = Boolean(render_queue[index++]);
    if (useMaskDisplayObject) {

        // これまでの描画データを描画して初期化
        $context.drawArraysInstanced();

        // 設定値を保存
        $context.save();

        // マスク描画の開始準備
        $context.beginMask();

        // マスクの範囲を設定
        $context.setMaskBounds(
            render_queue[index++],
            render_queue[index++],
            render_queue[index++],
            render_queue[index++]
        );

        const type = render_queue[index++];
        switch (type) {

            case 0x00: // container
                index = displayObjectContainerClipRenderUseCase(render_queue, index);
                break;

            case 0x01: // shape
                index = shapeClipRenderUseCase(render_queue, index);
                break;

            default:
                break;

        }
        $context.endMask();
    }

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

            // マスクの範囲を設定
            $context.setMaskBounds(
                render_queue[index++],
                render_queue[index++],
                render_queue[index++],
                render_queue[index++]
            );

            const type = render_queue[index++];
            switch (type) {

                case 0x00: // container
                    index = displayObjectContainerClipRenderUseCase(render_queue, index);
                    break;

                case 0x01: // shape
                    index = shapeClipRenderUseCase(render_queue, index);
                    break;

                // text, videoはマスク対象外
                default:
                    break;

            }

            $context.endMask();
            continue;
        }

        // hidden
        const hidden = render_queue[index++];
        if (!hidden) {
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
                break;

        }
    }

    // end mask
    if (endClipDepth || useMaskDisplayObject) {
        $context.restore();
        $context.leaveMask();
    }

    // コンテナのフィルター/ブレンド結果をメインに合成
    if (cacheNode) {
        // cacheAsBitmap: アトラス描画終了→キャッシュ→インスタンス描画
        $context.containerEndAtlasNode();

        // 古いノードを解放
        const oldNode = $cacheStore.get(uniqueKey, "bNode") as Node;
        if (oldNode) {
            $context.removeNode(oldNode);
        }
        $cacheStore.set(uniqueKey, "bNode", cacheNode);
        $cacheStore.set(uniqueKey, "bKey", filterKey);

        // アトラスからインスタンス描画（Shapeと同様にmatrix/renderScaleで描画）
        $context.globalAlpha = Math.min(Math.max(0, colorTransform![3] + colorTransform![7] / 255), 1);
        $context.globalCompositeOperation = blendMode;
        $context.setTransform(
            matrix![0] / cacheRenderScaleX, matrix![1] / cacheRenderScaleX,
            matrix![2] / cacheRenderScaleY, matrix![3] / cacheRenderScaleY,
            matrix![4], matrix![5]
        );
        $context.drawDisplayObject(
            cacheNode,
            filterBounds![0], filterBounds![1],
            filterBounds![2], filterBounds![3],
            colorTransform!
        );
    } else if (useLayer) {
        $context.containerEndLayer(
            blendMode, matrix!, colorTransform,
            useFilter, filterBounds, filterParams,
            uniqueKey, filterKey
        );
    }

    return index;
};
