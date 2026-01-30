import { describe, it, expect, beforeEach } from "vitest";
import { execute } from "./BlendScreenService";
import { $setFuncCode, $getFuncCode } from "../../Blend";

describe("BlendScreenService", () =>
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

    it("should set func code to 301 (screen)", () =>
    {
        $setFuncCode(0);

        execute();

        expect($getFuncCode()).toBe(301);
    });

    it("should return false when already set to screen (301)", () =>
    {
        $setFuncCode(301);

        const result = execute();

        expect(result).toBe(false);
    });

    it("should not change func code when already 301", () =>
    {
        $setFuncCode(301);

        execute();

        expect($getFuncCode()).toBe(301);
    });

    it("should return true when changing from add mode", () =>
    {
        $setFuncCode(101); // add mode

        const result = execute();

        expect(result).toBe(true);
        expect($getFuncCode()).toBe(301);
    });
});
