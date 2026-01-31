import { execute } from "./StencilEnableSampleAlphaToCoverageService";
import { describe, expect, it, vi, beforeEach } from "vitest";

let mockEnabled = false;

vi.mock("../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
    return {
        ...mod,
        $gl: {
            SAMPLE_ALPHA_TO_COVERAGE: 0x809E,
            enable: vi.fn()
        }
    };
});

vi.mock("../../Stencil.ts", () => ({
    $getSampleAlphaToCoverageEnabled: vi.fn(() => mockEnabled),
    $setSampleAlphaToCoverageEnabled: vi.fn((value: boolean) => { mockEnabled = value; })
}));

import { $gl } from "../../WebGLUtil";
import { $getSampleAlphaToCoverageEnabled, $setSampleAlphaToCoverageEnabled } from "../../Stencil";

describe("StencilEnableSampleAlphaToCoverageService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        mockEnabled = false;
    });

    it("test case - should enable sample alpha to coverage when disabled", () =>
    {
        mockEnabled = false;

        execute();

        expect($setSampleAlphaToCoverageEnabled).toHaveBeenCalledWith(true);
        expect($gl.enable).toHaveBeenCalledWith(0x809E);
    });

    it("test case - should not enable when already enabled", () =>
    {
        mockEnabled = true;

        execute();

        expect($setSampleAlphaToCoverageEnabled).not.toHaveBeenCalled();
        expect($gl.enable).not.toHaveBeenCalled();
    });
});
