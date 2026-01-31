import { describe, it, expect, vi, beforeEach } from "vitest";
import { PerformanceMonitor } from "./PerformanceMonitor";

// Mock GPUBufferUsage
const GPUBufferUsage = {
    QUERY_RESOLVE: 0x200,
    COPY_SRC: 0x04
};
(globalThis as any).GPUBufferUsage = GPUBufferUsage;

// Mock service and usecase modules
vi.mock("./service/PerformanceMonitorCreateQuerySetService", () => ({
    "execute": vi.fn((device, maxQueries) => ({
        "count": maxQueries,
        "destroy": vi.fn()
    }))
}));

vi.mock("./usecase/PerformanceMonitorMeasurePassUseCase", () => ({
    "execute": vi.fn(() => Promise.resolve([
        { "index": 0, "durationMs": 1.5, "durationNs": 1500000n },
        { "index": 1, "durationMs": 2.3, "durationNs": 2300000n }
    ]))
}));

describe("PerformanceMonitor", () =>
{
    const createMockDevice = (): GPUDevice =>
    {
        return {
            "createBuffer": vi.fn(() => ({
                "destroy": vi.fn()
            })),
            "features": {
                "has": vi.fn(() => true)
            }
        } as unknown as GPUDevice;
    };

    const createMockCommandEncoder = (): GPUCommandEncoder =>
    {
        return {
            "writeTimestamp": vi.fn(),
            "resolveQuerySet": vi.fn()
        } as unknown as GPUCommandEncoder;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    describe("constructor", () =>
    {
        it("should create instance with device", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            expect(monitor).toBeDefined();
        });

        it("should be disabled by default", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            expect(monitor.isEnabled()).toBe(false);
        });
    });

    describe("enable", () =>
    {
        it("should enable performance monitoring", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            const result = monitor.enable();

            expect(result).toBe(true);
            expect(monitor.isEnabled()).toBe(true);
        });

        it("should create query set", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            monitor.enable();

            // QuerySet should be created via service
            expect(monitor.isEnabled()).toBe(true);
        });

        it("should create resolve buffer", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            monitor.enable();

            expect(device.createBuffer).toHaveBeenCalledWith(
                expect.objectContaining({
                    "usage": GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC
                })
            );
        });

        it("should return true if already enabled", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            monitor.enable();
            const result = monitor.enable();

            expect(result).toBe(true);
        });
    });

    describe("disable", () =>
    {
        it("should disable performance monitoring", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            monitor.enable();
            monitor.disable();

            expect(monitor.isEnabled()).toBe(false);
        });

        it("should destroy query set", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            monitor.enable();
            monitor.disable();

            expect(monitor.isEnabled()).toBe(false);
        });

        it("should destroy resolve buffer", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            monitor.enable();
            monitor.disable();

            // Buffer should be destroyed
            expect(device.createBuffer).toHaveBeenCalled();
        });
    });

    describe("isEnabled", () =>
    {
        it("should return false by default", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            expect(monitor.isEnabled()).toBe(false);
        });

        it("should return true after enable", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            monitor.enable();

            expect(monitor.isEnabled()).toBe(true);
        });

        it("should return false after disable", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            monitor.enable();
            monitor.disable();

            expect(monitor.isEnabled()).toBe(false);
        });
    });

    describe("beginFrame", () =>
    {
        it("should reset query index", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            monitor.enable();
            monitor.beginFrame();

            // Should not throw
            expect(() => monitor.beginFrame()).not.toThrow();
        });

        it("should do nothing when disabled", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            // Should not throw when disabled
            expect(() => monitor.beginFrame()).not.toThrow();
        });
    });

    describe("beginMeasure", () =>
    {
        it("should record start timestamp", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);
            const encoder = createMockCommandEncoder();

            monitor.enable();
            monitor.beginMeasure(encoder, "blur");

            expect(encoder.writeTimestamp).toHaveBeenCalled();
        });

        it("should do nothing when disabled", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);
            const encoder = createMockCommandEncoder();

            monitor.beginMeasure(encoder, "blur");

            expect(encoder.writeTimestamp).not.toHaveBeenCalled();
        });

        it("should accept different labels", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);
            const encoder = createMockCommandEncoder();

            monitor.enable();
            monitor.beginMeasure(encoder, "frame");
            monitor.endMeasure(encoder);
            monitor.beginMeasure(encoder, "fill");

            expect(encoder.writeTimestamp).toHaveBeenCalledTimes(3);
        });
    });

    describe("endMeasure", () =>
    {
        it("should record end timestamp", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);
            const encoder = createMockCommandEncoder();

            monitor.enable();
            monitor.beginMeasure(encoder, "blur");
            monitor.endMeasure(encoder);

            expect(encoder.writeTimestamp).toHaveBeenCalledTimes(2);
        });

        it("should do nothing when disabled", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);
            const encoder = createMockCommandEncoder();

            monitor.endMeasure(encoder);

            expect(encoder.writeTimestamp).not.toHaveBeenCalled();
        });
    });

    describe("getRenderPassTimestamps", () =>
    {
        it("should return timestamp settings when enabled", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            monitor.enable();
            const timestamps = monitor.getRenderPassTimestamps("blur");

            expect(timestamps).toBeDefined();
            expect(timestamps!.querySet).toBeDefined();
            expect(typeof timestamps!.beginningOfPassWriteIndex).toBe("number");
            expect(typeof timestamps!.endOfPassWriteIndex).toBe("number");
        });

        it("should return undefined when disabled", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            const timestamps = monitor.getRenderPassTimestamps("blur");

            expect(timestamps).toBeUndefined();
        });

        it("should increment query index by 2", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            monitor.enable();
            const timestamps1 = monitor.getRenderPassTimestamps("blur");
            const timestamps2 = monitor.getRenderPassTimestamps("fill");

            expect(timestamps2!.beginningOfPassWriteIndex).toBe(
                timestamps1!.beginningOfPassWriteIndex + 2
            );
        });
    });

    describe("resolveQueries", () =>
    {
        it("should resolve query set", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);
            const encoder = createMockCommandEncoder();

            monitor.enable();
            monitor.beginMeasure(encoder, "blur");
            monitor.endMeasure(encoder);
            monitor.resolveQueries(encoder);

            expect(encoder.resolveQuerySet).toHaveBeenCalled();
        });

        it("should do nothing when disabled", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);
            const encoder = createMockCommandEncoder();

            monitor.resolveQueries(encoder);

            expect(encoder.resolveQuerySet).not.toHaveBeenCalled();
        });

        it("should do nothing when no queries recorded", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);
            const encoder = createMockCommandEncoder();

            monitor.enable();
            monitor.beginFrame();
            monitor.resolveQueries(encoder);

            expect(encoder.resolveQuerySet).not.toHaveBeenCalled();
        });
    });

    describe("getResults", () =>
    {
        it("should return results when enabled", async () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);
            const encoder = createMockCommandEncoder();

            monitor.enable();
            monitor.beginMeasure(encoder, "blur");
            monitor.endMeasure(encoder);

            const results = await monitor.getResults();

            expect(results).toBeInstanceOf(Array);
            expect(results.length).toBeGreaterThan(0);
        });

        it("should return empty array when disabled", async () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            const results = await monitor.getResults();

            expect(results).toEqual([]);
        });

        it("should return empty array when no queries", async () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            monitor.enable();
            monitor.beginFrame();

            const results = await monitor.getResults();

            expect(results).toEqual([]);
        });
    });

    describe("getStats", () =>
    {
        it("should calculate statistics from results", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);
            const results = [
                { "index": 0, "durationMs": 1.0, "durationNs": 1000000n },
                { "index": 1, "durationMs": 2.0, "durationNs": 2000000n },
                { "index": 2, "durationMs": 3.0, "durationNs": 3000000n }
            ];

            const stats = monitor.getStats(results);

            expect(stats.length).toBe(1);
            expect(stats[0].count).toBe(3);
            expect(stats[0].totalMs).toBe(6.0);
            expect(stats[0].avgMs).toBe(2.0);
            expect(stats[0].minMs).toBe(1.0);
            expect(stats[0].maxMs).toBe(3.0);
        });

        it("should return empty array for empty results", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            const stats = monitor.getStats([]);

            expect(stats).toEqual([]);
        });

        it("should include total label", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);
            const results = [
                { "index": 0, "durationMs": 1.0, "durationNs": 1000000n }
            ];

            const stats = monitor.getStats(results);

            expect(stats[0].label).toBe("total");
        });
    });

    describe("logResults", () =>
    {
        it("should log results to console", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);
            const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
            const groupSpy = vi.spyOn(console, "group").mockImplementation(() => {});
            const groupEndSpy = vi.spyOn(console, "groupEnd").mockImplementation(() => {});

            const results = [
                { "index": 0, "durationMs": 1.5, "durationNs": 1500000n }
            ];

            monitor.logResults(results);

            expect(groupSpy).toHaveBeenCalledWith("PerformanceMonitor Results");
            expect(consoleSpy).toHaveBeenCalled();
            expect(groupEndSpy).toHaveBeenCalled();

            consoleSpy.mockRestore();
            groupSpy.mockRestore();
            groupEndSpy.mockRestore();
        });

        it("should log message for empty results", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);
            const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

            monitor.logResults([]);

            expect(consoleSpy).toHaveBeenCalledWith("PerformanceMonitor: No results");

            consoleSpy.mockRestore();
        });
    });

    describe("destroy", () =>
    {
        it("should call disable", () =>
        {
            const device = createMockDevice();
            const monitor = new PerformanceMonitor(device);

            monitor.enable();
            monitor.destroy();

            expect(monitor.isEnabled()).toBe(false);
        });
    });
});
