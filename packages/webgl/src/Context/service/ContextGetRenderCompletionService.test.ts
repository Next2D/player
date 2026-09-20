import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { execute } from "./ContextGetRenderCompletionService";

const mocks = vi.hoisted(() => ({
    gl: {
        SYNC_GPU_COMMANDS_COMPLETE: 0x9117,
        ALREADY_SIGNALED: 0x911A,
        TIMEOUT_EXPIRED: 0x911B,
        CONDITION_SATISFIED: 0x911C,
        WAIT_FAILED: 0x911D,
        fenceSync: vi.fn((): WebGLSync | null => null),
        flush: vi.fn(),
        clientWaitSync: vi.fn((_sync: WebGLSync, _flags: number, _timeout: number): number => 0),
        deleteSync: vi.fn()
    }
}));
vi.mock("../../WebGLUtil", () => ({ get $gl () { return mocks.gl; } }));

describe("render completion", () => {
    const sync = {} as WebGLSync;
    const originalGl = mocks.gl;
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(0);
        vi.resetAllMocks();
        mocks.gl.fenceSync.mockReturnValue(sync);
        mocks.gl.clientWaitSync.mockReturnValue(mocks.gl.ALREADY_SIGNALED);
    });
    afterEach(() => {
        mocks.gl = originalGl;
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it.each([0x911A, 0x911C])("yields before polling and releases a completed fence (%s)", async status => {
        mocks.gl.clientWaitSync.mockReturnValueOnce(mocks.gl.TIMEOUT_EXPIRED).mockReturnValueOnce(status);
        const completion = execute();
        expect(mocks.gl.fenceSync).toHaveBeenCalledWith(mocks.gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        expect(mocks.gl.flush).toHaveBeenCalledOnce();
        expect(mocks.gl.clientWaitSync).not.toHaveBeenCalled();
        await vi.advanceTimersByTimeAsync(4);
        expect(mocks.gl.deleteSync).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(1);
        await vi.advanceTimersByTimeAsync(4);
        await completion;
        expect(mocks.gl.clientWaitSync).toHaveBeenCalledTimes(2);
        expect(mocks.gl.clientWaitSync).toHaveBeenCalledWith(sync, 0, 0);
        expect(mocks.gl.deleteSync).toHaveBeenCalledExactlyOnceWith(sync);
        expect(vi.getTimerCount()).toBe(0);
    });

    it.each([0x911D, 0])("rejects a failed/lost context without retaining the fence (%s)", async status => {
        mocks.gl.clientWaitSync.mockReturnValue(status);
        const check = expect(execute()).rejects.toThrow("Render fence wait failed");
        await vi.advanceTimersByTimeAsync(4);
        await check;
        expect(mocks.gl.deleteSync).toHaveBeenCalledExactlyOnceWith(sync);
        expect(vi.getTimerCount()).toBe(0);
    });

    it("rejects a null fence without scheduling or deleting an absent handle", async () => {
        mocks.gl.fenceSync.mockReturnValue(null);
        await expect(execute()).rejects.toThrow("Unable to create render fence");
        expect(mocks.gl.flush).not.toHaveBeenCalled();
        expect(mocks.gl.deleteSync).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });

    it("releases the fence when a poll throws", async () => {
        mocks.gl.clientWaitSync.mockImplementation(() => { throw new Error("wait failed"); });
        const check = expect(execute()).rejects.toThrow("wait failed");
        await vi.advanceTimersByTimeAsync(4);
        await check;
        expect(mocks.gl.deleteSync).toHaveBeenCalledExactlyOnceWith(sync);
        expect(vi.getTimerCount()).toBe(0);
    });

    it("releases the fence when flush throws before scheduling a poll", async () => {
        mocks.gl.flush.mockImplementation(() => { throw new Error("flush failed"); });
        await expect(execute()).rejects.toThrow("flush failed");
        expect(mocks.gl.deleteSync).toHaveBeenCalledExactlyOnceWith(sync);
        expect(vi.getTimerCount()).toBe(0);
    });

    it("shares one timer and checks younger work only after the older fence completes", async () => {
        const second = {} as WebGLSync;
        mocks.gl.fenceSync.mockReturnValueOnce(sync).mockReturnValueOnce(second);
        mocks.gl.clientWaitSync.mockImplementation(target => Date.now() >= (target === sync ? 20 : 28)
            ? mocks.gl.ALREADY_SIGNALED : mocks.gl.TIMEOUT_EXPIRED);
        const a = execute(), b = execute();
        expect(vi.getTimerCount()).toBe(1);
        await vi.advanceTimersByTimeAsync(16);
        expect(mocks.gl.clientWaitSync).toHaveBeenCalledTimes(4);
        expect(mocks.gl.clientWaitSync.mock.calls.every(args => args[0] === sync)).toBe(true);
        await vi.advanceTimersByTimeAsync(4);
        await a;
        expect(mocks.gl.deleteSync).toHaveBeenCalledExactlyOnceWith(sync);
        expect(vi.getTimerCount()).toBe(1);
        await vi.advanceTimersByTimeAsync(8);
        await b;
        expect(mocks.gl.clientWaitSync).toHaveBeenCalledTimes(8);
        expect(mocks.gl.deleteSync.mock.calls).toEqual([[sync], [second]]);
        expect(vi.getTimerCount()).toBe(0);
    });

    it("drains failed fences and can start again after failure", async () => {
        const second = {} as WebGLSync;
        mocks.gl.fenceSync.mockReturnValueOnce(sync).mockReturnValueOnce(second);
        mocks.gl.clientWaitSync.mockReturnValue(mocks.gl.WAIT_FAILED);
        const a = expect(execute()).rejects.toThrow("Render fence wait failed");
        const b = expect(execute()).rejects.toThrow("Render fence wait failed");
        await vi.advanceTimersByTimeAsync(4);
        await Promise.all([a, b]);
        expect(mocks.gl.deleteSync.mock.calls).toEqual([[sync], [second]]);
        expect(vi.getTimerCount()).toBe(0);
        mocks.gl.clientWaitSync.mockReturnValue(mocks.gl.ALREADY_SIGNALED);
        const next = execute();
        await vi.advanceTimersByTimeAsync(4);
        await next;
        expect(vi.getTimerCount()).toBe(0);
    });

    it("an allocation or flush failure does not disturb an older pending fence", async () => {
        const a = execute();
        mocks.gl.fenceSync.mockReturnValueOnce(null);
        await expect(execute()).rejects.toThrow("Unable to create render fence");
        const second = {} as WebGLSync;
        mocks.gl.fenceSync.mockReturnValueOnce(second);
        mocks.gl.flush.mockImplementationOnce(() => { throw new Error("flush failed"); });
        await expect(execute()).rejects.toThrow("flush failed");
        expect(mocks.gl.deleteSync).toHaveBeenCalledExactlyOnceWith(second);
        expect(vi.getTimerCount()).toBe(1);
        await vi.advanceTimersByTimeAsync(4);
        await a;
        expect(mocks.gl.deleteSync.mock.calls).toEqual([[second], [sync]]);
        expect(vi.getTimerCount()).toBe(0);
    });

    it("keeps an old context separate from a replacement context", async () => {
        const oldGl = mocks.gl;
        oldGl.clientWaitSync.mockReturnValue(oldGl.TIMEOUT_EXPIRED);
        const a = execute();
        const second = {} as WebGLSync;
        const newGl = { ...oldGl, fenceSync: vi.fn((): WebGLSync | null => second),
            flush: vi.fn(), deleteSync: vi.fn(),
            clientWaitSync: vi.fn((_sync: WebGLSync, _flags: number, _timeout: number): number => oldGl.ALREADY_SIGNALED) };
        mocks.gl = newGl;
        const b = execute();
        expect(vi.getTimerCount()).toBe(2);
        await vi.advanceTimersByTimeAsync(4);
        await b;
        expect(newGl.deleteSync).toHaveBeenCalledExactlyOnceWith(second);
        expect(oldGl.deleteSync).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(1);
        oldGl.clientWaitSync.mockReturnValue(oldGl.ALREADY_SIGNALED);
        await vi.advanceTimersByTimeAsync(4);
        await a;
        expect(oldGl.deleteSync).toHaveBeenCalledExactlyOnceWith(sync);
        expect(vi.getTimerCount()).toBe(0);
    });

    it("defers a fence added during polling until another task", async () => {
        const second = {} as WebGLSync;
        mocks.gl.fenceSync.mockReturnValueOnce(sync).mockReturnValueOnce(second);
        let added: Promise<void> | undefined;
        mocks.gl.clientWaitSync.mockImplementation(target => {
            if (target === sync) added = execute();
            return mocks.gl.ALREADY_SIGNALED;
        });
        const first = execute();
        await vi.advanceTimersByTimeAsync(4);
        await first;
        expect(mocks.gl.clientWaitSync).toHaveBeenCalledExactlyOnceWith(sync, 0, 0);
        expect(vi.getTimerCount()).toBe(1);
        await vi.advanceTimersByTimeAsync(4);
        await added;
        expect(mocks.gl.deleteSync.mock.calls).toEqual([[sync], [second]]);
        expect(vi.getTimerCount()).toBe(0);
    });
});
