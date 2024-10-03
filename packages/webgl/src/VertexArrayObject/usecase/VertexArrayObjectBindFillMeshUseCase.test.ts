import type { IIndexRange } from "../../interface/IIndexRange";
import { execute } from "./VertexArrayObjectBindFillMeshUseCase";
import { describe, expect, it, vi } from "vitest";

describe("VertexArrayObjectBindFillMeshUseCase.js method test", () =>
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

        const vertexArrayObject = execute([[
            0, 0, false,
            0, 120, false,
            120, 120, true,
            0, 0, false
        ]]);

        expect(vertexArrayObject.resource).toBe("createVertexArray");
        expect(vertexArrayObject.indexCount).toBe(6);
        expect(vertexArrayObject.vertexBuffer).toBe("createBuffer");
        expect(vertexArrayObject.vertexLength).toBe(128);
    });
});