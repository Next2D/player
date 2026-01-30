import { describe, it, expect, beforeEach } from "vitest";
import { execute } from "./BlendEraseService";
import { $setFuncCode, $getFuncCode } from "../../Blend";

describe("BlendEraseService", () =>
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

    it("should set func code to 501 (erase)", () =>
    {
        $setFuncCode(0);

        execute();

        expect($getFuncCode()).toBe(501);
    });

    it("should return false when already set to erase (501)", () =>
    {
        $setFuncCode(501);

        const result = execute();

        expect(result).toBe(false);
    });

    it("should not change func code when already 501", () =>
    {
        $setFuncCode(501);

        execute();

        expect($getFuncCode()).toBe(501);
    });

    it("should return true when changing from screen mode", () =>
    {
        $setFuncCode(301); // screen mode

        const result = execute();

        expect(result).toBe(true);
        expect($getFuncCode()).toBe(501);
    });
});
