import type { IVertexArrayObject } from "../../interface/IVertexArrayObject.ts";
import { execute } from "./VertexArrayObjectBindService";
import { describe, expect, it, vi } from "vitest";

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


describe("VertexArrayObjectBindService.js method test", () =>
{
    it("test case", () =>
    {


        const vertexArrayObject = {
            "id": 1,
            "resource": "createVertexArray",
            "vertexBuffer": "createBuffer",
            "vertexLength": 0,
        } as IVertexArrayObject;

        execute(vertexArrayObject);
    });
});