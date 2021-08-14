
describe("Shape.js toString test", function()
{

    // toString
    it("toString test success", function ()
    {
        let shape = new Shape();
        expect(shape.toString()).toBe("[object Shape]");
    });

});

describe("Shape.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(Shape.toString()).toBe("[class Shape]");
    });

});

describe("Shape.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new Shape();
        expect(object.namespace).toBe("next2d.display.Shape");
    });

    it("namespace test static", function()
    {
        expect(Shape.namespace).toBe("next2d.display.Shape");
    });

});

describe("Shape.js graphics test", function()
{

    it("graphics test case1", function()
    {
        expect(new Shape()._$graphics).toBe(null);
    });

    it("graphics test case2", function()
    {
        expect(new Shape().graphics instanceof Graphics).toBe(true);
    });

});

