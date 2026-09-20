import { describe, expect, it, vi } from "vitest";
import { BufferManager } from "./BufferManager";

vi.stubGlobal("GPUBufferUsage", { "UNIFORM": 64, "COPY_DST": 8 });

const createDevice = () =>
{
    const writes: { buffer: GPUBuffer; data: Float32Array }[] = [];
    const device = {
        "createBuffer": vi.fn((descriptor: GPUBufferDescriptor) => ({
            "size": descriptor.size, "destroy": vi.fn()
        })),
        "queue": {
            "writeBuffer": vi.fn((buffer: GPUBuffer, _offset: number, data: ArrayBuffer, start: number, size: number) =>
            {
                writes.push({ buffer, "data": new Float32Array(data.slice(start, start + size)) });
            })
        }
    };
    return { device, writes, "manager": new BufferManager(device as unknown as GPUDevice) };
};

describe("frame uniform bindings", () =>
{
    it("uploads identity UV once, never returns it to the frame pool, and disposes it", () =>
    {
        const { manager, device, writes } = createDevice();
        expect(device.createBuffer).not.toHaveBeenCalled();
        const first = manager.getIdentityUVBuffer();
        expect(writes).toHaveLength(1);
        expect(Array.from(writes[0].data)).toEqual([1, 1, 0, 0]);
        for (let frame = 0; frame < 3; frame++) {
            manager.clearFrameBuffers();
            expect(manager.getIdentityUVBuffer()).toBe(first);
        }
        expect(device.createBuffer).toHaveBeenCalledOnce();
        expect(writes).toHaveLength(1);
        expect(first.destroy).not.toHaveBeenCalled();
        manager.dispose();
        manager.dispose();
        expect(first.destroy).toHaveBeenCalledOnce();
        expect(manager.getIdentityUVBuffer()).not.toBe(first);
        manager.dispose();
    });

    it("binds exact, aligned, independent ranges and copies reused source data", () =>
    {
        const { manager, writes } = createDevice();
        const data = new Float32Array([1, 2, 3, 4]);
        const first = manager.allocateUniformBinding(data);
        data.fill(5);
        const second = manager.allocateUniformBinding(data);
        data.fill(0);
        expect(first).toEqual({ "buffer": second.buffer, "offset": 0, "size": 16 });
        expect(second.offset).toBe(256);
        expect(writes).toHaveLength(0);
        manager.dynamicUniform.flush();
        expect(writes).toHaveLength(1);
        expect(Array.from(writes[0].data.slice(0, 4))).toEqual([1, 2, 3, 4]);
        expect(Array.from(writes[0].data.slice(64, 68))).toEqual([5, 5, 5, 5]);
        manager.dispose();
    });

    it("keeps old buffer bindings alive through growth and reuses capacity after submit", () =>
    {
        const { manager, device, writes } = createDevice();
        const data = new Float32Array(12).fill(7);
        const first = manager.allocateUniformBinding(data);
        let last = first;
        for (let i = 1; i < 600; i++) last = manager.allocateUniformBinding(data);
        expect(last.buffer).not.toBe(first.buffer);
        expect(first.buffer.destroy).not.toHaveBeenCalled();
        manager.dynamicUniform.flush();
        expect(writes[0].buffer).toBe(first.buffer);
        expect(Array.from(writes[0].data.slice(0, 12))).toEqual(Array(12).fill(7));
        expect(last.offset! + last.size!).toBeLessThanOrEqual(last.buffer.size);
        manager.clearFrameBuffers(); // After queue.submit.
        expect(first.buffer.destroy).toHaveBeenCalledOnce();
        expect(last.buffer.destroy).not.toHaveBeenCalled();

        device.createBuffer.mockClear();
        writes.length = 0;
        for (let frame = 0; frame < 3; frame++) {
            for (let i = 0; i < 600; i++) {
                const binding = manager.allocateUniformBinding(data);
                expect(binding.buffer).toBe(last.buffer);
                expect(binding.offset).toBe(i * 256);
            }
            manager.dynamicUniform.flush();
            manager.clearFrameBuffers();
        }
        expect(device.createBuffer).not.toHaveBeenCalled();
        expect(writes).toHaveLength(3);
        manager.dispose();
        expect(last.buffer.destroy).toHaveBeenCalledOnce();
    });
});
