
describe("TextField.js toString test", function()
{
    it("toString test success", function()
    {
        let object = new TextField();
        expect(object.toString()).toBe("[object TextField]");
    });

});

describe("TextField.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(TextField.toString()).toBe("[class TextField]");
    });

});

describe("TextField.js namespace test", function()
{

    it("namespace test public", function()
    {
        expect(new TextField().namespace).toBe("next2d.text.TextField");
    });

    it("namespace test static", function()
    {
        expect(TextField.namespace).toBe("next2d.text.TextField");
    });

});

describe("TextField.js autoSize test", function()
{

    it("autoSize test1", function()
    {
        let tf = new TextField();
        expect(tf.x | 0).toBe(0);

        tf.autoSize = TextFieldAutoSize.CENTER;
        expect(tf.x | 0).toBe(48);
        expect(tf.width | 0).toBe(4);

        tf.defaultTextFormat = new TextFormat("_sans", 12);
        expect(tf.x | 0).toBe(48);
        expect(tf.width | 0).toBe(4);

        tf.text = "abcdefg";

        const x = tf.x | 0;
        expect(x === 23 || x === 24).toBe(true);
        expect(tf.y).toBe(0);
    });

    it("autoSize test2", function()
    {
        let tf = new TextField();
        expect(tf.x | 0).toBe(0);

        tf.autoSize = TextFieldAutoSize.CENTER;
        expect(tf.x | 0).toBe(48);
        expect(tf.width | 0).toBe(4);

        tf.defaultTextFormat = new TextFormat("_sans", 12);
        expect(tf.x | 0).toBe(48);
        expect(tf.width | 0).toBe(4);

        tf.x = -100;
        expect(tf.x | 0).toBe(-100);

        tf.width = 200;
        expect(tf.x | 0).toBe(-2);
    });

});

describe("TextField.js property test", function()
{

    // default
    it("default test success", function()
    {
        let tf = new TextField();
        expect(tf.length).toBe(0);
        expect(tf.textHeight).toBe(0);
        expect(tf.autoSize).toBe(TextFieldAutoSize.NONE);
        expect(tf.background).toBe(false);
        expect(tf.backgroundColor).toBe(0xffffff);
        expect(tf.border).toBe(false);
        expect(tf.borderColor).toBe(0x000000);
        expect(tf.defaultTextFormat instanceof TextFormat).toBe(true);
        expect(tf.text).toBe("");
        expect(tf.textColor).toBe(0x000000);
        expect(tf.textWidth).toBe(0);
        expect(tf.numLines).toBe(1);
        expect(tf.wordWrap).toBe(false);
        expect(tf.selectable).toBe(true);
        expect(tf.multiline).toBe(false);
        expect(tf.maxChars).toBe(0);

    });

    // length
    it("length test success case1", function ()
    {
        let tf = new TextField();
        tf.text = "abcアイウエオ";
        expect(tf.length).toBe(8);
    });

    it("length test success case2", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.text = "abc\nアイウエオ\n\n";
        expect(tf.length).toBe(11);
    });

    it("length test success case4", function ()
    {
        let tf = new TextField();
        tf.multiline = false;
        tf.text = "abc\r";
        expect(tf.length).toBe(4);
    });

    it("length test success case5", function ()
    {
        let tf = new TextField();
        tf.multiline = false;
        tf.text = "abc\r\n";
        expect(tf.length).toBe(5);
    });

    it("length test success case5", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.text = "abc";
        expect(tf.length).toBe(3);
    });

    it("length test success case6", function ()
    {
        let tf = new TextField();
        tf.width = 30;
        tf.height = 20;
        tf.wordWrap = true;
        tf.text = "123456789";
        expect(tf.length).toBe(9);
    });

    it("length test success case7", function ()
    {
        let tf = new TextField();
        tf.multiline = false;
        tf.htmlText = "<p>abc</p>";
        expect(tf.length).toBe(3);
    });

    it("length test success case8", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<p>abc</p>";
        expect(tf.length).toBe(4);
    });

    it("length test success case9", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<p>abc\n123</p>";
        expect(tf.length).toBe(8);
    });

    it("length test success case10", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<p>abc\r\n123</p>";
        expect(tf.length).toBe(9);
    });

    it("length test success case11", function ()
    {
        let tf = new TextField();
        tf.multiline = false;
        tf.htmlText = "<p>abc<br />123</p>";
        expect(tf.length).toBe(6);
    });

    it("length test success case12", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<p>abc<br />123</p>";
        expect(tf.length).toBe(8);
    });

    it("length test success case13", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "abc";
        expect(tf.length).toBe(3);
    });

    it("length test success case14", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<p>a</p><p>b</p><p></p>";
        expect(tf.length).toBe(5);
    });

    it("length test success case15", function ()
    {
        let tf = new TextField();
        tf.multiline = false;
        tf.htmlText = "<p>a</p><p>b</p><p></p>";
        expect(tf.length).toBe(2);
    });

    // autoSize
    it("autoSize test success case1", function ()
    {
        let tf = new TextField();
        tf.autoSize = TextFieldAutoSize.CENTER;
        expect(tf.autoSize).toBe(TextFieldAutoSize.CENTER);
    });

    it("autoSize test valid case1", function ()
    {
        let tf = new TextField();
        tf.autoSize = "LEFT";
        expect(tf.autoSize).toBe(TextFieldAutoSize.NONE);
    });

    // background
    it("background test success case1", function ()
    {
        let tf = new TextField();
        tf.background = true;
        expect(tf.background).toBe(true);
    });

    it("background test success case2", function ()
    {
        let tf = new TextField();
        tf.background = 1;
        expect(tf.background).toBe(true);
    });

    it("background test success case3", function ()
    {
        let tf = new TextField();
        tf.background = "";
        expect(tf.background).toBe(false);
        tf.background = "abc";
        expect(tf.background).toBe(true);
    });

    // backgroundColor
    it("backgroundColor test success case1", function ()
    {
        let tf = new TextField();
        tf.backgroundColor = 0xff0000;
        expect(tf.backgroundColor).toBe(0xff0000);
    });

    it("backgroundColor test success case1", function ()
    {
        let tf = new TextField();
        tf.backgroundColor = "abc";
        expect(tf.backgroundColor).toBe(0x000000);
    });

    // border
    it("border test success case1", function ()
    {
        let tf = new TextField();
        tf.border = true;
        expect(tf.border).toBe(true);
    });

    it("border test success case2", function ()
    {
        let tf = new TextField();
        tf.border = 1;
        expect(tf.border).toBe(true);
    });

    it("border test success case3", function ()
    {
        let tf = new TextField();
        tf.border = "";
        expect(tf.border).toBe(false);
        tf.border = "abc";
        expect(tf.border).toBe(true);
    });

    // borderColor
    it("borderColor test success case1", function ()
    {
        let tf = new TextField();
        tf.borderColor = 0xff0000;
        expect(tf.borderColor).toBe(0xff0000);
    });

    it("borderColor test success case1", function ()
    {
        let tf = new TextField();
        tf.borderColor = "abc";
        expect(tf.borderColor).toBe(0x000000);
    });

    // defaultTextFormat
    it("defaultTextFormat test success case1", function ()
    {
        let tf = new TextField();
        expect(tf.defaultTextFormat.size).toBe(12);

        let format  = new TextFormat();
        format.size = 100;

        tf.defaultTextFormat = format;
        expect(tf.defaultTextFormat.size).toBe(100);
    });

    it("defaultTextFormat test valid case1", function ()
    {
        let tf = new TextField();

        let obj = {};
        obj.size = 100;
        tf.defaultTextFormat = obj;

        expect(tf.defaultTextFormat.size).toBe(12);
    });

    // displayAsPassword
    it("displayAsPassword test success case1", function ()
    {
        let tf = new TextField();
        tf.displayAsPassword = true;
        expect(tf.displayAsPassword).toBe(true);
    });

    // embedFonts
    it("embedFonts test success case1", function ()
    {
        let tf = new TextField();
        tf.embedFonts = true;
        expect(tf.embedFonts).toBe(true);
    });

    // text
    it("text test success case1", function ()
    {
        let tf = new TextField();
        tf.text = 0;
        expect(tf.text).toBe("0");
    });

    // htmlText
    it("htmlText test success case1", function ()
    {
        let tf = new TextField();
        tf.htmlText = 0;
        expect(tf.htmlText).toBe("0");
    });

    // textColor
    it("textColor test success case1", function ()
    {
        let tf = new TextField();
        tf.textColor = 0xff0000;
        expect(tf.textColor).toBe(0xff0000);
    });

    it("textColor test success case1", function ()
    {
        let tf = new TextField();
        tf.textColor = "abc";
        expect(tf.textColor).toBe(0x000000);
    });

    // textWidth
    it("textWidth test success case1", function ()
    {
        let tf = new TextField();
        tf.text = "aaa";
        expect(Math.round(tf.textWidth)).toBe(16);
    });

    it("textWidth test success case2", function ()
    {
        let tf = new TextField();

        let textFormat = tf.defaultTextFormat;
        textFormat.size = 20;
        tf.defaultTextFormat = textFormat;

        tf.text = "aaa";
        expect(Math.ceil(tf.textWidth)).toBe(27);
    });

    it("textWidth test success case3", function ()
    {
        let tf = new TextField();
        tf.wordWrap = true;

        let textFormat = tf.defaultTextFormat;
        textFormat.size = 30;
        tf.defaultTextFormat = textFormat;

        tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";
        expect(Math.ceil(tf.textWidth)).toBe(94);
    });

    it("textWidth test success case4", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.autoSize = TextFieldAutoSize.LEFT;

        let textFormat = tf.defaultTextFormat;
        textFormat.size = 30;
        tf.defaultTextFormat = textFormat;

        tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";
        expect(Math.ceil(tf.textWidth)).toBe(280);
    });

    it("textWidth test success case5", function ()
    {
        let tf = new TextField();
        tf.autoSize = TextFieldAutoSize.LEFT;

        let textFormat = tf.defaultTextFormat;
        textFormat.size = 30;
        tf.defaultTextFormat = textFormat;

        tf.width = 40;
        tf.wordWrap = true;
        tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";
        expect(Math.ceil(tf.textWidth)).toBe(40);
    });

    it("textWidth test success case6", function ()
    {
        let tf = new TextField();
        tf.autoSize = TextFieldAutoSize.LEFT;

        let textFormat = tf.defaultTextFormat;
        textFormat.size = 30;
        tf.defaultTextFormat = textFormat;

        tf.wordWrap = true;
        tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";

        expect(Math.ceil(tf.textWidth)).toBe(94);
    });

    it("textWidth test success case7", function ()
    {
        let tf = new TextField();
        tf.autoSize = TextFieldAutoSize.LEFT;

        let textFormat = tf.defaultTextFormat;
        textFormat.size = 30;
        textFormat.italic = true;
        tf.defaultTextFormat = textFormat;

        tf.wordWrap = true;
        tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";
        expect(Math.ceil(tf.textWidth)).toBe(90);
    });

    // textHeight
    it("textHeight test success case1", function ()
    {
        let tf = new TextField();
        tf.text = "aaa";
        expect(Math.round(tf.textHeight)).toBe(14);
    });

    it("textHeight test success case2", function ()
    {
        let tf = new TextField();
        let f = new TextFormat();
        f.size = 20;
        tf.defaultTextFormat = f;
        tf.text = "aaa";
        expect(Math.round(tf.textHeight)).toBe(22);
    });

    it("textHeight test success case3", function ()
    {
        let tf = new TextField();
        let f = new TextFormat();
        f.size = 30;
        tf.multiline = true;
        tf.wordWrap = true;
        tf.defaultTextFormat = f;
        tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";
        expect(Math.round(tf.textHeight)).toBe(152); // Flash is 150
    });

    it("textHeight test success case4", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.autoSize = TextFieldAutoSize.LEFT;
        // tf.defaultTextFormat.size = 30; // tf.defaultTextForamtのgetterが参照渡しでないため、設定できていない。
        let f = tf.defaultTextFormat;
        f.size = 30;
        tf.defaultTextFormat = f;
        tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";
        expect(tf.textHeight).toBe(92);
    });

    it("textHeight test success case5", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.autoSize = TextFieldAutoSize.LEFT;

        let f = tf.defaultTextFormat;
        f.size = 30;
        tf.defaultTextFormat = f;
        tf.width = 40;
        tf.wordWrap = true;
        tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";
        expect(tf.textHeight).toBe(452);
    });

    it("textHeight test success case6", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.autoSize = TextFieldAutoSize.LEFT;

        let f = tf.defaultTextFormat;
        f.size = 30;
        tf.defaultTextFormat = f;
        tf.wordWrap = true;
        tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";

        expect(tf.textHeight).toBe(152);
    });

    it("textHeight test success case7", function ()
    {
        let tf = new TextField();
        tf.autoSize = TextFieldAutoSize.LEFT;

        let f = tf.defaultTextFormat;
        f.size = 30;
        tf.defaultTextFormat = f;
        tf.defaultTextFormat.italic = true;
        tf.wordWrap = true;
        tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";

        expect(tf.textHeight).toBe(152);
    });

    it("textHeight test success case8", function ()
    {
        let tf = new TextField();

        tf.multiline = true;
        tf.autoSize = TextFieldAutoSize.LEFT;
        tf.type = TextFieldType.INPUT;

        let f = tf.defaultTextFormat;
        f.size = 50;
        f.leading = 8;
        tf.defaultTextFormat = f;
        tf.text = "\n";

        // Chrome,FireFox,Safari
        expect(tf.textHeight).toBe(102);
    });

    it("textHeight test success case8-2", function ()
    {
        let tf = new TextField();

        tf.multiline = true;
        tf.autoSize = TextFieldAutoSize.LEFT;
        tf.type = TextFieldType.INPUT;

        let f = tf.defaultTextFormat;
        f.size = 50;
        f.leading = 8;
        tf.defaultTextFormat = f;
        tf.text = "\na";

        expect(tf.textHeight).toBe(110);
    });

    it("textHeight test success case9", function ()
    {
        let tf = new TextField();

        tf.multiline = true;
        tf.autoSize = TextFieldAutoSize.LEFT;
        tf.type = TextFieldType.INPUT;

        let f = tf.defaultTextFormat;
        f.size = 50;
        f.leading = 8;
        tf.defaultTextFormat = f;
        tf.text = "\n";

        expect(tf.textHeight).toBe(102); // Flash is 108
    });

    it("textHeight test success case10", function ()
    {
        let tf = new TextField();
        let f = tf.defaultTextFormat;
        f.size = 50;
        f.leading = 8;
        tf.defaultTextFormat = f;
        tf.autoSize = TextFieldAutoSize.LEFT;
        tf.type = TextFieldType.INPUT;
        // Chrome,FireFox,Safari
        expect(tf.textHeight).toBe(0);
    });

    it("textHeight test success case11", function ()
    {
        let tf = new TextField();

        let f = tf.defaultTextFormat;
        f.size = 50;
        f.leading = 8;
        tf.defaultTextFormat = f;
        tf.type = TextFieldType.INPUT;

        // Chrome,FireFox,Safari
        expect(Math.round(tf.textHeight)).toBe(0);
    });

    it("textHeight test success case12", function ()
    {
        let tf = new TextField();

        let f = tf.defaultTextFormat;
        f.size = 50;
        f.leading = 8;
        tf.defaultTextFormat = f;
        tf.autoSize = TextFieldAutoSize.LEFT;
        tf.type = TextFieldType.INPUT;

        // Chrome,FireFox,Safari
        expect(tf.textHeight).toBe(0);
    });

    it("textHeight test success case13", function ()
    {
        let tf = new TextField();
        tf.type = TextFieldType.INPUT;
        tf.htmlText = "<p></p>";

        expect(tf.textHeight).toBe(0);
    });

    it("textHeight test success case14", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.type = TextFieldType.INPUT;
        tf.htmlText = "<br /><p></p>";

        expect(tf.numLines).toBe(3);
        expect(tf.textHeight).toBe(38);
    });

    // numLines
    it("numLines test success case1", function ()
    {
        let tf = new TextField();
        tf.text = "aaa";
        expect(tf.numLines).toBe(1);
    });

    it("numLines test success case2", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.text = "aaa\n\nbbb\n\nccc";
        expect(tf.numLines).toBe(5);
    });

    it("numLines test success case3", function ()
    {
        let tf = new TextField();
        tf.wordWrap = true;

        let textFormat = tf.defaultTextFormat;
        textFormat.size = 30;
        tf.defaultTextFormat = textFormat;

        tf.text = "aaaaaaaaaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";
        expect(tf.numLines).toBe(5);
    });

    // wordWrap
    it("wordWrap test success case1", function ()
    {
        let tf = new TextField();
        tf.wordWrap = true;
        expect(tf.wordWrap).toBe(true);
    });

    it("wordWrap test success case2", function ()
    {
        let tf = new TextField();
        tf.wordWrap = 1;
        expect(tf.wordWrap).toBe(true);
    });

    it("wordWrap test success case3", function ()
    {
        let tf = new TextField();
        tf.wordWrap = "";
        expect(tf.wordWrap).toBe(false);
        tf.wordWrap = "abc";
        expect(tf.wordWrap).toBe(true);
    });

    it("wordWrap test success case4", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.wordWrap = true;
        tf.width = 100;
        tf.text = "テキストテキスト、テキストテキスト";

        expect(tf.getLineText(0)).toBe("テキストテキス");
        expect(tf.getLineText(1)).toBe("ト、テキストテキ");
        expect(tf.getLineText(2)).toBe("スト");
        expect(tf.getLineText(3)).toBe("");
    });

    it("wordWrap test success case5", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.wordWrap = true;
        tf.width = 104;
        tf.htmlText = "<font size=\"20\">テキストテ。テキスト</font>";

        expect(tf.getLineText(0)).toBe("テキスト");
        expect(tf.getLineText(1)).toBe("テ。テキス");
        expect(tf.getLineText(2)).toBe("ト");
        expect(tf.getLineText(3)).toBe("");
    });

    it("wordWrap test success case6", function ()
    {
        let tf = new TextField();

        let textFormat = tf.defaultTextFormat;
        textFormat.size = 16;
        tf.defaultTextFormat = textFormat;

        tf.width     = 90;
        tf.height    = 28.55;
        tf.wordWrap  = true;
        tf.multiline = true;
        tf.text      = "2020/9/14 12:00";

        expect(tf.getLineText(0)).toBe("2020/9/14 ");
        expect(tf.getLineText(1)).toBe("12:00");
    });

    // selectable
    it("selectable test success case1", function ()
    {
        let tf = new TextField();
        tf.selectable = true;
        expect(tf.selectable).toBe(true);
    });

    it("selectable test success case2", function ()
    {
        let tf = new TextField();
        tf.selectable = 1;
        expect(tf.selectable).toBe(true);
    });

    it("selectable test success case3", function ()
    {
        let tf = new TextField();
        tf.selectable = "";
        expect(tf.selectable).toBe(false);
        tf.selectable = "abc";
        expect(tf.selectable).toBe(true);
    });

    // multiline
    it("multiline test success case1", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        expect(tf.multiline).toBe(true);
    });

    it("multiline test success case2", function ()
    {
        let tf = new TextField();
        tf.multiline = 1;
        expect(tf.multiline).toBe(true);
    });

    it("multiline test success case3", function ()
    {
        let tf = new TextField();
        tf.multiline = "";
        expect(tf.multiline).toBe(false);
        tf.multiline = "abc";
        expect(tf.multiline).toBe(true);
    });

    // maxChars
    it("maxChars test success case1", function ()
    {
        let tf = new TextField();
        tf.maxChars = 1;
        expect(tf.maxChars).toBe(1);
    });

    it("maxChars test success case2", function ()
    {
        let tf = new TextField();
        tf.maxChars = "10";
        expect(tf.maxChars).toBe(10);
    });

    it("maxChars test valid case1", function ()
    {
        let tf = new TextField();
        tf.maxChars = -10;
        expect(tf.maxChars).toBe(-10);
    });

    // height
    it("height test success case1", function ()
    {
        let tf = new TextField();
        tf.height = 20;
        tf.width = 100;
        tf.autoSize = TextFieldAutoSize.NONE;
        tf.type = TextFieldType.INPUT;
        tf.text = "\n";

        expect(tf.height).toBe(20);
    });

    it("height test success case2", function ()
    {
        let tf = new TextField();
        tf.height = 20;
        tf.width = 100;
        tf.autoSize = TextFieldAutoSize.NONE;
        tf.type = TextFieldType.INPUT;
        tf.text = "\n";

        expect(tf.height).toBe(20);
    });

    it("height test success case3", function ()
    {
        let tf = new TextField();
        tf.height = 20;
        tf.width = 100;
        tf.autoSize = TextFieldAutoSize.LEFT;
        tf.type = TextFieldType.INPUT;
        tf.text = "\n";

        expect(Math.round(tf.height)).toBe(18);
    });

    it("height test success case4", function ()
    {
        let tf = new TextField();
        tf.height = 20;
        tf.width = 100;
        tf.autoSize = TextFieldAutoSize.LEFT;
        tf.type = TextFieldType.INPUT;
        tf.text = "\n";

        expect(Math.round(tf.height)).toBe(18);
    });

});

describe("TextField.js appendText test", function()
{

    it("appendText test success case1", function ()
    {
        let tf = new TextField();
        expect(tf.text).toBe("");

        tf.appendText("A");
        tf.appendText("B");
        tf.appendText("C");

        expect(tf.text).toBe("ABC");
    });

    it("appendText test success case2", function ()
    {
        let tf = new TextField();
        expect(tf.text).toBe("");

        tf.appendText(1);
        tf.appendText(2);
        tf.appendText(3);

        expect(tf.text).toBe("123");
    });

});

describe("TextField.js replaceText test", function()
{

    it("replaceText test success case1", function () {
        let textField = new TextField();
        textField.text = "aaaccc";
        textField.replaceText(0, 0, "ddd");
        expect(textField.text).toBe("dddaaaccc");
    });

    it("replaceText test success case2", function () {
        let textField = new TextField();
        textField.text = "aaaccc";
        textField.replaceText(1, 2, "ddd");
        expect(textField.text).toBe("adddaccc");
    });

    it("replaceText test success case3", function () {
        let textField = new TextField();
        textField.text = "aaaccc";
        textField.replaceText(6, 6, "ddd");
        expect(textField.text).toBe("aaacccddd");
    });

    it("replaceText test success case4", function () {
        let textField = new TextField();
        textField.text = "aaaccc";
        textField.replaceText(6, 5, "ddd");
        expect(textField.text).toBe("aaaccc");
    });

    it("replaceText test success case5", function () {
        let textField = new TextField();
        textField.text = "aaaccc";
        textField.replaceText(16, 1500, "ddd");
        expect(textField.text).toBe("aaacccddd");
    });

    it("replaceText test success case6", function () {
        let textField = new TextField();
        textField.text = "aaaccc";
        textField.replaceText(1, 0, "ddd");
        expect(textField.text).toBe("aaaccc");
    });

});

describe("TextField.js border test", function()
{

    it("default test case1", function()
    {
        let tf = new TextField();
        expect(tf.border).toBe(false);
    });

    it("default test case2", function()
    {
        let tf = new TextField();
        tf.border = null;
        expect(tf.border).toBe(false);
    });

    it("default test case3", function()
    {
        let tf = new TextField();
        tf.border = undefined;
        expect(tf.border).toBe(false);
    });

    it("default test case4", function()
    {
        let tf = new TextField();
        tf.border = true;
        expect(tf.border).toBe(true);
    });

    it("default test case5", function()
    {
        let tf = new TextField();
        tf.border = "";
        expect(tf.border).toBe(false);
    });

    it("default test case6", function()
    {
        let tf = new TextField();
        tf.border = "abc";
        expect(tf.border).toBe(true);
    });

    it("default test case7", function()
    {
        let tf = new TextField();
        tf.border = 0;
        expect(tf.border).toBe(false);
    });

    it("default test case8", function()
    {
        let tf = new TextField();
        tf.border = 1;
        expect(tf.border).toBe(true);
    });

    it("default test case9", function()
    {
        let tf = new TextField();
        tf.border = 500;
        expect(tf.border).toBe(true);
    });

    it("default test case10", function()
    {
        let tf = new TextField();
        tf.border = 50000000000000000;
        expect(tf.border).toBe(true);
    });

    it("default test case11", function()
    {
        let tf = new TextField();
        tf.border = -1;
        expect(tf.border).toBe(true);
    });

    it("default test case12", function()
    {
        let tf = new TextField();
        tf.border = -500;
        expect(tf.border).toBe(true);
    });

    it("default test case13", function()
    {
        let tf = new TextField();
        tf.border = -50000000000000000;
        expect(tf.border).toBe(true);
    });

    it("default test case14", function()
    {
        let tf = new TextField();
        tf.border = { "a":0 };
        expect(tf.border).toBe(true);
    });

    it("default test case15", function()
    {
        let tf = new TextField();
        tf.border = function a() {};
        expect(tf.border).toBe(true);
    });

    it("default test case16", function()
    {
        let tf = new TextField();
        tf.border = [1];
        expect(tf.border).toBe(true);
    });

    it("default test case17", function()
    {
        let tf = new TextField();
        tf.border = [1,2];
        expect(tf.border).toBe(true);
    });

    it("default test case18", function()
    {
        let tf = new TextField();
        tf.border = {};
        expect(tf.border).toBe(true);
    });

    it("default test case19", function()
    {
        let tf = new TextField();
        tf.border = { "toString":function () { return 1 } };
        expect(tf.border).toBe(true);
    });

    it("default test case20", function()
    {
        let tf = new TextField();
        tf.border = { "toString":function () { return "10" } };
        expect(tf.border).toBe(true);
    });

    it("default test case21", function()
    {
        let tf = new TextField();
        tf.border = { "toString":function () { return "1a" } };
        expect(tf.border).toBe(true);
    });

});

describe("TextField.js multiline test", function()
{

    it("default test case1", function()
    {
        let tf = new TextField();
        expect(tf.multiline).toBe(false);
    });

    it("default test case2", function()
    {
        let tf = new TextField();
        tf.multiline = null;
        expect(tf.multiline).toBe(false);
    });

    it("default test case3", function()
    {
        let tf = new TextField();
        tf.multiline = undefined;
        expect(tf.multiline).toBe(false);
    });

    it("default test case4", function()
    {
        let tf = new TextField();
        tf.multiline = true;
        expect(tf.multiline).toBe(true);
    });

    it("default test case5", function()
    {
        let tf = new TextField();
        tf.multiline = "";
        expect(tf.multiline).toBe(false);
    });

    it("default test case6", function()
    {
        let tf = new TextField();
        tf.multiline = "abc";
        expect(tf.multiline).toBe(true);
    });

    it("default test case7", function()
    {
        let tf = new TextField();
        tf.multiline = 0;
        expect(tf.multiline).toBe(false);
    });

    it("default test case8", function()
    {
        let tf = new TextField();
        tf.multiline = 1;
        expect(tf.multiline).toBe(true);
    });

    it("default test case9", function()
    {
        let tf = new TextField();
        tf.multiline = 500;
        expect(tf.multiline).toBe(true);
    });

    it("default test case10", function()
    {
        let tf = new TextField();
        tf.multiline = 50000000000000000;
        expect(tf.multiline).toBe(true);
    });

    it("default test case11", function()
    {
        let tf = new TextField();
        tf.multiline = -1;
        expect(tf.multiline).toBe(true);
    });

    it("default test case12", function()
    {
        let tf = new TextField();
        tf.multiline = -500;
        expect(tf.multiline).toBe(true);
    });

    it("default test case13", function()
    {
        let tf = new TextField();
        tf.multiline = -50000000000000000;
        expect(tf.multiline).toBe(true);
    });

    it("default test case14", function()
    {
        let tf = new TextField();
        tf.multiline = { "a":0 };
        expect(tf.multiline).toBe(true);
    });

    it("default test case15", function()
    {
        let tf = new TextField();
        tf.multiline = function a() {};
        expect(tf.multiline).toBe(true);
    });

    it("default test case16", function()
    {
        let tf = new TextField();
        tf.multiline = [1];
        expect(tf.multiline).toBe(true);
    });

    it("default test case17", function()
    {
        let tf = new TextField();
        tf.multiline = [1,2];
        expect(tf.multiline).toBe(true);
    });

    it("default test case18", function()
    {
        let tf = new TextField();
        tf.multiline = {};
        expect(tf.multiline).toBe(true);
    });

    it("default test case19", function()
    {
        let tf = new TextField();
        tf.multiline = { "toString":function () { return 1 } };
        expect(tf.multiline).toBe(true);
    });

    it("default test case20", function()
    {
        let tf = new TextField();
        tf.multiline = { "toString":function () { return "10" } };
        expect(tf.multiline).toBe(true);
    });

    it("default test case21", function()
    {
        let tf = new TextField();
        tf.multiline = { "toString":function () { return "1a" } };
        expect(tf.multiline).toBe(true);
    });

});

describe("TextField.js selectable test", function()
{

    it("default test case1", function()
    {
        let tf = new TextField();
        expect(tf.selectable).toBe(true);
    });

    it("default test case2", function()
    {
        let tf = new TextField();
        tf.selectable = null;
        expect(tf.selectable).toBe(false);
    });

    it("default test case3", function()
    {
        let tf = new TextField();
        tf.selectable = undefined;
        expect(tf.selectable).toBe(false);
    });

    it("default test case4", function()
    {
        let tf = new TextField();
        tf.selectable = true;
        expect(tf.selectable).toBe(true);
    });

    it("default test case5", function()
    {
        let tf = new TextField();
        tf.selectable = "";
        expect(tf.selectable).toBe(false);
    });

    it("default test case6", function()
    {
        let tf = new TextField();
        tf.selectable = "abc";
        expect(tf.selectable).toBe(true);
    });

    it("default test case7", function()
    {
        let tf = new TextField();
        tf.selectable = 0;
        expect(tf.selectable).toBe(false);
    });

    it("default test case8", function()
    {
        let tf = new TextField();
        tf.selectable = 1;
        expect(tf.selectable).toBe(true);
    });

    it("default test case9", function()
    {
        let tf = new TextField();
        tf.selectable = 500;
        expect(tf.selectable).toBe(true);
    });

    it("default test case10", function()
    {
        let tf = new TextField();
        tf.selectable = 50000000000000000;
        expect(tf.selectable).toBe(true);
    });

    it("default test case11", function()
    {
        let tf = new TextField();
        tf.selectable = -1;
        expect(tf.selectable).toBe(true);
    });

    it("default test case12", function()
    {
        let tf = new TextField();
        tf.selectable = -500;
        expect(tf.selectable).toBe(true);
    });

    it("default test case13", function()
    {
        let tf = new TextField();
        tf.selectable = -50000000000000000;
        expect(tf.selectable).toBe(true);
    });

    it("default test case14", function()
    {
        let tf = new TextField();
        tf.selectable = { "a":0 };
        expect(tf.selectable).toBe(true);
    });

    it("default test case15", function()
    {
        let tf = new TextField();
        tf.selectable = function a() {};
        expect(tf.selectable).toBe(true);
    });

    it("default test case16", function()
    {
        let tf = new TextField();
        tf.selectable = [1];
        expect(tf.selectable).toBe(true);
    });

    it("default test case17", function()
    {
        let tf = new TextField();
        tf.selectable = [1,2];
        expect(tf.selectable).toBe(true);
    });

    it("default test case18", function()
    {
        let tf = new TextField();
        tf.selectable = {};
        expect(tf.selectable).toBe(true);
    });

    it("default test case19", function()
    {
        let tf = new TextField();
        tf.selectable = { "toString":function () { return 1 } };
        expect(tf.selectable).toBe(true);
    });

    it("default test case20", function()
    {
        let tf = new TextField();
        tf.selectable = { "toString":function () { return "10" } };
        expect(tf.selectable).toBe(true);
    });

    it("default test case21", function()
    {
        let tf = new TextField();
        tf.selectable = { "toString":function () { return "1a" } };
        expect(tf.selectable).toBe(true);
    });

});

describe("TextField.js wordWrap test", function()
{

    it("default test case1", function()
    {
        let tf = new TextField();
        expect(tf.wordWrap).toBe(false);
    });

    it("default test case2", function()
    {
        let tf = new TextField();
        tf.wordWrap = null;
        expect(tf.wordWrap).toBe(false);
    });

    it("default test case3", function()
    {
        let tf = new TextField();
        tf.wordWrap = undefined;
        expect(tf.wordWrap).toBe(false);
    });

    it("default test case4", function()
    {
        let tf = new TextField();
        tf.wordWrap = true;
        expect(tf.wordWrap).toBe(true);
    });

    it("default test case5", function()
    {
        let tf = new TextField();
        tf.wordWrap = "";
        expect(tf.wordWrap).toBe(false);
    });

    it("default test case6", function()
    {
        let tf = new TextField();
        tf.wordWrap = "abc";
        expect(tf.wordWrap).toBe(true);
    });

    it("default test case7", function()
    {
        let tf = new TextField();
        tf.wordWrap = 0;
        expect(tf.wordWrap).toBe(false);
    });

    it("default test case8", function()
    {
        let tf = new TextField();
        tf.wordWrap = 1;
        expect(tf.wordWrap).toBe(true);
    });

    it("default test case9", function()
    {
        let tf = new TextField();
        tf.wordWrap = 500;
        expect(tf.wordWrap).toBe(true);
    });

    it("default test case10", function()
    {
        let tf = new TextField();
        tf.wordWrap = 50000000000000000;
        expect(tf.wordWrap).toBe(true);
    });

    it("default test case11", function()
    {
        let tf = new TextField();
        tf.wordWrap = -1;
        expect(tf.wordWrap).toBe(true);
    });

    it("default test case12", function()
    {
        let tf = new TextField();
        tf.wordWrap = -500;
        expect(tf.wordWrap).toBe(true);
    });

    it("default test case13", function()
    {
        let tf = new TextField();
        tf.wordWrap = -50000000000000000;
        expect(tf.wordWrap).toBe(true);
    });

    it("default test case14", function()
    {
        let tf = new TextField();
        tf.wordWrap = { "a":0 };
        expect(tf.wordWrap).toBe(true);
    });

    it("default test case15", function()
    {
        let tf = new TextField();
        tf.wordWrap = function a() {};
        expect(tf.wordWrap).toBe(true);
    });

    it("default test case16", function()
    {
        let tf = new TextField();
        tf.wordWrap = [1];
        expect(tf.wordWrap).toBe(true);
    });

    it("default test case17", function()
    {
        let tf = new TextField();
        tf.wordWrap = [1,2];
        expect(tf.wordWrap).toBe(true);
    });

    it("default test case18", function()
    {
        let tf = new TextField();
        tf.wordWrap = {};
        expect(tf.wordWrap).toBe(true);
    });

    it("default test case19", function()
    {
        let tf = new TextField();
        tf.wordWrap = { "toString":function () { return 1 } };
        expect(tf.wordWrap).toBe(true);
    });

    it("default test case20", function()
    {
        let tf = new TextField();
        tf.wordWrap = { "toString":function () { return "10" } };
        expect(tf.wordWrap).toBe(true);
    });

    it("default test case21", function()
    {
        let tf = new TextField();
        tf.wordWrap = { "toString":function () { return "1a" } };
        expect(tf.wordWrap).toBe(true);
    });

});

describe("TextField.js autoSize test", function()
{

    it("default test case1", function()
    {
        let tf = new TextField();
        expect(tf.autoSize).toBe("none");
    });

    it("default test case2", function()
    {
        let tf = new TextField();
        tf.autoSize = true;
        expect(tf.autoSize).toBe("none");
    });

    it("default test case3", function()
    {
        let tf = new TextField();
        tf.autoSize = "";
        expect(tf.autoSize).toBe("none");
    });

    it("default test case4", function()
    {
        let tf = new TextField();
        tf.autoSize = "abc";
        expect(tf.autoSize).toBe("none");
    });

    it("default test case5", function()
    {
        let tf = new TextField();
        tf.autoSize = TextFieldAutoSize.CENTER;
        expect(tf.autoSize).toBe("center");

        tf.autoSize = TextFieldAutoSize.RIGHT;
        expect(tf.autoSize).toBe("right");

        tf.autoSize = TextFieldAutoSize.LEFT;
        expect(tf.autoSize).toBe("left");
    });

    it("default test case6", function()
    {
        let tf = new TextField();
        tf.autoSize = 0;
        expect(tf.autoSize).toBe("none");
    });

    it("default test case7", function()
    {
        let tf = new TextField();
        tf.autoSize = 1;
        expect(tf.autoSize).toBe("none");
    });

    it("default test case8", function()
    {
        let tf = new TextField();
        tf.autoSize = 500;
        expect(tf.autoSize).toBe("none");
    });

    it("default test case9", function()
    {
        let tf = new TextField();
        tf.autoSize = 50000000000000000;
        expect(tf.autoSize).toBe("none");
    });

    it("default test case10", function()
    {
        let tf = new TextField();
        tf.autoSize = -1;
        expect(tf.autoSize).toBe("none");
    });

    it("default test case11", function()
    {
        let tf = new TextField();
        tf.autoSize = -500;
        expect(tf.autoSize).toBe("none");
    });

    it("default test case12", function()
    {
        let tf = new TextField();
        tf.autoSize = -50000000000000000;
        expect(tf.autoSize).toBe("none");
    });

    it("default test case13", function()
    {
        let tf = new TextField();
        tf.autoSize = { "a":0 };
        expect(tf.autoSize).toBe("none");
    });

    it("default test case14", function()
    {
        let tf = new TextField();
        tf.autoSize = function a() {};
        expect(tf.autoSize).toBe("none");
    });

    it("default test case15", function()
    {
        let tf = new TextField();
        tf.autoSize = [1];
        expect(tf.autoSize).toBe("none");
    });

    it("default test case16", function()
    {
        let tf = new TextField();
        tf.autoSize = [1,2];
        expect(tf.autoSize).toBe("none");
    });

    it("default test case17", function()
    {
        let tf = new TextField();
        tf.autoSize = {};
        expect(tf.autoSize).toBe("none");
    });

    it("default test case18", function()
    {
        let tf = new TextField();
        tf.autoSize = { "toString":function () { return 1 } };
        expect(tf.autoSize).toBe("none");
    });

    it("default test case19", function()
    {
        let tf = new TextField();
        tf.autoSize = { "toString":function () { return "10" } };
        expect(tf.autoSize).toBe("none");
    });

    it("default test case20", function()
    {
        let tf = new TextField();
        tf.autoSize = { "toString":function () { return "1a" } };
        expect(tf.autoSize).toBe("none");
    });

});

describe("TextField.js backgroundColor test", function()
{

    it("default test case1", function()
    {
        let tf = new TextField();
        expect(tf.backgroundColor).toBe(16777215);
    });

    it("default test case2", function()
    {
        let tf = new TextField();
        tf.backgroundColor = null;
        expect(tf.backgroundColor).toBe(0);
    });

    it("default test case3", function()
    {
        let tf = new TextField();
        tf.backgroundColor = undefined;
        expect(tf.backgroundColor).toBe(0);
    });

    it("default test case4", function()
    {
        let tf = new TextField();
        tf.backgroundColor = true;
        expect(tf.backgroundColor).toBe(1);
    });

    it("default test case5", function()
    {
        let tf = new TextField();
        tf.backgroundColor = "";
        expect(tf.backgroundColor).toBe(0);
    });

    it("default test case6", function()
    {
        let tf = new TextField();
        tf.backgroundColor = "abc";
        expect(tf.backgroundColor).toBe(0);
    });

    it("default test case7", function()
    {
        let tf = new TextField();
        tf.backgroundColor = 0;
        expect(tf.backgroundColor).toBe(0);
    });

    it("default test case8", function()
    {
        let tf = new TextField();
        tf.backgroundColor = 1;
        expect(tf.backgroundColor).toBe(1);
    });

    it("default test case9", function()
    {
        let tf = new TextField();
        tf.backgroundColor = 500;
        expect(tf.backgroundColor).toBe(500);
    });

    it("default test case10", function()
    {
        let tf = new TextField();
        tf.backgroundColor = 50000000000000000;
        expect(tf.backgroundColor).toBe(0xffffff);
    });

    it("default test case11", function()
    {
        let tf = new TextField();
        tf.backgroundColor = -1;
        expect(tf.backgroundColor).toBe(0);
    });

    it("default test case12", function()
    {
        let tf = new TextField();
        tf.backgroundColor = -500;
        expect(tf.backgroundColor).toBe(0);
    });

    it("default test case13", function()
    {
        let tf = new TextField();
        tf.backgroundColor = -50000000000000000;
        expect(tf.backgroundColor).toBe(0);
    });

    it("default test case14", function()
    {
        let tf = new TextField();
        tf.backgroundColor = { "a":0 };
        expect(tf.backgroundColor).toBe(0);
    });

    it("default test case15", function()
    {
        let tf = new TextField();
        tf.backgroundColor = function a() {};
        expect(tf.backgroundColor).toBe(0);
    });

    it("default test case16", function()
    {
        let tf = new TextField();
        tf.backgroundColor = [1];
        expect(tf.backgroundColor).toBe(1);
    });

    it("default test case17", function()
    {
        let tf = new TextField();
        tf.backgroundColor = [1,2];
        expect(tf.backgroundColor).toBe(0);
    });

    it("default test case18", function()
    {
        let tf = new TextField();
        tf.backgroundColor = {};
        expect(tf.backgroundColor).toBe(0);
    });

    it("default test case19", function()
    {
        let tf = new TextField();
        tf.backgroundColor = { "toString":function () { return 1 } };
        expect(tf.backgroundColor).toBe(1);
    });

    it("default test case20", function()
    {
        let tf = new TextField();
        tf.backgroundColor = { "toString":function () { return "10" } };
        expect(tf.backgroundColor).toBe(10);
    });

    it("default test case21", function()
    {
        let tf = new TextField();
        tf.backgroundColor = { "toString":function () { return "1a" } };
        expect(tf.backgroundColor).toBe(0);
    });

    it("default test case22", function()
    {
        let tf = new TextField();
        tf.backgroundColor = "red";
        expect(tf.backgroundColor).toBe(0xff0000);
    });
});

describe("TextField.js borderColor test", function()
{

    it("default test case1", function()
    {
        let tf = new TextField();
        expect(tf.borderColor).toBe(0);
    });

    it("default test case2", function()
    {
        let tf = new TextField();
        tf.borderColor = null;
        expect(tf.borderColor).toBe(0);
    });

    it("default test case3", function()
    {
        let tf = new TextField();
        tf.borderColor = undefined;
        expect(tf.borderColor).toBe(0);
    });

    it("default test case4", function()
    {
        let tf = new TextField();
        tf.borderColor = true;
        expect(tf.borderColor).toBe(1);
    });

    it("default test case5", function()
    {
        let tf = new TextField();
        tf.borderColor = "";
        expect(tf.borderColor).toBe(0);
    });

    it("default test case6", function()
    {
        let tf = new TextField();
        tf.borderColor = "abc";
        expect(tf.borderColor).toBe(0);
    });

    it("default test case7", function()
    {
        let tf = new TextField();
        tf.borderColor = 0;
        expect(tf.borderColor).toBe(0);
    });

    it("default test case8", function()
    {
        let tf = new TextField();
        tf.borderColor = 1;
        expect(tf.borderColor).toBe(1);
    });

    it("default test case9", function()
    {
        let tf = new TextField();
        tf.borderColor = 500;
        expect(tf.borderColor).toBe(500);
    });

    it("default test case10", function()
    {
        let tf = new TextField();
        tf.borderColor = 50000000000000000;
        expect(tf.borderColor).toBe(0xffffff);
    });

    it("default test case11", function()
    {
        let tf = new TextField();
        tf.borderColor = -1;
        expect(tf.borderColor).toBe(0);
    });

    it("default test case12", function()
    {
        let tf = new TextField();
        tf.borderColor = -500;
        expect(tf.borderColor).toBe(0);
    });

    it("default test case13", function()
    {
        let tf = new TextField();
        tf.borderColor = -50000000000000000;
        expect(tf.borderColor).toBe(0);
    });

    it("default test case14", function()
    {
        let tf = new TextField();
        tf.borderColor = { "a":0 };
        expect(tf.borderColor).toBe(0);
    });

    it("default test case15", function()
    {
        let tf = new TextField();
        tf.borderColor = function a() {};
        expect(tf.borderColor).toBe(0);
    });

    it("default test case16", function()
    {
        let tf = new TextField();
        tf.borderColor = [1];
        expect(tf.borderColor).toBe(1);
    });

    it("default test case17", function()
    {
        let tf = new TextField();
        tf.borderColor = [1,2];
        expect(tf.borderColor).toBe(0);
    });

    it("default test case18", function()
    {
        let tf = new TextField();
        tf.borderColor = {};
        expect(tf.borderColor).toBe(0);
    });

    it("default test case19", function()
    {
        let tf = new TextField();
        tf.borderColor = { "toString":function () { return 1 } };
        expect(tf.borderColor).toBe(1);
    });

    it("default test case20", function()
    {
        let tf = new TextField();
        tf.borderColor = { "toString":function () { return "10" } };
        expect(tf.borderColor).toBe(10);
    });

    it("default test case21", function()
    {
        let tf = new TextField();
        tf.borderColor = { "toString":function () { return "1a" } };
        expect(tf.borderColor).toBe(0);
    });

    it("default test case22", function()
    {
        let tf = new TextField();
        tf.borderColor = "red";
        expect(tf.borderColor).toBe(0xff0000);
    });

});

describe("TextField.js maxChars test", function()
{

    it("default test case1", function()
    {
        let tf = new TextField();
        expect(tf.maxChars).toBe(0);
    });

    it("default test case2", function()
    {
        let tf = new TextField();
        tf.maxChars = null;
        expect(tf.maxChars).toBe(0);
    });

    it("default test case3", function()
    {
        let tf = new TextField();
        tf.maxChars = undefined;
        expect(tf.maxChars).toBe(0);
    });

    it("default test case4", function()
    {
        let tf = new TextField();
        tf.maxChars = true;
        expect(tf.maxChars).toBe(1);
    });

    it("default test case5", function()
    {
        let tf = new TextField();
        tf.maxChars = "";
        expect(tf.maxChars).toBe(0);
    });

    it("default test case6", function()
    {
        let tf = new TextField();
        tf.maxChars = "abc";
        expect(tf.maxChars).toBe(0);
    });

    it("default test case7", function()
    {
        let tf = new TextField();
        tf.maxChars = 0;
        expect(tf.maxChars).toBe(0);
    });

    it("default test case8", function()
    {
        let tf = new TextField();
        tf.maxChars = 1;
        expect(tf.maxChars).toBe(1);
    });

    it("default test case9", function()
    {
        let tf = new TextField();
        tf.maxChars = 500;
        expect(tf.maxChars).toBe(500);
    });

    it("default test case10", function()
    {
        let tf = new TextField();
        tf.maxChars = 50000000000000000;
        expect(tf.maxChars).toBe(784662528);
    });

    it("default test case11", function()
    {
        let tf = new TextField();
        tf.maxChars = -1;
        expect(tf.maxChars).toBe(-1);
    });

    it("default test case12", function()
    {
        let tf = new TextField();
        tf.maxChars = -500;
        expect(tf.maxChars).toBe(-500);
    });

    it("default test case13", function()
    {
        let tf = new TextField();
        tf.maxChars = -50000000000000000;
        expect(tf.maxChars).toBe(-784662528);
    });

    it("default test case14", function()
    {
        let tf = new TextField();
        tf.maxChars = { "a":0 };
        expect(tf.maxChars).toBe(0);
    });

    it("default test case15", function()
    {
        let tf = new TextField();
        tf.maxChars = function a() {};
        expect(tf.maxChars).toBe(0);
    });

    it("default test case16", function()
    {
        let tf = new TextField();
        tf.maxChars = [1];
        expect(tf.maxChars).toBe(1);
    });

    it("default test case17", function()
    {
        let tf = new TextField();
        tf.maxChars = [1,2];
        expect(tf.maxChars).toBe(0);
    });

    it("default test case18", function()
    {
        let tf = new TextField();
        tf.maxChars = {};
        expect(tf.maxChars).toBe(0);
    });

    it("default test case19", function()
    {
        let tf = new TextField();
        tf.maxChars = { "toString":function () { return 1 } };
        expect(tf.maxChars).toBe(1);
    });

    it("default test case20", function()
    {
        let tf = new TextField();
        tf.maxChars = { "toString":function () { return "10" } };
        expect(tf.maxChars).toBe(10);
    });

    it("default test case21", function()
    {
        let tf = new TextField();
        tf.maxChars = { "toString":function () { return "1a" } };
        expect(tf.maxChars).toBe(0);
    });

});

describe("TextField.js restrict test", function()
{

    it("default test case1", function()
    {
        let tf = new TextField();
        expect(tf.restrict).toBe(null);
    });

    it("default test case2", function()
    {
        let tf = new TextField();
        tf.restrict = null;
        expect(tf.restrict).toBe("null");
    });

    it("default test case3", function()
    {
        let tf = new TextField();
        tf.restrict = undefined;
        expect(tf.restrict).toBe("undefined");
    });

    it("default test case4", function()
    {
        let tf = new TextField();
        tf.restrict = true;
        expect(tf.restrict).toBe("true");
    });

    it("default test case5", function()
    {
        let tf = new TextField();
        tf.restrict = "";
        expect(tf.restrict).toBe("");
    });

    it("default test case6", function()
    {
        let tf = new TextField();
        tf.restrict = "abc";
        expect(tf.restrict).toBe("abc");
    });

    it("default test case7", function()
    {
        let tf = new TextField();
        tf.restrict = 0;
        expect(tf.restrict).toBe("0");
    });

    it("default test case8", function()
    {
        let tf = new TextField();
        tf.restrict = 1;
        expect(tf.restrict).toBe("1");
    });

    it("default test case9", function()
    {
        let tf = new TextField();
        tf.restrict = 500;
        expect(tf.restrict).toBe("500");
    });

    it("default test case10", function()
    {
        let tf = new TextField();
        tf.restrict = 50000000000000000;
        expect(tf.restrict).toBe("50000000000000000");
    });

    it("default test case11", function()
    {
        let tf = new TextField();
        tf.restrict = -1;
        expect(tf.restrict).toBe("-1");
    });

    it("default test case12", function()
    {
        let tf = new TextField();
        tf.restrict = -500;
        expect(tf.restrict).toBe("-500");
    });

    it("default test case13", function()
    {
        let tf = new TextField();
        tf.restrict = -50000000000000000;
        expect(tf.restrict).toBe("-50000000000000000");
    });

    it("default test case14", function()
    {
        let tf = new TextField();
        tf.restrict = { "a":0 };
        expect(tf.restrict).toBe("[object Object]");
    });

    it("default test case15", function()
    {
        let test = function () {};
        test.toString = function () { return "test" };

        let tf = new TextField();
        tf.restrict = test;
        expect(tf.restrict).toBe("test");
    });

    it("default test case16", function()
    {
        let tf = new TextField();
        tf.restrict = [1];
        expect(tf.restrict).toBe("1");
    });

    it("default test case17", function()
    {
        let tf = new TextField();
        tf.restrict = [1,2];
        expect(tf.restrict).toBe("1,2");
    });

    it("default test case18", function()
    {
        let tf = new TextField();
        tf.restrict = {};
        expect(tf.restrict).toBe("[object Object]");
    });

    it("default test case19", function()
    {
        let tf = new TextField();
        tf.restrict = { "toString":function () { return 1 } };
        expect(tf.restrict).toBe("1");
    });

    it("default test case20", function()
    {
        let tf = new TextField();
        tf.restrict = { "toString":function () { return "10" } };
        expect(tf.restrict).toBe("10");
    });

    it("default test case21", function()
    {
        let tf = new TextField();
        tf.restrict = { "toString":function () { return "1a" } };
        expect(tf.restrict).toBe("1a");
    });

});

describe("TextField.js text test", function()
{

    it("default test case1", function()
    {
        let tf = new TextField();
        expect(tf.text).toBe("");
    });

    it("default test case2", function()
    {
        let tf = new TextField();
        tf.text = true;
        expect(tf.text).toBe("true");
    });

    it("default test case3", function()
    {
        let tf = new TextField();
        tf.text = "";
        expect(tf.text).toBe("");
    });

    it("default test case4", function()
    {
        let tf = new TextField();
        tf.text = "abc";
        expect(tf.text).toBe("abc");
    });

    it("default test case5", function()
    {
        let tf = new TextField();
        tf.text = 0;
        expect(tf.text).toBe("0");
    });

    it("default test case6", function()
    {
        let tf = new TextField();
        tf.text = 1;
        expect(tf.text).toBe("1");
    });

    it("default test case7", function()
    {
        let tf = new TextField();
        tf.text = 500;
        expect(tf.text).toBe("500");
    });

    it("default test case8", function()
    {
        let tf = new TextField();
        tf.text = 50000000000000000;
        expect(tf.text).toBe("50000000000000000");
    });

    it("default test case9", function()
    {
        let tf = new TextField();
        tf.text = -1;
        expect(tf.text).toBe("-1");
    });

    it("default test case10", function()
    {
        let tf = new TextField();
        tf.text = -500;
        expect(tf.text).toBe("-500");
    });

    it("default test case11", function()
    {
        let tf = new TextField();
        tf.text = -50000000000000000;
        expect(tf.text).toBe("-50000000000000000");
    });

    it("default test case12", function()
    {
        let tf = new TextField();
        tf.text = { "a":0 };
        expect(tf.text).toBe("[object Object]");
    });

    it("default test case13", function()
    {
        let test = function () {};
        test.toString = function () { return "test" };

        let tf = new TextField();
        tf.text = test;
        expect(tf.text).toBe("test");
    });

    it("default test case14", function()
    {
        let tf = new TextField();
        tf.text = [1];
        expect(tf.text).toBe("1");
    });

    it("default test case15", function()
    {
        let tf = new TextField();
        tf.text = [1,2];
        expect(tf.text).toBe("1,2");
    });

    it("default test case16", function()
    {
        let tf = new TextField();
        tf.text = {};
        expect(tf.text).toBe("[object Object]");
    });

    it("default test case17", function()
    {
        let tf = new TextField();
        tf.text = { "toString":function () { return 1 } };
        expect(tf.text).toBe("1");
    });

    it("default test case18", function()
    {
        let tf = new TextField();
        tf.text = { "toString":function () { return "10" } };
        expect(tf.text).toBe("10");
    });

    it("default test case19", function()
    {
        let tf = new TextField();
        tf.text = { "toString":function () { return "1a" } };
        expect(tf.text).toBe("1a");
    });

});

describe("TextField.js textColor test", function()
{

    it("default test case1", function()
    {
        let tf = new TextField();
        expect(tf.textColor).toBe(0);
    });

    it("default test case2", function()
    {
        let tf = new TextField();
        tf.textColor = null;
        expect(tf.textColor).toBe(0);
    });

    it("default test case3", function()
    {
        let tf = new TextField();
        tf.textColor = undefined;
        expect(tf.textColor).toBe(0);
    });

    it("default test case4", function()
    {
        let tf = new TextField();
        tf.textColor = true;
        expect(tf.textColor).toBe(1);
    });

    it("default test case5", function()
    {
        let tf = new TextField();
        tf.textColor = "";
        expect(tf.textColor).toBe(0);
    });

    it("default test case6", function()
    {
        let tf = new TextField();
        tf.textColor = "abc";
        expect(tf.textColor).toBe(0);
    });

    it("default test case7", function()
    {
        let tf = new TextField();
        tf.textColor = 0;
        expect(tf.textColor).toBe(0);
    });

    it("default test case8", function()
    {
        let tf = new TextField();
        tf.textColor = 1;
        expect(tf.textColor).toBe(1);
    });

    it("default test case9", function()
    {
        let tf = new TextField();
        tf.textColor = 500;
        expect(tf.textColor).toBe(500);
    });

    it("default test case10", function()
    {
        let tf = new TextField();
        tf.textColor = 50000000000000000;
        expect(tf.textColor).toBe(0xffffff);
    });

    it("default test case11", function()
    {
        let tf = new TextField();
        tf.textColor = -1;
        expect(tf.textColor).toBe(0);
    });

    it("default test case12", function()
    {
        let tf = new TextField();
        tf.textColor = -500;
        expect(tf.textColor).toBe(0);
    });

    it("default test case13", function()
    {
        let tf = new TextField();
        tf.textColor = -50000000000000000;
        expect(tf.textColor).toBe(0);
    });

    it("default test case14", function()
    {
        let tf = new TextField();
        tf.textColor = { "a":0 };
        expect(tf.textColor).toBe(0);
    });

    it("default test case15", function()
    {
        let tf = new TextField();
        tf.textColor = function a() {};
        expect(tf.textColor).toBe(0);
    });

    it("default test case16", function()
    {
        let tf = new TextField();
        tf.textColor = [1];
        expect(tf.textColor).toBe(1);
    });

    it("default test case17", function()
    {
        let tf = new TextField();
        tf.textColor = [1,2];
        expect(tf.textColor).toBe(0);
    });

    it("default test case18", function()
    {
        let tf = new TextField();
        tf.textColor = {};
        expect(tf.textColor).toBe(0);
    });

    it("default test case19", function()
    {
        let tf = new TextField();
        tf.textColor = { "toString":function () { return 1 } };
        expect(tf.textColor).toBe(1);
    });

    it("default test case20", function()
    {
        let tf = new TextField();
        tf.textColor = { "toString":function () { return "10" } };
        expect(tf.textColor).toBe(10);
    });

    it("default test case21", function()
    {
        let tf = new TextField();
        tf.textColor = { "toString":function () { return "1a" } };
        expect(tf.textColor).toBe(0);
    });

});

describe("TextField.js width test", function()
{

    it("default test case1", function()
    {
        let tf = new TextField();
        expect(tf.width).toBe(100);
    });

    it("default test case2", function()
    {
        let tf = new TextField();
        tf.width = null;
        expect(tf.width).toBe(0);
    });

    it("default test case3", function()
    {
        let tf = new TextField();
        tf.width = undefined;
        expect(tf.width).toBe(100);
    });

    it("default test case4", function()
    {
        let tf = new TextField();
        tf.width = true;
        expect(tf.width).toBe(1);
    });

    it("default test case5", function()
    {
        let tf = new TextField();
        tf.width = "";
        expect(tf.width).toBe(0);
    });

    it("default test case6", function()
    {
        let tf = new TextField();
        tf.width = "abc";
        expect(tf.width).toBe(100);
    });

    it("default test case7", function()
    {
        let tf = new TextField();
        tf.width = 0;
        expect(tf.width).toBe(0);
    });

    it("default test case8", function()
    {
        let tf = new TextField();
        tf.width = 1;
        expect(tf.width).toBe(1);
    });

    it("default test case9", function()
    {
        let tf = new TextField();
        tf.width = 500;
        expect(tf.width).toBe(500);
    });

    it("default test case11", function()
    {
        let tf = new TextField();
        tf.width = -1;
        expect(tf.width).toBe(100);
    });

    it("default test case12", function()
    {
        let tf = new TextField();
        tf.width = -500;
        expect(tf.width).toBe(100);
    });

    it("default test case13", function()
    {
        let tf = new TextField();
        tf.width = -50000000000000000;
        expect(tf.width).toBe(100);
    });

    it("default test case14", function()
    {
        let tf = new TextField();
        tf.width = { "a":0 };
        expect(tf.width).toBe(100);
    });

    it("default test case15", function()
    {
        let tf = new TextField();
        tf.width = function a() {};
        expect(tf.width).toBe(100);
    });

    it("default test case16", function()
    {
        let tf = new TextField();
        tf.width = [1];
        expect(tf.width).toBe(1);
    });

    it("default test case17", function()
    {
        let tf = new TextField();
        tf.width = [1,2];
        expect(tf.width).toBe(100);
    });

    it("default test case18", function()
    {
        let tf = new TextField();
        tf.width = {};
        expect(tf.width).toBe(100);
    });

    it("default test case19", function()
    {
        let tf = new TextField();
        tf.width = { "toString":function () { return 1 } };
        expect(tf.width).toBe(1);
    });

    it("default test case20", function()
    {
        let tf = new TextField();
        tf.width = { "toString":function () { return "10" } };
        expect(tf.width).toBe(10);
    });

    it("default test case21", function()
    {
        let tf = new TextField();
        tf.width = { "toString":function () { return "1a" } };
        expect(tf.width).toBe(100);
    });

    it("default test case23 ", function()
    {
        let text = "【第1部隊】が本拠地へ帰還しました。";

        let format = new TextFormat();
        format.size = 14;
        // format.leading = 4;
        // format.leftMargin  = 18;
        // format.rightMargin = 6;
        format.font = "_sans";

        let field  = new TextField();
        field.defaultTextFormat = format;

        // default
        expect(field._$originBounds.xMin).toBe(0);
        expect(field._$originBounds.xMax).toBe(100);
        expect(field._$originBounds.yMin).toBe(0);
        expect(field._$originBounds.yMax).toBe(100);
        field.htmlText = text; // reload start

        // end reload size
        expect(field._$originBounds.xMin).toBe(0);
        expect(field._$originBounds.xMax).toBe(100);
        expect(field._$originBounds.yMin).toBe(0);
        expect(field._$originBounds.yMax).toBe(100);

        field.mouseEnabled = false;
        field.multiline = true;
        field.wordWrap = true;

        field.autoSize = TextFieldAutoSize.LEFT; // reload start

        // end reload size
        expect(field._$originBounds.xMin).toBe(0);
        expect(field._$originBounds.xMax).toBe(100);
        expect(field._$originBounds.yMin).toBe(0);
        expect(field._$originBounds.yMax).toBe(100);

        field.width = 458; // reload start

        // end reload size
        expect(field._$originBounds.xMin).toBe(0);
        expect(field._$originBounds.xMax).toBe(458);
        expect(field._$originBounds.yMin).toBe(0);
        expect(field._$originBounds.yMax).toBe(100);

    });
});

describe("TextField.js height test", function()
{

    it("default test case1", function()
    {
        let tf = new TextField();
        expect(tf.height).toBe(100);
    });

    it("default test case2", function()
    {
        let tf = new TextField();
        tf.height = null;
        expect(tf.height).toBe(0);
    });

    it("default test case3", function()
    {
        let tf = new TextField();
        tf.height = undefined;
        expect(tf.height).toBe(100);
    });

    it("default test case4", function()
    {
        let tf = new TextField();
        tf.height = true;
        expect(tf.height).toBe(1);
    });

    it("default test case5", function()
    {
        let tf = new TextField();
        tf.height = "";
        expect(tf.height).toBe(0);
    });

    it("default test case6", function()
    {
        let tf = new TextField();
        tf.height = "abc";
        expect(tf.height).toBe(100);
    });

    it("default test case7", function()
    {
        let tf = new TextField();
        tf.height = 0;
        expect(tf.height).toBe(0);
    });

    it("default test case8", function()
    {
        let tf = new TextField();
        tf.height = 1;
        expect(tf.height).toBe(1);
    });

    it("default test case9", function()
    {
        let tf = new TextField();
        tf.height = 500;
        expect(tf.height).toBe(500);
    });

    it("default test case11", function()
    {
        let tf = new TextField();
        tf.height = -1;
        expect(tf.height).toBe(100);
    });

    it("default test case12", function()
    {
        let tf = new TextField();
        tf.height = -500;
        expect(tf.height).toBe(100);
    });

    it("default test case13", function()
    {
        let tf = new TextField();
        tf.height = -50000000000000000;
        expect(tf.height).toBe(100);
    });

    it("default test case14", function()
    {
        let tf = new TextField();
        tf.height = { "a":0 };
        expect(tf.height).toBe(100);
    });

    it("default test case15", function()
    {
        let tf = new TextField();
        tf.height = function a() {};
        expect(tf.height).toBe(100);
    });

    it("default test case16", function()
    {
        let tf = new TextField();
        tf.height = [1];
        expect(tf.height).toBe(1);
    });

    it("default test case17", function()
    {
        let tf = new TextField();
        tf.height = [1,2];
        expect(tf.height).toBe(100);
    });

    it("default test case18", function()
    {
        let tf = new TextField();
        tf.height = {};
        expect(tf.height).toBe(100);
    });

    it("default test case19", function()
    {
        let tf = new TextField();
        tf.height = { "toString":function () { return 1 } };
        expect(tf.height).toBe(1);
    });

    it("default test case20", function()
    {
        let tf = new TextField();
        tf.height = { "toString":function () { return "10" } };
        expect(tf.height).toBe(10);
    });

    it("default test case21", function()
    {
        let tf = new TextField();
        tf.height = { "toString":function () { return "1a" } };
        expect(tf.height).toBe(100);
    });

});

describe("TextField.js x test", function()
{

    it("default test case1", function()
    {
        let tf = new TextField();
        expect(tf.x).toBe(0);
    });

    it("default test case2", function()
    {
        let tf = new TextField();
        tf.x = null;
        expect(tf.x).toBe(0);
    });

    it("default test case3", function()
    {
        let tf = new TextField();
        tf.x = undefined;
        expect(tf.x).toBe(0);
    });

    it("default test case4", function()
    {
        let tf = new TextField();
        tf.x = true;
        expect(tf.x).toBe(1);
    });

    it("default test case5", function()
    {
        let tf = new TextField();
        tf.x = "";
        expect(tf.x).toBe(0);
    });

    it("default test case6", function()
    {
        let tf = new TextField();
        tf.x = "abc";
        expect(tf.x).toBe(0);
    });

    it("default test case7", function()
    {
        let tf = new TextField();
        tf.x = 0;
        expect(tf.x).toBe(0);
    });

    it("default test case8", function()
    {
        let tf = new TextField();
        tf.x = 1;
        expect(tf.x).toBe(1);
    });

    it("default test case9", function()
    {
        let tf = new TextField();
        tf.x = 500;
        expect(tf.x).toBe(500);
    });

    it("default test case11", function()
    {
        let tf = new TextField();
        tf.x = -1;
        expect(tf.x).toBe(-1);
    });

    it("default test case12", function()
    {
        let tf = new TextField();
        tf.x = -500;
        expect(tf.x).toBe(-500);
    });

    it("default test case14", function()
    {
        let tf = new TextField();
        tf.x = { "a":0 };
        expect(tf.x).toBe(0);
    });

    it("default test case15", function()
    {
        let tf = new TextField();
        tf.x = function a() {};
        expect(tf.x).toBe(0);
    });

    it("default test case16", function()
    {
        let tf = new TextField();
        tf.x = [1];
        expect(tf.x).toBe(1);
    });

    it("default test case17", function()
    {
        let tf = new TextField();
        tf.x = [1,2];
        expect(tf.x).toBe(0);
    });

    it("default test case18", function()
    {
        let tf = new TextField();
        tf.x = {};
        expect(tf.x).toBe(0);
    });

    it("default test case19", function()
    {
        let tf = new TextField();
        tf.x = { "toString":function () { return 1 } };
        expect(tf.x).toBe(1);
    });

    it("default test case20", function()
    {
        let tf = new TextField();
        tf.x = { "toString":function () { return "10" } };
        expect(tf.x).toBe(10);
    });

    it("default test case21", function()
    {
        let tf = new TextField();
        tf.x = { "toString":function () { return "1a" } };
        expect(tf.x).toBe(0);
    });

});

describe("TextField.js y test", function()
{

    it("default test case1", function()
    {
        let tf = new TextField();
        expect(tf.y).toBe(0);
    });

    it("default test case2", function()
    {
        let tf = new TextField();
        tf.y = null;
        expect(tf.y).toBe(0);
    });

    it("default test case3", function()
    {
        let tf = new TextField();
        tf.y = undefined;
        expect(tf.y).toBe(0);
    });

    it("default test case4", function()
    {
        let tf = new TextField();
        tf.y = true;
        expect(tf.y).toBe(1);
    });

    it("default test case5", function()
    {
        let tf = new TextField();
        tf.y = "";
        expect(tf.y).toBe(0);
    });

    it("default test case6", function()
    {
        let tf = new TextField();
        tf.y = "abc";
        expect(tf.y).toBe(0);
    });

    it("default test case7", function()
    {
        let tf = new TextField();
        tf.y = 0;
        expect(tf.y).toBe(0);
    });

    it("default test case8", function()
    {
        let tf = new TextField();
        tf.y = 1;
        expect(tf.y).toBe(1);
    });

    it("default test case9", function()
    {
        let tf = new TextField();
        tf.y = 500;
        expect(tf.y).toBe(500);
    });

    it("default test case11", function()
    {
        let tf = new TextField();
        tf.y = -1;
        expect(tf.y).toBe(-1);
    });

    it("default test case12", function()
    {
        let tf = new TextField();
        tf.y = -500;
        expect(tf.y).toBe(-500);
    });

    it("default test case14", function()
    {
        let tf = new TextField();
        tf.y = { "a":0 };
        expect(tf.y).toBe(0);
    });

    it("default test case15", function()
    {
        let tf = new TextField();
        tf.y = function a() {};
        expect(tf.y).toBe(0);
    });

    it("default test case16", function()
    {
        let tf = new TextField();
        tf.y = [1];
        expect(tf.y).toBe(1);
    });

    it("default test case17", function()
    {
        let tf = new TextField();
        tf.y = [1,2];
        expect(tf.y).toBe(0);
    });

    it("default test case18", function()
    {
        let tf = new TextField();
        tf.y = {};
        expect(tf.y).toBe(0);
    });

    it("default test case19", function()
    {
        let tf = new TextField();
        tf.y = { "toString":function () { return 1 } };
        expect(tf.y).toBe(1);
    });

    it("default test case20", function()
    {
        let tf = new TextField();
        tf.y = { "toString":function () { return "10" } };
        expect(tf.y).toBe(10);
    });

    it("default test case21", function()
    {
        let tf = new TextField();
        tf.y = { "toString":function () { return "1a" } };
        expect(tf.y).toBe(0);
    });

});

describe("TextField.js scroll test", function()
{

    it("maxScrollV test success case1", function ()
    {
        let tf = new TextField();
        tf.width = 100;
        tf.height = 20;
        tf.multiline = true;
        tf.wordWrap = true;
        tf.text = "テキストテキストテキストテキスト";

        expect(tf.maxScrollV).toBe(2);
    });

    it("maxScrollV test success case2", function ()
    {
        let tf = new TextField();

        tf.width = 100;
        tf.height = 20;
        tf.autoSize = TextFieldAutoSize.NONE;
        tf.type = TextFieldType.INPUT;
        tf.text = "\n";

        expect(tf.maxScrollV).toBe(1);
    });

    it("maxScrollV test success case3", function ()
    {
        let tf = new TextField();

        tf.width = 100;
        tf.height = 20;
        tf.autoSize = TextFieldAutoSize.NONE;
        tf.type = TextFieldType.INPUT;
        tf.multiline = true;
        tf.text = "\n";

        expect(tf.maxScrollV).toBe(2);
    });

    it("maxScrollV test success case4", function ()
    {
        let tf = new TextField();

        tf.width = 100;
        tf.height = 20;
        tf.autoSize = TextFieldAutoSize.LEFT;
        tf.type = TextFieldType.INPUT;
        tf.text = "\n";

        expect(tf.maxScrollV).toBe(1);
    });

    it("maxScrollV test success case6", function ()
    {
        let tf = new TextField();

        tf.width = 100;
        tf.height = 20;
        tf.autoSize = TextFieldAutoSize.LEFT;
        tf.type = TextFieldType.INPUT;
        tf.text = "\n";

        tf.height;

        expect(tf.maxScrollV).toBe(1);
    });

});

describe("TextField.js htmlText test", function()
{

    it("CR and LF test success case1", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<p>aaa\nbbb</p>";

        expect(tf.numLines).toBe(3);
    });

    it("CR and LF test success case2", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<p>aaa\rbbb</p>";

        expect(tf.numLines).toBe(3);
    });

    it("CR and LF test success case3", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<p>aaa\r\nbbb</p>";

        expect(tf.numLines).toBe(4);
    });

    it("CR and LF test success case4", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<p>aaa\n\rbbb</p>";

        expect(tf.numLines).toBe(4);
    });

    it("numLines test success case1", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<p></p>";

        expect(tf.numLines).toBe(2);
    });

    it("numLines test success case2", function ()
    {
        let tf = new TextField();
        tf.multiline = false;
        tf.htmlText = "<p></p>";

        expect(tf.numLines).toBe(1);
    });

    it("numLines test success case3", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<p></p><p></p>";

        expect(tf.numLines).toBe(3);
    });

    it("numLines test success case4", function ()
    {
        let tf = new TextField();
        tf.multiline = false;
        tf.htmlText = "<p></p><p></p>";

        expect(tf.numLines).toBe(1);
    });

    it("numLines test success case5", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<p>aaa<br />bbb</p>";

        expect(tf.numLines).toBe(3);
    });

    it("numLines test success case6", function ()
    {
        let tf = new TextField();
        tf.multiline = false;
        tf.htmlText = "<p>aaa<br />bbb</p>";

        expect(tf.numLines).toBe(1);
    });

    it("numLines test success case7", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<p>aaa\n</p>";

        expect(tf.numLines).toBe(3);
    });

    it("numLines test success case8", function ()
    {
        let tf = new TextField();
        tf.multiline = false;
        tf.htmlText = "<p>aaa\n</p>";

        expect(tf.numLines).toBe(1);
    });

    it("numLines test success case9", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<span></span>";

        expect(tf.numLines).toBe(1);
    });

    it("numLines test success case10", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<span><p></p></span>";

        expect(tf.numLines).toBe(2);
    });

    it("_$parseTag test success case1", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<p>a</p>";

        expect(tf.numLines).toBe(2);
        expect(tf.getLineText(0)).toBe("a");
        expect(tf.getLineText(1)).toBe("");
    });

    it("_$parseTag test success case2", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<p><font>a</font></p>";

        expect(tf.numLines).toBe(2);
        expect(tf.getLineText(0)).toBe("a");
    });

    it("_$parseTag test success case3", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<textformat><p><font>a</font></p></textformat>";

        expect(tf.numLines).toBe(2);
        expect(tf.getLineText(0)).toBe("a");
    });

    it("_$parseTag test success case4", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<p><textformat><font>a</font></textformat></p>";

        expect(tf.numLines).toBe(2);
        expect(tf.getLineText(0)).toBe("a");
    });

    it("_$parseTag test success case5", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<textformat><font><p>a</p></font></textformat>";

        expect(tf.numLines).toBe(2);
        expect(tf.getLineText(0)).toBe("a");
    });

    it("_$parseTag test success case6", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<textformat><font><p>a</p></font></textformat>b";

        expect(tf.numLines).toBe(2);
        expect(tf.getLineText(0)).toBe("a");
        expect(tf.getLineText(1)).toBe("b");
    });

    it("_$parseTag test success case7", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<textformat><font><p>a</p></font></textformat><p>b</p>";

        expect(tf.numLines).toBe(3);
        expect(tf.getLineText(0)).toBe("a");
        expect(tf.getLineText(1)).toBe("b");
        expect(tf.getLineText(2)).toBe("");
    });

    it("_$parseTag test success case8", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<textformat><font><p>a</p></font></textformat>b<p>c</p>";

        expect(tf.numLines).toBe(3);
        expect(tf.getLineText(0)).toBe("a");
        expect(tf.getLineText(1)).toBe("bc");
    });

    it("_$parseTag test success case9", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "abc";

        expect(tf.numLines).toBe(1);
        expect(tf.getLineText(0)).toBe("abc");
    });

    it("_$parseTag test success case10", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<span>a</span>\r\n<p>b</p>";

        expect(tf.numLines).toBe(4);
        expect(tf.getLineText(0)).toBe("a");
        expect(tf.getLineText(2)).toBe("b");
    });

    it("_$parseTag test success case11", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "a\r\n<p>b</p>";

        expect(tf.numLines).toBe(4);
        expect(tf.getLineText(0)).toBe("a");
        expect(tf.getLineText(2)).toBe("b");
    });

    it("_$parseTag test success case12", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "a<p>b</p>c";

        expect(tf.numLines).toBe(2);
        expect(tf.getLineText(0)).toBe("ab");
        expect(tf.getLineText(1)).toBe("c");
    });

    it("_$parseTag test success case13", function ()
    {
        let tf = new TextField();
        tf.multiline = true;
        tf.htmlText = "<p></p><p>a</p>";

        expect(tf.numLines).toBe(3);
        expect(tf.textHeight).toBe(38);
        expect(tf.getLineText(1)).toBe("a");
    });

    it("_$parseTag test success case14", function ()
    {
        let tf = new TextField();
        tf.multiline = false;
        tf.htmlText = "<p>a</p><p>b</p>";

        expect(tf.numLines).toBe(1);
        expect(Math.round(tf.textHeight)).toBe(14);
        expect(tf.getLineText(0)).toBe("ab");
    });

    it("_$parseTag test success case15", function ()
    {
        let tf = new TextField();
        tf.width = 40;
        tf.wordWrap = true;
        tf.htmlText = "<p>aaaaaaaaa</p>";

        expect(tf.numLines).toBe(2);
    });

    it("_$parseTag test success case16", function ()
    {
        let tf = new TextField();
        tf.width = 40;
        tf.wordWrap = true;
        tf.htmlText = "<p>aaaaaaaaa</p>bbbbbbbbbbbb<p></p>";

        expect(tf.numLines).toBe(4);
    });

    it("_$parseTag test success case17", function ()
    {
        let tf = new TextField();
        tf.width = 40;
        tf.wordWrap = true;
        tf.multiline = true;
        tf.htmlText = "<p>aaaaaaaaa</p>bbbbbbbbbbb<br />bbbbbb<p></p>";

        expect(tf.numLines).toBe(6);
    });

    it("_$parseTag test success case18", function ()
    {
        let tf = new TextField();
        tf.htmlText = "<test>a</test>";

        expect(tf.numLines).toBe(1);
        expect(tf.getLineText(0)).toBe("a");
    });

    it("_$parseTag test success case19", function ()
    {
        let tf = new TextField();
        tf.htmlText = "< test>a</test>b";

        expect(tf.text).toBe("");
    });

    it("_$parseTag test success case20", function ()
    {
        let tf = new TextField();
        tf.htmlText = "<>a";

        expect(tf.text).toBe("");
    });

    it("_$parseTag test success case21", function ()
    {
        let tf = new TextField();
        tf.htmlText = "あいうえお、< br/>b";

        expect(tf.text).toBe("あいうえお、");
    });

});
