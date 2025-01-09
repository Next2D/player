import { execute } from "./VertexArrayObjectGetFillObjectUseCase";
import { describe, expect, it, vi } from "vitest";

describe("VertexArrayObjectGetFillObjectUseCase.js method test", () =>
{
    it("test case", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            let enableVertexAttribArray = 0;
            let vertexAttribPointer = 0;
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "createVertexArray": vi.fn(() => { return  "createVertexArray" }),
                    "createBuffer": vi.fn(() => { return  "createBuffer" }),
                    "bindVertexArray": vi.fn(() => { return  "bindVertexArray" }),
                    "bindBuffer": vi.fn((target, buffer) => {
                        expect(buffer).toBe("createBuffer");
                    }),
                    "enableVertexAttribArray": vi.fn((index) => {
                        expect(index).toBe(enableVertexAttribArray++);
                    }),
                    "vertexAttribPointer": vi.fn((index) => {
                        expect(index).toBe(vertexAttribPointer++);
                    })
                }
            }
        });

        const vertexArrayObject = execute();
        expect(vertexArrayObject.resource).toBe("createVertexArray");
        expect(vertexArrayObject.vertexBuffer).toBe("createBuffer");
        expect(vertexArrayObject.vertexLength).toBe(0);
    });
});