import { execute } from "./BlendScreenService";
import { describe, expect, it, vi } from "vitest";
import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";

describe("BlendScreenService.js method test", () =>
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
                        expect(sfactor).toBe("ONE_MINUS_DST_COLOR");
                        expect(dfactor).toBe("ONE");
                    }),
                    "ONE_MINUS_DST_COLOR": "ONE_MINUS_DST_COLOR",
                    "ONE": "ONE"
                }
            }
        });

        $setFuncCode(600);
        expect($getFuncCode()).toBe(600);
        execute();
        expect($getFuncCode()).toBe(641);
    });
});