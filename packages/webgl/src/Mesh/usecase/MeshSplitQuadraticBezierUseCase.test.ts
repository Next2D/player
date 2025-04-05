import { execute } from "./MeshSplitQuadraticBezierUseCase";
import { describe, expect, it } from "vitest";

describe("MeshSplitQuadraticBezierUseCase.js method test", () =>
{
    it("test case", () =>
    {
        const segments = execute({ x: 120, y: 90 }, { x: 21, y: 31 }, { x: 333, y: 123 });
        expect(segments).toEqual([
            [ { x: 120, y: 90 }, { x: 70.5, y: 60.5 }, { x: 123.75, y: 68.75 } ],
            [ { x: 123.75, y: 68.75 }, { x: 177, y: 77 }, { x: 333, y: 123 } ]
        ]);
    });
});