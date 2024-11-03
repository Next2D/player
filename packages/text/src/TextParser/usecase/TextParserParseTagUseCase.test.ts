import { execute } from "./TextParserParseTagUseCase";
import { TextData } from "../../TextData";
import { TextFormat } from "../../TextFormat";
import { parseDocument } from "htmlparser2";
import { describe, expect, it } from "vitest";

describe("TextParserParseTagUseCase.js test", () =>
{
    it("test case1", () =>
    {
        const textData = new TextData();
        const textFormat = new TextFormat();

        textFormat.size = 24;
        textFormat.font = "Arial";

        expect(textFormat.align).toBe(null);
        expect(textFormat.bold).toBe(null);
        expect(textFormat.italic).toBe(null)
        expect(textFormat.underline).toBe(null);
        expect(textFormat.color).toBe(null);
        expect(textFormat.size).toBe(24);
        expect(textFormat.font).toBe("Arial");
        expect(textFormat.leftMargin).toBe(null);
        expect(textFormat.rightMargin).toBe(null);
        expect(textFormat.leading).toBe(null);
        expect(textFormat.letterSpacing).toBe(null);

        const htmlText = `<p>
<u>あ</u>
<b>い</b>
<i>う</i><br>
えお順
</p>`;

        execute(parseDocument(htmlText.trim().replace(/\r?\n/g, "").replace(/\t/g, "")), textFormat, textData, {
            "width": 200,
            "multiline": true,
            "wordWrap": true,
            "subFontSize": 0,
            "textFormats": null
        });

        
        expect(textData.textTable.length).toBe(8);

        const object0 = textData.textTable[0];
        expect(object0.mode).toBe("break");

        const object1 = textData.textTable[1];
        expect(object1.mode).toBe("text");
        expect(object1.text).toBe("あ");
        expect(object1.textFormat.underline).toBe(true);

        const object2 = textData.textTable[2];
        expect(object2.mode).toBe("text");
        expect(object2.text).toBe("い");
        expect(object2.textFormat.bold).toBe(true);

        const object3 = textData.textTable[3];
        expect(object3.mode).toBe("text");
        expect(object3.text).toBe("う");
        expect(object3.textFormat.italic).toBe(true);

        const object4 = textData.textTable[4];
        expect(object4.mode).toBe("break");
        expect(object4.text).toBe("");
    });
});