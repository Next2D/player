import { execute } from "./ContextEndNodeRenderingService";
import { describe, expect, it, vi } from "vitest";

describe("ContextEndNodeRenderingService.js method test", () =>
{
    it("test case", () =>
    {
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
    });

    execute();
});