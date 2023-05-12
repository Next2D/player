
describe("DisplacementMapFilterMode.js toString test", function()
{
    it("toString test success", function()
    {
        let filter = new DisplacementMapFilterMode();
        expect(filter.toString()).toBe("[object DisplacementMapFilterMode]");
    });

});

describe("DisplacementMapFilterMode.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(DisplacementMapFilterMode.toString()).toBe("[class DisplacementMapFilterMode]");
    });

});

describe("DisplacementMapFilterMode.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new DisplacementMapFilterMode();
        expect(object.namespace).toBe("next2d.filters.DisplacementMapFilterMode");
    });

    it("namespace test static", function()
    {
        expect(DisplacementMapFilterMode.namespace).toBe("next2d.filters.DisplacementMapFilterMode");
    });

});

describe("DisplacementMapFilterMode.js property test", function()
{

    it("CLAMP test", function ()
    {
        expect(DisplacementMapFilterMode.CLAMP).toBe("clamp");
    });

    it("COLOR test", function ()
    {
        expect(DisplacementMapFilterMode.COLOR).toBe("color");
    });

    it("IGNORE test", function ()
    {
        expect(DisplacementMapFilterMode.IGNORE).toBe("ignore");
    });

    it("instance test", function ()
    {
        expect(new DisplacementMapFilterMode() instanceof DisplacementMapFilterMode).toBe(true);
    });

});

describe("DisplacementMapFilter.js alpha test", function()
{

    it("default test case1", function()
    {
        let dmfm = new DisplacementMapFilter();
        expect(dmfm.alpha).toBe(0);
    });

    it("default test case2", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = null;
        expect(dmfm.alpha).toBe(0);
    });

    it("default test case3", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = undefined;
        expect(dmfm.alpha).toBe(0);
    });

    it("default test case4", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = true;
        expect(dmfm.alpha).toBe(1);
    });

    it("default test case5", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = "";
        expect(dmfm.alpha).toBe(0);
    });

    it("default test case6", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = "abc";
        expect(dmfm.alpha).toBe(0);
    });

    it("default test case7", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = 0;
        expect(dmfm.alpha).toBe(0);
    });

    it("default test case8", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = 1;
        expect(dmfm.alpha).toBe(1);
    });

    it("default test case9", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = 500;
        expect(dmfm.alpha).toBe(1);
    });

    it("default test case10", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = 50000000000000000;
        expect(dmfm.alpha).toBe(1);
    });

    it("default test case11", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = -1;
        expect(dmfm.alpha).toBe(0);
    });

    it("default test case12", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = -500;
        expect(dmfm.alpha).toBe(0);
    });

    it("default test case13", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = -50000000000000000;
        expect(dmfm.alpha).toBe(0);
    });

    it("default test case14", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = { "a":0 };
        expect(dmfm.alpha).toBe(0);
    });

    it("default test case15", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = function a() {};
        expect(dmfm.alpha).toBe(0);
    });

    it("default test case16", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = [1];
        expect(dmfm.alpha).toBe(1);
    });

    it("default test case17", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = [1,2];
        expect(dmfm.alpha).toBe(0);
    });

    it("default test case18", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = {};
        expect(dmfm.alpha).toBe(0);
    });

    it("default test case19", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = { "toString":function () { return 1 } };
        expect(dmfm.alpha).toBe(1);
    });

    it("default test case20", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = { "toString":function () { return "1" } };
        expect(dmfm.alpha).toBe(1);
    });

    it("default test case21", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.alpha = { "toString":function () { return "1a" } };
        expect(dmfm.alpha).toBe(0);
    });

});

describe("DisplacementMapFilter.js componentX test", function()
{

    it("default test case1", function()
    {
        let dmfm = new DisplacementMapFilter();
        expect(dmfm.componentX).toBe(0);
    });

    it("default test case2", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = null;
        expect(dmfm.componentX).toBe(0);
    });

    it("default test case3", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = undefined;
        expect(dmfm.componentX).toBe(0);
    });

    it("default test case4", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = true;
        expect(dmfm.componentX).toBe(1);
    });

    it("default test case5", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = "";
        expect(dmfm.componentX).toBe(0);
    });

    it("default test case6", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = "abc";
        expect(dmfm.componentX).toBe(0);
    });

    it("default test case7", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = 0;
        expect(dmfm.componentX).toBe(0);
    });

    it("default test case8", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = 1;
        expect(dmfm.componentX).toBe(1);
    });

    it("default test case9", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = 500;
        expect(dmfm.componentX).toBe(0);
    });

    it("default test case10", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = 50000000000000000;
        expect(dmfm.componentX).toBe(0);
    });

    it("default test case11", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = -1;
        expect(dmfm.componentX).toBe(0);
    });

    it("default test case12", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = -500;
        expect(dmfm.componentX).toBe(0);
    });

    it("default test case13", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = -50000000000000000;
        expect(dmfm.componentX).toBe(0);
    });

    it("default test case14", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = { "a":0 };
        expect(dmfm.componentX).toBe(0);
    });

    it("default test case15", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = function a() {};
        expect(dmfm.componentX).toBe(0);
    });

    it("default test case16", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = [1];
        expect(dmfm.componentX).toBe(1);
    });

    it("default test case17", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = [1,2];
        expect(dmfm.componentX).toBe(0);
    });

    it("default test case18", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = {};
        expect(dmfm.componentX).toBe(0);
    });

    it("default test case19", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = { "toString":function () { return 1 } };
        expect(dmfm.componentX).toBe(1);
    });

    it("default test case20", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = { "toString":function () { return "1" } };
        expect(dmfm.componentX).toBe(1);
    });

    it("default test case21", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentX = { "toString":function () { return "1a" } };
        expect(dmfm.componentX).toBe(0);
    });

});

describe("DisplacementMapFilter.js componentY test", function()
{

    it("default test case1", function()
    {
        let dmfm = new DisplacementMapFilter();
        expect(dmfm.componentY).toBe(0);
    });

    it("default test case2", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = null;
        expect(dmfm.componentY).toBe(0);
    });

    it("default test case3", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = undefined;
        expect(dmfm.componentY).toBe(0);
    });

    it("default test case4", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = true;
        expect(dmfm.componentY).toBe(1);
    });

    it("default test case5", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = "";
        expect(dmfm.componentY).toBe(0);
    });

    it("default test case6", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = "abc";
        expect(dmfm.componentY).toBe(0);
    });

    it("default test case7", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = 0;
        expect(dmfm.componentY).toBe(0);
    });

    it("default test case8", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = 1;
        expect(dmfm.componentY).toBe(1);
    });

    it("default test case9", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = 500;
        expect(dmfm.componentY).toBe(0);
    });

    it("default test case10", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = 50000000000000000;
        expect(dmfm.componentY).toBe(0);
    });

    it("default test case11", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = -1;
        expect(dmfm.componentY).toBe(0);
    });

    it("default test case12", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = -500;
        expect(dmfm.componentY).toBe(0);
    });

    it("default test case13", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = -50000000000000000;
        expect(dmfm.componentY).toBe(0);
    });

    it("default test case14", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = { "a":0 };
        expect(dmfm.componentY).toBe(0);
    });

    it("default test case15", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = function a() {};
        expect(dmfm.componentY).toBe(0);
    });

    it("default test case16", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = [1];
        expect(dmfm.componentY).toBe(1);
    });

    it("default test case17", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = [1,2];
        expect(dmfm.componentY).toBe(0);
    });

    it("default test case18", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = {};
        expect(dmfm.componentY).toBe(0);
    });

    it("default test case19", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = { "toString":function () { return 1 } };
        expect(dmfm.componentY).toBe(1);
    });

    it("default test case20", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = { "toString":function () { return "1" } };
        expect(dmfm.componentY).toBe(1);
    });

    it("default test case21", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.componentY = { "toString":function () { return "1a" } };
        expect(dmfm.componentY).toBe(0);
    });

});

describe("DisplacementMapFilter.js mode test", function()
{

    it("default test case1", function()
    {
        let dmfm = new DisplacementMapFilter();
        expect(dmfm.mode).toBe("wrap");
    });

    it("default test case2", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.mode = DisplacementMapFilterMode.CLAMP;
        expect(dmfm.mode).toBe("clamp");
    });

    it("default test case3", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.mode = DisplacementMapFilterMode.COLOR;
        expect(dmfm.mode).toBe("color");
    });

    it("default test case4", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.mode = DisplacementMapFilterMode.IGNORE;
        expect(dmfm.mode).toBe("ignore");
    });

    it("default test case5", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.mode = DisplacementMapFilterMode.WRAP;
        expect(dmfm.mode).toBe("wrap");
    });

});

describe("DisplacementMapFilter.js scaleX test", function()
{

    it("default test case1", function()
    {
        let dmfm = new DisplacementMapFilter();
        expect(dmfm.scaleX).toBe(0);
    });

    it("default test case2", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = null;
        expect(dmfm.scaleX).toBe(0);
    });

    it("default test case3", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = undefined;
        expect(dmfm.scaleX).toBe(0);
    });

    it("default test case4", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = true;
        expect(dmfm.scaleX).toBe(1);
    });

    it("default test case5", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = "";
        expect(dmfm.scaleX).toBe(0);
    });

    it("default test case6", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = "abc";
        expect(dmfm.scaleX).toBe(0);
    });

    it("default test case7", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = 0;
        expect(dmfm.scaleX).toBe(0);
    });

    it("default test case8", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = 1;
        expect(dmfm.scaleX).toBe(1);
    });

    it("default test case9", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = 500;
        expect(dmfm.scaleX).toBe(500);
    });

    it("default test case10", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = 50000000000000000;
        expect(dmfm.scaleX).toBe(65535);
    });

    it("default test case11", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = -1;
        expect(dmfm.scaleX).toBe(-1);
    });

    it("default test case12", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = -500;
        expect(dmfm.scaleX).toBe(-500);
    });

    it("default test case13", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = -50000000000000000;
        expect(dmfm.scaleX).toBe(-65535);
    });

    it("default test case14", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = { "a":0 };
        expect(dmfm.scaleX).toBe(0);
    });

    it("default test case15", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = function a() {};
        expect(dmfm.scaleX).toBe(0);
    });

    it("default test case16", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = [1];
        expect(dmfm.scaleX).toBe(1);
    });

    it("default test case17", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = [1,2];
        expect(dmfm.scaleX).toBe(0);
    });

    it("default test case18", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = {};
        expect(dmfm.scaleX).toBe(0);
    });

    it("default test case19", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = { "toString":function () { return 1 } };
        expect(dmfm.scaleX).toBe(1);
    });

    it("default test case20", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = { "toString":function () { return "1" } };
        expect(dmfm.scaleX).toBe(1);
    });

    it("default test case21", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleX = { "toString":function () { return "1a" } };
        expect(dmfm.scaleX).toBe(0);
    });

});

describe("DisplacementMapFilter.js scaleY test", function()
{

    it("default test case1", function()
    {
        let dmfm = new DisplacementMapFilter();
        expect(dmfm.scaleY).toBe(0);
    });

    it("default test case2", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = null;
        expect(dmfm.scaleY).toBe(0);
    });

    it("default test case3", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = undefined;
        expect(dmfm.scaleY).toBe(0);
    });

    it("default test case4", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = true;
        expect(dmfm.scaleY).toBe(1);
    });

    it("default test case5", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = "";
        expect(dmfm.scaleY).toBe(0);
    });

    it("default test case6", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = "abc";
        expect(dmfm.scaleY).toBe(0);
    });

    it("default test case7", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = 0;
        expect(dmfm.scaleY).toBe(0);
    });

    it("default test case8", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = 1;
        expect(dmfm.scaleY).toBe(1);
    });

    it("default test case9", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = 500;
        expect(dmfm.scaleY).toBe(500);
    });

    it("default test case10", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = 50000000000000000;
        expect(dmfm.scaleY).toBe(65535);
    });

    it("default test case11", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = -1;
        expect(dmfm.scaleY).toBe(-1);
    });

    it("default test case12", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = -500;
        expect(dmfm.scaleY).toBe(-500);
    });

    it("default test case13", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = -50000000000000000;
        expect(dmfm.scaleY).toBe(-65535);
    });

    it("default test case14", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = { "a":0 };
        expect(dmfm.scaleY).toBe(0);
    });

    it("default test case15", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = function a() {};
        expect(dmfm.scaleY).toBe(0);
    });

    it("default test case16", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = [1];
        expect(dmfm.scaleY).toBe(1);
    });

    it("default test case17", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = [1,2];
        expect(dmfm.scaleY).toBe(0);
    });

    it("default test case18", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = {};
        expect(dmfm.scaleY).toBe(0);
    });

    it("default test case19", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = { "toString":function () { return 1 } };
        expect(dmfm.scaleY).toBe(1);
    });

    it("default test case20", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = { "toString":function () { return "1" } };
        expect(dmfm.scaleY).toBe(1);
    });

    it("default test case21", function()
    {
        let dmfm = new DisplacementMapFilter();
        dmfm.scaleY = { "toString":function () { return "1a" } };
        expect(dmfm.scaleY).toBe(0);
    });

});