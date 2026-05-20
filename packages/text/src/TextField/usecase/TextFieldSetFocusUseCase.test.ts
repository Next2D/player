import { execute } from "./TextFieldSetFocusUseCase";
import { FocusEvent } from "@next2d/events";
import { TextField } from "../../TextField";
import { $getSelectedTextField, $setSelectedTextField } from "../../TextUtil";
import { afterEach, describe, expect, it } from "vitest";

describe("TextFieldSetFocusUseCase.js test", () =>
{
    afterEach(() =>
    {
        $setSelectedTextField(null);
    });

    it("execute test case1", () =>
    {
        const textField = new TextField();

        textField.changed = false;
        expect(textField.changed).toBe(false);

        execute(textField, FocusEvent.FOCUS_IN);
        expect(textField.changed).toBe(true);
    });

    it("execute test case2 - focus=true 設定時に $selectedTextField がセットされる", () =>
    {
        const textField = new TextField();
        textField.type = "input";

        textField.focus = true;

        expect($getSelectedTextField()).toBe(textField);
    });

    it("execute test case3 - focus=false 設定時に $selectedTextField がクリアされる", () =>
    {
        const textField = new TextField();
        textField.type = "input";

        textField.focus = true;
        expect($getSelectedTextField()).toBe(textField);

        textField.focus = false;
        expect($getSelectedTextField()).toBeNull();
    });

    it("execute test case4 - 別 TextField の focus=false 操作は現在の $selectedTextField を変更しない", () =>
    {
        const textFieldA = new TextField();
        textFieldA.type = "input";

        const textFieldB = new TextField();
        textFieldB.type = "input";

        textFieldA.focus = true;
        expect($getSelectedTextField()).toBe(textFieldA);

        textFieldB.focus = false;
        expect($getSelectedTextField()).toBe(textFieldA);
    });
});