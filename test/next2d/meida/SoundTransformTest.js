//
//
// describe("SoundTransform.js getQualifiedClassName test", function()
// {
//
//     it("getQualifiedClassName test public", function()
//     {
//         var swf2js = new Swf2js();
//         var str = swf2js.flash.utils.getQualifiedClassName(new SoundTransform());
//         expect(str).toBe("flash.media::SoundTransform");
//     });
//
//     it("getQualifiedClassName test static", function()
//     {
//         var swf2js = new Swf2js();
//         var str = swf2js.flash.utils.getQualifiedClassName(SoundTransform);
//         expect(str).toBe("flash.media::SoundTransform");
//     });
//
// });
//
//
// describe("SoundTransform.js toString test", function()
// {
//     it("toString test success", function()
//     {
//         var filter = new SoundTransform();
//         expect(filter.toString()).toBe("[object SoundTransform]");
//     });
//
// });
//
// describe("SoundTransform.js static toString test", function()
// {
//
//     it("static toString test", function()
//     {
//         expect(Util.$toString(SoundTransform)).toBe("[class SoundTransform]");
//     });
//
// });
//
//
// describe("SoundTransform.js property test", function()
// {
//
//     // leftToLeft
//     it("leftToLeft test success default", function ()
//     {
//         var soundTransform = new SoundTransform();
//         expect(soundTransform.leftToLeft).toBe(1);
//     });
//
//     it("leftToLeft test success case1", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.leftToLeft = 100;
//         expect(soundTransform.leftToLeft).toBe(100);
//     });
//
//     it("leftToLeft test success case2", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.leftToLeft = -32;
//         expect(soundTransform.leftToLeft).toBe(-32);
//     });
//
//     it("leftToLeft test not a number case1", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.leftToLeft = "test";
//         expect(isNaN(soundTransform.leftToLeft)).toBe(true);
//     });
//
//     it("leftToLeft test not a number case2", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.leftToLeft = "";
//         expect(soundTransform.leftToLeft).toBe(0);
//     });
//
//
//     // leftToRight
//     it("leftToRight test success default", function ()
//     {
//         var soundTransform = new SoundTransform();
//         expect(soundTransform.leftToRight).toBe(0);
//     });
//
//     it("leftToRight test success case1", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.leftToRight = 100;
//         expect(soundTransform.leftToRight).toBe(100);
//     });
//
//     it("leftToRight test success case2", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.leftToRight = -32;
//         expect(soundTransform.leftToRight).toBe(-32);
//     });
//
//     it("leftToRight test not a number case1", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.leftToRight = "test";
//         expect(isNaN(soundTransform.leftToRight)).toBe(true);
//     });
//
//     it("leftToRight test not a number case2", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.leftToRight = "";
//         expect(soundTransform.leftToRight).toBe(0);
//     });
//
//
//     // pan
//     it("pan test success default", function ()
//     {
//         var soundTransform = new SoundTransform();
//         expect(soundTransform.pan).toBe(0);
//     });
//
//     it("pan test success case1", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.pan = 100;
//         expect(isNaN(soundTransform.pan)).toBe(true);
//     });
//
//     it("pan test success case2", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.pan = -32;
//         expect(soundTransform.pan).toBe(-32);
//     });
//
//     it("pan test success case3", function ()
//     {
//         var soundTransform = new SoundTransform(1, 1);
//         expect(soundTransform.pan).toBe(1);
//     });
//
//
//     it("pan test not a number case1", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.pan = "test";
//         expect(isNaN(soundTransform.pan)).toBe(true);
//     });
//
//     it("pan test not a number case2", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.pan = "";
//         expect(soundTransform.pan).toBe(0);
//     });
//
//
//     // rightToLeft
//     it("rightToLeft test success case1", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.rightToLeft = 100;
//         expect(soundTransform.rightToLeft).toBe(100);
//     });
//
//     it("rightToLeft test success case2", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.rightToLeft = -32;
//         expect(soundTransform.rightToLeft).toBe(-32);
//     });
//
//     it("rightToLeft test not a number case1", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.rightToLeft = "test";
//         expect(isNaN(soundTransform.rightToLeft)).toBe(true);
//     });
//
//     it("rightToLeft test not a number case2", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.rightToLeft = "";
//         expect(soundTransform.rightToLeft).toBe(0);
//     });
//
//
//     // rightToRight
//     it("rightToRight test success case1", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.rightToRight = 100;
//         expect(soundTransform.rightToRight).toBe(100);
//     });
//
//     it("rightToRight test success case2", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.rightToRight = -32;
//         expect(soundTransform.rightToRight).toBe(-32);
//     });
//
//     it("rightToRight test not a number case1", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.rightToRight = "test";
//         expect(isNaN(soundTransform.rightToRight)).toBe(true);
//     });
//
//     it("rightToRight test not a number case2", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.rightToRight = "";
//         expect(soundTransform.rightToRight).toBe(0);
//     });
//
//
//     // volume
//     it("volume test success default", function ()
//     {
//         var soundTransform = new SoundTransform();
//         expect(soundTransform.volume).toBe(1);
//     });
//
//     it("volume test success case1", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.volume = 100;
//         expect(soundTransform.volume).toBe(100);
//     });
//
//     it("volume test success case2", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.volume = -32;
//         expect(soundTransform.volume).toBe(-32);
//     });
//
//     it("volume test success case3", function ()
//     {
//         var soundTransform = new SoundTransform(100);
//         expect(soundTransform.volume).toBe(100);
//     });
//
//     it("volume test not a number case1", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.volume = "test";
//         expect(isNaN(soundTransform.volume)).toBe(true);
//     });
//
//     it("volume test not a number case2", function ()
//     {
//         var soundTransform = new SoundTransform();
//         soundTransform.volume = "";
//         expect(soundTransform.volume).toBe(0);
//     });
//
// });
//
// describe("SoundTransform.js leftToLeft test", function()
// {
//
//     it("default test case1", function()
//     {
//         var st = new SoundTransform();
//         expect(st.leftToLeft).toBe(1);
//     });
//
//     it("default test case2", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = null;
//         expect(st.leftToLeft).toBe(0);
//     });
//
//     it("default test case3", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = undefined;
//         expect(isNaN(st.leftToLeft)).toBe(true);
//     });
//
//     it("default test case4", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = true;
//         expect(st.leftToLeft).toBe(1);
//     });
//
//     it("default test case5", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = "";
//         expect(st.leftToLeft).toBe(0);
//     });
//
//     it("default test case6", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = "abc";
//         expect(isNaN(st.leftToLeft)).toBe(true);
//     });
//
//     it("default test case7", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = 0;
//         expect(st.leftToLeft).toBe(0);
//     });
//
//     it("default test case8", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = 1;
//         expect(st.leftToLeft).toBe(1);
//     });
//
//     it("default test case9", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = 500;
//         expect(st.leftToLeft).toBe(500);
//     });
//
//     it("default test case10", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = 50000000000000000;
//         expect(st.leftToLeft).toBe(50000000000000000);
//     });
//
//     it("default test case11", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = -1;
//         expect(st.leftToLeft).toBe(-1);
//     });
//
//     it("default test case12", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = -500;
//         expect(st.leftToLeft).toBe(-500);
//     });
//
//     it("default test case13", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = -50000000000000000;
//         expect(st.leftToLeft).toBe(-50000000000000000);
//     });
//
//     it("default test case14", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = {a:0};
//         expect(isNaN(st.leftToLeft)).toBe(true);
//     });
//
//     it("default test case15", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = function a(){};
//         expect(isNaN(st.leftToLeft)).toBe(true);
//     });
//
//     it("default test case16", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = [1];
//         expect(st.leftToLeft).toBe(1);
//     });
//
//     it("default test case17", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = [1,2];
//         expect(isNaN(st.leftToLeft)).toBe(true);
//     });
//
//     it("default test case18", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = {};
//         expect(isNaN(st.leftToLeft)).toBe(true);
//     });
//
//     it("default test case19", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = {toString:function () { return 1; } };
//         expect(st.leftToLeft).toBe(1);
//     });
//
//     it("default test case20", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = {toString:function () { return "10"; } };
//         expect(st.leftToLeft).toBe(10);
//     });
//
//     it("default test case21", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = {toString:function () { return "1a"; } };
//         expect(isNaN(st.leftToLeft)).toBe(true);
//     });
//
//     it("default test case22", function()
//     {
//         var st = new SoundTransform();
//         st.leftToLeft = new XML("<a>100</a>");
//         expect(st.leftToLeft).toBe(100);
//     });
//
// });
//
// describe("SoundTransform.js leftToRight test", function()
// {
//
//     it("default test case1", function()
//     {
//         var st = new SoundTransform();
//         expect(st.leftToRight).toBe(0);
//     });
//
//     it("default test case2", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = null;
//         expect(st.leftToRight).toBe(0);
//     });
//
//     it("default test case3", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = undefined;
//         expect(isNaN(st.leftToRight)).toBe(true);
//     });
//
//     it("default test case4", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = true;
//         expect(st.leftToRight).toBe(1);
//     });
//
//     it("default test case5", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = "";
//         expect(st.leftToRight).toBe(0);
//     });
//
//     it("default test case6", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = "abc";
//         expect(isNaN(st.leftToRight)).toBe(true);
//     });
//
//     it("default test case7", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = 0;
//         expect(st.leftToRight).toBe(0);
//     });
//
//     it("default test case8", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = 1;
//         expect(st.leftToRight).toBe(1);
//     });
//
//     it("default test case9", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = 500;
//         expect(st.leftToRight).toBe(500);
//     });
//
//     it("default test case10", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = 50000000000000000;
//         expect(st.leftToRight).toBe(50000000000000000);
//     });
//
//     it("default test case11", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = -1;
//         expect(st.leftToRight).toBe(-1);
//     });
//
//     it("default test case12", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = -500;
//         expect(st.leftToRight).toBe(-500);
//     });
//
//     it("default test case13", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = -50000000000000000;
//         expect(st.leftToRight).toBe(-50000000000000000);
//     });
//
//     it("default test case14", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = {a:0};
//         expect(isNaN(st.leftToRight)).toBe(true);
//     });
//
//     it("default test case15", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = function a(){};
//         expect(isNaN(st.leftToRight)).toBe(true);
//     });
//
//     it("default test case16", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = [1];
//         expect(st.leftToRight).toBe(1);
//     });
//
//     it("default test case17", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = [1,2];
//         expect(isNaN(st.leftToRight)).toBe(true);
//     });
//
//     it("default test case18", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = {};
//         expect(isNaN(st.leftToRight)).toBe(true);
//     });
//
//     it("default test case19", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = {toString:function () { return 1; } };
//         expect(st.leftToRight).toBe(1);
//     });
//
//     it("default test case20", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = {toString:function () { return "10"; } };
//         expect(st.leftToRight).toBe(10);
//     });
//
//     it("default test case21", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = {toString:function () { return "1a"; } };
//         expect(isNaN(st.leftToRight)).toBe(true);
//     });
//
//     it("default test case22", function()
//     {
//         var st = new SoundTransform();
//         st.leftToRight = new XML("<a>100</a>");
//         expect(st.leftToRight).toBe(100);
//     });
//
// });
//
// describe("SoundTransform.js pan test", function()
// {
//
//     it("default test case1", function()
//     {
//         var st = new SoundTransform();
//         expect(st.pan).toBe(0);
//     });
//
//     it("default test case2", function()
//     {
//         var st = new SoundTransform();
//         st.pan = null;
//         expect(st.pan).toBe(0);
//     });
//
//     it("default test case3", function()
//     {
//         var st = new SoundTransform();
//         st.pan = undefined;
//         expect(isNaN(st.pan)).toBe(true);
//     });
//
//     it("default test case4", function()
//     {
//         var st = new SoundTransform();
//         st.pan = true;
//         expect(st.pan).toBe(1);
//     });
//
//     it("default test case5", function()
//     {
//         var st = new SoundTransform();
//         st.pan = "";
//         expect(st.pan).toBe(0);
//     });
//
//     it("default test case6", function()
//     {
//         var st = new SoundTransform();
//         st.pan = "abc";
//         expect(isNaN(st.pan)).toBe(true);
//     });
//
//     it("default test case7", function()
//     {
//         var st = new SoundTransform();
//         st.pan = 0;
//         expect(st.pan).toBe(0);
//     });
//
//     it("default test case8", function()
//     {
//         var st = new SoundTransform();
//         st.pan = 1;
//         expect(st.pan).toBe(1);
//     });
//
//     it("default test case9", function()
//     {
//         var st = new SoundTransform();
//         st.pan = 500;
//         expect(isNaN(st.pan)).toBe(true);
//     });
//
//     it("default test case10", function()
//     {
//         var st = new SoundTransform();
//         st.pan = 50000000000000000;
//         expect(isNaN(st.pan)).toBe(true);
//     });
// //TODO 小数点以下誤差でる
// //     it("default test case11", function()
// //     {
// //         var st = new SoundTransform();
// //         st.pan = -1;
// //         expect(st.pan).toBe(-1.0000000000000004);
// //     });
//
//     it("default test case12", function()
//     {
//         var st = new SoundTransform();
//         st.pan = -500;
//         expect(st.pan).toBe(-500);
//     });
//     //TODO 小数点以下誤差でる
//     // it("default test case13", function()
//     // {
//     //     var st = new SoundTransform();
//     //     st.pan = -50000000000000000;
//     //     expect(st.pan).toBe(-49999999999999990);
//     // });
//
//     it("default test case14", function()
//     {
//         var st = new SoundTransform();
//         st.pan = {a:0};
//         expect(isNaN(st.pan)).toBe(true);
//     });
//
//     it("default test case15", function()
//     {
//         var st = new SoundTransform();
//         st.pan = function a(){};
//         expect(isNaN(st.pan)).toBe(true);
//     });
//
//     it("default test case16", function()
//     {
//         var st = new SoundTransform();
//         st.pan = [1];
//         expect(st.pan).toBe(1);
//     });
//
//     it("default test case17", function()
//     {
//         var st = new SoundTransform();
//         st.pan = [1,2];
//         expect(isNaN(st.pan)).toBe(true);
//     });
//
//     it("default test case18", function()
//     {
//         var st = new SoundTransform();
//         st.pan = {};
//         expect(isNaN(st.pan)).toBe(true);
//     });
//
//     it("default test case19", function()
//     {
//         var st = new SoundTransform();
//         st.pan = {toString:function () { return 1; } };
//         expect(st.pan).toBe(1);
//     });
//
//     it("default test case20", function()
//     {
//         var st = new SoundTransform();
//         st.pan = {toString:function () { return "10"; } };
//         expect(isNaN(st.pan)).toBe(true);
//     });
//
//     it("default test case21", function()
//     {
//         var st = new SoundTransform();
//         st.pan = {toString:function () { return "1a"; } };
//         expect(isNaN(st.pan)).toBe(true);
//     });
//
//     it("default test case22", function()
//     {
//         var st = new SoundTransform();
//         st.pan = new XML("<a>100</a>");
//         expect(isNaN(st.pan)).toBe(true);
//     });
//
// });
//
// describe("SoundTransform.js rightToLeft test", function()
// {
//
//     it("default test case1", function()
//     {
//         var st = new SoundTransform();
//         expect(st.rightToLeft).toBe(0);
//     });
//
//     it("default test case2", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = null;
//         expect(st.rightToLeft).toBe(0);
//     });
//
//     it("default test case3", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = undefined;
//         expect(isNaN(st.rightToLeft)).toBe(true);
//     });
//
//     it("default test case4", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = true;
//         expect(st.rightToLeft).toBe(1);
//     });
//
//     it("default test case5", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = "";
//         expect(st.rightToLeft).toBe(0);
//     });
//
//     it("default test case6", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = "abc";
//         expect(isNaN(st.rightToLeft)).toBe(true);
//     });
//
//     it("default test case7", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = 0;
//         expect(st.rightToLeft).toBe(0);
//     });
//
//     it("default test case8", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = 1;
//         expect(st.rightToLeft).toBe(1);
//     });
//
//     it("default test case9", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = 500;
//         expect(st.rightToLeft).toBe(500);
//     });
//
//     it("default test case10", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = 50000000000000000;
//         expect(st.rightToLeft).toBe(50000000000000000);
//     });
//
//     it("default test case11", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = -1;
//         expect(st.rightToLeft).toBe(-1);
//     });
//
//     it("default test case12", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = -500;
//         expect(st.rightToLeft).toBe(-500);
//     });
//
//     it("default test case13", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = -50000000000000000;
//         expect(st.rightToLeft).toBe(-50000000000000000);
//     });
//
//     it("default test case14", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = {a:0};
//         expect(isNaN(st.rightToLeft)).toBe(true);
//     });
//
//     it("default test case15", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = function a(){};
//         expect(isNaN(st.rightToLeft)).toBe(true);
//     });
//
//     it("default test case16", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = [1];
//         expect(st.rightToLeft).toBe(1);
//     });
//
//     it("default test case17", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = [1,2];
//         expect(isNaN(st.rightToLeft)).toBe(true);
//     });
//
//     it("default test case18", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = {};
//         expect(isNaN(st.rightToLeft)).toBe(true);
//     });
//
//     it("default test case19", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = {toString:function () { return 1; } };
//         expect(st.rightToLeft).toBe(1);
//     });
//
//     it("default test case20", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = {toString:function () { return "10"; } };
//         expect(st.rightToLeft).toBe(10);
//     });
//
//     it("default test case21", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = {toString:function () { return "1a"; } };
//         expect(isNaN(st.rightToLeft)).toBe(true);
//     });
//
//     it("default test case22", function()
//     {
//         var st = new SoundTransform();
//         st.rightToLeft = new XML("<a>100</a>");
//         expect(st.rightToLeft).toBe(100);
//     });
//
// });
//
// describe("SoundTransform.js rightToRight test", function()
// {
//
//     it("default test case1", function()
//     {
//         var st = new SoundTransform();
//         expect(st.rightToRight).toBe(1);
//     });
//
//     it("default test case2", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = null;
//         expect(st.rightToRight).toBe(0);
//     });
//
//     it("default test case3", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = undefined;
//         expect(isNaN(st.rightToRight)).toBe(true);
//     });
//
//     it("default test case4", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = true;
//         expect(st.rightToRight).toBe(1);
//     });
//
//     it("default test case5", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = "";
//         expect(st.rightToRight).toBe(0);
//     });
//
//     it("default test case6", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = "abc";
//         expect(isNaN(st.rightToRight)).toBe(true);
//     });
//
//     it("default test case7", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = 0;
//         expect(st.rightToRight).toBe(0);
//     });
//
//     it("default test case8", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = 1;
//         expect(st.rightToRight).toBe(1);
//     });
//
//     it("default test case9", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = 500;
//         expect(st.rightToRight).toBe(500);
//     });
//
//     it("default test case10", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = 50000000000000000;
//         expect(st.rightToRight).toBe(50000000000000000);
//     });
//
//     it("default test case11", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = -1;
//         expect(st.rightToRight).toBe(-1);
//     });
//
//     it("default test case12", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = -500;
//         expect(st.rightToRight).toBe(-500);
//     });
//
//     it("default test case13", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = -50000000000000000;
//         expect(st.rightToRight).toBe(-50000000000000000);
//     });
//
//     it("default test case14", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = {a:0};
//         expect(isNaN(st.rightToRight)).toBe(true);
//     });
//
//     it("default test case15", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = function a(){};
//         expect(isNaN(st.rightToRight)).toBe(true);
//     });
//
//     it("default test case16", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = [1];
//         expect(st.rightToRight).toBe(1);
//     });
//
//     it("default test case17", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = [1,2];
//         expect(isNaN(st.rightToRight)).toBe(true);
//     });
//
//     it("default test case18", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = {};
//         expect(isNaN(st.rightToRight)).toBe(true);
//     });
//
//     it("default test case19", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = {toString:function () { return 1; } };
//         expect(st.rightToRight).toBe(1);
//     });
//
//     it("default test case20", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = {toString:function () { return "10"; } };
//         expect(st.rightToRight).toBe(10);
//     });
//
//     it("default test case21", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = {toString:function () { return "1a"; } };
//         expect(isNaN(st.rightToRight)).toBe(true);
//     });
//
//     it("default test case22", function()
//     {
//         var st = new SoundTransform();
//         st.rightToRight = new XML("<a>100</a>");
//         expect(st.rightToRight).toBe(100);
//     });
//
// });
//
// describe("SoundTransform.js volume test", function()
// {
//
//     it("default test case1", function()
//     {
//         var st = new SoundTransform();
//         expect(st.volume).toBe(1);
//     });
//
//     it("default test case2", function()
//     {
//         var st = new SoundTransform();
//         st.volume = null;
//         expect(st.volume).toBe(0);
//     });
//
//     it("default test case3", function()
//     {
//         var st = new SoundTransform();
//         st.volume = undefined;
//         expect(isNaN(st.volume)).toBe(true);
//     });
//
//     it("default test case4", function()
//     {
//         var st = new SoundTransform();
//         st.volume = true;
//         expect(st.volume).toBe(1);
//     });
//
//     it("default test case5", function()
//     {
//         var st = new SoundTransform();
//         st.volume = "";
//         expect(st.volume).toBe(0);
//     });
//
//     it("default test case6", function()
//     {
//         var st = new SoundTransform();
//         st.volume = "abc";
//         expect(isNaN(st.volume)).toBe(true);
//     });
//
//     it("default test case7", function()
//     {
//         var st = new SoundTransform();
//         st.volume = 0;
//         expect(st.volume).toBe(0);
//     });
//
//     it("default test case8", function()
//     {
//         var st = new SoundTransform();
//         st.volume = 1;
//         expect(st.volume).toBe(1);
//     });
//
//     it("default test case9", function()
//     {
//         var st = new SoundTransform();
//         st.volume = 500;
//         expect(st.volume).toBe(500);
//     });
//
//     it("default test case10", function()
//     {
//         var st = new SoundTransform();
//         st.volume = 50000000000000000;
//         expect(st.volume).toBe(50000000000000000);
//     });
//
//     it("default test case11", function()
//     {
//         var st = new SoundTransform();
//         st.volume = -1;
//         expect(st.volume).toBe(-1);
//     });
//
//     it("default test case12", function()
//     {
//         var st = new SoundTransform();
//         st.volume = -500;
//         expect(st.volume).toBe(-500);
//     });
//
//     it("default test case13", function()
//     {
//         var st = new SoundTransform();
//         st.volume = -50000000000000000;
//         expect(st.volume).toBe(-50000000000000000);
//     });
//
//     it("default test case14", function()
//     {
//         var st = new SoundTransform();
//         st.volume = {a:0};
//         expect(isNaN(st.volume)).toBe(true);
//     });
//
//     it("default test case15", function()
//     {
//         var st = new SoundTransform();
//         st.volume = function a(){};
//         expect(isNaN(st.volume)).toBe(true);
//     });
//
//     it("default test case16", function()
//     {
//         var st = new SoundTransform();
//         st.volume = [1];
//         expect(st.volume).toBe(1);
//     });
//
//     it("default test case17", function()
//     {
//         var st = new SoundTransform();
//         st.volume = [1,2];
//         expect(isNaN(st.volume)).toBe(true);
//     });
//
//     it("default test case18", function()
//     {
//         var st = new SoundTransform();
//         st.volume = {};
//         expect(isNaN(st.volume)).toBe(true);
//     });
//
//     it("default test case19", function()
//     {
//         var st = new SoundTransform();
//         st.volume = {toString:function () { return 1; } };
//         expect(st.volume).toBe(1);
//     });
//
//     it("default test case20", function()
//     {
//         var st = new SoundTransform();
//         st.volume = {toString:function () { return "10"; } };
//         expect(st.volume).toBe(10);
//     });
//
//     it("default test case21", function()
//     {
//         var st = new SoundTransform();
//         st.volume = {toString:function () { return "1a"; } };
//         expect(isNaN(st.volume)).toBe(true);
//     });
//
//     it("default test case22", function()
//     {
//         var st = new SoundTransform();
//         st.volume = new XML("<a>100</a>");
//         expect(st.volume).toBe(100);
//     });
//
// });