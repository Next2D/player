import { describe, expect, it, vi } from "vitest";
import { InstanceBufferAllocator } from "./InstanceBufferAllocator";

vi.stubGlobal("GPUBufferUsage", { "VERTEX": 32, "COPY_DST": 8 });

const createDevice = (max_size: number = 1048576) =>
{
    const writes: { buffer: GPUBuffer; offset: number; data: Float32Array }[] = [];
    const device = {
        "limits": { "maxBufferSize": max_size },
        "createBuffer": vi.fn((descriptor: GPUBufferDescriptor) => ({
            "size": descriptor.size,
            "destroy": vi.fn()
        })),
        "queue": {
            "writeBuffer": vi.fn((buffer: GPUBuffer, _offset: number, data: ArrayBuffer, start: number, size: number) =>
            {
                writes.push({ buffer, "offset": _offset, "data": new Float32Array(data.slice(start, start + size)) });
            })
        }
    };
    return { device, writes };
};

describe("InstanceBufferAllocator", () =>
{
    it("uploads large subarrays directly without overwriting them when small batches flush", () =>
    {
        const { device, writes } = createDevice();
        const allocator = new InstanceBufferAllocator(device as unknown as GPUDevice);
        allocator.allocate(new Float32Array([1, 2]));
        const large = new Float32Array(4100).fill(3).subarray(4);
        expect(allocator.allocate(large)).toBe(8);
        expect(writes).toHaveLength(2);
        large.fill(0);
        expect(allocator.allocate(new Float32Array([4, 5]))).toBe(16392);
        allocator.flush();
        allocator.flush();
        expect(writes.map(write => write.offset)).toEqual([0, 8, 16392]);
        expect(Array.from(writes[0].data)).toEqual([1, 2]);
        expect(writes[1].data.every(value => value === 3)).toBe(true);
        expect(Array.from(writes[2].data)).toEqual([4, 5]);
    });

    it("copies reused CPU data into disjoint ranges and uploads once", () =>
    {
        const { device, writes } = createDevice();
        const allocator = new InstanceBufferAllocator(device as unknown as GPUDevice);
        const data = new Float32Array([1, 2, 3, 4]);
        const firstOffset = allocator.allocate(data);
        const firstBuffer = allocator.getBuffer();
        data.fill(5);
        const secondOffset = allocator.allocate(data);
        expect(allocator.getBuffer()).toBe(firstBuffer);
        data.fill(0);
        expect(firstOffset).toBe(0);
        expect(secondOffset).toBe(16);
        expect(writes).toHaveLength(0);

        allocator.flush();
        allocator.flush();
        expect(writes).toHaveLength(1);
        expect(Array.from(writes[0].data)).toEqual([1, 2, 3, 4, 5, 5, 5, 5]);
    });

    it("keeps batches recorded before growth alive until submission", () =>
    {
        const { device, writes } = createDevice();
        const allocator = new InstanceBufferAllocator(device as unknown as GPUDevice, 16);
        allocator.allocate(new Float32Array([1, 2, 3, 4]));
        const oldBuffer = allocator.getBuffer();
        expect(allocator.allocate(new Float32Array([5, 6, 7, 8, 9]))).toBe(0);
        const newBuffer = allocator.getBuffer();
        expect(newBuffer).not.toBe(oldBuffer);
        expect(writes[0].buffer).toBe(oldBuffer);
        expect(Array.from(writes[0].data)).toEqual([1, 2, 3, 4]);
        expect(oldBuffer.destroy).not.toHaveBeenCalled();

        allocator.flush();
        expect(writes[1].buffer).toBe(newBuffer);
        expect(Array.from(writes[1].data)).toEqual([5, 6, 7, 8, 9]);
        allocator.resetFrame(); // queue.submit後
        expect(oldBuffer.destroy).toHaveBeenCalledOnce();
        expect(newBuffer.destroy).not.toHaveBeenCalled();
        expect(allocator.allocate(new Float32Array([10]))).toBe(0);
        expect(allocator.getBuffer()).toBe(newBuffer);
    });

    it("reuses capacity across frames with thousands of small batches", () =>
    {
        const { device, writes } = createDevice();
        const allocator = new InstanceBufferAllocator(device as unknown as GPUDevice, 524288);
        const data = new Float32Array(24);
        for (let frame = 0; frame < 3; frame++) {
            for (let batch = 0; batch < 5000; batch++) {
                expect(allocator.allocate(data)).toBe(batch * 96);
            }
            allocator.flush();
            allocator.resetFrame();
        }
        expect(device.createBuffer).toHaveBeenCalledOnce();
        expect(writes).toHaveLength(3);
        expect(writes.every(write => write.data.byteLength === 480000)).toBe(true);
    });

    it("preserves direct uploads and small prefixes across frame resets", () =>
    {
        const { device, writes } = createDevice();
        const allocator = new InstanceBufferAllocator(device as unknown as GPUDevice);
        const source = new Float32Array(4100);
        for (let frame = 1; frame <= 6; frame++) {
            expect(allocator.allocate(new Float32Array([frame]))).toBe(0);
            source.fill(frame + 10);
            expect(allocator.allocate(source.subarray(4))).toBe(4);
            source.fill(0);
            expect(allocator.allocate(new Float32Array([frame + 20]))).toBe(16388);
            allocator.flush();
            allocator.flush();
            allocator.resetFrame();
        }
        expect(writes).toHaveLength(18);
        for (let frame = 1; frame <= 6; frame++) {
            const batch = writes.slice((frame - 1) * 3, frame * 3);
            expect(batch.map(write => write.offset)).toEqual([0, 4, 16388]);
            expect(Array.from(batch[0].data)).toEqual([frame]);
            expect(batch[1].data.length).toBe(4096);
            expect(batch[1].data.every(value => value === frame + 10)).toBe(true);
            expect(Array.from(batch[2].data)).toEqual([frame + 20]);
        }
        allocator.dispose();
        allocator.dispose();
        for (const result of device.createBuffer.mock.results) {
            expect(result.value.destroy).toHaveBeenCalledOnce();
        }
    });

    it("does not allocate for empty frames and handles multiple rollovers at the device limit", () =>
    {
        const { device, writes } = createDevice(16);
        const allocator = new InstanceBufferAllocator(device as unknown as GPUDevice, 16);
        for (let frame = 0; frame < 10; frame++) {
            allocator.flush();
            allocator.resetFrame();
        }
        expect(device.createBuffer).not.toHaveBeenCalled();
        for (let batch = 0; batch < 3; batch++) {
            expect(allocator.allocate(new Float32Array(4).fill(batch))).toBe(0);
            allocator.getBuffer();
        }
        allocator.flush();
        expect(writes.map(write => Array.from(write.data))).toEqual([
            [0, 0, 0, 0], [1, 1, 1, 1], [2, 2, 2, 2]
        ]);
        for (const write of writes) {
            expect(write.buffer.destroy).not.toHaveBeenCalled();
        }
        allocator.resetFrame();
        expect(writes[0].buffer.destroy).toHaveBeenCalledOnce();
        expect(writes[1].buffer.destroy).toHaveBeenCalledOnce();
        expect(writes[2].buffer.destroy).not.toHaveBeenCalled();
        allocator.dispose();
        for (const write of writes) {
            expect(write.buffer.destroy).toHaveBeenCalledOnce();
        }
    });

    it("respects the device limit and disposes grown buffers", () =>
    {
        const { device } = createDevice(32);
        const allocator = new InstanceBufferAllocator(device as unknown as GPUDevice, 16);
        allocator.allocate(new Float32Array(4));
        const first = allocator.getBuffer();
        allocator.allocate(new Float32Array(8));
        const second = allocator.getBuffer();
        expect(second.size).toBe(32);
        expect(() => allocator.allocate(new Float32Array(9))).toThrow(RangeError);
        allocator.dispose();
        expect(first.destroy).toHaveBeenCalledOnce();
        expect(second.destroy).toHaveBeenCalledOnce();
    });
});
