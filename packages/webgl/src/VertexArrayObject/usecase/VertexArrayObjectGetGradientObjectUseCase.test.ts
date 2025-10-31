import { execute } from "./VertexArrayObjectGetGradientObjectUseCase";
import { describe, expect, it, vi } from "vitest";
import { $vertexBufferData } from "../../VertexArrayObject";

describe("VertexArrayObjectGetGradientObjectUseCase.js method test", () =>
{
    it("test case - create new gradient object", () =>
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

        $vertexBufferData[0] = 0;
        $vertexBufferData[2] = 0;
        $vertexBufferData[4] = 0;
        $vertexBufferData[6] = 0;

        const vertexArrayObject = execute(0, 1);

        expect(vertexArrayObject.resource).toBe("createVertexArray");
        expect(vertexArrayObject.vertexBuffer).toBe("createBuffer");
        expect(vertexArrayObject.vertexLength).toBe(0);
    });

    it("test case - reuse existing gradient object with same values", () =>
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

        $vertexBufferData[0] = 0;
        $vertexBufferData[2] = 0;
        $vertexBufferData[4] = 1;
        $vertexBufferData[6] = 1;

        const vertexArrayObject1 = execute(0, 1);
        const vertexArrayObject2 = execute(0, 1);

        expect(vertexArrayObject1).toBe(vertexArrayObject2);
    });
});
