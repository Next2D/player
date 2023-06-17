import {URLRequest} from "../../../src/player/next2d/net/URLRequest";
import {URLRequestHeader} from "../../../src/player/next2d/net/URLRequestHeader";

describe("URLRequest.js toString test", () =>
{
    it("toString test success", () =>
    {
        expect(new URLRequest().toString()).toBe("[object URLRequest]");
    });
});

describe("URLRequest.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(`${URLRequest}`).toBe("[class URLRequest]");
    });

});

describe("URLRequest.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new URLRequest();
        expect(object.namespace).toBe("next2d.net.URLRequest");
    });

    it("namespace test static", () =>
    {
        expect(URLRequest.namespace).toBe("next2d.net.URLRequest");
    });

});

describe("URLRequest.js properties test", () =>
{
    it("contentType success", () =>
    {
        let req = new URLRequest();
        req.contentType = "text/html; charset=utf-8";
        expect(req.contentType).toBe("text/html; charset=utf-8");
    });

    it("contentType valid", () =>
    {
        let req = new URLRequest();
        // @ts-ignore
        req.contentType = 100;
        expect(req.contentType).toBe("100");
    });

    it("data success case1", () =>
    {
        let req  = new URLRequest();
        // @ts-ignore
        req.data = 100;
        expect(req.data).toBe(100);
    });

    it("data success case2", () =>
    {
        let req = new URLRequest();
        req.data = "data";
        expect(req.data).toBe("data");
    });

    it("data success case3", () =>
    {
        let req = new URLRequest();
        req.data = 0;
        expect(req.data).toBe(0);
    });

    it("method success", () =>
    {
        let req    = new URLRequest();
        req.method = "POST";
        expect(req.method).toBe("POST");
    });

    it("requestHeaders success", () =>
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

    it("url success", () =>
    {
        let req = new URLRequest();
        req.url = "http://test.com";
        expect(req.url).toBe("http://test.com");
    });

});

describe("URLRequest.js contentType test", () =>
{

    it("default test case1", () =>
    {
        let ur = new URLRequest();
        expect(ur.contentType).toBe("application/json");
    });

    it("default test case2", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.contentType = null;
        expect(ur.contentType).toBe("null");
    });

    it("default test case3", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.contentType = undefined;
        expect(ur.contentType).toBe("undefined");
    });

    it("default test case4", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.contentType = true;
        expect(ur.contentType).toBe("true");
    });

    it("default test case5", () =>
    {
        let ur = new URLRequest();
        ur.contentType = "";
        expect(ur.contentType).toBe("");
    });

    it("default test case6", () =>
    {
        let ur = new URLRequest();
        ur.contentType = "abc";
        expect(ur.contentType).toBe("abc");
    });

    it("default test case7", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.contentType = 0;
        expect(ur.contentType).toBe("0");
    });

    it("default test case8", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.contentType = 1;
        expect(ur.contentType).toBe("1");
    });

    it("default test case9", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.contentType = 500;
        expect(ur.contentType).toBe("500");
    });

    it("default test case10", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.contentType = 50000000000000000;
        expect(ur.contentType).toBe("50000000000000000");
    });

    it("default test case11", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.contentType = -1;
        expect(ur.contentType).toBe("-1");
    });

    it("default test case12", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.contentType = -500;
        expect(ur.contentType).toBe("-500");
    });

    it("default test case13", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.contentType = -50000000000000000;
        expect(ur.contentType).toBe("-50000000000000000");
    });

    it("default test case14", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.contentType = { "a":0 };
        expect(ur.contentType).toBe("[object Object]");
    });

    it("default test case15", () =>
    {
        let test = () => {};
        test.toString = () => { return "test" };

        let ur = new URLRequest();
        // @ts-ignore
        ur.contentType = test;
        expect(ur.contentType).toBe("test");
    });

    it("default test case16", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.contentType = [1];
        expect(ur.contentType).toBe("1");
    });

    it("default test case17", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.contentType = [1,2];
        expect(ur.contentType).toBe("1,2");
    });

    it("default test case18", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.contentType = {};
        expect(ur.contentType).toBe("[object Object]");
    });

    it("default test case19", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.contentType = { "toString":() => { return 1 } };
        expect(ur.contentType).toBe("1");
    });

    it("default test case20", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.contentType = { "toString":() => { return "10" } };
        expect(ur.contentType).toBe("10");
    });

    it("default test case21", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.contentType = { "toString":() => { return "1a" } };
        expect(ur.contentType).toBe("1a");
    });

});

describe("URLRequest.js url test", () =>
{
    it("default test case1", () =>
    {
        let ur = new URLRequest();
        expect(ur.url).toBe("");
    });

    it("default test case2", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.url = null;
        expect(ur.url).toBe("null");
    });

    it("default test case3", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.url = undefined;
        expect(ur.url).toBe("undefined");
    });

    it("default test case4", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.url = true;
        expect(ur.url).toBe("true");
    });

    it("default test case5", () =>
    {
        let ur = new URLRequest();
        ur.url = "";
        expect(ur.url).toBe("");
    });

    it("default test case6", () =>
    {
        let ur = new URLRequest();
        ur.url = "abc";
        expect(ur.url).toBe("abc");
    });

    it("default test case7", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.url = 0;
        expect(ur.url).toBe("0");
    });

    it("default test case8", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.url = 1;
        expect(ur.url).toBe("1");
    });

    it("default test case9", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.url = 500;
        expect(ur.url).toBe("500");
    });

    it("default test case10", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.url = 50000000000000000;
        expect(ur.url).toBe("50000000000000000");
    });

    it("default test case11", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.url = -1;
        expect(ur.url).toBe("-1");
    });

    it("default test case12", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.url = -500;
        expect(ur.url).toBe("-500");
    });

    it("default test case13", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.url = -50000000000000000;
        expect(ur.url).toBe("-50000000000000000");
    });

    it("default test case14", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.url = { "a":0 };
        expect(ur.url).toBe("[object Object]");
    });

    it("default test case15", () =>
    {
        let test = () => {};
        test.toString = () => { return "test" };

        let ur = new URLRequest();
        // @ts-ignore
        ur.url = test;
        expect(ur.url).toBe("test");
    });

    it("default test case16", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.url = [1];
        expect(ur.url).toBe("1");
    });

    it("default test case17", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.url = [1,2];
        expect(ur.url).toBe("1,2");
    });

    it("default test case18", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.url = {};
        expect(ur.url).toBe("[object Object]");
    });

    it("default test case19", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.url = { "toString":() => { return 1 } };
        expect(ur.url).toBe("1");
    });

    it("default test case20", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.url = { "toString":() => { return "10" } };
        expect(ur.url).toBe("10");
    });

    it("default test case21", () =>
    {
        let ur = new URLRequest();
        // @ts-ignore
        ur.url = { "toString":() => { return "1a" } };
        expect(ur.url).toBe("1a");
    });

});
