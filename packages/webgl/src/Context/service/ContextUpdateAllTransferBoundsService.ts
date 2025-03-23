import type { Node } from "@next2d/texture-packer";
import { $getActiveAllTransferBounds } from "../../AtlasManager";

/**
 * @description 切り替え時の転写範囲を更新します。
 *              Update the transfer range when switching.
 *
 * @param  {Node} node
 * @return {void}
 * @method
 * @protected
 */
export const execute = (node: Node): void =>
{
    const bounds = $getActiveAllTransferBounds(node.index);
    const xMin = bounds[0];
    const yMin = bounds[1];
    const xMax = bounds[2];
    const yMax = bounds[3];

    bounds[0] = Math.min(node.x, xMin);
    bounds[1] = Math.min(node.y, yMin);
    bounds[2] = Math.max(node.x + node.w, xMax);
    bounds[3] = Math.max(node.y + node.h, yMax);
};