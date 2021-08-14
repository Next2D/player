//
//
// describe("SoundMixer.js getQualifiedClassName test", function()
// {
//
//     it("getQualifiedClassName test public", function()
//     {
//         var swf2js = new Swf2js();
//         var str = swf2js.flash.utils.getQualifiedClassName(new SoundMixer());
//         expect(str).toBe("flash.media::SoundMixer");
//     });
//
//     it("getQualifiedClassName test static", function()
//     {
//         var swf2js = new Swf2js();
//         var str = swf2js.flash.utils.getQualifiedClassName(SoundMixer);
//         expect(str).toBe("flash.media::SoundMixer");
//     });
//
// });
//
//
// describe("SoundMixer.js toString test", function()
// {
//     it("toString test success", function()
//     {
//         var filter = new SoundMixer();
//         expect(filter.toString()).toBe("[object SoundMixer]");
//     });
//
// });
//
// describe("SoundMixer.js static toString test", function()
// {
//
//     it("static toString test", function()
//     {
//         expect(Util.$toString(SoundMixer)).toBe("[class SoundMixer]");
//     });
//
// });