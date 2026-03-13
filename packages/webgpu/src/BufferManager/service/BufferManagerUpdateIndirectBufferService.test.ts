import { execute } from "./BufferManagerUpdateIndirectBufferService";
import { describe, expect, it, vi } from "vitest";

describe("BufferManagerUpdateIndirectBufferService.js test", () => {

    it("execute test case1", () =>
    {
        let writtenData: Uint32Array | null = null;
        let writtenOffset: number = -1;

        const mockBuffer = {} as unknown as GPUBuffer;
        const mockDevice = {
            "queue": {
                "writeBuffer": vi.fn((buffer: GPUBuffer, offset: number, data: Uint32Array) => {
                    expect(buffer).toBe(mockBuffer);
                    writtenOffset = offset;
                    writtenData = new Uint32Array(data);
                })
            }
        } as unknown as GPUDevice;

        execute(mockDevice, mockBuffer, 12, 3, 0, 0);

        expect(mockDevice.queue.writeBuffer).toHaveBeenCalledTimes(1);
        expect(writtenOffset).toBe(0);
        expect(writtenData).not.toBeNull();
        expect(writtenData![0]).toBe(12);
        expect(writtenData![1]).toBe(3);
        expect(writtenData![2]).toBe(0);
        expect(writtenData![3]).toBe(0);
    });

    it("execute test case2 - custom first_vertex and first_instance", () =>
    {
        let writtenData: Uint32Array | null = null;

        const mockBuffer = {} as unknown as GPUBuffer;
        const mockDevice = {
            "queue": {
                "writeBuffer": vi.fn((_buffer: GPUBuffer, _offset: number, data: Uint32Array) => {
                    writtenData = new Uint32Array(data);
                })
            }
        } as unknown as GPUDevice;

        execute(mockDevice, mockBuffer, 6, 1, 5, 10);

        expect(writtenData![0]).toBe(6);
        expect(writtenData![1]).toBe(1);
        expect(writtenData![2]).toBe(5);
        expect(writtenData![3]).toBe(10);
    });

    it("execute test case3 - default parameters", () =>
    {
        let writtenData: Uint32Array | null = null;

        const mockBuffer = {} as unknown as GPUBuffer;
        const mockDevice = {
            "queue": {
                "writeBuffer": vi.fn((_buffer: GPUBuffer, _offset: number, data: Uint32Array) => {
                    writtenData = new Uint32Array(data);
                })
            }
        } as unknown as GPUDevice;

        execute(mockDevice, mockBuffer, 100, 50);

        expect(writtenData![0]).toBe(100);
        expect(writtenData![1]).toBe(50);
        expect(writtenData![2]).toBe(0);
        expect(writtenData![3]).toBe(0);
    });
});
