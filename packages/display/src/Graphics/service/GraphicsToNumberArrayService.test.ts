import { execute } from "./GraphicsToNumberArrayService";
import { describe, expect, it } from "vitest";
import { Graphics } from "../../Graphics";

describe("GraphicsToNumberArrayService.js test", () =>
{
    it("execute test case1", () =>
    {
        const recodes = [
            Graphics.STROKE_STYLE,
            100, "none", "bevel", 1, 2, 3, 4, 5,
            Graphics.STROKE_STYLE,
            200, "round", "miter", 1, 2, 3, 4, 5,
            Graphics.STROKE_STYLE,
            300, "square", "round", 1, 2, 3, 4, 5,
        ];
        const array = execute(recodes);

        expect(array[0]).toBe(Graphics.STROKE_STYLE);
        expect(array[1]).toBe(100);
        expect(array[2]).toBe(0);
        expect(array[3]).toBe(0);

        expect(array[9]).toBe(Graphics.STROKE_STYLE);
        expect(array[10]).toBe(200);
        expect(array[11]).toBe(1);
        expect(array[12]).toBe(1);

        expect(array[18]).toBe(Graphics.STROKE_STYLE);
        expect(array[19]).toBe(300);
        expect(array[20]).toBe(2);
        expect(array[21]).toBe(2);
    });

    it("execute test case2", () =>
    {
        const object = {
            "ratio": 0,
            "R": 255,
            "G": 100,
            "B": 0,
            "A": 1
        }
        const recodes = [
            Graphics.GRADIENT_FILL,
            "linear", [object], new Float32Array([1,2,3,4,5,6]), 
            "reflect", "linearRGB", 0,
            Graphics.GRADIENT_FILL,
            "radial", [object], new Float32Array([6,5,4,3,2,1]), 
            "repeat", "rgb", 0,
        ];
        const array = execute(recodes);

        expect(array[0]).toBe(Graphics.GRADIENT_FILL);
        expect(array[1]).toBe(0); // linear
        expect(array[2]).toBe(1);
        expect(array[3]).toBe(object.ratio);
        expect(array[4]).toBe(object.R);
        expect(array[5]).toBe(object.G);
        expect(array[6]).toBe(object.B);
        expect(array[7]).toBe(object.A);
        expect(array[8]).toBe(1);
        expect(array[9]).toBe(2);
        expect(array[10]).toBe(3);
        expect(array[11]).toBe(4);
        expect(array[12]).toBe(5);
        expect(array[13]).toBe(6);
        expect(array[14]).toBe(0); // reflect
        expect(array[15]).toBe(0); // linearRGB
        expect(array[16]).toBe(0); // focal

        expect(array[17]).toBe(Graphics.GRADIENT_FILL);
        expect(array[18]).toBe(1); // radial 
        expect(array[19]).toBe(1);
        expect(array[20]).toBe(object.ratio);
        expect(array[21]).toBe(object.R);
        expect(array[22]).toBe(object.G);
        expect(array[23]).toBe(object.B);
        expect(array[24]).toBe(object.A);
        expect(array[25]).toBe(6);
        expect(array[26]).toBe(5);
        expect(array[27]).toBe(4);
        expect(array[28]).toBe(3);
        expect(array[29]).toBe(2);
        expect(array[30]).toBe(1);
        expect(array[31]).toBe(1); // repeat
        expect(array[32]).toBe(1); // rgb
        expect(array[33]).toBe(0); // focal
    });
});