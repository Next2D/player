import type { Node } from "../../Node";

/**
 * @description ノード以下にある空き領域の最大値 (幅・高さ・短い辺) を、いまの状態から求め直す。
 *              未使用のノードは全体が空き領域、使用中のノードは子の最大値 (子が無ければ空きなし)。
 *              NodeInsertService が、入らない枝をたどらないために使う。
 *
 *              Recompute the largest width, height and shorter side among the free regions at or
 *              below the node. An unused node is free as a whole; a used node takes the larger of
 *              its children (nothing free without children). NodeInsertService uses these to skip
 *              branches that cannot hold the requested size.
 *
 * @param  {Node} node
 * @return {void}
 * @method
 * @private
 */
const $updateFree = (node: Node): void =>
{
    if (!node.used) {
        node.freeW    = node.w;
        node.freeH    = node.h;
        node.freeSide = node.w < node.h ? node.w : node.h;
        return ;
    }

    const left  = node.left;
    const right = node.right;

    const leftW     = left  ? left.freeW     : 0;
    const rightW    = right ? right.freeW    : 0;
    const leftH     = left  ? left.freeH     : 0;
    const rightH    = right ? right.freeH    : 0;
    const leftSide  = left  ? left.freeSide  : 0;
    const rightSide = right ? right.freeSide : 0;

    node.freeW    = leftW    > rightW    ? leftW    : rightW;
    node.freeH    = leftH    > rightH    ? leftH    : rightH;
    node.freeSide = leftSide > rightSide ? leftSide : rightSide;
};

/**
 * @description ノード解放ロジック
 *              Node release logic
 *
 *              子ノードは必ず親ノードの矩形の中にある (NodeInsertService が親の矩形を 2 つに分ける) ので、
 *              解放する矩形を含まない枝には、一致するノードは無い。その枝はたどらずに戻る。
 *              これを省くと、解放 1 回ごとに木の全ノードをたどることになり、画面の切り替えで多数の
 *              キャッシュをまとめて解放するときに、ノード数 × 解放数の時間がかかる。
 *
 *              Child nodes always lie inside their parent's rectangle (NodeInsertService splits the
 *              parent's rectangle in two), so a branch that does not contain the rectangle being
 *              released cannot hold a matching node and is skipped. Without this, every release walks
 *              the whole tree, which costs nodes x releases when many caches are released at once.
 *
 * @param  {Node} node
 * @param  {number} x
 * @param  {number} y
 * @param  {number} width
 * @param  {number} height
 * @return {boolean}
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

    // このノードの矩形に含まれない矩形は、このノードにも子孫にも無い
    if (x < node.x
        || y < node.y
        || x + width > node.x + node.w
        || y + height > node.y + node.h
    ) {
        return false;
    }

    const left  = node.left;
    const right = node.right;

    if (left && execute(left, x, y, width, height)) {
        if (!left.used && !(right && right.used)) {
            // 子ノードをプールに返却
            left.release();
            if (right) {
                right.release();
            }
            node.left = node.right = null;
            node.used = false;
        }
        $updateFree(node);
        return true;
    }

    if (right && execute(right, x, y, width, height)) {
        if (!right.used && !(left && left.used)) {
            // 子ノードをプールに返却
            if (left) {
                left.release();
            }
            right.release();
            node.left = node.right = null;
            node.used = false;
        }
        $updateFree(node);
        return true;
    }

    if (x === node.x
        && y === node.y
        && width === node.w
        && height === node.h
    ) {
        node.used = false;
        $updateFree(node);
        return true;
    }

    return false;
};
