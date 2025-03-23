import { Node } from "../../Node";

/**
 * @description ノード解放ロジック
 *              Node release logic
 *
 * @param  {Node} node
 * @param  {number} x
 * @param  {number} y
 * @param  {number} width
 * @param  {number} height
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    node: Node,
    x: number,
    y: number,
    width: number,
    height: number
): boolean => {

    if (node.left?.dispose(x, y, width, height)) {
        if (!node.left.used && !node.right?.used) {
            node.left = node.right = null;
            node.used = false;
        }
        return true;
    }

    if (node.right?.dispose(x, y, width, height)) {
        if (!node.right.used && !node.left?.used) {
            node.left = node.right = null;
            node.used = false;
        }
        return true;
    }

    if (x === node.x
        && y === node.y
        && width === node.w
        && height === node.h
    ) {
        node.used = false;
        return true;
    }

    return false;
};