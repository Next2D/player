//
//
// describe("TextField.js", function()
// {
//     beforeAll(function ()
//     {
//         // reset
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//     });
//
//     afterAll(function ()
//     {
//         // reset
//         Util.$stages  = [];
//         Util.$players = [];
//     });
//
//     describe("TextField.js getQualifiedClassName test", function()
//     {
//
//         it("getQualifiedClassName test public", function()
//         {
//             var swf2js = new Swf2js();
//             var str = swf2js.flash.utils.getQualifiedClassName(new TextField());
//             expect(str).toBe("flash.text::TextField");
//         });
//
//         it("getQualifiedClassName test static", function()
//         {
//             var swf2js = new Swf2js();
//             var str = swf2js.flash.utils.getQualifiedClassName(TextField);
//             expect(str).toBe("flash.text::TextField");
//         });
//
//     });
//
//
//     describe("TextField.js toString test", function()
//     {
//         it("toString test success", function()
//         {
//             var filter = new TextField();
//             expect(filter.toString()).toBe("[object TextField]");
//         });
//
//     });
//
//     describe("TextField.js static toString test", function()
//     {
//
//         it("static toString test", function()
//         {
//             expect(Util.$toString(TextField)).toBe("[class TextField]");
//         });
//
//     });
//
//     describe("TextField.js autoSize test", function()
//     {
//
//         it("autoSize test1", function()
//         {
//             var tf = new TextField();
//             expect(tf.x|0).toBe(0);
//
//             tf.autoSize = TextFieldAutoSize.CENTER;
//             expect(tf.x|0).toBe(48);
//             expect(tf.width|0).toBe(4);
//
//             tf.defaultTextFormat = new TextFormat("_sans", 12);
//             expect(tf.x|0).toBe(48);
//             expect(tf.width|0).toBe(4);
//
//             tf.text = "abcdefg";
//
//             expect(tf.x|0).toBe(26);
//             expect(tf.y).toBe(0);
//         });
//
//
//         it("autoSize test2", function()
//         {
//             var tf = new TextField();
//             expect(tf.x|0).toBe(0);
//
//             tf.autoSize = TextFieldAutoSize.CENTER;
//             expect(tf.x|0).toBe(48);
//             expect(tf.width|0).toBe(4);
//
//             tf.defaultTextFormat = new TextFormat("_sans", 12);
//             expect(tf.x|0).toBe(48);
//             expect(tf.width|0).toBe(4);
//
//             tf.x = -100;
//             expect(tf.x|0).toBe(-100);
//
//             tf.width = 200;
//             expect(tf.x|0).toBe(-2);
//         });
//
//     });
//
//
//     describe("TextField.js property test", function()
//     {
//
//         // default
//         it("default test success", function()
//         {
//             var tf = new TextField();
//             expect(tf.length).toBe(0);
//             expect(tf.textHeight).toBe(0);
//             expect(tf.autoSize).toBe(TextFieldAutoSize.NONE);
//             expect(tf.background).toBe(false);
//             expect(tf.backgroundColor).toBe(0xffffff);
//             expect(tf.border).toBe(false);
//             expect(tf.borderColor).toBe(0x000000);
//             expect(tf.defaultTextFormat instanceof TextFormat).toBe(true);
//             expect(tf.displayAsPassword).toBe(false);
//             expect(tf.embedFonts).toBe(false);
//             expect(tf.text).toBe("");
//             expect(tf.textColor).toBe(0x000000);
//             expect(tf.textWidth).toBe(0);
//             expect(tf.numLines).toBe(1);
//             expect(tf.wordWrap).toBe(false);
//             expect(tf.selectable).toBe(true);
//             expect(tf.multiline).toBe(false);
//             if(Util.$isMac) {
//                 expect(tf.htmlText).toBe('<P ALIGN="LEFT"><FONT FACE="Times" SIZE="12" COLOR="#000000" LETTERSPACING="0" KERNING="0"></FONT></P>');
//             } else {
//                 expect(tf.htmlText).toBe('<P ALIGN="LEFT"><FONT FACE="Times New Roman" SIZE="12" COLOR="#000000" LETTERSPACING="0" KERNING="0"></FONT></P>');
//             }
//             expect(tf.maxChars).toBe(0);
//
//         });
//
//
//         // length
//         it("length test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.text = "abcアイウエオ";
//             expect(tf.length).toBe(8);
//         });
//
//         it("length test success case2", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.text = "abc\nアイウエオ\n\n";
//             expect(tf.length).toBe(11);
//         });
//
//         it("length test success case4", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = false;
//             tf.text = "abc\r";
//             expect(tf.length).toBe(4);
//         });
//
//         it("length test success case5", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = false;
//             tf.text = "abc\r\n";
//             expect(tf.length).toBe(5);
//         });
//
//         it("length test success case5", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.text = "abc";
//             expect(tf.length).toBe(3);
//         });
//
//         it("length test success case6", function ()
//         {
//             var tf = new TextField();
//             tf.width = 30;
//             tf.height = 20;
//             tf.wordWrap = true;
//             tf.text = "123456789";
//             expect(tf.length).toBe(9);
//         });
//
//         it("length test success case7", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = false;
//             tf.htmlText = "<p>abc</p>";
//             expect(tf.length).toBe(3);
//         });
//
//         it("length test success case8", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "<p>abc</p>";
//             expect(tf.length).toBe(4);
//         });
//
//         it("length test success case9", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "<p>abc\n123</p>";
//             expect(tf.length).toBe(8);
//         });
//
//         it("length test success case10", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "<p>abc\r\n123</p>";
//             expect(tf.length).toBe(9);
//         });
//
//         it("length test success case11", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = false;
//             tf.htmlText = "<p>abc<br />123</p>";
//             expect(tf.length).toBe(6);
//         });
//
//         it("length test success case12", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "<p>abc<br />123</p>";
//             expect(tf.length).toBe(8);
//         });
//
//         it("length test success case13", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "abc";
//             expect(tf.length).toBe(3);
//         });
//
//         it("length test success case14", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "<p>a</p><p>b</p><p></p>";
//             expect(tf.length).toBe(5);
//         });
//
//         it("length test success case15", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = false;
//             tf.htmlText = "<p>a</p><p>b</p><p></p>";
//             expect(tf.length).toBe(2);
//         });
//
//
//         // autoSize
//         it("autoSize test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.autoSize = TextFieldAutoSize.CENTER;
//             expect(tf.autoSize).toBe(TextFieldAutoSize.CENTER);
//         });
//
//         it("autoSize test valid case1", function ()
//         {
//             var tf = new TextField();
//             tf.autoSize = "LEFT";
//             expect(tf.autoSize).toBe(TextFieldAutoSize.NONE);
//         });
//
//
//
//
//         // background
//         it("background test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.background = true;
//             expect(tf.background).toBe(true);
//         });
//
//         it("background test success case2", function ()
//         {
//             var tf = new TextField();
//             tf.background = 1;
//             expect(tf.background).toBe(true);
//         });
//
//         it("background test success case3", function ()
//         {
//             var tf = new TextField();
//             tf.background = "";
//             expect(tf.background).toBe(false);
//             tf.background = "abc";
//             expect(tf.background).toBe(true);
//         });
//
//
//         // backgroundColor
//         it("backgroundColor test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = 0xff0000;
//             expect(tf.backgroundColor).toBe(0xff0000);
//         });
//
//         it("backgroundColor test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = "abc";
//             expect(tf.backgroundColor).toBe(0x000000);
//         });
//
//
//         // border
//         it("border test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.border = true;
//             expect(tf.border).toBe(true);
//         });
//
//         it("border test success case2", function ()
//         {
//             var tf = new TextField();
//             tf.border = 1;
//             expect(tf.border).toBe(true);
//         });
//
//         it("border test success case3", function ()
//         {
//             var tf = new TextField();
//             tf.border = "";
//             expect(tf.border).toBe(false);
//             tf.border = "abc";
//             expect(tf.border).toBe(true);
//         });
//
//
//         // borderColor
//         it("borderColor test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.borderColor = 0xff0000;
//             expect(tf.borderColor).toBe(0xff0000);
//         });
//
//         it("borderColor test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.borderColor = "abc";
//             expect(tf.borderColor).toBe(0x000000);
//         });
//
//
//         // defaultTextFormat
//         it("defaultTextFormat test success case1", function ()
//         {
//             var tf = new TextField();
//             expect(tf.defaultTextFormat.size).toBe(12);
//
//             var format  = new TextFormat();
//             format.size = 100;
//
//             tf.defaultTextFormat = format;
//             expect(tf.defaultTextFormat.size).toBe(100);
//         });
//
//
//         it("defaultTextFormat test valid case1", function ()
//         {
//             var tf = new TextField();
//
//             var obj = {};
//             obj.size = 100;
//             tf.defaultTextFormat = obj;
//
//             expect(tf.defaultTextFormat.size).toBe(12);
//         });
//
//
//         // displayAsPassword
//         it("displayAsPassword test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = true;
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//         it("displayAsPassword test success case2", function ()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = 1;
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//         it("displayAsPassword test success case3", function ()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = "";
//             expect(tf.displayAsPassword).toBe(false);
//             tf.displayAsPassword = "abc";
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//
//         // embedFonts
//         it("embedFonts test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.embedFonts = true;
//             expect(tf.embedFonts).toBe(true);
//         });
//
//         it("embedFonts test success case2", function ()
//         {
//             var tf = new TextField();
//             tf.embedFonts = 1;
//             expect(tf.embedFonts).toBe(true);
//         });
//
//         it("embedFonts test success case3", function ()
//         {
//             var tf = new TextField();
//             tf.embedFonts = "";
//             expect(tf.embedFonts).toBe(false);
//             tf.embedFonts = "abc";
//             expect(tf.embedFonts).toBe(true);
//         });
//
//
//         // text
//         it("text test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.text = 0;
//             expect(tf.text).toBe("0");
//         });
//
//
//         // htmlText
//         it("htmlText test success case1", function ()
//         {
//             const isMac = Util.$isMac;
//             Util.$isMac = true;
//
//             var tf = new TextField();
//             tf.htmlText = 0;
//
//             expect(tf.htmlText).toBe("<P ALIGN=\"LEFT\"><FONT LETTERSPACING=\"0\" KERNING=\"0\" SIZE=\"12\" FACE=\"Times\" COLOR=\"#000000\">0</FONT></P>");
//
//             Util.$isMac = isMac;
//         });
//
//         it("htmlText test success case2", function ()
//         {
//             const isMac = Util.$isMac;
//             Util.$isMac = false;
//
//             var tf = new TextField();
//             tf.htmlText = 0;
//
//             expect(tf.htmlText).toBe("<P ALIGN=\"LEFT\"><FONT LETTERSPACING=\"0\" KERNING=\"0\" SIZE=\"12\" FACE=\"Times New Roman\" COLOR=\"#000000\">0</FONT></P>");
//
//             Util.$isMac = isMac;
//         });
//
//         // textColor
//         it("textColor test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.textColor = 0xff0000;
//             expect(tf.textColor).toBe(0xff0000);
//         });
//
//         it("textColor test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.textColor = "abc";
//             expect(tf.textColor).toBe(0x000000);
//         });
//
//
//         // textWidth
//         it("textWidth test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.text = "aaa";
//             expect(Math.round(tf.textWidth)).toBe(16);
//         });
//
//         it("textWidth test success case2", function ()
//         {
//             var tf = new TextField();
//
//             var textFormat = tf.defaultTextFormat;
//             textFormat.size = 20;
//             tf.defaultTextFormat = textFormat;
//
//             tf.text = "aaa";
//             expect(Math.ceil(tf.textWidth)).toBe(27);
//         });
//
//         it("textWidth test success case3", function ()
//         {
//             var tf = new TextField();
//             tf.wordWrap = true;
//
//             var textFormat = tf.defaultTextFormat;
//             textFormat.size = 30;
//             tf.defaultTextFormat = textFormat;
//
//             tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";
//             expect(Math.ceil(tf.textWidth)).toBe(94);
//         });
//
//         it("textWidth test success case4", function ()
//         {
//             var tf = new TextField();
//             tf.autoSize = TextFieldAutoSize.LEFT;
//
//             var textFormat = tf.defaultTextFormat;
//             textFormat.size = 30;
//             tf.defaultTextFormat = textFormat;
//
//             tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";
//             expect(Math.ceil(tf.textWidth)).toBe(280);
//         });
//
//         it("textWidth test success case5", function ()
//         {
//             var tf = new TextField();
//             tf.autoSize = TextFieldAutoSize.LEFT;
//
//             var textFormat = tf.defaultTextFormat;
//             textFormat.size = 30;
//             tf.defaultTextFormat = textFormat;
//
//             tf.width = 40;
//             tf.wordWrap = true;
//             tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";
//             expect(Math.ceil(tf.textWidth)).toBe(30);
//         });
//
//         it("textWidth test success case6", function ()
//         {
//             var tf = new TextField();
//             tf.autoSize = TextFieldAutoSize.LEFT;
//
//             var textFormat = tf.defaultTextFormat;
//             textFormat.size = 30;
//             tf.defaultTextFormat = textFormat;
//
//             tf.wordWrap = true;
//             tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";
//
//             expect(Math.ceil(tf.textWidth)).toBe(94);
//         });
//
//         it("textWidth test success case7", function ()
//         {
//             var tf = new TextField();
//             tf.autoSize = TextFieldAutoSize.LEFT;
//
//             var textFormat = tf.defaultTextFormat;
//             textFormat.size = 30;
//             textFormat.italic = true;
//             tf.defaultTextFormat = textFormat;
//
//             tf.wordWrap = true;
//             tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";
//             expect(Math.ceil(tf.textWidth)).toBe(90);
//         });
//
//
//         // textHeight
//         it("textHeight test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.text = "aaa";
//             expect(Math.round(tf.textHeight)).toBe(14);
//         });
//
//         it("textHeight test success case2", function ()
//         {
//             var tf = new TextField();
//             var f = new TextFormat();
//             f.size = 20;
//             tf.defaultTextFormat = f;
//             tf.text = "aaa";
//             expect(Math.round(tf.textHeight)).toBe(22);
//         });
//
//         it("textHeight test success case3", function ()
//         {
//             var tf = new TextField();
//             var f = new TextFormat();
//             f.size = 30;
//             tf.wordWrap = true;
//             tf.defaultTextFormat = f;
//             tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";
//             expect(Math.round(tf.textHeight)).toBe(157); // Flash is 150
//         });
//
//         it("textHeight test success case4", function ()
//         {
//             var tf = new TextField();
//             tf.autoSize = TextFieldAutoSize.LEFT;
//             // tf.defaultTextFormat.size = 30; // tf.defaultTextForamtのgetterが参照渡しでないため、設定できていない。
//             let f = tf.defaultTextFormat;
//             f.size = 30;
//             tf.defaultTextFormat = f;
//             tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";
//             expect(tf.textHeight >= 90 && tf.textHeight < 96).toBe(true);
//         });
//
//         it("textHeight test success case5", function ()
//         {
//             var tf = new TextField();
//             tf.autoSize = TextFieldAutoSize.LEFT;
//             // tf.defaultTextFormat.size = 30;
//             let f = tf.defaultTextFormat;
//             f.size = 30;
//             tf.defaultTextFormat = f;
//             tf.width = 40;
//             tf.wordWrap = true;
//             tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";
//             // Chrome,FireFox,Safari
//             expect(tf.textHeight >= 450 && tf.textHeight < 480).toBe(true);
//         });
//
//         it("textHeight test success case6", function ()
//         {
//             var tf = new TextField();
//             tf.autoSize = TextFieldAutoSize.LEFT;
//             // tf.defaultTextFormat.size = 30;
//             let f = tf.defaultTextFormat;
//             f.size = 30;
//             tf.defaultTextFormat = f;
//             tf.wordWrap = true;
//             tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";
//             // Chrome,FireFox,Safari
//             expect(tf.textHeight >= 150 && tf.textHeight < 160).toBe(true);
//         });
//
//         it("textHeight test success case7", function ()
//         {
//             var tf = new TextField();
//             tf.autoSize = TextFieldAutoSize.LEFT;
//             // tf.defaultTextFormat.size = 30;
//             let f = tf.defaultTextFormat;
//             f.size = 30;
//             tf.defaultTextFormat = f;
//             tf.defaultTextFormat.italic = true;
//             tf.wordWrap = true;
//             tf.text = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";
//             // Chrome,FireFox,Safari
//             expect(tf.textHeight >= 150 && tf.textHeight < 160).toBe(true);
//         });
//
//         it("textHeight test success case8", function ()
//         {
//             var tf = new TextField();
//             tf.autoSize = TextFieldAutoSize.LEFT;
//             tf.type = TextFieldType.DYNAMIC;
//             let f = tf.defaultTextFormat;
//             f.size = 50;
//             f.leading = 8;
//             tf.defaultTextFormat = f;
//             tf.text = "\n";
//             // Chrome,FireFox,Safari
//             expect(Math.round(tf.textHeight)).toBe(60);
//             tf.type = TextFieldType.INPUT;
//             expect(Math.round(tf.textHeight)).toBe(110);
//         });
//
//         it("textHeight test success case8-2", function ()
//         {
//             var tf = new TextField();
//             tf.autoSize = TextFieldAutoSize.LEFT;
//             tf.type = TextFieldType.DYNAMIC;
//             let f = tf.defaultTextFormat;
//             f.size = 50;
//             f.leading = 8;
//             tf.defaultTextFormat = f;
//             tf.text = "\na";
//             // Chrome,FireFox,Safari
//             expect(Math.round(tf.textHeight)).toBe(110); // Flash is 108
//         });
//
//         it("textHeight test success case9", function ()
//         {
//             var tf = new TextField();
//             tf.autoSize = TextFieldAutoSize.LEFT;
//             tf.type = TextFieldType.INPUT;
//             let f = tf.defaultTextFormat;
//             f.size = 50;
//             f.leading = 8;
//             tf.defaultTextFormat = f;
//             tf.text = "\n";
//             // Chrome,FireFox,Safari
//             expect(Math.round(tf.textHeight)).toBe(110); // Flash is 108
//         });
//
//         it("textHeight test success case10", function ()
//         {
//             var tf = new TextField();
//             let f = tf.defaultTextFormat;
//             f.size = 50;
//             f.leading = 8;
//             tf.defaultTextFormat = f;
//             tf.autoSize = TextFieldAutoSize.LEFT;
//             tf.type = TextFieldType.DYNAMIC;
//             // Chrome,FireFox,Safari
//             expect(tf.textHeight).toBe(0);
//         });
//
//         it("textHeight test success case11", function ()
//         {
//             var tf = new TextField();
//             let f = tf.defaultTextFormat;
//             f.size = 50;
//             f.leading = 8;
//             tf.defaultTextFormat = f;
//             tf.type = TextFieldType.INPUT;
//             // Chrome,FireFox,Safari
//             expect(Math.round(tf.textHeight)).toBe(12);
//         });
//
//         // TODO 要修正
//         // it("textHeight test success case12", function ()
//         // {
//         //     var tf = new TextField();
//         //     let f = tf.defaultTextFormat;
//         //     f.size = 50;
//         //     f.leading = 8;
//         //     tf.defaultTextFormat = f;
//         //     tf.autoSize = TextFieldAutoSize.LEFT;
//         //     tf.type = TextFieldType.INPUT;
//         //     // Chrome,FireFox,Safari
//         //     expect(Math.round(tf.textHeight)).toBe(58);
//         // });
//
//         it("textHeight test success case13", function ()
//         {
//             var tf = new TextField();
//             tf.type = TextFieldType.DYNAMIC;
//             tf.htmlText = "<p></p>";
//
//             expect(tf.textHeight).toBe(0);
//         });
//
//         it("textHeight test success case14", function ()
//         {
//             var tf = new TextField();
//             tf.type = TextFieldType.INPUT;
//             tf.htmlText = "<p></p>";
//
//             expect(Math.round(tf.textHeight)).toBe(12);
//         });
//
//         it("textHeight test success case14", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.type = TextFieldType.INPUT;
//             tf.htmlText = "<br /><p></p>";
//
//             expect(tf.numLines).toBe(3);
//             expect(Math.round(tf.textHeight)).toBe(39);
//         });
//
//         // numLines
//         it("numLines test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.text = "aaa";
//             expect(Math.round(tf.numLines)).toBe(1);
//         });
//
//         it("numLines test success case2", function ()
//         {
//             var tf = new TextField();
//             tf.text = "aaa\n\nbbb\n\nccc";
//             expect(Math.round(tf.numLines)).toBe(5);
//         });
//
//         it("numLines test success case3", function ()
//         {
//             var tf = new TextField();
//             tf.wordWrap = true;
//
//             var textFormat = tf.defaultTextFormat;
//             textFormat.size = 30;
//             tf.defaultTextFormat = textFormat;
//
//             tf.text     = "aaaaaaaaaaaaaaaaaaaaa\nbbb\nccc";
//             expect(Math.round(tf.numLines)).toBe(5);
//         });
//
//
//         // wordWrap
//         it("wordWrap test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.wordWrap = true;
//             expect(tf.wordWrap).toBe(true);
//         });
//
//         it("wordWrap test success case2", function ()
//         {
//             var tf = new TextField();
//             tf.wordWrap = 1;
//             expect(tf.wordWrap).toBe(true);
//         });
//
//         it("wordWrap test success case3", function ()
//         {
//             var tf = new TextField();
//             tf.wordWrap = "";
//             expect(tf.wordWrap).toBe(false);
//             tf.wordWrap = "abc";
//             expect(tf.wordWrap).toBe(true);
//         });
//
//         // TODO pipelineで通過できないので後日調査
//         // it("wordWrap test success case4", function ()
//         // {
//         //     var tf = new TextField();
//         //     tf.width = 100;
//         //     tf.text = "テキストテキスト、テキストテキスト"
//         //     tf.wordWrap = true;
//         //
//         //     expect(tf.getLineText(0)).toBe("テキストテキス\r");
//         //     expect(tf.getLineText(1)).toBe("ト、テキストテキ\r");
//         //     expect(tf.getLineText(2)).toBe("スト");
//         //     expect(tf.getLineText(3)).toBe(undefined);
//         // });
//         //
//         // it("wordWrap test success case5", function ()
//         // {
//         //     var tf = new TextField();
//         //     tf.width = 104;
//         //     tf.htmlText = "<font size=\"20\">テキストテ。テキスト</font>"
//         //     tf.wordWrap = true;
//         //
//         //     expect(tf.getLineText(0)).toBe("テキスト\r");
//         //     expect(tf.getLineText(1)).toBe("テ。テキス\r");
//         //     expect(tf.getLineText(2)).toBe("ト");
//         //     expect(tf.getLineText(3)).toBe(undefined);
//         // });
//
//         it("wordWrap test success case6", function ()
//         {
//             var tf = new TextField();
//
//             var textFormat = tf.defaultTextFormat;
//             textFormat.size = 16;
//             textFormat.font = "_sans";
//             tf.defaultTextFormat = textFormat;
//
//             tf.width    = 117.95;
//             tf.height   = 28.55;
//             tf.text     = "2020/9/14 12:00";
//             tf.wordWrap = true;
//
//             expect(tf.getLineText(0)).toBe("2020/9/14 \r");
//             expect(tf.getLineText(1)).toBe("12:00");
//         });
//
//         // selectable
//         it("selectable test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.selectable = true;
//             expect(tf.selectable).toBe(true);
//         });
//
//         it("selectable test success case2", function ()
//         {
//             var tf = new TextField();
//             tf.selectable = 1;
//             expect(tf.selectable).toBe(true);
//         });
//
//         it("selectable test success case3", function ()
//         {
//             var tf = new TextField();
//             tf.selectable = "";
//             expect(tf.selectable).toBe(false);
//             tf.selectable = "abc";
//             expect(tf.selectable).toBe(true);
//         });
//
//
//         // multiline
//         it("multiline test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             expect(tf.multiline).toBe(true);
//         });
//
//         it("multiline test success case2", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = 1;
//             expect(tf.multiline).toBe(true);
//         });
//
//         it("multiline test success case3", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = "";
//             expect(tf.multiline).toBe(false);
//             tf.multiline = "abc";
//             expect(tf.multiline).toBe(true);
//         });
//
//
//         // maxChars
//         it("maxChars test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.maxChars = 1;
//             expect(tf.maxChars).toBe(1);
//         });
//
//         it("maxChars test success case2", function ()
//         {
//             var tf = new TextField();
//             tf.maxChars = "10";
//             expect(tf.maxChars).toBe(10);
//         });
//
//         it("maxChars test valid case1", function ()
//         {
//             var tf = new TextField();
//             tf.maxChars = -10;
//             expect(tf.maxChars).toBe(-10);
//         });
//
//         // height
//         it("height test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.height = 20;
//             tf.width = 100;
//             tf.autoSize = TextFieldAutoSize.NONE;
//             tf.type = TextFieldType.DYNAMIC;
//             tf.text = "\n";
//
//             expect(tf.height).toBe(20);
//         });
//
//         it("height test success case2", function ()
//         {
//             var tf = new TextField();
//             tf.height = 20;
//             tf.width = 100;
//             tf.autoSize = TextFieldAutoSize.NONE;
//             tf.type = TextFieldType.INPUT;
//             tf.text = "\n";
//
//             expect(tf.height).toBe(20);
//         });
//
//         it("height test success case3", function ()
//         {
//             var tf = new TextField();
//             tf.height = 20;
//             tf.width = 100;
//             tf.autoSize = TextFieldAutoSize.LEFT;
//             tf.type = TextFieldType.DYNAMIC;
//             tf.text = "\n";
//
//             expect(Math.round(tf.height)).toBe(18);
//         });
//
//         it("height test success case4", function ()
//         {
//             var tf = new TextField();
//             tf.height = 20;
//             tf.width = 100;
//             tf.autoSize = TextFieldAutoSize.LEFT;
//             tf.type = TextFieldType.INPUT;
//             tf.text = "\n";
//
//             expect(Math.round(tf.height)).toBe(30);
//         });
//
//     });
//
//     describe("TextField.js appendText test", function()
//     {
//
//         it("appendText test success case1", function ()
//         {
//             var tf = new TextField();
//             expect(tf.text).toBe("");
//
//             tf.appendText("A");
//             tf.appendText("B");
//             tf.appendText("C");
//
//             expect(tf.text).toBe("ABC");
//         });
//
//         it("appendText test success case2", function ()
//         {
//             var tf = new TextField();
//             expect(tf.text).toBe("");
//
//             tf.appendText(1);
//             tf.appendText(2);
//             tf.appendText(3);
//
//             expect(tf.text).toBe("123");
//         });
//
//     });
//
//
//     // describe("TextField.js getCharBoundaries test", function()
//     // {
//     //
//     //     it("getCharBoundaries test success case1", function ()
//     //     {
//     //         var textField = new TextField();
//     //         var tf = new TextFormat();
//     //         tf.align = "center";
//     //         tf.italic = true;
//     //         tf.underline = true;
//     //         tf.size = 30;
//     //         textField.defaultTextFormat = tf;
//     //
//     //         textField.text = "abcdefg";
//     //
//     //         var rect = textField.getCharBoundaries(0);
//     //
//     //         expect(Math.floor(rect.x)).toBe(2);
//     //         expect(Math.floor(rect.y)).toBe(2);
//     //         expect(Math.floor(rect.width)).toBe(15);
//     //         // Chrome,FireFox,Safari
//     //         expect(Math.floor(rect.height) === 32 || Math.floor(rect.height) === 33 || Math.floor(rect.height) === 34).toBe(true);
//     //     });
//     //
//     //     it("getCharBoundaries test success case3", function ()
//     //     {
//     //         var textField = new TextField();
//     //         var tf = new TextFormat();
//     //         tf.align = "center";
//     //         tf.italic = true;
//     //         tf.underline = true;
//     //         tf.size = 30;
//     //         textField.defaultTextFormat = tf;
//     //
//     //         textField.text = "abcdefg";
//     //
//     //         var rect = textField.getCharBoundaries(2);
//     //
//     //         expect(Math.floor(rect.x)).toBe(32);
//     //         expect(Math.floor(rect.y)).toBe(2);
//     //         expect(Math.floor(rect.width)).toBe(13);
//     //         // Chrome,FireFox,Safari
//     //         expect(Math.floor(rect.height) === 32 || Math.floor(rect.height) === 33 || Math.floor(rect.height) === 34).toBe(true);
//     //     });
//     //
//     //     it("getCharBoundaries test success case4", function ()
//     //     {
//     //         var textField = new TextField();
//     //         var tf = new TextFormat();
//     //         tf.align = "center";
//     //         tf.italic = true;
//     //         tf.underline = true;
//     //         tf.size = 30;
//     //         textField.defaultTextFormat = tf;
//     //
//     //         textField.text = "abc\ndefg";
//     //
//     //         var rect = textField.getCharBoundaries(5);
//     //
//     //         expect(Math.floor(rect.x)).toBe(39);
//     //         // Chrome,FireFox,Safari
//     //         expect(Math.floor(rect.y) === 34 || Math.floor(rect.y) === 35 || Math.floor(rect.y) === 36).toBe(true);
//     //         expect(Math.floor(rect.width)).toBe(13);
//     //         // Chrome,FireFox,Safari
//     //         expect(Math.floor(rect.height) === 32 || Math.floor(rect.height) === 33 || Math.floor(rect.height) === 34).toBe(true);
//     //     });
//     //
//     //     it("getCharBoundaries test error case1", function ()
//     //     {
//     //         var textField = new TextField();
//     //         textField.text = "aaa\nccc";
//     //         var rect = textField.getCharBoundaries(500);
//     //         expect(rect).toBe(null);
//     //     });
//     //
//     //     it("getCharBoundaries test error case1", function ()
//     //     {
//     //         var textField = new TextField();
//     //         textField.text = "aaa\nccc";
//     //         var rect = textField.getCharBoundaries(3);
//     //         expect(rect).toBe(null);
//     //     });
//     //
//     // });
//
//
//     describe("TextField.js getFirstCharInParagraph test", function()
//     {
//
//         it("getFirstCharInParagraph test success case1", function () {
//             var textField = new TextField();
//             textField.text = "aaa\nccc";
//             expect(textField.getFirstCharInParagraph(1)).toBe(0);
//         });
//
//         it("getFirstCharInParagraph test success case2", function () {
//             var textField = new TextField();
//             textField.text = "aaa\nccc";
//             expect(textField.getFirstCharInParagraph(3)).toBe(0);
//         });
//
//         it("getFirstCharInParagraph test success case3", function () {
//             var textField = new TextField();
//             textField.text = "aaa\nccc";
//             expect(textField.getFirstCharInParagraph(5)).toBe(4);
//         });
//
//         it("getFirstCharInParagraph test error case1", function () {
//             var textField = new TextField();
//             textField.text = "aaa\nccc";
//             expect(textField.getFirstCharInParagraph(50)).toBe(-1);
//         });
//
//     });
//
//
//     describe("TextField.js getLineIndexOfChar test", function()
//     {
//
//         it("getLineIndexOfChar test success case1", function () {
//             var textField = new TextField();
//             textField.text = "aaa\nbbb\n\nccc";
//             expect(textField.getLineIndexOfChar(1)).toBe(0);
//         });
//
//         it("getLineIndexOfChar test success case2", function () {
//             var textField = new TextField();
//             textField.text = "aaa\nbbb\n\nccc";
//             expect(textField.getLineIndexOfChar(5)).toBe(1);
//         });
//
//         it("getLineIndexOfChar test success case3", function () {
//             var textField = new TextField();
//             textField.text = "aaa\nbbb\n\nccc";
//             expect(textField.getLineIndexOfChar(9)).toBe(3);
//         });
//
//         it("getLineIndexOfChar test error case1", function () {
//             var textField = new TextField();
//             textField.text = "aaa\nbbb\n\nccc";
//             expect(textField.getLineIndexOfChar(90)).toBe(-1);
//         });
//
//
//     });
//
//
//     describe("TextField.js getLineLength test", function()
//     {
//
//         it("getLineLength test success case1", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getLineLength(0)).toBe(6);
//         });
//
//         it("getLineLength test success case2", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getLineLength(2)).toBe(1);
//         });
//
//         it("getLineLength test success case3", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getLineLength(3)).toBe(3);
//         });
//
//         it("getLineLength test error case1", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getLineLength(10)).toBe(undefined);
//         });
//
//     });
//
//
//     describe("TextField.js getLineOffset test", function()
//     {
//
//         it("getLineOffset test success case1", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getLineOffset(0)).toBe(0);
//         });
//
//         it("getLineOffset test success case2", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getLineOffset(1)).toBe(6);
//         });
//
//         it("getLineOffset test success case3", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getLineOffset(2)).toBe(10);
//         });
//
//         it("getLineOffset test success case4", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getLineOffset(3)).toBe(11);
//         });
//
//         it("getLineOffset test error case1", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getLineOffset(4)).toBe(undefined);
//         });
//
//     });
//
//
//     describe("TextField.js getLineText test", function()
//     {
//
//         it("getLineText test success case1", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getLineText(0)).toBe("aaaaa\r");
//         });
//
//         it("getLineText test success case2", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getLineText(1)).toBe("bbb\r");
//         });
//
//         it("getLineText test success case3", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getLineText(2)).toBe("\r");
//         });
//
//         it("getLineText test success case4", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getLineText(3)).toBe("ccc");
//         });
//
//         it("getLineText test error case1", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getLineText(4)).toBe(undefined);
//         });
//
//     });
//
//
//     describe("TextField.js getParagraphLength test", function()
//     {
//
//         it("getParagraphLength test success case1", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getParagraphLength(0)).toBe(6);
//         });
//
//         it("getParagraphLength test success case2", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getParagraphLength(5)).toBe(6);
//         });
//
//         it("getParagraphLength test success case3", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getParagraphLength(8)).toBe(4);
//         });
//
//         it("getParagraphLength test success case4", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getParagraphLength(10)).toBe(1);
//         });
//
//         it("getParagraphLength test success case5", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getParagraphLength(12)).toBe(3);
//         });
//
//         it("getParagraphLength test error case1", function () {
//             var textField = new TextField();
//             textField.text = "aaaaa\nbbb\n\nccc";
//             expect(textField.getParagraphLength(100)).toBe(-1);
//         });
//
//     });
//
//
//     describe("TextField.js replaceText test", function()
//     {
//
//         it("replaceText test success case1", function () {
//             var textField = new TextField();
//             textField.text = "aaaccc";
//             textField.replaceText(0, 0, "ddd");
//             expect(textField.text).toBe("dddaaaccc");
//         });
//
//         it("replaceText test success case2", function () {
//             var textField = new TextField();
//             textField.text = "aaaccc";
//             textField.replaceText(1, 2, "ddd");
//             expect(textField.text).toBe("adddaccc");
//         });
//
//         it("replaceText test success case3", function () {
//             var textField = new TextField();
//             textField.text = "aaaccc";
//             textField.replaceText(6, 6, "ddd");
//             expect(textField.text).toBe("aaacccddd");
//         });
//
//         it("replaceText test success case4", function () {
//             var textField = new TextField();
//             textField.text = "aaaccc";
//             textField.replaceText(6, 5, "ddd");
//             expect(textField.text).toBe("aaaccc");
//         });
//
//         it("replaceText test success case5", function () {
//             var textField = new TextField();
//             textField.text = "aaaccc";
//             textField.replaceText(16, 1500, "ddd");
//             expect(textField.text).toBe("aaacccddd");
//         });
//
//         it("replaceText test success case6", function () {
//             var textField = new TextField();
//             textField.text = "aaaccc";
//             textField.replaceText(1, 0, "ddd");
//             expect(textField.text).toBe("aaaccc");
//         });
//
//     });
//
//     describe("TextField.js alwaysShowSelection test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.alwaysShowSelection).toBe(false);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = null;
//             expect(tf.alwaysShowSelection).toBe(false);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = undefined;
//             expect(tf.alwaysShowSelection).toBe(false);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = true;
//             expect(tf.alwaysShowSelection).toBe(true);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = "";
//             expect(tf.alwaysShowSelection).toBe(false);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = "abc";
//             expect(tf.alwaysShowSelection).toBe(true);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = 0;
//             expect(tf.alwaysShowSelection).toBe(false);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = 1;
//             expect(tf.alwaysShowSelection).toBe(true);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = 500;
//             expect(tf.alwaysShowSelection).toBe(true);
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = 50000000000000000;
//             expect(tf.alwaysShowSelection).toBe(true);
//         });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = -1;
//             expect(tf.alwaysShowSelection).toBe(true);
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = -500;
//             expect(tf.alwaysShowSelection).toBe(true);
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = -50000000000000000;
//             expect(tf.alwaysShowSelection).toBe(true);
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = {a:0};
//             expect(tf.alwaysShowSelection).toBe(true);
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = function a(){};
//             expect(tf.alwaysShowSelection).toBe(true);
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = [1];
//             expect(tf.alwaysShowSelection).toBe(true);
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = [1,2];
//             expect(tf.alwaysShowSelection).toBe(true);
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = {};
//             expect(tf.alwaysShowSelection).toBe(true);
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = {toString:function () { return 1; } };
//             expect(tf.alwaysShowSelection).toBe(true);
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = {toString:function () { return "10"; } };
//             expect(tf.alwaysShowSelection).toBe(true);
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = {toString:function () { return "1a"; } };
//             expect(tf.alwaysShowSelection).toBe(true);
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.alwaysShowSelection = new XML("<a>100</a>");
//             expect(tf.alwaysShowSelection).toBe(true);
//         });
//
//     });
//
//     describe("TextField.js border test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.border).toBe(false);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.border = null;
//             expect(tf.border).toBe(false);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.border = undefined;
//             expect(tf.border).toBe(false);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.border = true;
//             expect(tf.border).toBe(true);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.border = "";
//             expect(tf.border).toBe(false);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.border = "abc";
//             expect(tf.border).toBe(true);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.border = 0;
//             expect(tf.border).toBe(false);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.border = 1;
//             expect(tf.border).toBe(true);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.border = 500;
//             expect(tf.border).toBe(true);
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextField();
//             tf.border = 50000000000000000;
//             expect(tf.border).toBe(true);
//         });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.border = -1;
//             expect(tf.border).toBe(true);
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.border = -500;
//             expect(tf.border).toBe(true);
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.border = -50000000000000000;
//             expect(tf.border).toBe(true);
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.border = {a:0};
//             expect(tf.border).toBe(true);
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.border = function a(){};
//             expect(tf.border).toBe(true);
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.border = [1];
//             expect(tf.border).toBe(true);
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.border = [1,2];
//             expect(tf.border).toBe(true);
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.border = {};
//             expect(tf.border).toBe(true);
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.border = {toString:function () { return 1; } };
//             expect(tf.border).toBe(true);
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.border = {toString:function () { return "10"; } };
//             expect(tf.border).toBe(true);
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.border = {toString:function () { return "1a"; } };
//             expect(tf.border).toBe(true);
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.border = new XML("<a>100</a>");
//             expect(tf.border).toBe(true);
//         });
//
//     });
//
//     describe("TextField.js condenseWhite test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.condenseWhite).toBe(false);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = null;
//             expect(tf.condenseWhite).toBe(false);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = undefined;
//             expect(tf.condenseWhite).toBe(false);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = true;
//             expect(tf.condenseWhite).toBe(true);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = "";
//             expect(tf.condenseWhite).toBe(false);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = "abc";
//             expect(tf.condenseWhite).toBe(true);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = 0;
//             expect(tf.condenseWhite).toBe(false);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = 1;
//             expect(tf.condenseWhite).toBe(true);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = 500;
//             expect(tf.condenseWhite).toBe(true);
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = 50000000000000000;
//             expect(tf.condenseWhite).toBe(true);
//         });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = -1;
//             expect(tf.condenseWhite).toBe(true);
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = -500;
//             expect(tf.condenseWhite).toBe(true);
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = -50000000000000000;
//             expect(tf.condenseWhite).toBe(true);
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = {a:0};
//             expect(tf.condenseWhite).toBe(true);
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = function a(){};
//             expect(tf.condenseWhite).toBe(true);
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = [1];
//             expect(tf.condenseWhite).toBe(true);
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = [1,2];
//             expect(tf.condenseWhite).toBe(true);
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = {};
//             expect(tf.condenseWhite).toBe(true);
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = {toString:function () { return 1; } };
//             expect(tf.condenseWhite).toBe(true);
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = {toString:function () { return "10"; } };
//             expect(tf.condenseWhite).toBe(true);
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = {toString:function () { return "1a"; } };
//             expect(tf.condenseWhite).toBe(true);
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.condenseWhite = new XML("<a>100</a>");
//             expect(tf.condenseWhite).toBe(true);
//         });
//
//     });
//
//     describe("TextField.js displayAsPassword test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.displayAsPassword).toBe(false);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = null;
//             expect(tf.displayAsPassword).toBe(false);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = undefined;
//             expect(tf.displayAsPassword).toBe(false);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = true;
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = "";
//             expect(tf.displayAsPassword).toBe(false);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = "abc";
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = 0;
//             expect(tf.displayAsPassword).toBe(false);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = 1;
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = 500;
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = 50000000000000000;
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = -1;
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = -500;
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = -50000000000000000;
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = {a:0};
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = function a(){};
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = [1];
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = [1,2];
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = {};
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = {toString:function () { return 1; } };
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = {toString:function () { return "10"; } };
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = {toString:function () { return "1a"; } };
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.displayAsPassword = new XML("<a>100</a>");
//             expect(tf.displayAsPassword).toBe(true);
//         });
//
//     });
//
//     describe("TextField.js embedFonts test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.embedFonts).toBe(false);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = null;
//             expect(tf.embedFonts).toBe(false);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = undefined;
//             expect(tf.embedFonts).toBe(false);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = true;
//             expect(tf.embedFonts).toBe(true);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = "";
//             expect(tf.embedFonts).toBe(false);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = "abc";
//             expect(tf.embedFonts).toBe(true);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = 0;
//             expect(tf.embedFonts).toBe(false);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = 1;
//             expect(tf.embedFonts).toBe(true);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = 500;
//             expect(tf.embedFonts).toBe(true);
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = 50000000000000000;
//             expect(tf.embedFonts).toBe(true);
//         });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = -1;
//             expect(tf.embedFonts).toBe(true);
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = -500;
//             expect(tf.embedFonts).toBe(true);
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = -50000000000000000;
//             expect(tf.embedFonts).toBe(true);
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = {a:0};
//             expect(tf.embedFonts).toBe(true);
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = function a(){};
//             expect(tf.embedFonts).toBe(true);
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = [1];
//             expect(tf.embedFonts).toBe(true);
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = [1,2];
//             expect(tf.embedFonts).toBe(true);
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = {};
//             expect(tf.embedFonts).toBe(true);
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = {toString:function () { return 1; } };
//             expect(tf.embedFonts).toBe(true);
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = {toString:function () { return "10"; } };
//             expect(tf.embedFonts).toBe(true);
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = {toString:function () { return "1a"; } };
//             expect(tf.embedFonts).toBe(true);
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.embedFonts = new XML("<a>100</a>");
//             expect(tf.embedFonts).toBe(true);
//         });
//
//     });
//
//     describe("TextField.js multiline test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.multiline).toBe(false);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.multiline = null;
//             expect(tf.multiline).toBe(false);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.multiline = undefined;
//             expect(tf.multiline).toBe(false);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             expect(tf.multiline).toBe(true);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.multiline = "";
//             expect(tf.multiline).toBe(false);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.multiline = "abc";
//             expect(tf.multiline).toBe(true);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.multiline = 0;
//             expect(tf.multiline).toBe(false);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.multiline = 1;
//             expect(tf.multiline).toBe(true);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.multiline = 500;
//             expect(tf.multiline).toBe(true);
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextField();
//             tf.multiline = 50000000000000000;
//             expect(tf.multiline).toBe(true);
//         });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.multiline = -1;
//             expect(tf.multiline).toBe(true);
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.multiline = -500;
//             expect(tf.multiline).toBe(true);
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.multiline = -50000000000000000;
//             expect(tf.multiline).toBe(true);
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.multiline = {a:0};
//             expect(tf.multiline).toBe(true);
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.multiline = function a(){};
//             expect(tf.multiline).toBe(true);
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.multiline = [1];
//             expect(tf.multiline).toBe(true);
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.multiline = [1,2];
//             expect(tf.multiline).toBe(true);
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.multiline = {};
//             expect(tf.multiline).toBe(true);
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.multiline = {toString:function () { return 1; } };
//             expect(tf.multiline).toBe(true);
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.multiline = {toString:function () { return "10"; } };
//             expect(tf.multiline).toBe(true);
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.multiline = {toString:function () { return "1a"; } };
//             expect(tf.multiline).toBe(true);
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.multiline = new XML("<a>100</a>");
//             expect(tf.multiline).toBe(true);
//         });
//
//     });
//
//
//     describe("TextField.js selectable test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.selectable).toBe(true);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.selectable = null;
//             expect(tf.selectable).toBe(false);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.selectable = undefined;
//             expect(tf.selectable).toBe(false);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.selectable = true;
//             expect(tf.selectable).toBe(true);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.selectable = "";
//             expect(tf.selectable).toBe(false);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.selectable = "abc";
//             expect(tf.selectable).toBe(true);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.selectable = 0;
//             expect(tf.selectable).toBe(false);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.selectable = 1;
//             expect(tf.selectable).toBe(true);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.selectable = 500;
//             expect(tf.selectable).toBe(true);
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextField();
//             tf.selectable = 50000000000000000;
//             expect(tf.selectable).toBe(true);
//         });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.selectable = -1;
//             expect(tf.selectable).toBe(true);
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.selectable = -500;
//             expect(tf.selectable).toBe(true);
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.selectable = -50000000000000000;
//             expect(tf.selectable).toBe(true);
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.selectable = {a:0};
//             expect(tf.selectable).toBe(true);
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.selectable = function a(){};
//             expect(tf.selectable).toBe(true);
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.selectable = [1];
//             expect(tf.selectable).toBe(true);
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.selectable = [1,2];
//             expect(tf.selectable).toBe(true);
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.selectable = {};
//             expect(tf.selectable).toBe(true);
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.selectable = {toString:function () { return 1; } };
//             expect(tf.selectable).toBe(true);
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.selectable = {toString:function () { return "10"; } };
//             expect(tf.selectable).toBe(true);
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.selectable = {toString:function () { return "1a"; } };
//             expect(tf.selectable).toBe(true);
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.selectable = new XML("<a>100</a>");
//             expect(tf.selectable).toBe(true);
//         });
//
//     });
//
//     describe("TextField.js useRichTextClipboard test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.useRichTextClipboard).toBe(false);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = null;
//             expect(tf.useRichTextClipboard).toBe(false);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = undefined;
//             expect(tf.useRichTextClipboard).toBe(false);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = true;
//             expect(tf.useRichTextClipboard).toBe(true);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = "";
//             expect(tf.useRichTextClipboard).toBe(false);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = "abc";
//             expect(tf.useRichTextClipboard).toBe(true);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = 0;
//             expect(tf.useRichTextClipboard).toBe(false);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = 1;
//             expect(tf.useRichTextClipboard).toBe(true);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = 500;
//             expect(tf.useRichTextClipboard).toBe(true);
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = 50000000000000000;
//             expect(tf.useRichTextClipboard).toBe(true);
//         });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = -1;
//             expect(tf.useRichTextClipboard).toBe(true);
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = -500;
//             expect(tf.useRichTextClipboard).toBe(true);
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = -50000000000000000;
//             expect(tf.useRichTextClipboard).toBe(true);
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = {a:0};
//             expect(tf.useRichTextClipboard).toBe(true);
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = function a(){};
//             expect(tf.useRichTextClipboard).toBe(true);
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = [1];
//             expect(tf.useRichTextClipboard).toBe(true);
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = [1,2];
//             expect(tf.useRichTextClipboard).toBe(true);
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = {};
//             expect(tf.useRichTextClipboard).toBe(true);
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = {toString:function () { return 1; } };
//             expect(tf.useRichTextClipboard).toBe(true);
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = {toString:function () { return "10"; } };
//             expect(tf.useRichTextClipboard).toBe(true);
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = {toString:function () { return "1a"; } };
//             expect(tf.useRichTextClipboard).toBe(true);
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.useRichTextClipboard = new XML("<a>100</a>");
//             expect(tf.useRichTextClipboard).toBe(true);
//         });
//
//     });
//
//     describe("TextField.js wordWrap test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.wordWrap).toBe(false);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = null;
//             expect(tf.wordWrap).toBe(false);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = undefined;
//             expect(tf.wordWrap).toBe(false);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = true;
//             expect(tf.wordWrap).toBe(true);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = "";
//             expect(tf.wordWrap).toBe(false);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = "abc";
//             expect(tf.wordWrap).toBe(true);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = 0;
//             expect(tf.wordWrap).toBe(false);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = 1;
//             expect(tf.wordWrap).toBe(true);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = 500;
//             expect(tf.wordWrap).toBe(true);
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = 50000000000000000;
//             expect(tf.wordWrap).toBe(true);
//         });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = -1;
//             expect(tf.wordWrap).toBe(true);
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = -500;
//             expect(tf.wordWrap).toBe(true);
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = -50000000000000000;
//             expect(tf.wordWrap).toBe(true);
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = {a:0};
//             expect(tf.wordWrap).toBe(true);
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = function a(){};
//             expect(tf.wordWrap).toBe(true);
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = [1];
//             expect(tf.wordWrap).toBe(true);
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = [1,2];
//             expect(tf.wordWrap).toBe(true);
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = {};
//             expect(tf.wordWrap).toBe(true);
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = {toString:function () { return 1; } };
//             expect(tf.wordWrap).toBe(true);
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = {toString:function () { return "10"; } };
//             expect(tf.wordWrap).toBe(true);
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = {toString:function () { return "1a"; } };
//             expect(tf.wordWrap).toBe(true);
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.wordWrap = new XML("<a>100</a>");
//             expect(tf.wordWrap).toBe(true);
//         });
//
//     });
//
//     describe("TextFormat.js bullet test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextFormat();
//             expect(tf.bullet).toBe(null);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextFormat();
//             tf.bullet = null;
//             expect(tf.bullet).toBe(null);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextFormat();
//             tf.bullet = undefined;
//             expect(tf.bullet).toBe(null);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextFormat();
//             tf.bullet = true;
//             expect(tf.bullet).toBe(true);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextFormat();
//             tf.bullet = "";
//             expect(tf.bullet).toBe(false);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextFormat();
//             tf.bullet = "abc";
//             expect(tf.bullet).toBe(true);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextFormat();
//             tf.bullet = 0;
//             expect(tf.bullet).toBe(false);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextFormat();
//             tf.bullet = 1;
//             expect(tf.bullet).toBe(true);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextFormat();
//             tf.bullet = {a:0};
//             expect(tf.bullet).toBe(true);
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextFormat();
//             tf.bullet = function a(){};
//             expect(tf.bullet).toBe(true);
//         });
//
//     });
//
//     describe("TextField.js antiAliasType test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = true;
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = "";
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = "abc";
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = "advanced";
//             expect(tf.antiAliasType).toBe("advanced");
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = 0;
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = 1;
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = 500;
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = 50000000000000000;
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = -1;
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = -500;
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = -50000000000000000;
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = {a:0};
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = function a(){};
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = [1];
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = [1,2];
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = {};
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = {toString:function () { return 1; } };
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = {toString:function () { return "10"; } };
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = {toString:function () { return "1a"; } };
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.antiAliasType = new XML("<a>100</a>");
//             expect(tf.antiAliasType).toBe("normal");
//         });
//
//     });
//
//     describe("TextField.js autoSize test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.autoSize).toBe("none");
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = true;
//             expect(tf.autoSize).toBe("none");
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = "";
//             expect(tf.autoSize).toBe("none");
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = "abc";
//             expect(tf.autoSize).toBe("none");
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = TextFieldAutoSize.CENTER;
//             expect(tf.autoSize).toBe("center");
//
//             tf.autoSize = TextFieldAutoSize.RIGHT;
//             expect(tf.autoSize).toBe("right");
//
//             tf.autoSize = TextFieldAutoSize.LEFT;
//             expect(tf.autoSize).toBe("left");
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = 0;
//             expect(tf.autoSize).toBe("none");
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = 1;
//             expect(tf.autoSize).toBe("none");
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = 500;
//             expect(tf.autoSize).toBe("none");
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = 50000000000000000;
//             expect(tf.autoSize).toBe("none");
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = -1;
//             expect(tf.autoSize).toBe("none");
//         });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = -500;
//             expect(tf.autoSize).toBe("none");
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = -50000000000000000;
//             expect(tf.autoSize).toBe("none");
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = {a:0};
//             expect(tf.autoSize).toBe("none");
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = function a(){};
//             expect(tf.autoSize).toBe("none");
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = [1];
//             expect(tf.autoSize).toBe("none");
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = [1,2];
//             expect(tf.autoSize).toBe("none");
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = {};
//             expect(tf.autoSize).toBe("none");
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = {toString:function () { return 1; } };
//             expect(tf.autoSize).toBe("none");
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = {toString:function () { return "10"; } };
//             expect(tf.autoSize).toBe("none");
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = {toString:function () { return "1a"; } };
//             expect(tf.autoSize).toBe("none");
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.autoSize = new XML("<a>100</a>");
//             expect(tf.autoSize).toBe("none");
//         });
//
//     });
//
//     describe("TextField.js backgroundColor test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.backgroundColor).toBe(16777215);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = null;
//             expect(tf.backgroundColor).toBe(0);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = undefined;
//             expect(tf.backgroundColor).toBe(0);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = true;
//             expect(tf.backgroundColor).toBe(1);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = "";
//             expect(tf.backgroundColor).toBe(0);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = "abc";
//             expect(tf.backgroundColor).toBe(0);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = 0;
//             expect(tf.backgroundColor).toBe(0);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = 1;
//             expect(tf.backgroundColor).toBe(1);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = 500;
//             expect(tf.backgroundColor).toBe(500);
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = 50000000000000000;
//             expect(tf.backgroundColor).toBe(12910592);
//         });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = -1;
//             expect(tf.backgroundColor).toBe(16777215);
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = -500;
//             expect(tf.backgroundColor).toBe(16776716);
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = -50000000000000000;
//             expect(tf.backgroundColor).toBe(3866624);
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = {a:0};
//             expect(tf.backgroundColor).toBe(0);
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = function a(){};
//             expect(tf.backgroundColor).toBe(0);
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = [1];
//             expect(tf.backgroundColor).toBe(1);
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = [1,2];
//             expect(tf.backgroundColor).toBe(0);
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = {};
//             expect(tf.backgroundColor).toBe(0);
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = {toString:function () { return 1; } };
//             expect(tf.backgroundColor).toBe(1);
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = {toString:function () { return "10"; } };
//             expect(tf.backgroundColor).toBe(10);
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = {toString:function () { return "1a"; } };
//             expect(tf.backgroundColor).toBe(0);
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.backgroundColor = new XML("<a>100</a>");
//             expect(tf.backgroundColor).toBe(100);
//         });
//
//     });
//
//     describe("TextField.js borderColor test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.borderColor).toBe(0);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = null;
//             expect(tf.borderColor).toBe(0);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = undefined;
//             expect(tf.borderColor).toBe(0);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = true;
//             expect(tf.borderColor).toBe(1);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = "";
//             expect(tf.borderColor).toBe(0);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = "abc";
//             expect(tf.borderColor).toBe(0);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = 0;
//             expect(tf.borderColor).toBe(0);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = 1;
//             expect(tf.borderColor).toBe(1);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = 500;
//             expect(tf.borderColor).toBe(500);
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = 50000000000000000;
//             expect(tf.borderColor).toBe(12910592);
//         });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = -1;
//             expect(tf.borderColor).toBe(16777215);
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = -500;
//             expect(tf.borderColor).toBe(16776716);
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = -50000000000000000;
//             expect(tf.borderColor).toBe(3866624);
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = {a:0};
//             expect(tf.borderColor).toBe(0);
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = function a(){};
//             expect(tf.borderColor).toBe(0);
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = [1];
//             expect(tf.borderColor).toBe(1);
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = [1,2];
//             expect(tf.borderColor).toBe(0);
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = {};
//             expect(tf.borderColor).toBe(0);
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = {toString:function () { return 1; } };
//             expect(tf.borderColor).toBe(1);
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = {toString:function () { return "10"; } };
//             expect(tf.borderColor).toBe(10);
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = {toString:function () { return "1a"; } };
//             expect(tf.borderColor).toBe(0);
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.borderColor = new XML("<a>100</a>");
//             expect(tf.borderColor).toBe(100);
//         });
//
//     });
//
//     describe("TextField.js maxChars test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.maxChars).toBe(0);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = null;
//             expect(tf.maxChars).toBe(0);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = undefined;
//             expect(tf.maxChars).toBe(0);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = true;
//             expect(tf.maxChars).toBe(1);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = "";
//             expect(tf.maxChars).toBe(0);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = "abc";
//             expect(tf.maxChars).toBe(0);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = 0;
//             expect(tf.maxChars).toBe(0);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = 1;
//             expect(tf.maxChars).toBe(1);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = 500;
//             expect(tf.maxChars).toBe(500);
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = 50000000000000000;
//             expect(tf.maxChars).toBe(784662528);
//         });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = -1;
//             expect(tf.maxChars).toBe(-1);
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = -500;
//             expect(tf.maxChars).toBe(-500);
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = -50000000000000000;
//             expect(tf.maxChars).toBe(-784662528);
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = {a:0};
//             expect(tf.maxChars).toBe(0);
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = function a(){};
//             expect(tf.maxChars).toBe(0);
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = [1];
//             expect(tf.maxChars).toBe(1);
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = [1,2];
//             expect(tf.maxChars).toBe(0);
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = {};
//             expect(tf.maxChars).toBe(0);
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = {toString:function () { return 1; } };
//             expect(tf.maxChars).toBe(1);
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = {toString:function () { return "10"; } };
//             expect(tf.maxChars).toBe(10);
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = {toString:function () { return "1a"; } };
//             expect(tf.maxChars).toBe(0);
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.maxChars = new XML("<a>100</a>");
//             expect(tf.maxChars).toBe(100);
//         });
//
//     });
//
//     describe("TextField.js restrict test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.restrict).toBe(null);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.restrict = null;
//             expect(tf.restrict).toBe(null);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.restrict = undefined;
//             expect(tf.restrict).toBe(null);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.restrict = true;
//             expect(tf.restrict).toBe("true");
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.restrict = "";
//             expect(tf.restrict).toBe("");
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.restrict = "abc";
//             expect(tf.restrict).toBe("abc");
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.restrict = 0;
//             expect(tf.restrict).toBe("0");
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.restrict = 1;
//             expect(tf.restrict).toBe("1");
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.restrict = 500;
//             expect(tf.restrict).toBe("500");
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextField();
//             tf.restrict = 50000000000000000;
//             expect(tf.restrict).toBe("50000000000000000");
//         });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.restrict = -1;
//             expect(tf.restrict).toBe("-1");
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.restrict = -500;
//             expect(tf.restrict).toBe("-500");
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.restrict = -50000000000000000;
//             expect(tf.restrict).toBe("-50000000000000000");
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.restrict = {a:0};
//             expect(tf.restrict).toBe("[object Object]");
//         });
//
//         it("default test case15", function()
//         {
//             var test = function () {};
//             test.toString = function () { return "test" };
//
//             var tf = new TextField();
//             tf.restrict = test;
//             expect(tf.restrict).toBe("test");
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.restrict = [1];
//             expect(tf.restrict).toBe("1");
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.restrict = [1,2];
//             expect(tf.restrict).toBe("1,2");
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.restrict = {};
//             expect(tf.restrict).toBe("[object Object]");
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.restrict = {toString:function () { return 1; } };
//             expect(tf.restrict).toBe("1");
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.restrict = {toString:function () { return "10"; } };
//             expect(tf.restrict).toBe("10");
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.restrict = {toString:function () { return "1a"; } };
//             expect(tf.restrict).toBe("1a");
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.restrict = new XML("<a>100</a>");
//             expect(tf.restrict).toBe("100");
//         });
//
//     });
//
//     describe("TextField.js sharpness test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.sharpness).toBe(0);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = null;
//             expect(tf.sharpness).toBe(0);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = undefined;
//             expect(isNaN(tf.sharpness)).toBe(true);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = true;
//             expect(tf.sharpness).toBe(1);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = "";
//             expect(tf.sharpness).toBe(0);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = "abc";
//             expect(isNaN(tf.sharpness)).toBe(true);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = 0;
//             expect(tf.sharpness).toBe(0);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = 1;
//             expect(tf.sharpness).toBe(1);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = 500;
//             expect(tf.sharpness).toBe(400);
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = 50000000000000000;
//             expect(tf.sharpness).toBe(400);
//         });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = -1;
//             expect(tf.sharpness).toBe(-1);
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = -500;
//             expect(tf.sharpness).toBe(-400);
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = -50000000000000000;
//             expect(tf.sharpness).toBe(-400);
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = {a:0};
//             expect(isNaN(tf.sharpness)).toBe(true);
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = function a(){};
//             expect(isNaN(tf.sharpness)).toBe(true);
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = [1];
//             expect(tf.sharpness).toBe(1);
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = [1,2];
//             expect(isNaN(tf.sharpness)).toBe(true);
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = {};
//             expect(isNaN(tf.sharpness)).toBe(true);
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = {toString:function () { return 1; } };
//             expect(tf.sharpness).toBe(1);
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = {toString:function () { return "10"; } };
//             expect(tf.sharpness).toBe(10);
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = {toString:function () { return "1a"; } };
//             expect(isNaN(tf.sharpness)).toBe(true);
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.sharpness = new XML("<a>100</a>");
//             expect(tf.sharpness).toBe(100);
//         });
//
//     });
//
//     describe("TextField.js text test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.text).toBe("");
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.text = true;
//             expect(tf.text).toBe("true");
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.text = "";
//             expect(tf.text).toBe("");
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.text = "abc";
//             expect(tf.text).toBe("abc");
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.text = 0;
//             expect(tf.text).toBe("0");
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.text = 1;
//             expect(tf.text).toBe("1");
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.text = 500;
//             expect(tf.text).toBe("500");
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.text = 50000000000000000;
//             expect(tf.text).toBe("50000000000000000");
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.text = -1;
//             expect(tf.text).toBe("-1");
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextField();
//             tf.text = -500;
//             expect(tf.text).toBe("-500");
//         });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.text = -50000000000000000;
//             expect(tf.text).toBe("-50000000000000000");
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.text = {a:0};
//             expect(tf.text).toBe("[object Object]");
//         });
//
//         it("default test case13", function()
//         {
//             var test = function () {};
//             test.toString = function () { return "test" };
//
//             var tf = new TextField();
//             tf.text = test;
//             expect(tf.text).toBe("test");
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.text = [1];
//             expect(tf.text).toBe("1");
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.text = [1,2];
//             expect(tf.text).toBe("1,2");
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.text = {};
//             expect(tf.text).toBe("[object Object]");
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.text = {toString:function () { return 1; } };
//             expect(tf.text).toBe("1");
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.text = {toString:function () { return "10"; } };
//             expect(tf.text).toBe("10");
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.text = {toString:function () { return "1a"; } };
//             expect(tf.text).toBe("1a");
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.text = new XML("<a>100</a>");
//             expect(tf.text).toBe("100");
//         });
//
//     });
//
//     describe("TextField.js textColor test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.textColor).toBe(0);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.textColor = null;
//             expect(tf.textColor).toBe(0);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.textColor = undefined;
//             expect(tf.textColor).toBe(0);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.textColor = true;
//             expect(tf.textColor).toBe(1);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.textColor = "";
//             expect(tf.textColor).toBe(0);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.textColor = "abc";
//             expect(tf.textColor).toBe(0);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.textColor = 0;
//             expect(tf.textColor).toBe(0);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.textColor = 1;
//             expect(tf.textColor).toBe(1);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.textColor = 500;
//             expect(tf.textColor).toBe(500);
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextField();
//             tf.textColor = 50000000000000000;
//             expect(tf.textColor).toBe(12910592);
//         });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.textColor = -1;
//             expect(tf.textColor).toBe(16777215);
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.textColor = -500;
//             expect(tf.textColor).toBe(16776716);
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.textColor = -50000000000000000;
//             expect(tf.textColor).toBe(3866624);
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.textColor = {a:0};
//             expect(tf.textColor).toBe(0);
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.textColor = function a(){};
//             expect(tf.textColor).toBe(0);
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.textColor = [1];
//             expect(tf.textColor).toBe(1);
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.textColor = [1,2];
//             expect(tf.textColor).toBe(0);
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.textColor = {};
//             expect(tf.textColor).toBe(0);
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.textColor = {toString:function () { return 1; } };
//             expect(tf.textColor).toBe(1);
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.textColor = {toString:function () { return "10"; } };
//             expect(tf.textColor).toBe(10);
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.textColor = {toString:function () { return "1a"; } };
//             expect(tf.textColor).toBe(0);
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.textColor = new XML("<a>100</a>");
//             expect(tf.textColor).toBe(100);
//         });
//
//     });
//
//     describe("TextField.js thickness test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.thickness).toBe(0);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.thickness = null;
//             expect(tf.thickness).toBe(0);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.thickness = undefined;
//             expect(isNaN(tf.thickness)).toBe(true);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.thickness = true;
//             expect(tf.thickness).toBe(1);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.thickness = "";
//             expect(tf.thickness).toBe(0);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.thickness = "abc";
//             expect(isNaN(tf.thickness)).toBe(true);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.thickness = 0;
//             expect(tf.thickness).toBe(0);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.thickness = 1;
//             expect(tf.thickness).toBe(1);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.thickness = 500;
//             expect(tf.thickness).toBe(200);
//         });
//
//         it("default test case10", function()
//         {
//             var tf = new TextField();
//             tf.thickness = 50000000000000000;
//             expect(tf.thickness).toBe(200);
//         });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.thickness = -1;
//             expect(tf.thickness).toBe(-1);
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.thickness = -500;
//             expect(tf.thickness).toBe(-200);
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.thickness = -50000000000000000;
//             expect(tf.thickness).toBe(-200);
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.thickness = {a:0};
//             expect(isNaN(tf.thickness)).toBe(true);
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.thickness = function a(){};
//             expect(isNaN(tf.thickness)).toBe(true);
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.thickness = [1];
//             expect(tf.thickness).toBe(1);
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.thickness = [1,2];
//             expect(isNaN(tf.thickness)).toBe(true);
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.thickness = {};
//             expect(isNaN(tf.thickness)).toBe(true);
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.thickness = {toString:function () { return 1; } };
//             expect(tf.thickness).toBe(1);
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.thickness = {toString:function () { return "10"; } };
//             expect(tf.thickness).toBe(10);
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.thickness = {toString:function () { return "1a"; } };
//             expect(isNaN(tf.thickness)).toBe(true);
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.thickness = new XML("<a>100</a>");
//             expect(tf.thickness).toBe(100);
//         });
//
//     });
//
//     describe("TextField.js antiAliasType test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.type).toBe("dynamic");
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.type = TextFieldType.DYNAMIC;
//             expect(tf.type).toBe("dynamic");
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.type = TextFieldType.INPUT;
//             expect(tf.type).toBe("input");
//         });
//
//     });
//
//     describe("TextField.js width test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.width).toBe(100);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.width = null;
//             expect(tf.width).toBe(0);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.width = undefined;
//             expect(tf.width).toBe(100);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.width = true;
//             expect(tf.width).toBe(1);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.width = "";
//             expect(tf.width).toBe(0);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.width = "abc";
//             expect(tf.width).toBe(100);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.width = 0;
//             expect(tf.width).toBe(0);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.width = 1;
//             expect(tf.width).toBe(1);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.width = 500;
//             expect(tf.width).toBe(500);
//         });
//     //TODO 少数が出る
//         // it("default test case10", function()
//         // {
//         //     var tf = new TextField();
//         //     tf.width = 50000000000000000;
//         //     expect(tf.width).toBe(-107374182.4);
//         // });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.width = -1;
//             expect(tf.width).toBe(100);
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.width = -500;
//             expect(tf.width).toBe(100);
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.width = -50000000000000000;
//             expect(tf.width).toBe(100);
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.width = {a:0};
//             expect(tf.width).toBe(100);
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.width = function a(){};
//             expect(tf.width).toBe(100);
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.width = [1];
//             expect(tf.width).toBe(1);
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.width = [1,2];
//             expect(tf.width).toBe(100);
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.width = {};
//             expect(tf.width).toBe(100);
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.width = {toString:function () { return 1; } };
//             expect(tf.width).toBe(1);
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.width = {toString:function () { return "10"; } };
//             expect(tf.width).toBe(10);
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.width = {toString:function () { return "1a"; } };
//             expect(tf.width).toBe(100);
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.width = new XML("<a>100</a>");
//             expect(tf.width).toBe(100);
//         });
//
//
//         it("default test case23 ", function()
//         {
//             var text = "【第1部隊】が本拠地へ帰還しました。";
//
//             var format = new TextFormat();
//             format.size = 14;
//             // format.leading = 4;
//             // format.leftMargin  = 18;
//             // format.rightMargin = 6;
//             format.font = "_sans";
//
//             var field  = new TextField();
//             field.defaultTextFormat = format;
//
//             // default
//             expect(field._$originBounds.xMin).toBe(0);
//             expect(field._$originBounds.xMax).toBe(2000);
//             expect(field._$originBounds.yMin).toBe(0);
//             expect(field._$originBounds.yMax).toBe(2000);
//             field.htmlText = text; // reload start
//
//             // end reload size
//             expect(field._$originBounds.xMin).toBe(0);
//             expect(field._$originBounds.xMax).toBe(2000);
//             expect(field._$originBounds.yMin).toBe(0);
//             expect(field._$originBounds.yMax).toBe(2000);
//
//             field.mouseEnabled = false;
//             field.multiline = true;
//             field.wordWrap = true;
//
//             field.autoSize = TextFieldAutoSize.LEFT; // reload start
//
//             // end reload size
//             expect(field._$originBounds.xMin).toBe(0);
//             expect(field._$originBounds.xMax).toBe(2000);
//             expect(field._$originBounds.yMin).toBe(0);
//             expect(field._$originBounds.yMax).toBe(2000);
//
//             field.width = 458; // reload start
//
//             // end reload size
//             expect(field._$originBounds.xMin).toBe(0);
//             expect(field._$originBounds.xMax).toBe(458*20);
//             expect(field._$originBounds.yMin).toBe(0);
//             expect(field._$originBounds.yMax).toBe(2000);
//
//         });
//     });
//
//     describe("TextField.js height test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.height).toBe(100);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.height = null;
//             expect(tf.height).toBe(0);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.height = undefined;
//             expect(tf.height).toBe(100);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.height = true;
//             expect(tf.height).toBe(1);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.height = "";
//             expect(tf.height).toBe(0);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.height = "abc";
//             expect(tf.height).toBe(100);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.height = 0;
//             expect(tf.height).toBe(0);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.height = 1;
//             expect(tf.height).toBe(1);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.height = 500;
//             expect(tf.height).toBe(500);
//         });
//     //TODO 少数が出る
//         // it("default test case10", function()
//         // {
//         //     var tf = new TextField();
//         //     tf.height = 50000000000000000;
//         //     expect(tf.height).toBe(-107374182.4);
//         // });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.height = -1;
//             expect(tf.height).toBe(100);
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.height = -500;
//             expect(tf.height).toBe(100);
//         });
//
//         it("default test case13", function()
//         {
//             var tf = new TextField();
//             tf.height = -50000000000000000;
//             expect(tf.height).toBe(100);
//         });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.height = {a:0};
//             expect(tf.height).toBe(100);
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.height = function a(){};
//             expect(tf.height).toBe(100);
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.height = [1];
//             expect(tf.height).toBe(1);
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.height = [1,2];
//             expect(tf.height).toBe(100);
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.height = {};
//             expect(tf.height).toBe(100);
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.height = {toString:function () { return 1; } };
//             expect(tf.height).toBe(1);
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.height = {toString:function () { return "10"; } };
//             expect(tf.height).toBe(10);
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.height = {toString:function () { return "1a"; } };
//             expect(tf.height).toBe(100);
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.height = new XML("<a>100</a>");
//             expect(tf.height).toBe(100);
//         });
//
//     });
//
//     describe("TextField.js x test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.x).toBe(0);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.x = null;
//             expect(tf.x).toBe(0);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.x = undefined;
//             expect(tf.x).toBe(0);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.x = true;
//             expect(tf.x).toBe(1);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.x = "";
//             expect(tf.x).toBe(0);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.x = "abc";
//             expect(tf.x).toBe(0);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.x = 0;
//             expect(tf.x).toBe(0);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.x = 1;
//             expect(tf.x).toBe(1);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.x = 500;
//             expect(tf.x).toBe(500);
//         });
//         //TODO 少数が出る
//         // it("default test case10", function()
//         // {
//         //     var tf = new TextField();
//         //     tf.x = 50000000000000000;
//         //     expect(tf.x).toBe(-107374182.4);
//         // });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.x = -1;
//             expect(tf.x).toBe(-1);
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.x = -500;
//             expect(tf.x).toBe(-500);
//         });
//     //TODO 少数が出る
//     //     it("default test case13", function()
//     //     {
//     //         var tf = new TextField();
//     //         tf.x = -50000000000000000;
//     //         expect(tf.x).toBe(-107374182.4);
//     //     });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.x = {a:0};
//             expect(tf.x).toBe(0);
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.x = function a(){};
//             expect(tf.x).toBe(0);
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.x = [1];
//             expect(tf.x).toBe(1);
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.x = [1,2];
//             expect(tf.x).toBe(0);
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.x = {};
//             expect(tf.x).toBe(0);
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.x = {toString:function () { return 1; } };
//             expect(tf.x).toBe(1);
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.x = {toString:function () { return "10"; } };
//             expect(tf.x).toBe(10);
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.x = {toString:function () { return "1a"; } };
//             expect(tf.x).toBe(0);
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.x = new XML("<a>100</a>");
//             expect(tf.x).toBe(100);
//         });
//
//     })
//
//     describe("TextField.js y test", function()
//     {
//
//         it("default test case1", function()
//         {
//             var tf = new TextField();
//             expect(tf.y).toBe(0);
//         });
//
//         it("default test case2", function()
//         {
//             var tf = new TextField();
//             tf.y = null;
//             expect(tf.y).toBe(0);
//         });
//
//         it("default test case3", function()
//         {
//             var tf = new TextField();
//             tf.y = undefined;
//             expect(tf.y).toBe(0);
//         });
//
//         it("default test case4", function()
//         {
//             var tf = new TextField();
//             tf.y = true;
//             expect(tf.y).toBe(1);
//         });
//
//         it("default test case5", function()
//         {
//             var tf = new TextField();
//             tf.y = "";
//             expect(tf.y).toBe(0);
//         });
//
//         it("default test case6", function()
//         {
//             var tf = new TextField();
//             tf.y = "abc";
//             expect(tf.y).toBe(0);
//         });
//
//         it("default test case7", function()
//         {
//             var tf = new TextField();
//             tf.y = 0;
//             expect(tf.y).toBe(0);
//         });
//
//         it("default test case8", function()
//         {
//             var tf = new TextField();
//             tf.y = 1;
//             expect(tf.y).toBe(1);
//         });
//
//         it("default test case9", function()
//         {
//             var tf = new TextField();
//             tf.y = 500;
//             expect(tf.y).toBe(500);
//         });
//         //TODO 少数が出る
//         // it("default test case10", function()
//         // {
//         //     var tf = new TextField();
//         //     tf.y = 50000000000000000;
//         //     expect(tf.y).toBe(-107374182.4);
//         // });
//
//         it("default test case11", function()
//         {
//             var tf = new TextField();
//             tf.y = -1;
//             expect(tf.y).toBe(-1);
//         });
//
//         it("default test case12", function()
//         {
//             var tf = new TextField();
//             tf.y = -500;
//             expect(tf.y).toBe(-500);
//         });
//         //TODO 少数が出る
//         // it("default test case13", function()
//         // {
//         //     var tf = new TextField();
//         //     tf.y = -50000000000000000;
//         //     expect(tf.y).toBe(-107374182.4);
//         // });
//
//         it("default test case14", function()
//         {
//             var tf = new TextField();
//             tf.y = {a:0};
//             expect(tf.y).toBe(0);
//         });
//
//         it("default test case15", function()
//         {
//             var tf = new TextField();
//             tf.y = function a(){};
//             expect(tf.y).toBe(0);
//         });
//
//         it("default test case16", function()
//         {
//             var tf = new TextField();
//             tf.y = [1];
//             expect(tf.y).toBe(1);
//         });
//
//         it("default test case17", function()
//         {
//             var tf = new TextField();
//             tf.y = [1,2];
//             expect(tf.y).toBe(0);
//         });
//
//         it("default test case18", function()
//         {
//             var tf = new TextField();
//             tf.y = {};
//             expect(tf.y).toBe(0);
//         });
//
//         it("default test case19", function()
//         {
//             var tf = new TextField();
//             tf.y = {toString:function () { return 1; } };
//             expect(tf.y).toBe(1);
//         });
//
//         it("default test case20", function()
//         {
//             var tf = new TextField();
//             tf.y = {toString:function () { return "10"; } };
//             expect(tf.y).toBe(10);
//         });
//
//         it("default test case21", function()
//         {
//             var tf = new TextField();
//             tf.y = {toString:function () { return "1a"; } };
//             expect(tf.y).toBe(0);
//         });
//
//         it("default test case22", function()
//         {
//             var tf = new TextField();
//             tf.y = new XML("<a>100</a>");
//             expect(tf.y).toBe(100);
//         });
//
//     });
//
//     describe("TextField.js scroll test", function()
//     {
//
//         it("maxScrollV test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.width = 100;
//             tf.height = 20;
//             tf.wordWrap = true;
//             tf.text = "テキストテキストテキストテキスト"
//
//             expect(tf.maxScrollV).toBe(2);
//         });
//
//         it("maxScrollV test success case2", function ()
//         {
//             var tf = new TextField();
//
//             tf.width = 100;
//             tf.height = 20;
//             tf.autoSize = TextFieldAutoSize.NONE;
//             tf.type = TextFieldType.DYNAMIC;
//             tf.text = "\n";
//
//             expect(tf.maxScrollV).toBe(1);
//         });
//
//         it("maxScrollV test success case3", function ()
//         {
//             var tf = new TextField();
//
//             tf.width = 100;
//             tf.height = 20;
//             tf.autoSize = TextFieldAutoSize.NONE;
//             tf.type = TextFieldType.INPUT;
//             tf.text = "\n";
//
//             expect(tf.maxScrollV).toBe(2);
//         });
//
//         it("maxScrollV test success case4", function ()
//         {
//             var tf = new TextField();
//
//             tf.width = 100;
//             tf.height = 20;
//             tf.autoSize = TextFieldAutoSize.LEFT;
//             tf.type = TextFieldType.DYNAMIC;
//             tf.text = "\n";
//
//             expect(tf.maxScrollV).toBe(1);
//         });
//
//         // TODO boundsが再計算されるタイミングを調査する(Flashではheightのgetterが呼び出されるタイミングで再計算されている？)
//         // it("maxScrollV test success case5", function ()
//         // {
//         //     var tf = new TextField();
//
//         //     tf.width = 100;
//         //     tf.height = 20;
//         //     tf.autoSize = TextFieldAutoSize.LEFT;
//         //     tf.type = TextFieldType.INPUT;
//         //     tf.text = "\n";
//
//         //     expect(tf.maxScrollV).toBe(2);
//         // });
//
//         it("maxScrollV test success case6", function ()
//         {
//             var tf = new TextField();
//
//             tf.width = 100;
//             tf.height = 20;
//             tf.autoSize = TextFieldAutoSize.LEFT;
//             tf.type = TextFieldType.INPUT;
//             tf.text = "\n";
//
//             tf.height
//
//             expect(tf.maxScrollV).toBe(1);
//         });
//
//     });
//
//     describe("TextField.js htmlText test", function()
//     {
//
//         it("CR and LF test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "<p>aaa\nbbb</p>";
//
//             expect(tf.numLines).toBe(3);
//         });
//
//         it("CR and LF test success case2", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "<p>aaa\rbbb</p>";
//
//             expect(tf.numLines).toBe(3);
//         });
//
//         it("CR and LF test success case3", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "<p>aaa\r\nbbb</p>";
//
//             expect(tf.numLines).toBe(4);
//         });
//
//         it("CR and LF test success case4", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "<p>aaa\n\rbbb</p>";
//
//             expect(tf.numLines).toBe(4);
//         });
//
//         it("numLines test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "<p></p>";
//
//             expect(tf.numLines).toBe(2);
//         });
//
//         it("numLines test success case2", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = false;
//             tf.htmlText = "<p></p>";
//
//             expect(tf.numLines).toBe(1);
//         });
//
//         it("numLines test success case3", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "<p></p><p></p>";
//
//             expect(tf.numLines).toBe(3);
//         });
//
//         it("numLines test success case4", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = false;
//             tf.htmlText = "<p></p><p></p>";
//
//             expect(tf.numLines).toBe(1);
//         });
//
//         it("numLines test success case5", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "<p>aaa<br />bbb</p>";
//
//             expect(tf.numLines).toBe(3);
//         });
//
//         it("numLines test success case6", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = false;
//             tf.htmlText = "<p>aaa<br />bbb</p>";
//
//             expect(tf.numLines).toBe(1);
//         });
//
//         it("numLines test success case7", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "<p>aaa\n</p>";
//
//             expect(tf.numLines).toBe(3);
//         });
//
//         it("numLines test success case8", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = false;
//             tf.htmlText = "<p>aaa\n</p>";
//
//             expect(tf.numLines).toBe(2);
//         });
//
//         it("numLines test success case9", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "<span></span>";
//
//             expect(tf.numLines).toBe(1);
//         });
//
//         it("numLines test success case10", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "<span><p></p></span>";
//
//             expect(tf.numLines).toBe(2);
//         });
//
//         it("_$parseTag test success case1", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "<p>a</p>";
//
//             expect(tf.numLines).toBe(2);
//             expect(tf.getLineText(0)).toBe("a\r");
//             expect(tf.getLineText(1)).toBe("");
//         });
//
//         it("_$parseTag test success case2", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = '<p><font>a</font></p>';
//
//             expect(tf.numLines).toBe(2);
//             expect(tf.getLineText(0)).toBe("a\r");
//         });
//
//         it("_$parseTag test success case3", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = '<textformat><p><font>a</font></p></textformat>';
//
//             expect(tf.numLines).toBe(2);
//             expect(tf.getLineText(0)).toBe("a\r");
//         });
//
//         it("_$parseTag test success case4", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = '<p><textformat><font>a</font></textformat></p>';
//
//             expect(tf.numLines).toBe(2);
//             expect(tf.getLineText(0)).toBe("a\r");
//         });
//
//         it("_$parseTag test success case5", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = '<textformat><font><p>a</p></font></textformat>';
//
//             expect(tf.numLines).toBe(2);
//             expect(tf.getLineText(0)).toBe("a\r");
//         });
//
//         it("_$parseTag test success case6", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = '<textformat><font><p>a</p></font></textformat>b';
//
//             expect(tf.numLines).toBe(2);
//             expect(tf.getLineText(0)).toBe("a\r");
//             expect(tf.getLineText(1)).toBe("b");
//         });
//
//         it("_$parseTag test success case7", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = '<textformat><font><p>a</p></font></textformat><p>b</p>';
//
//             expect(tf.numLines).toBe(3);
//             expect(tf.getLineText(0)).toBe("a\r");
//             expect(tf.getLineText(1)).toBe("b\r");
//             expect(tf.getLineText(2)).toBe("");
//         });
//
//         it("_$parseTag test success case8", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = '<textformat><font><p>a</p></font></textformat>b<p>c</p>';
//
//             expect(tf.numLines).toBe(3);
//             expect(tf.getLineText(0)).toBe("a\r");
//             expect(tf.getLineText(1)).toBe("bc\r");
//         });
//
//         it("_$parseTag test success case9", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "abc";
//
//             expect(tf.numLines).toBe(1);
//             expect(tf.getLineText(0)).toBe("abc");
//         });
//
//         it("_$parseTag test success case10", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "<span>a</span>\r\n<p>b</p>";
//
//             expect(tf.numLines).toBe(4);
//             expect(tf.getLineText(0)).toBe("a\r");
//             expect(tf.getLineText(2)).toBe("b\r");
//         });
//
//         it("_$parseTag test success case11", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "a\r\n<p>b</p>";
//
//             expect(tf.numLines).toBe(4);
//             expect(tf.getLineText(0)).toBe("a\r");
//             expect(tf.getLineText(2)).toBe("b\r");
//         });
//
//         it("_$parseTag test success case12", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "a<p>b</p>c";
//
//             expect(tf.numLines).toBe(2);
//             expect(tf.getLineText(0)).toBe("ab\r");
//             expect(tf.getLineText(1)).toBe("c");
//         });
//
//         it("_$parseTag test success case13", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = true;
//             tf.htmlText = "<p></p><p>a</p>";
//
//             expect(tf.numLines).toBe(3);
//             expect(Math.round(tf.textHeight)).toBe(26);
//             expect(tf.getLineText(1)).toBe("a\r");
//         });
//
//         it("_$parseTag test success case14", function ()
//         {
//             var tf = new TextField();
//             tf.multiline = false;
//             tf.htmlText = "<p>a</p><p>b</p>";
//
//             expect(tf.numLines).toBe(1);
//             expect(Math.round(tf.textHeight)).toBe(14);
//             expect(tf.getLineText(0)).toBe("ab");
//         });
//
//         it("_$parseTag test success case15", function ()
//         {
//             var tf = new TextField();
//             tf.width = 40;
//             tf.wordWrap = true;
//             tf.htmlText = "<p>aaaaaaaaa</p>";
//
//             expect(tf.numLines).toBe(2);
//         });
//
//         it("_$parseTag test success case16", function ()
//         {
//             var tf = new TextField();
//             tf.width = 40;
//             tf.wordWrap = true;
//             tf.htmlText = "<p>aaaaaaaaa</p>bbbbbbbbbbbb<p></p>";
//
//             expect(tf.numLines).toBe(4);
//         });
//
//         it("_$parseTag test success case17", function ()
//         {
//             var tf = new TextField();
//             tf.width = 40;
//             tf.wordWrap = true;
//             tf.multiline = true;
//             tf.htmlText = "<p>aaaaaaaaa</p>bbbbbbbbbbb<br />bbbbbb<p></p>";
//
//             expect(tf.numLines).toBe(6);
//         });
//
//         it("_$parseTag test success case18", function ()
//         {
//             var tf = new TextField();
//             tf.htmlText = "<test>a</test>";
//
//             expect(tf.numLines).toBe(1);
//             expect(tf.getLineText(0)).toBe("a");
//         });
//
//         it("_$parseTag test success case19", function ()
//         {
//             var tf = new TextField();
//             tf.htmlText = "< test>a</test>b";
//
//             expect(tf.text).toBe("");
//         });
//
//         it("_$parseTag test success case20", function ()
//         {
//             var tf = new TextField();
//             tf.htmlText = "<>a";
//
//             expect(tf.text).toBe("");
//         });
//
//         it("_$parseTag test success case21", function ()
//         {
//             var tf = new TextField();
//             tf.htmlText = "あいうえお、< br/>b";
//
//             expect(tf.text).toBe("あいうえお、");
//         });
//
//     });
//
// });