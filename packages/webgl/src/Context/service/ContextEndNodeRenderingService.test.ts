import { execute } from "./ContextEndNodeRenderingService";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../WebGLUtil.ts", async (importOriginal) =>
{
    const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
    return {
        ...mod,
        $gl: {
            "SCISSOR_TEST": "SCISSOR_TEST",
            "disable": vi.fn((v) => {
                expect(v).toBe("SCISSOR_TEST");
            })
        }
    }
});


describe("ContextEndNodeRenderingService.js method test", () =>
{
    it("test case", () =>
    {

    });

    execute();
});