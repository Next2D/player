
describe("JointStyle.js toString test", function()
{

    it("toString test", function ()
    {
        const object = new JointStyle();
        expect(object.toString()).toBe("[object JointStyle]");
    });

});

describe("JointStyle.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(JointStyle.toString()).toBe("[class JointStyle]");
    });

});


describe("JointStyle.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new JointStyle();
        expect(object.namespace).toBe("next2d.display.JointStyle");
    });

    it("namespace test static", function()
    {
        expect(JointStyle.namespace).toBe("next2d.display.JointStyle");
    });

});


describe("JointStyle.js property test", function()
{

    it("BEVEL test", function () 
    {
        expect(JointStyle.BEVEL).toBe("bevel");
    });

    it("MITER test", function () 
    {
        expect(JointStyle.MITER).toBe("miter");
    });

    it("ROUND test", function () 
    {
        expect(JointStyle.ROUND).toBe("round");
    });

    it("instance test", function ()
    {
        expect(new JointStyle() instanceof JointStyle).toBe(true);
    });

});