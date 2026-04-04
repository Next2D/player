import { describe, it, expect, beforeEach } from "vitest";
import {
    $setMaskDrawing,
    $isMaskDrawing,
    $setMaskTestEnabled,
    $isMaskTestEnabled,
    $setMaskStencilReference,
    $getMaskStencilReference,
    $clipBounds,
    $clipLevels,
    $resetMaskState
} from "./Mask";

describe("Mask", () =>
{
    beforeEach(() =>
    {
        $resetMaskState();
    });

    describe("mask drawing state", () =>
    {
        it("should default to false", () =>
        {
            expect($isMaskDrawing()).toBe(false);
        });

        it("should set and get mask drawing state", () =>
        {
            $setMaskDrawing(true);
            expect($isMaskDrawing()).toBe(true);

            $setMaskDrawing(false);
            expect($isMaskDrawing()).toBe(false);
        });
    });

    describe("mask test state", () =>
    {
        it("should default to false", () =>
        {
            expect($isMaskTestEnabled()).toBe(false);
        });

        it("should set and get mask test state", () =>
        {
            $setMaskTestEnabled(true);
            expect($isMaskTestEnabled()).toBe(true);

            $setMaskTestEnabled(false);
            expect($isMaskTestEnabled()).toBe(false);
        });
    });

    describe("mask stencil reference", () =>
    {
        it("should default to 0", () =>
        {
            expect($getMaskStencilReference()).toBe(0);
        });

        it("should set and get stencil reference", () =>
        {
            $setMaskStencilReference(5);
            expect($getMaskStencilReference()).toBe(5);

            $setMaskStencilReference(255);
            expect($getMaskStencilReference()).toBe(255);
        });
    });

    describe("clip bounds and levels", () =>
    {
        it("should be Maps", () =>
        {
            expect($clipBounds).toBeInstanceOf(Map);
            expect($clipLevels).toBeInstanceOf(Map);
        });

        it("should store and retrieve clip bounds", () =>
        {
            const bounds = new Float32Array([0, 0, 100, 100]);
            $clipBounds.set(1, bounds);

            expect($clipBounds.has(1)).toBe(true);
            expect($clipBounds.get(1)).toBe(bounds);
        });

        it("should store and retrieve clip levels", () =>
        {
            $clipLevels.set(1, 3);

            expect($clipLevels.has(1)).toBe(true);
            expect($clipLevels.get(1)).toBe(3);
        });
    });

    describe("$resetMaskState", () =>
    {
        it("should reset all mask state", () =>
        {
            // Set various states
            $setMaskDrawing(true);
            $setMaskTestEnabled(true);
            $setMaskStencilReference(10);
            $clipBounds.set(1, new Float32Array([0, 0, 100, 100]));
            $clipLevels.set(1, 5);

            // Reset
            $resetMaskState();

            // Verify all reset
            expect($isMaskDrawing()).toBe(false);
            expect($isMaskTestEnabled()).toBe(false);
            expect($getMaskStencilReference()).toBe(0);
            expect($clipBounds.size).toBe(0);
            expect($clipLevels.size).toBe(0);
        });
    });
});
