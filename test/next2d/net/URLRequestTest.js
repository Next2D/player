
describe("URLRequest.js toString test", function()
{
    it("toString test success", function()
    {
        expect(new URLRequest().toString()).toBe("[object URLRequest]");
    });

});

describe("URLRequest.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(`${URLRequest}`).toBe("[class URLRequest]");
    });

});

describe("URLRequest.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new URLRequest();
        expect(object.namespace).toBe("next2d.net.URLRequest");
    });

    it("namespace test static", function()
    {
        expect(URLRequest.namespace).toBe("next2d.net.URLRequest");
    });

});

describe("URLRequest.js properties test", function()
{
    beforeEach(function() {
        window.next2d = new Next2D();
        window.next2d._$player._$canvas = document.createElement("canvas");
    });

    
    it("contentType success", function ()
    {
        let req = new URLRequest();
        req.contentType = "text/html; charset=utf-8";
        expect(req.contentType).toBe("text/html; charset=utf-8");
    });

    it("contentType valid", function ()
    {
        let req = new URLRequest();
        req.contentType = 100;
        expect(req.contentType).toBe("100");
    });

    it("data success case1", function ()
    {
        let req  = new URLRequest();
        req.data = 100;
        expect(req.data).toBe(100);
    });

    it("data success case2", function ()
    {
        let req = new URLRequest();
        req.data = "data";
        expect(req.data).toBe("data");
    });

    it("data success case3", function ()
    {
        let req = new URLRequest();
        req.data = 0;
        expect(req.data).toBe(0);
    });

    it("digest success1", function ()
    {
        let req    = new URLRequest();
        req.digest = "abcd";
        expect(req.digest).toBe("abcd");
    });

    it("digest success2", function ()
    {
        let req    = new URLRequest();
        req.digest = "abcd";
        expect(req.digest).toBe("abcd");
    });

    it("followRedirects success", function ()
    {
        let req    = new URLRequest();
        req.followRedirects = false;
        expect(req.followRedirects).toBe(false);
    });

    it("method success", function ()
    {
        let req    = new URLRequest();
        req.method = URLRequestMethod.POST;
        expect(req.method).toBe(URLRequestMethod.POST);
    });

    it("method valid", function ()
    {
        let req    = new URLRequest();
        req.method = 123;
        expect(req.method).toBe(URLRequestMethod.GET);
    });

    it("requestHeaders success", function ()
    {
        let req = new URLRequest();

        req.requestHeaders = [
            new URLRequestHeader("test", "aaa")
        ];

        for (let i = 0; req.requestHeaders.length > i; i++) {
            let requestHeader = req.requestHeaders[i];
            expect(requestHeader.name).toBe("test");
            expect(requestHeader.value).toBe("aaa");
        }
    });

    it("requestHeaders valid", function ()
    {
        let req = new URLRequest();
        req.requestHeaders = new URLRequestHeader("test", "aaa");
        expect(req.requestHeaders.length).toBe(0);
    });

    it("url success", function ()
    {
        let req = new URLRequest();
        req.url = "http://test.com";
        expect(req.url).toBe("http://test.com");
    });

    it("url valid", function ()
    {
        let req = new URLRequest();
        req.url = 123;
        expect(req.url).toBe("123");
    });

    it("userAgent success", function ()
    {
        let req      = new URLRequest();
        req.userAgent = "iOS";
        expect(req.userAgent).toBe(navigator.userAgent);
    });

});

describe("URLRequest.js contentType test", function()
{

    it("default test case1", function()
    {
        let ur = new URLRequest();
        expect(ur.contentType).toBe("application/json");
    });

    it("default test case2", function()
    {
        let ur = new URLRequest();
        ur.contentType = null;
        expect(ur.contentType).toBe("null");
    });

    it("default test case3", function()
    {
        let ur = new URLRequest();
        ur.contentType = undefined;
        expect(ur.contentType).toBe("undefined");
    });

    it("default test case4", function()
    {
        let ur = new URLRequest();
        ur.contentType = true;
        expect(ur.contentType).toBe("true");
    });

    it("default test case5", function()
    {
        let ur = new URLRequest();
        ur.contentType = "";
        expect(ur.contentType).toBe("");
    });

    it("default test case6", function()
    {
        let ur = new URLRequest();
        ur.contentType = "abc";
        expect(ur.contentType).toBe("abc");
    });

    it("default test case7", function()
    {
        let ur = new URLRequest();
        ur.contentType = 0;
        expect(ur.contentType).toBe("0");
    });

    it("default test case8", function()
    {
        let ur = new URLRequest();
        ur.contentType = 1;
        expect(ur.contentType).toBe("1");
    });

    it("default test case9", function()
    {
        let ur = new URLRequest();
        ur.contentType = 500;
        expect(ur.contentType).toBe("500");
    });

    it("default test case10", function()
    {
        let ur = new URLRequest();
        ur.contentType = 50000000000000000;
        expect(ur.contentType).toBe("50000000000000000");
    });

    it("default test case11", function()
    {
        let ur = new URLRequest();
        ur.contentType = -1;
        expect(ur.contentType).toBe("-1");
    });

    it("default test case12", function()
    {
        let ur = new URLRequest();
        ur.contentType = -500;
        expect(ur.contentType).toBe("-500");
    });

    it("default test case13", function()
    {
        let ur = new URLRequest();
        ur.contentType = -50000000000000000;
        expect(ur.contentType).toBe("-50000000000000000");
    });

    it("default test case14", function()
    {
        let ur = new URLRequest();
        ur.contentType = { "a":0 };
        expect(ur.contentType).toBe("[object Object]");
    });

    it("default test case15", function()
    {
        let test = function () {};
        test.toString = function () { return "test" };

        let ur = new URLRequest();
        ur.contentType = test;
        expect(ur.contentType).toBe("test");
    });

    it("default test case16", function()
    {
        let ur = new URLRequest();
        ur.contentType = [1];
        expect(ur.contentType).toBe("1");
    });

    it("default test case17", function()
    {
        let ur = new URLRequest();
        ur.contentType = [1,2];
        expect(ur.contentType).toBe("1,2");
    });

    it("default test case18", function()
    {
        let ur = new URLRequest();
        ur.contentType = {};
        expect(ur.contentType).toBe("[object Object]");
    });

    it("default test case19", function()
    {
        let ur = new URLRequest();
        ur.contentType = { "toString":function () { return 1 } };
        expect(ur.contentType).toBe("1");
    });

    it("default test case20", function()
    {
        let ur = new URLRequest();
        ur.contentType = { "toString":function () { return "10" } };
        expect(ur.contentType).toBe("10");
    });

    it("default test case21", function()
    {
        let ur = new URLRequest();
        ur.contentType = { "toString":function () { return "1a" } };
        expect(ur.contentType).toBe("1a");
    });

});

describe("URLRequest.js url test", function()
{

    it("default test case1", function()
    {
        let ur = new URLRequest();
        expect(ur.url).toBe("");
    });

    it("default test case2", function()
    {
        let ur = new URLRequest();
        ur.url = null;
        expect(ur.url).toBe("null");
    });

    it("default test case3", function()
    {
        let ur = new URLRequest();
        ur.url = undefined;
        expect(ur.url).toBe("undefined");
    });

    it("default test case4", function()
    {
        let ur = new URLRequest();
        ur.url = true;
        expect(ur.url).toBe("true");
    });

    it("default test case5", function()
    {
        let ur = new URLRequest();
        ur.url = "";
        expect(ur.url).toBe("");
    });

    it("default test case6", function()
    {
        let ur = new URLRequest();
        ur.url = "abc";
        expect(ur.url).toBe("abc");
    });

    it("default test case7", function()
    {
        let ur = new URLRequest();
        ur.url = 0;
        expect(ur.url).toBe("0");
    });

    it("default test case8", function()
    {
        let ur = new URLRequest();
        ur.url = 1;
        expect(ur.url).toBe("1");
    });

    it("default test case9", function()
    {
        let ur = new URLRequest();
        ur.url = 500;
        expect(ur.url).toBe("500");
    });

    it("default test case10", function()
    {
        let ur = new URLRequest();
        ur.url = 50000000000000000;
        expect(ur.url).toBe("50000000000000000");
    });

    it("default test case11", function()
    {
        let ur = new URLRequest();
        ur.url = -1;
        expect(ur.url).toBe("-1");
    });

    it("default test case12", function()
    {
        let ur = new URLRequest();
        ur.url = -500;
        expect(ur.url).toBe("-500");
    });

    it("default test case13", function()
    {
        let ur = new URLRequest();
        ur.url = -50000000000000000;
        expect(ur.url).toBe("-50000000000000000");
    });

    it("default test case14", function()
    {
        let ur = new URLRequest();
        ur.url = { "a":0 };
        expect(ur.url).toBe("[object Object]");
    });

    it("default test case15", function()
    {
        let test = function () {};
        test.toString = function () { return "test" };

        let ur = new URLRequest();
        ur.url = test;
        expect(ur.url).toBe("test");
    });

    it("default test case16", function()
    {
        let ur = new URLRequest();
        ur.url = [1];
        expect(ur.url).toBe("1");
    });

    it("default test case17", function()
    {
        let ur = new URLRequest();
        ur.url = [1,2];
        expect(ur.url).toBe("1,2");
    });

    it("default test case18", function()
    {
        let ur = new URLRequest();
        ur.url = {};
        expect(ur.url).toBe("[object Object]");
    });

    it("default test case19", function()
    {
        let ur = new URLRequest();
        ur.url = { "toString":function () { return 1 } };
        expect(ur.url).toBe("1");
    });

    it("default test case20", function()
    {
        let ur = new URLRequest();
        ur.url = { "toString":function () { return "10" } };
        expect(ur.url).toBe("10");
    });

    it("default test case21", function()
    {
        let ur = new URLRequest();
        ur.url = { "toString":function () { return "1a" } };
        expect(ur.url).toBe("1a");
    });

});