
describe("TextFormat.js toString test", function()
{
    it("toString test success", function()
    {
        let object = new TextFormat();
        expect(object.toString()).toBe("[object TextFormat]");
    });

});

describe("TextFormat.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(TextFormat.toString()).toBe("[class TextFormat]");
    });

});

describe("TextFormat.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new TextFormat();
        expect(object.namespace).toBe("next2d.text.TextFormat");
    });

    it("namespace test static", function()
    {
        expect(TextFormat.namespace).toBe("next2d.text.TextFormat");
    });

});

describe("TextFormat.js property test", function()
{

    // default
    it("default test success", function()
    {
        let textFormat = new TextFormat();
        expect(textFormat.align).toBe(null);
        expect(textFormat.blockIndent).toBe(null);
        expect(textFormat.bold).toBe(null);
        expect(textFormat.bullet).toBe(null);
        expect(textFormat.color).toBe(null);
        expect(textFormat.font).toBe(null);
        expect(textFormat.indent).toBe(null);
        expect(textFormat.italic).toBe(null);
        expect(textFormat.kerning).toBe(null);
        expect(textFormat.leading).toBe(null);
        expect(textFormat.leftMargin).toBe(null);
        expect(textFormat.letterSpacing).toBe(null);
        expect(textFormat.rightMargin).toBe(null);
        expect(textFormat.tabStops).toBe(null);
        expect(textFormat.target).toBe(null);
        expect(textFormat.underline).toBe(null);
        expect(textFormat.url).toBe(null);
        expect(textFormat.size).toBe(null);
    });

    // align
    it("align test success case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.align = TextFormat.CENTER;
        expect(textFormat.align).toBe(TextFormat.CENTER);
    });

    it("align test valid case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.align = "test";
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

    // bullet
    it("bullet test success case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.bullet = true;
        expect(textFormat.bullet).toBe(true);
    });

    it("bullet test valid case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.bullet = null;
        expect(textFormat.bullet).toBe(null);
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
        textFormat.color = "0xff0000";
        expect(textFormat.color).toBe(0xff0000);
    });

    it("color test valid case2", function ()
    {
        let textFormat = new TextFormat();
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

    //TODO nullを代入すると"Times"が返るエラー
    // it("font test valid case1", function ()
    // {
    //     var textFormat  = new TextFormat();
    //     textFormat.font = null;
    //
    //     expect(textFormat.font).toBe(null);
    //
    //     // if (Util.$isMac) {
    //     //     expect(textFormat.font).toBe("Times");
    //     // } else {
    //     //     expect(textFormat.font).toBe("Times New Roman");
    //     // }
    //
    // });

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

    // kerning
    it("kerning test success case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.kerning = true;
        expect(textFormat.kerning).toBe(true);
    });

    it("kerning test valid case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.kerning = null;
        expect(textFormat.kerning).toBe(null);
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

    // tabStops
    it("tabStops test success case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.tabStops = [1,2];
        expect(textFormat.tabStops.length).toBe(2);
    });

    it("rightMargin test valid case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.tabStops = null;
        expect(textFormat.tabStops).toBe(null);
    });

    // target
    it("target test success case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.target = "_top";
        expect(textFormat.target).toBe("_top");
    });

    it("target test valid case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.target = null;
        expect(textFormat.target).toBe(null);
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

    // url
    it("url test success case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.url = "http://www.com";
        expect(textFormat.url).toBe("http://www.com");
    });

    it("url test valid case1", function ()
    {
        let textFormat = new TextFormat();
        textFormat.url = null;
        expect(textFormat.url).toBe(null);
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
        textFormat.size = "abc";
        expect(textFormat.size).toBe(0);
    });

});

describe("TextFormat.js bold test", function()
{

    it("default test case1", function()
    {
        let tf = new TextFormat();
        expect(tf.bold).toBe(null);
    });

    it("default test case2", function()
    {
        let tf = new TextFormat();
        tf.bold = null;
        expect(tf.bold).toBe(false);
    });

    it("default test case3", function()
    {
        let tf = new TextFormat();
        tf.bold = undefined;
        expect(tf.bold).toBe(false);
    });

    it("default test case4", function()
    {
        let tf = new TextFormat();
        tf.bold = true;
        expect(tf.bold).toBe(true);
    });

    it("default test case5", function()
    {
        let tf = new TextFormat();
        tf.bold = "";
        expect(tf.bold).toBe(false);
    });

    it("default test case6", function()
    {
        let tf = new TextFormat();
        tf.bold = "abc";
        expect(tf.bold).toBe(true);
    });

    it("default test case7", function()
    {
        let tf = new TextFormat();
        tf.bold = 0;
        expect(tf.bold).toBe(false);
    });

    it("default test case8", function()
    {
        let tf = new TextFormat();
        tf.bold = 1;
        expect(tf.bold).toBe(true);
    });

    it("default test case9", function()
    {
        let tf = new TextFormat();
        tf.bold = 500;
        expect(tf.bold).toBe(true);
    });

    it("default test case10", function()
    {
        let tf = new TextFormat();
        tf.bold = 50000000000000000;
        expect(tf.bold).toBe(true);
    });

    it("default test case11", function()
    {
        let tf = new TextFormat();
        tf.bold = -1;
        expect(tf.bold).toBe(true);
    });

    it("default test case12", function()
    {
        let tf = new TextFormat();
        tf.bold = -500;
        expect(tf.bold).toBe(true);
    });

    it("default test case13", function()
    {
        let tf = new TextFormat();
        tf.bold = -50000000000000000;
        expect(tf.bold).toBe(true);
    });

    it("default test case14", function()
    {
        let tf = new TextFormat();
        tf.bold = { "a":0 };
        expect(tf.bold).toBe(true);
    });

    it("default test case15", function()
    {
        let tf = new TextFormat();
        tf.bold = function a() {};
        expect(tf.bold).toBe(true);
    });

    it("default test case16", function()
    {
        let tf = new TextFormat();
        tf.bold = [1];
        expect(tf.bold).toBe(true);
    });

    it("default test case17", function()
    {
        let tf = new TextFormat();
        tf.bold = [1,2];
        expect(tf.bold).toBe(true);
    });

    it("default test case18", function()
    {
        let tf = new TextFormat();
        tf.bold = {};
        expect(tf.bold).toBe(true);
    });

    it("default test case19", function()
    {
        let tf = new TextFormat();
        tf.bold = { "toString":function () { return 1 } };
        expect(tf.bold).toBe(true);
    });

    it("default test case20", function()
    {
        let tf = new TextFormat();
        tf.bold = { "toString":function () { return "10" } };
        expect(tf.bold).toBe(true);
    });

    it("default test case21", function()
    {
        let tf = new TextFormat();
        tf.bold = { "toString":function () { return "1a" } };
        expect(tf.bold).toBe(true);
    });

});

describe("TextFormat.js italic test", function()
{

    it("default test case1", function()
    {
        let tf = new TextFormat();
        expect(tf.italic).toBe(null);
    });

    it("default test case2", function()
    {
        let tf = new TextFormat();
        tf.italic = null;
        expect(tf.italic).toBe(false);
    });

    it("default test case3", function()
    {
        let tf = new TextFormat();
        tf.italic = undefined;
        expect(tf.italic).toBe(false);
    });

    it("default test case4", function()
    {
        let tf = new TextFormat();
        tf.italic = true;
        expect(tf.italic).toBe(true);
    });

    it("default test case5", function()
    {
        let tf = new TextFormat();
        tf.italic = "";
        expect(tf.italic).toBe(false);
    });

    it("default test case6", function()
    {
        let tf = new TextFormat();
        tf.italic = "abc";
        expect(tf.italic).toBe(true);
    });

    it("default test case7", function()
    {
        let tf = new TextFormat();
        tf.italic = 0;
        expect(tf.italic).toBe(false);
    });

    it("default test case8", function()
    {
        let tf = new TextFormat();
        tf.italic = 1;
        expect(tf.italic).toBe(true);
    });

    it("default test case9", function()
    {
        let tf = new TextFormat();
        tf.italic = 500;
        expect(tf.italic).toBe(true);
    });

    it("default test case10", function()
    {
        let tf = new TextFormat();
        tf.italic = 50000000000000000;
        expect(tf.italic).toBe(true);
    });

    it("default test case11", function()
    {
        let tf = new TextFormat();
        tf.italic = -1;
        expect(tf.italic).toBe(true);
    });

    it("default test case12", function()
    {
        let tf = new TextFormat();
        tf.italic = -500;
        expect(tf.italic).toBe(true);
    });

    it("default test case13", function()
    {
        let tf = new TextFormat();
        tf.italic = -50000000000000000;
        expect(tf.italic).toBe(true);
    });

    it("default test case14", function()
    {
        let tf = new TextFormat();
        tf.italic = { "a":0 };
        expect(tf.italic).toBe(true);
    });

    it("default test case15", function()
    {
        let tf = new TextFormat();
        tf.italic = function a() {};
        expect(tf.italic).toBe(true);
    });

    it("default test case16", function()
    {
        let tf = new TextFormat();
        tf.italic = [1];
        expect(tf.italic).toBe(true);
    });

    it("default test case17", function()
    {
        let tf = new TextFormat();
        tf.italic = [1,2];
        expect(tf.italic).toBe(true);
    });

    it("default test case18", function()
    {
        let tf = new TextFormat();
        tf.italic = {};
        expect(tf.italic).toBe(true);
    });

    it("default test case19", function()
    {
        let tf = new TextFormat();
        tf.italic = { "toString":function () { return 1 } };
        expect(tf.italic).toBe(true);
    });

    it("default test case20", function()
    {
        let tf = new TextFormat();
        tf.italic = { "toString":function () { return "10" } };
        expect(tf.italic).toBe(true);
    });

    it("default test case21", function()
    {
        let tf = new TextFormat();
        tf.italic = { "toString":function () { return "1a" } };
        expect(tf.italic).toBe(true);
    });

});

describe("TextFormat.js underline test", function()
{

    it("default test case1", function()
    {
        let tf = new TextFormat();
        expect(tf.underline).toBe(null);
    });

    it("default test case2", function()
    {
        let tf = new TextFormat();
        tf.underline = null;
        expect(tf.underline).toBe(false);
    });

    it("default test case3", function()
    {
        let tf = new TextFormat();
        tf.underline = undefined;
        expect(tf.underline).toBe(false);
    });

    it("default test case4", function()
    {
        let tf = new TextFormat();
        tf.underline = true;
        expect(tf.underline).toBe(true);
    });

    it("default test case5", function()
    {
        let tf = new TextFormat();
        tf.underline = "";
        expect(tf.underline).toBe(false);
    });

    it("default test case6", function()
    {
        let tf = new TextFormat();
        tf.underline = "abc";
        expect(tf.underline).toBe(true);
    });

    it("default test case7", function()
    {
        let tf = new TextFormat();
        tf.underline = 0;
        expect(tf.underline).toBe(false);
    });

    it("default test case8", function()
    {
        let tf = new TextFormat();
        tf.underline = 1;
        expect(tf.underline).toBe(true);
    });

    it("default test case9", function()
    {
        let tf = new TextFormat();
        tf.underline = 500;
        expect(tf.underline).toBe(true);
    });

    it("default test case10", function()
    {
        let tf = new TextFormat();
        tf.underline = 50000000000000000;
        expect(tf.underline).toBe(true);
    });

    it("default test case11", function()
    {
        let tf = new TextFormat();
        tf.underline = -1;
        expect(tf.underline).toBe(true);
    });

    it("default test case12", function()
    {
        let tf = new TextFormat();
        tf.underline = -500;
        expect(tf.underline).toBe(true);
    });

    it("default test case13", function()
    {
        let tf = new TextFormat();
        tf.underline = -50000000000000000;
        expect(tf.underline).toBe(true);
    });

    it("default test case14", function()
    {
        let tf = new TextFormat();
        tf.underline = { "a":0 };
        expect(tf.underline).toBe(true);
    });

    it("default test case15", function()
    {
        let tf = new TextFormat();
        tf.underline = function a() {};
        expect(tf.underline).toBe(true);
    });

    it("default test case16", function()
    {
        let tf = new TextFormat();
        tf.underline = [1];
        expect(tf.underline).toBe(true);
    });

    it("default test case17", function()
    {
        let tf = new TextFormat();
        tf.underline = [1,2];
        expect(tf.underline).toBe(true);
    });

    it("default test case18", function()
    {
        let tf = new TextFormat();
        tf.underline = {};
        expect(tf.underline).toBe(true);
    });

    it("default test case19", function()
    {
        let tf = new TextFormat();
        tf.underline = { "toString":function () { return 1 } };
        expect(tf.underline).toBe(true);
    });

    it("default test case20", function()
    {
        let tf = new TextFormat();
        tf.underline = { "toString":function () { return "10" } };
        expect(tf.underline).toBe(true);
    });

    it("default test case21", function()
    {
        let tf = new TextFormat();
        tf.underline = { "toString":function () { return "1a" } };
        expect(tf.underline).toBe(true);
    });

});

describe("TextFormat.js align test", function()
{

    it("default test case1", function()
    {
        let tf = new TextFormat();
        expect(tf.align).toBe(null);
    });

    it("default test case2", function()
    {
        let tf = new TextFormat();
        tf.align = "right";
        expect(tf.align).toBe("right");
    });

    it("default test case3", function()
    {
        let tf = new TextFormat();
        tf.align = "left";
        expect(tf.align).toBe("left");
    });

    it("default test case4", function()
    {
        let tf = new TextFormat();
        tf.align = "center";
        expect(tf.align).toBe("center");
    });

});

describe("TextFormat.js font test", function()
{

    it("default test case1", function()
    {
        let tf = new TextFormat();
        expect(tf.font).toBe(null);
    });

    it("default test case2", function()
    {
        let tf = new TextFormat();
        tf.font = null;
        expect(tf.font).toBe("null");
    });

    it("default test case3", function()
    {
        let tf = new TextFormat();
        tf.font = undefined;
        expect(tf.font).toBe("undefined");
    });

    it("default test case4", function()
    {
        let tf = new TextFormat();
        tf.font = true;
        expect(tf.font).toBe("true");
    });

    it("default test case5", function()
    {
        let tf = new TextFormat();
        tf.font = "";
        expect(tf.font).toBe("");
    });

    it("default test case6", function()
    {
        let tf = new TextFormat();
        tf.font = "abc";
        expect(tf.font).toBe("abc");
    });

    it("default test case7", function()
    {
        let tf = new TextFormat();
        tf.font = 0;
        expect(tf.font).toBe("0");
    });

    it("default test case8", function()
    {
        let tf = new TextFormat();
        tf.font = 1;
        expect(tf.font).toBe("1");
    });

    it("default test case9", function()
    {
        let tf = new TextFormat();
        tf.font = 500;
        expect(tf.font).toBe("500");
    });

    it("default test case10", function()
    {
        let tf = new TextFormat();
        tf.font = 50000000000000000;
        expect(tf.font).toBe("50000000000000000");
    });

    it("default test case11", function()
    {
        let tf = new TextFormat();
        tf.font = -1;
        expect(tf.font).toBe("-1");
    });

    it("default test case12", function()
    {
        let tf = new TextFormat();
        tf.font = -500;
        expect(tf.font).toBe("-500");
    });

    it("default test case13", function()
    {
        let tf = new TextFormat();
        tf.font = -50000000000000000;
        expect(tf.font).toBe("-50000000000000000");
    });

    it("default test case14", function()
    {
        let tf = new TextFormat();
        tf.font = { "a":0 };
        expect(tf.font).toBe("[object Object]");
    });

    it("default test case15", function()
    {
        let test = function () {};
        test.toString = function () { return "test" };

        let tf = new TextFormat();
        tf.font = test;
        expect(tf.font).toBe("test");
    });

    it("default test case16", function()
    {
        let tf = new TextFormat();
        tf.font = [1];
        expect(tf.font).toBe("1");
    });

    it("default test case17", function()
    {
        let tf = new TextFormat();
        tf.font = [1,2];
        expect(tf.font).toBe("1,2");
    });

    it("default test case18", function()
    {
        let tf = new TextFormat();
        tf.font = {};
        expect(tf.font).toBe("[object Object]");
    });

    it("default test case19", function()
    {
        let tf = new TextFormat();
        tf.font = { "toString":function () { return 1 } };
        expect(tf.font).toBe("1");
    });

    it("default test case20", function()
    {
        let tf = new TextFormat();
        tf.font = { "toString":function () { return "10" } };
        expect(tf.font).toBe("10");
    });

    it("default test case21", function()
    {
        let tf = new TextFormat();
        tf.font = { "toString":function () { return "1a" } };
        expect(tf.font).toBe("1a");
    });

});