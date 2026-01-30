import { describe, it, expect, beforeEach } from "vitest";
import {
    $setCurrentBlendMode,
    $getCurrentBlendMode,
    $setFuncCode,
    $getFuncCode,
    $getBlendState
} from "./Blend";

describe("Blend", () =>
{
    beforeEach(() =>
    {
        $setCurrentBlendMode("normal");
        $setFuncCode(0);
    });

    describe("blend mode", () =>
    {
        it("should default to normal", () =>
        {
            $setCurrentBlendMode("normal");
            expect($getCurrentBlendMode()).toBe("normal");
        });

        it("should set and get blend mode", () =>
        {
            $setCurrentBlendMode("add");
            expect($getCurrentBlendMode()).toBe("add");

            $setCurrentBlendMode("screen");
            expect($getCurrentBlendMode()).toBe("screen");

            $setCurrentBlendMode("alpha");
            expect($getCurrentBlendMode()).toBe("alpha");

            $setCurrentBlendMode("erase");
            expect($getCurrentBlendMode()).toBe("erase");

            $setCurrentBlendMode("copy");
            expect($getCurrentBlendMode()).toBe("copy");
        });
    });

    describe("func code", () =>
    {
        it("should default to 0", () =>
        {
            $setFuncCode(0);
            expect($getFuncCode()).toBe(0);
        });

        it("should set and get func code", () =>
        {
            $setFuncCode(123);
            expect($getFuncCode()).toBe(123);

            $setFuncCode(456);
            expect($getFuncCode()).toBe(456);
        });
    });

    describe("$getBlendState", () =>
    {
        it("should return normal blend state", () =>
        {
            const state = $getBlendState("normal");

            expect(state.color.srcFactor).toBe("one");
            expect(state.color.dstFactor).toBe("one-minus-src-alpha");
            expect(state.color.operation).toBe("add");
        });

        it("should return add blend state", () =>
        {
            const state = $getBlendState("add");

            expect(state.color.srcFactor).toBe("one");
            expect(state.color.dstFactor).toBe("one");
            expect(state.color.operation).toBe("add");
        });

        it("should return screen blend state", () =>
        {
            const state = $getBlendState("screen");

            expect(state.color.srcFactor).toBe("one-minus-dst");
            expect(state.color.dstFactor).toBe("one");
            expect(state.color.operation).toBe("add");
        });

        it("should return alpha blend state", () =>
        {
            const state = $getBlendState("alpha");

            expect(state.color.srcFactor).toBe("zero");
            expect(state.color.dstFactor).toBe("src-alpha");
            expect(state.color.operation).toBe("add");
        });

        it("should return erase blend state", () =>
        {
            const state = $getBlendState("erase");

            expect(state.color.srcFactor).toBe("zero");
            expect(state.color.dstFactor).toBe("one-minus-src-alpha");
            expect(state.color.operation).toBe("add");
        });

        it("should return copy blend state", () =>
        {
            const state = $getBlendState("copy");

            expect(state.color.srcFactor).toBe("one");
            expect(state.color.dstFactor).toBe("zero");
            expect(state.color.operation).toBe("add");
        });

        it("should return default for unknown mode", () =>
        {
            const state = $getBlendState("unknown" as any);

            expect(state.color.srcFactor).toBe("one");
            expect(state.color.dstFactor).toBe("one-minus-src-alpha");
        });

        it("should have consistent alpha blend settings", () =>
        {
            const normalState = $getBlendState("normal");
            const addState = $getBlendState("add");

            // Normal alpha
            expect(normalState.alpha.srcFactor).toBe("one");
            expect(normalState.alpha.dstFactor).toBe("one-minus-src-alpha");

            // Add alpha
            expect(addState.alpha.srcFactor).toBe("one");
            expect(addState.alpha.dstFactor).toBe("one-minus-src-alpha");
        });
    });
});
