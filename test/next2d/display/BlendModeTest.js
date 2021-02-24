

describe("BlendMode.js toString test", function()
{
    it("toString test success", function()
    {
        const object = new BlendMode();
        expect(object.toString()).toBe("[object BlendMode]");
    });

});

describe("BlendMode.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(`${BlendMode}`).toBe("[class BlendMode]");
    });

});


describe("BlendMode.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new BlendMode();
        expect(object.namespace).toBe("next2d.display:BlendMode");
    });

    it("namespace test static", function()
    {
        expect(BlendMode.namespace).toBe("next2d.display:BlendMode");
    });

});


describe("BlendMode.js property test", function()
{

    it("ADD test", function () 
    {
        expect(BlendMode.ADD).toBe("add");
    });

    it("ALPHA test", function () 
    {
        expect(BlendMode.ALPHA).toBe("alpha");
    });

    it("DARKEN test", function () 
    {
        expect(BlendMode.DARKEN).toBe("darken");
    });

    it("DIFFERENCE test", function () 
    {
        expect(BlendMode.DIFFERENCE).toBe("difference");
    });

    it("ERASE test", function () 
    {
        expect(BlendMode.ERASE).toBe("erase");
    });

    it("HARDLIGHT test", function () 
    {
        expect(BlendMode.HARDLIGHT).toBe("hardlight");
    });

    it("INVERT test", function () 
    {
        expect(BlendMode.INVERT).toBe("invert");
    });

    it("LAYER test", function () 
    {
        expect(BlendMode.LAYER).toBe("layer");
    });

    it("LIGHTEN test", function () 
    {
        expect(BlendMode.LIGHTEN).toBe("lighten");
    });

    it("MULTIPLY test", function () 
    {
        expect(BlendMode.MULTIPLY).toBe("multiply");
    });

    it("NORMAL test", function () 
    {
        expect(BlendMode.NORMAL).toBe("normal");
    });

    it("OVERLAY test", function () 
    {
        expect(BlendMode.OVERLAY).toBe("overlay");
    });

    it("SCREEN test", function () 
    {
        expect(BlendMode.SCREEN).toBe("screen");
    });

    it("SUBTRACT test", function () 
    {
        expect(BlendMode.SUBTRACT).toBe("subtract");
    });

    it("instance test", function ()
    {
        expect(new BlendMode() instanceof BlendMode).toBe(true);
    });

});