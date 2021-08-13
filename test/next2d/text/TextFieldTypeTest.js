
describe("TextFieldType.js toString test", function()
{
    it("toString test success", function()
    {
        let object = new TextFieldType();
        expect(object.toString()).toBe("[object TextFieldType]");
    });

});

describe("TextFieldType.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(TextFieldType.toString()).toBe("[class TextFieldType]");
    });

});

describe("TextFieldType.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new TextFieldType();
        expect(object.namespace).toBe("next2d.text.TextFieldType");
    });

    it("namespace test static", function()
    {
        expect(TextFieldType.namespace).toBe("next2d.text.TextFieldType");
    });

});

describe("TextFieldType.js property test", function()
{

    it("DYNAMIC test", function ()
    {
        expect(TextFieldType.DYNAMIC).toBe("dynamic");
    });

    it("INPUT test", function ()
    {
        expect(TextFieldType.STATIC).toBe("static");
    });

    it("instance test", function ()
    {
        expect(new TextFieldType() instanceof TextFieldType).toBe(true);
    });

});