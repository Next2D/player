import type { Node } from "@next2d/texture-packer";
import { $rootNodes } from "../../AtlasManager";
import { $RENDER_MAX_SIZE } from "../../WebGLUtil";
import { TexturePacker } from "@next2d/texture-packer";
import {
    $getActiveAtlasIndex,
    $setActiveAtlasIndex
} from "../../AtlasManager";

/**
 * @description 指定サイズのキャッシュ座標を生成、二分木構造を利用して座標を取得します。
 *              Generate cache coordinates of the specified size and get the coordinates using a binary tree structure.
 *
 * @param  {number} width
 * @param  {number} height
 * @return {Node}
 * @method
 * @protected
 */
export const execute = (width: number, height: number): Node =>
{
    const index = $getActiveAtlasIndex();
    if (!$rootNodes[index]) {
        $rootNodes[index] = new TexturePacker(index, $RENDER_MAX_SIZE, $RENDER_MAX_SIZE);
    }

    const rootNode = $rootNodes[index] as NonNullable<TexturePacker>;
    const node = rootNode.insert(width, height);
    if (node) {
        return node;
    }

    for (let idx = 0; idx < 10; idx++) {
        if (index === idx) {
            continue;
        }

        $setActiveAtlasIndex(idx);
        const rootNode = $rootNodes[idx] as NonNullable<TexturePacker>;
        if (!rootNode) {
            return execute(width, height);
        }

        const node = rootNode.insert(width, height);
        if (!node) {
            continue;
        }

        return node;
    }

    return execute(width, height);
};