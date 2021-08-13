
describe("StageQuality.js toString test", function()
{

    // toString
    it("toString test success", function ()
    {
        let object = new StageQuality();
        expect(object.toString()).toBe("[object StageQuality]");
    });

});

describe("StageQuality.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(StageQuality.toString()).toBe("[class StageQuality]");
    });

});

describe("StageQuality.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new StageQuality();
        expect(object.namespace).toBe("next2d.display.StageQuality");
    });

    it("namespace test static", function()
    {
        expect(StageQuality.namespace).toBe("next2d.display.StageQuality");
    });

});

describe("StageQuality.js property test", function()
{

    it("HIGH test", function ()
    {
        expect(StageQuality.HIGH).toBe("high");
    });

    it("LOW test", function ()
    {
        expect(StageQuality.LOW).toBe("low");
    });

    it("MEDIUM test", function ()
    {
        expect(StageQuality.MEDIUM).toBe("medium");
    });

    it("instance test", function ()
    {
        expect(new StageQuality() instanceof StageQuality).toBe(true);
    });

});