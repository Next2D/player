import { execute } from "./StencilResetService";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../Stencil.ts", () => ({
    $resetStencilMode: vi.fn(),
    $setColorMaskEnabled: vi.fn(),
    $setSampleAlphaToCoverageEnabled: vi.fn()
}));

import {
    $resetStencilMode,
    $setColorMaskEnabled,
    $setSampleAlphaToCoverageEnabled
} from "../../Stencil";

describe("StencilResetService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should reset all stencil states", () =>
    {
        execute();

        expect($resetStencilMode).toHaveBeenCalledTimes(1);
        expect($setColorMaskEnabled).toHaveBeenCalledWith(true);
        expect($setSampleAlphaToCoverageEnabled).toHaveBeenCalledWith(false);
    });

    it("test case - should call functions in correct order", () =>
    {
        const callOrder: string[] = [];

        vi.mocked($resetStencilMode).mockImplementation(() => callOrder.push("resetStencilMode"));
        vi.mocked($setColorMaskEnabled).mockImplementation(() => callOrder.push("setColorMaskEnabled"));
        vi.mocked($setSampleAlphaToCoverageEnabled).mockImplementation(() => callOrder.push("setSampleAlphaToCoverageEnabled"));

        execute();

        expect(callOrder).toEqual([
            "resetStencilMode",
            "setColorMaskEnabled",
            "setSampleAlphaToCoverageEnabled"
        ]);
    });
});
