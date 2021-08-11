
describe("BitmapFilterQuality.js toString test", function()
{
    it("toString test success", function()
    {
        let filter = new BitmapFilterQuality();
        expect(filter.toString()).toBe("[object BitmapFilterQuality]");
    });

});

describe("BitmapFilterQuality.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(BitmapFilterQuality.toString()).toBe("[class BitmapFilterQuality]");
    });

});

describe("BitmapFilterQuality.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new BitmapFilterQuality();
        expect(object.namespace).toBe("next2d.filters.BitmapFilterQuality");
    });

    it("namespace test static", function()
    {
        expect(BitmapFilterQuality.namespace).toBe("next2d.filters.BitmapFilterQuality");
    });

});

describe("BitmapFilterQuality.js property test", function()
{

    it("LOW test", function ()
    {
        expect(BitmapFilterQuality.LOW).toBe(1);
    });

    it("MEDIUM test", function ()
    {
        expect(BitmapFilterQuality.MEDIUM).toBe(2);
    });

    it("HIGH test", function ()
    {
        expect(BitmapFilterQuality.HIGH).toBe(3);
    });

    it("instance test", function ()
    {
        expect(new BitmapFilterQuality() instanceof BitmapFilterQuality).toBe(true);
    });

});