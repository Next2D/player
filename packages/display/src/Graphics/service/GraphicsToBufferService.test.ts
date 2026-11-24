import { execute } from "./GraphicsToBufferService";
import { execute as graphicsToNumberArrayService } from "./GraphicsToNumberArrayService";
import { describe, expect, it } from "vitest";
import { Graphics } from "../../Graphics";
import { BitmapData } from "../../BitmapData";
import { Matrix } from "@next2d/geom";

/**
 * 数値の配列を経由する方法 (GraphicsToNumberArrayService の結果を Float32Array にする) と
 * 同じ内容になることを確かめる。recodes は呼び出しごとに作り直す (グラデーションの
 * ストップは並び替えで書き換わるため)。
 */
const expectSame = (build: () => any[]): Float32Array =>
{
    const expected = new Float32Array(graphicsToNumberArrayService(build()));
    const actual   = execute(build());
    expect(actual).toBeInstanceOf(Float32Array);
    expect(Array.from(actual)).toEqual(Array.from(expected));
    return actual;
};

const stop = (ratio: number, R: number, G: number, B: number, A: number) =>
{
    return { ratio, R, G, B, A };
};

describe("GraphicsToBufferService.js test", () =>
{
    it("execute test case - null and empty recodes", () =>
    {
        expect(execute(null).length).toBe(0);
        expect(execute([]).length).toBe(0);
    });

    it("execute test case - path commands", () =>
    {
        const buffer = expectSame(() => [
            Graphics.BEGIN_PATH,
            Graphics.MOVE_TO, 1.5, -2.25,
            Graphics.LINE_TO, 10, 20,
            Graphics.CURVE_TO, 1, 2, 3, 4,
            Graphics.CUBIC, 1, 2, 3, 4, 5, 6,
            Graphics.ARC, 7, 8, 9,
            Graphics.CLOSE_PATH,
            Graphics.FILL_STYLE, 255, 128, 0, 1,
            Graphics.END_FILL,
            Graphics.END_STROKE
        ]);
        expect(buffer[0]).toBe(Graphics.BEGIN_PATH);
        expect(buffer[1]).toBe(Graphics.MOVE_TO);
        expect(buffer[2]).toBe(1.5);
        expect(buffer[3]).toBe(-2.25);
    });

    it("execute test case - stroke style with every cap and joint", () =>
    {
        for (const cap of ["none", "round", "square", "invalid_cap"]) {
            for (const joint of ["bevel", "miter", "round", "invalid_join"]) {
                expectSame(() => [
                    Graphics.STROKE_STYLE, 100, cap, joint, 1, 2, 3, 4, 5,
                    Graphics.MOVE_TO, 0, 0
                ]);
            }
        }
    });

    it("execute test case - gradient fill sorts the stops", () =>
    {
        const build = (): any[] => [
            Graphics.GRADIENT_FILL,
            "radial",
            [stop(0.8, 1, 2, 3, 1), stop(0.1, 4, 5, 6, 0.5), stop(0.5, 7, 8, 9, 0.25)],
            new Float32Array([1, 2, 3, 4, 5, 6]),
            "repeat", "linearRGB", 0.5,
            Graphics.MOVE_TO, 3, 4
        ];
        const buffer = expectSame(build);
        // type, radial, stop count, then the stops in ascending ratio
        expect(buffer[1]).toBe(1);
        expect(buffer[2]).toBe(3);
        expect(buffer[3]).toBeCloseTo(0.1);
        expect(buffer[8]).toBeCloseTo(0.5);
        expect(buffer[13]).toBeCloseTo(0.8);

        for (const spread of ["reflect", "repeat", "pad"]) {
            for (const interpolation of ["linearRGB", "rgb"]) {
                expectSame(() => [
                    Graphics.GRADIENT_FILL, "linear", [stop(0, 1, 2, 3, 1), stop(1, 4, 5, 6, 1)],
                    // JSON 由来の、添字をキーに持つオブジェクト
                    { "0": 1, "1": 0, "2": 0, "3": 1, "4": 10, "5": 20 },
                    spread, interpolation, 0
                ]);
            }
        }
    });

    it("execute test case - gradient stroke keeps the stop order", () =>
    {
        const buffer = expectSame(() => [
            Graphics.GRADIENT_STROKE,
            10, "invalid_cap", "invalid_join", 5,
            "linear", [stop(0.9, 255, 100, 0, 1), stop(0.2, 1, 2, 3, 1)], new Float32Array([1, 2, 3, 4, 5, 6]),
            "pad", "rgb", 0,
            Graphics.LINE_TO, 1, 2
        ]);
        expect(buffer[1]).toBe(10);
        expect(buffer[2]).toBe(0);
        expect(buffer[3]).toBe(2);
        expect(buffer[4]).toBe(5);
        expect(buffer[7]).toBeCloseTo(0.9);   // 並び替えない
    });

    it("execute test case - bitmap fill and bitmap stroke", () =>
    {
        const makeBitmap = (): BitmapData =>
        {
            const bitmapData = new BitmapData(3, 2);
            bitmapData.buffer = new Uint8Array(3 * 2 * 4).map((_, index) => index * 7 % 256);
            return bitmapData;
        };

        expectSame(() => [
            Graphics.BITMAP_FILL, makeBitmap(), new Matrix(1, 2, 3, 4, 5, 6), true, false,
            Graphics.MOVE_TO, 1, 2
        ]);
        expectSame(() => [
            Graphics.BITMAP_FILL, makeBitmap(), null, false, true,
            Graphics.MOVE_TO, 1, 2
        ]);
        expectSame(() => [
            Graphics.BITMAP_STROKE, 4, "square", "miter", 3, makeBitmap(), new Matrix(1, 0, 0, 1, 7, 8), true, true,
            Graphics.LINE_TO, 5, 6
        ]);
        expectSame(() => [
            Graphics.BITMAP_STROKE, 4, "round", "bevel", 3, makeBitmap(), null, false, false
        ]);

        // バッファを持たない BitmapData は、コマンドの種類だけを書いて残りを飛ばす
        expectSame(() => [
            Graphics.BITMAP_FILL, new BitmapData(0, 0), null, true, false,
            Graphics.MOVE_TO, 1, 2
        ]);
        expectSame(() => [
            Graphics.BITMAP_STROKE, 4, "round", "bevel", 3, new BitmapData(0, 0), null, true, false,
            Graphics.MOVE_TO, 1, 2
        ]);
    });

    it("execute test case - grows past the initial working buffer and does not share results", () =>
    {
        const build = (count: number, base: number) => (): any[] =>
        {
            const recodes: any[] = [Graphics.BEGIN_PATH];
            for (let index = 0; index < count; ++index) {
                recodes.push(Graphics.CUBIC, base + index, 1, 2, 3, 4, 5);
            }
            // 大きなグラデーションと画像も、途中で作業バッファが足りなくなる位置に置く
            const stops = [];
            for (let index = 0; index < 400; ++index) {
                stops.push(stop(index / 400, index % 256, 1, 2, 1));
            }
            recodes.push(Graphics.GRADIENT_FILL, "linear", stops, new Float32Array([1, 0, 0, 1, 0, 0]), "pad", "rgb", 0);
            const bitmapData = new BitmapData(64, 64);
            bitmapData.buffer = new Uint8Array(64 * 64 * 4).fill(200);
            recodes.push(Graphics.BITMAP_FILL, bitmapData, null, true, false);
            return recodes;
        };

        const first  = expectSame(build(2000, 0));
        const copy   = Array.from(first);
        const second = expectSame(build(10, 5000));

        // 2 回目の呼び出しで、1 回目の結果が書き換わらない (作業バッファを共有しない)
        expect(Array.from(first)).toEqual(copy);
        expect(second.length).toBeLessThan(first.length);
        expect(second.buffer).not.toBe(first.buffer);
    });

    it("execute test case - random command sequences", () =>
    {
        let seed = 20261122;
        const random = (): number =>
        {
            seed = seed * 1103515245 + 12345 & 0x7fffffff;
            return seed / 0x7fffffff;
        };
        const value = (): number => Math.round((random() * 2000 - 1000) * 100) / 100;

        for (let round = 0; round < 60; ++round) {
            const commands: Array<() => any[]> = [];
            const count = 1 + Math.floor(random() * 80);
            for (let index = 0; index < count; ++index) {
                const kind = Math.floor(random() * 9);
                const a = value(), b = value(), c = value(), d = value(), e = value(), f = value();
                switch (kind) {
                    case 0: commands.push(() => [Graphics.MOVE_TO, a, b]); break;
                    case 1: commands.push(() => [Graphics.LINE_TO, a, b]); break;
                    case 2: commands.push(() => [Graphics.CURVE_TO, a, b, c, d]); break;
                    case 3: commands.push(() => [Graphics.CUBIC, a, b, c, d, e, f]); break;
                    case 4: commands.push(() => [Graphics.FILL_STYLE, 1, 2, 3, 1, Graphics.END_FILL]); break;
                    case 5: commands.push(() => [Graphics.BEGIN_PATH, Graphics.CLOSE_PATH]); break;
                    case 6: commands.push(() => [Graphics.STROKE_STYLE, a, "round", "miter", b, 1, 2, 3, 1, Graphics.END_STROKE]); break;
                    case 7: commands.push(() => [
                        Graphics.GRADIENT_FILL, "linear", [stop(0.7, 1, 2, 3, 1), stop(0.2, 4, 5, 6, 1)],
                        new Float32Array([a, b, c, d, e, f]), "reflect", "rgb", 0
                    ]); break;
                    default: commands.push(() => [Graphics.ARC, a, b, c]); break;
                }
            }
            expectSame(() => commands.flatMap((command) => command()));
        }
    });

    it("execute test case - the work buffer grows and each result is independent", () =>
    {
        // 作業用のバッファ (最初は 1024 要素) より長い内容
        const build = (): any[] =>
        {
            const recodes: any[] = [Graphics.BEGIN_PATH, Graphics.MOVE_TO, 0, 0];
            for (let idx = 0; idx < 2000; ++idx) {
                recodes.push(Graphics.CUBIC, idx, idx + 0.5, idx + 1, idx + 1.5, idx + 2, idx + 2.5);
            }
            recodes.push(Graphics.FILL_STYLE, 1, 2, 3, 4, Graphics.END_FILL);
            return recodes;
        };
        const long = expectSame(build);
        expect(long.length).toBe(4 + 2000 * 7 + 6);

        // 途中で広がる場合 (グラデーションの色の数は、元の要素数からは分からない)
        const stops: any[] = [];
        for (let idx = 0; idx < 3000; ++idx) {
            stops.push(stop(idx / 3000, idx & 255, 1, 2, 3));
        }
        const gradient = expectSame(() => [
            Graphics.MOVE_TO, 1, 2,
            Graphics.GRADIENT_FILL, "linear", stops.slice(), [1, 0, 0, 1, 0, 0], "pad", "rgb", 0,
            Graphics.LINE_TO, 3, 4
        ]);
        expect(gradient.length).toBe(3 + 1 + 2 + 3000 * 5 + 6 + 3 + 3);

        // 返した配列は、次の呼び出しで書き換わらない
        const first = execute([Graphics.MOVE_TO, 1, 2]);
        const second = execute([Graphics.MOVE_TO, 3, 4]);
        expect(Array.from(first)).toEqual([Graphics.MOVE_TO, 1, 2]);
        expect(Array.from(second)).toEqual([Graphics.MOVE_TO, 3, 4]);
        expect(first.buffer).not.toBe(second.buffer);
    });
});
