
describe("URLLoaderDataFormat.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new URLLoaderDataFormat();
        expect(object.namespace).toBe("next2d.net.URLLoaderDataFormat");
    });

    it("namespace test static", function()
    {
        expect(URLLoaderDataFormat.namespace).toBe("next2d.net.URLLoaderDataFormat");
    });

});

describe("URLLoaderDataFormat.js toString test", function()
{
    it("toString test success", function()
    {
        expect(new URLLoaderDataFormat().toString()).toBe("[object URLLoaderDataFormat]");
    });

});

describe("URLLoaderDataFormat.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(URLLoaderDataFormat.toString()).toBe("[class URLLoaderDataFormat]");
    });

});

describe("URLLoaderDataFormat.js property test", function()
{

    it("ARRAY_BUFFER test", function ()
    {
        expect(URLLoaderDataFormat.ARRAY_BUFFER).toBe("arraybuffer");
    });

    it("JSON test", function ()
    {
        expect(URLLoaderDataFormat.JSON).toBe("json");
    });

    it("STRING test", function ()
    {
        expect(URLLoaderDataFormat.STRING).toBe("string");
    });

    it("VARIABLES test", function ()
    {
        expect(URLLoaderDataFormat.VARIABLES).toBe("variables");
    });

    it("instance test", function ()
    {
        expect(new URLLoaderDataFormat() instanceof URLLoaderDataFormat).toBe(true);
    });

});