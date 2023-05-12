
describe("InterpolationMethod.js toString test", function()
{

    it("toString test", function ()
    {
        let object = new InterpolationMethod();
        expect(object.toString()).toBe("[object InterpolationMethod]");
    });

});

describe("InterpolationMethod.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(InterpolationMethod.toString()).toBe("[class InterpolationMethod]");
    });

});

describe("InterpolationMethod.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new InterpolationMethod();
        expect(object.namespace).toBe("next2d.display.InterpolationMethod");
    });

    it("namespace test static", function()
    {
        expect(InterpolationMethod.namespace).toBe("next2d.display.InterpolationMethod");
    });

});

describe("InterpolationMethod.js property test", function()
{

    it("LINEAR_RGB test", function ()
    {
        expect(InterpolationMethod.LINEAR_RGB).toBe("linearRGB");
    });

    it("RGB test", function ()
    {
        expect(InterpolationMethod.RGB).toBe("rgb");
    });

    it("instance test", function ()
    {
        expect(new InterpolationMethod() instanceof InterpolationMethod).toBe(true);
    });

});