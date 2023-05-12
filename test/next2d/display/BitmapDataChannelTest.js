
describe("BitmapDataChannel.js toString test", function()
{
    it("toString test success", function()
    {
        let object = new BitmapDataChannel();
        expect(object.toString()).toBe("[object BitmapDataChannel]");
    });

});

describe("BitmapDataChannel.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(BitmapDataChannel.toString()).toBe("[class BitmapDataChannel]");
    });

});

describe("BitmapDataChannel.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new BitmapDataChannel();
        expect(object.namespace).toBe("next2d.display.BitmapDataChannel");
    });

    it("namespace test static", function()
    {
        expect(BitmapDataChannel.namespace).toBe("next2d.display.BitmapDataChannel");
    });

});

describe("BitmapDataChannel.js property test", function()
{

    it("ALPHA test", function ()
    {
        expect(BitmapDataChannel.ALPHA).toBe(8);
    });

    it("BLUE test", function ()
    {
        expect(BitmapDataChannel.BLUE).toBe(4);
    });

    it("GREEN test", function ()
    {
        expect(BitmapDataChannel.GREEN).toBe(2);
    });

    it("RED test", function ()
    {
        expect(BitmapDataChannel.RED).toBe(1);
    });

    it("instance test", function ()
    {
        expect(new BitmapDataChannel() instanceof BitmapDataChannel).toBe(true);
    });

});