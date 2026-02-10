import { describe, it, expect, vi, beforeEach } from "vitest";
import { execute } from "./MaskLeaveMaskUseCase";

// Mock attachment object
const mockCurrentAttachmentObject = {
    "clipLevel": 1,
    "mask": true,
    "needsStencilClear": false,
    "pendingStencilClearLevel": 0
};

vi.mock("../../WebGPUUtil", () => ({
    "$context": {
        get currentAttachmentObject () {
            return mockCurrentAttachmentObject;
        }
    },
    "$poolFloat32Array4": vi.fn()
}));

// Mock Mask module - use getters for functions to avoid hoisting issues
let mockSetMaskDrawingFn: ReturnType<typeof vi.fn> | null = null;
let mockSetMaskTestEnabledFn: ReturnType<typeof vi.fn> | null = null;
let mockSetMaskStencilReferenceFn: ReturnType<typeof vi.fn> | null = null;

vi.mock("../../Mask", () => ({
    "$clipBounds": new Map<number, Float32Array>(),
    "$clipLevels": new Map<number, number>(),
    "$setMaskDrawing": (value: boolean) => mockSetMaskDrawingFn?.(value),
    "$setMaskTestEnabled": (value: boolean) => mockSetMaskTestEnabledFn?.(value),
    "$setMaskStencilReference": (value: number) => mockSetMaskStencilReferenceFn?.(value)
}));

import { $clipBounds, $clipLevels } from "../../Mask";

// Mock MaskEndMaskService
const mockMaskEndMaskService = vi.fn();
vi.mock("../service/MaskEndMaskService", () => ({
    "execute": () => mockMaskEndMaskService()
}));

import { $poolFloat32Array4 } from "../../WebGPUUtil";

describe("MaskLeaveMaskUseCase", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
        mockCurrentAttachmentObject.clipLevel = 1;
        mockCurrentAttachmentObject.mask = true;
        mockCurrentAttachmentObject.needsStencilClear = false;
        mockCurrentAttachmentObject.pendingStencilClearLevel = 0;
        $clipBounds.clear();
        $clipLevels.clear();
        mockSetMaskDrawingFn = vi.fn();
        mockSetMaskTestEnabledFn = vi.fn();
        mockSetMaskStencilReferenceFn = vi.fn();
    });

    describe("single mask leave", () =>
    {
        it("should decrement clipLevel to 0", () =>
        {
            mockCurrentAttachmentObject.clipLevel = 1;
            $clipLevels.set(1, 1);

            execute();

            expect(mockCurrentAttachmentObject.clipLevel).toBe(0);
        });

        it("should set mask to false when clipLevel becomes 0", () =>
        {
            mockCurrentAttachmentObject.clipLevel = 1;
            $clipLevels.set(1, 1);

            execute();

            expect(mockCurrentAttachmentObject.mask).toBe(false);
        });

        it("should disable mask drawing when clipLevel becomes 0", () =>
        {
            mockCurrentAttachmentObject.clipLevel = 1;
            $clipLevels.set(1, 1);

            execute();

            expect(mockSetMaskDrawingFn).toHaveBeenCalledWith(false);
        });

        it("should disable mask test when clipLevel becomes 0", () =>
        {
            mockCurrentAttachmentObject.clipLevel = 1;
            $clipLevels.set(1, 1);

            execute();

            expect(mockSetMaskTestEnabledFn).toHaveBeenCalledWith(false);
        });

        it("should reset stencil reference to 0 when clipLevel becomes 0", () =>
        {
            mockCurrentAttachmentObject.clipLevel = 1;
            $clipLevels.set(1, 1);

            execute();

            expect(mockSetMaskStencilReferenceFn).toHaveBeenCalledWith(0);
        });

        it("should set needsStencilClear when clipLevel becomes 0", () =>
        {
            mockCurrentAttachmentObject.clipLevel = 1;
            $clipLevels.set(1, 1);

            execute();

            expect(mockCurrentAttachmentObject.needsStencilClear).toBe(true);
        });

        it("should clear clipLevels and clipBounds when clipLevel becomes 0", () =>
        {
            mockCurrentAttachmentObject.clipLevel = 1;
            $clipLevels.set(1, 1);
            $clipBounds.set(1, new Float32Array([0, 0, 100, 100]));

            execute();

            expect($clipLevels.size).toBe(0);
            expect($clipBounds.size).toBe(0);
        });
    });

    describe("nested mask leave", () =>
    {
        it("should decrement clipLevel but not to 0 for nested masks", () =>
        {
            mockCurrentAttachmentObject.clipLevel = 2;
            $clipLevels.set(1, 1);
            $clipLevels.set(2, 2);

            execute();

            expect(mockCurrentAttachmentObject.clipLevel).toBe(1);
            expect(mockCurrentAttachmentObject.mask).toBe(true); // still masked
        });

        it("should set pendingStencilClearLevel for nested masks", () =>
        {
            mockCurrentAttachmentObject.clipLevel = 2;
            $clipLevels.set(1, 1);
            $clipLevels.set(2, 2);

            execute();

            expect(mockCurrentAttachmentObject.pendingStencilClearLevel).toBe(1);
        });

        it("should call mask end service for nested masks", () =>
        {
            mockCurrentAttachmentObject.clipLevel = 2;
            $clipLevels.set(1, 1);
            $clipLevels.set(2, 2);

            execute();

            expect(mockMaskEndMaskService).toHaveBeenCalled();
        });

        it("should not call mask end service when clipLevel becomes 0", () =>
        {
            mockCurrentAttachmentObject.clipLevel = 1;
            $clipLevels.set(1, 1);

            execute();

            expect(mockMaskEndMaskService).not.toHaveBeenCalled();
        });
    });

    describe("bounds cleanup", () =>
    {
        it("should delete bounds for current clipLevel", () =>
        {
            mockCurrentAttachmentObject.clipLevel = 1;
            const bounds = new Float32Array([0, 0, 100, 100]);
            $clipBounds.set(1, bounds);
            $clipLevels.set(1, 1);

            execute();

            // All bounds cleared because clipLevel becomes 0
            expect($clipBounds.has(1)).toBe(false);
        });

        it("should pool bounds Float32Array", () =>
        {
            mockCurrentAttachmentObject.clipLevel = 2;
            const bounds = new Float32Array([0, 0, 100, 100]);
            $clipBounds.set(2, bounds);
            $clipLevels.set(1, 1);
            $clipLevels.set(2, 2);

            execute();

            expect($poolFloat32Array4).toHaveBeenCalledWith(bounds);
        });

        it("should delete clipLevel from clipLevels", () =>
        {
            mockCurrentAttachmentObject.clipLevel = 2;
            $clipLevels.set(1, 1);
            $clipLevels.set(2, 2);

            execute();

            expect($clipLevels.has(2)).toBe(false);
            expect($clipLevels.has(1)).toBe(true);
        });
    });
});
