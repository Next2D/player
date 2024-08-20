import { execute } from "./BlendSourceInService";
import { describe, expect, it, vi } from "vitest";
import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";

describe("BlendSourceInService.js method test", () =>
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
                        expect(dfactor).toBe("ZERO");
                    }),
                    "DST_ALPHA": "DST_ALPHA",
                    "ZERO": "ZERO"
                }
            }
        });

        $setFuncCode(600);
        expect($getFuncCode()).toBe(600);
        execute();
        expect($getFuncCode()).toBe(670);
    });
});