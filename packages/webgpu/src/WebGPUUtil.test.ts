import { describe, it, expect, beforeEach } from "vitest";
import {
    $samples,
    WebGPUUtil,
    $context,
    $setContext,
    $getFloat32Array4,
    $poolFloat32Array4
} from "./WebGPUUtil";

describe("WebGPUUtil", () =>
{
    describe("$samples", () =>
    {
        it("should have default value", () =>
        {
            expect(typeof $samples).toBe("number");
        });
    });

    describe("WebGPUUtil class", () =>
    {
        beforeEach(() =>
        {
            WebGPUUtil.setDevicePixelRatio(1);
            WebGPUUtil.setRenderMaxSize(8192);
        });

        describe("devicePixelRatio", () =>
        {
            it("should set and get device pixel ratio", () =>
            {
                WebGPUUtil.setDevicePixelRatio(2);
                expect(WebGPUUtil.getDevicePixelRatio()).toBe(2);

                WebGPUUtil.setDevicePixelRatio(1.5);
                expect(WebGPUUtil.getDevicePixelRatio()).toBe(1.5);
            });
        });

        describe("renderMaxSize", () =>
        {
            it("should set and get render max size", () =>
            {
                WebGPUUtil.setRenderMaxSize(4096);
                expect(WebGPUUtil.getRenderMaxSize()).toBe(4096);

                WebGPUUtil.setRenderMaxSize(16384);
                expect(WebGPUUtil.getRenderMaxSize()).toBe(16384);
            });
        });

        describe("createFloat32Array", () =>
        {
            it("should create Float32Array with specified length", () =>
            {
                const arr = WebGPUUtil.createFloat32Array(10);
                expect(arr).toBeInstanceOf(Float32Array);
                expect(arr.length).toBe(10);
            });
        });

        describe("createArray", () =>
        {
            it("should create empty array", () =>
            {
                const arr = WebGPUUtil.createArray<number>();
                expect(Array.isArray(arr)).toBe(true);
                expect(arr.length).toBe(0);
            });
        });

        describe("Float32Array4 pool", () =>
        {
            it("should get Float32Array of length 4", () =>
            {
                const arr = WebGPUUtil.getFloat32Array4();
                expect(arr).toBeInstanceOf(Float32Array);
                expect(arr.length).toBe(4);
            });

            it("should pool and reuse Float32Array", () =>
            {
                const arr1 = WebGPUUtil.getFloat32Array4();
                arr1[0] = 99;
                WebGPUUtil.poolFloat32Array4(arr1);

                const arr2 = WebGPUUtil.getFloat32Array4();
                expect(arr2).toBe(arr1);
                expect(arr2[0]).toBe(99);
            });

            it("should not pool arrays of wrong length", () =>
            {
                const wrongArr = new Float32Array(5);
                WebGPUUtil.poolFloat32Array4(wrongArr);

                const arr = WebGPUUtil.getFloat32Array4();
                expect(arr).not.toBe(wrongArr);
            });
        });
    });

    describe("context functions", () =>
    {
        it("should set and get context", () =>
        {
            const mockContext = { "id": "test-context" };
            $setContext(mockContext);
            expect($context).toBe(mockContext);

            $setContext(null); // Reset
        });
    });

    describe("Float32Array4 helper functions", () =>
    {
        it("should get Float32Array4 via helper", () =>
        {
            const arr = $getFloat32Array4();
            expect(arr).toBeInstanceOf(Float32Array);
            expect(arr.length).toBe(4);
        });

        it("should pool Float32Array4 via helper", () =>
        {
            const arr = $getFloat32Array4();
            arr[0] = 123;
            $poolFloat32Array4(arr);

            const reused = $getFloat32Array4();
            expect(reused[0]).toBe(123);
        });
    });
});
