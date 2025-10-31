import { execute } from "./VertexArrayObjectBootUseCase";
import { describe, expect, it, vi } from "vitest";

describe("VertexArrayObjectBootUseCase.js method test", () =>
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
                    "vertexAttribDivisor": vi.fn(() => { return "vertexAttribDivisor" }),
                    "bufferData": vi.fn(() => { return "bufferData" }),
                    "ARRAY_BUFFER": 34962,
                    "STATIC_DRAW": 35044,
                    "DYNAMIC_DRAW": 35048,
                    "FLOAT": 5126
                }
            }
        });

        vi.mock("@next2d/render-queue", () => ({
            renderQueue: {
                buffer: new Float32Array(1000)
            }
        }));

        const mockGl = {
            "createBuffer": vi.fn(() => "testBuffer")
        } as unknown as WebGL2RenderingContext;

        expect(() => execute(mockGl)).not.toThrow();
    });
});
