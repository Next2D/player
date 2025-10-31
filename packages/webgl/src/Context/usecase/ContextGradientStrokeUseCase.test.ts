import { execute } from "./ContextGradientStrokeUseCase";
import { describe, expect, it, beforeEach, vi } from "vitest";

describe("ContextGradientStrokeUseCase.js method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should execute linear gradient stroke", () =>
    {
        const type = 0; // linear
        const stops = [0, 0xff0000ff, 1, 0x0000ffff];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const spread = 0;
        const interpolation = 0;
        const focal = 0;

        expect(() => {
            execute(type, stops, matrix, spread, interpolation, focal);
        }).not.toThrow();
    });

    it("test case - should execute radial gradient stroke", () =>
    {
        const type = 1; // radial
        const stops = [0, 0xff0000ff, 1, 0x0000ffff];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const spread = 0;
        const interpolation = 0;
        const focal = 0.5;

        expect(() => {
            execute(type, stops, matrix, spread, interpolation, focal);
        }).not.toThrow();
    });
});
