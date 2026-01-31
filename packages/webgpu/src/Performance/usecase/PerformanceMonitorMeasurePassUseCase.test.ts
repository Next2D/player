import { describe, it, expect, vi, beforeEach } from "vitest";
import { execute } from "./PerformanceMonitorMeasurePassUseCase";

// Mock GPUBufferUsage and GPUMapMode
const GPUBufferUsage = {
    MAP_READ: 0x01,
    COPY_DST: 0x02
};
(globalThis as any).GPUBufferUsage = GPUBufferUsage;

const GPUMapMode = {
    READ: 0x01
};
(globalThis as any).GPUMapMode = GPUMapMode;

describe("PerformanceMonitorMeasurePassUseCase", () =>
{
    const createTimestampData = (pairs: Array<[bigint, bigint]>): ArrayBuffer =>
    {
        const buffer = new ArrayBuffer(pairs.length * 2 * 8);
        const view = new BigInt64Array(buffer);
        pairs.forEach((pair, i) => {
            view[i * 2] = pair[0];
            view[i * 2 + 1] = pair[1];
        });
        return buffer;
    };

    const createMockDevice = (timestampPairs: Array<[bigint, bigint]>) =>
    {
        const timestampBuffer = createTimestampData(timestampPairs);
        const readBuffer = {
            "mapAsync": vi.fn().mockResolvedValue(undefined),
            "getMappedRange": vi.fn(() => timestampBuffer),
            "unmap": vi.fn(),
            "destroy": vi.fn()
        };

        const commandEncoder = {
            "copyBufferToBuffer": vi.fn(),
            "finish": vi.fn(() => ({ "label": "commandBuffer" }))
        };

        return {
            "createBuffer": vi.fn(() => readBuffer),
            "createCommandEncoder": vi.fn(() => commandEncoder),
            "queue": {
                "submit": vi.fn()
            },
            "_readBuffer": readBuffer,
            "_commandEncoder": commandEncoder
        } as unknown as GPUDevice & { _readBuffer: any; _commandEncoder: any };
    };

    const createMockQuerySet = () =>
    {
        return {} as GPUQuerySet;
    };

    const createMockResolveBuffer = () =>
    {
        return {} as GPUBuffer;
    };

    describe("result processing", () =>
    {
        it("should return array of performance results", async () =>
        {
            const device = createMockDevice([[BigInt(1000), BigInt(2000)]]);
            const querySet = createMockQuerySet();
            const resolveBuffer = createMockResolveBuffer();

            const results = await execute(device, querySet, resolveBuffer, 2);

            expect(Array.isArray(results)).toBe(true);
        });

        it("should calculate duration correctly", async () =>
        {
            // Start: 1000000ns, End: 2000000ns, Duration: 1000000ns = 1ms
            const device = createMockDevice([[BigInt(1_000_000), BigInt(2_000_000)]]);
            const querySet = createMockQuerySet();
            const resolveBuffer = createMockResolveBuffer();

            const results = await execute(device, querySet, resolveBuffer, 2);

            expect(results[0].durationNs).toBe(1_000_000);
            expect(results[0].durationMs).toBe(1);
        });

        it("should set index for each result pair", async () =>
        {
            const device = createMockDevice([
                [BigInt(1000), BigInt(2000)],
                [BigInt(3000), BigInt(4000)]
            ]);
            const querySet = createMockQuerySet();
            const resolveBuffer = createMockResolveBuffer();

            const results = await execute(device, querySet, resolveBuffer, 4);

            expect(results[0].index).toBe(0);
            expect(results[1].index).toBe(1);
        });

        it("should include startTime and endTime", async () =>
        {
            const device = createMockDevice([[BigInt(5000), BigInt(8000)]]);
            const querySet = createMockQuerySet();
            const resolveBuffer = createMockResolveBuffer();

            const results = await execute(device, querySet, resolveBuffer, 2);

            expect(results[0].startTime).toBe(5000);
            expect(results[0].endTime).toBe(8000);
        });
    });

    describe("buffer management", () =>
    {
        it("should create read buffer with correct size", async () =>
        {
            const device = createMockDevice([[BigInt(1000), BigInt(2000)]]);
            const querySet = createMockQuerySet();
            const resolveBuffer = createMockResolveBuffer();

            await execute(device, querySet, resolveBuffer, 4);

            expect(device.createBuffer).toHaveBeenCalledWith({
                "size": 32, // 4 * 8 bytes
                "usage": GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
            });
        });

        it("should copy from resolve buffer to read buffer", async () =>
        {
            const device = createMockDevice([[BigInt(1000), BigInt(2000)]]);
            const querySet = createMockQuerySet();
            const resolveBuffer = createMockResolveBuffer();

            await execute(device, querySet, resolveBuffer, 2);

            expect((device as any)._commandEncoder.copyBufferToBuffer).toHaveBeenCalledWith(
                resolveBuffer, 0,
                (device as any)._readBuffer, 0,
                16 // 2 * 8 bytes
            );
        });

        it("should submit command buffer", async () =>
        {
            const device = createMockDevice([[BigInt(1000), BigInt(2000)]]);
            const querySet = createMockQuerySet();
            const resolveBuffer = createMockResolveBuffer();

            await execute(device, querySet, resolveBuffer, 2);

            expect(device.queue.submit).toHaveBeenCalled();
        });

        it("should map buffer for reading", async () =>
        {
            const device = createMockDevice([[BigInt(1000), BigInt(2000)]]);
            const querySet = createMockQuerySet();
            const resolveBuffer = createMockResolveBuffer();

            await execute(device, querySet, resolveBuffer, 2);

            expect((device as any)._readBuffer.mapAsync).toHaveBeenCalledWith(GPUMapMode.READ);
        });

        it("should unmap buffer after reading", async () =>
        {
            const device = createMockDevice([[BigInt(1000), BigInt(2000)]]);
            const querySet = createMockQuerySet();
            const resolveBuffer = createMockResolveBuffer();

            await execute(device, querySet, resolveBuffer, 2);

            expect((device as any)._readBuffer.unmap).toHaveBeenCalled();
        });

        it("should destroy read buffer after reading", async () =>
        {
            const device = createMockDevice([[BigInt(1000), BigInt(2000)]]);
            const querySet = createMockQuerySet();
            const resolveBuffer = createMockResolveBuffer();

            await execute(device, querySet, resolveBuffer, 2);

            expect((device as any)._readBuffer.destroy).toHaveBeenCalled();
        });
    });

    describe("multiple measurements", () =>
    {
        it("should handle multiple timestamp pairs", async () =>
        {
            const device = createMockDevice([
                [BigInt(1000), BigInt(2000)],
                [BigInt(3000), BigInt(5000)],
                [BigInt(6000), BigInt(6500)]
            ]);
            const querySet = createMockQuerySet();
            const resolveBuffer = createMockResolveBuffer();

            const results = await execute(device, querySet, resolveBuffer, 6);

            expect(results).toHaveLength(3);
            expect(results[0].durationNs).toBe(1000);
            expect(results[1].durationNs).toBe(2000);
            expect(results[2].durationNs).toBe(500);
        });
    });
});
