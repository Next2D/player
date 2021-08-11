
describe("BitmapFilterType.js toString test", function()
{
    it("toString test success", function()
    {
        let filter = new BitmapFilterType();
        expect(filter.toString()).toBe("[object BitmapFilterType]");
    });

});

describe("BitmapFilterType.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(BitmapFilterType.toString()).toBe("[class BitmapFilterType]");
    });

});

describe("BitmapFilterType.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new BitmapFilterType();
        expect(object.namespace).toBe("next2d.filters.BitmapFilterType");
    });

    it("namespace test static", function()
    {
        expect(BitmapFilterType.namespace).toBe("next2d.filters.BitmapFilterType");
    });

});

describe("BitmapFilterType.js property test", function()
{

    it("FULL test", function ()
    {
        expect(BitmapFilterType.FULL).toBe("full");
    });

    it("INNER test", function ()
    {
        expect(BitmapFilterType.INNER).toBe("inner");
    });

    it("OUTER test", function ()
    {
        expect(BitmapFilterType.OUTER).toBe("outer");
    });

    it("instance test", function ()
    {
        expect(new BitmapFilterType() instanceof BitmapFilterType).toBe(true);
    });

});