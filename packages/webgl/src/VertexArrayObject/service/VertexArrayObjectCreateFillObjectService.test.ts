import type { IIndexRange } from "../../interface/IIndexRange.ts";
import { execute } from "./VertexArrayObjectCreateFillObjectService";
import { describe, expect, it, vi } from "vitest";

describe("VertexArrayObjectCreateFillObjectService.js method test", () =>
{
    it("test case", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "createVertexArray": vi.fn(() => { return  "createVertexArray" }),
                    "createBuffer": vi.fn(() => { return  "createBuffer" }),
                }
            }
        });

        const vertexArrayObject = execute();
        expect(vertexArrayObject.resource).toBe("createVertexArray");
        expect(vertexArrayObject.vertexBuffer).toBe("createBuffer");
        expect(vertexArrayObject.vertexLength).toBe(0);
    });
});