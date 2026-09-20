import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    listeners: new Set<(event: MessageEvent) => void>(),
    post: vi.fn(), generate: vi.fn()
}));
vi.mock("../../RendererWorker", () => ({ $rendererWorker: {
    postMessage: mocks.post,
    addEventListener: (_name: string, listener: (event: MessageEvent) => void) => mocks.listeners.add(listener),
    removeEventListener: (_name: string, listener: (event: MessageEvent) => void) => mocks.listeners.delete(listener)
} }));
vi.mock("@next2d/display", () => ({ stage: { $generateRenderQueue: mocks.generate } }));
vi.mock("../../CoreUtil", () => ({ $renderMatrix: new Float32Array([1, 0, 0, 1, 0, 0]) }));

describe("queue trimming across rendering and capture ownership", () => {
    beforeEach(() => {
        vi.resetModules(); vi.clearAllMocks(); mocks.listeners.clear();
    });
    it("sends the compacted buffer and survives capture/render replies in either order", async () => {
        const { renderQueue: queue } = await import("@next2d/render-queue");
        const { execute: render } = await import("./PlayerRenderingPostMessageService");
        const { execute: capture } = await import("./PlayerTransferCanvasPostMessageService");
        type ISent = { command: string; buffer: Float32Array; length: number };
        const sent: ISent[] = [];
        mocks.post.mockImplementation((message: ISent, transfer: Transferable[]) => {
            sent.push(structuredClone(message, { transfer }));
            expect(queue.buffer.byteLength).toBe(0);
        });
        const reply = (message: string, buffer?: Float32Array) => {
            const returned = buffer ? structuredClone(buffer, { transfer: [buffer.buffer] }) : undefined;
            const data = { message, buffer: returned, enabled: true, imageBitmap: document.createElement("canvas") };
            for (const listener of [...mocks.listeners]) listener(new MessageEvent("message", { data }));
        };
        let words = 70023;
        mocks.generate.mockImplementation(() => {
            if (queue.buffer.length < words) queue.resize(words);
            queue.offset = words;
            new Uint32Array(queue.buffer.buffer, queue.buffer.byteOffset, words).fill(0x7fa12345);
        });
        queue.buffer = new Float32Array(524288);
        reply("renderFlowControl");
        for (let i = 0; i < 120; i++) {
            render();
            const last = sent.at(-1)!;
            expect(last.buffer.byteLength).toBe(i < 119 ? 2097152 : 1048576);
            expect(new Uint32Array(last.buffer.buffer, 0, words).every(v => v === 0x7fa12345)).toBe(true);
            reply("render", last.buffer);
        }
        for (const captureFirst of [false, true]) {
            render();
            const rendered = sent.at(-1)!;
            words = 375000;
            const canvas = document.createElement("canvas");
            const pending = capture({} as Parameters<typeof capture>[0], new Float32Array(6), new Float32Array(8), canvas);
            const captured = sent.at(-1)!;
            expect(captured.command).toBe("capture");
            const count = sent.length;
            if (captureFirst) {
                reply("capture", captured.buffer);
                render();
                expect(sent.length).toBe(count); // capture ACK does not release render flow
                reply("render", rendered.buffer);
            } else {
                reply("render", rendered.buffer);
                reply("capture", captured.buffer);
            }
            expect(await pending).toBe(canvas);
            expect(queue.buffer.byteLength).toBe(2097152);
            words = 70023;
            render();
            expect(sent.at(-1)!.length).toBe(words);
            reply("render", sent.at(-1)!.buffer);
        }
    });
});
