import { execute } from "./BlendAlphaService";
import { describe, expect, it, vi } from "vitest";
import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";

describe("BlendAlphaService.js method test", () =>
{
    it("test case", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "blendFunc": vi.fn((sfactor, dfactor) =>
                    {
                        expect(sfactor).toBe("ZERO");
                        expect(dfactor).toBe("SRC_ALPHA");
                    }),
                    "ZERO": "ZERO",
                    "SRC_ALPHA": "SRC_ALPHA"
                }
            }
        });

        $setFuncCode(600);
        expect($getFuncCode()).toBe(600);
        execute();
        expect($getFuncCode()).toBe(606);
    });
});