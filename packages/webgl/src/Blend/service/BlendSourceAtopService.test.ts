import { execute } from "./BlendSourceAtopService";
import { describe, expect, it, vi } from "vitest";
import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";

describe("BlendSourceAtopService.js method test", () =>
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
                        expect(sfactor).toBe("DST_ALPHA");
                        expect(dfactor).toBe("ONE_MINUS_SRC_ALPHA");
                    }),
                    "DST_ALPHA": "DST_ALPHA",
                    "ONE_MINUS_SRC_ALPHA": "ONE_MINUS_SRC_ALPHA"
                }
            }
        });

        $setFuncCode(600);
        expect($getFuncCode()).toBe(600);
        execute();
        expect($getFuncCode()).toBe(673);
    });
});