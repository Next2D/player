
describe("GradientGlowFilter.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new GradientGlowFilter();
        expect(object.namespace).toBe("next2d.filters.GradientGlowFilter");
    });

    it("namespace test static", function()
    {
        expect(GradientGlowFilter.namespace).toBe("next2d.filters.GradientGlowFilter");
    });

});

describe("GradientGlowFilter.js toString test", function()
{
    it("toString test success", function()
    {
        let filter = new GradientGlowFilter();
        expect(filter.toString()).toBe("[object GradientGlowFilter]");
    });

});

describe("GradientGlowFilter.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(GradientGlowFilter.toString()).toBe("[class GradientGlowFilter]");
    });

});

describe("GradientGlowFilter.js property test", function()
{

    // default
    it("default test success", function()
    {
        let filter = new GradientGlowFilter();
        expect(filter.distance).toBe(4);
        expect(filter.angle).toBe(45);
        expect(filter.colors).toBe(null);
        expect(filter.alphas).toBe(null);
        expect(filter.ratios).toBe(null);
        expect(filter.blurX).toBe(4);
        expect(filter.blurY).toBe(4);
        expect(filter.strength).toBe(1);
        expect(filter.quality).toBe(BitmapFilterQuality.LOW);
        expect(filter.type).toBe(BitmapFilterType.INNER);
        expect(filter.knockout).toBe(false);
    });

    // distance
    it("distance test success case1", function()
    {
        let filter = new GradientGlowFilter(0);
        expect(filter.distance).toBe(0);
    });

    it("distance test success case2", function()
    {
        let filter = new GradientGlowFilter(10.5);
        filter.distance = -12.6;
        expect(filter.distance).toBe(-12.6);
    });

    it("distance test valid case1", function()
    {
        let filter = new GradientGlowFilter("23");
        expect(filter.distance).toBe(23);
    });

    it("distance test valid case2", function()
    {
        let filter = new GradientGlowFilter(1000);
        expect(filter.distance).toBe(255);
    });

    it("distance test valid case3", function()
    {
        let filter = new GradientGlowFilter(-1000);
        expect(filter.distance).toBe(-255);
    });

    it("distance test valid case4", function()
    {
        let filter = new GradientGlowFilter(10);
        filter.distance = "-56";
        expect(filter.distance).toBe(-56);
    });

    it("distance test valid case5", function()
    {
        let filter = new GradientGlowFilter(10);
        filter.distance = 400;
        expect(filter.distance).toBe(255);
    });

    it("distance test valid case6", function()
    {
        let filter = new GradientGlowFilter(10);
        filter.distance = -400;
        expect(filter.distance).toBe(-255);
    });

    it("distance test valid case7", function()
    {
        let filter = new GradientGlowFilter("test");
        expect(filter.distance).toBe(4);
    });

    it("distance test valid case8", function()
    {
        let filter = new GradientGlowFilter(10);
        filter.distance = "abc";
        expect(filter.distance).toBe(4);
    });

    // angle
    it("angle test success case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0);
        expect(filter.angle).toBe(0);
    });

    it("angle test success case2", function()
    {
        let filter = new GradientGlowFilter(10.5, 90);
        filter.angle = 180;
        expect(filter.angle).toBe(180);
    });

    it("angle test valid case1", function()
    {
        let filter = new GradientGlowFilter(10.5, "20");
        expect(filter.angle).toBe(20);
    });

    it("angle test valid case2", function()
    {
        let filter = new GradientGlowFilter(10.5, 20);
        filter.angle = "180";
        expect(filter.angle).toBe(180);
    });

    it("angle test valid case3", function()
    {
        let filter = new GradientGlowFilter(10.5, 20);
        filter.angle = 4500;
        expect(filter.angle).toBe(180);
    });

    it("angle test valid case4", function()
    {
        let filter = new GradientGlowFilter(10.5, 20);
        filter.angle = -4500;
        expect(filter.angle).toBe(-180);
    });

    it("angle test valid case5", function()
    {
        let filter = new GradientGlowFilter(10.5, "test");
        expect(filter.angle).toBe(45);
    });

    it("angle test valid case6", function()
    {
        let filter = new GradientGlowFilter(10.5, 20);
        filter.angle = "abc";
        expect(filter.angle).toBe(45);
    });

    // colors
    it("colors test success case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255]);
        expect(filter.colors[0]).toBe(0xffffff);
        expect(filter.colors[1]).toBe(0xff00ff);
    });

    it("colors test valid case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [16777216, -1], [1, 1], [0, 255]);
        expect(filter.colors[0]).toBe(0);
        expect(filter.colors[1]).toBe(16777215);
    });

    it("colors test valid case2", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, ["10","test"], [1, 1], [0, 255]);
        expect(filter.colors[0]).toBe(10);
        expect(filter.colors[1]).toBe(0x000000);
    });

    // alphas
    it("alphas test success case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 0.5], [0, 255]);
        expect(filter.alphas[0]).toBe(1);
        expect(filter.alphas[1]).toBe(0.5);
    });

    it("alphas test valid case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [2, -1], [0, 255]);
        expect(filter.alphas[0]).toBe(1);
        expect(filter.alphas[1]).toBe(0);
    });

    it("alphas test valid case2", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], ["0.5", "test"], [0, 255]);
        expect(filter.alphas[0]).toBe(0.5);
        expect(filter.alphas[1]).toBe(0);
    });

    // ratios
    it("ratios test success case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255]);
        expect(filter.ratios[0]).toBe(0);
        expect(filter.ratios[1]).toBe(255);
    });

    it("ratios test valid case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [-1, 256]);
        expect(filter.ratios[0]).toBe(0);
        expect(filter.ratios[1]).toBe(255);
    });

    it("ratios test valid case2", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], ["100", "test"]);
        expect(filter.ratios[0]).toBe(100);
        expect(filter.ratios[1]).toBe(0);
    });

    // blurX
    it("blurX test success case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 0);
        expect(filter.blurX).toBe(0);
    });

    it("blurX test success case2", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 100);
        filter.blurX = 50;
        expect(filter.blurX).toBe(50);
    });

    it("blurX test valid case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 1000);
        expect(filter.blurX).toBe(255);
    });

    it("blurX test valid case2", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10);
        filter.blurX = 1000;
        expect(filter.blurX).toBe(255);
    });

    it("blurX test valid case3", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], -10);
        expect(filter.blurX).toBe(0);
    });

    it("blurX test valid case4", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10);
        filter.blurX = -1;
        expect(filter.blurX).toBe(0);
    });

    it("blurX test valid case5", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], "100");
        expect(filter.blurX).toBe(100);
    });

    it("blurX test valid case6", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10);
        filter.blurX = "123";
        expect(filter.blurX).toBe(123);
    });

    it("blurX test valid case7", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], "test");
        expect(filter.blurX).toBe(0);
    });

    it("blurX test valid case8", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10);
        filter.blurX = "123a";
        expect(filter.blurX).toBe(0);
    });

    // blurY
    it("blurY test success case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 0);
        expect(filter.blurY).toBe(0);
    });

    it("blurY test success case2", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 100);
        filter.blurY = 50;
        expect(filter.blurY).toBe(50);
    });

    it("blurY test valid case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 1000);
        expect(filter.blurY).toBe(255);
    });

    it("blurY test valid case2", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10);
        filter.blurY = 1000;
        expect(filter.blurY).toBe(255);
    });

    it("blurY test valid case3", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, -10);
        expect(filter.blurY).toBe(0);
    });

    it("blurY test valid case4", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10);
        filter.blurY = -1;
        expect(filter.blurY).toBe(0);
    });

    it("blurY test valid case5", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, "100");
        expect(filter.blurY).toBe(100);
    });

    it("blurY test valid case6", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10);
        filter.blurY = "123";
        expect(filter.blurY).toBe(123);
    });

    it("blurY test valid case7", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, "test");
        expect(filter.blurY).toBe(0);
    });

    it("blurY test valid case8", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10);
        filter.blurY = "123a";
        expect(filter.blurY).toBe(0);
    });

    // strength
    it("strength test success case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 0);
        expect(filter.strength).toBe(0);
    });

    it("strength test success case2", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 10);
        filter.strength = 2;
        expect(filter.strength).toBe(2);
    });

    it("strength test valid case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, "9");
        expect(filter.strength).toBe(9);
    });

    it("strength test valid case2", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 2);
        filter.strength = "9";
        expect(filter.strength).toBe(9);
    });

    it("strength test valid case3", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, -1);
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case4", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 2);
        filter.strength = -10;
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case5", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 1000);
        expect(filter.strength).toBe(255);
    });

    it("strength test valid case6", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 2);
        filter.strength = 1000;
        expect(filter.strength).toBe(255);
    });

    it("strength test valid case7", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, "test");
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case8", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3);
        filter.strength = "abc";
        expect(filter.strength).toBe(0);
    });

    // quality
    it("quality test success case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 0);
        expect(filter.quality).toBe(0);
    });

    it("quality test success case2", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 5);
        filter.quality = 2;
        expect(filter.quality).toBe(2);
    });

    it("quality test valid case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 1000);
        expect(filter.quality).toBe(15);
    });

    it("quality test valid case2", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 2);
        filter.quality = 1000;
        expect(filter.quality).toBe(15);
    });

    it("quality test valid case3", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, -1);
        expect(filter.quality).toBe(0);
    });

    it("quality test valid case4", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 5);
        filter.quality = -1;
        expect(filter.quality).toBe(0);
    });

    it("quality test valid case5", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, "12");
        expect(filter.quality).toBe(12);
    });

    it("quality test valid case6", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10);
        filter.quality = "12";
        expect(filter.quality).toBe(12);
    });

    it("quality test valid case7", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, "test");
        expect(filter.quality).toBe(0);
    });

    it("quality test valid case8", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10);
        filter.quality = "123a";
        expect(filter.quality).toBe(0);
    });

    // type
    it("type test success case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.INNER);
        expect(filter.type).toBe(BitmapFilterType.INNER);
    });

    it("type test success case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.OUTER);
        expect(filter.type).toBe(BitmapFilterType.OUTER);
    });

    it("type test success case3", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL);
        expect(filter.type).toBe(BitmapFilterType.FULL);
    });

    it("type test success case4", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.INNER);
        filter.type = BitmapFilterType.OUTER;
        expect(filter.type).toBe(BitmapFilterType.OUTER);
    });

    it("type test valid case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, "FULL");
        expect(filter.type).toBe(BitmapFilterType.INNER);
    });

    it("type test valid case2", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, "FULL");
        filter.type = "abc";
        expect(filter.type).toBe(BitmapFilterType.INNER);
    });

    // knockout
    it("knockout test success case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, true);
        expect(filter.knockout).toBe(true);
    });

    it("knockout test success case2", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, true);
        filter.knockout = false;
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case1", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, 1);
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case2", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, false);
        filter.knockout = 1;
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case3", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, 0);
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case4", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, true);
        filter.knockout = 0;
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case5", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, "test");
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case6", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, true);
        filter.knockout = "";
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case7", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, {});
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case8", function()
    {
        let filter = new GradientGlowFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, []);
        expect(filter.knockout).toBe(true);
    });

});

describe("GradientGlowFilter.js clone test", function()
{

    it("clone test", function()
    {
        let filter = new GradientGlowFilter(
            10, 90, [0xffffff, 0xff00ff], [1, 0.2], [0, 255],
            10, 20, 3, BitmapFilterQuality.MEDIUM, BitmapFilterType.FULL, true
        );
        let clone  = filter.clone();

        // clone check
        expect(clone.distance).toBe(10);
        expect(clone.angle).toBe(90);
        expect(clone.colors[0]).toBe(0xffffff);
        expect(clone.colors[1]).toBe(0xff00ff);
        expect(clone.alphas[0]).toBe(1);
        expect(clone.alphas[1]).toBe(0.2);
        expect(clone.ratios[0]).toBe(0);
        expect(clone.ratios[1]).toBe(255);
        expect(clone.blurX).toBe(10);
        expect(clone.blurY).toBe(20);
        expect(clone.strength).toBe(3);
        expect(clone.quality).toBe(BitmapFilterQuality.MEDIUM);
        expect(clone.type).toBe(BitmapFilterType.FULL);
        expect(clone.knockout).toBe(true);

        // edit param
        clone.distance = 20;
        clone.angle    = 30;
        clone.colors   = [0, 100];
        clone.alphas   = [0.3, 0.6];
        clone.ratios   = [100, 180];
        clone.blurX    = 5;
        clone.blurY    = 6;
        clone.strength = 2;
        clone.quality  = BitmapFilterQuality.LOW;
        clone.type     = BitmapFilterType.INNER;
        clone.knockout = false;

        // origin
        expect(filter.distance).toBe(10);
        expect(filter.angle).toBe(90);
        expect(filter.colors[0]).toBe(0xffffff);
        expect(filter.colors[1]).toBe(0xff00ff);
        expect(filter.alphas[0]).toBe(1);
        expect(filter.alphas[1]).toBe(0.2);
        expect(filter.ratios[0]).toBe(0);
        expect(filter.ratios[1]).toBe(255);
        expect(filter.blurX).toBe(10);
        expect(filter.blurY).toBe(20);
        expect(filter.strength).toBe(3);
        expect(filter.quality).toBe(BitmapFilterQuality.MEDIUM);
        expect(filter.type).toBe(BitmapFilterType.FULL);
        expect(filter.knockout).toBe(true);

        // clone check
        expect(clone.distance).toBe(20);
        expect(clone.angle).toBe(30);
        expect(clone.colors[0]).toBe(0);
        expect(clone.colors[1]).toBe(100);
        expect(clone.alphas[0]).toBe(0.3);
        expect(clone.alphas[1]).toBe(0.6);
        expect(clone.ratios[0]).toBe(100);
        expect(clone.ratios[1]).toBe(180);
        expect(clone.blurX).toBe(5);
        expect(clone.blurY).toBe(6);
        expect(clone.strength).toBe(2);
        expect(clone.quality).toBe(BitmapFilterQuality.LOW);
        expect(clone.type).toBe(BitmapFilterType.INNER);
        expect(clone.knockout).toBe(false);

    });

});

describe("GradientGlowFilter.js knockout test", function()
{

    it("default test case1", function()
    {
        let gg = new GradientGlowFilter();
        expect(gg.knockout).toBe(false);
    });

    it("default test case2", function()
    {
        let gg = new GradientGlowFilter();
        gg.knockout = null;
        expect(gg.knockout).toBe(false);
    });

    it("default test case3", function()
    {
        let gg = new GradientGlowFilter();
        gg.knockout = undefined;
        expect(gg.knockout).toBe(false);
    });

    it("default test case4", function()
    {
        let gg = new GradientGlowFilter();
        gg.knockout = true;
        expect(gg.knockout).toBe(true);
    });

    it("default test case5", function()
    {
        let gg = new GradientGlowFilter();
        gg.knockout = "";
        expect(gg.knockout).toBe(false);
    });

    it("default test case6", function()
    {
        let gg = new GradientGlowFilter();
        gg.knockout = "abc";
        expect(gg.knockout).toBe(true);
    });

    it("default test case7", function()
    {
        let gg = new GradientGlowFilter();
        gg.knockout = 0;
        expect(gg.knockout).toBe(false);
    });

    it("default test case8", function()
    {
        let gg = new GradientGlowFilter();
        gg.knockout = 1;
        expect(gg.knockout).toBe(true);
    });

    it("default test case9", function()
    {
        let gg = new GradientGlowFilter();
        gg.knockout = 500;
        expect(gg.knockout).toBe(true);
    });

    it("default test case10", function()
    {
        let gg = new GradientGlowFilter();
        gg.knockout = -1;
        expect(gg.knockout).toBe(true);
    });

    it("default test case11", function()
    {
        let gg = new GradientGlowFilter();
        gg.knockout = -500;
        expect(gg.knockout).toBe(true);
    });

    it("default test case12", function()
    {
        let gg = new GradientGlowFilter();
        gg.knockout = { "a":0 };
        expect(gg.knockout).toBe(true);
    });

    it("default test case13", function()
    {
        let gg = new GradientGlowFilter();
        gg.knockout = function a() {};
        expect(gg.knockout).toBe(true);
    });

    it("default test case14", function()
    {
        let gg = new GradientGlowFilter();
        gg.knockout = [1];
        expect(gg.knockout).toBe(true);
    });

    it("default test case15", function()
    {
        let gg = new GradientGlowFilter();
        gg.knockout = [1,2];
        expect(gg.knockout).toBe(true);
    });

    it("default test case16", function()
    {
        let gg = new GradientGlowFilter();
        gg.knockout = {};
        expect(gg.knockout).toBe(true);
    });

    it("default test case17", function()
    {
        let gg = new GradientGlowFilter();
        gg.knockout = { "toString":function () { return 1 } };
        expect(gg.knockout).toBe(true);
    });

    it("default test case18", function()
    {
        let gg = new GradientGlowFilter();
        gg.knockout = { "toString":function () { return "1" } };
        expect(gg.knockout).toBe(true);
    });

    it("default test case19", function()
    {
        let gg = new GradientGlowFilter();
        gg.knockout = { "toString":function () { return "1a" } };
        expect(gg.knockout).toBe(true);
    });

});

describe("GradientGlowFilter.js angle test", function()
{

    it("default test case1", function()
    {
        let ggf = new GradientGlowFilter();
        expect(ggf.angle).toBe(45);
    });

    it("default test case2", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = null;
        expect(ggf.angle).toBe(0);
    });

    it("default test case3", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = undefined;
        expect(ggf.angle).toBe(45);
    });

    it("default test case4", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = true;
        expect(ggf.angle).toBe(1);
    });

    it("default test case5", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = "";
        expect(ggf.angle).toBe(0);
    });

    it("default test case6", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = "abc";
        expect(ggf.angle).toBe(45);
    });

    it("default test case7", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = 0;
        expect(ggf.angle).toBe(0);
    });

    it("default test case8", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = 1;
        expect(ggf.angle).toBe(1);
    });

    it("default test case9", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = 500;
        expect(ggf.angle).toBe(140);
    });

    it("default test case10", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = 50000000000000000;
        expect(ggf.angle).toBe(320);
    });

    it("default test case11", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = -1;
        expect(ggf.angle).toBe(-1);
    });

    it("default test case12", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = -500;
        expect(ggf.angle).toBe(-140);
    });

    it("default test case13", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = -50000000000000000;
        expect(ggf.angle).toBe(-320);
    });

    it("default test case14", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = { "a":0 };
        expect(ggf.angle).toBe(45);
    });

    it("default test case15", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = function a() {};
        expect(ggf.angle).toBe(45);
    });

    it("default test case16", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = [1];
        expect(ggf.angle).toBe(1);
    });

    it("default test case17", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = [1,2];
        expect(ggf.angle).toBe(45);
    });

    it("default test case18", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = {};
        expect(ggf.angle).toBe(45);
    });

    it("default test case19", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = { "toString":function () { return 1 } };
        expect(ggf.angle).toBe(1);
    });

    it("default test case20", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = { "toString":function () { return "1" } };
        expect(ggf.angle).toBe(1);
    });

    it("default test case21", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.angle = { "toString":function () { return "1a" } };
        expect(ggf.angle).toBe(45);
    });

});

describe("GradientGlowFilter.js blurX test", function()
{

    it("default test case1", function()
    {
        let ggf = new GradientGlowFilter();
        expect(ggf.blurX).toBe(4);
    });

    it("default test case2", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = null;
        expect(ggf.blurX).toBe(0);
    });

    it("default test case3", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = undefined;
        expect(ggf.blurX).toBe(0);
    });

    it("default test case4", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = true;
        expect(ggf.blurX).toBe(1);
    });

    it("default test case5", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = "";
        expect(ggf.blurX).toBe(0);
    });

    it("default test case6", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = "abc";
        expect(ggf.blurX).toBe(0);
    });

    it("default test case7", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = 0;
        expect(ggf.blurX).toBe(0);
    });

    it("default test case8", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = 1;
        expect(ggf.blurX).toBe(1);
    });

    it("default test case9", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = 500;
        expect(ggf.blurX).toBe(255);
    });

    it("default test case10", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = 50000000000000000;
        expect(ggf.blurX).toBe(255);
    });

    it("default test case11", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = -1;
        expect(ggf.blurX).toBe(0);
    });

    it("default test case12", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = -500;
        expect(ggf.blurX).toBe(0);
    });

    it("default test case13", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = -50000000000000000;
        expect(ggf.blurX).toBe(0);
    });

    it("default test case14", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = { "a":0 };
        expect(ggf.blurX).toBe(0);
    });

    it("default test case15", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = function a() {};
        expect(ggf.blurX).toBe(0);
    });

    it("default test case16", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = [1];
        expect(ggf.blurX).toBe(1);
    });

    it("default test case17", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = [1,2];
        expect(ggf.blurX).toBe(0);
    });

    it("default test case18", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = {};
        expect(ggf.blurX).toBe(0);
    });

    it("default test case19", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = { "toString":function () { return 1 } };
        expect(ggf.blurX).toBe(1);
    });

    it("default test case20", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = { "toString":function () { return "1" } };
        expect(ggf.blurX).toBe(1);
    });

    it("default test case21", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurX = { "toString":function () { return "1a" } };
        expect(ggf.blurX).toBe(0);
    });

});

describe("GradientGlowFilter.js blurY test", function()
{

    it("default test case1", function()
    {
        let ggf = new GradientGlowFilter();
        expect(ggf.blurY).toBe(4);
    });

    it("default test case2", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = null;
        expect(ggf.blurY).toBe(0);
    });

    it("default test case3", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = undefined;
        expect(ggf.blurY).toBe(0);
    });

    it("default test case4", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = true;
        expect(ggf.blurY).toBe(1);
    });

    it("default test case5", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = "";
        expect(ggf.blurY).toBe(0);
    });

    it("default test case6", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = "abc";
        expect(ggf.blurY).toBe(0);
    });

    it("default test case7", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = 0;
        expect(ggf.blurY).toBe(0);
    });

    it("default test case8", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = 1;
        expect(ggf.blurY).toBe(1);
    });

    it("default test case9", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = 500;
        expect(ggf.blurY).toBe(255);
    });

    it("default test case10", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = 50000000000000000;
        expect(ggf.blurY).toBe(255);
    });

    it("default test case11", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = -1;
        expect(ggf.blurY).toBe(0);
    });

    it("default test case12", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = -500;
        expect(ggf.blurY).toBe(0);
    });

    it("default test case13", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = -50000000000000000;
        expect(ggf.blurY).toBe(0);
    });

    it("default test case14", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = { "a":0 };
        expect(ggf.blurY).toBe(0);
    });

    it("default test case15", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = function a() {};
        expect(ggf.blurY).toBe(0);
    });

    it("default test case16", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = [1];
        expect(ggf.blurY).toBe(1);
    });

    it("default test case17", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = [1,2];
        expect(ggf.blurY).toBe(0);
    });

    it("default test case18", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = {};
        expect(ggf.blurY).toBe(0);
    });

    it("default test case19", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = { "toString":function () { return 1 } };
        expect(ggf.blurY).toBe(1);
    });

    it("default test case20", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = { "toString":function () { return "1" } };
        expect(ggf.blurY).toBe(1);
    });

    it("default test case21", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.blurY = { "toString":function () { return "1a" } };
        expect(ggf.blurY).toBe(0);
    });

});

describe("GradientGlowFilter.js distance test", function()
{

    it("default test case1", function()
    {
        let ggf = new GradientGlowFilter();
        expect(ggf.distance).toBe(4);
    });

    it("default test case2", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = null;
        expect(ggf.distance).toBe(0);
    });

    it("default test case3", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = undefined;
        expect(ggf.distance).toBe(4);
    });

    it("default test case4", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = true;
        expect(ggf.distance).toBe(1);
    });

    it("default test case5", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = "";
        expect(ggf.distance).toBe(0);
    });

    it("default test case6", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = "abc";
        expect(ggf.distance).toBe(4);
    });

    it("default test case7", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = 0;
        expect(ggf.distance).toBe(0);
    });

    it("default test case8", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = 1;
        expect(ggf.distance).toBe(1);
    });

    it("default test case9", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = 500;
        expect(ggf.distance).toBe(255);
    });

    it("default test case10", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = 50000000000000000;
        expect(ggf.distance).toBe(255);
    });

    it("default test case11", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = -1;
        expect(ggf.distance).toBe(-1);
    });

    it("default test case12", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = -500;
        expect(ggf.distance).toBe(-255);
    });

    it("default test case13", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = -50000000000000000;
        expect(ggf.distance).toBe(-255);
    });

    it("default test case14", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = { "a":0 };
        expect(ggf.distance).toBe(4);
    });

    it("default test case15", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = function a() {};
        expect(ggf.distance).toBe(4);
    });

    it("default test case16", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = [1];
        expect(ggf.distance).toBe(1);
    });

    it("default test case17", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = [1,2];
        expect(ggf.distance).toBe(4);
    });

    it("default test case18", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = {};
        expect(ggf.distance).toBe(4);
    });

    it("default test case19", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = { "toString":function () { return 1 } };
        expect(ggf.distance).toBe(1);
    });

    it("default test case20", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = { "toString":function () { return "1" } };
        expect(ggf.distance).toBe(1);
    });

    it("default test case21", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.distance = { "toString":function () { return "1a" } };
        expect(ggf.distance).toBe(4);
    });

});

describe("GradientGlowFilter.js quality test", function()
{

    it("default test case1", function()
    {
        let ggf = new GradientGlowFilter();
        expect(ggf.quality).toBe(1);
    });

    it("default test case2", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = null;
        expect(ggf.quality).toBe(0);
    });

    it("default test case3", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = undefined;
        expect(ggf.quality).toBe(0);
    });

    it("default test case4", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = true;
        expect(ggf.quality).toBe(1);
    });

    it("default test case5", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = "";
        expect(ggf.quality).toBe(0);
    });

    it("default test case6", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = "abc";
        expect(ggf.quality).toBe(0);
    });

    it("default test case7", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = 0;
        expect(ggf.quality).toBe(0);
    });

    it("default test case8", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = 1;
        expect(ggf.quality).toBe(1);
    });

    it("default test case9", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = 500;
        expect(ggf.quality).toBe(15);
    });

    it("default test case10", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = 50000000000000000;
        expect(ggf.quality).toBe(15);
    });

    it("default test case11", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = -1;
        expect(ggf.quality).toBe(0);
    });

    it("default test case12", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = -500;
        expect(ggf.quality).toBe(0);
    });

    it("default test case13", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = -50000000000000000;
        expect(ggf.quality).toBe(0);
    });

    it("default test case14", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = { "a":0 };
        expect(ggf.quality).toBe(0);
    });

    it("default test case15", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = function a() {};
        expect(ggf.quality).toBe(0);
    });

    it("default test case16", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = [1];
        expect(ggf.quality).toBe(1);
    });

    it("default test case17", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = [1,2];
        expect(ggf.quality).toBe(0);
    });

    it("default test case18", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = {};
        expect(ggf.quality).toBe(0);
    });

    it("default test case19", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = { "toString":function () { return 1 } };
        expect(ggf.quality).toBe(1);
    });

    it("default test case20", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = { "toString":function () { return "1" } };
        expect(ggf.quality).toBe(1);
    });

    it("default test case21", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.quality = { "toString":function () { return "1a" } };
        expect(ggf.quality).toBe(0);
    });

});

describe("GradientGlowFilter.js strength test", function()
{

    it("default test case1", function()
    {
        let ggf = new GradientGlowFilter();
        expect(ggf.strength).toBe(1);
    });

    it("default test case2", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = null;
        expect(ggf.strength).toBe(0);
    });

    it("default test case3", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = undefined;
        expect(ggf.strength).toBe(0);
    });

    it("default test case4", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = true;
        expect(ggf.strength).toBe(1);
    });

    it("default test case5", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = "";
        expect(ggf.strength).toBe(0);
    });

    it("default test case6", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = "abc";
        expect(ggf.strength).toBe(0);
    });

    it("default test case7", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = 0;
        expect(ggf.strength).toBe(0);
    });

    it("default test case8", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = 1;
        expect(ggf.strength).toBe(1);
    });

    it("default test case9", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = 500;
        expect(ggf.strength).toBe(255);
    });

    it("default test case10", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = 50000000000000000;
        expect(ggf.strength).toBe(255);
    });

    it("default test case11", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = -1;
        expect(ggf.strength).toBe(0);
    });

    it("default test case12", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = -500;
        expect(ggf.strength).toBe(0);
    });

    it("default test case13", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = -50000000000000000;
        expect(ggf.strength).toBe(0);
    });

    it("default test case14", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = { "a":0 };
        expect(ggf.strength).toBe(0);
    });

    it("default test case15", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = function a() {};
        expect(ggf.strength).toBe(0);
    });

    it("default test case16", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = [1];
        expect(ggf.strength).toBe(1);
    });

    it("default test case17", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = [1,2];
        expect(ggf.strength).toBe(0);
    });

    it("default test case18", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = {};
        expect(ggf.strength).toBe(0);
    });

    it("default test case19", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = { "toString":function () { return 1 } };
        expect(ggf.strength).toBe(1);
    });

    it("default test case20", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = { "toString":function () { return "1" } };
        expect(ggf.strength).toBe(1);
    });

    it("default test case21", function()
    {
        let ggf = new GradientGlowFilter();
        ggf.strength = { "toString":function () { return "1a" } };
        expect(ggf.strength).toBe(0);
    });

});