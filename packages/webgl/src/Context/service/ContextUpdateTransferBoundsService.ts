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
    const xMin = bounds[0];
    const yMin = bounds[1];
    const xMax = bounds[2];
    const yMax = bounds[3];

    bounds[0] = Math.min(node.x, xMin);
    bounds[1] = Math.min(node.y, yMin);
    bounds[2] = Math.max(node.x + node.w, xMax);
    bounds[3] = Math.max(node.y + node.h, yMax);
};