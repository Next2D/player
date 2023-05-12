
describe("LoaderInfo.js toString test", function()
{

    it("toString test", function ()
    {
        let object = new LoaderInfo();
        expect(object.toString()).toBe("[object LoaderInfo]");
    });

});

describe("LoaderInfo.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(LoaderInfo.toString()).toBe("[class LoaderInfo]");
    });

});

describe("LoaderInfo.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new LoaderInfo();
        expect(object.namespace).toBe("next2d.display.LoaderInfo");
    });

    it("namespace test static", function()
    {
        expect(LoaderInfo.namespace).toBe("next2d.display.LoaderInfo");
    });

});
