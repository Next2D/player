import type { Node } from "../../Node";

/**
 * @description ノード挿入ロジック
 *              Node insertion logic
 *
 * @param  {Node} node
 * @param  {number} width
 * @param  {number} height
 * @return {Node | null}
 * @method
 * @protected
 */
export const execute = (node: Node, width: number, height: number): Node | null =>
{
    if (node.used) {
        const newNode = node.left?.insert(width, height);
        return newNode ? newNode : node.right?.insert(width, height) || null;
    }

    if (width > node.w || height > node.h) {
        return null;
    }

    if (width === node.w && height === node.h) {
        node.used = true;
        return node;
    }

    const dw = node.w - width;
    const dh = node.h - height;

    if (dw > dh) {
        node.left  = node.create(node.index, node.x, node.y, width, height);
        node.right = node.create(node.index, node.x + width + 1, node.y, dw - 1, node.h);
    } else {
        node.left  = node.create(node.index, node.x, node.y, node.w, height);
        node.right = node.create(node.index, node.x, node.y + height + 1, node.w, dh - 1);
    }

    node.used = true;
    return node.left.insert(width, height);
};