
describe("TextFormatVerticalAlign.js toString test", function()
{
    it("toString test success", function()
    {
        let object = new TextFormatVerticalAlign();
        expect(object.toString()).toBe("[object TextFormatVerticalAlign]");
    });

});

describe("TextFormatVerticalAlign.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(TextFormatVerticalAlign.toString()).toBe("[class TextFormatVerticalAlign]");
    });

});

describe("TextFormatVerticalAlign.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new TextFormatVerticalAlign();
        expect(object.namespace).toBe("next2d.text.TextFormatVerticalAlign");
    });

    it("namespace test static", function()
    {
        expect(TextFormatVerticalAlign.namespace).toBe("next2d.text.TextFormatVerticalAlign");
    });

});

describe("TextFormatVerticalAlign.js property test", function()
{

    it("TOP test", function ()
    {
        expect(TextFormatVerticalAlign.TOP).toBe("top");
    });

    it("MIDDLE test", function ()
    {
        expect(TextFormatVerticalAlign.MIDDLE).toBe("middle");
    });

    it("BOTTOM test", function ()
    {
        expect(TextFormatVerticalAlign.BOTTOM).toBe("bottom");
    });

    it("instance test", function ()
    {
        expect(new TextFormatVerticalAlign() instanceof TextFormatVerticalAlign).toBe(true);
    });

});