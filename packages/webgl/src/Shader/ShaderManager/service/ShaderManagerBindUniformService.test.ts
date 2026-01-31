import { execute } from "./ShaderManagerBindUniformService";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { IUniformData } from "../../../interface/IUniformData";

describe("ShaderManagerBindUniformService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should bind uniform with negative assign value", () =>
    {
        const mockMethod = vi.fn();
        const uniformMap = new Map<string, IUniformData>();
        uniformMap.set("u_test", {
            method: mockMethod,
            assign: -1,
            array: new Float32Array([1, 2, 3])
        });

        execute(uniformMap);

        expect(mockMethod).toHaveBeenCalledTimes(1);
        expect(mockMethod).toHaveBeenCalledWith(new Float32Array([1, 2, 3]));
    });

    it("test case - should bind uniform with positive assign value", () =>
    {
        const mockMethod = vi.fn();
        const uniformData: IUniformData = {
            method: mockMethod,
            assign: 2,
            array: new Float32Array([4, 5, 6])
        };
        const uniformMap = new Map<string, IUniformData>();
        uniformMap.set("u_test", uniformData);

        execute(uniformMap);

        expect(mockMethod).toHaveBeenCalledTimes(1);
        expect(uniformData.assign).toBe(1);
    });

    it("test case - should not bind uniform with zero assign value", () =>
    {
        const mockMethod = vi.fn();
        const uniformMap = new Map<string, IUniformData>();
        uniformMap.set("u_test", {
            method: mockMethod,
            assign: 0,
            array: new Float32Array([7, 8, 9])
        });

        execute(uniformMap);

        expect(mockMethod).not.toHaveBeenCalled();
    });

    it("test case - should skip uniform without method", () =>
    {
        const uniformMap = new Map<string, IUniformData>();
        uniformMap.set("u_test", {
            method: undefined,
            assign: -1,
            array: new Float32Array([1, 2, 3])
        });

        expect(() => execute(uniformMap)).not.toThrow();
    });

    it("test case - should skip uniform without assign", () =>
    {
        const mockMethod = vi.fn();
        const uniformMap = new Map<string, IUniformData>();
        uniformMap.set("u_test", {
            method: mockMethod,
            assign: undefined,
            array: new Float32Array([1, 2, 3])
        });

        execute(uniformMap);

        expect(mockMethod).not.toHaveBeenCalled();
    });

    it("test case - should bind multiple uniforms", () =>
    {
        const mockMethod1 = vi.fn();
        const mockMethod2 = vi.fn();
        const uniformMap = new Map<string, IUniformData>();
        uniformMap.set("u_test1", {
            method: mockMethod1,
            assign: -1,
            array: new Float32Array([1, 2])
        });
        uniformMap.set("u_test2", {
            method: mockMethod2,
            assign: -1,
            array: new Float32Array([3, 4])
        });

        execute(uniformMap);

        expect(mockMethod1).toHaveBeenCalledTimes(1);
        expect(mockMethod2).toHaveBeenCalledTimes(1);
    });
});
