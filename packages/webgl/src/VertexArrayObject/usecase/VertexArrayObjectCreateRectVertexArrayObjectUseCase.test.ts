import { execute } from "./VertexArrayObjectCreateRectVertexArrayObjectUseCase";
import { describe, expect, it, vi } from "vitest";

describe("VertexArrayObjectCreateRectVertexArrayObjectUseCase.js method test", () =>
{
    it("test case", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "createVertexArray": vi.fn(() => "testVertexArray"),
                    "createBuffer": vi.fn(() => "testBuffer"),
                    "bindVertexArray": vi.fn(),
                    "bindBuffer": vi.fn(),
                    "bufferData": vi.fn(),
                    "enableVertexAttribArray": vi.fn(),
                    "vertexAttribPointer": vi.fn(),
                    "ARRAY_BUFFER": 34962,
                    "STATIC_DRAW": 35044,
                    "FLOAT": 5126
                }
            }
        });

        const vertexArrayObject = execute();

        expect(vertexArrayObject.resource).toBeDefined();
        expect(vertexArrayObject.vertexBuffer).toBeDefined();
        expect(vertexArrayObject.vertexLength).toBe(0);
    });
});
