

describe("URLRequestMethod.js toString test", function()
{
    it("toString test success", function()
    {
        const object = new URLRequestMethod();
        expect(object.toString()).toBe("[object URLRequestMethod]");
    });

});

describe("URLRequestMethod.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(`${URLRequestMethod}`).toBe("[class URLRequestMethod]");
    });

});


describe("BlendMode.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new URLRequestMethod();
        expect(object.namespace).toBe("next2d.net:URLRequestMethod");
    });

    it("namespace test static", function()
    {
        expect(URLRequestMethod.namespace).toBe("next2d.net:URLRequestMethod");
    });

});


describe("URLRequestMethod.js property test", function()
{

    it("GET test", function () 
    {
        expect(URLRequestMethod.GET).toBe("GET");
    });

    it("DELETE test", function () 
    {
        expect(URLRequestMethod.DELETE).toBe("DELETE");
    });

    it("HEAD test", function () 
    {
        expect(URLRequestMethod.HEAD).toBe("HEAD");
    });

    it("OPTIONS test", function () 
    {
        expect(URLRequestMethod.OPTIONS).toBe("OPTIONS");
    });

    it("POST test", function () 
    {
        expect(URLRequestMethod.POST).toBe("POST");
    });

    it("PUT test", function () 
    {
        expect(URLRequestMethod.PUT).toBe("PUT");
    });

    it("instance test", function ()
    {
        expect(new URLRequestMethod() instanceof URLRequestMethod).toBe(true);
    });

});