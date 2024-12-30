import { execute } from "./VideoCalcBoundsMatrixUseCase";
import { Video } from "@next2d/media";
import { describe, expect, it } from "vitest";
import { Matrix } from "@next2d/geom";

describe("VideoCalcBoundsMatrixUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const video = new Video(3, 4);

        const bounds = execute(video);
        expect(bounds[0]).toBe(0);
        expect(bounds[1]).toBe(0);
        expect(bounds[2]).toBe(3);
        expect(bounds[3]).toBe(4);
    });

    it("execute test case2", () =>
    {
        const video = new Video(3, 4);
        video.$matrix = new Matrix(1.3, 0.5, 0.2, 1.2, 110, 220);
        
        const bounds = execute(video);
        expect(bounds[0]).toBe(110);
        expect(bounds[1]).toBe(220);
        expect(bounds[2]).toBe(114.69999694824219);
        expect(bounds[3]).toBe(226.3000030517578);
    
    });

    it("execute test case3", () =>
    {
        const video = new Video(3, 4);
        const bounds = execute(video, new Float32Array([1.3, 0.5, 0.2, 1.2, 110, 220]));
        expect(bounds[0]).toBe(110);
        expect(bounds[1]).toBe(220);
        expect(bounds[2]).toBe(114.69999694824219);
        expect(bounds[3]).toBe(226.3000030517578);
    });

    it("execute test case4", () =>
    {
        const video = new Video(3, 4);
        video.$matrix = new Matrix(0.9, 0.25, -0.2, 1.5, 10, 20);

        const bounds = execute(video, new Float32Array([1.3, 0.5, 0.2, 1.2, 110, 220]));
        expect(bounds[0]).toBe(127);
        expect(bounds[1]).toBe(249);
        expect(bounds[2]).toBe(130.82000732421875);
        expect(bounds[3]).toBe(258.04998779296875);
    });
});