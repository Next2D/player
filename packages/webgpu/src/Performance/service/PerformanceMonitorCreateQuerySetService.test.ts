import { describe, it, expect, vi, beforeEach } from "vitest";
import { execute } from "./PerformanceMonitorCreateQuerySetService";

describe("PerformanceMonitorCreateQuerySetService", () =>
{
    beforeEach(() =>
    {
        vi.spyOn(console, "warn").mockImplementation(() => {});
    });

    const createMockDevice = (hasTimestampQuery: boolean, throwOnCreate: boolean = false) =>
    {
        const mockQuerySet = { "label": "mockQuerySet" };
        return {
            "features": {
                "has": vi.fn((feature: string) => feature === "timestamp-query" && hasTimestampQuery)
            },
            "createQuerySet": vi.fn(() => {
                if (throwOnCreate) {
                    throw new Error("Failed to create QuerySet");
                }
                return mockQuerySet;
            }),
            "_mockQuerySet": mockQuerySet
        } as unknown as GPUDevice & { _mockQuerySet: any };
    };

    describe("when timestamp-query is supported", () =>
    {
        it("should create QuerySet with timestamp type", () =>
        {
            const device = createMockDevice(true);

            execute(device, 4);

            expect(device.createQuerySet).toHaveBeenCalledWith({
                "type": "timestamp",
                "count": 4
            });
        });

        it("should return created QuerySet", () =>
        {
            const device = createMockDevice(true);

            const result = execute(device, 4);

            expect(result).toBe((device as any)._mockQuerySet);
        });

        it("should pass correct count to createQuerySet", () =>
        {
            const device = createMockDevice(true);

            execute(device, 8);

            expect(device.createQuerySet).toHaveBeenCalledWith(
                expect.objectContaining({ "count": 8 })
            );
        });
    });

    describe("when timestamp-query is not supported", () =>
    {
        it("should return null", () =>
        {
            const device = createMockDevice(false);

            const result = execute(device, 4);

            expect(result).toBeNull();
        });

        it("should log warning message", () =>
        {
            const device = createMockDevice(false);

            execute(device, 4);

            expect(console.warn).toHaveBeenCalledWith(
                "PerformanceMonitor: timestamp-query feature is not supported on this device"
            );
        });

        it("should not attempt to create QuerySet", () =>
        {
            const device = createMockDevice(false);

            execute(device, 4);

            expect(device.createQuerySet).not.toHaveBeenCalled();
        });
    });

    describe("error handling", () =>
    {
        it("should return null when createQuerySet throws", () =>
        {
            const device = createMockDevice(true, true);

            const result = execute(device, 4);

            expect(result).toBeNull();
        });

        it("should log warning when createQuerySet fails", () =>
        {
            const device = createMockDevice(true, true);

            execute(device, 4);

            expect(console.warn).toHaveBeenCalledWith(
                "PerformanceMonitor: Failed to create QuerySet",
                expect.any(Error)
            );
        });
    });

    describe("feature check", () =>
    {
        it("should check for timestamp-query feature", () =>
        {
            const device = createMockDevice(true);

            execute(device, 4);

            expect(device.features.has).toHaveBeenCalledWith("timestamp-query");
        });
    });
});
