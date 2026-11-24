import { Node } from "../../Node";
import { execute } from "./NodeDisposeService";
import { describe, expect, it } from "vitest";

// 枝を飛ばさずに木の全体をたどる、以前の解放ロジック (照合用)
const disposeAll = (node: Node, x: number, y: number, width: number, height: number): boolean =>
{
    if (node.left && disposeAll(node.left, x, y, width, height)) {
        if (!node.left.used && !node.right?.used) {
            node.left.release();
            if (node.right) {
                node.right.release();
            }
            node.left = node.right = null;
            node.used = false;
        }
        return true;
    }

    if (node.right && disposeAll(node.right, x, y, width, height)) {
        if (!node.right.used && !node.left?.used) {
            if (node.left) {
                node.left.release();
            }
            node.right.release();
            node.left = node.right = null;
            node.used = false;
        }
        return true;
    }

    if (x === node.x && y === node.y && width === node.w && height === node.h) {
        node.used = false;
        return true;
    }

    return false;
};

// 入らない枝を飛ばさない、以前の確保ロジック (照合用)
const insertAll = (node: Node, width: number, height: number): Node | null =>
{
    if (node.used) {
        const newNode = node.left ? insertAll(node.left, width, height) : null;
        return newNode ? newNode : node.right ? insertAll(node.right, width, height) : null;
    }

    if (width > node.w || height > node.h) {
        return null;
    }

    if (width === node.w && height === node.h) {
        node.used = true;
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
    return insertAll(node.left, width, height);
};

const serialize = (node: Node | null): string =>
{
    if (!node) {
        return "-";
    }
    return `(${node.x},${node.y},${node.w},${node.h},${node.used ? 1 : 0}`
        + `${serialize(node.left)}${serialize(node.right)})`;
};

// 空き領域の最大値 (幅・高さ・短い辺) が、木の状態から求めた値と食い違うノードの数を返す
const $free: number[] = [0, 0, 0];
const countWrongFree = (node: Node | null): number =>
{
    if (!node) {
        $free[0] = $free[1] = $free[2] = 0;
        return 0;
    }

    let wrong = 0;
    let w = node.w;
    let h = node.h;
    let side = Math.min(node.w, node.h);
    if (node.used) {
        wrong += countWrongFree(node.left);
        const leftW = $free[0];
        const leftH = $free[1];
        const leftSide = $free[2];
        wrong += countWrongFree(node.right);
        w = Math.max(leftW, $free[0]);
        h = Math.max(leftH, $free[1]);
        side = Math.max(leftSide, $free[2]);
    }

    if (node.freeW !== w || node.freeH !== h || node.freeSide !== side) {
        ++wrong;
    }

    $free[0] = w;
    $free[1] = h;
    $free[2] = side;
    return wrong;
};

const count = (node: Node | null): number =>
{
    return node ? 1 + count(node.left) + count(node.right) : 0;
};

describe("NodeDisposeService equivalence test", () =>
{
    it("allocates and releases the same nodes as walking the whole tree", () =>
    {
        // 再現できる乱数
        let seed = 12345;
        const random = (): number =>
        {
            seed = seed * 1103515245 + 12345 & 0x7fffffff;
            return seed / 0x7fffffff;
        };

        for (let round = 0; round < 20; ++round) {

            const rootA = new Node(0, 0, 0, 512, 512);
            const rootB = new Node(0, 0, 0, 512, 512);
            const rects: number[][] = [];

            for (let step = 0; step < 400; ++step) {

                if (rects.length && random() < 0.45) {
                    // 解放 (たまに、存在しない矩形や、すでに解放した矩形も渡す)
                    let rect = rects.splice(random() * rects.length | 0, 1)[0];
                    if (random() < 0.1) {
                        // 存在しない矩形: もとの矩形は確保したまま残す
                        rects.push(rect);
                        rect = [rect[0] + 1, rect[1], rect[2], rect[3]];
                    }
                    const a = execute(rootA, rect[0], rect[1], rect[2], rect[3]);
                    const b = disposeAll(rootB, rect[0], rect[1], rect[2], rect[3]);
                    expect(a).toBe(b);
                    if (random() < 0.1) {
                        expect(execute(rootA, rect[0], rect[1], rect[2], rect[3]))
                            .toBe(disposeAll(rootB, rect[0], rect[1], rect[2], rect[3]));
                    }
                } else {
                    // たまに、どこにも入らない大きさも渡す
                    const large  = random() < 0.05 ? 500 : 0;
                    const width  = 1 + large + (random() * 60 | 0);
                    const height = 1 + large + (random() * 60 | 0);
                    const a = rootA.insert(width, height);
                    const b = insertAll(rootB, width, height);
                    expect(!!a).toBe(!!b);
                    if (a && b) {
                        expect([a.x, a.y, a.w, a.h]).toEqual([b.x, b.y, b.w, b.h]);
                        rects.push([a.x, a.y, a.w, a.h]);
                    }
                }

                expect(serialize(rootA)).toBe(serialize(rootB));
                expect(countWrongFree(rootA)).toBe(0);
            }

            // 残りを全部解放すると、木は根だけに戻る
            for (const rect of rects) {
                expect(execute(rootA, rect[0], rect[1], rect[2], rect[3])).toBe(true);
            }
            expect(count(rootA)).toBe(1);
            expect(rootA.used).toBe(false);
            expect([rootA.freeW, rootA.freeH, rootA.freeSide]).toEqual([512, 512, 512]);
        }
    });
});
