import { execute } from "./VertexArrayObjectCreateGradientVertexArrayObjectUseCase";
import { describe, expect, it, vi } from "vitest";
import { $vertexBufferData } from "../../VertexArrayObject";

describe("VertexArrayObjectCreateGradientVertexArrayObjectUseCase.js method test", () =>
{
    it("test case", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "createVertexArray": vi.fn(() => { return "createVertexArray" }),
                    "createBuffer": vi.fn(() => { return "createBuffer" }),
                    "bindVertexArray": vi.fn(() => { return "bindVertexArray" }),
                    "bindBuffer": vi.fn(() => { return "bindBuffer" }),
                    "enableVertexAttribArray": vi.fn(() => { return "enableVertexAttribArray" }),
                    "vertexAttribPointer": vi.fn(() => { return "vertexAttribPointer" }),
                    "bufferData": vi.fn(() => { return "bufferData" }),
                    "bufferSubData": vi.fn(() => { return "bufferSubData" }),
                },
                $context: {
                    "$fillStyle": new Float32Array([0, 0, 0, 1]),
                    "$matrix": new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                }
            }
        });

        // new Float32Array([0, 0, 0, 1, 1, 0, 1, 1])
        $vertexBufferData[0] = 0;
        $vertexBufferData[2] = 0;
        $vertexBufferData[4] = 1;
        $vertexBufferData[6] = 1;
        expect($vertexBufferData[0]).toBe(0);
        expect($vertexBufferData[2]).toBe(0);
        expect($vertexBufferData[4]).toBe(1);
        expect($vertexBufferData[6]).toBe(1);

        const vertexArrayObject = execute(0.2, 0.8);

        expect($vertexBufferData[0]).toBe(0.20000000298023224);
        expect($vertexBufferData[2]).toBe(0.20000000298023224);
        expect($vertexBufferData[4]).toBe(0.800000011920929);
        expect($vertexBufferData[6]).toBe(0.800000011920929);
        expect(vertexArrayObject.resource).toBe("createVertexArray");
        expect(vertexArrayObject.vertexBuffer).toBe("createBuffer");
        expect(vertexArrayObject.vertexLength).toBe(0);
    });
});