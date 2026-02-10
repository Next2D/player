import { execute } from "./BezierConverterAdaptiveCubicToQuadUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../BezierConverter.ts", () => {
    const buffer = new Float32Array(64);
    let segmentCount = 0;
    return {
        $adaptiveBuffer: buffer,
        get $adaptiveSegmentCount() { return segmentCount; },
        $getAdaptiveSubdivisionCount: vi.fn(() => 2),
        $ensureAdaptiveBufferSize: vi.fn(),
        $setAdaptiveSegmentCount: vi.fn((count: number) => { segmentCount = count; }),
        $resetSplitBufferPool: vi.fn(),
        $getSplitBuffer: vi.fn(() => new Float32Array(8))
    };
});

import {
    $getAdaptiveSubdivisionCount,
    $ensureAdaptiveBufferSize,
    $setAdaptiveSegmentCount
} from "../../BezierConverter";

describe("BezierConverterAdaptiveCubicToQuadUseCase.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should convert cubic bezier to quadratic", () =>
    {
        const result = execute(
            0, 0,       // from
            25, 50,     // control point 1
            75, 50,     // control point 2
            100, 0      // end
        );

        expect($getAdaptiveSubdivisionCount).toHaveBeenCalled();
        expect($ensureAdaptiveBufferSize).toHaveBeenCalled();
        expect($setAdaptiveSegmentCount).toHaveBeenCalled();
        expect(result).toHaveProperty("buffer");
        expect(result).toHaveProperty("count");
    });

    it("test case - should return correct structure", () =>
    {
        const result = execute(
            0, 0,
            10, 20,
            30, 20,
            40, 0
        );

        expect(result.buffer).toBeInstanceOf(Float32Array);
        expect(typeof result.count).toBe("number");
    });

    it("test case - should handle straight line approximation", () =>
    {
        const result = execute(
            0, 0,
            33, 0,
            66, 0,
            100, 0
        );

        expect(result).toBeDefined();
        expect($ensureAdaptiveBufferSize).toHaveBeenCalled();
    });

    it("test case - should handle 4 subdivisions", () =>
    {
        vi.mocked($getAdaptiveSubdivisionCount).mockReturnValueOnce(4);

        const result = execute(
            0, 0,
            0, 100,
            100, 100,
            100, 0
        );

        expect(result).toBeDefined();
    });

    it("test case - should handle 8 subdivisions for complex curves", () =>
    {
        vi.mocked($getAdaptiveSubdivisionCount).mockReturnValueOnce(8);

        const result = execute(
            0, 0,
            -50, 100,
            150, 100,
            100, 0
        );

        expect(result).toBeDefined();
    });
});
