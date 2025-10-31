import { execute } from "./VertexArrayObjectBindAttributeUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";

describe("VertexArrayObjectBindAttributeUseCase.js method test", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    it("test case", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "bindVertexArray": vi.fn(() => { return "bindVertexArray" }),
                    "bindBuffer": vi.fn(() => { return "bindBuffer" }),
                    "bufferData": vi.fn(() => { return "bufferData" }),
                    "bufferSubData": vi.fn(() => { return "bufferSubData" }),
                    "ARRAY_BUFFER": 34962,
                    "DYNAMIC_DRAW": 35048,
                }
            }
        });

        vi.mock("../../VertexArrayObject.ts", async (importOriginal) =>
        {
            const mod = await importOriginal<typeof import("../../VertexArrayObject.ts")>();
            return {
                ...mod,
                $instancedVertexArrayObject: {
                    "id": 1,
                    "resource": "testVertexArray",
                    "vertexBuffer": "testBuffer",
                    "vertexLength": 0
                },
                $attributeWebGLBuffer: "testAttributeBuffer"
            }
        });

        vi.mock("@next2d/render-queue", () => ({
            renderQueue: {
                buffer: new Float32Array(100),
                offset: 50
            }
        }));

        expect(() => execute()).not.toThrow();
    });
});
