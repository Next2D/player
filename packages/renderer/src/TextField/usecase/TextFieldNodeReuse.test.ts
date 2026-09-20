import { beforeEach, expect, it, vi } from "vitest";
import type { Node } from "@next2d/texture-packer";
import { execute } from "./TextFieldRenderUseCase";

const { state, context, raster, store } = vi.hoisted(() => {
    const state = { node: null as Node | null };
    const context = {
        reuseNode: vi.fn(() => true), removeNode: vi.fn(),
        createNode: vi.fn((w: number, h: number) => ({ index: 0, x: 2, y: 3, w, h })),
        queueTextElement: vi.fn(() => true), drawDisplayObject: vi.fn(), applyFilter: vi.fn(),
        setTransform: vi.fn(), currentAttachmentObject: null, atlasAttachmentObject: null
    };
    const store = {
        get: vi.fn(() => state.node),
        set: vi.fn((_id: string, _key: string, node: Node) => { state.node = node; })
    };
    return { state, context, store, raster: vi.fn(() => ({ width: 64, height: 32 })) };
});
vi.mock("../../RendererUtil", () => ({ $context: context }));
vi.mock("@next2d/cache", () => ({ $cacheStore: store }));
vi.mock("./TextFieldDrawOffscreenCanvasUseCase", () => ({ execute: raster }));

const queue = (width = 64, filter = false): Float32Array => {
    const values = [1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0,
        0, 0, width, 32, 0, 0, width, 32, 1, 0, 1, 1, 1, 1,
        0, 0, 4, 0, 2,
        -1, 0, 0, width, 32, width, 32, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12,
        0, +filter];
    if (filter) values.push(0, 0, 0, width, 32, 0);
    const data = new Float32Array(values);
    new Uint8Array(data.buffer).set(new TextEncoder().encode("null"), 31 * 4);
    return data;
};
beforeEach(() => {
    vi.clearAllMocks();
    state.node = { index: 1, x: 5, y: 7, w: 64, h: 32 } as Node;
    context.reuseNode.mockReturnValue(true);
});
it.each([false, true])("rerasterizes and uploads the same node, retaining filter invalidation=%s", filter => {
    const old = state.node;
    const first = queue(64, filter);
    expect(execute(first, 0)).toBe(first.length);
    expect(state.node).toBe(old);
    expect(context.reuseNode).toHaveBeenCalledWith(old);
    expect(context.removeNode).not.toHaveBeenCalled();
    expect(context.createNode).not.toHaveBeenCalled();
    expect(raster).toHaveBeenCalledOnce();
    expect(context.queueTextElement).toHaveBeenCalledWith(old, expect.any(Object));
    if (filter) expect(context.applyFilter.mock.calls[0].slice(0, 3)).toEqual([old, "1", true]);
    else expect(context.drawDisplayObject.mock.calls[0][0]).toBe(old);
});
it("releases and reallocates when dimensions change", () => {
    const old = state.node;
    execute(queue(65), 0);
    expect(context.reuseNode).not.toHaveBeenCalled();
    expect(context.removeNode).toHaveBeenCalledWith(old);
    expect(context.createNode).toHaveBeenCalledWith(65, 32);
    expect(state.node).not.toBe(old);
    expect(context.queueTextElement.mock.calls[0][0]).toBe(state.node);
});
it("uses the original allocation path when ownership validation rejects reuse", () => {
    const old = state.node;
    context.reuseNode.mockReturnValue(false);
    execute(queue(), 0);
    expect(context.removeNode).toHaveBeenCalledWith(old);
    expect(context.createNode).toHaveBeenCalledWith(64, 32);
});
it("allocates after the cache entry has been removed", () => {
    state.node = null;
    execute(queue(), 0);
    expect(context.reuseNode).not.toHaveBeenCalled();
    expect(context.removeNode).not.toHaveBeenCalled();
    expect(context.createNode).toHaveBeenCalledWith(64, 32);
});
