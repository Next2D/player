import { Context } from "../../Context";
import { execute } from "./ContextClearRectService";
import { describe, expect, it, vi } from "vitest";

describe("ContextClearRectService.js method test", () =>
{
    it("test case", async () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "enable": vi.fn(() => { return "enable" }),
                    "clear": vi.fn(() => { return "enable" }),
                    "disable": vi.fn(() => { return "enable" }),
                    "scissor": vi.fn((x, y, w, h) =>
                    {
                        expect(x).toBe(1);
                        expect(y).toBe(2);
                        expect(w).toBe(3);
                        expect(h).toBe(4); 
                    }),
                }
            }
        });

        execute(1, 2, 3, 4);
    });
});