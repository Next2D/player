import { describe, it, expect, vi, beforeEach } from "vitest";
import { execute } from "./MaskSetMaskBoundsService";

// Mock WebGPUUtil
const mockCurrentAttachmentObject = {
    "clipLevel": 1
};

const mockGetFloat32Array4 = vi.fn(() => new Float32Array(4));

vi.mock("../../WebGPUUtil", () => ({
    "$context": {
        get currentAttachmentObject () {
            return mockCurrentAttachmentObject;
        }
    },
    "$getFloat32Array4": () => mockGetFloat32Array4()
}));

// Mock Mask module - use actual Map that will be imported
vi.mock("../../Mask", () => ({
    "$clipBounds": new Map<number, Float32Array>()
}));

import { $clipBounds } from "../../Mask";

describe("MaskSetMaskBoundsService", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
        mockCurrentAttachmentObject.clipLevel = 1;
        $clipBounds.clear();
        mockGetFloat32Array4.mockReturnValue(new Float32Array(4));
    });

    describe("initial bounds setting", () =>
    {
        it("should create new bounds when none exist", () =>
        {
            execute(10, 20, 100, 200);

            expect($clipBounds.has(1)).toBe(true);
            const bounds = $clipBounds.get(1);
            expect(bounds![0]).toBe(10);  // x_min
            expect(bounds![1]).toBe(20);  // y_min
            expect(bounds![2]).toBe(100); // x_max
            expect(bounds![3]).toBe(200); // y_max
        });

        it("should call $getFloat32Array4 for new bounds", () =>
        {
            execute(0, 0, 50, 50);

            expect(mockGetFloat32Array4).toHaveBeenCalled();
        });

        it("should handle different clip levels", () =>
        {
            mockCurrentAttachmentObject.clipLevel = 2;

            execute(5, 10, 50, 60);

            expect($clipBounds.has(2)).toBe(true);
            const bounds = $clipBounds.get(2);
            expect(bounds![0]).toBe(5);
            expect(bounds![1]).toBe(10);
            expect(bounds![2]).toBe(50);
            expect(bounds![3]).toBe(60);
        });
    });

    describe("bounds expansion", () =>
    {
        it("should expand bounds to include smaller x_min", () =>
        {
            const existingBounds = new Float32Array([20, 20, 100, 100]);
            $clipBounds.set(1, existingBounds);

            execute(10, 30, 80, 80);

            const bounds = $clipBounds.get(1);
            expect(bounds![0]).toBe(10);  // expanded x_min
            expect(bounds![1]).toBe(20);  // unchanged y_min
            expect(bounds![2]).toBe(100); // unchanged x_max
            expect(bounds![3]).toBe(100); // unchanged y_max
        });

        it("should expand bounds to include smaller y_min", () =>
        {
            const existingBounds = new Float32Array([20, 20, 100, 100]);
            $clipBounds.set(1, existingBounds);

            execute(30, 5, 80, 80);

            const bounds = $clipBounds.get(1);
            expect(bounds![0]).toBe(20);  // unchanged x_min
            expect(bounds![1]).toBe(5);   // expanded y_min
            expect(bounds![2]).toBe(100); // unchanged x_max
            expect(bounds![3]).toBe(100); // unchanged y_max
        });

        it("should expand bounds to include larger x_max", () =>
        {
            const existingBounds = new Float32Array([20, 20, 100, 100]);
            $clipBounds.set(1, existingBounds);

            execute(30, 30, 150, 80);

            const bounds = $clipBounds.get(1);
            expect(bounds![0]).toBe(20);  // unchanged x_min
            expect(bounds![1]).toBe(20);  // unchanged y_min
            expect(bounds![2]).toBe(150); // expanded x_max
            expect(bounds![3]).toBe(100); // unchanged y_max
        });

        it("should expand bounds to include larger y_max", () =>
        {
            const existingBounds = new Float32Array([20, 20, 100, 100]);
            $clipBounds.set(1, existingBounds);

            execute(30, 30, 80, 200);

            const bounds = $clipBounds.get(1);
            expect(bounds![0]).toBe(20);  // unchanged x_min
            expect(bounds![1]).toBe(20);  // unchanged y_min
            expect(bounds![2]).toBe(100); // unchanged x_max
            expect(bounds![3]).toBe(200); // expanded y_max
        });

        it("should expand bounds in all directions", () =>
        {
            const existingBounds = new Float32Array([50, 50, 100, 100]);
            $clipBounds.set(1, existingBounds);

            execute(10, 20, 200, 300);

            const bounds = $clipBounds.get(1);
            expect(bounds![0]).toBe(10);  // expanded x_min
            expect(bounds![1]).toBe(20);  // expanded y_min
            expect(bounds![2]).toBe(200); // expanded x_max
            expect(bounds![3]).toBe(300); // expanded y_max
        });

        it("should not shrink existing bounds", () =>
        {
            const existingBounds = new Float32Array([10, 10, 200, 200]);
            $clipBounds.set(1, existingBounds);

            execute(50, 50, 100, 100);

            const bounds = $clipBounds.get(1);
            expect(bounds![0]).toBe(10);  // not shrunk
            expect(bounds![1]).toBe(10);  // not shrunk
            expect(bounds![2]).toBe(200); // not shrunk
            expect(bounds![3]).toBe(200); // not shrunk
        });
    });

    describe("negative coordinates", () =>
    {
        it("should handle negative bounds", () =>
        {
            execute(-50, -30, 50, 30);

            const bounds = $clipBounds.get(1);
            expect(bounds![0]).toBe(-50);
            expect(bounds![1]).toBe(-30);
            expect(bounds![2]).toBe(50);
            expect(bounds![3]).toBe(30);
        });
    });
});
