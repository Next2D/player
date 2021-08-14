//
//
// describe("Sound.js getQualifiedClassName test", function()
// {
//
//     it("getQualifiedClassName test public", function()
//     {
//         var swf2js = new Swf2js();
//         var str = swf2js.flash.utils.getQualifiedClassName(new Sound());
//         expect(str).toBe("flash.media::Sound");
//     });
//
//     it("getQualifiedClassName test static", function()
//     {
//         var swf2js = new Swf2js();
//         var str = swf2js.flash.utils.getQualifiedClassName(Sound);
//         expect(str).toBe("flash.media::Sound");
//     });
//
// });
//
//
// describe("Sound.js toString test", function()
// {
//     it("toString test success", function()
//     {
//         var filter = new Sound();
//         expect(filter.toString()).toBe("[object Sound]");
//     });
//
// });
//
// describe("Sound.js static toString test", function()
// {
//
//     it("static toString test", function()
//     {
//         expect(Util.$toString(Sound)).toBe("[class Sound]");
//     });
//
// });