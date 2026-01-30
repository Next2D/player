import { describe, it, expect, beforeEach } from "vitest";
import { execute } from "./BlendAlphaService";
import { $setFuncCode, $getFuncCode } from "../../Blend";

describe("BlendAlphaService", () =>
{
    beforeEach(() =>
    {
        $setFuncCode(0);
    });

    it("should return true when func code is different", () =>
    {
        $setFuncCode(0);

        const result = execute();

        expect(result).toBe(true);
    });

    it("should set func code to 401 (alpha)", () =>
    {
        $setFuncCode(0);

        execute();

        expect($getFuncCode()).toBe(401);
    });

    it("should return false when already set to alpha (401)", () =>
    {
        $setFuncCode(401);

        const result = execute();

        expect(result).toBe(false);
    });

    it("should not change func code when already 401", () =>
    {
        $setFuncCode(401);

        execute();

        expect($getFuncCode()).toBe(401);
    });

    it("should return true when changing from normal mode", () =>
    {
        $setFuncCode(613); // normal mode

        const result = execute();

        expect(result).toBe(true);
        expect($getFuncCode()).toBe(401);
    });
});
