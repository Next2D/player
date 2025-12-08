import { execute } from "./StencilSetMaskModeService";
import { describe, expect, it, beforeEach, vi } from "vitest";
import * as StencilModule from "../../Stencil";

vi.mock("../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
    return {
        ...mod,
        $gl: {
            stencilFunc: vi.fn(),
            stencilOpSeparate: vi.fn(),
            colorMask: vi.fn(),
            ALWAYS: 0x0207,
            KEEP: 0x1E00,
            INCR_WRAP: 0x8507,
            DECR_WRAP: 0x8508,
            FRONT: 0x0404,
            BACK: 0x0405
        }
    };
});

describe("StencilSetMaskModeService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        StencilModule.$resetStencilMode();
        StencilModule.$setColorMaskEnabled(true);
    });

    it("test case - should set mask mode on first call", () =>
    {
        expect(() => {
            execute();
        }).not.toThrow();

        expect(StencilModule.$getStencilMode()).toBe(StencilModule.STENCIL_MODE_MASK);
        expect(StencilModule.$getColorMaskEnabled()).toBe(false);
    });

    it("test case - should not change state on subsequent calls", () =>
    {
        execute();
        execute();

        expect(StencilModule.$getStencilMode()).toBe(StencilModule.STENCIL_MODE_MASK);
    });
});
