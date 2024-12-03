import type { Node } from "@next2d/texture-packer";
import { $getActiveTransferBounds } from "../../AtlasManager";

/**
 * @description 転写範囲を更新します。
 *              Update the transfer range.
 *
 * @param  {Node} node
 * @return {void}
 * @method
 * @protected
 */
export const execute = (node: Node): void =>
{
    const bounds = $getActiveTransferBounds(node.index);
    bounds.xMin = Math.min(node.x, bounds.xMin);
    bounds.yMin = Math.min(node.y, bounds.yMin);
    bounds.xMax = Math.max(node.x + node.w, bounds.xMax);
    bounds.yMax = Math.max(node.y + node.h, bounds.yMax);
};