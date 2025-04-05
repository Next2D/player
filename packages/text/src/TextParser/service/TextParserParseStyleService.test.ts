import { execute } from "./TextParserParseStyleService";
import { describe, expect, it } from "vitest";

describe("TextParserParseStyleService.js Test", () =>
{
    it("test case1", () =>
    {
        const value = "font-size: 12px; font-family: 'Arial'; letter-spacing: 1px; margin-bottom: 2px; margin-left: 3px; margin-right: 4px; color: #000000; align: center; text-decoration: underline; font-weight: bold; font-style: italic;";

        const attributes = execute(value);
        
        expect(attributes.length).toBe(11);

        const results = [
            { "name": "size", "value": 12 },
            { "name": "face", "value": "Arial" },
            { "name": "letterSpacing", "value": 1 },
            { "name": "leading", "value": 2 },
            { "name": "leftMargin", "value": 3 },
            { "name": "rightMargin", "value": 4 },
            { "name": "color", "value": "#000000" },
            { "name": "align", "value": "center" },
            { "name": "underline", "value": true },
            { "name": "bold", "value": true },
            { "name": "italic", "value": true }
        ];

        for (let idx = 0; idx < results.length; idx++) {
            expect(attributes[idx]).toEqual(results[idx]);
        }
    });
});