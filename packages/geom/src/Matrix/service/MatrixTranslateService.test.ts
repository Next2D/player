import { Matrix } from "../../Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js translate", () =>
{
    it("default test case1", () =>
    {
        const matrix = new Matrix();
        expect(matrix.toString()).toBe("(a=1, b=0, c=0, d=1, tx=0, ty=0)");

        matrix.translate(-100, -100);
        expect(matrix.toString()).toBe("(a=1, b=0, c=0, d=1, tx=-100, ty=-100)");

        matrix.scale(0.0, 1.0);
        expect(matrix.toString()).toBe("(a=0, b=0, c=0, d=1, tx=0, ty=-100)");

        matrix.translate(100, 100);
        expect(matrix.toString()).toBe("(a=0, b=0, c=0, d=1, tx=100, ty=0)");
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

        expect(matrix.toString())
            .toBe("(a=0.15622620284557343, b=0.0027269385755062103, c=-0.0027269385755062103, d=0.15622620284557343, tx=128, ty=128)");
    });
});