import { describe, it, expect, beforeEach } from "vitest";
import { execute } from "./BlendOneZeroService";
import { $setFuncCode, $funcCode } from "../../Blend";

describe("BlendOneZeroService", () =>
{
    beforeEach(() =>
    {
        $setFuncCode(0);
    });

    it("should return true when func code is different", () =>
    {
        $setFuncCode(100);

        const result = execute();

        expect(result).toBe(true);
    });

    it("should set func code to 10 (copy/one-zero)", () =>
    {
        $setFuncCode(100);

        execute();

        expect($funcCode).toBe(10);
    });

    it("should return false when already set to one-zero (10)", () =>
    {
        $setFuncCode(10);

        const result = execute();

        expect(result).toBe(false);
    });

    it("should not change func code when already 10", () =>
    {
        $setFuncCode(10);

        execute();

        expect($funcCode).toBe(10);
    });

    it("should return true when changing from normal mode", () =>
    {
        $setFuncCode(613); // normal mode

        const result = execute();

        expect(result).toBe(true);
        expect($funcCode).toBe(10);
    });
});
