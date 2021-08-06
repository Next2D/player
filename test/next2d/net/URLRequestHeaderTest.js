
describe("URLRequestHeader.js toString test", function()
{
    it("toString test success", function()
    {
        const object = new URLRequestHeader();
        expect(object.toString()).toBe("[object URLRequestHeader]");
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

    it("property success case2", function () 
    {
        const h = new URLRequestHeader("a", "b");
        h.name  = "1";
        h.value = "2";
        expect(h.name).toBe("1");
        expect(h.value).toBe("2");
    });

    it("constructor valid case1", function ()
    {
        const h = new URLRequestHeader(1, 2);
        expect(h.name).toBe("1");
        expect(h.value).toBe("2");
    });

    it("property valid case2", function () 
    {
        const h   = new URLRequestHeader("a", "b");
        h.name  = 1;
        h.value = 2;
        expect(h.name).toBe("1");
        expect(h.value).toBe("2");
    });

    it("property valid case3", function () 
    {
        const h   = new URLRequestHeader();
        h.name  = 1;
        h.value = 2;
        expect(h.name).toBe("1");
        expect(h.value).toBe("2");
    });
});

describe("URLRequestHeader.js name test", function()
{

    it("default test case1", function()
    {
        const urh = new URLRequestHeader();
        expect(urh.name).toBe("");
    });

    it("default test case2", function()
    {
        const urh = new URLRequestHeader();
        urh.name = null;
        expect(urh.name).toBe("null");
    });

    it("default test case3", function()
    {
        const urh = new URLRequestHeader();
        urh.name = undefined;
        expect(urh.name).toBe("undefined");
    });

    it("default test case4", function()
    {
        const urh = new URLRequestHeader();
        urh.name = true;
        expect(urh.name).toBe("true");
    });

    it("default test case5", function()
    {
        const urh = new URLRequestHeader();
        urh.name = "";
        expect(urh.name).toBe("");
    });

    it("default test case6", function()
    {
        const urh = new URLRequestHeader();
        urh.name = "abc";
        expect(urh.name).toBe("abc");
    });

    it("default test case7", function()
    {
        const urh = new URLRequestHeader();
        urh.name = 0;
        expect(urh.name).toBe("0");
    });

    it("default test case8", function()
    {
        const urh = new URLRequestHeader();
        urh.name = 1;
        expect(urh.name).toBe("1");
    });

    it("default test case9", function()
    {
        const urh = new URLRequestHeader();
        urh.name = 500;
        expect(urh.name).toBe("500");
    });

    it("default test case10", function()
    {
        const urh = new URLRequestHeader();
        urh.name = 50000000000000000;
        expect(urh.name).toBe("50000000000000000");
    });

    it("default test case11", function()
    {
        const urh = new URLRequestHeader();
        urh.name = -1;
        expect(urh.name).toBe("-1");
    });

    it("default test case12", function()
    {
        var urh = new URLRequestHeader();
        urh.name = -500;
        expect(urh.name).toBe("-500");
    });

    it("default test case13", function()
    {
        const urh = new URLRequestHeader();
        urh.name = -50000000000000000;
        expect(urh.name).toBe("-50000000000000000");
    });

    it("default test case14", function()
    {
        const urh = new URLRequestHeader();
        urh.name = {a:0};
        expect(urh.name).toBe("[object Object]");
    });

    it("default test case15", function()
    {
        const test = function () {};
        test.toString = function () { return "test" };

        const urh = new URLRequestHeader();
        urh.name = test;
        expect(urh.name).toBe("test");
    });

    it("default test case16", function()
    {
        const urh = new URLRequestHeader();
        urh.name = [1];
        expect(urh.name).toBe("1");
    });

    it("default test case17", function()
    {
        const urh = new URLRequestHeader();
        urh.name = [1,2];
        expect(urh.name).toBe("1,2");
    });

    it("default test case18", function()
    {
        const urh = new URLRequestHeader();
        urh.name = {};
        expect(urh.name).toBe("[object Object]");
    });

    it("default test case19", function()
    {
        const urh = new URLRequestHeader();
        urh.name = {toString:function () { return 1; } };
        expect(urh.name).toBe("1");
    });

    it("default test case20", function()
    {
        const urh = new URLRequestHeader();
        urh.name = {toString:function () { return "10"; } };
        expect(urh.name).toBe("10");
    });

    it("default test case21", function()
    {
        const urh = new URLRequestHeader();
        urh.name = {toString:function () { return "1a"; } };
        expect(urh.name).toBe("1a");
    });

});

describe("URLRequestHeader.js value test", function()
{

    it("default test case1", function()
    {
        const urh = new URLRequestHeader();
        expect(urh.value).toBe("");
    });

    it("default test case2", function()
    {
        const urh = new URLRequestHeader();
        urh.value = null;
        expect(urh.value).toBe("null");
    });

    it("default test case3", function()
    {
        const urh = new URLRequestHeader();
        urh.value = undefined;
        expect(urh.value).toBe("undefined");
    });

    it("default test case4", function()
    {
        const urh = new URLRequestHeader();
        urh.value = true;
        expect(urh.value).toBe("true");
    });

    it("default test case5", function()
    {
        const urh = new URLRequestHeader();
        urh.value = "";
        expect(urh.value).toBe("");
    });

    it("default test case6", function()
    {
        const urh = new URLRequestHeader();
        urh.value = "abc";
        expect(urh.value).toBe("abc");
    });

    it("default test case7", function()
    {
        const urh = new URLRequestHeader();
        urh.value = 0;
        expect(urh.value).toBe("0");
    });

    it("default test case8", function()
    {
        const urh = new URLRequestHeader();
        urh.value = 1;
        expect(urh.value).toBe("1");
    });

    it("default test case9", function()
    {
        const urh = new URLRequestHeader();
        urh.value = 500;
        expect(urh.value).toBe("500");
    });

    it("default test case10", function()
    {
        const urh = new URLRequestHeader();
        urh.value = 50000000000000000;
        expect(urh.value).toBe("50000000000000000");
    });

    it("default test case11", function()
    {
        const urh = new URLRequestHeader();
        urh.value = -1;
        expect(urh.value).toBe("-1");
    });

    it("default test case12", function()
    {
        const urh = new URLRequestHeader();
        urh.value = -500;
        expect(urh.value).toBe("-500");
    });

    it("default test case13", function()
    {
        const urh = new URLRequestHeader();
        urh.value = -50000000000000000;
        expect(urh.value).toBe("-50000000000000000");
    });

    it("default test case14", function()
    {
        const urh = new URLRequestHeader();
        urh.value = {a:0};
        expect(urh.value).toBe("[object Object]");
    });

    it("default test case15", function()
    {
        const test = function () {};
        test.toString = function () { return "test" };

        const urh = new URLRequestHeader();
        urh.value = test;
        expect(urh.value).toBe("test");
    });

    it("default test case16", function()
    {
        const urh = new URLRequestHeader();
        urh.value = [1];
        expect(urh.value).toBe("1");
    });

    it("default test case17", function()
    {
        const urh = new URLRequestHeader();
        urh.value = [1,2];
        expect(urh.value).toBe("1,2");
    });

    it("default test case18", function()
    {
        const urh = new URLRequestHeader();
        urh.value = {};
        expect(urh.value).toBe("[object Object]");
    });

    it("default test case19", function()
    {
        const urh = new URLRequestHeader();
        urh.value = {toString:function () { return 1; } };
        expect(urh.value).toBe("1");
    });

    it("default test case20", function()
    {
        const urh = new URLRequestHeader();
        urh.value = {toString:function () { return "10"; } };
        expect(urh.value).toBe("10");
    });

    it("default test case21", function()
    {
        const urh = new URLRequestHeader();
        urh.value = {toString:function () { return "1a"; } };
        expect(urh.value).toBe("1a");
    });

});