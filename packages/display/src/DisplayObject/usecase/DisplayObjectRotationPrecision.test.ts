import { afterEach, describe, expect, it, vi } from "vitest";
import { DisplayObject } from "../../DisplayObject";
import { Sprite } from "../../Sprite";
import { Matrix } from "@next2d/geom";
import { execute } from "./DisplayObjectSetRotationUseCase";

// Independent copy of the pre-optimization arithmetic; keep both trig evaluations.
const reference = (input: Float32Array, angle: number): Float32Array => {
    const out = input.slice();
    angle %= 360;
    angle = isNaN(angle) ? 0 : Math.min(Math.max(-360, angle), 360);
    const sx = Math.sqrt(out[0] * out[0] + out[1] * out[1]);
    const sy = Math.sqrt(out[2] * out[2] + out[3] * out[3]);
    if (angle === 0) {
        out[0] = sx;
        out[1] = 0;
        out[2] = 0;
        out[3] = sy;
    } else {
        let rx = Math.atan2(out[1], out[0]);
        let ry = Math.atan2(-out[2], out[3]);
        const radian = angle * (Math.PI / 180);
        ry = ry + radian - rx;
        rx = radian;
        const sinX = Math.sin(rx);
        const cosX = Math.cos(rx);
        out[1] = sx * sinX;
        out[0] = Math.abs(sinX) === 1 ? 0 : sx * cosX;
        const sinY = Math.sin(ry);
        const cosY = Math.cos(ry);
        out[2] = -sy * sinY;
        out[3] = Math.abs(sinY) === 1 ? 0 : sy * cosY;
    }
    return out;
};
const bits = (array: Float32Array): Uint32Array => new Uint32Array(array.buffer, array.byteOffset, array.length);

describe("rotation arithmetic compatibility", () =>
{
    afterEach(() => vi.restoreAllMocks());

    it("matches the old arithmetic for special angles, shear, reflection and non-finite input", () =>
    {
        const matrices = [
            [1, 0, 0, 1, -0, 1e-45], [2, 0, 0, 1, 10, -20],
            [-2, 0, 0, 3, 7, 9], [1, 0.4, -0.7, 2, 1, 2],
            [0, -0, 0, -0, 1, 2], [1e-45, 0, 0, 1e-45, 1, 2],
            [1e38, 1e38, -1e38, 1e38, 1, 2],
            [NaN, 0, 0, 1, NaN, Infinity], [Infinity, 0, -Infinity, 1, 1, 2]
        ];
        const angles = [0, -0, 30, -30, 45, 90, -90, 180, -180, 270, 360, -360,
            720.25, -720.25, 89.999999, 90.000001, Number.MIN_VALUE, -Number.MIN_VALUE,
            1e-12, -1e-12, NaN, Infinity, -Infinity];
        const object = new DisplayObject();
        object.$matrix = new Matrix();
        for (const values of matrices) for (const angle of angles) {
            const raw = new Float32Array(values);
            object.$matrix.rawData.set(raw);
            object.$rotation = null;
            execute(object, angle);
            expect(bits(object.$matrix.rawData)).toEqual(bits(reference(raw, angle)));
        }
    });

    it("matches 20,000 randomized cases and 10,000 successive updates without drift", () =>
    {
        const object = new DisplayObject();
        object.$matrix = new Matrix();
        let seed = 46117;
        const random = (): number => {
            seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
            return seed / 0x100000000;
        };
        for (let index = 0; index < 20000; index++) {
            const input = new Float32Array(Array.from({ length: 6 }, () => (random() - 0.5) * 100));
            const angle = (random() - 0.5) * 1440;
            object.$matrix.rawData.set(input);
            object.$rotation = null;
            execute(object, angle);
            expect(bits(object.$matrix.rawData)).toEqual(bits(reference(input, angle)));
        }
        let expected = new Float32Array([2, 0.2, -0.3, 1, 50, 60]);
        object.$matrix.rawData.set(expected);
        for (let index = 0; index < 10000; index++) {
            const angle = index * 0.731 + 1;
            expected = reference(expected, angle);
            execute(object, angle);
            expect(bits(object.$matrix.rawData)).toEqual(bits(expected));
        }
    });

    it("matches equal atan2 arguments across random symmetric matrices and successive rotations", () =>
    {
        const object = new DisplayObject();
        object.$matrix = new Matrix();
        let seed = 81731;
        const random = (): number => {
            seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
            return seed / 0x100000000;
        };
        for (let index = 0; index < 20000; index++) {
            const a = (random() - 0.5) * 100;
            const b = (random() - 0.5) * 100;
            const input = new Float32Array([a, b, -b, a, -0, 50]);
            const angle = (random() - 0.5) * 720;
            object.$matrix.rawData.set(input);
            object.$rotation = null;
            execute(object, angle);
            expect(bits(object.$matrix.rawData)).toEqual(bits(reference(input, angle)));
        }
        let expected = new Float32Array([1, 0, -0, 1, -0, 50]);
        object.$matrix.rawData.set(expected);
        for (let index = 0; index < 10000; index++) {
            const angle = (index + 1) * 0.637;
            expected = reference(expected, angle);
            execute(object, angle);
            expect(bits(object.$matrix.rawData)).toEqual(bits(expected));
        }
    });

    it("preserves negative-zero sine behavior when a tiny negative rotation underflows", () =>
    {
        const object = new DisplayObject();
        object.$matrix = new Matrix(1, 0, -0, 1);
        execute(object, -Number.MIN_VALUE);
        // rx is -0, but (0 + rx) - 0 is +0. Equality must distinguish them.
        expect(Object.is(object.$matrix?.b, -0)).toBe(true);
        expect(Object.is(object.$matrix?.c, -0)).toBe(true);
    });

    it("keeps lazy matrix creation, normalized-angle early return and dirty propagation", () =>
    {
        const object = new DisplayObject();
        const parent = new Sprite();
        parent.addChild(object);
        object.changed = false;
        parent.changed = false;
        execute(object, 390);
        expect(object.$matrix).toBeInstanceOf(Matrix);
        expect(object.$rotation).toBe(30);
        expect(object.$scaleX).toBeNull();
        expect(object.$scaleY).toBeNull();
        expect(object.changed).toBe(true);
        expect(parent.changed).toBe(true);
        const matrix = object.$matrix;
        const data = matrix?.rawData.slice();
        object.changed = false;
        parent.changed = false;
        execute(object, 750);
        expect(object.$matrix).toBe(matrix);
        expect(object.$matrix?.rawData).toEqual(data);
        expect(object.changed).toBe(false);
        expect(parent.changed).toBe(false);
    });

    it("preserves Matrix accessor read and write order", () =>
    {
        class ObservedMatrix extends Matrix {
            reads: string[] = [];
            writes: string[] = [];
            override get a(): number { this.reads.push("a"); return super.a; }
            override set a(value: number) { this.writes.push("a"); super.a = value; }
            override get b(): number { this.reads.push("b"); return super.b; }
            override set b(value: number) { this.writes.push("b"); super.b = value; }
            override get c(): number { this.reads.push("c"); return super.c; }
            override set c(value: number) { this.writes.push("c"); super.c = value; }
            override get d(): number { this.reads.push("d"); return super.d; }
            override set d(value: number) { this.writes.push("d"); super.d = value; }
        }
        const object = new DisplayObject();
        const matrix = new ObservedMatrix();
        object.$matrix = matrix;
        execute(object, 45);
        expect(matrix.reads).toEqual(["a", "a", "b", "b", "c", "c", "d", "d", "b", "a", "c", "d"]);
        expect(matrix.writes).toEqual(["b", "a", "c", "d"]);
        matrix.writes.length = 0;
        execute(object, 0);
        expect(matrix.writes).toEqual(["a", "b", "c", "d"]);
    });
});

describe("rotation trigonometric reuse", () =>
{
    afterEach(() => vi.restoreAllMocks());

    it("reuses only identical angles and keeps separate calls for shear and opposite signed zeros", () =>
    {
        const sin = vi.spyOn(Math, "sin");
        const cos = vi.spyOn(Math, "cos");
        const cases: { matrix: Matrix; angle: number; calls: number }[] = [
            { matrix: new Matrix(), angle: 45, calls: 1 },
            { matrix: new Matrix(1, 0.4, -0.7, 2), angle: 45, calls: 2 },
            { matrix: new Matrix(1, 0, -0, 1), angle: -Number.MIN_VALUE, calls: 2 }
        ];
        for (const entry of cases) {
            const object = new DisplayObject();
            object.$matrix = entry.matrix;
            sin.mockClear();
            cos.mockClear();
            execute(object, entry.angle);
            expect(sin).toHaveBeenCalledTimes(entry.calls);
            expect(cos).toHaveBeenCalledTimes(entry.calls);
        }
    });
});
