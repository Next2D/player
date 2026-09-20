import { describe, it, expect, vi } from "vitest";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { execute } from "./FilterAllocateUniformBindingService";

describe("FilterAllocateUniformBindingService", () =>
{
    it.each([16, 32, 48, 64, 80, 96, 112])("preserves %i-byte views and static bindings across arena/fallback calls", size =>
    {
        vi.stubGlobal("GPUBufferUsage", { "UNIFORM": 64, "COPY_DST": 8 });
        try {
            const independent = {} as GPUBuffer;
            const device = {
                "createBuffer": vi.fn(() => independent),
                "queue": { "writeBuffer": vi.fn() }
            } as unknown as GPUDevice;
            const source = Float32Array.from({ "length": size / 4 + 8 }, (_, index) => index);
            const data = source.subarray(4, size / 4 + 4);
            const binding = { "buffer": {} as GPUBuffer, "offset": 768, size };
            const manager = {
                "allocateUniformBinding": vi.fn(() => binding)
            } as unknown as NonNullable<IFilterConfig["bufferManager"]>;
            expect(execute(device, data, manager)).toBe(binding);
            expect(manager.allocateUniformBinding).toHaveBeenCalledWith(data);
            expect(device.createBuffer).not.toHaveBeenCalled();
            expect(device.queue.writeBuffer).not.toHaveBeenCalled();
            expect(execute(device, data)).toEqual({ "buffer": independent, "offset": 0, size });
            expect(device.createBuffer).toHaveBeenCalledWith({ size, "usage": 72 });
            expect(device.queue.writeBuffer).toHaveBeenCalledWith(independent, 0, data);
        } finally {
            vi.unstubAllGlobals();
        }
    });
});
