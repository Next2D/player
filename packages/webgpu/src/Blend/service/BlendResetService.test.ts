import { describe, it, expect, beforeEach } from "vitest";
import { execute } from "./BlendResetService";
import { $setFuncCode, $funcCode } from "../../Blend";

describe("BlendResetService", () =>
{
    beforeEach(() =>
    {
        $setFuncCode(0);
    });

    it("should return true when func code is not 613 (normal)", () =>
    {
        $setFuncCode(101); // add mode

        const result = execute();

        expect(result).toBe(true);
    });

    it("should set func code to 613 (normal)", () =>
    {
        $setFuncCode(101); // add mode

        execute();

        expect($funcCode).toBe(613);
    });

    it("should return false when already set to normal (613)", () =>
    {
        $setFuncCode(613);

        const result = execute();

        expect(result).toBe(false);
    });

    it("should not change func code when already 613", () =>
    {
        $setFuncCode(613);

        execute();

        expect($funcCode).toBe(613);
    });

    it("should return true when resetting from screen mode", () =>
    {
        $setFuncCode(301); // screen mode

        const result = execute();

        expect(result).toBe(true);
        expect($funcCode).toBe(613);
    });

    it("should return true when resetting from erase mode", () =>
    {
        $setFuncCode(501); // erase mode

        const result = execute();

        expect(result).toBe(true);
        expect($funcCode).toBe(613);
    });

    it("should return true when resetting from one-zero mode", () =>
    {
        $setFuncCode(10); // one-zero (copy) mode

        const result = execute();

        expect(result).toBe(true);
        expect($funcCode).toBe(613);
    });
});
