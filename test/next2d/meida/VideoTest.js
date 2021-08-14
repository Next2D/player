//
//
// describe("Video.js getQualifiedClassName test", function()
// {
//
//     it("getQualifiedClassName test public", function()
//     {
//         var swf2js = new Swf2js();
//         var str = swf2js.flash.utils.getQualifiedClassName(new Video());
//         expect(str).toBe("flash.media::Video");
//     });
//
//     it("getQualifiedClassName test static", function()
//     {
//         var swf2js = new Swf2js();
//         var str = swf2js.flash.utils.getQualifiedClassName(Video);
//         expect(str).toBe("flash.media::Video");
//     });
//
// });
//
//
// describe("Video.js toString test", function()
// {
//     it("toString test success", function()
//     {
//         var filter = new Video();
//         expect(filter.toString()).toBe("[object Video]");
//     });
//
// });
//
// describe("Video.js static toString test", function()
// {
//
//     it("static toString test", function()
//     {
//         expect(Util.$toString(Video)).toBe("[class Video]");
//     });
//
// });
//
// describe("Video.js smoothing test", function()
// {
//
//     it("default test case1", function()
//     {
//         var vi = new Video();
//         expect(vi.smoothing).toBe(false);
//     });
//
//     it("default test case2", function()
//     {
//         var vi = new Video();
//         vi.smoothing = null;
//         expect(vi.smoothing).toBe(false);
//     });
//
//     it("default test case3", function()
//     {
//         var vi = new Video();
//         vi.smoothing = undefined;
//         expect(vi.smoothing).toBe(false);
//     });
//
//     it("default test case4", function()
//     {
//         var vi = new Video();
//         vi.smoothing = true;
//         expect(vi.smoothing).toBe(true);
//     });
//
//     it("default test case5", function()
//     {
//         var vi = new Video();
//         vi.smoothing = "";
//         expect(vi.smoothing).toBe(false);
//     });
//
//     it("default test case6", function()
//     {
//         var vi = new Video();
//         vi.smoothing = "abc";
//         expect(vi.smoothing).toBe(true);
//     });
//
//     it("default test case7", function()
//     {
//         var vi = new Video();
//         vi.smoothing = 0;
//         expect(vi.smoothing).toBe(false);
//     });
//
//     it("default test case8", function()
//     {
//         var vi = new Video();
//         vi.smoothing = 1;
//         expect(vi.smoothing).toBe(true);
//     });
//
//     it("default test case9", function()
//     {
//         var vi = new Video();
//         vi.smoothing = {a:0};
//         expect(vi.smoothing).toBe(true);
//     });
//
//     it("default test case10", function()
//     {
//         var vi = new Video();
//         vi.smoothing = function a(){};
//         expect(vi.smoothing).toBe(true);
//     });
//
// });