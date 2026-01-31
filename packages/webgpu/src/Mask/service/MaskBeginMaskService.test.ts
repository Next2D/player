import { describe, it, expect, vi, beforeEach } from "vitest";
import { execute } from "./MaskBeginMaskService";

// Mock WebGPUUtil
const mockCurrentAttachmentObject = {
    "mask": false,
    "clipLevel": 0
};

vi.mock("../../WebGPUUtil", () => ({
    "$context": {
        get currentAttachmentObject () {
            return mockCurrentAttachmentObject;
        }
    }
}));

// Mock Mask module
const mockSetMaskDrawing = vi.fn();
const mockIsMaskDrawing = vi.fn(() => false);

vi.mock("../../Mask", () => ({
    "$isMaskDrawing": () => mockIsMaskDrawing(),
    "$setMaskDrawing": (value: boolean) => mockSetMaskDrawing(value),
    "$clipLevels": new Map<number, number>()
}));

// Mock Debug logger
vi.mock("../../Debug/DebugLogger", () => ({
    "isDebugEnabled": vi.fn(() => false),
    "logMask": vi.fn()
}));

import { $clipLevels } from "../../Mask";

describe("MaskBeginMaskService", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
        mockCurrentAttachmentObject.mask = false;
        mockCurrentAttachmentObject.clipLevel = 0;
        ($clipLevels as Map<number, number>).clear();
        mockIsMaskDrawing.mockReturnValue(false);
    });

    describe("basic mask begin", () =>
    {
        it("should set mask to true on attachment", () =>
        {
            execute();

            expect(mockCurrentAttachmentObject.mask).toBe(true);
        });

        it("should increment clipLevel", () =>
        {
            expect(mockCurrentAttachmentObject.clipLevel).toBe(0);

            execute();

            expect(mockCurrentAttachmentObject.clipLevel).toBe(1);
        });

        it("should register clipLevel in clipLevels map", () =>
        {
            execute();

            expect($clipLevels.has(1)).toBe(true);
            expect($clipLevels.get(1)).toBe(1);
        });

        it("should set mask drawing to true when not already drawing", () =>
        {
            mockIsMaskDrawing.mockReturnValue(false);

            execute();

            expect(mockSetMaskDrawing).toHaveBeenCalledWith(true);
        });

        it("should not set mask drawing again when already drawing", () =>
        {
            mockIsMaskDrawing.mockReturnValue(true);

            execute();

            expect(mockSetMaskDrawing).not.toHaveBeenCalled();
        });
    });

    describe("nested masks", () =>
    {
        it("should handle multiple mask begins", () =>
        {
            execute();
            expect(mockCurrentAttachmentObject.clipLevel).toBe(1);
            expect($clipLevels.has(1)).toBe(true);

            mockIsMaskDrawing.mockReturnValue(true);
            execute();
            expect(mockCurrentAttachmentObject.clipLevel).toBe(2);
            expect($clipLevels.has(2)).toBe(true);

            execute();
            expect(mockCurrentAttachmentObject.clipLevel).toBe(3);
            expect($clipLevels.has(3)).toBe(true);
        });
    });

    describe("no attachment object", () =>
    {
        it("should return early when no current attachment", () =>
        {
            // Temporarily set to null
            const originalAttachment = { ...mockCurrentAttachmentObject };
            Object.defineProperty(mockCurrentAttachmentObject, "clipLevel", {
                "get": () => { throw new Error("should not access"); },
                "configurable": true
            });

            // Reset to normal object
            Object.defineProperty(mockCurrentAttachmentObject, "clipLevel", {
                "value": originalAttachment.clipLevel,
                "writable": true,
                "configurable": true
            });
        });
    });
});
