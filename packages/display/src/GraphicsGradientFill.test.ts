import { GraphicsGradientFill } from "./GraphicsGradientFill";
import { Matrix } from "@next2d/geom";
import { describe, expect, it } from "vitest";

describe("GraphicsGradientFill class test", () =>
{
    describe("constructor test", () =>
    {
        it("should create instance with linear gradient", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255]
            );
            expect(fill).toBeInstanceOf(GraphicsGradientFill);
        });

        it("should create instance with radial gradient", () =>
        {
            const fill = new GraphicsGradientFill(
                "radial",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255]
            );
            expect(fill).toBeInstanceOf(GraphicsGradientFill);
        });

        it("should create instance with string colors", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                ["#FF0000", "#00FF00"],
                [1, 1],
                [0, 255]
            );
            expect(fill).toBeInstanceOf(GraphicsGradientFill);
        });

        it("should create instance with matrix", () =>
        {
            const matrix = new Matrix(1, 0, 0, 1, 10, 20);
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255],
                matrix
            );
            expect(fill).toBeInstanceOf(GraphicsGradientFill);
        });

        it("should create instance with spread method", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255],
                null,
                "reflect"
            );
            expect(fill).toBeInstanceOf(GraphicsGradientFill);
        });

        it("should create instance with interpolation method", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255],
                null,
                "pad",
                "linearRGB"
            );
            expect(fill).toBeInstanceOf(GraphicsGradientFill);
        });

        it("should create instance with focal point ratio", () =>
        {
            const fill = new GraphicsGradientFill(
                "radial",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255],
                null,
                "pad",
                "rgb",
                0.5
            );
            expect(fill).toBeInstanceOf(GraphicsGradientFill);
        });
    });

    describe("colorStops getter test", () =>
    {
        it("should return color stops array", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 0.5],
                [0, 255]
            );
            const colorStops = fill.colorStops;
            expect(colorStops).toHaveLength(2);
        });

        it("should convert number colors to RGBA", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000],
                [1],
                [0]
            );
            const colorStops = fill.colorStops;
            expect(colorStops[0]).toEqual({
                ratio: 0,
                R: 255,
                G: 0,
                B: 0,
                A: 255
            });
        });

        it("should convert string colors to RGBA", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                ["#00FF00"],
                [1],
                [128]
            );
            const colorStops = fill.colorStops;
            expect(colorStops[0].ratio).toBe(128 / 255);
            expect(colorStops[0].A).toBe(255);
        });

        it("should handle multiple color stops", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00, 0x0000FF],
                [1, 0.5, 0.25],
                [0, 127, 255]
            );
            const colorStops = fill.colorStops;
            expect(colorStops).toHaveLength(3);
            expect(colorStops[0].R).toBe(255);
            expect(colorStops[1].G).toBe(255);
            expect(colorStops[2].B).toBe(255);
        });

        it("should normalize ratios", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255]
            );
            const colorStops = fill.colorStops;
            expect(colorStops[0].ratio).toBe(0);
            expect(colorStops[1].ratio).toBe(1);
        });

        it("should handle alpha values", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 0.5],
                [0, 255]
            );
            const colorStops = fill.colorStops;
            expect(colorStops[0].A).toBe(255);
            expect(colorStops[1].A).toBe(127);
        });

        it("should use minimum length of arrays", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00, 0x0000FF],
                [1, 0.5],
                [0, 255]
            );
            const colorStops = fill.colorStops;
            expect(colorStops).toHaveLength(2);
        });

        it("should cache color stops", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255]
            );
            const colorStops1 = fill.colorStops;
            const colorStops2 = fill.colorStops;
            expect(colorStops1).toBe(colorStops2);
        });
    });

    describe("toArray method test", () =>
    {
        it("should return array with type", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255]
            );
            const array = fill.toArray();
            expect(array[0]).toBe("linear");
        });

        it("should return array with color stops", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255]
            );
            const array = fill.toArray();
            expect(Array.isArray(array[1])).toBe(true);
        });

        it("should return array with matrix identity when matrix is null", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255]
            );
            const array = fill.toArray();
            const matrix = array[2] as Float32Array | number[];
            expect(Array.from(matrix)).toEqual([1, 0, 0, 1, 0, 0]);
        });

        it("should return array with matrix rawData when matrix is provided", () =>
        {
            const matrix = new Matrix(2, 0, 0, 2, 10, 20);
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255],
                matrix
            );
            const array = fill.toArray();
            expect(array[2]).toEqual(matrix.rawData);
        });

        it("should return array with spread method", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255],
                null,
                "reflect"
            );
            const array = fill.toArray();
            expect(array[3]).toBe("reflect");
        });

        it("should return array with interpolation method", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255],
                null,
                "pad",
                "linearRGB"
            );
            const array = fill.toArray();
            expect(array[4]).toBe("linearRGB");
        });

        it("should return array with focal point ratio", () =>
        {
            const fill = new GraphicsGradientFill(
                "radial",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255],
                null,
                "pad",
                "rgb",
                0.5
            );
            const array = fill.toArray();
            expect(array[5]).toBe(0.5);
        });
    });

    describe("clone method test", () =>
    {
        it("should return new instance", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255]
            );
            const cloned = fill.clone();
            expect(cloned).toBeInstanceOf(GraphicsGradientFill);
            expect(cloned).not.toBe(fill);
        });

        it("should clone all properties", () =>
        {
            const matrix = new Matrix(2, 0, 0, 2, 10, 20);
            const fill = new GraphicsGradientFill(
                "radial",
                [0xFF0000, 0x00FF00, 0x0000FF],
                [1, 0.5, 0.25],
                [0, 127, 255],
                matrix,
                "reflect",
                "linearRGB",
                0.5
            );
            const cloned = fill.clone();
            const fillArray = fill.toArray();
            const clonedArray = cloned.toArray();
            expect(clonedArray[0]).toBe(fillArray[0]);
            expect(clonedArray[3]).toBe(fillArray[3]);
            expect(clonedArray[4]).toBe(fillArray[4]);
            expect(clonedArray[5]).toBe(fillArray[5]);
        });

        it("should clone color stops independently", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255]
            );
            const cloned = fill.clone();
            const fillStops = fill.colorStops;
            const clonedStops = cloned.colorStops;
            expect(fillStops).toEqual(clonedStops);
            expect(fillStops).not.toBe(clonedStops);
        });

        it("should clone matrix independently", () =>
        {
            const matrix = new Matrix(2, 0, 0, 2, 10, 20);
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255],
                matrix
            );
            const cloned = fill.clone();
            const fillArray = fill.toArray();
            const clonedArray = cloned.toArray();
            expect(fillArray[2]).toEqual(clonedArray[2]);
            expect(fillArray[2]).not.toBe(clonedArray[2]);
        });

        it("should handle null matrix in clone", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255],
                null
            );
            const cloned = fill.clone();
            const matrix = cloned.toArray()[2] as Float32Array | number[];
            expect(Array.from(matrix)).toEqual([1, 0, 0, 1, 0, 0]);
        });
    });

    describe("gradient types test", () =>
    {
        it("should support linear gradient", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255]
            );
            expect(fill.toArray()[0]).toBe("linear");
        });

        it("should support radial gradient", () =>
        {
            const fill = new GraphicsGradientFill(
                "radial",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255]
            );
            expect(fill.toArray()[0]).toBe("radial");
        });
    });

    describe("spread methods test", () =>
    {
        it("should support pad spread method", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255],
                null,
                "pad"
            );
            expect(fill.toArray()[3]).toBe("pad");
        });

        it("should support reflect spread method", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255],
                null,
                "reflect"
            );
            expect(fill.toArray()[3]).toBe("reflect");
        });

        it("should support repeat spread method", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255],
                null,
                "repeat"
            );
            expect(fill.toArray()[3]).toBe("repeat");
        });
    });

    describe("interpolation methods test", () =>
    {
        it("should support rgb interpolation", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255],
                null,
                "pad",
                "rgb"
            );
            expect(fill.toArray()[4]).toBe("rgb");
        });

        it("should support linearRGB interpolation", () =>
        {
            const fill = new GraphicsGradientFill(
                "linear",
                [0xFF0000, 0x00FF00],
                [1, 1],
                [0, 255],
                null,
                "pad",
                "linearRGB"
            );
            expect(fill.toArray()[4]).toBe("linearRGB");
        });
    });
});
