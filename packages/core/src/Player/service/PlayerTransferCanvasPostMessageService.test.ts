import { execute } from "./PlayerTransferCanvasPostMessageService";
import { stage } from "@next2d/display";
import { renderQueue } from "@next2d/render-queue";
import { $rendererWorker } from "../../RendererWorker";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@next2d/display", () => ({
    stage: {
        $generateRenderQueue: vi.fn()
    }
}));

vi.mock("../../RendererWorker", () => ({
    $rendererWorker: {
        postMessage: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
    }
}));

vi.mock("@next2d/render-queue", () => ({
    renderQueue: {
        offset: 0,
        buffer: new Float32Array(1024)
    }
}));

describe("PlayerTransferCanvasPostMessageService.js test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        renderQueue.offset = 0;
    });

    it("execute test case1 - return early when offset is 0", async () =>
    {
        const mockDisplayObject = {} as any;
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        const canvas = document.createElement("canvas");

        renderQueue.offset = 0;

        const result = await execute(mockDisplayObject, matrix, colorTransform, canvas);

        expect(result).toBe(canvas);
        expect(stage.$generateRenderQueue).toHaveBeenCalled();
        expect($rendererWorker.postMessage).not.toHaveBeenCalled();
    });

    it("execute test case2 - capture with offset", async () =>
    {
        const mockDisplayObject = {} as any;
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        const canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;

        // Mock $generateRenderQueue to set offset after it's called
        vi.mocked(stage.$generateRenderQueue).mockImplementation(() => {
            renderQueue.offset = 100;
        });

        // Mock worker response
        const mockMessageEvent = {
            data: {
                message: "capture",
                buffer: new Float32Array(1024),
                imageBitmap: canvas
            }
        };

        vi.mocked($rendererWorker.addEventListener).mockImplementation((event, handler) => {
            if (event === "message") {
                setTimeout(() => (handler as any)(mockMessageEvent), 0);
            }
        });

        const result = await execute(mockDisplayObject, matrix, colorTransform, canvas);

        expect(result).toBeInstanceOf(HTMLCanvasElement);
        expect(stage.$generateRenderQueue).toHaveBeenCalled();
        expect($rendererWorker.postMessage).toHaveBeenCalled();
        expect($rendererWorker.addEventListener).toHaveBeenCalled();
        expect($rendererWorker.removeEventListener).toHaveBeenCalled();
    });

    it("execute test case3 - verify message structure", async () =>
    {
        const mockDisplayObject = {} as any;
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        const canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 150;

        // Mock $generateRenderQueue to set offset after it's called
        vi.mocked(stage.$generateRenderQueue).mockImplementation(() => {
            renderQueue.offset = 50;
        });

        const mockMessageEvent = {
            data: {
                message: "capture",
                buffer: new Float32Array(1024),
                imageBitmap: canvas
            }
        };

        vi.mocked($rendererWorker.addEventListener).mockImplementation((event, handler) => {
            if (event === "message") {
                setTimeout(() => (handler as any)(mockMessageEvent), 0);
            }
        });

        await execute(mockDisplayObject, matrix, colorTransform, canvas);

        const calls = vi.mocked($rendererWorker.postMessage).mock.calls;
        expect(calls.length).toBe(1);
        
        const message = calls[0][0];
        expect(message.command).toBe("capture");
        expect(message.buffer).toBeInstanceOf(Float32Array);
        expect(message.width).toBe(200);
        expect(message.height).toBe(150);
        expect(message.length).toBe(50);
    });

    it("execute test case4 - verify canvas context is used", async () =>
    {
        const mockDisplayObject = {} as any;
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        const canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;

        // Mock $generateRenderQueue to set offset after it's called
        vi.mocked(stage.$generateRenderQueue).mockImplementation(() => {
            renderQueue.offset = 100;
        });

        const mockImageBitmap = canvas;
        const mockMessageEvent = {
            data: {
                message: "capture",
                buffer: new Float32Array(1024),
                imageBitmap: mockImageBitmap
            }
        };

        vi.mocked($rendererWorker.addEventListener).mockImplementation((event, handler) => {
            if (event === "message") {
                setTimeout(() => (handler as any)(mockMessageEvent), 0);
            }
        });

        const result = await execute(mockDisplayObject, matrix, colorTransform, canvas);

        expect(result).toBe(canvas);
    });
});
