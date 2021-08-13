
describe("TextFormatAlign.js toString test", function()
{
    it("toString test success", function()
    {
        let object = new TextFormatAlign();
        expect(object.toString()).toBe("[object TextFormatAlign]");
    });

});

describe("TextFormatAlign.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(TextFormatAlign.toString()).toBe("[class TextFormatAlign]");
    });

});

describe("TextFormatAlign.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new TextFormatAlign();
        expect(object.namespace).toBe("next2d.text.TextFormatAlign");
    });

    it("namespace test static", function()
    {
        expect(TextFormatAlign.namespace).toBe("next2d.text.TextFormatAlign");
    });

});

describe("TextFormatAlign.js property test", function()
{

    it("CENTER test", function ()
    {
        expect(TextFormatAlign.CENTER).toBe("center");
    });

    it("LEFT test", function ()
    {
        expect(TextFormatAlign.LEFT).toBe("left");
    });

    it("RIGHT test", function ()
    {
        expect(TextFormatAlign.RIGHT).toBe("right");
    });

    it("instance test", function ()
    {
        expect(new TextFormatAlign() instanceof TextFormatAlign).toBe(true);
    });

});