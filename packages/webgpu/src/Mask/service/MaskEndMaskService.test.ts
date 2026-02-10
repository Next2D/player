import { describe, it, expect, vi, beforeEach } from "vitest";
import { execute } from "./MaskEndMaskService";

// Mock WebGPUUtil
const mockCurrentAttachmentObject = {
    "clipLevel": 1
};

vi.mock("../../WebGPUUtil", () => ({
    "$context": {
        get currentAttachmentObject () {
            return mockCurrentAttachmentObject;
        }
    }
}));

// Mock Mask module
const mockSetMaskTestEnabled = vi.fn();
const mockSetMaskStencilReference = vi.fn();
const mockSetMaskDrawing = vi.fn();

vi.mock("../../Mask", () => ({
    "$setMaskTestEnabled": (value: boolean) => mockSetMaskTestEnabled(value),
    "$setMaskStencilReference": (value: number) => mockSetMaskStencilReference(value),
    "$setMaskDrawing": (value: boolean) => mockSetMaskDrawing(value)
}));

describe("MaskEndMaskService", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
        mockCurrentAttachmentObject.clipLevel = 1;
    });

    describe("mask value calculation", () =>
    {
        it("should calculate correct mask value for level 1", () =>
        {
            mockCurrentAttachmentObject.clipLevel = 1;

            execute();

            // mask = (1 << 1) - 1 = 1
            expect(mockSetMaskStencilReference).toHaveBeenCalledWith(1);
        });

        it("should calculate correct mask value for level 2", () =>
        {
            mockCurrentAttachmentObject.clipLevel = 2;

            execute();

            // mask = (1 << 2) - 1 = 3
            expect(mockSetMaskStencilReference).toHaveBeenCalledWith(3);
        });

        it("should calculate correct mask value for level 3", () =>
        {
            mockCurrentAttachmentObject.clipLevel = 3;

            execute();

            // mask = (1 << 3) - 1 = 7
            expect(mockSetMaskStencilReference).toHaveBeenCalledWith(7);
        });

        it("should calculate correct mask value for level 8", () =>
        {
            mockCurrentAttachmentObject.clipLevel = 8;

            execute();

            // mask = (1 << 8) - 1 = 255 & 0xFF = 255
            expect(mockSetMaskStencilReference).toHaveBeenCalledWith(255);
        });
    });

    describe("mask test enabling", () =>
    {
        it("should enable mask test", () =>
        {
            execute();

            expect(mockSetMaskTestEnabled).toHaveBeenCalledWith(true);
        });

        it("should disable mask drawing", () =>
        {
            execute();

            expect(mockSetMaskDrawing).toHaveBeenCalledWith(false);
        });
    });

    describe("call order", () =>
    {
        it("should call functions in correct order", () =>
        {
            const callOrder: string[] = [];
            mockSetMaskTestEnabled.mockImplementation(() => callOrder.push("testEnabled"));
            mockSetMaskStencilReference.mockImplementation(() => callOrder.push("stencilRef"));
            mockSetMaskDrawing.mockImplementation(() => callOrder.push("drawing"));

            execute();

            expect(callOrder).toEqual(["testEnabled", "stencilRef", "drawing"]);
        });
    });
});
