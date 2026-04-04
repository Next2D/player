import { describe, it, expect, beforeEach } from "vitest";
import {
    $setCurrentBlendMode,
    $currentBlendMode,
    $getBlendState
} from "./Blend";

describe("Blend", () =>
{
    beforeEach(() =>
    {
        $setCurrentBlendMode("normal");
    });

    describe("blend mode", () =>
    {
        it("should default to normal", () =>
        {
            $setCurrentBlendMode("normal");
            expect($currentBlendMode).toBe("normal");
        });

        it("should set and get blend mode", () =>
        {
            $setCurrentBlendMode("add");
            expect($currentBlendMode).toBe("add");

            $setCurrentBlendMode("screen");
            expect($currentBlendMode).toBe("screen");

            $setCurrentBlendMode("alpha");
            expect($currentBlendMode).toBe("alpha");

            $setCurrentBlendMode("erase");
            expect($currentBlendMode).toBe("erase");

            $setCurrentBlendMode("copy");
            expect($currentBlendMode).toBe("copy");
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
