
describe("GradientBevelFilter.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new GradientBevelFilter();
        expect(object.namespace).toBe("next2d.filters.GradientBevelFilter");
    });

    it("namespace test static", function()
    {
        expect(GradientBevelFilter.namespace).toBe("next2d.filters.GradientBevelFilter");
    });

});

describe("GradientBevelFilter.js toString test", function()
{
    it("toString test success", function()
    {
        let filter = new GradientBevelFilter();
        expect(filter.toString()).toBe("[object GradientBevelFilter]");
    });

});

describe("GradientBevelFilter.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(GradientBevelFilter.toString()).toBe("[class GradientBevelFilter]");
    });

});

describe("GradientBevelFilter.js property test", function()
{

    // default
    it("default test success", function()
    {
        let filter = new GradientBevelFilter();
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
        let filter = new GradientBevelFilter(0);
        expect(filter.distance).toBe(0);
    });

    it("distance test success case2", function()
    {
        let filter = new GradientBevelFilter(10.5);
        filter.distance = -12.6;
        expect(filter.distance).toBe(-12.6);
    });

    it("distance test valid case1", function()
    {
        let filter = new GradientBevelFilter("23");
        expect(filter.distance).toBe(23);
    });

    it("distance test valid case2", function()
    {
        let filter = new GradientBevelFilter(1000);
        expect(filter.distance).toBe(255);
    });

    it("distance test valid case3", function()
    {
        let filter = new GradientBevelFilter(-1000);
        expect(filter.distance).toBe(-255);
    });

    it("distance test valid case4", function()
    {
        let filter = new GradientBevelFilter(10);
        filter.distance = "-56";
        expect(filter.distance).toBe(-56);
    });

    it("distance test valid case5", function()
    {
        let filter = new GradientBevelFilter(10);
        filter.distance = 400;
        expect(filter.distance).toBe(255);
    });

    it("distance test valid case6", function()
    {
        let filter = new GradientBevelFilter(10);
        filter.distance = -400;
        expect(filter.distance).toBe(-255);
    });

    it("distance test valid case7", function()
    {
        let filter = new GradientBevelFilter("test");
        expect(filter.distance).toBe(4);
    });

    it("distance test valid case8", function()
    {
        let filter = new GradientBevelFilter(10);
        filter.distance = "abc";
        expect(filter.distance).toBe(4);
    });

    // angle
    it("angle test success case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0);
        expect(filter.angle).toBe(0);
    });

    it("angle test success case2", function()
    {
        let filter = new GradientBevelFilter(10.5, 90);
        filter.angle = 180;
        expect(filter.angle).toBe(180);
    });

    it("angle test valid case1", function()
    {
        let filter = new GradientBevelFilter(10.5, "20");
        expect(filter.angle).toBe(20);
    });

    it("angle test valid case2", function()
    {
        let filter = new GradientBevelFilter(10.5, 20);
        filter.angle = "180";
        expect(filter.angle).toBe(180);
    });

    it("angle test valid case3", function()
    {
        let filter = new GradientBevelFilter(10.5, 20);
        filter.angle = 4500;
        expect(filter.angle).toBe(180);
    });

    it("angle test valid case4", function()
    {
        let filter = new GradientBevelFilter(10.5, 20);
        filter.angle = -4500;
        expect(filter.angle).toBe(-180);
    });

    it("angle test valid case5", function()
    {
        let filter = new GradientBevelFilter(10.5, "test");
        expect(filter.angle).toBe(45);
    });

    it("angle test valid case6", function()
    {
        let filter = new GradientBevelFilter(10.5, 20);
        filter.angle = "abc";
        expect(filter.angle).toBe(45);
    });

    // colors
    it("colors test success case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255]);
        expect(filter.colors[0]).toBe(0xffffff);
        expect(filter.colors[1]).toBe(0xff00ff);
    });

    it("colors test valid case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [16777216, -1], [1, 1], [0, 255]);
        expect(filter.colors[0]).toBe(0x000000);
        expect(filter.colors[1]).toBe(0xffffff);
    });

    it("colors test valid case2", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, ["10","test"], [1, 1], [0, 255]);
        expect(filter.colors[0]).toBe(10);
        expect(filter.colors[1]).toBe(0x000000);
    });

    // alphas
    it("alphas test success case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 0.5], [0, 255]);
        expect(filter.alphas[0]).toBe(1);
        expect(filter.alphas[1]).toBe(0.5);
    });

    it("alphas test valid case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [2, -1], [0, 255]);
        expect(filter.alphas[0]).toBe(1);
        expect(filter.alphas[1]).toBe(0);
    });

    it("alphas test valid case2", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], ["0.5", "test"], [0, 255]);
        expect(filter.alphas[0]).toBe(0.5);
        expect(filter.alphas[1]).toBe(0);
    });

    // ratios
    it("ratios test success case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255]);
        expect(filter.ratios[0]).toBe(0);
        expect(filter.ratios[1]).toBe(255);
    });

    it("ratios test valid case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [-1, 256]);
        expect(filter.ratios[0]).toBe(0);
        expect(filter.ratios[1]).toBe(255);
    });

    it("ratios test valid case2", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], ["100", "test"]);
        expect(filter.ratios[0]).toBe(100);
        expect(filter.ratios[1]).toBe(0);
    });

    // blurX
    it("blurX test success case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 0);
        expect(filter.blurX).toBe(0);
    });

    it("blurX test success case2", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 100);
        filter.blurX = 50;
        expect(filter.blurX).toBe(50);
    });

    it("blurX test valid case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 1000);
        expect(filter.blurX).toBe(255);
    });

    it("blurX test valid case2", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10);
        filter.blurX = 1000;
        expect(filter.blurX).toBe(255);
    });

    it("blurX test valid case3", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], -10);
        expect(filter.blurX).toBe(0);
    });

    it("blurX test valid case4", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10);
        filter.blurX = -1;
        expect(filter.blurX).toBe(0);
    });

    it("blurX test valid case5", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], "100");
        expect(filter.blurX).toBe(100);
    });

    it("blurX test valid case6", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10);
        filter.blurX = "123";
        expect(filter.blurX).toBe(123);
    });

    it("blurX test valid case7", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], "test");
        expect(filter.blurX).toBe(0);
    });

    it("blurX test valid case8", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10);
        filter.blurX = "123a";
        expect(filter.blurX).toBe(0);
    });

    // blurY
    it("blurY test success case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 0);
        expect(filter.blurY).toBe(0);
    });

    it("blurY test success case2", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 100);
        filter.blurY = 50;
        expect(filter.blurY).toBe(50);
    });

    it("blurY test valid case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 1000);
        expect(filter.blurY).toBe(255);
    });

    it("blurY test valid case2", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10);
        filter.blurY = 1000;
        expect(filter.blurY).toBe(255);
    });

    it("blurY test valid case3", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, -10);
        expect(filter.blurY).toBe(0);
    });

    it("blurY test valid case4", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10);
        filter.blurY = -1;
        expect(filter.blurY).toBe(0);
    });

    it("blurY test valid case5", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, "100");
        expect(filter.blurY).toBe(100);
    });

    it("blurY test valid case6", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10);
        filter.blurY = "123";
        expect(filter.blurY).toBe(123);
    });

    it("blurY test valid case7", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, "test");
        expect(filter.blurY).toBe(0);
    });

    it("blurY test valid case8", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10);
        filter.blurY = "123a";
        expect(filter.blurY).toBe(0);
    });

    // strength
    it("strength test success case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 0);
        expect(filter.strength).toBe(0);
    });

    it("strength test success case2", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 10);
        filter.strength = 2;
        expect(filter.strength).toBe(2);
    });

    it("strength test valid case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, "9");
        expect(filter.strength).toBe(9);
    });

    it("strength test valid case2", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 2);
        filter.strength = "9";
        expect(filter.strength).toBe(9);
    });

    it("strength test valid case3", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, -1);
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case4", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 2);
        filter.strength = -10;
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case5", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 1000);
        expect(filter.strength).toBe(255);
    });

    it("strength test valid case6", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 2);
        filter.strength = 1000;
        expect(filter.strength).toBe(255);
    });

    it("strength test valid case7", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, "test");
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case8", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3);
        filter.strength = "abc";
        expect(filter.strength).toBe(0);
    });

    // quality
    it("quality test success case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 0);
        expect(filter.quality).toBe(0);
    });

    it("quality test success case2", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 5);
        filter.quality = 2;
        expect(filter.quality).toBe(2);
    });

    it("quality test valid case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 1000);
        expect(filter.quality).toBe(15);
    });

    it("quality test valid case2", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 2);
        filter.quality = 1000;
        expect(filter.quality).toBe(15);
    });

    it("quality test valid case3", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, -1);
        expect(filter.quality).toBe(0);
    });

    it("quality test valid case4", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 5);
        filter.quality = -1;
        expect(filter.quality).toBe(0);
    });

    it("quality test valid case5", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, "12");
        expect(filter.quality).toBe(12);
    });

    it("quality test valid case6", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10);
        filter.quality = "12";
        expect(filter.quality).toBe(12);
    });

    it("quality test valid case7", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, "test");
        expect(filter.quality).toBe(0);
    });

    it("quality test valid case8", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10);
        filter.quality = "123a";
        expect(filter.quality).toBe(0);
    });

    // type
    it("type test success case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.INNER);
        expect(filter.type).toBe(BitmapFilterType.INNER);
    });

    it("type test success case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.OUTER);
        expect(filter.type).toBe(BitmapFilterType.OUTER);
    });

    it("type test success case3", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL);
        expect(filter.type).toBe(BitmapFilterType.FULL);
    });

    it("type test success case4", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.INNER);
        filter.type = BitmapFilterType.OUTER;
        expect(filter.type).toBe(BitmapFilterType.OUTER);
    });

    it("type test valid case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, "FULL");
        expect(filter.type).toBe(BitmapFilterType.INNER);
    });

    it("type test valid case2", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, "FULL");
        filter.type = "abc";
        expect(filter.type).toBe(BitmapFilterType.INNER);
    });

    // knockout
    it("knockout test success case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, true);
        expect(filter.knockout).toBe(true);
    });

    it("knockout test success case2", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, true);
        filter.knockout = false;
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case1", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, 1);
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case2", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, false);
        filter.knockout = 1;
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case3", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, 0);
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case4", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, true);
        filter.knockout = 0;
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case5", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, "test");
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case6", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, true);
        filter.knockout = "";
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case7", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, {});
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case8", function()
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, BitmapFilterType.FULL, []);
        expect(filter.knockout).toBe(true);
    });

});

describe("GradientBevelFilter.js clone test", function()
{

    it("clone test", function()
    {
        let filter = new GradientBevelFilter(
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

describe("GradientBevelFilter.js knockout test", function()
{

    it("default test case1", function()
    {
        let gbf = new GradientBevelFilter();
        expect(gbf.knockout).toBe(false);
    });

    it("default test case2", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = null;
        expect(gbf.knockout).toBe(false);
    });

    it("default test case3", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = undefined;
        expect(gbf.knockout).toBe(false);
    });

    it("default test case4", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = true;
        expect(gbf.knockout).toBe(true);
    });

    it("default test case5", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = "";
        expect(gbf.knockout).toBe(false);
    });

    it("default test case6", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = "abc";
        expect(gbf.knockout).toBe(true);
    });

    it("default test case7", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = 0;
        expect(gbf.knockout).toBe(false);
    });

    it("default test case8", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = 1;
        expect(gbf.knockout).toBe(true);
    });

    it("default test case9", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = 500;
        expect(gbf.knockout).toBe(true);
    });

    it("default test case10", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = 50000000000000000;
        expect(gbf.knockout).toBe(true);
    });

    it("default test case11", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = -1;
        expect(gbf.knockout).toBe(true);
    });

    it("default test case12", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = -500;
        expect(gbf.knockout).toBe(true);
    });

    it("default test case13", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = -50000000000000000;
        expect(gbf.knockout).toBe(true);
    });

    it("default test case14", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = { "a":0 };
        expect(gbf.knockout).toBe(true);
    });

    it("default test case15", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = function a() {};
        expect(gbf.knockout).toBe(true);
    });

    it("default test case16", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = [1];
        expect(gbf.knockout).toBe(true);
    });

    it("default test case17", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = [1,2];
        expect(gbf.knockout).toBe(true);
    });

    it("default test case18", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = {};
        expect(gbf.knockout).toBe(true);
    });

    it("default test case19", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = { "toString":function () { return 1 } };
        expect(gbf.knockout).toBe(true);
    });

    it("default test case20", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = { "toString":function () { return "1" } };
        expect(gbf.knockout).toBe(true);
    });

    it("default test case21", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = { "toString":function () { return "1a" } };
        expect(gbf.knockout).toBe(true);
    });

});

describe("GradientBevelFilter.js angle test", function()
{

    it("default test case1", function()
    {
        let gbf = new GradientBevelFilter();
        expect(gbf.angle).toBe(45);
    });

    it("default test case2", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = null;
        expect(gbf.angle).toBe(0);
    });

    it("default test case3", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = undefined;
        expect(gbf.angle).toBe(45);
    });

    it("default test case4", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = true;
        expect(gbf.angle).toBe(1);
    });

    it("default test case5", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = "";
        expect(gbf.angle).toBe(0);
    });

    it("default test case6", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = "abc";
        expect(gbf.angle).toBe(45);
    });

    it("default test case7", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = 0;
        expect(gbf.angle).toBe(0);
    });

    it("default test case8", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = 1;
        expect(gbf.angle).toBe(1);
    });

    it("default test case9", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = 500;
        expect(gbf.angle).toBe(140);
    });

    it("default test case10", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = 50000000000000000;
        expect(gbf.angle).toBe(320);
    });

    it("default test case11", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = -1;
        expect(gbf.angle).toBe(-1);
    });

    it("default test case12", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = -500;
        expect(gbf.angle).toBe(-140);
    });

    it("default test case13", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = -50000000000000000;
        expect(gbf.angle).toBe(-320);
    });

    it("default test case14", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = { "a":0 };
        expect(gbf.angle).toBe(45);
    });

    it("default test case15", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = function a() {};
        expect(gbf.angle).toBe(45);
    });

    it("default test case16", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = [1];
        expect(gbf.angle).toBe(1);
    });

    it("default test case17", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = [1,2];
        expect(gbf.angle).toBe(45);
    });

    it("default test case18", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = {};
        expect(gbf.angle).toBe(45);
    });

    it("default test case19", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = { "toString":function () { return 1 } };
        expect(gbf.angle).toBe(1);
    });

    it("default test case20", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = { "toString":function () { return "1" } };
        expect(gbf.angle).toBe(1);
    });

    it("default test case21", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = { "toString":function () { return "1a" } };
        expect(gbf.angle).toBe(45);
    });

});

describe("GradientBevelFilter.js blurX test", function()
{

    it("default test case1", function()
    {
        let gbf = new GradientBevelFilter();
        expect(gbf.blurX).toBe(4);
    });

    it("default test case2", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = null;
        expect(gbf.blurX).toBe(0);
    });

    it("default test case3", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = undefined;
        expect(gbf.blurX).toBe(0);
    });

    it("default test case4", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = true;
        expect(gbf.blurX).toBe(1);
    });

    it("default test case5", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = "";
        expect(gbf.blurX).toBe(0);
    });

    it("default test case6", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = "abc";
        expect(gbf.blurX).toBe(0);
    });

    it("default test case7", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = 0;
        expect(gbf.blurX).toBe(0);
    });

    it("default test case8", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = 1;
        expect(gbf.blurX).toBe(1);
    });

    it("default test case9", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = 500;
        expect(gbf.blurX).toBe(255);
    });

    it("default test case10", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = 50000000000000000;
        expect(gbf.blurX).toBe(255);
    });

    it("default test case11", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = -1;
        expect(gbf.blurX).toBe(0);
    });

    it("default test case12", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = -500;
        expect(gbf.blurX).toBe(0);
    });

    it("default test case13", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = -50000000000000000;
        expect(gbf.blurX).toBe(0);
    });

    it("default test case14", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = { "a":0 };
        expect(gbf.blurX).toBe(0);
    });

    it("default test case15", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = function a() {};
        expect(gbf.blurX).toBe(0);
    });

    it("default test case16", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = [1];
        expect(gbf.blurX).toBe(1);
    });

    it("default test case17", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = [1,2];
        expect(gbf.blurX).toBe(0);
    });

    it("default test case18", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = {};
        expect(gbf.blurX).toBe(0);
    });

    it("default test case19", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = { "toString":function () { return 1 } };
        expect(gbf.blurX).toBe(1);
    });

    it("default test case20", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = { "toString":function () { return "1" } };
        expect(gbf.blurX).toBe(1);
    });

    it("default test case21", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurX = { "toString":function () { return "1a" } };
        expect(gbf.blurX).toBe(0);
    });

});

describe("GradientBevelFilter.js blurY test", function()
{

    it("default test case1", function()
    {
        let gbf = new GradientBevelFilter();
        expect(gbf.blurY).toBe(4);
    });

    it("default test case2", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = null;
        expect(gbf.blurY).toBe(0);
    });

    it("default test case3", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = undefined;
        expect(gbf.blurY).toBe(0);
    });

    it("default test case4", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = true;
        expect(gbf.blurY).toBe(1);
    });

    it("default test case5", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = "";
        expect(gbf.blurY).toBe(0);
    });

    it("default test case6", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = "abc";
        expect(gbf.blurY).toBe(0);
    });

    it("default test case7", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = 0;
        expect(gbf.blurY).toBe(0);
    });

    it("default test case8", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = 1;
        expect(gbf.blurY).toBe(1);
    });

    it("default test case9", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = 500;
        expect(gbf.blurY).toBe(255);
    });

    it("default test case10", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = 50000000000000000;
        expect(gbf.blurY).toBe(255);
    });

    it("default test case11", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = -1;
        expect(gbf.blurY).toBe(0);
    });

    it("default test case12", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = -500;
        expect(gbf.blurY).toBe(0);
    });

    it("default test case13", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = -50000000000000000;
        expect(gbf.blurY).toBe(0);
    });

    it("default test case14", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = { "a":0 };
        expect(gbf.blurY).toBe(0);
    });

    it("default test case15", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = function a() {};
        expect(gbf.blurY).toBe(0);
    });

    it("default test case16", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = [1];
        expect(gbf.blurY).toBe(1);
    });

    it("default test case17", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = [1,2];
        expect(gbf.blurY).toBe(0);
    });

    it("default test case18", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = {};
        expect(gbf.blurY).toBe(0);
    });

    it("default test case19", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = { "toString":function () { return 1 } };
        expect(gbf.blurY).toBe(1);
    });

    it("default test case20", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = { "toString":function () { return "1" } };
        expect(gbf.blurY).toBe(1);
    });

    it("default test case21", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.blurY = { "toString":function () { return "1a" } };
        expect(gbf.blurY).toBe(0);
    });

});

describe("GradientBevelFilter.js distance test", function()
{

    it("default test case1", function()
    {
        let gbf = new GradientBevelFilter();
        expect(gbf.distance).toBe(4);
    });

    it("default test case2", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = null;
        expect(gbf.distance).toBe(0);
    });

    it("default test case3", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = undefined;
        expect(gbf.distance).toBe(4);
    });

    it("default test case4", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = true;
        expect(gbf.distance).toBe(1);
    });

    it("default test case5", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = "";
        expect(gbf.distance).toBe(0);
    });

    it("default test case6", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = "abc";
        expect(gbf.distance).toBe(4);
    });

    it("default test case7", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = 0;
        expect(gbf.distance).toBe(0);
    });

    it("default test case8", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = 1;
        expect(gbf.distance).toBe(1);
    });

    it("default test case9", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = 500;
        expect(gbf.distance).toBe(255);
    });

    it("default test case10", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = 50000000000000000;
        expect(gbf.distance).toBe(255);
    });

    it("default test case11", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = -1;
        expect(gbf.distance).toBe(-1);
    });

    it("default test case12", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = -500;
        expect(gbf.distance).toBe(-255);
    });

    it("default test case13", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = -50000000000000000;
        expect(gbf.distance).toBe(-255);
    });

    it("default test case14", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = { "a":0 };
        expect(gbf.distance).toBe(4);
    });

    it("default test case15", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = function a() {};
        expect(gbf.distance).toBe(4);
    });

    it("default test case16", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = [1];
        expect(gbf.distance).toBe(1);
    });

    it("default test case17", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = [1,2];
        expect(gbf.distance).toBe(4);
    });

    it("default test case18", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = {};
        expect(gbf.distance).toBe(4);
    });

    it("default test case19", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = { "toString":function () { return 1 } };
        expect(gbf.distance).toBe(1);
    });

    it("default test case20", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = { "toString":function () { return "1" } };
        expect(gbf.distance).toBe(1);
    });

    it("default test case21", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = { "toString":function () { return "1a" } };
        expect(gbf.distance).toBe(4);
    });

});

describe("GradientBevelFilter.js quality test", function()
{

    it("default test case1", function()
    {
        let gbf = new GradientBevelFilter();
        expect(gbf.quality).toBe(1);
    });

    it("default test case2", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = null;
        expect(gbf.quality).toBe(0);
    });

    it("default test case3", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = undefined;
        expect(gbf.quality).toBe(0);
    });

    it("default test case4", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = true;
        expect(gbf.quality).toBe(1);
    });

    it("default test case5", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = "";
        expect(gbf.quality).toBe(0);
    });

    it("default test case6", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = "abc";
        expect(gbf.quality).toBe(0);
    });

    it("default test case7", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = 0;
        expect(gbf.quality).toBe(0);
    });

    it("default test case8", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = 1;
        expect(gbf.quality).toBe(1);
    });

    it("default test case9", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = 500;
        expect(gbf.quality).toBe(15);
    });

    it("default test case10", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = 50000000000000000;
        expect(gbf.quality).toBe(15);
    });

    it("default test case11", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = -1;
        expect(gbf.quality).toBe(0);
    });

    it("default test case12", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = -500;
        expect(gbf.quality).toBe(0);
    });

    it("default test case13", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = -50000000000000000;
        expect(gbf.quality).toBe(0);
    });

    it("default test case14", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = { "a":0 };
        expect(gbf.quality).toBe(0);
    });

    it("default test case15", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = function a() {};
        expect(gbf.quality).toBe(0);
    });

    it("default test case16", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = [1];
        expect(gbf.quality).toBe(1);
    });

    it("default test case17", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = [1,2];
        expect(gbf.quality).toBe(0);
    });

    it("default test case18", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = {};
        expect(gbf.quality).toBe(0);
    });

    it("default test case19", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = { "toString":function () { return 1 } };
        expect(gbf.quality).toBe(1);
    });

    it("default test case20", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = { "toString":function () { return "1" } };
        expect(gbf.quality).toBe(1);
    });

    it("default test case21", function()
    {
        let gbf = new GradientBevelFilter();
        gbf.quality = { "toString":function () { return "1a" } };
        expect(gbf.quality).toBe(0);
    });

});