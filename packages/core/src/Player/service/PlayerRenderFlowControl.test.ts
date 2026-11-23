import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    receive: null as ((event: MessageEvent) => void) | null,
    post: vi.fn(), generate: vi.fn(),
    queue: { trim: vi.fn(), offset: 0, buffer: new Float32Array(32) }
}));
vi.mock("../../RendererWorker", () => ({ $rendererWorker: {
    postMessage: mocks.post,
    addEventListener: (_name: string, callback: (event: MessageEvent) => void) => { mocks.receive = callback; }
} }));
vi.mock("@next2d/display", () => ({ stage: { $generateRenderQueue: mocks.generate } }));
vi.mock("@next2d/render-queue", () => ({ renderQueue: mocks.queue }));
vi.mock("../../CoreUtil", () => ({ $renderMatrix: new Float32Array([1, 0, 0, 1, 0, 0]) }));

describe("Renderer request flow control", () => {
    beforeEach(() => {
        vi.resetModules(); vi.clearAllMocks();
        mocks.queue.buffer = new Float32Array(32);
        mocks.generate.mockImplementation(() => { mocks.queue.offset = 4; });
    });
    const receive = (data: object) => mocks.receive!(new MessageEvent("message", { data }));
    it("drains pre-initialization requests before allowing the next queue generation", async () => {
        const { execute } = await import("./PlayerRenderingPostMessageService");
        execute(); execute();
        expect(mocks.post).toHaveBeenCalledTimes(2);
        receive({ message: "renderFlowControl", enabled: true });
        // Two requests are already with the renderer: the limit is reached.
        execute(); expect(mocks.generate).toHaveBeenCalledTimes(2);
        receive({ message: "render", buffer: new Float32Array(32) });
        execute(); expect(mocks.generate).toHaveBeenCalledTimes(3);
        execute(); expect(mocks.generate).toHaveBeenCalledTimes(3);
        receive({ message: "render", buffer: new Float32Array(32) });
        execute(); expect(mocks.generate).toHaveBeenCalledTimes(4);
    });
    it("sends one more request while the renderer still works on the previous one", async () => {
        const { execute } = await import("./PlayerRenderingPostMessageService");
        receive({ message: "renderFlowControl", enabled: true });
        execute(); execute();
        expect(mocks.post).toHaveBeenCalledTimes(2);
        expect(mocks.generate).toHaveBeenCalledTimes(2);
        execute();
        expect(mocks.post).toHaveBeenCalledTimes(2);
        expect(mocks.generate).toHaveBeenCalledTimes(2);
    });
    it("does not consume intermediate changes and generates the latest state after ACK", async () => {
        const { execute } = await import("./PlayerRenderingPostMessageService");
        let revision = 0;
        let changed = true;
        const consumed: number[] = [];
        mocks.generate.mockImplementation(() => {
            consumed.push(revision);
            changed = false;
            mocks.queue.offset = 4;
        });
        receive({ message: "renderFlowControl", enabled: true });
        execute();
        revision = 1;
        execute();
        for (revision = 2; revision <= 20; revision++) {
            changed = true;
            execute();
            expect(changed).toBe(true);
            expect(consumed).toEqual([0, 1]);
        }
        revision = 99;
        receive({ message: "render", buffer: new Float32Array(32) });
        execute();
        expect(consumed).toEqual([0, 1, 99]);
        expect(changed).toBe(false);
        expect(mocks.post).toHaveBeenCalledTimes(3);
    });
    it("a discarded smaller returned buffer still releases capacity", async () => {
        const { execute } = await import("./PlayerRenderingPostMessageService");
        receive({ message: "renderFlowControl", enabled: true });
        execute(); execute(); execute();
        expect(mocks.generate).toHaveBeenCalledTimes(2);
        const owned = mocks.queue.buffer;
        receive({ message: "render", buffer: new Float32Array(1) });
        expect(mocks.queue.buffer).toBe(owned);
        execute(); expect(mocks.generate).toHaveBeenCalledTimes(3);
    });
    it("empty queues and failed sends do not consume capacity", async () => {
        const { execute } = await import("./PlayerRenderingPostMessageService");
        receive({ message: "renderFlowControl", enabled: true });
        mocks.generate.mockImplementationOnce(() => { mocks.queue.offset = 0; });
        execute(); expect(mocks.post).not.toHaveBeenCalled();
        mocks.post.mockImplementationOnce(() => { throw new Error("failed transfer"); });
        expect(execute).toThrow("failed transfer");
        execute(); expect(mocks.post).toHaveBeenCalledTimes(2);
    });
    it("capture acknowledgements do not release rendering capacity; disabling restores immediate sends", async () => {
        const { execute } = await import("./PlayerRenderingPostMessageService");
        receive({ message: "renderFlowControl", enabled: true });
        execute(); execute();
        receive({ message: "capture", buffer: new Float32Array(32) });
        execute(); expect(mocks.post).toHaveBeenCalledTimes(2);
        receive({ message: "renderFlowControl", enabled: false });
        execute(); expect(mocks.post).toHaveBeenCalledTimes(3);
    });
});
