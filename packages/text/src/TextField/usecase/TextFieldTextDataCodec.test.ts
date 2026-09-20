import { describe, expect, it } from "vitest";
import { TextField } from "../../TextField";
import { execute as getTextData } from "./TextFieldGetTextDataUseCase";
import { execute as compositionUpdate } from "./TextFieldCompositionUpdateUseCase";
import { execute as compositionEnd } from "./TextFieldCompositionEndUseCase";
import { encodeTextData, decodeTextData } from "@next2d/render-queue";

describe("text wire encoding during composition", () => {
    it("keeps conversion underlines scoped to inserted characters before and after encoding", () => {
        const field = new TextField();
        field.text = "ab";
        field.focusIndex = field.compositionStartIndex = 2;
        compositionUpdate(field, "漢");
        const data = getTextData(field);
        const characters = data.textTable.filter(object => object.mode === "text");
        expect(characters.map(object => object.text)).toEqual(["a", "漢", "b"]);
        expect(characters.map(object => Boolean(object.textFormat.underline))).toEqual([false, true, false]);
        const references = characters.map(object => object.textFormat);
        const restored = decodeTextData(encodeTextData(data))!;
        expect(restored).toEqual(JSON.parse(JSON.stringify(data)));
        expect(characters.map(object => object.textFormat)).toEqual(references);
        expect(characters[0].textFormat).not.toBe(characters[1].textFormat);
        compositionEnd(field);
        expect(characters.map(object => Boolean(object.textFormat.underline))).toEqual([false, false, false]);
        expect(decodeTextData(encodeTextData(getTextData(field)))).toEqual(JSON.parse(JSON.stringify(getTextData(field))));
    });
});
