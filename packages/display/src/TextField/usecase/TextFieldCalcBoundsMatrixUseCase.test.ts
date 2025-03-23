import { execute } from "./TextFieldCalcBoundsMatrixUseCase";
import { TextField } from "@next2d/text";
import { describe, expect, it } from "vitest";
import { Matrix } from "@next2d/geom";

describe("TextFieldCalcBoundsMatrixUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const textField = new TextField();
        const bounds = execute(textField);

        expect(bounds[0]).toBe(0);
        expect(bounds[1]).toBe(0);
        expect(bounds[2]).toBe(100);
        expect(bounds[3]).toBe(100);
    });

    it("execute test case2", () =>
    {
        const textField = new TextField();
        textField.$matrix = new Matrix(1.3, 0.5, 0.2, 1.2, 110, 220);
        const bounds = execute(textField);

        expect(bounds[0]).toBe(110);
        expect(bounds[1]).toBe(220);
        expect(bounds[2]).toBe(260);
        expect(bounds[3]).toBe(390);

    });

    it("execute test case3", () =>
    {
        const textField = new TextField();
        const bounds = execute(textField, new Float32Array([1.3, 0.5, 0.2, 1.2, 110, 220]));

        expect(bounds[0]).toBe(110);
        expect(bounds[1]).toBe(220);
        expect(bounds[2]).toBe(260);
        expect(bounds[3]).toBe(390);
    });

    it("execute test case4", () =>
    {
        const textField = new TextField();
        textField.$matrix = new Matrix(0.9, 0.25, -0.2, 1.5, 10, 20);
        const bounds = execute(textField, new Float32Array([1.3, 0.5, 0.2, 1.2, 110, 220]));
        
        expect(bounds[0]).toBe(127);
        expect(bounds[1]).toBe(249);
        expect(bounds[2]).toBe(252.99998474121094);
        expect(bounds[3]).toBe(494);
    });
});