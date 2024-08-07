import { Matrix } from "../../Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js translate", () =>
{
    it("default test case1", () =>
    {
        const matrix = new Matrix();

        expect(matrix.a).toBe(1);
        expect(matrix.b).toBe(0);
        expect(matrix.c).toBe(0);
        expect(matrix.d).toBe(1);
        expect(matrix.tx).toBe(0);
        expect(matrix.ty).toBe(0);

        matrix.translate(-100, -100);
        expect(matrix.a).toBe(1);
        expect(matrix.b).toBe(0);
        expect(matrix.c).toBe(0);
        expect(matrix.d).toBe(1);
        expect(matrix.tx).toBe(-100);
        expect(matrix.ty).toBe(-100);

        matrix.scale(0.0, 1.0);
        expect(matrix.a).toBe(0);
        expect(matrix.b).toBe(0);
        expect(matrix.c).toBe(0);
        expect(matrix.d).toBe(1);
        expect(matrix.tx).toBe(-0);
        expect(matrix.ty).toBe(-100);

        matrix.translate(100, 100);
        expect(matrix.a).toBe(0);
        expect(matrix.b).toBe(0);
        expect(matrix.c).toBe(0);
        expect(matrix.d).toBe(1);
        expect(matrix.tx).toBe(100);
        expect(matrix.ty).toBe(0);
    });

    it("pattern test case2", () =>
    {
        const matrix = new Matrix();

        // 単位行列化
        matrix.identity();
        // 拡大縮小成分を乗算
        matrix.scale( 256 / 1638.4 , 256 / 1638.4 );
        // 角度成分を乗算
        matrix.rotate(Math.PI / 180);
        // 移動成分を乗算
        matrix.translate( 128.0 , 128.0 );

        expect(matrix.a).toBeCloseTo(0.15622620284557343);
        expect(matrix.b).toBeCloseTo(0.0027269385755062103);
        expect(matrix.c).toBeCloseTo(-0.0027269385755062103);
        expect(matrix.d).toBeCloseTo(0.15622620284557343);
        expect(matrix.tx).toBe(128);
        expect(matrix.ty).toBe(128);
    });
});