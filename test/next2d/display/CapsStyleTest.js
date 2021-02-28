

describe("CapsStyle.js toString test", function()
{
    it("toString test success", function()
    {
        const object = new CapsStyle();
        expect(object.toString()).toBe("[object CapsStyle]");
    });

});

describe("CapsStyle.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(CapsStyle.toString()).toBe("[class CapsStyle]");
    });

});


describe("CapsStyle.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new CapsStyle();
        expect(object.namespace).toBe("next2d.display:CapsStyle");
    });

    it("namespace test static", function()
    {
        expect(CapsStyle.namespace).toBe("next2d.display:CapsStyle");
    });

});


describe("CapsStyle.js property test", function()
{

    it("NONE test", function () 
    {
        expect(CapsStyle.NONE).toBe("none");
    });

    it("ROUND test", function () 
    {
        expect(CapsStyle.ROUND).toBe("round");
    });

    it("SQUARE test", function () 
    {
        expect(CapsStyle.SQUARE).toBe("square");
    });

    it("instance test", function ()
    {
        expect(new CapsStyle() instanceof CapsStyle).toBe(true);
    });

});