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
    bounds.xMin = Math.min(node.x, bounds.xMin);
    bounds.yMin = Math.min(node.y, bounds.yMin);
    bounds.xMax = Math.max(node.x + node.w, bounds.xMax);
    bounds.yMax = Math.max(node.y + node.h, bounds.yMax);
};