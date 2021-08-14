//
// describe("Loader.js toString test", function()
// {
//
//     it("toString test", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var g = new Loader();
//         expect(g.toString()).toBe("[object Loader]");
//     });
//
// });
//
// describe("Loader.js static toString test", function()
// {
//
//     it("static toString test", function()
//     {
//         expect(Util.$toString(Loader)).toBe("[class Loader]");
//     });
//
// });
//
//
// describe("Loader.js getQualifiedClassName test", function()
// {
//
//     it("getQualifiedClassName test public", function()
//     {
//         var swf2js = new Swf2js();
//         var str = swf2js.flash.utils.getQualifiedClassName(new Loader());
//         expect(str).toBe("flash.display::Loader");
//     });
//
//     it("getQualifiedClassName test static", function()
//     {
//         var swf2js = new Swf2js();
//         var str = swf2js.flash.utils.getQualifiedClassName(Loader);
//         expect(str).toBe("flash.display::Loader");
//     });
//
// });