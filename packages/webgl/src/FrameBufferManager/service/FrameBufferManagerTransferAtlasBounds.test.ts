import { beforeEach, expect, it, vi } from "vitest";
import { execute } from "./FrameBufferManagerTransferAtlasTextureService";
import { $getActiveTransferBounds, $clearTransferBounds } from "../../AtlasManager";

const { state } = vi.hoisted(() => {
    const previous = { width: 320, height: 240 };
    const first = { width: 128, height: 128 };
    const third = { width: 64, height: 64 };
    return { state: {
        previous, first, third,
        pages: [first, null, third],
        dirty: new Set<number>(),
        context: { newDrawState: true, currentAttachmentObject: previous, bind: vi.fn() },
        gl: { DRAW_FRAMEBUFFER: 36009, COLOR_ATTACHMENT0: 36064,
            COLOR_BUFFER_BIT: 16384, NEAREST: 9728,
            bindFramebuffer: vi.fn(), framebufferTextureLayer: vi.fn(), blitFramebuffer: vi.fn() },
        texture: {}, framebuffer: {}, scissor: vi.fn(), enable: vi.fn(), disable: vi.fn(), bound: vi.fn()
    } };
});
vi.mock("../../AtlasManager", async importOriginal => {
    const original = await importOriginal<typeof import("../../AtlasManager")>();
    return { ...original,
        $getAtlasAttachmentObjects: () => state.pages,
        $ensureAtlasTextureLayers: vi.fn(),
        $getAtlasTextureObject: () => ({ resource: state.texture }),
        $isAtlasPageDirty: (index: number) => state.dirty.has(index),
        $clearAtlasPageDirty: (index: number) => state.dirty.delete(index)
    };
});
vi.mock("../../WebGLUtil", () => ({
    $gl: state.gl, $context: state.context, $RENDER_MAX_SIZE: 128,
    $enableScissorTest: state.enable, $disableScissorTest: state.disable, $setScissorBox: state.scissor
}));
vi.mock("../../FrameBufferManager", () => ({
    $atlasFrameBuffer: state.framebuffer, $setFramebufferBound: state.bound
}));
beforeEach(() => {
    vi.clearAllMocks();
    state.context.newDrawState = true;
    state.dirty.clear();
    $clearTransferBounds();
});
it("resolves the whole page when real Float32 transfer bounds are unrecorded", () => {
    state.dirty.add(0);
    expect($getActiveTransferBounds(0)[0]).toBe(Infinity);
    execute();
    expect(state.scissor).toHaveBeenCalledWith(0, 0, 128, 128);
    expect(state.gl.blitFramebuffer).toHaveBeenCalledWith(0, 0, 128, 128,
        0, 0, 128, 128, 16384, 9728);
    expect(state.dirty.size).toBe(0);
    expect(state.context.newDrawState).toBe(false);
    expect(state.context.bind).toHaveBeenLastCalledWith(state.previous);
    expect(state.disable).toHaveBeenCalledOnce();
});
it("preserves finite scissor bounds, page and binding ownership", () => {
    state.dirty.add(0); state.dirty.add(1); state.dirty.add(2);
    $getActiveTransferBounds(0).set([7, 9, 21, 23]);
    $getActiveTransferBounds(2).set([53, 61, 65, 66]);
    execute();
    expect(state.gl.blitFramebuffer.mock.calls).toEqual([
        [0, 0, 128, 128, 0, 0, 128, 128, 16384, 9728],
        [0, 0, 64, 64, 0, 0, 64, 64, 16384, 9728]
    ]);
    expect(state.gl.framebufferTextureLayer.mock.calls.map(args => args[4])).toEqual([0, 2]);
    expect(state.context.bind.mock.calls.map(args => args[0])).toEqual([state.first, state.third, state.previous]);
    expect(state.scissor.mock.calls).toEqual([[7, 9, 14, 14], [53, 61, 12, 5]]);
    expect(state.bound).toHaveBeenCalledTimes(2);
    expect(state.bound).toHaveBeenCalledWith(false);
    expect(state.dirty.size).toBe(0);
});
it("leaves clean pages untouched and skips transfers without new drawing", () => {
    state.context.newDrawState = false;
    execute();
    expect(state.enable).not.toHaveBeenCalled();
    state.context.newDrawState = true;
    execute();
    expect(state.gl.blitFramebuffer).not.toHaveBeenCalled();
    expect(state.context.bind).toHaveBeenCalledOnce();
});
