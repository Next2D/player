import { execute } from "./StencilSetFillModeService";
import { describe, expect, it, beforeEach, vi } from "vitest";
import * as StencilModule from "../../Stencil";

vi.mock("../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
    return {
        ...mod,
        $gl: {
            stencilFunc: vi.fn(),
            stencilOp: vi.fn(),
            colorMask: vi.fn(),
            NOTEQUAL: 0x0205,
            KEEP: 0x1E00,
            ZERO: 0
        }
    };
});

describe("StencilSetFillModeService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        StencilModule.$resetStencilMode();
        StencilModule.$setColorMaskEnabled(false);
    });

    it("test case - should set fill mode on first call", () =>
    {
        expect(() => {
            execute();
        }).not.toThrow();

        expect(StencilModule.$getStencilMode()).toBe(StencilModule.STENCIL_MODE_FILL);
        expect(StencilModule.$getColorMaskEnabled()).toBe(true);
    });

    it("test case - should not change state on subsequent calls", () =>
    {
        execute();
        execute();

        expect(StencilModule.$getStencilMode()).toBe(StencilModule.STENCIL_MODE_FILL);
    });
});
