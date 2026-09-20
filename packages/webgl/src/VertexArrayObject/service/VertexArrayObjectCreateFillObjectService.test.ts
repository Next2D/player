import { execute } from "./VertexArrayObjectCreateFillObjectService";
import { describe, expect, it, vi } from "vitest";

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


describe("VertexArrayObjectCreateFillObjectService.js method test", () =>
{
    it("test case", () =>
    {


        const vertexArrayObject = execute();
        expect(vertexArrayObject.resource).toBe("createVertexArray");
        expect(vertexArrayObject.vertexBuffer).toBe("createBuffer");
        expect(vertexArrayObject.vertexLength).toBe(0);
    });
});