import { execute } from "./MeshApproximateOffsetQuadraticUseCase";
import { describe, expect, it } from "vitest";
import type { IPoint } from "../../interface/IPoint";

describe("MeshApproximateOffsetQuadraticUseCase.js method test", () =>
{
    it("test case", () =>
    {
        const s0: IPoint = { "x": 0, "y": 0 };
        const s1: IPoint = { "x": 1, "y": 1 };
        const s2: IPoint = { "x": 2, "y": 0 };
        const offset = 1;

        const result = execute(s0, s1, s2, offset);

        expect(result).toEqual([
            { "x": -0.7071067811865475, "y": 0.7071067811865475 },
            { "x": 1, "y": 1.5 },
            { "x": 2.7071067811865475, "y": 0.7071067811865475 }
        ]);
    });
});