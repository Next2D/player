import { execute } from "./ShaderManagerInitializeUniformService";
import { describe, expect, it, vi } from "vitest";

describe("ShaderManagerInitializeUniformService.js method test", () =>
{
    it("test case", () =>
    {
        vi.mock("../../../WebGLUtil.ts", async (importOriginal) => 
        {
            let count = 0;
            let types = 0;
            const mod = await importOriginal<typeof import("../../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "FLOAT_VEC4": 0,
                    "INT_VEC4": 1,
                    "SAMPLER_2D": 2,
                    "uniform4fv": vi.fn(() => { return "uniform4fv" }),
                    "uniform4iv": vi.fn(() => { return "uniform4iv" }),
                    "uniform1iv": vi.fn(() => { return "uniform1iv" }),
                    "getUniformLocation": vi.fn(() => { return 0 }),
                    "getProgramParameter": vi.fn(() => { return 3 }),
                    "getActiveUniform": vi.fn(() =>
                    { 
                        return { 
                            "name": `test${count++}`, 
                            "type": types++, 
                            "size": 10 
                        }
                    }),
                }
            }
        });

        const map = new Map();
        expect(map.size).toBe(0);
        
        execute({}, map);
        expect(map.size).toBe(3);

        const test0 = map.get("test0");
        expect(test0.method()).toBe("uniform4fv");
        expect(test0.array.length).toBe(40);
        expect(test0.assign).toBe(-1);

        const test1 = map.get("test1");
        expect(test1.method()).toBe("uniform4iv");
        expect(test1.array.length).toBe(40);
        expect(test1.assign).toBe(-1);

        const test2 = map.get("test2");
        expect(test2.method()).toBe("uniform1iv");
        expect(test2.array.length).toBe(10);
        expect(test2.assign).toBe(1);
    });
});