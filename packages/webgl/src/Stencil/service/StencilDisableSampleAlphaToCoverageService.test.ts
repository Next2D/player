import { execute } from "./StencilDisableSampleAlphaToCoverageService";
import { describe, expect, it, vi, beforeEach } from "vitest";

let mockEnabled = true;

vi.mock("../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
    return {
        ...mod,
        $gl: {
            SAMPLE_ALPHA_TO_COVERAGE: 0x809E,
            disable: vi.fn()
        }
    };
});

vi.mock("../../Stencil.ts", () => ({
    $getSampleAlphaToCoverageEnabled: vi.fn(() => mockEnabled),
    $setSampleAlphaToCoverageEnabled: vi.fn((value: boolean) => { mockEnabled = value; })
}));

import { $gl } from "../../WebGLUtil";
import { $getSampleAlphaToCoverageEnabled, $setSampleAlphaToCoverageEnabled } from "../../Stencil";

describe("StencilDisableSampleAlphaToCoverageService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        mockEnabled = true;
    });

    it("test case - should disable sample alpha to coverage when enabled", () =>
    {
        mockEnabled = true;

        execute();

        expect($setSampleAlphaToCoverageEnabled).toHaveBeenCalledWith(false);
        expect($gl.disable).toHaveBeenCalledWith(0x809E);
    });

    it("test case - should not disable when already disabled", () =>
    {
        mockEnabled = false;

        execute();

        expect($setSampleAlphaToCoverageEnabled).not.toHaveBeenCalled();
        expect($gl.disable).not.toHaveBeenCalled();
    });
});
