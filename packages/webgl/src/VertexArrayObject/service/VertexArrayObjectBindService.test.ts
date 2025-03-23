import { execute } from "./VertexArrayObjectBindService";
import { describe, expect, it, vi } from "vitest";

describe("VertexArrayObjectBindService.js method test", () =>
{
    it("test case", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "bindVertexArray": vi.fn((resource) => { 
                        expect(resource).toBe("createVertexArray");
                    }),
                },
            }
        });

        const vertexArrayObject = {
            "resource": "createVertexArray",
            "indexRanges": [],
            "vertexBuffer": "createBuffer",
            "vertexLength": 0,
        };

        execute(vertexArrayObject);
    });
});