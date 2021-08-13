
describe("TextFieldAutoSize.js toString test", function()
{
    it("toString test success", function()
    {
        let object = new TextFieldAutoSize();
        expect(object.toString()).toBe("[object TextFieldAutoSize]");
    });

});

describe("TextFieldAutoSize.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(TextFieldAutoSize.toString()).toBe("[class TextFieldAutoSize]");
    });

});

describe("TextFieldAutoSize.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new TextFieldAutoSize();
        expect(object.namespace).toBe("next2d.text.TextFieldAutoSize");
    });

    it("namespace test static", function()
    {
        expect(TextFieldAutoSize.namespace).toBe("next2d.text.TextFieldAutoSize");
    });

});

describe("TextFieldAutoSize.js property test", function()
{

    it("CENTER test", function ()
    {
        expect(TextFieldAutoSize.CENTER).toBe("center");
    });

    it("LEFT test", function ()
    {
        expect(TextFieldAutoSize.LEFT).toBe("left");
    });

    it("NONE test", function ()
    {
        expect(TextFieldAutoSize.NONE).toBe("none");
    });

    it("RIGHT test", function ()
    {
        expect(TextFieldAutoSize.RIGHT).toBe("right");
    });

    it("instance test", function ()
    {
        expect(new TextFieldAutoSize() instanceof TextFieldAutoSize).toBe(true);
    });

});