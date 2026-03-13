import { execute } from "./TextFiledGetAlignOffsetService";
import { describe, expect, it } from "vitest";

describe("TextFiledGetAlignOffsetService.js test", () => {

    it("execute test case1 - left align returns leftMargin", () =>
    {
        const textData = {
            "widthTable": [100]
        } as any;

        const textObject = {
            "line": 0,
            "textFormat": {
                "align": "left",
                "leftMargin": 5,
                "rightMargin": 0
            }
        } as any;

        const textSetting = {
            "wordWrap": true,
            "rawWidth": 200,
            "autoSize": "left"
        } as any;

        const result = execute(textData, textObject, textSetting);
        expect(result).toBe(5);
    });

    it("execute test case2 - center align", () =>
    {
        const textData = {
            "widthTable": [100]
        } as any;

        const textObject = {
            "line": 0,
            "textFormat": {
                "align": "center",
                "leftMargin": 0,
                "rightMargin": 0
            }
        } as any;

        const textSetting = {
            "wordWrap": true,
            "rawWidth": 200,
            "autoSize": "none"
        } as any;

        const result = execute(textData, textObject, textSetting);
        expect(result).toBe(Math.max(0, 200 / 2 - 0 - 0 - 100 / 2 - 2));
    });

    it("execute test case3 - right align", () =>
    {
        const textData = {
            "widthTable": [100]
        } as any;

        const textObject = {
            "line": 0,
            "textFormat": {
                "align": "right",
                "leftMargin": 0,
                "rightMargin": 0
            }
        } as any;

        const textSetting = {
            "wordWrap": true,
            "rawWidth": 200,
            "autoSize": "none"
        } as any;

        const result = execute(textData, textObject, textSetting);
        expect(result).toBe(Math.max(0, 200 - 0 - 100 - 0 - 4));
    });

    it("execute test case4 - autoSize center", () =>
    {
        const textData = {
            "widthTable": [80]
        } as any;

        const textObject = {
            "line": 0,
            "textFormat": {
                "align": "left",
                "leftMargin": 0,
                "rightMargin": 0
            }
        } as any;

        const textSetting = {
            "wordWrap": true,
            "rawWidth": 200,
            "autoSize": "center"
        } as any;

        const result = execute(textData, textObject, textSetting);
        expect(result).toBe(Math.max(0, 200 / 2 - 0 - 0 - 80 / 2 - 2));
    });

    it("execute test case5 - autoSize right", () =>
    {
        const textData = {
            "widthTable": [80]
        } as any;

        const textObject = {
            "line": 0,
            "textFormat": {
                "align": "left",
                "leftMargin": 0,
                "rightMargin": 0
            }
        } as any;

        const textSetting = {
            "wordWrap": true,
            "rawWidth": 200,
            "autoSize": "right"
        } as any;

        const result = execute(textData, textObject, textSetting);
        expect(result).toBe(Math.max(0, 200 - 0 - 80 - 0 - 4));
    });

    it("execute test case6 - lineWidth exceeds rawWidth without wordWrap", () =>
    {
        const textData = {
            "widthTable": [300]
        } as any;

        const textObject = {
            "line": 0,
            "textFormat": {
                "align": "center",
                "leftMargin": 10,
                "rightMargin": 5
            }
        } as any;

        const textSetting = {
            "wordWrap": false,
            "rawWidth": 200,
            "autoSize": "none"
        } as any;

        const result = execute(textData, textObject, textSetting);
        expect(result).toBe(10);
    });

    it("execute test case7 - missing line in widthTable defaults to 0", () =>
    {
        const textData = {
            "widthTable": [100]
        } as any;

        const textObject = {
            "line": 5,
            "textFormat": {
                "align": "left",
                "leftMargin": 0,
                "rightMargin": 0
            }
        } as any;

        const textSetting = {
            "wordWrap": true,
            "rawWidth": 200,
            "autoSize": "none"
        } as any;

        const result = execute(textData, textObject, textSetting);
        expect(result).toBe(0);
    });

    it("execute test case8 - margins with center align", () =>
    {
        const textData = {
            "widthTable": [100]
        } as any;

        const textObject = {
            "line": 0,
            "textFormat": {
                "align": "center",
                "leftMargin": 10,
                "rightMargin": 10
            }
        } as any;

        const textSetting = {
            "wordWrap": true,
            "rawWidth": 300,
            "autoSize": "none"
        } as any;

        const result = execute(textData, textObject, textSetting);
        expect(result).toBe(Math.max(0, 300 / 2 - 10 - 10 - 100 / 2 - 2));
    });
});
