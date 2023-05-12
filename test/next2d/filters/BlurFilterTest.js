
describe("BlurFilter.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new BlurFilter();
        expect(object.namespace).toBe("next2d.filters.BlurFilter");
    });

    it("namespace test static", function()
    {
        expect(BlurFilter.namespace).toBe("next2d.filters.BlurFilter");
    });

});

describe("BlurFilter.js toString test", function()
{
    it("toString test success", function()
    {
        let filter = new BlurFilter();
        expect(filter.toString()).toBe("[object BlurFilter]");
    });

});

describe("BlurFilter.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(BlurFilter.toString()).toBe("[class BlurFilter]");
    });

});

describe("BlurFilter.js property test", function()
{
    // default
    it("default test success", function()
    {
        let filter = new BlurFilter();
        expect(filter.blurX).toBe(4);
        expect(filter.blurY).toBe(4);
        expect(filter.quality).toBe(BitmapFilterQuality.LOW);
    });

    // blurX
    it("blurX test success case1", function()
    {
        let filter = new BlurFilter(0);
        expect(filter.blurX).toBe(0);
    });

    it("blurX test success case2", function()
    {
        let filter = new BlurFilter(100);
        filter.blurX = 50;
        expect(filter.blurX).toBe(50);
    });

    it("blurX test valid case1", function()
    {
        let filter = new BlurFilter(1000);
        expect(filter.blurX).toBe(255);
    });

    it("blurX test valid case2", function()
    {
        let filter = new BlurFilter(10);
        filter.blurX = 1000;
        expect(filter.blurX).toBe(255);
    });

    it("blurX test valid case3", function()
    {
        let filter = new BlurFilter(-10);
        expect(filter.blurX).toBe(0);
    });

    it("blurX test valid case4", function()
    {
        let filter = new BlurFilter(10);
        filter.blurX = -1;
        expect(filter.blurX).toBe(0);
    });

    it("blurX test valid case5", function()
    {
        let filter = new BlurFilter("100");
        expect(filter.blurX).toBe(100);
    });

    it("blurX test valid case6", function()
    {
        let filter = new BlurFilter(10);
        filter.blurX = "123";
        expect(filter.blurX).toBe(123);
    });

    it("blurX test valid case7", function()
    {
        let filter = new BlurFilter("test");
        expect(filter.blurX).toBe(0);
    });

    it("blurX test valid case8", function()
    {
        let filter = new BlurFilter(10);
        filter.blurX = "123a";
        expect(filter.blurX).toBe(0);
    });

    // blurY
    it("blurY test success case1", function()
    {
        let filter = new BlurFilter(10, 0);
        expect(filter.blurY).toBe(0);
    });

    it("blurY test success case2", function()
    {
        let filter = new BlurFilter(10, 100);
        filter.blurY = 50;
        expect(filter.blurY).toBe(50);
    });

    it("blurY test valid case1", function()
    {
        let filter = new BlurFilter(10, 1000);
        expect(filter.blurY).toBe(255);
    });

    it("blurY test valid case2", function()
    {
        let filter = new BlurFilter(10, 10);
        filter.blurY = 1000;
        expect(filter.blurY).toBe(255);
    });

    it("blurY test valid case3", function()
    {
        let filter = new BlurFilter(10, -10);
        expect(filter.blurY).toBe(0);
    });

    it("blurY test valid case4", function()
    {
        let filter = new BlurFilter(10, 10);
        filter.blurY = -1;
        expect(filter.blurY).toBe(0);
    });

    it("blurY test valid case5", function()
    {
        let filter = new BlurFilter(10, "100");
        expect(filter.blurY).toBe(100);
    });

    it("blurY test valid case6", function()
    {
        let filter = new BlurFilter(10, 10);
        filter.blurY = "123";
        expect(filter.blurY).toBe(123);
    });

    it("blurY test valid case7", function()
    {
        let filter = new BlurFilter(10, "test");
        expect(filter.blurY).toBe(0);
    });

    it("blurY test valid case8", function()
    {
        let filter = new BlurFilter(10, 10);
        filter.blurY = "123a";
        expect(filter.blurY).toBe(0);
    });

    // quality
    it("quality test success case1", function()
    {
        let filter = new BlurFilter(10, 100, 0);
        expect(filter.quality).toBe(0);
    });

    it("quality test success case2", function()
    {
        let filter = new BlurFilter(10, 100, 5);
        filter.quality = 2;
        expect(filter.quality).toBe(2);
    });

    it("quality test valid case1", function()
    {
        let filter = new BlurFilter(10, 100, 1000);
        expect(filter.quality).toBe(15);
    });

    it("quality test valid case2", function()
    {
        let filter = new BlurFilter(10, 100, 2);
        filter.quality = 1000;
        expect(filter.quality).toBe(15);
    });

    it("quality test valid case3", function()
    {
        let filter = new BlurFilter(10, 100, -1);
        expect(filter.quality).toBe(0);
    });

    it("quality test valid case4", function()
    {
        let filter = new BlurFilter(10, 100, 5);
        filter.quality = -1;
        expect(filter.quality).toBe(0);
    });

    it("quality test valid case5", function()
    {
        let filter = new BlurFilter(10, 100, "12");
        expect(filter.quality).toBe(12);
    });

    it("quality test valid case6", function()
    {
        let filter = new BlurFilter(10, 100, 10);
        filter.quality = "12";
        expect(filter.quality).toBe(12);
    });

    it("quality test valid case7", function()
    {
        let filter = new BlurFilter(10, 100, "test");
        expect(filter.quality).toBe(0);
    });

    it("quality test valid case8", function()
    {
        let filter = new BlurFilter(10, 100, 10);
        filter.quality = "123a";
        expect(filter.quality).toBe(0);
    });

});

describe("BlurFilter.js clone test", function()
{

    it("clone test", function()
    {
        let filter = new BlurFilter(20, 40, 5);
        let clone  = filter.clone();

        // clone check
        expect(clone.blurX).toBe(20);
        expect(clone.blurY).toBe(40);
        expect(clone.quality).toBe(5);

        // edit param
        clone.blurX   = 10;
        clone.blurY   = 50;
        clone.quality = 9;

        // origin
        expect(filter.blurX).toBe(20);
        expect(filter.blurY).toBe(40);
        expect(filter.quality).toBe(5);

        // clone
        expect(clone.blurX).toBe(10);
        expect(clone.blurY).toBe(50);
        expect(clone.quality).toBe(9);

    });

});

describe("BlurFilter.js blurX test", function()
{

    it("default test case1", function()
    {
        let bf = new BlurFilter();
        expect(bf.blurX).toBe(4);
    });

    it("default test case2", function()
    {
        let bf = new BlurFilter();
        bf.blurX = null;
        expect(bf.blurX).toBe(0);
    });

    it("default test case3", function()
    {
        let bf = new BlurFilter();
        bf.blurX = undefined;
        expect(bf.blurX).toBe(0);
    });

    it("default test case4", function()
    {
        let bf = new BlurFilter();
        bf.blurX = true;
        expect(bf.blurX).toBe(1);
    });

    it("default test case5", function()
    {
        let bf = new BlurFilter();
        bf.blurX = "";
        expect(bf.blurX).toBe(0);
    });

    it("default test case6", function()
    {
        let bf = new BlurFilter();
        bf.blurX = "abc";
        expect(bf.blurX).toBe(0);
    });

    it("default test case7", function()
    {
        let bf = new BlurFilter();
        bf.blurX = 0;
        expect(bf.blurX).toBe(0);
    });

    it("default test case8", function()
    {
        let bf = new BlurFilter();
        bf.blurX = 1;
        expect(bf.blurX).toBe(1);
    });

    it("default test case9", function()
    {
        let bf = new BlurFilter();
        bf.blurX = 500;
        expect(bf.blurX).toBe(255);
    });

    it("default test case10", function()
    {
        let bf = new BlurFilter();
        bf.blurX = 50000000000000000;
        expect(bf.blurX).toBe(255);
    });

    it("default test case11", function()
    {
        let bf = new BlurFilter();
        bf.blurX = -1;
        expect(bf.blurX).toBe(0);
    });

    it("default test case12", function()
    {
        let bf = new BlurFilter();
        bf.blurX = -500;
        expect(bf.blurX).toBe(0);
    });

    it("default test case13", function()
    {
        let bf = new BlurFilter();
        bf.blurX = -50000000000000000;
        expect(bf.blurX).toBe(0);
    });

    it("default test case14", function()
    {
        let bf = new BlurFilter();
        bf.blurX = { "a":0 };
        expect(bf.blurX).toBe(0);
    });

    it("default test case15", function()
    {
        let bf = new BlurFilter();
        bf.blurX = function a() {};
        expect(bf.blurX).toBe(0);
    });

    it("default test case16", function()
    {
        let bf = new BlurFilter();
        bf.blurX = [1];
        expect(bf.blurX).toBe(1);
    });

    it("default test case17", function()
    {
        let bf = new BlurFilter();
        bf.blurX = [1,2];
        expect(bf.blurX).toBe(0);
    });

    it("default test case18", function()
    {
        let bf = new BlurFilter();
        bf.blurX = {};
        expect(bf.blurX).toBe(0);
    });

    it("default test case19", function()
    {
        let bf = new BlurFilter();
        bf.blurX = { "toString":function () { return 1 } };
        expect(bf.blurX).toBe(1);
    });

    it("default test case20", function()
    {
        let bf = new BlurFilter();
        bf.blurX = { "toString":function () { return "1" } };
        expect(bf.blurX).toBe(1);
    });

    it("default test case21", function()
    {
        let bf = new BlurFilter();
        bf.blurX = { "toString":function () { return "1a" } };
        expect(bf.blurX).toBe(0);
    });

});

describe("BlurFilter.js blurY test", function()
{

    it("default test case1", function()
    {
        let bf = new BlurFilter();
        expect(bf.blurY).toBe(4);
    });

    it("default test case2", function()
    {
        let bf = new BlurFilter();
        bf.blurY = null;
        expect(bf.blurY).toBe(0);
    });

    it("default test case3", function()
    {
        let bf = new BlurFilter();
        bf.blurY = undefined;
        expect(bf.blurY).toBe(0);
    });

    it("default test case4", function()
    {
        let bf = new BlurFilter();
        bf.blurY = true;
        expect(bf.blurY).toBe(1);
    });

    it("default test case5", function()
    {
        let bf = new BlurFilter();
        bf.blurY = "";
        expect(bf.blurY).toBe(0);
    });

    it("default test case6", function()
    {
        let bf = new BlurFilter();
        bf.blurY = "abc";
        expect(bf.blurY).toBe(0);
    });

    it("default test case7", function()
    {
        let bf = new BlurFilter();
        bf.blurY = 0;
        expect(bf.blurY).toBe(0);
    });

    it("default test case8", function()
    {
        let bf = new BlurFilter();
        bf.blurY = 1;
        expect(bf.blurY).toBe(1);
    });

    it("default test case9", function()
    {
        let bf = new BlurFilter();
        bf.blurY = -1;
        expect(bf.blurY).toBe(0);
    });

    it("default test case10", function()
    {
        let bf = new BlurFilter();
        bf.blurY = { "a":0 };
        expect(bf.blurY).toBe(0);
    });

    it("default test case11", function()
    {
        let bf = new BlurFilter();
        bf.blurY = function a() {};
        expect(bf.blurY).toBe(0);
    });

    it("default test case12", function()
    {
        let bf = new BlurFilter();
        bf.blurY = [1];
        expect(bf.blurY).toBe(1);
    });

    it("default test case13", function()
    {
        let bf = new BlurFilter();
        bf.blurY = [1,2];
        expect(bf.blurY).toBe(0);
    });

    it("default test case14", function()
    {
        let bf = new BlurFilter();
        bf.blurY = {};
        expect(bf.blurY).toBe(0);
    });

    it("default test case15", function()
    {
        let bf = new BlurFilter();
        bf.blurY = { "toString":function () { return 1 } };
        expect(bf.blurY).toBe(1);
    });

    it("default test case16", function()
    {
        let bf = new BlurFilter();
        bf.blurY = { "toString":function () { return "1" } };
        expect(bf.blurY).toBe(1);
    });

    it("default test case17", function()
    {
        let bf = new BlurFilter();
        bf.blurY = { "toString":function () { return "1a" } };
        expect(bf.blurY).toBe(0);
    });

    it("default test case19", function()
    {
        let bf = new BlurFilter();
        bf.blurY = 500;
        expect(bf.blurY).toBe(255);
    });

    it("default test case20", function()
    {
        let bf = new BlurFilter();
        bf.blurY = -500;
        expect(bf.blurY).toBe(0);
    });

});

describe("BlurFilter.js quality test", function()
{

    it("default test case1", function()
    {
        let bf = new BlurFilter();
        expect(bf.quality).toBe(1);
    });

    it("default test case2", function()
    {
        let bf = new BlurFilter();
        bf.quality = null;
        expect(bf.quality).toBe(0);
    });

    it("default test case3", function()
    {
        let bf = new BlurFilter();
        bf.quality = undefined;
        expect(bf.quality).toBe(0);
    });

    it("default test case4", function()
    {
        let bf = new BlurFilter();
        bf.quality = true;
        expect(bf.quality).toBe(1);
    });

    it("default test case5", function()
    {
        let bf = new BlurFilter();
        bf.quality = "";
        expect(bf.quality).toBe(0);
    });

    it("default test case6", function()
    {
        let bf = new BlurFilter();
        bf.quality = "abc";
        expect(bf.quality).toBe(0);
    });

    it("default test case7", function()
    {
        let bf = new BlurFilter();
        bf.quality = 0;
        expect(bf.quality).toBe(0);
    });

    it("default test case8", function()
    {
        let bf = new BlurFilter();
        bf.quality = 1;
        expect(bf.quality).toBe(1);
    });

    it("default test case9", function()
    {
        let bf = new BlurFilter();
        bf.quality = 500;
        expect(bf.quality).toBe(15);
    });

    it("default test case10", function()
    {
        let bf = new BlurFilter();
        bf.quality = 50000000000000000;
        expect(bf.quality).toBe(15);
    });

    it("default test case11", function()
    {
        let bf = new BlurFilter();
        bf.quality = -1;
        expect(bf.quality).toBe(0);
    });

    it("default test case12", function()
    {
        let bf = new BlurFilter();
        bf.quality = -500;
        expect(bf.quality).toBe(0);
    });

    it("default test case13", function()
    {
        let bf = new BlurFilter();
        bf.quality = -50000000000000000;
        expect(bf.quality).toBe(0);
    });

    it("default test case14", function()
    {
        let bf = new BlurFilter();
        bf.quality = { "a":0 };
        expect(bf.quality).toBe(0);
    });

    it("default test case15", function()
    {
        let bf = new BlurFilter();
        bf.quality = function a() {};
        expect(bf.quality).toBe(0);
    });

    it("default test case16", function()
    {
        let bf = new BlurFilter();
        bf.quality = [1];
        expect(bf.quality).toBe(1);
    });

    it("default test case17", function()
    {
        let bf = new BlurFilter();
        bf.quality = [1,2];
        expect(bf.quality).toBe(0);
    });

    it("default test case18", function()
    {
        let bf = new BlurFilter();
        bf.quality = {};
        expect(bf.quality).toBe(0);
    });

    it("default test case19", function()
    {
        let bf = new BlurFilter();
        bf.quality = { "toString":function () { return 1 } };
        expect(bf.quality).toBe(1);
    });

    it("default test case20", function()
    {
        let bf = new BlurFilter();
        bf.quality = { "toString":function () { return "1" } };
        expect(bf.quality).toBe(1);
    });

    it("default test case21", function()
    {
        let bf = new BlurFilter();
        bf.quality = { "toString":function () { return "1a" } };
        expect(bf.quality).toBe(0);
    });

});