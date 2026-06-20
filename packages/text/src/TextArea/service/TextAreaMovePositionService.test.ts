import type { TextField } from "../../TextField";
import { execute } from "./TextAreaMovePositionService";
import { describe, expect, it } from "vitest";
import { $textArea } from "../../TextUtil";

/**
 * テスト環境では stage.rendererScale = 1 / rendererWidth = stageWidth = 0 /
 * $mainCanvasPosition = (0, 0) / devicePixelRatio = 1 のため、
 * localToGlobal を恒等変換にすると textarea の left/top はカーソルのローカル座標と一致する。
 */
const createTextField = (override: Partial<TextField>): TextField =>
{
    return {
        "localToGlobal": (point: { x: number; y: number }) => ({ "x": point.x, "y": point.y }),
        "scrollX": 0,
        "scrollY": 0,
        ...override
    } as unknown as TextField;
};

describe("TextAreaMovePositionService.js Test", () =>
{
    it("カーソルが行の途中にある場合、カーソルのx位置・行の上端(真裏)に配置され、高さがテキストサイズに合う", () =>
    {
        // 1行目「あい」、focusIndex=2（「い」の前）、フォントサイズ20
        const textField = createTextField({
            "focusIndex": 2,
            "$textData": {
                "textTable": [
                    { "line": 0, "mode": "break", "w": 0 },
                    { "line": 0, "mode": "text", "w": 24, "textFormat": { "size": 20 } },
                    { "line": 0, "mode": "text", "w": 24, "textFormat": { "size": 20 } }
                ],
                "heightTable": [24]
            }
        } as unknown as TextField);

        execute(textField);

        // x = 「あ」の幅(24)、y = 1行目の上端(0)
        expect($textArea.style.left).toBe("24px");
        expect($textArea.style.top).toBe("0px");
        // 高さ = 行高(24)、font-size = テキストサイズ(20)（テスト環境では scale=1）
        expect($textArea.style.height).toBe("24px");
        expect($textArea.style.fontSize).toBe("20px");
    });

    it("カーソルが文末(textTable[focusIndex]が未定義)にある場合でも、最後の文字の行・末尾に配置される", () =>
    {
        // 「あいうえお\nかきくけこ」、focusIndex=12（文末）
        const textTable = [{ "line": 0, "mode": "break", "w": 0 }];
        for (let idx = 0; idx < 5; idx++) {
            textTable.push({ "line": 0, "mode": "text", "w": 24 });
        }
        textTable.push({ "line": 1, "mode": "break", "w": 0 });
        for (let idx = 0; idx < 5; idx++) {
            textTable.push({ "line": 1, "mode": "text", "w": 24 });
        }

        const textField = createTextField({
            "focusIndex": textTable.length, // 12 = 文末
            "$textData": {
                textTable,
                "heightTable": [24, 24]
            }
        } as unknown as TextField);

        execute(textField);

        // x = 2行目「かきくけこ」の幅(120)、y = 2行目の上端(24)
        expect($textArea.style.left).toBe("120px");
        expect($textArea.style.top).toBe("24px");
    });

    it("$textData が無い場合は原点(0,0)に配置される", () =>
    {
        const textField = createTextField({
            "focusIndex": 1,
            "$textData": null
        } as unknown as TextField);

        execute(textField);

        expect($textArea.style.left).toBe("0px");
        expect($textArea.style.top).toBe("0px");
    });
});
