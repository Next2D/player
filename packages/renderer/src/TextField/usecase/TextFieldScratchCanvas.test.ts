import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { execute } from "./TextFieldDrawOffscreenCanvasUseCase";
import type { ITextSetting } from "../../interface/ITextSetting";

const setting: ITextSetting = {
    width: 64, height: 32, autoSize: "none", stopIndex: -1,
    scrollX: 0, scrollY: 0, textWidth: 64, textHeight: 32,
    rawWidth: 64, rawHeight: 32, focusIndex: -1, selectIndex: -1,
    focusVisible: false, thickness: 0, thicknessColor: 0, wordWrap: false,
    border: false, borderColor: 0, background: false, backgroundColor: 0,
    defaultColor: 0, defaultSize: 12
};

describe("caller-owned text scratch canvas", () => {
    const context = { isContextLost: vi.fn(() => false) };
    const create = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
        context.isContextLost.mockReturnValue(false);
        vi.stubGlobal("OffscreenCanvas", class {
            constructor(public width: number, public height: number) { create(); }
            getContext() { return context; }
        });
    });
    afterEach(() => vi.unstubAllGlobals());

    it("keeps the default result independently owned", () => {
        expect(execute(null, setting, 1, 1)).not.toBe(execute(null, setting, 1, 1));
        expect(create).toHaveBeenCalledTimes(2);
    });

    it.each([32, 16])("resets even the same width and adjusts height from %i", height => {
        let width = 64;
        const widthSet = vi.fn((value: number) => { width = value; });
        const heightSet = vi.fn((value: number) => { height = value; });
        const scratch = {
            get width() { return width; }, set width(value: number) { widthSet(value); },
            get height() { return height; }, set height(value: number) { heightSet(value); },
            getContext: () => context
        } as unknown as OffscreenCanvas;
        const oldHeight = height;
        expect(execute(null, setting, 1, 1, scratch)).toBe(scratch);
        expect(widthSet).toHaveBeenCalledExactlyOnceWith(64);
        expect(heightSet).toHaveBeenCalledTimes(oldHeight === 32 ? 0 : 1);
        expect(scratch.height).toBe(32);
        expect(create).not.toHaveBeenCalled();
    });

    it.each(["lost", "missing"])("replaces a scratch with a %s context", mode => {
        const scratch = {
            width: 64, height: 32,
            getContext: () => mode === "lost" ? { isContextLost: () => true } : null
        } as unknown as OffscreenCanvas;
        const canvas = execute(null, setting, 1, 1, scratch);
        expect(canvas).not.toBe(scratch);
        expect(canvas.width).toBe(64);
        expect(create).toHaveBeenCalledTimes(1);
    });
});
