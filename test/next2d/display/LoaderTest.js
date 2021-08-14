
describe("Loader.js toString test", function()
{

    it("toString test", function ()
    {
        expect(new Loader().toString()).toBe("[object Loader]");
    });

});

describe("Loader.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(Loader.toString()).toBe("[class Loader]");
    });

});

describe("Loader.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new Loader();
        expect(object.namespace).toBe("next2d.display.Loader");
    });

    it("namespace test static", function()
    {
        expect(Loader.namespace).toBe("next2d.display.Loader");
    });

});