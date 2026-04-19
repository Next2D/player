import type { DisplayObject } from "../../DisplayObject";
import type { DisplayObjectContainer } from "../../DisplayObjectContainer";

/**
 * @description コンテナ内部の子孫が描画時に必要とする最大cacheAsBitmapスケールを返却します。
 *              親がfilter/cacheAsBitmap等のレイヤーを作成する際、そのテクスチャの解像度を
 *              子孫のcacheScaleに合わせて拡張しないと、描画時にテクスチャ不足で端が欠ける。
 *              戻り値は [scaleX, scaleY] の2要素で、いずれも1以上。
 *              Return the maximum cacheAsBitmap scale required by descendants.
 *              The parent layer texture must reserve this much resolution to avoid
 *              cropping descendants that render at cacheScale resolution.
 *
 * @param  {DisplayObjectContainer} display_object_container
 * @param  {Float32Array} out [scaleX, scaleY] を格納するバッファ
 * @return {void}
 * @method
 * @protected
 */
export const execute = <P extends DisplayObjectContainer>(
    display_object_container: P,
    out: Float32Array
): void => {
    const children = display_object_container.children;
    for (let idx = 0; idx < children.length; idx++) {

        const child = children[idx] as DisplayObject;
        if (!child || !child.visible) {
            continue;
        }

        if (child.isContainerEnabled) {
            const container = child as DisplayObjectContainer;
            const cache = container.cacheAsBitmap;
            if (cache) {
                const m = cache.rawData;
                const csx = Math.sqrt(m[0] * m[0] + m[1] * m[1]);
                const csy = Math.sqrt(m[2] * m[2] + m[3] * m[3]);
                if (csx > out[0]) {
                    out[0] = csx;
                }
                if (csy > out[1]) {
                    out[1] = csy;
                }
            }
            // 孫以下にも cacheAsBitmap がある可能性があるため再帰
            execute(container, out);
        }
    }
};
