import { execute } from "./ContextBeginNodeRenderingService";
import { describe, expect, it, vi } from "vitest";

let scissorCallCount = 0;

vi.mock("../../WebGLUtil.ts", async (importOriginal) =>
{
    const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
    return {
        ...mod,
        $enableScissorTest: vi.fn(),
        $gl: {
            "SCISSOR_TEST": "SCISSOR_TEST",
            "COLOR_BUFFER_BIT": 1,
            "STENCIL_BUFFER_BIT": 2,
            "enable": vi.fn(),
            "scissor": vi.fn((x, y, w, h) => {
                expect(x).toBe(1);
                expect(y).toBe(2);
                if (scissorCallCount === 0) {
                    expect(w).toBe(4);
                    expect(h).toBe(5);
                } else {
                    expect(w).toBe(3);
                    expect(h).toBe(4);
                }
                scissorCallCount++;
            }),
            "clear": vi.fn((v) => {
                expect(v).toBe(3);
            }),
            "viewport": vi.fn((x, y, w, h) => {
                expect(x).toBe(1);
                expect(y).toBe(2);
                expect(w).toBe(3);
                expect(h).toBe(4);
            })
        },
        $context: {
            "$clearColorR": 0,
            "$clearColorG": 0,
            "$clearColorB": 0,
            "$clearColorA": 0
        }
    }
});

describe("ContextBeginNodeRenderingService.js method test", () =>
{
    it("test case", () =>
    {
        execute(1, 2, 3, 4);
    });
});