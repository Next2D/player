import { execute } from "./BlnedClearArraysInstancedUseCase";
import { execute as variantsBlendInstanceShaderService } from "../../Shader/Variants/Blend/service/VariantsBlendInstanceShaderService.ts";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
{
    const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
    return {
        ...mod,
        $gl: {
            "createProgram": vi.fn(() => "createProgram"),
            "createShader": vi.fn(() => "createShader"),
            "shaderSource": vi.fn(() => "shaderSource"),
            "compileShader": vi.fn(() => "compileShader"),
            "attachShader": vi.fn(() => "attachShader"),
            "linkProgram": vi.fn(() => "linkProgram"),
            "detachShader": vi.fn(() => "detachShader"),
            "deleteShader": vi.fn(() => "deleteShader"),
            "getProgramParameter": vi.fn(() => "getProgramParameter"),
        }
    }
});

describe("BlnedClearArraysInstancedUseCase.js method test", () =>
{
    it("test case", () =>
    {
        const shaderInstancedManager = variantsBlendInstanceShaderService();
        shaderInstancedManager.count++;
        shaderInstancedManager.attributes.push(1,2,3);

        expect(shaderInstancedManager.count).toBe(1);
        expect(shaderInstancedManager.attributes.length).toBe(3);
        
        execute();

        expect(shaderInstancedManager.count).toBe(0);
        expect(shaderInstancedManager.attributes.length).toBe(0);
    });
});