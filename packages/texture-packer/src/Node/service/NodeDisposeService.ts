import type { Node } from "../../Node";

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
