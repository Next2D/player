import { execute } from "./TextFieldDrawOffscreenCanvasUseCase";
import { describe, expect, it, vi, beforeAll } from "vitest";

vi.mock("../../RendererUtil", () => ({
    "$intToRGBA": vi.fn((color: number) => ({
        "R": (color >> 16) & 0xFF,
        "G": (color >> 8) & 0xFF,
        "B": color & 0xFF,
        "A": 1
    }))
}));

vi.mock("../service/TextFiledGetAlignOffsetService", () => ({
    "execute": vi.fn(() => 0)
}));

vi.mock("../service/TextFieldGenerateFontStyleService", () => ({
    "execute": vi.fn(() => "12px Arial")
}));

// OffscreenCanvas mock with full 2D context
beforeAll(() => {
    const originalOffscreenCanvas = globalThis.OffscreenCanvas;
    (globalThis as any).OffscreenCanvas = class MockOffscreenCanvas {
        width: number;
        height: number;
        constructor(w: number, h: number) {
            this.width = w;
            this.height = h;
        }
        getContext() {
            return {
                "fillRect": vi.fn(),
                "beginPath": vi.fn(),
                "moveTo": vi.fn(),
                "lineTo": vi.fn(),
                "quadraticCurveTo": vi.fn(),
                "closePath": vi.fn(),
                "isPointInPath": vi.fn(() => false),
                "fill": vi.fn(),
                "stroke": vi.fn(),
                "save": vi.fn(),
                "restore": vi.fn(),
                "clip": vi.fn(),
                "setTransform": vi.fn(),
                "fillText": vi.fn(),
                "strokeText": vi.fn(),
                "rect": vi.fn(),
                "font": "",
                "fillStyle": "",
                "strokeStyle": "",
                "lineWidth": 1
            };
        }
    };

    return () => {
        (globalThis as any).OffscreenCanvas = originalOffscreenCanvas;
    };
});

describe("TextFieldDrawOffscreenCanvasUseCase.js test", () => {

    it("execute test case1 - returns canvas with null text_data", () =>
    {
        const textSetting = {
            "width": 200,
            "height": 100,
            "background": false,
            "border": false,
            "backgroundColor": 0xFFFFFF,
            "borderColor": 0x000000,
            "autoSize": "none",
            "stopIndex": -1,
            "scrollX": 0,
            "scrollY": 0,
            "textWidth": 200,
            "textHeight": 100,
            "rawWidth": 200,
            "rawHeight": 100,
            "focusIndex": -1,
            "selectIndex": -1,
            "focusVisible": false,
            "thickness": 0,
            "thicknessColor": 0,
            "wordWrap": false,
            "defaultColor": 0,
            "defaultSize": 12
        } as any;

        const canvas = execute(null, textSetting, 1, 1);
        expect(canvas).toBeInstanceOf(OffscreenCanvas);
        expect(canvas.width).toBe(200);
        expect(canvas.height).toBe(100);
    });

    it("execute test case2 - draws background and border", () =>
    {
        const textSetting = {
            "width": 300,
            "height": 150,
            "background": true,
            "border": true,
            "backgroundColor": 0xFF0000,
            "borderColor": 0x00FF00,
            "autoSize": "none",
            "stopIndex": -1,
            "scrollX": 0,
            "scrollY": 0,
            "textWidth": 300,
            "textHeight": 150,
            "rawWidth": 300,
            "rawHeight": 150,
            "focusIndex": -1,
            "selectIndex": -1,
            "focusVisible": false,
            "thickness": 0,
            "thicknessColor": 0,
            "wordWrap": false,
            "defaultColor": 0,
            "defaultSize": 12
        } as any;

        const canvas = execute(null, textSetting, 1, 1);
        expect(canvas).toBeInstanceOf(OffscreenCanvas);
    });

    it("execute test case3 - renders text objects", () =>
    {
        const textData = {
            "textTable": [
                {
                    "mode": "wrap",
                    "line": 0,
                    "w": 0,
                    "h": 14,
                    "y": 0,
                    "text": "",
                    "textFormat": {
                        "align": "left",
                        "leftMargin": 0,
                        "rightMargin": 0,
                        "color": 0x000000,
                        "underline": false
                    }
                },
                {
                    "mode": "text",
                    "line": 0,
                    "w": 50,
                    "h": 14,
                    "y": 12,
                    "text": "Hello",
                    "textFormat": {
                        "align": "left",
                        "leftMargin": 0,
                        "rightMargin": 0,
                        "color": 0x000000,
                        "underline": false
                    }
                }
            ],
            "lineTable": [],
            "widthTable": [50],
            "heightTable": [16],
            "ascentTable": [12]
        } as any;

        const textSetting = {
            "width": 200,
            "height": 100,
            "background": false,
            "border": false,
            "backgroundColor": 0xFFFFFF,
            "borderColor": 0x000000,
            "autoSize": "none",
            "stopIndex": -1,
            "scrollX": 0,
            "scrollY": 0,
            "textWidth": 200,
            "textHeight": 100,
            "rawWidth": 200,
            "rawHeight": 100,
            "focusIndex": -1,
            "selectIndex": -1,
            "focusVisible": false,
            "thickness": 0,
            "thicknessColor": 0,
            "wordWrap": false,
            "defaultColor": 0,
            "defaultSize": 12
        } as any;

        const canvas = execute(textData, textSetting, 1, 1);
        expect(canvas).toBeInstanceOf(OffscreenCanvas);
        expect(canvas.width).toBe(200);
        expect(canvas.height).toBe(100);
    });
});
