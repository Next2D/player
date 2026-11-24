import type { Node } from "../../Node";

/**
 * @description ノード挿入ロジック
 *              Node insertion logic
 *
 *              各ノードは、自分以下にある空き領域の「幅の最大値」「高さの最大値」「短い辺の最大値」を持つ。
 *              入れたい大きさがそのどれかを超える枝には、入る空き領域が無いので、たどらずに戻る。
 *              置く場所は、枝を飛ばさずにたどった場合と同じになる (飛ばすのは、入らないと分かっている枝だけ)。
 *              これを省くと、細い切れ端が増えたアトラスでは、確保 1 回ごとに木の大半をたどることになる。
 *
 *              Every node keeps the largest width, the largest height and the largest shorter side
 *              among the free regions at or below it. A branch where the requested size exceeds any
 *              of them cannot hold it and is skipped. The chosen place is the same as when no branch
 *              is skipped (only branches known not to fit are skipped). Without this, an atlas with
 *              many thin leftovers makes every allocation walk most of the tree.
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
    // この枝の空き領域には入らない
    if (width > node.freeW
        || height > node.freeH
        || (width < height ? width : height) > node.freeSide
    ) {
        return null;
    }

    if (node.used) {

        const left  = node.left;
        const right = node.right;

        let newNode: Node | null = null;
        if (left) {
            newNode = execute(left, width, height);
        }
        if (!newNode && right) {
            newNode = execute(right, width, height);
        }

        if (newNode) {
            // 空き領域が減ったので、この枝の最大値を子から求め直す
            const leftW     = left  ? left.freeW     : 0;
            const rightW    = right ? right.freeW    : 0;
            const leftH     = left  ? left.freeH     : 0;
            const rightH    = right ? right.freeH    : 0;
            const leftSide  = left  ? left.freeSide  : 0;
            const rightSide = right ? right.freeSide : 0;
            node.freeW    = leftW    > rightW    ? leftW    : rightW;
            node.freeH    = leftH    > rightH    ? leftH    : rightH;
            node.freeSide = leftSide > rightSide ? leftSide : rightSide;
        }

        return newNode;
    }

    if (width === node.w && height === node.h) {
        node.used     = true;
        node.freeW    = 0;
        node.freeH    = 0;
        node.freeSide = 0;
        return node;
    }

    const requiredWidth  = width  + 1;
    const requiredHeight = height + 1;

    const dw = node.w - requiredWidth;
    const dh = node.h - requiredHeight;

    if (dw > dh) {
        node.left  = node.create(node.index, node.x, node.y, width, node.h);
        node.right = node.create(node.index, node.x + requiredWidth, node.y, dw, node.h);
    } else {
        node.left  = node.create(node.index, node.x, node.y, node.w, height);
        node.right = node.create(node.index, node.x, node.y + requiredHeight, node.w, dh);
    }

    node.used = true;

    const left    = node.left;
    const right   = node.right;
    const newNode = execute(left, width, height);

    node.freeW    = left.freeW    > right.freeW    ? left.freeW    : right.freeW;
    node.freeH    = left.freeH    > right.freeH    ? left.freeH    : right.freeH;
    node.freeSide = left.freeSide > right.freeSide ? left.freeSide : right.freeSide;

    return newNode;
};
