import { execute } from "./TextFormatIsSameService";
import { TextFormat } from "../../TextFormat";
import { describe, expect, it } from "vitest";

describe("TextFormatIsSameService.js length test", () =>
{
    it("test case1", () =>
    {
        const source = new TextFormat();
        const destination = new TextFormat();
        expect(execute(source, destination)).toBe(true);
    });

    it("test case2", () =>
    {
        const source = new TextFormat();
        const destination = new TextFormat();
        source.font = "Arial";
        destination.font = "Times New Roman";
        expect(execute(source, destination)).toBe(false);
    });

    it("test case3", () =>
    {
        const source = new TextFormat();
        const destination = new TextFormat();
        source.size = 10;
        destination.size = 12;
        expect(execute(source, destination)).toBe(false);
    });

    it("test case4", () =>
    {
        const source = new TextFormat();
        const destination = new TextFormat();
        source.color = 0x000000;
        destination.color = 0xFFFFFF;
        expect(execute(source, destination)).toBe(false);
    });

    it("test case5", () =>
    {
        const source = new TextFormat();
        const destination = new TextFormat();
        source.bold = true;
        destination.bold = false;
        expect(execute(source, destination)).toBe(false);
    });

    it("test case6", () =>
    {
        const source = new TextFormat();
        const destination = new TextFormat();
        source.italic = true;
        destination.italic = false;
        expect(execute(source, destination)).toBe(false);
    });

    it("test case7", () =>
    {
        const source = new TextFormat();
        const destination = new TextFormat();
        source.underline = true;
        destination.underline = false;
        expect(execute(source, destination)).toBe(false);
    });

    it("test case8", () =>
    {
        const source = new TextFormat();
        const destination = new TextFormat();
        source.align = "left";
        destination.align = "right";
        expect(execute(source, destination)).toBe(false);
    });

    it("test case9", () =>
    {
        const source = new TextFormat();
        const destination = new TextFormat();
        source.leftMargin = 10;
        destination.leftMargin = 20;
        expect(execute(source, destination)).toBe(false);
    });

    it("test case10", () =>
    {
        const source = new TextFormat();
        const destination = new TextFormat();
        source.rightMargin = 10;
        destination.rightMargin = 20;
        expect(execute(source, destination)).toBe(false);
    });

    it("test case11", () =>
    {
        const source = new TextFormat();
        const destination = new TextFormat();
        source.leading = 10;
        destination.leading = 20;
        expect(execute(source, destination)).toBe(false);
    });

    it("test case12", () =>
    {
        const source = new TextFormat();
        const destination = new TextFormat();
        source.letterSpacing = 10;
        destination.letterSpacing = 20;
        expect(execute(source, destination)).toBe(false);
    });
});