import type { IHtmlElementNode, IHtmlTextNode } from "../../interface/IHtmlNode";
import { execute } from "./TextParserHtmlParserService";
import { describe, expect, it } from "vitest";

describe("TextParserHtmlParserService.ts test", () =>
{
    it("empty string returns empty array", () =>
    {
        const result = execute("");
        expect(result.length).toBe(0);
    });

    it("plain text without tags", () =>
    {
        const result = execute("hello world");
        expect(result.length).toBe(1);
        expect(result[0].type).toBe("text");
        expect((result[0] as IHtmlTextNode).value).toBe("hello world");
    });

    it("single tag with text", () =>
    {
        const result = execute("<b>bold</b>");
        expect(result.length).toBe(1);

        const el = result[0] as IHtmlElementNode;
        expect(el.type).toBe("element");
        expect(el.tagName).toBe("B");
        expect(el.children.length).toBe(1);
        expect((el.children[0] as IHtmlTextNode).value).toBe("bold");
    });

    it("nested tags", () =>
    {
        const result = execute("<p><b>text</b></p>");
        expect(result.length).toBe(1);

        const p = result[0] as IHtmlElementNode;
        expect(p.tagName).toBe("P");
        expect(p.children.length).toBe(1);

        const b = p.children[0] as IHtmlElementNode;
        expect(b.tagName).toBe("B");
        expect(b.children.length).toBe(1);
        expect((b.children[0] as IHtmlTextNode).value).toBe("text");
    });

    it("tag with attributes (double quotes)", () =>
    {
        const result = execute('<font face="Arial" size="12" color="#FF0000">text</font>');
        expect(result.length).toBe(1);

        const font = result[0] as IHtmlElementNode;
        expect(font.tagName).toBe("FONT");
        expect(font.attributes.length).toBe(3);
        expect(font.attributes[0]).toEqual({ name: "face", value: "Arial" });
        expect(font.attributes[1]).toEqual({ name: "size", value: "12" });
        expect(font.attributes[2]).toEqual({ name: "color", value: "#FF0000" });
    });

    it("tag with attributes (single quotes)", () =>
    {
        const result = execute("<font face='Arial'>text</font>");
        const font = result[0] as IHtmlElementNode;
        expect(font.attributes[0]).toEqual({ name: "face", value: "Arial" });
    });

    it("style attribute", () =>
    {
        const result = execute('<span style="font-size: 14px; color: red;">text</span>');
        const span = result[0] as IHtmlElementNode;
        expect(span.tagName).toBe("SPAN");
        expect(span.attributes.length).toBe(1);
        expect(span.attributes[0].name).toBe("style");
        expect(span.attributes[0].value).toBe("font-size: 14px; color: red;");
    });

    it("self-closing br tag", () =>
    {
        const result = execute("a<br>b");
        expect(result.length).toBe(3);
        expect((result[0] as IHtmlTextNode).value).toBe("a");
        expect((result[1] as IHtmlElementNode).tagName).toBe("BR");
        expect((result[1] as IHtmlElementNode).children.length).toBe(0);
        expect((result[2] as IHtmlTextNode).value).toBe("b");
    });

    it("self-closing br/ tag", () =>
    {
        const result = execute("a<br/>b");
        expect(result.length).toBe(3);
        expect((result[1] as IHtmlElementNode).tagName).toBe("BR");
        expect((result[1] as IHtmlElementNode).children.length).toBe(0);
    });

    it("tag name is case-insensitive", () =>
    {
        const result = execute("<Font>text</Font>");
        const el = result[0] as IHtmlElementNode;
        expect(el.tagName).toBe("FONT");
    });

    it("complex HTML matching existing test input", () =>
    {
        const htmlText = `<p>
<u>あ</u>
<b>い</b>
<i>う</i><br>
えお順
</p>`;
        const cleaned = htmlText.trim().replace(/\r?\n/g, "").replace(/\t/g, "");
        const result = execute(cleaned);

        expect(result.length).toBe(1);

        const p = result[0] as IHtmlElementNode;
        expect(p.tagName).toBe("P");

        // children: <u>あ</u> <b>い</b> <i>う</i> <br> えお順
        const children = p.children;

        // <u>
        const u = children.find((n) => n.type === "element" && n.tagName === "U") as IHtmlElementNode;
        expect(u).toBeDefined();
        expect((u.children[0] as IHtmlTextNode).value).toBe("あ");

        // <b>
        const b = children.find((n) => n.type === "element" && n.tagName === "B") as IHtmlElementNode;
        expect(b).toBeDefined();
        expect((b.children[0] as IHtmlTextNode).value).toBe("い");

        // <i>
        const i = children.find((n) => n.type === "element" && n.tagName === "I") as IHtmlElementNode;
        expect(i).toBeDefined();
        expect((i.children[0] as IHtmlTextNode).value).toBe("う");

        // <br>
        const br = children.find((n) => n.type === "element" && n.tagName === "BR") as IHtmlElementNode;
        expect(br).toBeDefined();
        expect(br.children.length).toBe(0);
    });

    it("div tag with align attribute", () =>
    {
        const result = execute('<div align="center">text</div>');
        const div = result[0] as IHtmlElementNode;
        expect(div.tagName).toBe("DIV");
        expect(div.attributes[0]).toEqual({ name: "align", value: "center" });
        expect((div.children[0] as IHtmlTextNode).value).toBe("text");
    });

    it("multiple sibling tags", () =>
    {
        const result = execute("<u>a</u><b>b</b><i>c</i>");
        expect(result.length).toBe(3);
        expect((result[0] as IHtmlElementNode).tagName).toBe("U");
        expect((result[1] as IHtmlElementNode).tagName).toBe("B");
        expect((result[2] as IHtmlElementNode).tagName).toBe("I");
    });
});
