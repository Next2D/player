import { execute } from "./BlendOperationUseCase";
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
        expect($funcCode).toBe(600);
        execute("add");
        expect($funcCode).toBe(611);
    });

    it("test case screen", () =>
    {
        $setFuncCode(600);
        expect($funcCode).toBe(600);
        execute("screen");
        expect($funcCode).toBe(641);
    });

    it("test case alpha", () =>
    {
        $setFuncCode(600);
        expect($funcCode).toBe(600);
        execute("alpha");
        expect($funcCode).toBe(606);
    });

    it("test case erase", () =>
    {
        $setFuncCode(600);
        expect($funcCode).toBe(600);
        execute("erase");
        expect($funcCode).toBe(603);
    });

    it("test case copy", () =>
    {
        $setFuncCode(600);
        expect($funcCode).toBe(600);
        execute("copy");
        expect($funcCode).toBe(610);
    });

    it("test case normal", () =>
    {
        $setFuncCode(600);
        expect($funcCode).toBe(600);
        execute("normal");
        expect($funcCode).toBe(613);
    });
});