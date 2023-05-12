
describe("GlowFilter.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new GlowFilter();
        expect(object.namespace).toBe("next2d.filters.GlowFilter");
    });

    it("namespace test static", function()
    {
        expect(GlowFilter.namespace).toBe("next2d.filters.GlowFilter");
    });

});

describe("GlowFilter.js toString test", function()
{
    it("toString test success", function()
    {
        let filter = new GlowFilter();
        expect(filter.toString()).toBe("[object GlowFilter]");
    });

});

describe("GlowFilter.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(GlowFilter.toString()).toBe("[class GlowFilter]");
    });

});

describe("GlowFilter.js property test", function()
{

    // default
    it("default test success", function()
    {
        let filter = new GlowFilter();
        expect(filter.color).toBe(0);
        expect(filter.alpha).toBe(1);
        expect(filter.blurX).toBe(4);
        expect(filter.blurY).toBe(4);
        expect(filter.strength).toBe(1);
        expect(filter.quality).toBe(BitmapFilterQuality.LOW);
        expect(filter.inner).toBe(false);
        expect(filter.knockout).toBe(false);
    });

    // color
    it("color test success case1", function()
    {
        let filter = new GlowFilter(0x000000);
        expect(filter.color).toBe(0x000000);
    });

    it("color test success case2", function()
    {
        let filter = new GlowFilter(0xff0000);
        filter.color = 0x00ff00;
        expect(filter.color).toBe(0x00ff00);
    });

    it("color test valid case1", function()
    {
        let filter = new GlowFilter("0x0000ff");
        expect(filter.color).toBe(0x0000ff);
    });

    it("color test valid case2", function()
    {
        let filter = new GlowFilter("red");
        expect(filter.color).toBe(0xff0000);
    });

    it("color test valid case3", function()
    {
        let filter = new GlowFilter(-10);
        expect(filter.color).toBe(0);
    });

    it("color test valid case4", function()
    {
        let filter = new GlowFilter(16777220);
        expect(filter.color).toBe(0xffffff);
    });

    it("color test valid case5", function()
    {
        let filter = new GlowFilter(0xffffff);

        filter.color = "0x0000ff";
        expect(filter.color).toBe(0x0000ff);

        filter.color = -10;
        expect(filter.color).toBe(0);

        filter.color = 16777220;
        expect(filter.color).toBe(0xffffff);
    });

    // alpha
    it("alpha test success case1", function()
    {
        let filter = new GlowFilter(0xff0000, 0);
        expect(filter.alpha).toBe(0);
    });

    it("alpha test success case2", function()
    {
        let filter = new GlowFilter(0xff0000, 0.5);
        filter.alpha = 0.75;
        expect(filter.alpha).toBe(0.75);
    });

    it("alpha test valid case1", function()
    {
        let filter = new GlowFilter(0xff0000, "0.25");
        expect(filter.alpha).toBe(0.25);
    });

    it("alpha test valid case2", function()
    {
        let filter = new GlowFilter(0xff0000, -10);
        expect(filter.alpha).toBe(0);
    });

    it("alpha test valid case3", function()
    {
        let filter = new GlowFilter(0xff0000, 10);
        expect(filter.alpha).toBe(1);
    });

    it("alpha test valid case4", function()
    {
        let filter = new GlowFilter(0xffffff, 1);

        filter.alpha = "0.75";
        expect(filter.alpha).toBe(0.75);

        filter.alpha = -10;
        expect(filter.alpha).toBe(0);

        filter.alpha = 16777220;
        expect(filter.alpha).toBe(1);
    });

    // blurX
    it("blurX test success case1", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 0);
        expect(filter.blurX).toBe(0);
    });

    it("blurX test success case2", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 100);
        filter.blurX = 50;
        expect(filter.blurX).toBe(50);
    });

    it("blurX test valid case1", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 1000);
        expect(filter.blurX).toBe(255);
    });

    it("blurX test valid case2", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10);
        filter.blurX = 1000;
        expect(filter.blurX).toBe(255);
    });

    it("blurX test valid case3", function()
    {
        let filter = new GlowFilter(0xffffff, 1, -10);
        expect(filter.blurX).toBe(0);
    });

    it("blurX test valid case4", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10);
        filter.blurX = -1;
        expect(filter.blurX).toBe(0);
    });

    it("blurX test valid case5", function()
    {
        let filter = new GlowFilter(0xffffff, 1, "100");
        expect(filter.blurX).toBe(100);
    });

    it("blurX test valid case6", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10);
        filter.blurX = "123";
        expect(filter.blurX).toBe(123);
    });

    it("blurX test valid case7", function()
    {
        let filter = new GlowFilter(0xffffff, 1, "test");
        expect(filter.blurX).toBe(0);
    });

    it("blurX test valid case8", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10);
        filter.blurX = "123a";
        expect(filter.blurX).toBe(0);
    });

    // blurY
    it("blurY test success case1", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 0);
        expect(filter.blurY).toBe(0);
    });

    it("blurY test success case2", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 100);
        filter.blurY = 50;
        expect(filter.blurY).toBe(50);
    });

    it("blurY test valid case1", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 1000);
        expect(filter.blurY).toBe(255);
    });

    it("blurY test valid case2", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10);
        filter.blurY = 1000;
        expect(filter.blurY).toBe(255);
    });

    it("blurY test valid case3", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, -10);
        expect(filter.blurY).toBe(0);
    });

    it("blurY test valid case4", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10);
        filter.blurY = -1;
        expect(filter.blurY).toBe(0);
    });

    it("blurY test valid case5", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, "100");
        expect(filter.blurY).toBe(100);
    });

    it("blurY test valid case6", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10);
        filter.blurY = "123";
        expect(filter.blurY).toBe(123);
    });

    it("blurY test valid case7", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, "test");
        expect(filter.blurY).toBe(0);
    });

    it("blurY test valid case8", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10);
        filter.blurY = "123a";
        expect(filter.blurY).toBe(0);
    });

    // strength
    it("strength test success case1", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 100, 0);
        expect(filter.strength).toBe(0);
    });

    it("strength test success case2", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 100, 10);
        filter.strength = 2;
        expect(filter.strength).toBe(2);
    });

    it("strength test valid case1", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 100, "9");
        expect(filter.strength).toBe(9);
    });

    it("strength test valid case2", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 2);
        filter.strength = "9";
        expect(filter.strength).toBe(9);
    });

    it("strength test valid case3", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, -1);
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case4", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 2);
        filter.strength = -10;
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case5", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 1000);
        expect(filter.strength).toBe(255);
    });

    it("strength test valid case6", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 2);
        filter.strength = 1000;
        expect(filter.strength).toBe(255);
    });

    it("strength test valid case7", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, "test");
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case8", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3);
        filter.strength = "abc";
        expect(filter.strength).toBe(0);
    });

    // quality
    it("quality test success case1", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 0);
        expect(filter.quality).toBe(0);
    });

    it("quality test success case2", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5);
        filter.quality = 2;
        expect(filter.quality).toBe(2);
    });

    it("quality test valid case1", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 1000);
        expect(filter.quality).toBe(15);
    });

    it("quality test valid case2", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 2);
        filter.quality = 1000;
        expect(filter.quality).toBe(15);
    });

    it("quality test valid case3", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, -1);
        expect(filter.quality).toBe(0);
    });

    it("quality test valid case4", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5);
        filter.quality = -1;
        expect(filter.quality).toBe(0);
    });

    it("quality test valid case5", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, "12");
        expect(filter.quality).toBe(12);
    });

    it("quality test valid case6", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 10);
        filter.quality = "12";
        expect(filter.quality).toBe(12);
    });

    it("quality test valid case7", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, "test");
        expect(filter.quality).toBe(0);
    });

    it("quality test valid case8", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 10);
        filter.quality = "123a";
        expect(filter.quality).toBe(0);
    });

    // inner
    it("inner test success case1", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, true);
        expect(filter.inner).toBe(true);
    });

    it("inner test success case2", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, true);
        filter.inner = false;
        expect(filter.inner).toBe(false);
    });

    it("inner test valid case1", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, 1);
        expect(filter.inner).toBe(true);
    });

    it("inner test valid case2", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, false);
        filter.inner = 1;
        expect(filter.inner).toBe(true);
    });

    it("inner test valid case3", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, 0);
        expect(filter.inner).toBe(false);
    });

    it("inner test valid case4", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, true);
        filter.inner = 0;
        expect(filter.inner).toBe(false);
    });

    it("inner test valid case5", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, "test");
        expect(filter.inner).toBe(true);
    });

    it("inner test valid case6", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, true);
        filter.inner = "";
        expect(filter.inner).toBe(false);
    });

    it("inner test valid case7", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, {});
        expect(filter.inner).toBe(true);
    });

    it("inner test valid case8", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, []);
        expect(filter.inner).toBe(true);
    });

    // knockout
    it("knockout test success case1", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, false, true);
        expect(filter.knockout).toBe(true);
    });

    it("knockout test success case2", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, false, true);
        filter.knockout = false;
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case1", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, false, 1);
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case2", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, false, false);
        filter.knockout = 1;
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case3", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, false, 0);
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case4", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, false, true);
        filter.knockout = 0;
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case5", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, false, "test");
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case6", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, false, true);
        filter.knockout = "";
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case7", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, false, {});
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case8", function()
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, false, []);
        expect(filter.knockout).toBe(true);
    });

});

describe("GlowFilter.js clone test", function()
{

    it("clone test", function()
    {
        let filter = new GlowFilter(
            0x000000, 0.2, 10, 20, 6,
            BitmapFilterQuality.MEDIUM, true, true
        );
        let clone  = filter.clone();

        // clone check
        expect(clone.color).toBe(0x000000);
        expect(clone.alpha).toBe(0.2);
        expect(clone.blurX).toBe(10);
        expect(clone.blurY).toBe(20);
        expect(clone.strength).toBe(6);
        expect(clone.quality).toBe(BitmapFilterQuality.MEDIUM);
        expect(clone.inner).toBe(true);
        expect(clone.knockout).toBe(true);

        // edit param
        clone.color    = 0xffffff;
        clone.alpha    = 1;
        clone.blurX    = 9;
        clone.blurY    = 19;
        clone.strength = 4;
        clone.quality  = BitmapFilterQuality.HIGH;
        clone.inner    = false;
        clone.knockout = false;

        // origin
        expect(filter.color).toBe(0x000000);
        expect(filter.alpha).toBe(0.2);
        expect(filter.blurX).toBe(10);
        expect(filter.blurY).toBe(20);
        expect(filter.strength).toBe(6);
        expect(filter.quality).toBe(BitmapFilterQuality.MEDIUM);
        expect(filter.inner).toBe(true);
        expect(filter.knockout).toBe(true);

        // clone
        expect(clone.color).toBe(0xffffff);
        expect(clone.alpha).toBe(1);
        expect(clone.blurX).toBe(9);
        expect(clone.blurY).toBe(19);
        expect(clone.strength).toBe(4);
        expect(clone.quality).toBe(BitmapFilterQuality.HIGH);
        expect(clone.inner).toBe(false);
        expect(clone.knockout).toBe(false);

    });

});

describe("GlowFilter.js alpha test", function()
{

    it("default test case1", function()
    {
        let gf = new GlowFilter();
        expect(gf.alpha).toBe(1);
    });

    it("default test case2", function()
    {
        let gf = new GlowFilter();
        gf.alpha = null;
        expect(gf.alpha).toBe(0);
    });

    it("default test case3", function()
    {
        let gf = new GlowFilter();
        gf.alpha = undefined;
        expect(gf.alpha).toBe(0);
    });

    it("default test case4", function()
    {
        let gf = new GlowFilter();
        gf.alpha = true;
        expect(gf.alpha).toBe(1);
    });

    it("default test case5", function()
    {
        let gf = new GlowFilter();
        gf.alpha = "";
        expect(gf.alpha).toBe(0);
    });

    it("default test case6", function()
    {
        let gf = new GlowFilter();
        gf.alpha = "abc";
        expect(gf.alpha).toBe(0);
    });

    it("default test case7", function()
    {
        let gf = new GlowFilter();
        gf.alpha = 0;
        expect(gf.alpha).toBe(0);
    });

    it("default test case8", function()
    {
        let gf = new GlowFilter();
        gf.alpha = 1;
        expect(gf.alpha).toBe(1);
    });

    it("default test case9", function()
    {
        let gf = new GlowFilter();
        gf.alpha = 500;
        expect(gf.alpha).toBe(1);
    });

    it("default test case10", function()
    {
        let gf = new GlowFilter();
        gf.alpha = 50000000000000000;
        expect(gf.alpha).toBe(1);
    });

    it("default test case11", function()
    {
        let gf = new GlowFilter();
        gf.alpha = -1;
        expect(gf.alpha).toBe(0);
    });

    it("default test case12", function()
    {
        let gf = new GlowFilter();
        gf.alpha = -500;
        expect(gf.alpha).toBe(0);
    });

    it("default test case13", function()
    {
        let gf = new GlowFilter();
        gf.alpha = -50000000000000000;
        expect(gf.alpha).toBe(0);
    });

    it("default test case14", function()
    {
        let gf = new GlowFilter();
        gf.alpha = { "a":0 };
        expect(gf.alpha).toBe(0);
    });

    it("default test case15", function()
    {
        let gf = new GlowFilter();
        gf.alpha = function a() {};
        expect(gf.alpha).toBe(0);
    });

    it("default test case16", function()
    {
        let gf = new GlowFilter();
        gf.alpha = [1];
        expect(gf.alpha).toBe(1);
    });

    it("default test case17", function()
    {
        let gf = new GlowFilter();
        gf.alpha = [1,2];
        expect(gf.alpha).toBe(0);
    });

    it("default test case18", function()
    {
        let gf = new GlowFilter();
        gf.alpha = {};
        expect(gf.alpha).toBe(0);
    });

    it("default test case19", function()
    {
        let gf = new GlowFilter();
        gf.alpha = { "toString":function () { return 1 } };
        expect(gf.alpha).toBe(1);
    });

    it("default test case20", function()
    {
        let gf = new GlowFilter();
        gf.alpha = { "toString":function () { return "1" } };
        expect(gf.alpha).toBe(1);
    });

    it("default test case21", function()
    {
        let gf = new GlowFilter();
        gf.alpha = { "toString":function () { return "1a" } };
        expect(gf.alpha).toBe(0);
    });

});

describe("GlowFilter.js blurX test", function()
{

    it("default test case1", function()
    {
        let gf = new GlowFilter();
        expect(gf.blurX).toBe(4);
    });

    it("default test case2", function()
    {
        let gf = new GlowFilter();
        gf.blurX = null;
        expect(gf.blurX).toBe(0);
    });

    it("default test case3", function()
    {
        let gf = new GlowFilter();
        gf.blurX = undefined;
        expect(gf.blurX).toBe(0);
    });

    it("default test case4", function()
    {
        let gf = new GlowFilter();
        gf.blurX = true;
        expect(gf.blurX).toBe(1);
    });

    it("default test case5", function()
    {
        let gf = new GlowFilter();
        gf.blurX = "";
        expect(gf.blurX).toBe(0);
    });

    it("default test case6", function()
    {
        let gf = new GlowFilter();
        gf.blurX = "abc";
        expect(gf.blurX).toBe(0);
    });

    it("default test case7", function()
    {
        let gf = new GlowFilter();
        gf.blurX = 0;
        expect(gf.blurX).toBe(0);
    });

    it("default test case8", function()
    {
        let gf = new GlowFilter();
        gf.blurX = 1;
        expect(gf.blurX).toBe(1);
    });

    it("default test case9", function()
    {
        let gf = new GlowFilter();
        gf.blurX = 500;
        expect(gf.blurX).toBe(255);
    });

    it("default test case10", function()
    {
        let gf = new GlowFilter();
        gf.blurX = 50000000000000000;
        expect(gf.blurX).toBe(255);
    });

    it("default test case11", function()
    {
        let gf = new GlowFilter();
        gf.blurX = -1;
        expect(gf.blurX).toBe(0);
    });

    it("default test case12", function()
    {
        let gf = new GlowFilter();
        gf.blurX = -500;
        expect(gf.blurX).toBe(0);
    });

    it("default test case13", function()
    {
        let gf = new GlowFilter();
        gf.blurX = -50000000000000000;
        expect(gf.blurX).toBe(0);
    });

    it("default test case14", function()
    {
        let gf = new GlowFilter();
        gf.blurX = { "a":0 };
        expect(gf.blurX).toBe(0);
    });

    it("default test case15", function()
    {
        let gf = new GlowFilter();
        gf.blurX = function a() {};
        expect(gf.blurX).toBe(0);
    });

    it("default test case16", function()
    {
        let gf = new GlowFilter();
        gf.blurX = [1];
        expect(gf.blurX).toBe(1);
    });

    it("default test case17", function()
    {
        let gf = new GlowFilter();
        gf.blurX = [1,2];
        expect(gf.blurX).toBe(0);
    });

    it("default test case18", function()
    {
        let gf = new GlowFilter();
        gf.blurX = {};
        expect(gf.blurX).toBe(0);
    });

    it("default test case19", function()
    {
        let gf = new GlowFilter();
        gf.blurX = { "toString":function () { return 1 } };
        expect(gf.blurX).toBe(1);
    });

    it("default test case20", function()
    {
        let gf = new GlowFilter();
        gf.blurX = { "toString":function () { return "1" } };
        expect(gf.blurX).toBe(1);
    });

    it("default test case21", function()
    {
        let gf = new GlowFilter();
        gf.blurX = { "toString":function () { return "1a" } };
        expect(gf.blurX).toBe(0);
    });

});

describe("GlowFilter.js blurY test", function()
{

    it("default test case1", function()
    {
        let gf = new GlowFilter();
        expect(gf.blurY).toBe(4);
    });

    it("default test case2", function()
    {
        let gf = new GlowFilter();
        gf.blurY = null;
        expect(gf.blurY).toBe(0);
    });

    it("default test case3", function()
    {
        let gf = new GlowFilter();
        gf.blurY = undefined;
        expect(gf.blurY).toBe(0);
    });

    it("default test case4", function()
    {
        let gf = new GlowFilter();
        gf.blurY = true;
        expect(gf.blurY).toBe(1);
    });

    it("default test case5", function()
    {
        let gf = new GlowFilter();
        gf.blurY = "";
        expect(gf.blurY).toBe(0);
    });

    it("default test case6", function()
    {
        let gf = new GlowFilter();
        gf.blurY = "abc";
        expect(gf.blurY).toBe(0);
    });

    it("default test case7", function()
    {
        let gf = new GlowFilter();
        gf.blurY = 0;
        expect(gf.blurY).toBe(0);
    });

    it("default test case8", function()
    {
        let gf = new GlowFilter();
        gf.blurY = 1;
        expect(gf.blurY).toBe(1);
    });

    it("default test case9", function()
    {
        let gf = new GlowFilter();
        gf.blurY = 500;
        expect(gf.blurY).toBe(255);
    });

    it("default test case10", function()
    {
        let gf = new GlowFilter();
        gf.blurY = 50000000000000000;
        expect(gf.blurY).toBe(255);
    });

    it("default test case11", function()
    {
        let gf = new GlowFilter();
        gf.blurY = -1;
        expect(gf.blurY).toBe(0);
    });

    it("default test case12", function()
    {
        let gf = new GlowFilter();
        gf.blurY = -500;
        expect(gf.blurY).toBe(0);
    });

    it("default test case13", function()
    {
        let gf = new GlowFilter();
        gf.blurY = -50000000000000000;
        expect(gf.blurY).toBe(0);
    });

    it("default test case14", function()
    {
        let gf = new GlowFilter();
        gf.blurY = { "a":0 };
        expect(gf.blurY).toBe(0);
    });

    it("default test case15", function()
    {
        let gf = new GlowFilter();
        gf.blurY = function a() {};
        expect(gf.blurY).toBe(0);
    });

    it("default test case16", function()
    {
        let gf = new GlowFilter();
        gf.blurY = [1];
        expect(gf.blurY).toBe(1);
    });

    it("default test case17", function()
    {
        let gf = new GlowFilter();
        gf.blurY = [1,2];
        expect(gf.blurY).toBe(0);
    });

    it("default test case18", function()
    {
        let gf = new GlowFilter();
        gf.blurY = {};
        expect(gf.blurY).toBe(0);
    });

    it("default test case19", function()
    {
        let gf = new GlowFilter();
        gf.blurY = { "toString":function () { return 1 } };
        expect(gf.blurY).toBe(1);
    });

    it("default test case20", function()
    {
        let gf = new GlowFilter();
        gf.blurY = { "toString":function () { return "1" } };
        expect(gf.blurY).toBe(1);
    });

    it("default test case21", function()
    {
        let gf = new GlowFilter();
        gf.blurY = { "toString":function () { return "1a" } };
        expect(gf.blurY).toBe(0);
    });

});

describe("GlowFilter.js color test", function()
{

    it("default test case1", function()
    {
        let gf = new GlowFilter();
        expect(gf.color).toBe(0);
    });

    it("default test case2", function()
    {
        let gf = new GlowFilter();
        gf.color = null;
        expect(gf.color).toBe(0);
    });

    it("default test case3", function()
    {
        let gf = new GlowFilter();
        gf.color = undefined;
        expect(gf.color).toBe(0);
    });

    it("default test case4", function()
    {
        let gf = new GlowFilter();
        gf.color = true;
        expect(gf.color).toBe(1);
    });

    it("default test case5", function()
    {
        let gf = new GlowFilter();
        gf.color = "";
        expect(gf.color).toBe(0);
    });

    it("default test case6", function()
    {
        let gf = new GlowFilter();
        gf.color = "abc";
        expect(gf.color).toBe(0);
    });

    it("default test case7", function()
    {
        let gf = new GlowFilter();
        gf.color = 0;
        expect(gf.color).toBe(0);
    });

    it("default test case8", function()
    {
        let gf = new GlowFilter();
        gf.color = 1;
        expect(gf.color).toBe(1);
    });

    it("default test case9", function()
    {
        let gf = new GlowFilter();
        gf.color = 500;
        expect(gf.color).toBe(500);
    });

    it("default test case10", function()
    {
        let gf = new GlowFilter();
        gf.color = 50000000000000000;
        expect(gf.color).toBe(0xffffff);
    });

    it("default test case11", function()
    {
        let gf = new GlowFilter();
        gf.color = -1;
        expect(gf.color).toBe(0);
    });

    it("default test case12", function()
    {
        let gf = new GlowFilter();
        gf.color = -500;
        expect(gf.color).toBe(0);
    });

    it("default test case13", function()
    {
        let gf = new GlowFilter();
        gf.color = -50000000000000000;
        expect(gf.color).toBe(0);
    });

    it("default test case14", function()
    {
        let gf = new GlowFilter();
        gf.color = { "a":0 };
        expect(gf.color).toBe(0);
    });

    it("default test case15", function()
    {
        let gf = new GlowFilter();
        gf.color = function a() {};
        expect(gf.color).toBe(0);
    });

    it("default test case16", function()
    {
        let gf = new GlowFilter();
        gf.color = [1];
        expect(gf.color).toBe(1);
    });

    it("default test case17", function()
    {
        let gf = new GlowFilter();
        gf.color = [1,2];
        expect(gf.color).toBe(0);
    });

    it("default test case18", function()
    {
        let gf = new GlowFilter();
        gf.color = {};
        expect(gf.color).toBe(0);
    });

    it("default test case19", function()
    {
        let gf = new GlowFilter();
        gf.color = { "toString":function () { return 1 } };
        expect(gf.color).toBe(1);
    });

    it("default test case20", function()
    {
        let gf = new GlowFilter();
        gf.color = { "toString":function () { return "1" } };
        expect(gf.color).toBe(1);
    });

    it("default test case21", function()
    {
        let gf = new GlowFilter();
        gf.color = { "toString":function () { return "1a" } };
        expect(gf.color).toBe(0);
    });

});

describe("GlowFilter.js inner test", function()
{

    it("default test case1", function()
    {
        let gf = new GlowFilter();
        expect(gf.inner).toBe(false);
    });

    it("default test case2", function()
    {
        let gf = new GlowFilter();
        gf.inner = null;
        expect(gf.inner).toBe(false);
    });

    it("default test case3", function()
    {
        let gf = new GlowFilter();
        gf.inner = undefined;
        expect(gf.inner).toBe(false);
    });

    it("default test case4", function()
    {
        let gf = new GlowFilter();
        gf.inner = true;
        expect(gf.inner).toBe(true);
    });

    it("default test case5", function()
    {
        let gf = new GlowFilter();
        gf.inner = "";
        expect(gf.inner).toBe(false);
    });

    it("default test case6", function()
    {
        let gf = new GlowFilter();
        gf.inner = "abc";
        expect(gf.inner).toBe(true);
    });

    it("default test case7", function()
    {
        let gf = new GlowFilter();
        gf.inner = 0;
        expect(gf.inner).toBe(false);
    });

    it("default test case8", function()
    {
        let gf = new GlowFilter();
        gf.inner = 1;
        expect(gf.inner).toBe(true);
    });

    it("default test case9", function()
    {
        let gf = new GlowFilter();
        gf.inner = 500;
        expect(gf.inner).toBe(true);
    });

    it("default test case10", function()
    {
        let gf = new GlowFilter();
        gf.inner = 50000000000000000;
        expect(gf.inner).toBe(true);
    });

    it("default test case11", function()
    {
        let gf = new GlowFilter();
        gf.inner = -1;
        expect(gf.inner).toBe(true);
    });

    it("default test case12", function()
    {
        let gf = new GlowFilter();
        gf.inner = -500;
        expect(gf.inner).toBe(true);
    });

    it("default test case13", function()
    {
        let gf = new GlowFilter();
        gf.inner = -50000000000000000;
        expect(gf.inner).toBe(true);
    });

    it("default test case14", function()
    {
        let gf = new GlowFilter();
        gf.inner = { "a":0 };
        expect(gf.inner).toBe(true);
    });

    it("default test case15", function()
    {
        let gf = new GlowFilter();
        gf.inner = function a() {};
        expect(gf.inner).toBe(true);
    });

    it("default test case16", function()
    {
        let gf = new GlowFilter();
        gf.inner = [1];
        expect(gf.inner).toBe(true);
    });

    it("default test case17", function()
    {
        let gf = new GlowFilter();
        gf.inner = [1,2];
        expect(gf.inner).toBe(true);
    });

    it("default test case18", function()
    {
        let gf = new GlowFilter();
        gf.inner = {};
        expect(gf.inner).toBe(true);
    });

    it("default test case19", function()
    {
        let gf = new GlowFilter();
        gf.inner = { "toString":function () { return 1 } };
        expect(gf.inner).toBe(true);
    });

    it("default test case20", function()
    {
        let gf = new GlowFilter();
        gf.inner = { "toString":function () { return "1" } };
        expect(gf.inner).toBe(true);
    });

    it("default test case21", function()
    {
        let gf = new GlowFilter();
        gf.inner = { "toString":function () { return "1a" } };
        expect(gf.inner).toBe(true);
    });

});

describe("GlowFilter.js knockout test", function()
{

    it("default test case1", function()
    {
        let gf = new GlowFilter();
        expect(gf.knockout).toBe(false);
    });

    it("default test case2", function()
    {
        let gf = new GlowFilter();
        gf.knockout = null;
        expect(gf.knockout).toBe(false);
    });

    it("default test case3", function()
    {
        let gf = new GlowFilter();
        gf.knockout = undefined;
        expect(gf.knockout).toBe(false);
    });

    it("default test case4", function()
    {
        let gf = new GlowFilter();
        gf.knockout = true;
        expect(gf.knockout).toBe(true);
    });

    it("default test case5", function()
    {
        let gf = new GlowFilter();
        gf.knockout = "";
        expect(gf.knockout).toBe(false);
    });

    it("default test case6", function()
    {
        let gf = new GlowFilter();
        gf.knockout = "abc";
        expect(gf.knockout).toBe(true);
    });

    it("default test case7", function()
    {
        let gf = new GlowFilter();
        gf.knockout = 0;
        expect(gf.knockout).toBe(false);
    });

    it("default test case8", function()
    {
        let gf = new GlowFilter();
        gf.knockout = 1;
        expect(gf.knockout).toBe(true);
    });

    it("default test case9", function()
    {
        let gf = new GlowFilter();
        gf.knockout = 500;
        expect(gf.knockout).toBe(true);
    });

    it("default test case10", function()
    {
        let gf = new GlowFilter();
        gf.knockout = 50000000000000000;
        expect(gf.knockout).toBe(true);
    });

    it("default test case11", function()
    {
        let gf = new GlowFilter();
        gf.knockout = -1;
        expect(gf.knockout).toBe(true);
    });

    it("default test case12", function()
    {
        let gf = new GlowFilter();
        gf.knockout = -500;
        expect(gf.knockout).toBe(true);
    });

    it("default test case13", function()
    {
        let gf = new GlowFilter();
        gf.knockout = -50000000000000000;
        expect(gf.knockout).toBe(true);
    });

    it("default test case14", function()
    {
        let gf = new GlowFilter();
        gf.knockout = { "a":0 };
        expect(gf.knockout).toBe(true);
    });

    it("default test case15", function()
    {
        let gf = new GlowFilter();
        gf.knockout = function a() {};
        expect(gf.knockout).toBe(true);
    });

    it("default test case16", function()
    {
        let gf = new GlowFilter();
        gf.knockout = [1];
        expect(gf.knockout).toBe(true);
    });

    it("default test case17", function()
    {
        let gf = new GlowFilter();
        gf.knockout = [1,2];
        expect(gf.knockout).toBe(true);
    });

    it("default test case18", function()
    {
        let gf = new GlowFilter();
        gf.knockout = {};
        expect(gf.knockout).toBe(true);
    });

    it("default test case19", function()
    {
        let gf = new GlowFilter();
        gf.knockout = { "toString":function () { return 1 } };
        expect(gf.knockout).toBe(true);
    });

    it("default test case20", function()
    {
        let gf = new GlowFilter();
        gf.knockout = { "toString":function () { return "1" } };
        expect(gf.knockout).toBe(true);
    });

    it("default test case21", function()
    {
        let gf = new GlowFilter();
        gf.knockout = { "toString":function () { return "1a" } };
        expect(gf.knockout).toBe(true);
    });

});

describe("GlowFilter.js quality test", function()
{

    it("default test case1", function()
    {
        let gf = new GlowFilter();
        expect(gf.quality).toBe(1);
    });

    it("default test case2", function()
    {
        let gf = new GlowFilter();
        gf.quality = null;
        expect(gf.quality).toBe(0);
    });

    it("default test case3", function()
    {
        let gf = new GlowFilter();
        gf.quality = undefined;
        expect(gf.quality).toBe(0);
    });

    it("default test case4", function()
    {
        let gf = new GlowFilter();
        gf.quality = true;
        expect(gf.quality).toBe(1);
    });

    it("default test case5", function()
    {
        let gf = new GlowFilter();
        gf.quality = "";
        expect(gf.quality).toBe(0);
    });

    it("default test case6", function()
    {
        let gf = new GlowFilter();
        gf.quality = "abc";
        expect(gf.quality).toBe(0);
    });

    it("default test case7", function()
    {
        let gf = new GlowFilter();
        gf.quality = 0;
        expect(gf.quality).toBe(0);
    });

    it("default test case8", function()
    {
        let gf = new GlowFilter();
        gf.quality = 1;
        expect(gf.quality).toBe(1);
    });

    it("default test case9", function()
    {
        let gf = new GlowFilter();
        gf.quality = 500;
        expect(gf.quality).toBe(15);
    });

    it("default test case10", function()
    {
        let gf = new GlowFilter();
        gf.quality = 50000000000000000;
        expect(gf.quality).toBe(15);
    });

    it("default test case11", function()
    {
        let gf = new GlowFilter();
        gf.quality = -1;
        expect(gf.quality).toBe(0);
    });

    it("default test case12", function()
    {
        let gf = new GlowFilter();
        gf.quality = -500;
        expect(gf.quality).toBe(0);
    });

    it("default test case13", function()
    {
        let gf = new GlowFilter();
        gf.quality = -50000000000000000;
        expect(gf.quality).toBe(0);
    });

    it("default test case14", function()
    {
        let gf = new GlowFilter();
        gf.quality = { "a":0 };
        expect(gf.quality).toBe(0);
    });

    it("default test case15", function()
    {
        let gf = new GlowFilter();
        gf.quality = function a() {};
        expect(gf.quality).toBe(0);
    });

    it("default test case16", function()
    {
        let gf = new GlowFilter();
        gf.quality = [1];
        expect(gf.quality).toBe(1);
    });

    it("default test case17", function()
    {
        let gf = new GlowFilter();
        gf.quality = [1,2];
        expect(gf.quality).toBe(0);
    });

    it("default test case18", function()
    {
        let gf = new GlowFilter();
        gf.quality = {};
        expect(gf.quality).toBe(0);
    });

    it("default test case19", function()
    {
        let gf = new GlowFilter();
        gf.quality = { "toString":function () { return 1 } };
        expect(gf.quality).toBe(1);
    });

    it("default test case20", function()
    {
        let gf = new GlowFilter();
        gf.quality = { "toString":function () { return "1" } };
        expect(gf.quality).toBe(1);
    });

    it("default test case21", function()
    {
        let gf = new GlowFilter();
        gf.quality = { "toString":function () { return "1a" } };
        expect(gf.quality).toBe(0);
    });

});

describe("GlowFilter.js strength test", function()
{

    it("default test case1", function()
    {
        let gf = new GlowFilter();
        expect(gf.strength).toBe(1);
    });

    it("default test case2", function()
    {
        let gf = new GlowFilter();
        gf.strength = null;
        expect(gf.strength).toBe(0);
    });

    it("default test case3", function()
    {
        let gf = new GlowFilter();
        gf.strength = undefined;
        expect(gf.strength).toBe(0);
    });

    it("default test case4", function()
    {
        let gf = new GlowFilter();
        gf.strength = true;
        expect(gf.strength).toBe(1);
    });

    it("default test case5", function()
    {
        let gf = new GlowFilter();
        gf.strength = "";
        expect(gf.strength).toBe(0);
    });

    it("default test case6", function()
    {
        let gf = new GlowFilter();
        gf.strength = "abc";
        expect(gf.strength).toBe(0);
    });

    it("default test case7", function()
    {
        let gf = new GlowFilter();
        gf.strength = 0;
        expect(gf.strength).toBe(0);
    });

    it("default test case8", function()
    {
        let gf = new GlowFilter();
        gf.strength = 1;
        expect(gf.strength).toBe(1);
    });

    it("default test case9", function()
    {
        let gf = new GlowFilter();
        gf.strength = 500;
        expect(gf.strength).toBe(255);
    });

    it("default test case10", function()
    {
        let gf = new GlowFilter();
        gf.strength = 50000000000000000;
        expect(gf.strength).toBe(255);
    });

    it("default test case11", function()
    {
        let gf = new GlowFilter();
        gf.strength = -1;
        expect(gf.strength).toBe(0);
    });

    it("default test case12", function()
    {
        let gf = new GlowFilter();
        gf.strength = -500;
        expect(gf.strength).toBe(0);
    });

    it("default test case13", function()
    {
        let gf = new GlowFilter();
        gf.strength = -50000000000000000;
        expect(gf.strength).toBe(0);
    });

    it("default test case14", function()
    {
        let gf = new GlowFilter();
        gf.strength = { "a":0 };
        expect(gf.strength).toBe(0);
    });

    it("default test case15", function()
    {
        let gf = new GlowFilter();
        gf.strength = function a() {};
        expect(gf.strength).toBe(0);
    });

    it("default test case16", function()
    {
        let gf = new GlowFilter();
        gf.strength = [1];
        expect(gf.strength).toBe(1);
    });

    it("default test case17", function()
    {
        let gf = new GlowFilter();
        gf.strength = [1,2];
        expect(gf.strength).toBe(0);
    });

    it("default test case18", function()
    {
        let gf = new GlowFilter();
        gf.strength = {};
        expect(gf.strength).toBe(0);
    });

    it("default test case19", function()
    {
        let gf = new GlowFilter();
        gf.strength = { "toString":function () { return 1 } };
        expect(gf.strength).toBe(1);
    });

    it("default test case20", function()
    {
        let gf = new GlowFilter();
        gf.strength = { "toString":function () { return "1" } };
        expect(gf.strength).toBe(1);
    });

    it("default test case21", function()
    {
        let gf = new GlowFilter();
        gf.strength = { "toString":function () { return "1a" } };
        expect(gf.strength).toBe(0);
    });

});