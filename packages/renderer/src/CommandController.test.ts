import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IMessage } from "./interface/IMessage";
import { CommandController } from "./CommandController";

const mocks = vi.hoisted(() => ({
    context: {} as { getRenderCompletion?: () => Promise<void> },
    render: vi.fn(), resize: vi.fn(), remove: vi.fn(), post: vi.fn(), capture: vi.fn(), clear: vi.fn()
}));
vi.mock("./RendererUtil", () => ({ $context: mocks.context }));
vi.mock("./Command/service/CommandInitializeContextService", () => ({ execute: vi.fn() }));
vi.mock("./Command/service/CommandResizeService", () => ({ execute: mocks.resize }));
vi.mock("./Command/service/CommandRemoveCacheService", () => ({ execute: mocks.remove }));
vi.mock("./Command/usecase/CommandRenderUseCase", () => ({ execute: mocks.render }));
vi.mock("./Command/usecase/CommandCaptureUseCase", () => ({ execute: mocks.capture }));
vi.mock("@next2d/cache", () => ({ $cacheStore: { reset: mocks.clear } }));

const frame = (): IMessage => ({ command: "render", buffer: new Float32Array([1, 2, 3]), length: 2, bgColor: 0, bgAlpha: 0 });
const deferred = () => {
    let resolve!: () => void;
    let reject!: (reason: Error) => void;
    const promise = new Promise<void>((yes, no) => { resolve = yes; reject = no; });
    return { promise, resolve, reject };
};

describe("CommandController frame capacity", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        delete mocks.context.getRenderCompletion;
        vi.stubGlobal("postMessage", mocks.post);
    });
    it("preserves immediate acknowledgements without a completion provider", async () => {
        const controller = new CommandController(), a = frame(), b = frame();
        controller.queue.push(a, b);
        const done = controller.execute();
        expect(mocks.post).toHaveBeenCalledTimes(2);
        expect(mocks.post).toHaveBeenNthCalledWith(1, { message: "render", buffer: a.buffer }, [a.buffer.buffer]);
        expect(mocks.render.mock.calls[0][0]).toEqual(new Float32Array([1, 2]));
        await done;
        expect(controller.state).toBe("deactivate");
    });
    it("holds the second acknowledgement and preserves resize/new-command order", async () => {
        const first = deferred(), second = deferred();
        mocks.context.getRenderCompletion = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
        const controller = new CommandController(), a = frame(), b = frame();
        controller.queue.push(a, b, { ...frame(), command: "resize" });
        const done = controller.execute();
        expect(mocks.render).toHaveBeenCalledTimes(2);
        expect(mocks.post).toHaveBeenCalledTimes(1);
        expect(mocks.resize).not.toHaveBeenCalled();
        expect(controller.state).toBe("active");
        controller.queue.push({ ...frame(), command: "removeCache" });
        first.resolve(); await done;
        expect(mocks.post).toHaveBeenNthCalledWith(2, { message: "render", buffer: b.buffer }, [b.buffer.buffer]);
        expect(mocks.post.mock.invocationCallOrder[1]).toBeLessThan(mocks.resize.mock.invocationCallOrder[0]);
        expect(mocks.resize.mock.invocationCallOrder[0]).toBeLessThan(mocks.remove.mock.invocationCallOrder[0]);
        expect(controller.queue).toHaveLength(0);
        expect(controller.state).toBe("deactivate");
        second.resolve();
    });
    it("keeps render, capture, resize and cache commands ordered without a completion provider", async () => {
        const bitmap = { width: 64, height: 32 } as ImageBitmap;
        mocks.capture.mockResolvedValueOnce(bitmap);
        const controller = new CommandController();
        const render = frame();
        const capture = { ...frame(), command: "capture", width: 64, height: 32 };
        controller.queue.push(render, capture, { ...frame(), command: "resize" },
            { ...frame(), command: "removeCache" }, { ...frame(), command: "cacheClear" });
        const done = controller.execute();
        expect(mocks.post).toHaveBeenCalledTimes(1);
        expect(mocks.resize).not.toHaveBeenCalled();
        await done;
        expect(mocks.post).toHaveBeenNthCalledWith(2,
            { message: "capture", buffer: capture.buffer, imageBitmap: bitmap },
            [capture.buffer.buffer, bitmap]);
        expect(mocks.post.mock.invocationCallOrder[0]).toBeLessThan(mocks.capture.mock.invocationCallOrder[0]);
        expect(mocks.post.mock.invocationCallOrder[1]).toBeLessThan(mocks.resize.mock.invocationCallOrder[0]);
        expect(mocks.resize.mock.invocationCallOrder[0]).toBeLessThan(mocks.remove.mock.invocationCallOrder[0]);
        expect(mocks.remove.mock.invocationCallOrder[0]).toBeLessThan(mocks.clear.mock.invocationCallOrder[0]);
        expect(controller.queue).toHaveLength(0);
        expect(controller.state).toBe("deactivate");
    });
    it("keeps capture behind capacity and returns its original transfers", async () => {
        const first = deferred(), second = deferred();
        mocks.context.getRenderCompletion = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
        const bitmap = { width: 64, height: 32 } as ImageBitmap;
        mocks.capture.mockResolvedValueOnce(bitmap);
        const controller = new CommandController(), a = frame(), b = frame();
        const capture = { ...frame(), command: "capture", width: 64, height: 32 };
        controller.queue.push(a, b, capture);
        const done = controller.execute();
        expect(mocks.post).toHaveBeenCalledTimes(1);
        expect(mocks.capture).not.toHaveBeenCalled();
        first.resolve();
        await done;
        expect(mocks.post).toHaveBeenNthCalledWith(2, { message: "render", buffer: b.buffer }, [b.buffer.buffer]);
        expect(mocks.post).toHaveBeenNthCalledWith(3,
            { message: "capture", buffer: capture.buffer, imageBitmap: bitmap }, [capture.buffer.buffer, bitmap]);
        expect(mocks.post.mock.invocationCallOrder[1]).toBeLessThan(mocks.capture.mock.invocationCallOrder[0]);
        expect(controller.state).toBe("deactivate");
        expect(controller.queue).toHaveLength(0);
        second.resolve();
    });
    it("a rejected completion releases the held buffer and queue", async () => {
        const failed = deferred();
        mocks.context.getRenderCompletion = vi.fn().mockReturnValueOnce(failed.promise).mockResolvedValueOnce(undefined);
        const controller = new CommandController();
        controller.queue.push(frame(), frame());
        const done = controller.execute();
        failed.reject(new Error("lost"));
        await done;
        expect(mocks.post).toHaveBeenCalledTimes(2);
        expect(controller.state).toBe("deactivate");
    });
    it.each([false, true])("enables Main request flow control for either backend (GPU=%s)", async gpu => {
        if (gpu) mocks.context.getRenderCompletion = () => Promise.resolve();
        const controller = new CommandController();
        controller.queue.push({ ...frame(), command: "initialize" });
        await controller.execute();
        expect(mocks.post).toHaveBeenCalledWith({ message: "renderFlowControl", enabled: true });
    });
});
