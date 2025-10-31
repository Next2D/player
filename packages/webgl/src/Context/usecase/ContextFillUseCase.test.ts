import { execute } from "./ContextFillUseCase";
import { describe, expect, it, beforeEach, vi } from "vitest";
import type { IFillType } from "../../interface/IFillType";

describe("ContextFillUseCase.js method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should execute fill with fill type", () =>
    {
        const fillType: IFillType = "fill";

        expect(() => {
            execute(fillType);
        }).not.toThrow();
    });

    it("test case - should execute fill with linear type", () =>
    {
        const fillType: IFillType = "linear";

        expect(() => {
            execute(fillType);
        }).not.toThrow();
    });

    it("test case - should execute fill with radial type", () =>
    {
        const fillType: IFillType = "radial";

        expect(() => {
            execute(fillType);
        }).not.toThrow();
    });

    it("test case - should execute fill with bitmap type", () =>
    {
        const fillType: IFillType = "bitmap";

        expect(() => {
            execute(fillType);
        }).not.toThrow();
    });
});
