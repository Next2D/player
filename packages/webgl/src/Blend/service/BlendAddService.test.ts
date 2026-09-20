import { execute } from "./BlendAddService";
import { describe, expect, it, vi } from "vitest";
import {
    $funcCode,
    $setFuncCode
} from "../../Blend";

vi.mock("../../WebGLUtil.ts", async (importOriginal) =>
{
    const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
    return {
        ...mod,
        $gl: {
            "blendFunc": vi.fn((sfactor, dfactor) =>
            {
                expect(sfactor).toBe("ONE");
                expect(dfactor).toBe("ONE");
            }),
            "ONE": "ONE",
        }
    }
});

describe("BlendAddService.js method test", () =>
{
    it("test case", () =>
    {
        $setFuncCode(600);
        expect($funcCode).toBe(600);
        execute();
        expect($funcCode).toBe(611);
    });
});
