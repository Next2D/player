
describe("DropShadowFilter.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new DropShadowFilter();
        expect(object.namespace).toBe("next2d.filters.DropShadowFilter");
    });

    it("namespace test static", function()
    {
        expect(DropShadowFilter.namespace).toBe("next2d.filters.DropShadowFilter");
    });

});

describe("DropShadowFilter.js toString test", function()
{
    it("toString test success", function()
    {
        let filter = new DropShadowFilter();
        expect(filter.toString()).toBe("[object DropShadowFilter]");
    });

});

describe("DropShadowFilter.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(DropShadowFilter.toString()).toBe("[class DropShadowFilter]");
    });

});

describe("DropShadowFilter.js property test", function()
{

    // default
    it("default test success", function()
    {
        let filter = new DropShadowFilter();
        expect(filter.distance).toBe(4);
        expect(filter.angle).toBe(45);
        expect(filter.color).toBe(0);
        expect(filter.alpha).toBe(1);
        expect(filter.blurX).toBe(4);
        expect(filter.blurY).toBe(4);
        expect(filter.strength).toBe(1);
        expect(filter.quality).toBe(BitmapFilterQuality.LOW);
        expect(filter.inner).toBe(false);
        expect(filter.knockout).toBe(false);
        expect(filter.hideObject).toBe(false);
    });

    // distance
    it("distance test success case1", function()
    {
        let filter = new DropShadowFilter(0);
        expect(filter.distance).toBe(0);
    });

    it("distance test success case2", function()
    {
        let filter = new DropShadowFilter(10.5);
        filter.distance = -12.6;
        expect(filter.distance).toBe(-12.6);
    });

    it("distance test valid case1", function()
    {
        let filter = new DropShadowFilter("23");
        expect(filter.distance).toBe(23);
    });

    it("distance test valid case2", function()
    {
        let filter = new DropShadowFilter(1000);
        expect(filter.distance).toBe(255);
    });

    it("distance test valid case3", function()
    {
        let filter = new DropShadowFilter(-1000);
        expect(filter.distance).toBe(-255);
    });

    it("distance test valid case4", function()
    {
        let filter = new DropShadowFilter(10);
        filter.distance = "-56";
        expect(filter.distance).toBe(-56);
    });

    it("distance test valid case5", function()
    {
        let filter = new DropShadowFilter(10);
        filter.distance = 400;
        expect(filter.distance).toBe(255);
    });

    it("distance test valid case6", function()
    {
        let filter = new DropShadowFilter(10);
        filter.distance = -400;
        expect(filter.distance).toBe(-255);
    });

    it("distance test valid case7", function()
    {
        let filter = new DropShadowFilter("test");
        expect(filter.distance).toBe(4);
    });

    it("distance test valid case8", function()
    {
        let filter = new DropShadowFilter(10);
        filter.distance = "abc";
        expect(filter.distance).toBe(4);
    });

    // angle
    it("angle test success case1", function()
    {
        let filter = new DropShadowFilter(10.5, 0);
        expect(filter.angle).toBe(0);
    });

    it("angle test success case2", function()
    {
        let filter = new DropShadowFilter(10.5, 90);
        filter.angle = 180;
        expect(filter.angle).toBe(180);
    });

    it("angle test valid case1", function()
    {
        let filter = new DropShadowFilter(10.5, "20");
        expect(filter.angle).toBe(20);
    });

    it("angle test valid case2", function()
    {
        let filter = new DropShadowFilter(10.5, 20);
        filter.angle = "180";
        expect(filter.angle).toBe(180);
    });

    it("angle test valid case3", function()
    {
        let filter = new DropShadowFilter(10.5, 20);
        filter.angle = 4500;
        expect(filter.angle).toBe(180);
    });

    it("angle test valid case4", function()
    {
        let filter = new DropShadowFilter(10.5, 20);
        filter.angle = -4500;
        expect(filter.angle).toBe(-180);
    });

    it("angle test valid case5", function()
    {
        let filter = new DropShadowFilter(10.5, "test");
        expect(filter.angle).toBe(45);
    });

    it("angle test valid case6", function()
    {
        let filter = new DropShadowFilter(10.5, 20);
        filter.angle = "abc";
        expect(filter.angle).toBe(45);
    });

    // color
    it("color test success case1", function()
    {
        let filter = new DropShadowFilter(10.5, 20, 0);
        expect(filter.color).toBe(0);
    });

    it("color test success case2", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xff0000);
        filter.color = 0x00ff00;
        expect(filter.color).toBe(0x00ff00);
    });

    it("color test valid case1", function()
    {
        let filter = new DropShadowFilter(10.5, 90, "0x0000ff");
        expect(filter.color).toBe(0x0000ff);
    });

    it("color test valid case2", function()
    {
        let filter = new DropShadowFilter(10.5, 90, "red");
        expect(filter.color).toBe(0xff0000);
    });

    it("color test valid case3", function()
    {
        let filter = new DropShadowFilter(10.5, 90, -10);
        expect(filter.color).toBe(0);
    });

    it("color test valid case4", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 16777220);
        expect(filter.color).toBe(0xffffff);
    });

    it("color test valid case5", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff);

        filter.color = "0x0000ff";
        expect(filter.color).toBe(0x0000ff);

        filter.color = "red";
        expect(filter.color).toBe(0xff0000);

        filter.color = -10;
        expect(filter.color).toBe(0);

        filter.color = 16777220;
        expect(filter.color).toBe(0xffffff);
    });

    // alpha
    it("alpha test success case1", function()
    {
        let filter = new DropShadowFilter(10.5, 20, 0xff0000, 0);
        expect(filter.alpha).toBe(0);
    });

    it("alpha test success case2", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xff0000, 0.5);
        filter.alpha = 0.75;
        expect(filter.alpha).toBe(0.75);
    });

    it("alpha test valid case1", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xff0000, "0.25");
        expect(filter.alpha).toBe(0.25);
    });

    it("alpha test valid case2", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xff0000, -10);
        expect(filter.alpha).toBe(0);
    });

    it("alpha test valid case3", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xff0000, 10);
        expect(filter.alpha).toBe(1);
    });

    it("alpha test valid case4", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1);

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
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 0);
        expect(filter.blurX).toBe(0);
    });

    it("blurX test success case2", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 100);
        filter.blurX = 50;
        expect(filter.blurX).toBe(50);
    });

    it("blurX test valid case1", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 1000);
        expect(filter.blurX).toBe(255);
    });

    it("blurX test valid case2", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10);
        filter.blurX = 1000;
        expect(filter.blurX).toBe(255);
    });

    it("blurX test valid case3", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, -10);
        expect(filter.blurX).toBe(0);
    });

    it("blurX test valid case4", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10);
        filter.blurX = -1;
        expect(filter.blurX).toBe(0);
    });

    it("blurX test valid case5", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, "100");
        expect(filter.blurX).toBe(100);
    });

    it("blurX test valid case6", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10);
        filter.blurX = "123";
        expect(filter.blurX).toBe(123);
    });

    it("blurX test valid case7", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, "test");
        expect(filter.blurX).toBe(0);
    });

    it("blurX test valid case8", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10);
        filter.blurX = "123a";
        expect(filter.blurX).toBe(0);
    });

    // blurY
    it("blurY test success case1", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 0);
        expect(filter.blurY).toBe(0);
    });

    it("blurY test success case2", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 100);
        filter.blurY = 50;
        expect(filter.blurY).toBe(50);
    });

    it("blurY test valid case1", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 1000);
        expect(filter.blurY).toBe(255);
    });

    it("blurY test valid case2", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10);
        filter.blurY = 1000;
        expect(filter.blurY).toBe(255);
    });

    it("blurY test valid case3", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, -10);
        expect(filter.blurY).toBe(0);
    });

    it("blurY test valid case4", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10);
        filter.blurY = -1;
        expect(filter.blurY).toBe(0);
    });

    it("blurY test valid case5", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, "100");
        expect(filter.blurY).toBe(100);
    });

    it("blurY test valid case6", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10);
        filter.blurY = "123";
        expect(filter.blurY).toBe(123);
    });

    it("blurY test valid case7", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, "test");
        expect(filter.blurY).toBe(0);
    });

    it("blurY test valid case8", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10);
        filter.blurY = "123a";
        expect(filter.blurY).toBe(0);
    });

    // strength
    it("strength test success case1", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 100, 0);
        expect(filter.strength).toBe(0);
    });

    it("strength test success case2", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 100, 10);
        filter.strength = 2;
        expect(filter.strength).toBe(2);
    });

    it("strength test valid case1", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 100, "9");
        expect(filter.strength).toBe(9);
    });

    it("strength test valid case2", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 2);
        filter.strength = "9";
        expect(filter.strength).toBe(9);
    });

    it("strength test valid case3", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, -1);
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case4", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 2);
        filter.strength = -10;
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case5", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 1000);
        expect(filter.strength).toBe(255);
    });

    it("strength test valid case6", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 2);
        filter.strength = 1000;
        expect(filter.strength).toBe(255);
    });

    it("strength test valid case7", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, "test");
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case8", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3);
        filter.strength = "abc";
        expect(filter.strength).toBe(0);
    });

    // quality
    it("quality test success case1", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 0);
        expect(filter.quality).toBe(0);
    });

    it("quality test success case2", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5);
        filter.quality = 2;
        expect(filter.quality).toBe(2);
    });

    it("quality test valid case1", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 1000);
        expect(filter.quality).toBe(15);
    });

    it("quality test valid case2", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 2);
        filter.quality = 1000;
        expect(filter.quality).toBe(15);
    });

    it("quality test valid case3", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, -1);
        expect(filter.quality).toBe(0);
    });

    it("quality test valid case4", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5);
        filter.quality = -1;
        expect(filter.quality).toBe(0);
    });

    it("quality test valid case5", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, "12");
        expect(filter.quality).toBe(12);
    });

    it("quality test valid case6", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 10);
        filter.quality = "12";
        expect(filter.quality).toBe(12);
    });

    it("quality test valid case7", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, "test");
        expect(filter.quality).toBe(0);
    });

    it("quality test valid case8", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 10);
        filter.quality = "123a";
        expect(filter.quality).toBe(0);
    });

    // inner
    it("inner test success case1", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, true);
        expect(filter.inner).toBe(true);
    });

    it("inner test success case2", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, true);
        filter.inner = false;
        expect(filter.inner).toBe(false);
    });

    it("inner test valid case1", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, 1);
        expect(filter.inner).toBe(true);
    });

    it("inner test valid case2", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false);
        filter.inner = 1;
        expect(filter.inner).toBe(true);
    });

    it("inner test valid case3", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, 0);
        expect(filter.inner).toBe(false);
    });

    it("inner test valid case4", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, true);
        filter.inner = 0;
        expect(filter.inner).toBe(false);
    });

    it("inner test valid case5", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, "test");
        expect(filter.inner).toBe(true);
    });

    it("inner test valid case6", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, true);
        filter.inner = "";
        expect(filter.inner).toBe(false);
    });

    it("inner test valid case7", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, {});
        expect(filter.inner).toBe(true);
    });

    it("inner test valid case8", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, []);
        expect(filter.inner).toBe(true);
    });

    // knockout
    it("knockout test success case1", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, true);
        expect(filter.knockout).toBe(true);
    });

    it("knockout test success case2", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, true);
        filter.knockout = false;
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case1", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, 1);
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case2", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false);
        filter.knockout = 1;
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case3", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, 0);
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case4", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, true);
        filter.knockout = 0;
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case5", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, "test");
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case6", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, true);
        filter.knockout = "";
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case7", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, {});
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case8", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, []);
        expect(filter.knockout).toBe(true);
    });

    // hideObject
    it("hideObject test success case1", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false, true);
        expect(filter.hideObject).toBe(true);
    });

    it("hideObject test success case2", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false, true);
        filter.hideObject = false;
        expect(filter.hideObject).toBe(false);
    });

    it("hideObject test valid case1", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false, 1);
        expect(filter.hideObject).toBe(true);
    });

    it("hideObject test valid case2", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false, false);
        filter.hideObject = 1;
        expect(filter.hideObject).toBe(true);
    });

    it("hideObject test valid case3", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false, 0);
        expect(filter.hideObject).toBe(false);
    });

    it("hideObject test valid case4", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false, true);
        filter.hideObject = 0;
        expect(filter.hideObject).toBe(false);
    });

    it("hideObject test valid case5", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false, "test");
        expect(filter.hideObject).toBe(true);
    });

    it("hideObject test valid case6", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false, true);
        filter.hideObject = "";
        expect(filter.hideObject).toBe(false);
    });

    it("hideObject test valid case7", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false, {});
        expect(filter.hideObject).toBe(true);
    });

    it("hideObject test valid case8", function()
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false, []);
        expect(filter.hideObject).toBe(true);
    });

});

describe("DropShadowFilter.js clone test", function()
{

    it("clone test", function()
    {
        let filter = new DropShadowFilter(
            1, 90, 0xff0000, 0.3,
            10, 20, 2, BitmapFilterQuality.HIGH,
            true, true, true
        );
        let clone  = filter.clone();

        // clone check
        expect(clone.distance).toBe(1);
        expect(clone.angle).toBe(90);
        expect(clone.color).toBe(0xff0000);
        expect(clone.alpha).toBe(0.3);
        expect(clone.blurX).toBe(10);
        expect(clone.blurY).toBe(20);
        expect(clone.strength).toBe(2);
        expect(clone.quality).toBe(BitmapFilterQuality.HIGH);
        expect(clone.inner).toBe(true);
        expect(clone.knockout).toBe(true);
        expect(clone.hideObject).toBe(true);

        // edit param
        clone.distance   = 3;
        clone.angle      = 20;
        clone.color      = 0xffffff;
        clone.alpha      = 1;
        clone.blurX      = 40;
        clone.blurY      = 30;
        clone.strength   = 4;
        clone.quality    = BitmapFilterQuality.MEDIUM;
        clone.inner      = false;
        clone.knockout   = false;
        clone.hideObject = false;

        // origin
        expect(filter.distance).toBe(1);
        expect(filter.angle).toBe(90);
        expect(filter.color).toBe(0xff0000);
        expect(filter.alpha).toBe(0.3);
        expect(filter.blurX).toBe(10);
        expect(filter.blurY).toBe(20);
        expect(filter.strength).toBe(2);
        expect(filter.quality).toBe(BitmapFilterQuality.HIGH);
        expect(filter.inner).toBe(true);
        expect(filter.knockout).toBe(true);
        expect(filter.hideObject).toBe(true);

        // clone
        expect(clone.distance).toBe(3);
        expect(clone.angle).toBe(20);
        expect(clone.color).toBe(0xffffff);
        expect(clone.alpha).toBe(1);
        expect(clone.blurX).toBe(40);
        expect(clone.blurY).toBe(30);
        expect(clone.strength).toBe(4);
        expect(clone.quality).toBe(BitmapFilterQuality.MEDIUM);
        expect(clone.inner).toBe(false);
        expect(clone.knockout).toBe(false);
        expect(clone.hideObject).toBe(false);

    });

});

describe("DropShadowFilter.js hideObject test", function()
{

    it("default test case1", function()
    {
        let dsf = new DropShadowFilter();
        expect(dsf.hideObject).toBe(false);
    });

    it("default test case2", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = null;
        expect(dsf.hideObject).toBe(false);
    });

    it("default test case3", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = undefined;
        expect(dsf.hideObject).toBe(false);
    });

    it("default test case4", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = true;
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case5", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = "";
        expect(dsf.hideObject).toBe(false);
    });

    it("default test case6", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = "abc";
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case7", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = 0;
        expect(dsf.hideObject).toBe(false);
    });

    it("default test case8", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = 1;
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case9", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = 500;
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case10", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = 50000000000000000;
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case11", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = -1;
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case12", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = -500;
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case13", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = -50000000000000000;
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case14", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = { "a":0 };
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case15", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = function a() {};
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case16", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = [1];
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case17", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = [1,2];
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case18", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = {};
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case19", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = { "toString":function () { return 1 } };
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case20", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = { "toString":function () { return "1" } };
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case21", function()
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = { "toString":function () { return "1a" } };
        expect(dsf.hideObject).toBe(true);
    });

});

describe("DropShadowFilter.js inner test", function()
{

    it("default test case1", function()
    {
        let dsf = new DropShadowFilter();
        expect(dsf.inner).toBe(false);
    });

    it("default test case2", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = null;
        expect(dsf.inner).toBe(false);
    });

    it("default test case3", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = undefined;
        expect(dsf.inner).toBe(false);
    });

    it("default test case4", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = true;
        expect(dsf.inner).toBe(true);
    });

    it("default test case5", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = "";
        expect(dsf.inner).toBe(false);
    });

    it("default test case6", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = "abc";
        expect(dsf.inner).toBe(true);
    });

    it("default test case7", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = 0;
        expect(dsf.inner).toBe(false);
    });

    it("default test case8", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = 1;
        expect(dsf.inner).toBe(true);
    });

    it("default test case9", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = 500;
        expect(dsf.inner).toBe(true);
    });

    it("default test case10", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = 50000000000000000;
        expect(dsf.inner).toBe(true);
    });

    it("default test case11", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = -1;
        expect(dsf.inner).toBe(true);
    });

    it("default test case12", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = -500;
        expect(dsf.inner).toBe(true);
    });

    it("default test case13", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = -50000000000000000;
        expect(dsf.inner).toBe(true);
    });

    it("default test case14", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = { "a":0 };
        expect(dsf.inner).toBe(true);
    });

    it("default test case15", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = function a() {};
        expect(dsf.inner).toBe(true);
    });

    it("default test case16", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = [1];
        expect(dsf.inner).toBe(true);
    });

    it("default test case17", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = [1,2];
        expect(dsf.inner).toBe(true);
    });

    it("default test case18", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = {};
        expect(dsf.inner).toBe(true);
    });

    it("default test case19", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = { "toString":function () { return 1 } };
        expect(dsf.inner).toBe(true);
    });

    it("default test case20", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = { "toString":function () { return "1" } };
        expect(dsf.inner).toBe(true);
    });

    it("default test case21", function()
    {
        let dsf = new DropShadowFilter();
        dsf.inner = { "toString":function () { return "1a" } };
        expect(dsf.inner).toBe(true);
    });

});

describe("DropShadowFilter.js knockout test", function()
{

    it("default test case1", function()
    {
        let dsf = new DropShadowFilter();
        expect(dsf.knockout).toBe(false);
    });

    it("default test case2", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = null;
        expect(dsf.knockout).toBe(false);
    });

    it("default test case3", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = undefined;
        expect(dsf.knockout).toBe(false);
    });

    it("default test case4", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = true;
        expect(dsf.knockout).toBe(true);
    });

    it("default test case5", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = "";
        expect(dsf.knockout).toBe(false);
    });

    it("default test case6", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = "abc";
        expect(dsf.knockout).toBe(true);
    });

    it("default test case7", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = 0;
        expect(dsf.knockout).toBe(false);
    });

    it("default test case8", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = 1;
        expect(dsf.knockout).toBe(true);
    });

    it("default test case9", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = 500;
        expect(dsf.knockout).toBe(true);
    });

    it("default test case10", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = 50000000000000000;
        expect(dsf.knockout).toBe(true);
    });

    it("default test case11", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = -1;
        expect(dsf.knockout).toBe(true);
    });

    it("default test case12", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = -500;
        expect(dsf.knockout).toBe(true);
    });

    it("default test case13", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = -50000000000000000;
        expect(dsf.knockout).toBe(true);
    });

    it("default test case14", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = { "a":0 };
        expect(dsf.knockout).toBe(true);
    });

    it("default test case15", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = function a() {};
        expect(dsf.knockout).toBe(true);
    });

    it("default test case16", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = [1];
        expect(dsf.knockout).toBe(true);
    });

    it("default test case17", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = [1,2];
        expect(dsf.knockout).toBe(true);
    });

    it("default test case18", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = {};
        expect(dsf.knockout).toBe(true);
    });

    it("default test case19", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = { "toString":function () { return 1 } };
        expect(dsf.knockout).toBe(true);
    });

    it("default test case20", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = { "toString":function () { return "1" } };
        expect(dsf.knockout).toBe(true);
    });

    it("default test case21", function()
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = { "toString":function () { return "1a" } };
        expect(dsf.knockout).toBe(true);
    });

});

describe("DropShadowFilter.js alpha test", function()
{

    it("default test case1", function()
    {
        let dsf = new DropShadowFilter();
        expect(dsf.alpha).toBe(1);
    });

    it("default test case2", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = null;
        expect(dsf.alpha).toBe(0);
    });

    it("default test case3", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = undefined;
        expect(dsf.alpha).toBe(0);
    });

    it("default test case4", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = true;
        expect(dsf.alpha).toBe(1);
    });

    it("default test case5", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = "";
        expect(dsf.alpha).toBe(0);
    });

    it("default test case6", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = "abc";
        expect(dsf.alpha).toBe(0);
    });

    it("default test case7", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = 0;
        expect(dsf.alpha).toBe(0);
    });

    it("default test case8", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = 1;
        expect(dsf.alpha).toBe(1);
    });

    it("default test case9", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = 500;
        expect(dsf.alpha).toBe(1);
    });

    it("default test case10", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = 50000000000000000;
        expect(dsf.alpha).toBe(1);
    });

    it("default test case11", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = -1;
        expect(dsf.alpha).toBe(0);
    });

    it("default test case12", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = -500;
        expect(dsf.alpha).toBe(0);
    });

    it("default test case13", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = -50000000000000000;
        expect(dsf.alpha).toBe(0);
    });

    it("default test case14", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = { "a":0 };
        expect(dsf.alpha).toBe(0);
    });

    it("default test case15", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = function a() {};
        expect(dsf.alpha).toBe(0);
    });

    it("default test case16", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = [1];
        expect(dsf.alpha).toBe(1);
    });

    it("default test case17", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = [1,2];
        expect(dsf.alpha).toBe(0);
    });

    it("default test case18", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = {};
        expect(dsf.alpha).toBe(0);
    });

    it("default test case19", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = { "toString":function () { return 1 } };
        expect(dsf.alpha).toBe(1);
    });

    it("default test case20", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = { "toString":function () { return "1" } };
        expect(dsf.alpha).toBe(1);
    });

    it("default test case21", function()
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = { "toString":function () { return "1a" } };
        expect(dsf.alpha).toBe(0);
    });

});

describe("DropShadowFilter.js angle test", function()
{

    it("default test case1", function()
    {
        let dsf = new DropShadowFilter();
        expect(dsf.angle).toBe(45);
    });

    it("default test case2", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = null;
        expect(dsf.angle).toBe(0);
    });

    it("default test case3", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = undefined;
        expect(dsf.angle).toBe(45);
    });

    it("default test case4", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = true;
        expect(dsf.angle).toBe(1);
    });

    it("default test case5", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = "";
        expect(dsf.angle).toBe(0);
    });

    it("default test case6", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = "abc";
        expect(dsf.angle).toBe(45);
    });

    it("default test case7", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = 0;
        expect(dsf.angle).toBe(0);
    });

    it("default test case8", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = 1;
        expect(dsf.angle).toBe(1);
    });

    it("default test case9", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = 500;
        expect(dsf.angle).toBe(140);
    });

    it("default test case10", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = 50000000000000000;
        expect(dsf.angle).toBe(320);
    });

    it("default test case11", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = -1;
        expect(dsf.angle).toBe(-1);
    });

    it("default test case12", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = -500;
        expect(dsf.angle).toBe(-140);
    });

    it("default test case13", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = -50000000000000000;
        expect(dsf.angle).toBe(-320);
    });

    it("default test case14", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = { "a":0 };
        expect(dsf.angle).toBe(45);
    });

    it("default test case15", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = function a() {};
        expect(dsf.angle).toBe(45);
    });

    it("default test case16", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = [1];
        expect(dsf.angle).toBe(1);
    });

    it("default test case17", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = [1,2];
        expect(dsf.angle).toBe(45);
    });

    it("default test case18", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = {};
        expect(dsf.angle).toBe(45);
    });

    it("default test case19", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = { "toString":function () { return 1 } };
        expect(dsf.angle).toBe(1);
    });

    it("default test case20", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = { "toString":function () { return "1" } };
        expect(dsf.angle).toBe(1);
    });

    it("default test case21", function()
    {
        let dsf = new DropShadowFilter();
        dsf.angle = { "toString":function () { return "1a" } };
        expect(dsf.angle).toBe(45);
    });

});

describe("DropShadowFilter.js blurX test", function()
{

    it("default test case1", function()
    {
        let dsf = new DropShadowFilter();
        expect(dsf.blurX).toBe(4);
    });

    it("default test case2", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = null;
        expect(dsf.blurX).toBe(0);
    });

    it("default test case3", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = undefined;
        expect(dsf.blurX).toBe(0);
    });

    it("default test case4", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = true;
        expect(dsf.blurX).toBe(1);
    });

    it("default test case5", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = "";
        expect(dsf.blurX).toBe(0);
    });

    it("default test case6", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = "abc";
        expect(dsf.blurX).toBe(0);
    });

    it("default test case7", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = 0;
        expect(dsf.blurX).toBe(0);
    });

    it("default test case8", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = 1;
        expect(dsf.blurX).toBe(1);
    });

    it("default test case9", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = 500;
        expect(dsf.blurX).toBe(255);
    });

    it("default test case10", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = 50000000000000000;
        expect(dsf.blurX).toBe(255);
    });

    it("default test case11", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = -1;
        expect(dsf.blurX).toBe(0);
    });

    it("default test case12", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = -500;
        expect(dsf.blurX).toBe(0);
    });

    it("default test case13", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = -50000000000000000;
        expect(dsf.blurX).toBe(0);
    });

    it("default test case14", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = { "a":0 };
        expect(dsf.blurX).toBe(0);
    });

    it("default test case15", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = function a() {};
        expect(dsf.blurX).toBe(0);
    });

    it("default test case16", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = [1];
        expect(dsf.blurX).toBe(1);
    });

    it("default test case17", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = [1,2];
        expect(dsf.blurX).toBe(0);
    });

    it("default test case18", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = {};
        expect(dsf.blurX).toBe(0);
    });

    it("default test case19", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = { "toString":function () { return 1 } };
        expect(dsf.blurX).toBe(1);
    });

    it("default test case20", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = { "toString":function () { return "1" } };
        expect(dsf.blurX).toBe(1);
    });

    it("default test case21", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurX = { "toString":function () { return "1a" } };
        expect(dsf.blurX).toBe(0);
    });

});

describe("DropShadowFilter.js blurY test", function()
{

    it("default test case1", function()
    {
        let dsf = new DropShadowFilter();
        expect(dsf.blurY).toBe(4);
    });

    it("default test case2", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = null;
        expect(dsf.blurY).toBe(0);
    });

    it("default test case3", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = undefined;
        expect(dsf.blurY).toBe(0);
    });

    it("default test case4", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = true;
        expect(dsf.blurY).toBe(1);
    });

    it("default test case5", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = "";
        expect(dsf.blurY).toBe(0);
    });

    it("default test case6", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = "abc";
        expect(dsf.blurY).toBe(0);
    });

    it("default test case7", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = 0;
        expect(dsf.blurY).toBe(0);
    });

    it("default test case8", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = 1;
        expect(dsf.blurY).toBe(1);
    });

    it("default test case9", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = 500;
        expect(dsf.blurY).toBe(255);
    });

    it("default test case10", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = 50000000000000000;
        expect(dsf.blurY).toBe(255);
    });

    it("default test case11", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = -1;
        expect(dsf.blurY).toBe(0);
    });

    it("default test case12", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = -500;
        expect(dsf.blurY).toBe(0);
    });

    it("default test case13", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = -50000000000000000;
        expect(dsf.blurY).toBe(0);
    });

    it("default test case14", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = { "a":0 };
        expect(dsf.blurY).toBe(0);
    });

    it("default test case15", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = function a() {};
        expect(dsf.blurY).toBe(0);
    });

    it("default test case16", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = [1];
        expect(dsf.blurY).toBe(1);
    });

    it("default test case17", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = [1,2];
        expect(dsf.blurY).toBe(0);
    });

    it("default test case18", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = {};
        expect(dsf.blurY).toBe(0);
    });

    it("default test case19", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = { "toString":function () { return 1 } };
        expect(dsf.blurY).toBe(1);
    });

    it("default test case20", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = { "toString":function () { return "1" } };
        expect(dsf.blurY).toBe(1);
    });

    it("default test case21", function()
    {
        let dsf = new DropShadowFilter();
        dsf.blurY = { "toString":function () { return "1a" } };
        expect(dsf.blurY).toBe(0);
    });

});

describe("DropShadowFilter.js color test", function()
{

    it("default test case1", function()
    {
        let dsf = new DropShadowFilter();
        expect(dsf.color).toBe(0);
    });

    it("default test case2", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = null;
        expect(dsf.color).toBe(0);
    });

    it("default test case3", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = undefined;
        expect(dsf.color).toBe(0);
    });

    it("default test case4", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = true;
        expect(dsf.color).toBe(1);
    });

    it("default test case5", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = "";
        expect(dsf.color).toBe(0);
    });

    it("default test case6", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = "abc";
        expect(dsf.color).toBe(0);
    });

    it("default test case7", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = 0;
        expect(dsf.color).toBe(0);
    });

    it("default test case8", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = 1;
        expect(dsf.color).toBe(1);
    });

    it("default test case9", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = 500;
        expect(dsf.color).toBe(500);
    });

    it("default test case10", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = 50000000000000000;
        expect(dsf.color).toBe(0xffffff);
    });

    it("default test case11", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = -1;
        expect(dsf.color).toBe(0);
    });

    it("default test case12", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = -500;
        expect(dsf.color).toBe(0);
    });

    it("default test case13", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = -50000000000000000;
        expect(dsf.color).toBe(0);
    });

    it("default test case14", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = { "a":0 };
        expect(dsf.color).toBe(0);
    });

    it("default test case15", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = function a() {};
        expect(dsf.color).toBe(0);
    });

    it("default test case16", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = [1];
        expect(dsf.color).toBe(1);
    });

    it("default test case17", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = [1,2];
        expect(dsf.color).toBe(0);
    });

    it("default test case18", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = {};
        expect(dsf.color).toBe(0);
    });

    it("default test case19", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = { "toString":function () { return 1 } };
        expect(dsf.color).toBe(1);
    });

    it("default test case20", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = { "toString":function () { return "1" } };
        expect(dsf.color).toBe(1);
    });

    it("default test case21", function()
    {
        let dsf = new DropShadowFilter();
        dsf.color = { "toString":function () { return "1a" } };
        expect(dsf.color).toBe(0);
    });

});

describe("DropShadowFilter.js distance test", function()
{

    it("default test case1", function()
    {
        let dsf = new DropShadowFilter();
        expect(dsf.distance).toBe(4);
    });

    it("default test case2", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = null;
        expect(dsf.distance).toBe(0);
    });

    it("default test case3", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = undefined;
        expect(dsf.distance).toBe(4);
    });

    it("default test case4", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = true;
        expect(dsf.distance).toBe(1);
    });

    it("default test case5", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = "";
        expect(dsf.distance).toBe(0);
    });

    it("default test case6", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = "abc";
        expect(dsf.distance).toBe(4);
    });

    it("default test case7", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = 0;
        expect(dsf.distance).toBe(0);
    });

    it("default test case8", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = 1;
        expect(dsf.distance).toBe(1);
    });

    it("default test case9", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = 500;
        expect(dsf.distance).toBe(255);
    });

    it("default test case10", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = 50000000000000000;
        expect(dsf.distance).toBe(255);
    });

    it("default test case11", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = -1;
        expect(dsf.distance).toBe(-1);
    });

    it("default test case12", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = -500;
        expect(dsf.distance).toBe(-255);
    });

    it("default test case13", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = -50000000000000000;
        expect(dsf.distance).toBe(-255);
    });

    it("default test case14", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = { "a":0 };
        expect(dsf.distance).toBe(4);
    });

    it("default test case15", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = function a() {};
        expect(dsf.distance).toBe(4);
    });

    it("default test case16", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = [1];
        expect(dsf.distance).toBe(1);
    });

    it("default test case17", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = [1,2];
        expect(dsf.distance).toBe(4);
    });

    it("default test case18", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = {};
        expect(dsf.distance).toBe(4);
    });

    it("default test case19", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = { "toString":function () { return 1 } };
        expect(dsf.distance).toBe(1);
    });

    it("default test case20", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = { "toString":function () { return "1" } };
        expect(dsf.distance).toBe(1);
    });

    it("default test case21", function()
    {
        let dsf = new DropShadowFilter();
        dsf.distance = { "toString":function () { return "1a" } };
        expect(dsf.distance).toBe(4);
    });

});

describe("DropShadowFilter.js quality test", function()
{

    it("default test case1", function()
    {
        let dsf = new DropShadowFilter();
        expect(dsf.quality).toBe(1);
    });

    it("default test case2", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = null;
        expect(dsf.quality).toBe(0);
    });

    it("default test case3", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = undefined;
        expect(dsf.quality).toBe(0);
    });

    it("default test case4", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = true;
        expect(dsf.quality).toBe(1);
    });

    it("default test case5", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = "";
        expect(dsf.quality).toBe(0);
    });

    it("default test case6", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = "abc";
        expect(dsf.quality).toBe(0);
    });

    it("default test case7", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = 0;
        expect(dsf.quality).toBe(0);
    });

    it("default test case8", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = 1;
        expect(dsf.quality).toBe(1);
    });

    it("default test case9", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = 500;
        expect(dsf.quality).toBe(15);
    });

    it("default test case10", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = 50000000000000000;
        expect(dsf.quality).toBe(15);
    });

    it("default test case11", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = -1;
        expect(dsf.quality).toBe(0);
    });

    it("default test case12", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = -500;
        expect(dsf.quality).toBe(0);
    });

    it("default test case13", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = -50000000000000000;
        expect(dsf.quality).toBe(0);
    });

    it("default test case14", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = { "a":0 };
        expect(dsf.quality).toBe(0);
    });

    it("default test case15", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = function a() {};
        expect(dsf.quality).toBe(0);
    });

    it("default test case16", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = [1];
        expect(dsf.quality).toBe(1);
    });

    it("default test case17", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = [1,2];
        expect(dsf.quality).toBe(0);
    });

    it("default test case18", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = {};
        expect(dsf.quality).toBe(0);
    });

    it("default test case19", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = { "toString":function () { return 1 } };
        expect(dsf.quality).toBe(1);
    });

    it("default test case20", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = { "toString":function () { return "1" } };
        expect(dsf.quality).toBe(1);
    });

    it("default test case21", function()
    {
        let dsf = new DropShadowFilter();
        dsf.quality = { "toString":function () { return "1a" } };
        expect(dsf.quality).toBe(0);
    });

});

describe("DropShadowFilter.js strength test", function()
{

    it("default test case1", function()
    {
        let dsf = new DropShadowFilter();
        expect(dsf.strength).toBe(1);
    });

    it("default test case2", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = null;
        expect(dsf.strength).toBe(0);
    });

    it("default test case3", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = undefined;
        expect(dsf.strength).toBe(0);
    });

    it("default test case4", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = true;
        expect(dsf.strength).toBe(1);
    });

    it("default test case5", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = "";
        expect(dsf.strength).toBe(0);
    });

    it("default test case6", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = "abc";
        expect(dsf.strength).toBe(0);
    });

    it("default test case7", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = 0;
        expect(dsf.strength).toBe(0);
    });

    it("default test case8", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = 1;
        expect(dsf.strength).toBe(1);
    });

    it("default test case9", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = 500;
        expect(dsf.strength).toBe(255);
    });

    it("default test case10", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = 50000000000000000;
        expect(dsf.strength).toBe(255);
    });

    it("default test case11", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = -1;
        expect(dsf.strength).toBe(0);
    });

    it("default test case12", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = -500;
        expect(dsf.strength).toBe(0);
    });

    it("default test case13", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = -50000000000000000;
        expect(dsf.strength).toBe(0);
    });

    it("default test case14", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = { "a":0 };
        expect(dsf.strength).toBe(0);
    });

    it("default test case15", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = function a() {};
        expect(dsf.strength).toBe(0);
    });

    it("default test case16", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = [1];
        expect(dsf.strength).toBe(1);
    });

    it("default test case17", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = [1,2];
        expect(dsf.strength).toBe(0);
    });

    it("default test case18", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = {};
        expect(dsf.strength).toBe(0);
    });

    it("default test case19", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = { "toString":function () { return 1 } };
        expect(dsf.strength).toBe(1);
    });

    it("default test case20", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = { "toString":function () { return "1" } };
        expect(dsf.strength).toBe(1);
    });

    it("default test case21", function()
    {
        let dsf = new DropShadowFilter();
        dsf.strength = { "toString":function () { return "1a" } };
        expect(dsf.strength).toBe(0);
    });

});