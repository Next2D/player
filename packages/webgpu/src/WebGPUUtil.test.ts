import { describe, expect, it, vi, beforeEach } from "vitest";
import {
    $setRenderMaxSize,
    $RENDER_MAX_SIZE,
    $setSamples,
    $samples,
    $setDevicePixelRatio,
    $getDevicePixelRatio,
    $clamp,
    $multiplyMatrices,
    $upperPowerOfTwo,
    $getFloat32Array4,
    $poolFloat32Array4,
    $getFloat32Array9,
    $poolFloat32Array9,
    $getArray,
    $poolArray
} from "./WebGPUUtil";

describe("WebGPUUtil test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should set and get render max size correctly", () =>
    {
        $setRenderMaxSize(8192);
        expect($RENDER_MAX_SIZE).toBe(4096); // Should be clamped to 4096
        
        $setRenderMaxSize(2048);
        expect($RENDER_MAX_SIZE).toBe(1024); // Should be half the input
    });

    it("should set and get samples correctly", () =>
    {
        $setSamples(8);
        expect($samples).toBe(8);
    });

    it("should set and get device pixel ratio correctly", () =>
    {
        $setDevicePixelRatio(2.0);
        expect($getDevicePixelRatio()).toBe(2.0);
        
        $setDevicePixelRatio(1.5);
        expect($getDevicePixelRatio()).toBe(1.5);
    });

    it("should clamp values correctly", () =>
    {
        expect($clamp(5, 0, 10)).toBe(5);
        expect($clamp(-5, 0, 10)).toBe(0);
        expect($clamp(15, 0, 10)).toBe(10);
        expect($clamp(NaN, 0, 10, 5)).toBe(5);
        expect($clamp(NaN, 0, 10)).toBe(0);
    });

    it("should multiply matrices correctly", () =>
    {
        const a = new Float32Array([1, 0, 0, 1, 10, 20]);
        const b = new Float32Array([2, 0, 0, 2, 5, 10]);
        
        const result = $multiplyMatrices(a, b);
        
        expect(result[0]).toBe(2);  // a0 * b0 + a2 * b1 = 1 * 2 + 0 * 0 = 2
        expect(result[1]).toBe(0);  // a1 * b0 + a3 * b1 = 0 * 2 + 1 * 0 = 0
        expect(result[2]).toBe(0);  // a0 * b2 + a2 * b3 = 1 * 0 + 0 * 2 = 0
        expect(result[3]).toBe(2);  // a1 * b2 + a3 * b3 = 0 * 0 + 1 * 2 = 2
        expect(result[4]).toBe(15); // a0 * b4 + a2 * b5 + a4 = 1 * 5 + 0 * 10 + 10 = 15
        expect(result[5]).toBe(30); // a1 * b4 + a3 * b5 + a5 = 0 * 5 + 1 * 10 + 20 = 30
    });

    it("should calculate upper power of two correctly", () =>
    {
        expect($upperPowerOfTwo(1)).toBe(1);
        expect($upperPowerOfTwo(2)).toBe(2);
        expect($upperPowerOfTwo(3)).toBe(4);
        expect($upperPowerOfTwo(7)).toBe(8);
        expect($upperPowerOfTwo(15)).toBe(16);
        expect($upperPowerOfTwo(16)).toBe(16);
        expect($upperPowerOfTwo(17)).toBe(32);
    });

    it("should manage Float32Array4 pool correctly", () =>
    {
        const array1 = $getFloat32Array4(1, 2, 3, 4);
        expect(array1.length).toBe(4);
        expect(array1[0]).toBe(1);
        expect(array1[1]).toBe(2);
        expect(array1[2]).toBe(3);
        expect(array1[3]).toBe(4);
        
        $poolFloat32Array4(array1);
        
        const array2 = $getFloat32Array4(5, 6, 7, 8);
        expect(array2).toBe(array1); // Should reuse pooled array
        expect(array2[0]).toBe(5);
        expect(array2[1]).toBe(6);
        expect(array2[2]).toBe(7);
        expect(array2[3]).toBe(8);
    });

    it("should manage Float32Array9 pool correctly", () =>
    {
        const array1 = $getFloat32Array9();
        expect(array1.length).toBe(9);
        expect(Array.from(array1)).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
        
        array1[0] = 1;
        array1[1] = 2;
        
        $poolFloat32Array9(array1);
        
        const array2 = $getFloat32Array9();
        expect(array2).toBe(array1); // Should reuse pooled array
        expect(Array.from(array2)).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]); // Should be reset
    });

    it("should manage number array pool correctly", () =>
    {
        const array1 = $getArray();
        expect(Array.isArray(array1)).toBe(true);
        expect(array1.length).toBe(0);
        
        array1.push(1, 2, 3);
        $poolArray(array1);
        expect(array1.length).toBe(0); // Should be cleared
        
        const array2 = $getArray();
        expect(array2).toBe(array1); // Should reuse pooled array
    });
});