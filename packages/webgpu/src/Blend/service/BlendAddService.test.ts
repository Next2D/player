import { describe, it, expect, beforeEach } from "vitest";
import { execute } from "./BlendAddService";
import { $setFuncCode, $getFuncCode } from "../../Blend";

describe("BlendAddService", () =>
{
    beforeEach(() =>
    {
        // Reset to non-add state
        $setFuncCode(0);
    });

    it("should return true when func code is different", () =>
    {
        $setFuncCode(0);

        const result = execute();

        expect(result).toBe(true);
    });

    it("should set func code to 101 (add)", () =>
    {
        $setFuncCode(0);

        execute();

        expect($getFuncCode()).toBe(101);
    });

    it("should return false when already set to add (101)", () =>
    {
        $setFuncCode(101);

        const result = execute();

        expect(result).toBe(false);
    });

    it("should not change func code when already 101", () =>
    {
        $setFuncCode(101);

        execute();

        expect($getFuncCode()).toBe(101);
    });

    it("should return true when changing from another mode", () =>
    {
        $setFuncCode(301); // screen mode

        const result = execute();

        expect(result).toBe(true);
        expect($getFuncCode()).toBe(101);
    });

    it("should return true when changing from normal mode", () =>
    {
        $setFuncCode(613); // normal mode

        const result = execute();

        expect(result).toBe(true);
    });
});
