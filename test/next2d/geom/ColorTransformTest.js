
describe("ColorTransform.js toString test", function()
{
    it("toString test1 success", function()
    {
        const object = new ColorTransform();
        expect(object.toString()).toBe("(redMultiplier=1, greenMultiplier=1, blueMultiplier=1, alphaMultiplier=1, redOffset=0, greenOffset=0, blueOffset=0, alphaOffset=0)");
    });

    it("toString test2 success", function()
    {
        const object = new ColorTransform(2, 3, 4, 5, 6, 7, 8, 9);
        expect(object.toString()).toBe("(redMultiplier=1, greenMultiplier=1, blueMultiplier=1, alphaMultiplier=1, redOffset=6, greenOffset=7, blueOffset=8, alphaOffset=9)");
    });

});

describe("ColorTransform.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(ColorTransform.toString()).toBe("[class ColorTransform]");
    });

});

describe("ColorTransform.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new ColorTransform();
        expect(object.namespace).toBe("next2d.geom.ColorTransform");
    });

    it("namespace test static", function()
    {
        expect(ColorTransform.namespace).toBe("next2d.geom.ColorTransform");
    });

});

describe("ColorTransform.js property test", function()
{

    it("test success", function() {

        const ct = new ColorTransform(0.1, 0.2, 0.3, 0.4, 1, 2, 3, 4);

        expect(ct.redMultiplier).toBe(0.10000000149011612);
        expect(ct.greenMultiplier).toBe(0.20000000298023224);
        expect(ct.blueMultiplier).toBe(0.30000001192092896);
        expect(ct.alphaMultiplier).toBe(0.4000000059604645);
        expect(ct.redOffset).toBe(1);
        expect(ct.greenOffset).toBe(2);
        expect(ct.blueOffset).toBe(3);
        expect(ct.alphaOffset).toBe(4);

    });

    it("clone test success", function() {

        const ct    = new ColorTransform();
        const clone = ct._$clone();

        // ct
        ct.redMultiplier   = 0.1;
        ct.greenMultiplier = 0.2;
        ct.blueMultiplier  = 0.3;
        ct.alphaMultiplier = 0.4;
        ct.redOffset       = 1;
        ct.greenOffset     = 2;
        ct.blueOffset      = 3;
        ct.alphaOffset     = 4;

        expect(ct.redMultiplier).toBe(0.10000000149011612);
        expect(ct.greenMultiplier).toBe(0.20000000298023224);
        expect(ct.blueMultiplier).toBe(0.30000001192092896);
        expect(ct.alphaMultiplier).toBe(0.4000000059604645);
        expect(ct.redOffset).toBe(1);
        expect(ct.greenOffset).toBe(2);
        expect(ct.blueOffset).toBe(3);
        expect(ct.alphaOffset).toBe(4);

        expect(clone.redMultiplier).toBe(1);
        expect(clone.greenMultiplier).toBe(1);
        expect(clone.blueMultiplier).toBe(1);
        expect(clone.alphaMultiplier).toBe(1);
        expect(clone.redOffset).toBe(0);
        expect(clone.greenOffset).toBe(0);
        expect(clone.blueOffset).toBe(0);
        expect(clone.alphaOffset).toBe(0);

    });

    it("valid case3", function() {

        const ct = new ColorTransform(
            1.1, 1.1, 1.1, 1.1,
            256, 256, 256, 256
        );

        expect(ct.redMultiplier).toBe(1);
        expect(ct.greenMultiplier).toBe(1);
        expect(ct.blueMultiplier).toBe(1);
        expect(ct.alphaMultiplier).toBe(1);
        expect(ct.redOffset).toBe(255);
        expect(ct.greenOffset).toBe(255);
        expect(ct.blueOffset).toBe(255);
        expect(ct.alphaOffset).toBe(255);

    });

    it("valid case4", function() {

        const ct = new ColorTransform(
            -1.1, -1.1, -1.1, -1.1,
            -256, -256, -256, -256
        );

        expect(ct.redMultiplier).toBe(0);
        expect(ct.greenMultiplier).toBe(0);
        expect(ct.blueMultiplier).toBe(0);
        expect(ct.alphaMultiplier).toBe(0);
        expect(ct.redOffset).toBe(-255);
        expect(ct.greenOffset).toBe(-255);
        expect(ct.blueOffset).toBe(-255);
        expect(ct.alphaOffset).toBe(-255);

    });

    it("valid case5", function() {

        const ct = new ColorTransform(
            10, 10, 10, 10,
            1.1, 1.1, 1.1, 1.1
        );

        expect(ct.redMultiplier).toBe(1);
        expect(ct.greenMultiplier).toBe(1);
        expect(ct.blueMultiplier).toBe(1);
        expect(ct.alphaMultiplier).toBe(1);
        expect(ct.redOffset).toBe(1);
        expect(ct.greenOffset).toBe(1);
        expect(ct.blueOffset).toBe(1);
        expect(ct.alphaOffset).toBe(1);

    });

});

describe("ColorTransform.js concat test", function()
{
    it("concat test1", function()
    {

        const ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        const ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0.08999999612569809, greenMultiplier=0.1600000113248825, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=24, greenOffset=60, blueOffset=105, alphaOffset=150)"
        );

    });

    it("concat test2", function()
    {

        const ct1 = new ColorTransform(100, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        const ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0.8999999761581421, greenMultiplier=0.1600000113248825, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=-205, greenOffset=60, blueOffset=105, alphaOffset=150)"
        );

    });

    it("concat test3", function()
    {

        const ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 5000, 100, 150, 200);
        const ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0.08999999612569809, greenMultiplier=0.1600000113248825, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=229, greenOffset=60, blueOffset=105, alphaOffset=150)"
        );

    });

    it("concat test4", function()
    {

        const ct1 = new ColorTransform(0, -9, 0.3, 0.5, 50, 100, 150, 200);
        const ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0, greenMultiplier=0, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=50, greenOffset=100, blueOffset=105, alphaOffset=150)"
        );

    });

});

// properties
describe("ColorTransform.js alphaMultiplier test", function()
{

    it("default test case1", function()
    {
        const ct = new ColorTransform();
        expect(ct.alphaMultiplier).toBe(1);
    });

    it("default test case2", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = null;
        expect(ct.alphaMultiplier).toBe(0);
    });

    it("default test case3", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = undefined;
        expect(ct.alphaMultiplier).toBe(0);
    });

    it("default test case4", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = true;
        expect(ct.alphaMultiplier).toBe(1);
    });

    it("default test case5", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = "";
        expect(ct.alphaMultiplier).toBe(0);
    });

    it("default test case6", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = "abc";
        expect(ct.alphaMultiplier).toBe(0);
    });

    it("default test case7", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = 0;
        expect(ct.alphaMultiplier).toBe(0);
    });

    it("default test case8", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = 1;
        expect(ct.alphaMultiplier).toBe(1);
    });

    it("default test case9", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = 500;
        expect(ct.alphaMultiplier).toBe(1);
    });

    it("default test case10", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = 50000000000000000;
        expect(ct.alphaMultiplier).toBe(1);
    });

    it("default test case11", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = -1;
        expect(ct.alphaMultiplier).toBe(0);
    });

    it("default test case12", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = -500;
        expect(ct.alphaMultiplier).toBe(0);
    });

    it("default test case13", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = -50000000000000000;
        expect(ct.alphaMultiplier).toBe(0);
    });

    it("default test case14", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = { "a":0 };
        expect(ct.alphaMultiplier).toBe(0);
    });

    it("default test case15", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = function a() {};
        expect(ct.alphaMultiplier).toBe(0);
    });

    it("default test case16", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = [1];
        expect(ct.alphaMultiplier).toBe(1);
    });

    it("default test case17", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = [1,2];
        expect(ct.alphaMultiplier).toBe(0);
    });

    it("default test case18", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = {};
        expect(ct.alphaMultiplier).toBe(0);
    });

    it("default test case19", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = { "toString":function () { return 1 } };
        expect(ct.alphaMultiplier).toBe(1);
    });

    it("default test case20", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = { "toString":function () { return "1" } };
        expect(ct.alphaMultiplier).toBe(1);
    });

    it("default test case21", function()
    {
        const ct = new ColorTransform();
        ct.alphaMultiplier = { "toString":function () { return "1a" } };
        expect(ct.alphaMultiplier).toBe(0);
    });

});

describe("ColorTransform.js alphaOffset test", function()
{

    it("default test case1", function()
    {
        const ct = new ColorTransform();
        expect(ct.alphaOffset).toBe(0);
    });

    it("default test case2", function()
    {
        const ct = new ColorTransform();
        ct.alphaOffset = null;
        expect(ct.alphaOffset).toBe(0);
    });

    it("default test case3", function()
    {
        const ct = new ColorTransform();
        ct.alphaOffset = undefined;
        expect(ct.alphaOffset).toBe(0);
    });

    it("default test case4", function()
    {
        const ct = new ColorTransform();
        ct.alphaOffset = true;
        expect(ct.alphaOffset).toBe(1);
    });

    it("default test case5", function()
    {
        const ct = new ColorTransform();
        ct.alphaOffset = "";
        expect(ct.alphaOffset).toBe(0);
    });

    it("default test case6", function()
    {
        const ct = new ColorTransform();
        ct.alphaOffset = "abc";
        expect(ct.alphaOffset).toBe(0);
    });

    it("default test case7", function()
    {
        const ct = new ColorTransform();
        ct.alphaOffset = 0;
        expect(ct.alphaOffset).toBe(0);
    });

    it("default test case8", function()
    {
        const ct = new ColorTransform();
        ct.alphaOffset = 1;
        expect(ct.alphaOffset).toBe(1);
    });

    it("default test case9", function()
    {
        const ct = new ColorTransform();
        ct.alphaOffset = 500;
        expect(ct.alphaOffset).toBe(255);
    });

    it("default test case10", function()
    {
        const ct = new ColorTransform();
        ct.alphaOffset = 50000000000000000;
        expect(ct.alphaOffset).toBe(255);
    });

    it("default test case11", function()
    {
        const ct = new ColorTransform();
        ct.alphaOffset = -1;
        expect(ct.alphaOffset).toBe(-1);
    });

    it("default test case12", function()
    {
        const ct = new ColorTransform();
        ct.alphaOffset = -500;
        expect(ct.alphaOffset).toBe(-255);
    });

    it("default test case13", function()
    {
        const ct = new ColorTransform();
        ct.alphaOffset = -50000000000000000;
        expect(ct.alphaOffset).toBe(-255);
    });

    it("default test case14", function()
    {
        const ct = new ColorTransform();
        ct.alphaOffset = { "a":0 };
        expect(ct.alphaOffset).toBe(0);
    });

    it("default test case15", function()
    {
        let ct = new ColorTransform();
        ct.alphaOffset = function a() {};
        expect(ct.alphaOffset).toBe(0);
    });

    it("default test case16", function()
    {
        const ct = new ColorTransform();
        ct.alphaOffset = [1];
        expect(ct.alphaOffset).toBe(1);
    });

    it("default test case17", function()
    {
        const ct = new ColorTransform();
        ct.alphaOffset = [1,2];
        expect(ct.alphaOffset).toBe(0);
    });

    it("default test case18", function()
    {
        const ct = new ColorTransform();
        ct.alphaOffset = {};
        expect(ct.alphaOffset).toBe(0);
    });

    it("default test case19", function()
    {
        const ct = new ColorTransform();
        ct.alphaOffset = { "toString":function () { return 1 } };
        expect(ct.alphaOffset).toBe(1);
    });

    it("default test case20", function()
    {
        const ct = new ColorTransform();
        ct.alphaOffset = { "toString":function () { return "1" } };
        expect(ct.alphaOffset).toBe(1);
    });

    it("default test case21", function()
    {
        const ct = new ColorTransform();
        ct.alphaOffset = { "toString":function () { return "1a" } };
        expect(ct.alphaOffset).toBe(0);
    });

});

describe("ColorTransform.js blueMultiplier test", function()
{

    it("default test case1", function()
    {
        const ct = new ColorTransform();
        expect(ct.blueMultiplier).toBe(1);
    });

    it("default test case2", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = null;
        expect(ct.blueMultiplier).toBe(0);
    });

    it("default test case3", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = undefined;
        expect(ct.blueMultiplier).toBe(0);
    });

    it("default test case4", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = true;
        expect(ct.blueMultiplier).toBe(1);
    });

    it("default test case5", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = "";
        expect(ct.blueMultiplier).toBe(0);
    });

    it("default test case6", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = "abc";
        expect(ct.blueMultiplier).toBe(0);
    });

    it("default test case7", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = 0;
        expect(ct.blueMultiplier).toBe(0);
    });

    it("default test case8", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = 1;
        expect(ct.blueMultiplier).toBe(1);
    });

    it("default test case9", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = 500;
        expect(ct.blueMultiplier).toBe(1);
    });

    it("default test case10", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = 50000000000000000;
        expect(ct.blueMultiplier).toBe(1);
    });

    it("default test case11", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = -1;
        expect(ct.blueMultiplier).toBe(0);
    });

    it("default test case12", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = -500;
        expect(ct.blueMultiplier).toBe(0);
    });

    it("default test case13", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = -50000000000000000;
        expect(ct.blueMultiplier).toBe(0);
    });

    it("default test case14", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = { "a":0 };
        expect(ct.blueMultiplier).toBe(0);
    });

    it("default test case15", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = function a() {};
        expect(ct.blueMultiplier).toBe(0);
    });

    it("default test case16", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = [1];
        expect(ct.blueMultiplier).toBe(1);
    });

    it("default test case17", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = [1,2];
        expect(ct.blueMultiplier).toBe(0);
    });

    it("default test case18", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = {};
        expect(ct.blueMultiplier).toBe(0);
    });

    it("default test case19", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = { "toString":function () { return 1 } };
        expect(ct.blueMultiplier).toBe(1);
    });

    it("default test case20", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = { "toString":function () { return "1" } };
        expect(ct.blueMultiplier).toBe(1);
    });

    it("default test case21", function()
    {
        const ct = new ColorTransform();
        ct.blueMultiplier = { "toString":function () { return "1a" } };
        expect(ct.blueMultiplier).toBe(0);
    });

});

describe("ColorTransform.js blueOffset test", function()
{

    it("default test case1", function()
    {
        let ct = new ColorTransform();
        expect(ct.blueOffset).toBe(0);
    });

    it("default test case2", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = null;
        expect(ct.blueOffset).toBe(0);
    });

    it("default test case3", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = undefined;
        expect(ct.blueOffset).toBe(0);
    });

    it("default test case4", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = true;
        expect(ct.blueOffset).toBe(1);
    });

    it("default test case5", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = "";
        expect(ct.blueOffset).toBe(0);
    });

    it("default test case6", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = "abc";
        expect(ct.blueOffset).toBe(0);
    });

    it("default test case7", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = 0;
        expect(ct.blueOffset).toBe(0);
    });

    it("default test case8", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = 1;
        expect(ct.blueOffset).toBe(1);
    });

    it("default test case9", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = 500;
        expect(ct.blueOffset).toBe(255);
    });

    it("default test case10", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = 50000000000000000;
        expect(ct.blueOffset).toBe(255);
    });

    it("default test case11", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = -1;
        expect(ct.blueOffset).toBe(-1);
    });

    it("default test case12", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = -500;
        expect(ct.blueOffset).toBe(-255);
    });

    it("default test case13", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = -50000000000000000;
        expect(ct.blueOffset).toBe(-255);
    });

    it("default test case14", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = { "a":0 };
        expect(ct.blueOffset).toBe(0);
    });

    it("default test case15", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = function a() {};
        expect(ct.blueOffset).toBe(0);
    });

    it("default test case16", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = [1];
        expect(ct.blueOffset).toBe(1);
    });

    it("default test case17", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = [1,2];
        expect(ct.blueOffset).toBe(0);
    });

    it("default test case18", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = {};
        expect(ct.blueOffset).toBe(0);
    });

    it("default test case19", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = { "toString":function () { return 1 } };
        expect(ct.blueOffset).toBe(1);
    });

    it("default test case20", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = { "toString":function () { return "1" } };
        expect(ct.blueOffset).toBe(1);
    });

    it("default test case21", function()
    {
        let ct = new ColorTransform();
        ct.blueOffset = { "toString":function () { return "1a" } };
        expect(ct.blueOffset).toBe(0);
    });

});

describe("ColorTransform.js greenMultiplier test", function()
{

    it("default test case1", function()
    {
        let ct = new ColorTransform();
        expect(ct.greenMultiplier).toBe(1);
    });

    it("default test case2", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = null;
        expect(ct.greenMultiplier).toBe(0);
    });

    it("default test case3", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = undefined;
        expect(ct.greenMultiplier).toBe(0);
    });

    it("default test case4", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = true;
        expect(ct.greenMultiplier).toBe(1);
    });

    it("default test case5", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = "";
        expect(ct.greenMultiplier).toBe(0);
    });

    it("default test case6", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = "abc";
        expect(ct.greenMultiplier).toBe(0);
    });

    it("default test case7", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = 0;
        expect(ct.greenMultiplier).toBe(0);
    });

    it("default test case8", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = 1;
        expect(ct.greenMultiplier).toBe(1);
    });

    it("default test case9", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = 500;
        expect(ct.greenMultiplier).toBe(1);
    });

    it("default test case10", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = 50000000000000000;
        expect(ct.greenMultiplier).toBe(1);
    });

    it("default test case11", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = -1;
        expect(ct.greenMultiplier).toBe(0);
    });

    it("default test case12", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = -500;
        expect(ct.greenMultiplier).toBe(0);
    });

    it("default test case13", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = -50000000000000000;
        expect(ct.greenMultiplier).toBe(0);
    });

    it("default test case14", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = { "a":0 };
        expect(ct.greenMultiplier).toBe(0);
    });

    it("default test case15", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = function a() {};
        expect(ct.greenMultiplier).toBe(0);
    });

    it("default test case16", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = [1];
        expect(ct.greenMultiplier).toBe(1);
    });

    it("default test case17", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = [1,2];
        expect(ct.greenMultiplier).toBe(0);
    });

    it("default test case18", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = {};
        expect(ct.greenMultiplier).toBe(0);
    });

    it("default test case19", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = { "toString":function () { return 1 } };
        expect(ct.greenMultiplier).toBe(1);
    });

    it("default test case20", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = { "toString":function () { return "1" } };
        expect(ct.greenMultiplier).toBe(1);
    });

    it("default test case21", function()
    {
        let ct = new ColorTransform();
        ct.greenMultiplier = { "toString":function () { return "1a" } };
        expect(ct.greenMultiplier).toBe(0);
    });

});

describe("ColorTransform.js greenOffset test", function()
{

    it("default test case1", function()
    {
        let ct = new ColorTransform();
        expect(ct.greenOffset).toBe(0);
    });

    it("default test case2", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = null;
        expect(ct.greenOffset).toBe(0);
    });

    it("default test case3", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = undefined;
        expect(ct.greenOffset).toBe(0);
    });

    it("default test case4", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = true;
        expect(ct.greenOffset).toBe(1);
    });

    it("default test case5", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = "";
        expect(ct.greenOffset).toBe(0);
    });

    it("default test case6", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = "abc";
        expect(ct.greenOffset).toBe(0);
    });

    it("default test case7", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = 0;
        expect(ct.greenOffset).toBe(0);
    });

    it("default test case8", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = 1;
        expect(ct.greenOffset).toBe(1);
    });

    it("default test case9", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = 500;
        expect(ct.greenOffset).toBe(255);
    });

    it("default test case10", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = 50000000000000000;
        expect(ct.greenOffset).toBe(255);
    });

    it("default test case11", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = -1;
        expect(ct.greenOffset).toBe(-1);
    });

    it("default test case12", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = -500;
        expect(ct.greenOffset).toBe(-255);
    });

    it("default test case13", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = -50000000000000000;
        expect(ct.greenOffset).toBe(-255);
    });

    it("default test case14", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = { "a":0 };
        expect(ct.greenOffset).toBe(0);
    });

    it("default test case15", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = function a() {};
        expect(ct.greenOffset).toBe(0);
    });

    it("default test case16", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = [1];
        expect(ct.greenOffset).toBe(1);
    });

    it("default test case17", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = [1,2];
        expect(ct.greenOffset).toBe(0);
    });

    it("default test case18", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = {};
        expect(ct.greenOffset).toBe(0);
    });

    it("default test case19", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = { "toString":function () { return 1 } };
        expect(ct.greenOffset).toBe(1);
    });

    it("default test case20", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = { "toString":function () { return "1" } };
        expect(ct.greenOffset).toBe(1);
    });

    it("default test case21", function()
    {
        let ct = new ColorTransform();
        ct.greenOffset = { "toString":function () { return "1a" } };
        expect(ct.greenOffset).toBe(0);
    });

});

describe("ColorTransform.js redMultiplier test", function()
{

    it("default test case1", function()
    {
        let ct = new ColorTransform();
        expect(ct.redMultiplier).toBe(1);
    });

    it("default test case2", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = null;
        expect(ct.redMultiplier).toBe(0);
    });

    it("default test case3", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = undefined;
        expect(ct.redMultiplier).toBe(0);
    });

    it("default test case4", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = true;
        expect(ct.redMultiplier).toBe(1);
    });

    it("default test case5", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = "";
        expect(ct.redMultiplier).toBe(0);
    });

    it("default test case6", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = "abc";
        expect(ct.redMultiplier).toBe(0);
    });

    it("default test case7", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = 0;
        expect(ct.redMultiplier).toBe(0);
    });

    it("default test case8", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = 1;
        expect(ct.redMultiplier).toBe(1);
    });

    it("default test case9", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = 500;
        expect(ct.redMultiplier).toBe(1);
    });

    it("default test case10", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = 50000000000000000;
        expect(ct.redMultiplier).toBe(1);
    });

    it("default test case11", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = -1;
        expect(ct.redMultiplier).toBe(0);
    });

    it("default test case12", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = -500;
        expect(ct.redMultiplier).toBe(0);
    });

    it("default test case13", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = -50000000000000000;
        expect(ct.redMultiplier).toBe(0);
    });

    it("default test case14", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = { "a":0 };
        expect(ct.redMultiplier).toBe(0);
    });

    it("default test case15", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = function a() {};
        expect(ct.redMultiplier).toBe(0);
    });

    it("default test case16", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = [1];
        expect(ct.redMultiplier).toBe(1);
    });

    it("default test case17", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = [1,2];
        expect(ct.redMultiplier).toBe(0);
    });

    it("default test case18", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = {};
        expect(ct.redMultiplier).toBe(0);
    });

    it("default test case19", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = { "toString":function () { return 1 } };
        expect(ct.redMultiplier).toBe(1);
    });

    it("default test case20", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = { "toString":function () { return "1" } };
        expect(ct.redMultiplier).toBe(1);
    });

    it("default test case21", function()
    {
        let ct = new ColorTransform();
        ct.redMultiplier = { "toString":function () { return "1a" } };
        expect(ct.redMultiplier).toBe(0);
    });

});

describe("ColorTransform.js redOffset test", function()
{

    it("default test case1", function()
    {
        let ct = new ColorTransform();
        expect(ct.redOffset).toBe(0);
    });

    it("default test case2", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = null;
        expect(ct.redOffset).toBe(0);
    });

    it("default test case3", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = undefined;
        expect(ct.redOffset).toBe(0);
    });

    it("default test case4", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = true;
        expect(ct.redOffset).toBe(1);
    });

    it("default test case5", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = "";
        expect(ct.redOffset).toBe(0);
    });

    it("default test case6", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = "abc";
        expect(ct.redOffset).toBe(0);
    });

    it("default test case7", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = 0;
        expect(ct.redOffset).toBe(0);
    });

    it("default test case8", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = 1;
        expect(ct.redOffset).toBe(1);
    });

    it("default test case9", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = 500;
        expect(ct.redOffset).toBe(255);
    });

    it("default test case10", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = 50000000000000000;
        expect(ct.redOffset).toBe(255);
    });

    it("default test case11", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = -1;
        expect(ct.redOffset).toBe(-1);
    });

    it("default test case12", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = -500;
        expect(ct.redOffset).toBe(-255);
    });

    it("default test case13", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = -50000000000000000;
        expect(ct.redOffset).toBe(-255);
    });

    it("default test case14", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = { "a":0 };
        expect(ct.redOffset).toBe(0);
    });

    it("default test case15", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = function a() {};
        expect(ct.redOffset).toBe(0);
    });

    it("default test case16", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = [1];
        expect(ct.redOffset).toBe(1);
    });

    it("default test case17", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = [1,2];
        expect(ct.redOffset).toBe(0);
    });

    it("default test case18", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = {};
        expect(ct.redOffset).toBe(0);
    });

    it("default test case19", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = { "toString":function () { return 1 } };
        expect(ct.redOffset).toBe(1);
    });

    it("default test case20", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = { "toString":function () { return "1" } };
        expect(ct.redOffset).toBe(1);
    });

    it("default test case21", function()
    {
        let ct = new ColorTransform();
        ct.redOffset = { "toString":function () { return "1a" } };
        expect(ct.redOffset).toBe(0);
    });

});

describe("ColorTransform.js alphaMultiplier test", function()
{
    it("alphaMultiplier valid test1", function()
    {

        let ct = new ColorTransform(1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000);

        expect(ct.redMultiplier).toBe(1);
        expect(ct.greenMultiplier).toBe(1);
        expect(ct.blueMultiplier).toBe(1);
        expect(ct.alphaMultiplier).toBe(1);
        expect(ct.redOffset).toBe(255);
        expect(ct.greenOffset).toBe(255);
        expect(ct.blueOffset).toBe(255);
        expect(ct.alphaOffset).toBe(255);

    });

    it("alphaMultiplier valid test2", function()
    {

        let ct = new ColorTransform(-1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000);

        expect(ct.redMultiplier).toBe(0);
        expect(ct.greenMultiplier).toBe(0);
        expect(ct.blueMultiplier).toBe(0);
        expect(ct.alphaMultiplier).toBe(0);
        expect(ct.redOffset).toBe(-255);
        expect(ct.greenOffset).toBe(-255);
        expect(ct.blueOffset).toBe(-255);
        expect(ct.alphaOffset).toBe(-255);

    });

    it("alphaMultiplier valid test3", function()
    {

        let ct = new ColorTransform(0, 0, 0, 0, 0, 0, 0, 0);

        expect(ct.redMultiplier).toBe(0);
        expect(ct.greenMultiplier).toBe(0);
        expect(ct.blueMultiplier).toBe(0);
        expect(ct.alphaMultiplier).toBe(0);
        expect(ct.redOffset).toBe(0);
        expect(ct.greenOffset).toBe(0);
        expect(ct.blueOffset).toBe(0);
        expect(ct.alphaOffset).toBe(0);

    });

    it("alphaMultiplier valid test4", function()
    {

        let ct = new ColorTransform(-1, -1, -1, -1, -1, -1, -1, -1);

        expect(ct.redMultiplier).toBe(0);
        expect(ct.greenMultiplier).toBe(0);
        expect(ct.blueMultiplier).toBe(0);
        expect(ct.alphaMultiplier).toBe(0);
        expect(ct.redOffset).toBe(-1);
        expect(ct.greenOffset).toBe(-1);
        expect(ct.blueOffset).toBe(-1);
        expect(ct.alphaOffset).toBe(-1);

    });

    it("alphaMultiplier valid test4", function()
    {

        let ct = new ColorTransform(-1.1111, -1.1111, -1.1111, -1.1111, -1.1111, -1.1111, -1.1111, -1.1111);

        expect(ct.redMultiplier).toBe(0);
        expect(ct.greenMultiplier).toBe(0);
        expect(ct.blueMultiplier).toBe(0);
        expect(ct.alphaMultiplier).toBe(0);
        expect(ct.redOffset).toBe(-1);
        expect(ct.greenOffset).toBe(-1);
        expect(ct.blueOffset).toBe(-1);
        expect(ct.alphaOffset).toBe(-1);

    });
});

describe("ColorTransform.js concat test", function()
{

    it("concat valid test1", function()
    {

        let ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        let ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.redMultiplier = "a";
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0, greenMultiplier=0.1600000113248825, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=50, greenOffset=60, blueOffset=105, alphaOffset=150)"
        );

    });

    it("concat valid test2", function()
    {

        let ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        let ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.redOffset = "a";
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0.08999999612569809, greenMultiplier=0.1600000113248825, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=-25, greenOffset=60, blueOffset=105, alphaOffset=150)"
        );

    });

    it("concat valid test3", function()
    {

        let ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        let ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.greenMultiplier = "a";
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0.08999999612569809, greenMultiplier=0, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=24, greenOffset=100, blueOffset=105, alphaOffset=150)"
        );

    });

    it("concat valid test4", function()
    {

        let ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        let ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.greenOffset = "a";
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0.08999999612569809, greenMultiplier=0.1600000113248825, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=24, greenOffset=-40, blueOffset=105, alphaOffset=150)"
        );

    });

    it("concat valid test5", function()
    {

        let ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        let ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.blueMultiplier = "a";
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0.08999999612569809, greenMultiplier=0.1600000113248825, blueMultiplier=0, alphaMultiplier=0.30000001192092896, redOffset=24, greenOffset=60, blueOffset=150, alphaOffset=150)"
        );

    });

    it("concat valid test6", function()
    {

        let ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        let ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.blueOffset = "a";
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0.08999999612569809, greenMultiplier=0.1600000113248825, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=24, greenOffset=60, blueOffset=-45, alphaOffset=150)"
        );

    });

    it("concat valid test7", function()
    {

        let ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        let ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.alphaMultiplier = "a";
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0.08999999612569809, greenMultiplier=0.1600000113248825, blueMultiplier=0.21000000834465027, alphaMultiplier=0, redOffset=24, greenOffset=60, blueOffset=105, alphaOffset=200)"
        );

    });

    it("concat valid test8", function()
    {

        let ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        let ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.alphaOffset = "a";
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0.08999999612569809, greenMultiplier=0.1600000113248825, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=24, greenOffset=60, blueOffset=105, alphaOffset=-50)"
        );

    });

    it("concat valid test9", function()
    {

        let ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        let ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.redMultiplier = false;
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0, greenMultiplier=0.1600000113248825, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=50, greenOffset=60, blueOffset=105, alphaOffset=150)"
        );

    });

    it("concat valid test10", function()
    {

        let ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        let ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.redOffset = false;
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0.08999999612569809, greenMultiplier=0.1600000113248825, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=-25, greenOffset=60, blueOffset=105, alphaOffset=150)"
        );

    });

    it("concat valid test11", function()
    {

        let ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        let ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.greenMultiplier = false;
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0.08999999612569809, greenMultiplier=0, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=24, greenOffset=100, blueOffset=105, alphaOffset=150)"
        );

    });

    it("concat valid test12", function()
    {

        let ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        let ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.greenOffset = false;
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0.08999999612569809, greenMultiplier=0.1600000113248825, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=24, greenOffset=-40, blueOffset=105, alphaOffset=150)"
        );

    });

    it("concat valid test13", function()
    {

        let ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        let ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.blueMultiplier = false;
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0.08999999612569809, greenMultiplier=0.1600000113248825, blueMultiplier=0, alphaMultiplier=0.30000001192092896, redOffset=24, greenOffset=60, blueOffset=150, alphaOffset=150)"
        );

    });

    it("concat valid test14", function()
    {

        let ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        let ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.blueOffset = false;
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0.08999999612569809, greenMultiplier=0.1600000113248825, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=24, greenOffset=60, blueOffset=-45, alphaOffset=150)"
        );

    });

    it("concat valid test15", function()
    {

        let ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        let ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.alphaMultiplier = false;
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0.08999999612569809, greenMultiplier=0.1600000113248825, blueMultiplier=0.21000000834465027, alphaMultiplier=0, redOffset=24, greenOffset=60, blueOffset=105, alphaOffset=200)"
        );

    });

    it("concat valid test16", function()
    {

        let ct1 = new ColorTransform(0.1, 0.2, 0.3, 0.5, 50, 100, 150, 200);
        let ct2 = new ColorTransform(0.9, 0.8, 0.7, 0.6, -255, -200, -150, -100);
        ct1.alphaOffset = false;
        ct1.concat(ct2);

        expect(ct1.toString()).toBe(
            "(redMultiplier=0.08999999612569809, greenMultiplier=0.1600000113248825, blueMultiplier=0.21000000834465027, alphaMultiplier=0.30000001192092896, redOffset=24, greenOffset=60, blueOffset=105, alphaOffset=-50)"
        );

    });
});
