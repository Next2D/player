import type { TextField } from "../../TextField";
import { execute } from "./TextAreaMovePositionService";
import { describe, expect, it } from "vitest";
import {
    $textArea,
} from "../../TextUtil";

describe("TextAreaMovePositionService.js Test", () =>
{
    it("test case", () =>
    {
        // Arrange
        const textField = {
            localToGlobal: () => ({ x: 20, y: 30 }),
            $textData: {
                textTable: [
                    { line: 0, mode: "break", w: 10 },
                    { line: 1, mode: "normal", w: 20 },
                ],
                heightTable: [10, 20],
            }
        } as unknown as TextField;

        // Act
        execute(textField);

        // Assert
        expect($textArea.style.left).toBe("20px");
        expect($textArea.style.top).toBe("30px");
    });
});