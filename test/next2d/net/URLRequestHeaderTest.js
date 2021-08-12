
describe("URLRequestHeader.js toString test", function()
{
    it("toString test success", function()
    {
        expect(new URLRequestHeader().toString()).toBe("[object URLRequestHeader]");
    });

});

describe("URLRequestHeader.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(`${URLRequestHeader}`).toBe("[class URLRequestHeader]");
    });

});

describe("URLRequestHeader.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new URLRequestHeader();
        expect(object.namespace).toBe("next2d.net.URLRequestHeader");
    });

    it("namespace test static", function()
    {
        expect(URLRequestHeader.namespace).toBe("next2d.net.URLRequestHeader");
    });

});

describe("URLRequestHeader.js property valid test", function()
{
    it("constructor success case1", function ()
    {
        const h = new URLRequestHeader("1", "2");
        expect(h.name).toBe("1");
        expect(h.value).toBe("2");
    });

    it("constructor valid case1", function ()
    {
        const h = new URLRequestHeader(1, 2);
        expect(h.name).toBe("1");
        expect(h.value).toBe("2");
    });
});