import { execute } from "./BlendOneZeroService";
import { describe, expect, it, vi } from "vitest";
import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";

describe("BlendOneZeroService.js method test", () =>
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
                        expect(sfactor).toBe("ONE");
                        expect(dfactor).toBe("ZERO");
                    }),
                    "ONE": "ONE",
                    "ZERO": "ZERO"
                }
            }
        });

        $setFuncCode(600);
        expect($getFuncCode()).toBe(600);
        execute();
        expect($getFuncCode()).toBe(610);
    });
});