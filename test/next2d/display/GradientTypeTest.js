

describe("GradientType.js toString test", function()
{
    it("toString test success", function()
    {
        const object = new GradientType();
        expect(object.toString()).toBe("[object GradientType]");
    });

});

describe("GradientType.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(GradientType.toString()).toBe("[class GradientType]");
    });

});


describe("GradientType.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new GradientType();
        expect(object.namespace).toBe("next2d.display:GradientType");
    });

    it("namespace test static", function()
    {
        expect(GradientType.namespace).toBe("next2d.display:GradientType");
    });

});


describe("GradientType.js property test", function()
{

    it("LINEAR test", function () 
    {
        expect(GradientType.LINEAR).toBe("linear");
    });

    it("RADIAL test", function () 
    {
        expect(GradientType.RADIAL).toBe("radial");
    });

});