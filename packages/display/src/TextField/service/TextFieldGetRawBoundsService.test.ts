import { execute } from "./TextFieldGetRawBoundsService";
import { TextField } from "@next2d/text";
import { describe, expect, it } from "vitest";

describe("TextFieldGetRawBoundsService.js test", () =>
{
    it("execute test case", () =>
    {
        const textField = new TextField();
        const bounds = execute(textField);

        expect(bounds[0]).toBe(0);
        expect(bounds[1]).toBe(0);
        expect(bounds[2]).toBe(100);
        expect(bounds[3]).toBe(100);
    });
});