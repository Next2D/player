import type { Node } from "@next2d/texture-packer";
import { $cacheStore } from "@next2d/cache";
import { execute as frameBufferManagerGetTextureFromNodeUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerGetTextureFromNodeUseCase";

/**
 * @description フィルターを適用します。
 *              Apply the filter.
 *
 * @param  {Node} node
 * @param  {string} unique_key
 * @param  {number} width
 * @param  {number} height
 * @param  {Float32Array} matrix
 * @param  {Float32Array} params
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    node: Node,
    unique_key: string,
    width: number,
    height: number,
    matrix: Float32Array,
    params: Float32Array
): void => {

    const key = $cacheStore.generateFilterKeys(
        matrix[0], matrix[1], matrix[2], matrix[3]
    );

    if ($cacheStore.has(unique_key, "fKey")) {
        const fKey = $cacheStore.get(unique_key, "fKey");
        const texture = $cacheStore.get(unique_key, "fTexture");
        if (fKey === key) {
            // todo
            return ;
        }

        if (texture) {
            // todo
        }
    }

    const textureObject = frameBufferManagerGetTextureFromNodeUseCase(node);
    console.log(width, height, textureObject);

    $cacheStore.set(unique_key, "fKey", key);

    // todo
    // $cacheStore.set(unique_key, "fTexture", texture);

    console.log(node, unique_key, matrix, params);
};