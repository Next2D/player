import { execute } from "./ShaderManagerCreateProgramService";
import { describe, expect, it, vi } from "vitest";

describe("ShaderManagerCreateProgramService.js method test", () =>
{
    it("test case", () =>
    {
        vi.mock("../../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "createProgram": vi.fn(() => { return  "createProgram" }),
                    "createShader": vi.fn(() => { return  "createShader" }),
                    "shaderSource": vi.fn(() => { return  "shaderSource" }),
                    "compileShader": vi.fn(() => { return  "compileShader" }),
                    "attachShader": vi.fn(() => { return  "attachShader" }),
                    "linkProgram": vi.fn(() => { return  "linkProgram" }),
                    "detachShader": vi.fn(() => { return  "detachShader" }),
                    "deleteShader": vi.fn(() => { return  "deleteShader" }),
                }
            }
        });

        const programObject = execute("", "");
        expect(programObject.resource).toBe("createProgram");
    });
});