import { TextFormat } from "../../../packages/text/src/TextFormat";

describe("TextFormat.js toString test", () =>
{
    it("toString test success", () =>
    {
        let object = new TextFormat();
        expect(object.toString()).toBe("[object TextFormat]");
    });

});

describe("TextFormat.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(TextFormat.toString()).toBe("[class TextFormat]");
    });

});

describe("TextFormat.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new TextFormat();
        expect(object.namespace).toBe("next2d.text.TextFormat");
    });

    it("namespace test static", () =>
    {
        expect(TextFormat.namespace).toBe("next2d.text.TextFormat");
    });

});

describe("TextFormat.js property test", () =>
{

    // default
    it("default test success", () =>
    {
        let textFormat = new TextFormat();
        expect(textFormat.align).toBe(null);
        expect(textFormat.blockIndent).toBe(null);
        expect(textFormat.bold).toBe(null);
        expect(textFormat.color).toBe(null);
        expect(textFormat.font).toBe(null);
        expect(textFormat.indent).toBe(null);
        expect(textFormat.italic).toBe(null);
        expect(textFormat.leading).toBe(null);
        expect(textFormat.leftMargin).toBe(null);
        expect(textFormat.letterSpacing).toBe(0);
        expect(textFormat.rightMargin).toBe(null);
        expect(textFormat.underline).toBe(null);
        expect(textFormat.size).toBe(null);
    });

    // align
    it("align test success case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.align = "center";
        expect(textFormat.align).toBe("center");
    });

    it("align test valid case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.align = null;
        expect(textFormat.align).toBe(null);
    });

    // blockIndent
    it("blockIndent test success case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.blockIndent = 10;
        expect(textFormat.blockIndent).toBe(10);
    });

    it("blockIndent test valid case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.blockIndent = null;
        expect(textFormat.blockIndent).toBe(null);
    });

    // bold
    it("bold test success case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.bold = true;
        expect(textFormat.bold).toBe(true);
    });

    it("bold test valid case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.bold = null;
        expect(textFormat.bold).toBe(null);
    });

    // color
    it("color test success case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.color = 0xffffff;
        expect(textFormat.color).toBe(0xffffff);
    });

    it("color test valid case1", function ()
    {
        let textFormat = new TextFormat();
        // @ts-ignore
        textFormat.color = "0xff0000";
        expect(textFormat.color).toBe(0xff0000);
    });

    it("color test valid case2", function ()
    {
        let textFormat = new TextFormat();
        // @ts-ignore
        textFormat.color = "test";
        expect(textFormat.color).toBe(0x000000);
    });

    // font
    it("font test success case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.font = "ゴシック";
        expect(textFormat.font).toBe("ゴシック");
    });

    // indent
    it("indent test success case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.indent = 10;
        expect(textFormat.indent).toBe(10);
    });

    it("indent test valid case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.indent = null;
        expect(textFormat.indent).toBe(null);
    });

    // italic
    it("italic test success case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.italic = true;
        expect(textFormat.italic).toBe(true);
    });

    it("italic test valid case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.italic = null;
        expect(textFormat.italic).toBe(null);
    });

    // leading
    it("leading test success case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.leading = 10;
        expect(textFormat.leading).toBe(10);
    });

    it("leading test valid case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.leading = null;
        expect(textFormat.leading).toBe(null);
    });

    // leftMargin
    it("leftMargin test success case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.leftMargin = 10;
        expect(textFormat.leftMargin).toBe(10);
    });

    it("leftMargin test valid case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.leftMargin = null;
        expect(textFormat.leftMargin).toBe(null);
    });

    // letterSpacing
    it("letterSpacing test success case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.letterSpacing = 10;
        expect(textFormat.letterSpacing).toBe(10);
    });

    it("letterSpacing test valid case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.letterSpacing = null;
        expect(textFormat.letterSpacing).toBe(null);
    });

    // rightMargin
    it("rightMargin test success case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.rightMargin = 10;
        expect(textFormat.rightMargin).toBe(10);
    });

    it("rightMargin test valid case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.rightMargin = null;
        expect(textFormat.rightMargin).toBe(null);
    });

    // underline
    it("underline test success case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.underline = true;
        expect(textFormat.underline).toBe(true);
    });

    it("underline test valid case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.underline = null;
        expect(textFormat.underline).toBe(null);
    });

    // size
    it("size test success case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.size = 100;
        expect(textFormat.size).toBe(100);
    });

    it("size test success case2", function ()
    {
        let textFormat = new TextFormat();
        // @ts-ignore
        textFormat.size = "1000";
        expect(textFormat.size).toBe(1000);
    });

    it("size test success case3", function ()
    {
        let textFormat = new TextFormat();
        textFormat.size = null;
        expect(textFormat.size).toBe(null);
    });

    it("size test valid case1", function ()
    {
        let textFormat = new TextFormat();
        // @ts-ignore
        textFormat.size = "abc";
        expect(textFormat.size).toBe(0);
    });

});

describe("TextFormat.js bold test", () =>
{

    it("default test case1", () =>
    {
        let tf = new TextFormat();
        expect(tf.bold).toBe(null);
    });

    it("default test case2", () =>
    {
        let tf = new TextFormat();
        tf.bold = null;
        expect(tf.bold).toBe(null);
    });

    it("default test case3", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.bold = undefined;
        expect(tf.bold).toBe(false);
    });

    it("default test case4", () =>
    {
        let tf = new TextFormat();
        tf.bold = true;
        expect(tf.bold).toBe(true);
    });

    it("default test case5", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.bold = "";
        expect(tf.bold).toBe(false);
    });

    it("default test case6", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.bold = "abc";
        expect(tf.bold).toBe(true);
    });

    it("default test case7", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.bold = 0;
        expect(tf.bold).toBe(false);
    });

    it("default test case8", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.bold = 1;
        expect(tf.bold).toBe(true);
    });

    it("default test case9", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.bold = 500;
        expect(tf.bold).toBe(true);
    });

    it("default test case10", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.bold = 50000000000000000;
        expect(tf.bold).toBe(true);
    });

    it("default test case11", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.bold = -1;
        expect(tf.bold).toBe(true);
    });

    it("default test case12", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.bold = -500;
        expect(tf.bold).toBe(true);
    });

    it("default test case13", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.bold = -50000000000000000;
        expect(tf.bold).toBe(true);
    });

    it("default test case14", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.bold = { "a":0 };
        expect(tf.bold).toBe(true);
    });

    it("default test case15", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.bold = function a() {};
        expect(tf.bold).toBe(true);
    });

    it("default test case16", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.bold = [1];
        expect(tf.bold).toBe(true);
    });

    it("default test case17", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.bold = [1,2];
        expect(tf.bold).toBe(true);
    });

    it("default test case18", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.bold = {};
        expect(tf.bold).toBe(true);
    });

    it("default test case19", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.bold = { "toString":function () { return 1 } };
        expect(tf.bold).toBe(true);
    });

    it("default test case20", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.bold = { "toString":function () { return "10" } };
        expect(tf.bold).toBe(true);
    });

    it("default test case21", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.bold = { "toString":function () { return "1a" } };
        expect(tf.bold).toBe(true);
    });

});

describe("TextFormat.js italic test", () =>
{

    it("default test case1", () =>
    {
        let tf = new TextFormat();
        expect(tf.italic).toBe(null);
    });

    it("default test case2", () =>
    {
        let tf = new TextFormat();
        tf.italic = null;
        expect(tf.italic).toBe(null);
    });

    it("default test case3", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.italic = undefined;
        expect(tf.italic).toBe(false);
    });

    it("default test case4", () =>
    {
        let tf = new TextFormat();
        tf.italic = true;
        expect(tf.italic).toBe(true);
    });

    it("default test case5", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.italic = "";
        expect(tf.italic).toBe(false);
    });

    it("default test case6", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.italic = "abc";
        expect(tf.italic).toBe(true);
    });

    it("default test case7", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.italic = 0;
        expect(tf.italic).toBe(false);
    });

    it("default test case8", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.italic = 1;
        expect(tf.italic).toBe(true);
    });

    it("default test case9", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.italic = 500;
        expect(tf.italic).toBe(true);
    });

    it("default test case10", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.italic = 50000000000000000;
        expect(tf.italic).toBe(true);
    });

    it("default test case11", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.italic = -1;
        expect(tf.italic).toBe(true);
    });

    it("default test case12", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.italic = -500;
        expect(tf.italic).toBe(true);
    });

    it("default test case13", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.italic = -50000000000000000;
        expect(tf.italic).toBe(true);
    });

    it("default test case14", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.italic = { "a":0 };
        expect(tf.italic).toBe(true);
    });

    it("default test case15", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.italic = function a() {};
        expect(tf.italic).toBe(true);
    });

    it("default test case16", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.italic = [1];
        expect(tf.italic).toBe(true);
    });

    it("default test case17", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.italic = [1,2];
        expect(tf.italic).toBe(true);
    });

    it("default test case18", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.italic = {};
        expect(tf.italic).toBe(true);
    });

    it("default test case19", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.italic = { "toString":function () { return 1 } };
        expect(tf.italic).toBe(true);
    });

    it("default test case20", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.italic = { "toString":function () { return "10" } };
        expect(tf.italic).toBe(true);
    });

    it("default test case21", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.italic = { "toString":function () { return "1a" } };
        expect(tf.italic).toBe(true);
    });

});

describe("TextFormat.js underline test", () =>
{

    it("default test case1", () =>
    {
        let tf = new TextFormat();
        expect(tf.underline).toBe(null);
    });

    it("default test case2", () =>
    {
        let tf = new TextFormat();
        tf.underline = null;
        expect(tf.underline).toBe(null);
    });

    it("default test case3", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.underline = undefined;
        expect(tf.underline).toBe(false);
    });

    it("default test case4", () =>
    {
        let tf = new TextFormat();
        tf.underline = true;
        expect(tf.underline).toBe(true);
    });

    it("default test case5", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.underline = "";
        expect(tf.underline).toBe(false);
    });

    it("default test case6", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.underline = "abc";
        expect(tf.underline).toBe(true);
    });

    it("default test case7", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.underline = 0;
        expect(tf.underline).toBe(false);
    });

    it("default test case8", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.underline = 1;
        expect(tf.underline).toBe(true);
    });

    it("default test case9", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.underline = 500;
        expect(tf.underline).toBe(true);
    });

    it("default test case10", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.underline = 50000000000000000;
        expect(tf.underline).toBe(true);
    });

    it("default test case11", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.underline = -1;
        expect(tf.underline).toBe(true);
    });

    it("default test case12", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.underline = -500;
        expect(tf.underline).toBe(true);
    });

    it("default test case13", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.underline = -50000000000000000;
        expect(tf.underline).toBe(true);
    });

    it("default test case14", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.underline = { "a":0 };
        expect(tf.underline).toBe(true);
    });

    it("default test case15", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.underline = function a() {};
        expect(tf.underline).toBe(true);
    });

    it("default test case16", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.underline = [1];
        expect(tf.underline).toBe(true);
    });

    it("default test case17", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.underline = [1,2];
        expect(tf.underline).toBe(true);
    });

    it("default test case18", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.underline = {};
        expect(tf.underline).toBe(true);
    });

    it("default test case19", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.underline = { "toString":function () { return 1 } };
        expect(tf.underline).toBe(true);
    });

    it("default test case20", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.underline = { "toString":function () { return "10" } };
        expect(tf.underline).toBe(true);
    });

    it("default test case21", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.underline = { "toString":function () { return "1a" } };
        expect(tf.underline).toBe(true);
    });

});

describe("TextFormat.js align test", () =>
{

    it("default test case1", () =>
    {
        let tf = new TextFormat();
        expect(tf.align).toBe(null);
    });

    it("default test case2", () =>
    {
        let tf = new TextFormat();
        tf.align = "right";
        expect(tf.align).toBe("right");
    });

    it("default test case3", () =>
    {
        let tf = new TextFormat();
        tf.align = "left";
        expect(tf.align).toBe("left");
    });

    it("default test case4", () =>
    {
        let tf = new TextFormat();
        tf.align = "center";
        expect(tf.align).toBe("center");
    });

});

describe("TextFormat.js font test", () =>
{

    it("default test case1", () =>
    {
        let tf = new TextFormat();
        expect(tf.font).toBe(null);
    });

    it("default test case2", () =>
    {
        let tf = new TextFormat();
        tf.font = null;
        expect(tf.font).toBe(null);
    });

    it("default test case3", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.font = undefined;
        expect(tf.font).toBe("undefined");
    });

    it("default test case4", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.font = true;
        expect(tf.font).toBe("true");
    });

    it("default test case5", () =>
    {
        let tf = new TextFormat();
        tf.font = "";
        expect(tf.font).toBe("");
    });

    it("default test case6", () =>
    {
        let tf = new TextFormat();
        tf.font = "abc";
        expect(tf.font).toBe("abc");
    });

    it("default test case7", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.font = 0;
        expect(tf.font).toBe("0");
    });

    it("default test case8", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.font = 1;
        expect(tf.font).toBe("1");
    });

    it("default test case9", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.font = 500;
        expect(tf.font).toBe("500");
    });

    it("default test case10", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.font = 50000000000000000;
        expect(tf.font).toBe("50000000000000000");
    });

    it("default test case11", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.font = -1;
        expect(tf.font).toBe("-1");
    });

    it("default test case12", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.font = -500;
        expect(tf.font).toBe("-500");
    });

    it("default test case13", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.font = -50000000000000000;
        expect(tf.font).toBe("-50000000000000000");
    });

    it("default test case14", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.font = { "a":0 };
        expect(tf.font).toBe("[object Object]");
    });

    it("default test case15", () =>
    {
        let test = function () {};
        test.toString = function () { return "test" };

        let tf = new TextFormat();
        // @ts-ignore
        tf.font = test;
        expect(tf.font).toBe("test");
    });

    it("default test case16", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.font = [1];
        expect(tf.font).toBe("1");
    });

    it("default test case17", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.font = [1,2];
        expect(tf.font).toBe("1,2");
    });

    it("default test case18", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.font = {};
        expect(tf.font).toBe("[object Object]");
    });

    it("default test case19", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.font = { "toString":function () { return 1 } };
        expect(tf.font).toBe("1");
    });

    it("default test case20", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.font = { "toString":function () { return "10" } };
        expect(tf.font).toBe("10");
    });

    it("default test case21", () =>
    {
        let tf = new TextFormat();
        // @ts-ignore
        tf.font = { "toString":function () { return "1a" } };
        expect(tf.font).toBe("1a");
    });

});