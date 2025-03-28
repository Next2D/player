import { execute } from "./BlendBootUseCase";
import { describe, expect, it, vi } from "vitest";
import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";



describe("BlendBootUseCase.js method test", () =>
{
    it("test case add", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "enable": vi.fn((cap) =>
                    {
                        expect(cap).toBe("BLEND")
                    }),
                    "blendFunc": vi.fn((src, dst) =>
                    {
                        expect(src).toBe("ONE");
                        expect(dst).toBe("ONE_MINUS_SRC_ALPHA");
                    }),
                    "BLEND": "BLEND",
                    "ONE": "ONE",
                    "ONE_MINUS_SRC_ALPHA": "ONE_MINUS_SRC_ALPHA"
                }
            }
        });

        $setFuncCode(0);
        expect($getFuncCode()).toBe(0);
        execute();

        expect($getFuncCode()).toBe(613);
    });
});