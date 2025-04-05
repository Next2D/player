import { execute } from "./TextParserAdjustmentHeightService";
import { TextData } from "../../TextData";
import { describe, expect, it } from "vitest";
import { ITextObject } from "../../interface/ITextObject";

describe("TextParserAdjustmentHeightService.js Test", () =>
{
    it("test case1", () =>
    {
        const textData = new TextData();
        textData.heightTable.push(10, 20, 0, 10);
        textData.lineTable.push(
            {
                "h": 10
            } as ITextObject,
            {
                "h": 20
            } as ITextObject,
            {
                "h": 0
            } as ITextObject,
            {
                "h": 10
            } as ITextObject
        );

        expect(textData.heightTable[0]).toBe(10);
        expect(textData.heightTable[1]).toBe(20);
        expect(textData.heightTable[2]).toBe(0);
        expect(textData.heightTable[3]).toBe(10);

        execute(textData);
        expect(textData.heightTable[0]).toBe(10);
        expect(textData.heightTable[1]).toBe(20);
        expect(textData.heightTable[2]).toBe(20);
        expect(textData.heightTable[3]).toBe(10);

        expect(textData.lineTable[0].h).toBe(10);
        expect(textData.lineTable[1].h).toBe(20);
        expect(textData.lineTable[2].h).toBe(20);
        expect(textData.lineTable[3].h).toBe(10);
    });

    it("test case2", () =>
    {
        const textData = new TextData();
        textData.heightTable.push(10, 20, 30, 0);
        textData.lineTable.push(
            {
                "h": 10
            } as ITextObject,
            {
                "h": 20
            } as ITextObject,
            {
                "h": 30
            } as ITextObject,
            {
                "h": 0
            } as ITextObject
        );
    
        expect(textData.heightTable[0]).toBe(10);
        expect(textData.heightTable[1]).toBe(20);
        expect(textData.heightTable[2]).toBe(30);
        expect(textData.heightTable[3]).toBe(0);

        execute(textData);
        expect(textData.heightTable[0]).toBe(10);
        expect(textData.heightTable[1]).toBe(20);
        expect(textData.heightTable[2]).toBe(30);
        expect(textData.heightTable[3]).toBe(0);

        expect(textData.lineTable[0].h).toBe(10);
        expect(textData.lineTable[1].h).toBe(20);
        expect(textData.lineTable[2].h).toBe(30);
        expect(textData.lineTable[3].h).toBe(0);
    });
});