import { BitmapFilter } from "../../../src/player/next2d/filters/BitmapFilter";

describe("BitmapFilter.js toString test", function()
{

    // toString
    it("toString test success", function()
    {
        let bitmapFilter = new BitmapFilter();
        expect(bitmapFilter.toString()).toBe("[object BitmapFilter]");
    });

});

describe("BitmapFilter.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(BitmapFilter.toString()).toBe("[class BitmapFilter]");
    });

});

describe("BitmapFilter.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new BitmapFilter();
        expect(object.namespace).toBe("next2d.filters.BitmapFilter");
    });

    it("namespace test static", function()
    {
        expect(BitmapFilter.namespace).toBe("next2d.filters.BitmapFilter");
    });

});