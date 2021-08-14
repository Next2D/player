
describe("InteractiveObject.js toString test", function()
{

    it("toString test", function ()
    {
        let object = new InteractiveObject();
        expect(object.toString()).toBe("[object InteractiveObject]");
    });

});

describe("InteractiveObject.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(InteractiveObject.toString()).toBe("[class InteractiveObject]");
    });

});

describe("InteractiveObject.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new InteractiveObject();
        expect(object.namespace).toBe("next2d.display.InteractiveObject");
    });

    it("namespace test static", function()
    {
        expect(InteractiveObject.namespace).toBe("next2d.display.InteractiveObject");
    });

});

describe("InteractiveObject.js mouseEnabled test", function()
{

    it("default test case1", function()
    {
        let io = new InteractiveObject();
        expect(io.mouseEnabled).toBe(true);
    });

    it("default test case2", function()
    {
        let io = new InteractiveObject();
        io.mouseEnabled = null;
        expect(io.mouseEnabled).toBe(false);
    });

    it("default test case3", function()
    {
        let io = new InteractiveObject();
        io.mouseEnabled = undefined;
        expect(io.mouseEnabled).toBe(false);
    });

    it("default test case4", function()
    {
        let io = new InteractiveObject();
        io.mouseEnabled = true;
        expect(io.mouseEnabled).toBe(true);
    });

    it("default test case5", function()
    {
        let io = new InteractiveObject();
        io.mouseEnabled = "";
        expect(io.mouseEnabled).toBe(false);
    });

    it("default test case6", function()
    {
        let io = new InteractiveObject();
        io.mouseEnabled = "abc";
        expect(io.mouseEnabled).toBe(true);
    });

    it("default test case7", function()
    {
        let io = new InteractiveObject();
        io.mouseEnabled = 0;
        expect(io.mouseEnabled).toBe(false);
    });

    it("default test case8", function()
    {
        let io = new InteractiveObject();
        io.mouseEnabled = 1;
        expect(io.mouseEnabled).toBe(true);
    });

    it("default test case9", function()
    {
        let io = new InteractiveObject();
        io.mouseEnabled = 500;
        expect(io.mouseEnabled).toBe(true);
    });

    it("default test case10", function()
    {
        let io = new InteractiveObject();
        io.mouseEnabled = -1;
        expect(io.mouseEnabled).toBe(true);
    });

    it("default test case11", function()
    {
        let io = new InteractiveObject();
        io.mouseEnabled = -500;
        expect(io.mouseEnabled).toBe(true);
    });

    it("default test case12", function()
    {
        let io = new InteractiveObject();
        io.mouseEnabled = { "a":0 };
        expect(io.mouseEnabled).toBe(true);
    });

    it("default test case13", function()
    {
        let io = new InteractiveObject();
        io.mouseEnabled = function a() {};
        expect(io.mouseEnabled).toBe(true);
    });

    it("default test case14", function()
    {
        let io = new InteractiveObject();
        io.mouseEnabled = [1];
        expect(io.mouseEnabled).toBe(true);
    });

    it("default test case15", function()
    {
        let io = new InteractiveObject();
        io.mouseEnabled = [1,2];
        expect(io.mouseEnabled).toBe(true);
    });

    it("default test case16", function()
    {
        let io = new InteractiveObject();
        io.mouseEnabled = {};
        expect(io.mouseEnabled).toBe(true);
    });

    it("default test case17", function()
    {
        let io = new InteractiveObject();
        io.mouseEnabled = { "toString":function () { return 1 } };
        expect(io.mouseEnabled).toBe(true);
    });

    it("default test case18", function()
    {
        let io = new InteractiveObject();
        io.mouseEnabled = { "toString":function () { return "1" } };
        expect(io.mouseEnabled).toBe(true);
    });

    it("default test case19", function()
    {
        let io = new InteractiveObject();
        io.mouseEnabled = { "toString":function () { return "1a" } };
        expect(io.mouseEnabled).toBe(true);
    });

});
