
describe("SpreadMethod.js toString test", function()
{

    // toString
    it("toString test success", function ()
    {
        let object = new SpreadMethod();
        expect(object.toString()).toBe("[object SpreadMethod]");
    });

});

describe("SpreadMethod.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(SpreadMethod.toString()).toBe("[class SpreadMethod]");
    });

});

describe("SpreadMethod.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new SpreadMethod();
        expect(object.namespace).toBe("next2d.display.SpreadMethod");
    });

    it("namespace test static", function()
    {
        expect(SpreadMethod.namespace).toBe("next2d.display.SpreadMethod");
    });

});

describe("SpreadMethod.js property test", function()
{

    it("PAD test", function ()
    {
        expect(SpreadMethod.PAD).toBe("pad");
    });

    it("REFLECT test", function ()
    {
        expect(SpreadMethod.REFLECT).toBe("reflect");
    });

    it("REPEAT test", function ()
    {
        expect(SpreadMethod.REPEAT).toBe("repeat");
    });

    it("instance test", function ()
    {
        expect(new SpreadMethod() instanceof SpreadMethod).toBe(true);
    });

});