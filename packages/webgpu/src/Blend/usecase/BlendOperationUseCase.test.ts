import { execute } from "./BlendOperationUseCase";
import { describe, expect, it, beforeEach } from "vitest";
import { $setFuncCode } from "../../Blend";

describe("BlendOperationUseCase.ts method test", () =>
{
    beforeEach(() =>
    {
        // Reset func code before each test
        $setFuncCode(0);
    });

    it("test case - add blend mode", () =>
    {
        const changed = execute("add");
        expect(changed).toBe(true);

        // Second call should return false (no change)
        const changed2 = execute("add");
        expect(changed2).toBe(false);
    });

    it("test case - screen blend mode", () =>
    {
        const changed = execute("screen");
        expect(changed).toBe(true);

        const changed2 = execute("screen");
        expect(changed2).toBe(false);
    });

    it("test case - alpha blend mode", () =>
    {
        const changed = execute("alpha");
        expect(changed).toBe(true);

        const changed2 = execute("alpha");
        expect(changed2).toBe(false);
    });

    it("test case - erase blend mode", () =>
    {
        const changed = execute("erase");
        expect(changed).toBe(true);

        const changed2 = execute("erase");
        expect(changed2).toBe(false);
    });

    it("test case - copy blend mode", () =>
    {
        const changed = execute("copy");
        expect(changed).toBe(true);

        const changed2 = execute("copy");
        expect(changed2).toBe(false);
    });

    it("test case - normal blend mode (default)", () =>
    {
        const changed = execute("normal");
        expect(changed).toBe(true);

        const changed2 = execute("normal");
        expect(changed2).toBe(false);
    });

    it("test case - switching between modes", () =>
    {
        execute("add");
        const changed = execute("screen");
        expect(changed).toBe(true);

        const changed2 = execute("normal");
        expect(changed2).toBe(true);
    });
});
