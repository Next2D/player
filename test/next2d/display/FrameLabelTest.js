
describe("FrameLabel.js toString test", function()
{

    // toString
    it("toString test success", function ()
    {
        var frameLabel = new FrameLabel("test", 10);
        expect(frameLabel.toString()).toBe("[object FrameLabel]");
    });

});

describe("FrameLabel.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(FrameLabel.toString()).toBe("[class FrameLabel]");
    });

});

describe("FrameLabel.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new FrameLabel();
        expect(object.namespace).toBe("next2d.display.FrameLabel");
    });

    it("namespace test static", function()
    {
        expect(FrameLabel.namespace).toBe("next2d.display.FrameLabel");
    });

});


describe("FrameLabel.js property test", function()
{

    // property
    it("property test", function()
    {
        var frameLabel = new FrameLabel("test", 10);

        expect(frameLabel.name).toBe("test");
        expect(frameLabel.frame).toBe(10);
    });

    // readonly
    it("property readonly test", function()
    {
        var frameLabel = new FrameLabel("testA", 10);
        frameLabel.name  = "test2";
        frameLabel.frame = 1;

        expect(frameLabel.name).toBe("testA");
        expect(frameLabel.frame).toBe(10);
    });

});
