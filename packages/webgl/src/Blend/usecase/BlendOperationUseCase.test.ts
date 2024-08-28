import { execute } from "./BlendOperationUseCase";
import { describe, expect, it, vi } from "vitest";
import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";

vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
{
    const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
    return {
        ...mod,
        $gl: {
            "blendFunc": vi.fn(() => "blendFunc"),
            "ONE_MINUS_SRC_ALPHA": "ONE_MINUS_SRC_ALPHA",
            "ONE_MINUS_DST_COLOR": "ONE_MINUS_DST_COLOR",
            "ONE": "ONE",
            "SRC_ALPHA": "SRC_ALPHA",
            "ZERO": "ZERO",
        }
    }
});

describe("BlendOperationUseCase.js method test", () =>
{
    it("test case add", () =>
    {
        $setFuncCode(600);
        expect($getFuncCode()).toBe(600);
        execute("add");
        expect($getFuncCode()).toBe(611);
    });

    it("test case screen", () =>
    {
        $setFuncCode(600);
        expect($getFuncCode()).toBe(600);
        execute("screen");
        expect($getFuncCode()).toBe(641);
    });

    it("test case alpha", () =>
    {
        $setFuncCode(600);
        expect($getFuncCode()).toBe(600);
        execute("alpha");
        expect($getFuncCode()).toBe(606);
    });

    it("test case erase", () =>
    {
        $setFuncCode(600);
        expect($getFuncCode()).toBe(600);
        execute("erase");
        expect($getFuncCode()).toBe(603);
    });

    it("test case copy", () =>
    {
        $setFuncCode(600);
        expect($getFuncCode()).toBe(600);
        execute("copy");
        expect($getFuncCode()).toBe(610);
    });

    it("test case normal", () =>
    {
        $setFuncCode(600);
        expect($getFuncCode()).toBe(600);
        execute("normal");
        expect($getFuncCode()).toBe(613);
    });
});