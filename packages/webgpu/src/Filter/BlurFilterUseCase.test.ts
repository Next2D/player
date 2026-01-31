import { describe, it, expect } from "vitest";
import { calculateBlurParams, calculateDirectionalBlurParams } from "./BlurFilterUseCase";

describe("BlurFilterUseCase", () =>
{
    describe("calculateBlurParams", () =>
    {
        it("should calculate blur parameters with identity matrix", () =>
        {
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const result = calculateBlurParams(matrix, 10, 10, 1, 1);

            expect(result.baseBlurX).toBe(10);
            expect(result.baseBlurY).toBe(10);
            expect(result.bufferScaleX).toBe(1);
            expect(result.bufferScaleY).toBe(1);
        });

        it("should apply matrix scale to blur values", () =>
        {
            const matrix = new Float32Array([2, 0, 0, 2, 0, 0]);
            const result = calculateBlurParams(matrix, 10, 10, 1, 1);

            expect(result.baseBlurX).toBe(20);
            expect(result.baseBlurY).toBe(20);
        });

        it("should apply device pixel ratio", () =>
        {
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const result = calculateBlurParams(matrix, 10, 10, 1, 2);

            expect(result.baseBlurX).toBe(5);
            expect(result.baseBlurY).toBe(5);
        });

        it("should calculate offset based on quality and blur", () =>
        {
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const result1 = calculateBlurParams(matrix, 10, 10, 1, 1);
            const result2 = calculateBlurParams(matrix, 10, 10, 5, 1);

            // Higher quality should result in different offset
            expect(result1.offsetX).not.toBe(result2.offsetX);
        });

        it("should use bufferScaleX 0.5 for blur > 16", () =>
        {
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const result = calculateBlurParams(matrix, 20, 20, 1, 1);

            expect(result.bufferScaleX).toBe(0.5);
            expect(result.bufferScaleY).toBe(0.5);
        });

        it("should use bufferScaleX 0.25 for blur > 32", () =>
        {
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const result = calculateBlurParams(matrix, 40, 40, 1, 1);

            expect(result.bufferScaleX).toBe(0.25);
            expect(result.bufferScaleY).toBe(0.25);
        });

        it("should use bufferScaleX 0.125 for blur > 64", () =>
        {
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const result = calculateBlurParams(matrix, 80, 80, 1, 1);

            expect(result.bufferScaleX).toBe(0.125);
            expect(result.bufferScaleY).toBe(0.125);
        });

        it("should use bufferScaleX 0.0625 for blur > 128", () =>
        {
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const result = calculateBlurParams(matrix, 150, 150, 1, 1);

            expect(result.bufferScaleX).toBe(0.0625);
            expect(result.bufferScaleY).toBe(0.0625);
        });

        it("should handle rotated matrix", () =>
        {
            // 45 degree rotation matrix
            const angle = Math.PI / 4;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const matrix = new Float32Array([cos, sin, -sin, cos, 0, 0]);
            const result = calculateBlurParams(matrix, 10, 10, 1, 1);

            // Scale should be 1 (rotation doesn't change scale)
            expect(result.baseBlurX).toBeCloseTo(10, 5);
            expect(result.baseBlurY).toBeCloseTo(10, 5);
        });

        it("should handle asymmetric blur", () =>
        {
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const result = calculateBlurParams(matrix, 5, 40, 1, 1);

            expect(result.baseBlurX).toBe(5);
            expect(result.baseBlurY).toBe(40);
            expect(result.bufferScaleX).toBe(1);
            expect(result.bufferScaleY).toBe(0.25);
        });

        it("should clamp quality to valid BLUR_STEP index", () =>
        {
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

            // Quality 1 (minimum)
            const result1 = calculateBlurParams(matrix, 10, 10, 1, 1);

            // Quality 15 (maximum)
            const result2 = calculateBlurParams(matrix, 10, 10, 15, 1);

            // Quality 20 (should clamp to 15)
            const result3 = calculateBlurParams(matrix, 10, 10, 20, 1);

            expect(result2.offsetX).toBe(result3.offsetX);
            expect(result1.offsetX).not.toBe(result2.offsetX);
        });
    });

    describe("calculateDirectionalBlurParams", () =>
    {
        it("should calculate horizontal blur offset", () =>
        {
            const result = calculateDirectionalBlurParams(true, 10, 100, 100);

            expect(result.offsetX).toBe(1 / 100);
            expect(result.offsetY).toBe(0);
        });

        it("should calculate vertical blur offset", () =>
        {
            const result = calculateDirectionalBlurParams(false, 10, 100, 100);

            expect(result.offsetX).toBe(0);
            expect(result.offsetY).toBe(1 / 100);
        });

        it("should calculate halfBlur correctly", () =>
        {
            const result1 = calculateDirectionalBlurParams(true, 10, 100, 100);
            expect(result1.halfBlur).toBe(5);

            const result2 = calculateDirectionalBlurParams(true, 11, 100, 100);
            expect(result2.halfBlur).toBe(6); // ceil(11 * 0.5) = ceil(5.5) = 6
        });

        it("should calculate samples as 1 + blur", () =>
        {
            const result = calculateDirectionalBlurParams(true, 10, 100, 100);
            expect(result.samples).toBe(11);
        });

        it("should calculate fraction correctly", () =>
        {
            const result1 = calculateDirectionalBlurParams(true, 10, 100, 100);
            // halfBlur = 5, blur * 0.5 = 5, fraction = 1 - (5 - 5) = 1
            expect(result1.fraction).toBe(1);

            const result2 = calculateDirectionalBlurParams(true, 11, 100, 100);
            // halfBlur = 6, blur * 0.5 = 5.5, fraction = 1 - (6 - 5.5) = 0.5
            expect(result2.fraction).toBe(0.5);
        });

        it("should scale offset based on texture dimensions", () =>
        {
            const result1 = calculateDirectionalBlurParams(true, 10, 200, 100);
            const result2 = calculateDirectionalBlurParams(true, 10, 100, 100);

            expect(result1.offsetX).toBe(1 / 200);
            expect(result2.offsetX).toBe(1 / 100);
        });
    });
});
