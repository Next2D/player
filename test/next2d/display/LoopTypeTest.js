
describe("LoopType.js toString test", function()
{

    it("toString test", function ()
    {
        const object = new LoopType();
        expect(object.toString()).toBe("[object LoopType]");
    });

});

describe("LoopType.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(LoopType.toString()).toBe("[class LoopType]");
    });

});

describe("LoopType.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new LoopType();
        expect(object.namespace).toBe("next2d.display.LoopType");
    });

    it("namespace test static", function()
    {
        expect(LoopType.namespace).toBe("next2d.display.LoopType");
    });

});

describe("LoopType.js property test", function()
{

    it("REPEAT test", function ()
    {
        expect(LoopType.REPEAT).toBe(0);
    });

    it("NO_REPEAT test", function ()
    {
        expect(LoopType.NO_REPEAT).toBe(1);
    });

    it("FIXED test", function ()
    {
        expect(LoopType.FIXED).toBe(2);
    });

    it("FIXED test", function ()
    {
        expect(LoopType.NO_REPEAT_REVERSAL).toBe(3);
    });

    it("FIXED test", function ()
    {
        expect(LoopType.REPEAT_REVERSAL).toBe(4);
    });

    it("instance test", function ()
    {
        expect(new LoopType() instanceof LoopType).toBe(true);
    });

});
