import { execute } from "./VertexArrayObjectCreateInstancedVertexArrayObjectUseCase";
import { describe, expect, it, vi } from "vitest";

describe("VertexArrayObjectCreateInstancedVertexArrayObjectUseCase.js method test", () =>
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
                    "vertexAttribDivisor": vi.fn(),
                    "ARRAY_BUFFER": 34962,
                    "STATIC_DRAW": 35044,
                    "DYNAMIC_DRAW": 35048,
                    "FLOAT": 5126
                }
            }
        });

        vi.mock("../../VertexArrayObject.ts", async (importOriginal) =>
        {
            const mod = await importOriginal<typeof import("../../VertexArrayObject.ts")>();
            return {
                ...mod,
                $attributeWebGLBuffer: "testAttributeBuffer"
            }
        });

        vi.mock("@next2d/render-queue", () => ({
            renderQueue: {
                buffer: new Float32Array(1000)
            }
        }));

        const vertexArrayObject = execute();

        expect(vertexArrayObject.resource).toBeDefined();
        expect(vertexArrayObject.vertexBuffer).toBeDefined();
        expect(vertexArrayObject.vertexLength).toBe(0);
    });
});
