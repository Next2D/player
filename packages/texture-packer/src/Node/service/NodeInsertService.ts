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

    // 右と下に1pxのパディングを考慮した実際の必要サイズ
    const requiredWidth = width + 1;
    const requiredHeight = height + 1;

    if (requiredWidth > node.w || requiredHeight > node.h) {
        return null;
    }

    if (requiredWidth === node.w && requiredHeight === node.h) {
        node.used = true;
        // w, hは実寸で返す（パディングは座標計算のみに使用）
        node.w = width;
        node.h = height;
        return node;
    }

    const dw = node.w - requiredWidth;
    const dh = node.h - requiredHeight;

    if (dw > dh) {
        node.left  = node.create(node.index, node.x, node.y, requiredWidth, node.h);
        node.right = node.create(node.index, node.x + requiredWidth, node.y, dw, node.h);
    } else {
        node.left  = node.create(node.index, node.x, node.y, node.w, requiredHeight);
        node.right = node.create(node.index, node.x, node.y + requiredHeight, node.w, dh);
    }

    node.used = true;
    return node.left.insert(width, height);
};