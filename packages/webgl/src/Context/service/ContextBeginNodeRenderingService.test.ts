import { execute } from "./ContextBeginNodeRenderingService";
import { describe, expect, it, vi } from "vitest";

describe("ContextBeginNodeRenderingService.js method test", () =>
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
                    "enable": vi.fn((v) => {
                        expect(v).toBe("SCISSOR_TEST");
                    }),
                    "scissor": vi.fn((x, y, w, h) => {
                        expect(x).toBe(1);
                        expect(y).toBe(2);
                        expect(w).toBe(3);
                        expect(h).toBe(4);
                    }),
                    "clear": vi.fn((v) => { return "clear"; }),
                    "viewport": vi.fn((x, y, w, h) => {
                        expect(x).toBe(1);
                        expect(y).toBe(2);
                        expect(w).toBe(3);
                        expect(h).toBe(4);
                    })
                }
            }
        });
    });

    execute(1, 2, 3, 4);
});