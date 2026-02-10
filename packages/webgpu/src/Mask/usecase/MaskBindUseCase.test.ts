import { describe, it, expect, vi, beforeEach } from "vitest";
import { execute } from "./MaskBindUseCase";

// Mock Mask module
const mockIsMaskDrawing = vi.fn(() => false);
const mockSetMaskDrawing = vi.fn();

vi.mock("../../Mask", () => ({
    "$isMaskDrawing": () => mockIsMaskDrawing(),
    "$setMaskDrawing": (value: boolean) => mockSetMaskDrawing(value)
}));

// Mock MaskEndMaskService
const mockMaskEndMaskService = vi.fn();
vi.mock("../service/MaskEndMaskService", () => ({
    "execute": () => mockMaskEndMaskService()
}));

describe("MaskBindUseCase", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
        mockIsMaskDrawing.mockReturnValue(false);
    });

    describe("mask binding", () =>
    {
        it("should set mask drawing to true when mask=true and not already drawing", () =>
        {
            mockIsMaskDrawing.mockReturnValue(false);

            execute(true);

            expect(mockSetMaskDrawing).toHaveBeenCalledWith(true);
            expect(mockMaskEndMaskService).toHaveBeenCalled();
        });

        it("should not change state when mask=true and already drawing", () =>
        {
            mockIsMaskDrawing.mockReturnValue(true);

            execute(true);

            expect(mockSetMaskDrawing).not.toHaveBeenCalled();
            expect(mockMaskEndMaskService).not.toHaveBeenCalled();
        });
    });

    describe("mask unbinding", () =>
    {
        it("should set mask drawing to false when mask=false and currently drawing", () =>
        {
            mockIsMaskDrawing.mockReturnValue(true);

            execute(false);

            expect(mockSetMaskDrawing).toHaveBeenCalledWith(false);
        });

        it("should not change state when mask=false and not drawing", () =>
        {
            mockIsMaskDrawing.mockReturnValue(false);

            execute(false);

            expect(mockSetMaskDrawing).not.toHaveBeenCalled();
        });
    });

    describe("mask end service", () =>
    {
        it("should call mask end service when transitioning from not drawing to drawing", () =>
        {
            mockIsMaskDrawing.mockReturnValue(false);

            execute(true);

            expect(mockMaskEndMaskService).toHaveBeenCalled();
        });

        it("should not call mask end service when mask=false", () =>
        {
            mockIsMaskDrawing.mockReturnValue(true);

            execute(false);

            expect(mockMaskEndMaskService).not.toHaveBeenCalled();
        });
    });
});
