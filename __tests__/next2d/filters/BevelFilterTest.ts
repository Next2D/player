import { BevelFilter } from "../../../src/next2d/filters/BevelFilter";
import { BlurFilter } from "../../../src/next2d/filters/BlurFilter";

describe("BevelFilter.js toString test", () =>
{
    it("toString test success", () =>
    {
        let filter = new BevelFilter();
        expect(filter.toString()).toBe("[object BevelFilter]");
    });

});

describe("BevelFilter.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(BevelFilter.toString()).toBe("[class BevelFilter]");
    });

});

describe("BevelFilter.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new BevelFilter();
        expect(object.namespace).toBe("next2d.filters.BevelFilter");
    });

    it("namespace test static", () =>
    {
        expect(BevelFilter.namespace).toBe("next2d.filters.BevelFilter");
    });

});

describe("BevelFilter.js property test", () =>
{

    // default
    it("default test success", () =>
    {
        let filter = new BevelFilter();
        expect(filter.angle).toBe(45);
        expect(filter.blurX).toBe(4);
        expect(filter.blurY).toBe(4);
        expect(filter.distance).toBe(4);
        expect(filter.highlightAlpha).toBe(1);
        expect(filter.highlightColor).toBe(0xffffff);
        expect(filter.knockout).toBe(false);
        expect(filter.quality).toBe(1);
        expect(filter.shadowAlpha).toBe(1);
        expect(filter.shadowColor).toBe(0x000000);
        expect(filter.strength).toBe(1);
        expect(filter.type).toBe("inner");
    });

    // distance
    it("distance test success case1", () =>
    {
        let filter = new BevelFilter(10.5);
        expect(filter.distance).toBe(10.5);
    });

    it("distance test success case2", () =>
    {
        let filter = new BevelFilter(10.5);
        filter.distance = -12.6;
        expect(filter.distance).toBe(-12.6);
    });

    it("distance test valid case1", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter("23");
        expect(filter.distance).toBe(23);
    });

    it("distance test valid case2", () =>
    {
        let filter = new BevelFilter(1000);
        expect(filter.distance).toBe(255);
    });

    it("distance test valid case3", () =>
    {
        let filter = new BevelFilter(-1000);
        expect(filter.distance).toBe(-255);
    });

    it("distance test valid case4", () =>
    {
        let filter = new BevelFilter(10);
        // @ts-ignore
        filter.distance = "-56";
        expect(filter.distance).toBe(-56);
    });

    it("distance test valid case5", () =>
    {
        let filter = new BevelFilter(10);
        filter.distance = 400;
        expect(filter.distance).toBe(255);
    });

    it("distance test valid case6", () =>
    {
        let filter = new BevelFilter(10);
        filter.distance = -400;
        expect(filter.distance).toBe(-255);
    });

    it("distance test valid case7", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter("test");
        expect(filter.distance).toBe(4);
    });

    it("distance test valid case8", () =>
    {
        let filter = new BevelFilter(10);
        // @ts-ignore
        filter.distance = "abc";
        expect(filter.distance).toBe(4);
    });

    // angle
    it("angle test success case1", () =>
    {
        let filter = new BevelFilter(10.5, 90);
        expect(filter.angle).toBe(90);
    });

    it("angle test success case2", () =>
    {
        let filter = new BevelFilter(10.5, 90);
        filter.angle = 180;
        expect(filter.angle).toBe(180);
    });

    it("angle test valid case1", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, "20");
        expect(filter.angle).toBe(20);
    });

    it("angle test valid case2", () =>
    {
        let filter = new BevelFilter(10.5, 20);
        // @ts-ignore
        filter.angle = "180";
        expect(filter.angle).toBe(180);
    });

    it("angle test valid case3", () =>
    {
        let filter = new BevelFilter(10.5, 20);
        filter.angle = 4500;
        expect(filter.angle).toBe(180);
    });

    it("angle test valid case4", () =>
    {
        let filter = new BevelFilter(10.5, 20);
        filter.angle = -4500;
        expect(filter.angle).toBe(-180);
    });

    it("angle test valid case5", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, "test");
        expect(filter.angle).toBe(45);
    });

    it("angle test valid case6", () =>
    {
        let filter = new BevelFilter(10.5, 20);
        // @ts-ignore
        filter.angle = "abc";
        expect(filter.angle).toBe(45);
    });

    // highlightColor
    it("highlightColor test success case1", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0x000000);
        expect(filter.highlightColor).toBe(0x000000);
    });

    it("highlightColor test success case2", () =>
    {
        let filter = new BevelFilter(10.5, 90, 0xff0000);
        filter.highlightColor = 0x00ff00;
        expect(filter.highlightColor).toBe(0x00ff00);
    });

    it("highlightColor test valid case3", () =>
    {
        let filter = new BevelFilter(10.5, 90, -10);
        expect(filter.highlightColor).toBe(0);
    });

    it("highlightColor test valid case4", () =>
    {
        let filter = new BevelFilter(10.5, 90, 16777220);
        expect(filter.highlightColor).toBe(0xffffff);
    });

    // highlightAlpha
    it("highlightAlpha test success case1", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 0);
        expect(filter.highlightAlpha).toBe(0);
    });

    it("highlightAlpha test success case2", () =>
    {
        let filter = new BevelFilter(10.5, 90, 0xff0000, 0.5);
        filter.highlightAlpha = 0.75;
        expect(filter.highlightAlpha).toBe(0.75);
    });

    it("highlightAlpha test valid case2", () =>
    {
        let filter = new BevelFilter(10.5, 90, 0xff0000, -10);
        expect(filter.highlightAlpha).toBe(0);
    });

    it("highlightAlpha test valid case3", () =>
    {
        let filter = new BevelFilter(10.5, 90, 0xff0000, 10);
        expect(filter.highlightAlpha).toBe(1);
    });

    // shadowColor
    it("shadowColor test success case1", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0);
        expect(filter.shadowColor).toBe(0);
    });

    it("shadowColor test success case2", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xff0000);
        filter.shadowColor = 0x00ff00;
        expect(filter.shadowColor).toBe(0x00ff00);
    });

    it("shadowColor test valid case3", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, -10);
        expect(filter.shadowColor).toBe(0);
    });

    it("shadowColor test valid case4", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 16777220);
        expect(filter.shadowColor).toBe(0xffffff);
    });

    // shadowAlpha
    it("shadowAlpha test success case1", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 0);
        expect(filter.shadowAlpha).toBe(0);
    });

    it("shadowAlpha test success case2", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 0.5);
        filter.shadowAlpha = 0.75;
        expect(filter.shadowAlpha).toBe(0.75);
    });

    it("shadowAlpha test valid case1", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, "0.25");
        expect(filter.shadowAlpha).toBe(0.25);
    });

    it("shadowAlpha test valid case2", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, -10);
        expect(filter.shadowAlpha).toBe(0);
    });

    it("shadowAlpha test valid case3", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 10);
        expect(filter.shadowAlpha).toBe(1);
    });

    it("shadowAlpha test valid case4", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1);

        // @ts-ignore
        filter.shadowAlpha = "0.75";
        expect(filter.shadowAlpha).toBe(0.75);

        filter.shadowAlpha = -10;
        expect(filter.shadowAlpha).toBe(0);

        filter.shadowAlpha = 16777220;
        expect(filter.shadowAlpha).toBe(1);
    });

    // blurX
    it("blurX test success case1", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 0);
        expect(filter.blurX).toBe(0);
    });

    it("blurX test success case2", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 100);
        filter.blurX = 50;
        expect(filter.blurX).toBe(50);
    });

    it("blurX test valid case1", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 1000);
        expect(filter.blurX).toBe(255);
    });

    it("blurX test valid case2", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10);
        filter.blurX = 1000;
        expect(filter.blurX).toBe(255);
    });

    it("blurX test valid case3", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, -10);
        expect(filter.blurX).toBe(0);
    });

    it("blurX test valid case4", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10);
        filter.blurX = -1;
        expect(filter.blurX).toBe(0);
    });

    it("blurX test valid case5", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, "100");
        expect(filter.blurX).toBe(100);
    });

    it("blurX test valid case6", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10);
        // @ts-ignore
        filter.blurX = "123";
        expect(filter.blurX).toBe(123);
    });

    it("blurX test valid case7", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, "test");
        expect(filter.blurX).toBe(0);
    });

    it("blurX test valid case8", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10);
        // @ts-ignore
        filter.blurX = "123a";
        expect(filter.blurX).toBe(0);
    });

    // blurY
    it("blurY test success case1", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 0);
        expect(filter.blurY).toBe(0);
    });

    it("blurY test success case2", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 100);
        filter.blurY = 50;
        expect(filter.blurY).toBe(50);
    });

    it("blurY test valid case1", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 1000);
        expect(filter.blurY).toBe(255);
    });

    it("blurY test valid case2", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10);
        filter.blurY = 1000;
        expect(filter.blurY).toBe(255);
    });

    it("blurY test valid case3", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, -10);
        expect(filter.blurY).toBe(0);
    });

    it("blurY test valid case4", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10);
        filter.blurY = -1;
        expect(filter.blurY).toBe(0);
    });

    it("blurY test valid case5", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, "100");
        expect(filter.blurY).toBe(100);
    });

    it("blurY test valid case6", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10);
        // @ts-ignore
        filter.blurY = "123";
        expect(filter.blurY).toBe(123);
    });

    it("blurY test valid case7", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, "test");
        expect(filter.blurY).toBe(0);
    });

    it("blurY test valid case8", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10);
        // @ts-ignore
        filter.blurY = "123a";
        expect(filter.blurY).toBe(0);
    });

    // strength
    it("strength test success case1", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 0);
        expect(filter.strength).toBe(0);
    });

    it("strength test success case2", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 10);
        filter.strength = 2;
        expect(filter.strength).toBe(2);
    });

    it("strength test valid case1", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, "9");
        expect(filter.strength).toBe(9);
    });

    it("strength test valid case2", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 2);
        // @ts-ignore
        filter.strength = "9";
        expect(filter.strength).toBe(9);
    });

    it("strength test valid case3", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, -1);
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case4", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 2);
        filter.strength = -10;
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case5", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 1000);
        expect(filter.strength).toBe(255);
    });

    it("strength test valid case6", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 2);
        filter.strength = 1000;
        expect(filter.strength).toBe(255);
    });

    it("strength test valid case7", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, "test");
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case8", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3);
        // @ts-ignore
        filter.strength = "abc";
        expect(filter.strength).toBe(0);
    });

    // quality
    it("quality test success case1", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 0);
        expect(filter.quality).toBe(0);
    });

    it("quality test success case2", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 5);
        filter.quality = 2;
        expect(filter.quality).toBe(2);
    });

    it("quality test valid case1", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 1000);
        expect(filter.quality).toBe(15);
    });

    it("quality test valid case2", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 2);
        // @ts-ignore
        filter.quality = 1000;
        expect(filter.quality).toBe(15);
    });

    it("quality test valid case3", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, -1);
        expect(filter.quality).toBe(0);
    });

    it("quality test valid case4", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 5);
        // @ts-ignore
        filter.quality = -1;
        expect(filter.quality).toBe(0);
    });

    it("quality test valid case5", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, "12");
        expect(filter.quality).toBe(12);
    });

    it("quality test valid case6", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 10);
        // @ts-ignore
        filter.quality = "12";
        expect(filter.quality).toBe(12);
    });

    it("quality test valid case7", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, "test");
        expect(filter.quality).toBe(0);
    });

    it("quality test valid case8", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 10);
        // @ts-ignore
        filter.quality = "123a";
        expect(filter.quality).toBe(0);
    });

    // type
    it("type test success case1", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 10, "inner");
        expect(filter.type).toBe("inner");
    });

    it("type test success case2", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 10, "outer");
        expect(filter.type).toBe("outer");
    });

    it("type test success case3", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 10, "full");
        expect(filter.type).toBe("full");
    });

    it("type test success case4", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 10, "inner");
        filter.type = "outer";
        expect(filter.type).toBe("outer");
    });

    it("type test valid case1", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 10, "outer");
        expect(filter.type).toBe("outer");
    });

    it("type test valid case2", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 10, "outer");
        filter.type = "full";
        expect(filter.type).toBe("full");
    });

    // knockout
    it("knockout test success case1", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 10, "inner", true);
        expect(filter.knockout).toBe(true);
    });

    it("knockout test success case2", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 10, "inner", true);
        filter.knockout = false;
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case1", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 10, "inner", 1);
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case2", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 10, "inner", false);
        // @ts-ignore
        filter.knockout = 1;
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case3", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 10, "inner", 0);
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case4", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 10, "inner", true);
        // @ts-ignore
        filter.knockout = 0;
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case5", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 10, "inner", "test");
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case6", () =>
    {
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 10, "inner", true);
        // @ts-ignore
        filter.knockout = "";
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case7", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 10, "inner", {});
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case8", () =>
    {
        // @ts-ignore
        let filter = new BevelFilter(10.5, 20, 0xff0000, 1, 0xffffff, 1, 10, 10, 3, 10, "inner", []);
        expect(filter.knockout).toBe(true);
    });

});

describe("BevelFilter.js clone test", () =>
{

    it("clone test", () =>
    {
        let filter = new BevelFilter(
            1, 25, 0xff0000, 0.8, 0x00ff00,
            0.2, 120, 100, 9, 2,
            "outer", true

        );
        let clone  = filter.clone();

        // clone check
        expect(clone.angle).toBe(25);
        expect(clone.blurX).toBe(120);
        expect(clone.blurY).toBe(100);
        expect(clone.distance).toBe(1);
        expect(clone.highlightAlpha).toBe(0.8);
        expect(clone.highlightColor).toBe(0xff0000);
        expect(clone.knockout).toBe(true);
        expect(clone.quality).toBe(2);
        expect(clone.shadowAlpha).toBe(0.2);
        expect(clone.shadowColor).toBe(0x00ff00);
        expect(clone.strength).toBe(9);
        expect(clone.type).toBe("outer");

        // edit param
        clone.angle          = 90;
        clone.blurX          = 10;
        clone.blurY          = 10;
        clone.distance       = 10;
        clone.highlightAlpha = 0.5;
        clone.highlightColor = 0xff0000;
        clone.knockout       = false;
        clone.quality        = 3;
        clone.shadowAlpha    = 0.1;
        clone.shadowColor    = 0xffffff;
        clone.strength       = 10;
        clone.type           = "full";

        // origin
        expect(filter.angle).toBe(25);
        expect(filter.blurX).toBe(120);
        expect(filter.blurY).toBe(100);
        expect(filter.distance).toBe(1);
        expect(filter.highlightAlpha).toBe(0.8);
        expect(filter.highlightColor).toBe(0xff0000);
        expect(filter.knockout).toBe(true);
        expect(filter.quality).toBe(2);
        expect(filter.shadowAlpha).toBe(0.2);
        expect(filter.shadowColor).toBe(0x00ff00);
        expect(filter.strength).toBe(9);
        expect(filter.type).toBe("outer");

        // clone
        expect(clone.angle).toBe(90);
        expect(clone.blurX).toBe(10);
        expect(clone.blurY).toBe(10);
        expect(clone.distance).toBe(10);
        expect(clone.highlightAlpha).toBe(0.5);
        expect(clone.highlightColor).toBe(0xff0000);
        expect(clone.knockout).toBe(false);
        expect(clone.quality).toBe(3);
        expect(clone.shadowAlpha).toBe(0.1);
        expect(clone.shadowColor).toBe(0xffffff);
        expect(clone.strength).toBe(10);
        expect(clone.type).toBe("full");

    });

});

describe("BevelFilter.js knockout test", () =>
{

    it("default test case1", () =>
    {
        let bf = new BevelFilter();
        expect(bf.knockout).toBe(false);
    });

    it("default test case2", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.knockout = null;
        expect(bf.knockout).toBe(false);
    });

    it("default test case3", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.knockout = undefined;
        expect(bf.knockout).toBe(false);
    });

    it("default test case4", () =>
    {
        let bf = new BevelFilter();
        bf.knockout = true;
        expect(bf.knockout).toBe(true);
    });

    it("default test case5", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.knockout = "";
        expect(bf.knockout).toBe(false);
    });

    it("default test case6", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.knockout = "abc";
        expect(bf.knockout).toBe(true);
    });

    it("default test case7", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.knockout = 0;
        expect(bf.knockout).toBe(false);
    });

    it("default test case8", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.knockout = 1;
        expect(bf.knockout).toBe(true);
    });

    it("default test case9", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.knockout = 500;
        expect(bf.knockout).toBe(true);
    });

    it("default test case10", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.knockout = 50000000000000000;
        expect(bf.knockout).toBe(true);
    });

    it("default test case11", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.knockout = -1;
        expect(bf.knockout).toBe(true);
    });

    it("default test case12", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.knockout = -500;
        expect(bf.knockout).toBe(true);
    });

    it("default test case13", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.knockout = -50000000000000000;
        expect(bf.knockout).toBe(true);
    });

    it("default test case14", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.knockout = { "a":0 };
        expect(bf.knockout).toBe(true);
    });

    it("default test case15", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.knockout = function a() {};
        expect(bf.knockout).toBe(true);
    });

    it("default test case16", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.knockout = [1];
        expect(bf.knockout).toBe(true);
    });

    it("default test case17", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.knockout = [1,2];
        expect(bf.knockout).toBe(true);
    });

    it("default test case18", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.knockout = {};
        expect(bf.knockout).toBe(true);
    });

    it("default test case19", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.knockout = { "toString":() => { return 1 } };
        expect(bf.knockout).toBe(true);
    });

    it("default test case20", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.knockout = { "toString":() => { return "1" } };
        expect(bf.knockout).toBe(true);
    });

    it("default test case21", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.knockout = { "toString":() => { return "1a" } };
        expect(bf.knockout).toBe(true);
    });

});

describe("BevelFilter.js angle test", () =>
{

    it("default test case1", () =>
    {
        let bf = new BevelFilter();
        expect(bf.angle).toBe(45);
    });

    it("default test case2", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.angle = null;
        expect(bf.angle).toBe(0);
    });

    it("default test case3", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.angle = undefined;
        expect(bf.angle).toBe(45);
    });

    it("default test case4", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.angle = true;
        expect(bf.angle).toBe(1);
    });

    it("default test case5", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.angle = "";
        expect(bf.angle).toBe(0);
    });

    it("default test case6", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.angle = "abc";
        expect(bf.angle).toBe(45);
    });

    it("default test case7", () =>
    {
        let bf = new BevelFilter();
        bf.angle = 0;
        expect(bf.angle).toBe(0);
    });

    it("default test case8", () =>
    {
        let bf = new BevelFilter();
        bf.angle = 1;
        expect(bf.angle).toBe(1);
    });

    it("default test case9", () =>
    {
        let bf = new BevelFilter();
        bf.angle = 500;
        expect(bf.angle).toBe(140);
    });

    it("default test case10", () =>
    {
        let bf = new BevelFilter();
        bf.angle = 50000000000000000;
        expect(bf.angle).toBe(320);
    });

    it("default test case11", () =>
    {
        let bf = new BevelFilter();
        bf.angle = -1;
        expect(bf.angle).toBe(-1);
    });

    it("default test case12", () =>
    {
        let bf = new BevelFilter();
        bf.angle = -500;
        expect(bf.angle).toBe(-140);
    });

    it("default test case13", () =>
    {
        let bf = new BevelFilter();
        bf.angle = -50000000000000000;
        expect(bf.angle).toBe(-320);
    });

    it("default test case14", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.angle = { "a":0 };
        expect(bf.angle).toBe(45);
    });

    it("default test case15", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.angle = function a() {};
        expect(bf.angle).toBe(45);
    });

    it("default test case16", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.angle = [1];
        expect(bf.angle).toBe(1);
    });

    it("default test case17", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.angle = [1,2];
        expect(bf.angle).toBe(45);
    });

    it("default test case18", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.angle = {};
        expect(bf.angle).toBe(45);
    });

    it("default test case19", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.angle = { "toString":() => { return 1 } };
        expect(bf.angle).toBe(1);
    });

    it("default test case20", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.angle = { "toString":() => { return "1" } };
        expect(bf.angle).toBe(1);
    });

    it("default test case21", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.angle = { "toString":() => { return "1a" } };
        expect(bf.angle).toBe(45);
    });

});

describe("BevelFilter.js blurX test", () =>
{

    it("default test case1", () =>
    {
        let bf = new BevelFilter();
        expect(bf.blurX).toBe(4);
    });

    it("default test case2", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.blurX = null;
        expect(bf.blurX).toBe(0);
    });

    it("default test case3", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.blurX = undefined;
        expect(bf.blurX).toBe(0);
    });

    it("default test case4", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.blurX = true;
        expect(bf.blurX).toBe(1);
    });

    it("default test case5", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.blurX = "";
        expect(bf.blurX).toBe(0);
    });

    it("default test case6", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.blurX = "abc";
        expect(bf.blurX).toBe(0);
    });

    it("default test case7", () =>
    {
        let bf = new BevelFilter();
        bf.blurX = 0;
        expect(bf.blurX).toBe(0);
    });

    it("default test case8", () =>
    {
        let bf = new BevelFilter();
        bf.blurX = 1;
        expect(bf.blurX).toBe(1);
    });

    it("default test case9", () =>
    {
        let bf = new BevelFilter();
        bf.blurX = 500;
        expect(bf.blurX).toBe(255);
    });

    it("default test case10", () =>
    {
        let bf = new BevelFilter();
        bf.blurX = 50000000000000000;
        expect(bf.blurX).toBe(255);
    });

    it("default test case11", () =>
    {
        let bf = new BevelFilter();
        bf.blurX = -1;
        expect(bf.blurX).toBe(0);
    });

    it("default test case12", () =>
    {
        let bf = new BevelFilter();
        bf.blurX = -500;
        expect(bf.blurX).toBe(0);
    });

    it("default test case13", () =>
    {
        let bf = new BevelFilter();
        bf.blurX = -50000000000000000;
        expect(bf.blurX).toBe(0);
    });

    it("default test case14", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.blurX = { "a":0 };
        expect(bf.blurX).toBe(0);
    });

    it("default test case15", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.blurX = function a() {};
        expect(bf.blurX).toBe(0);
    });

    it("default test case16", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.blurX = [1];
        expect(bf.blurX).toBe(1);
    });

    it("default test case17", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.blurX = [1,2];
        expect(bf.blurX).toBe(0);
    });

    it("default test case18", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.blurX = {};
        expect(bf.blurX).toBe(0);
    });

    it("default test case19", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.blurX = { "toString":() => { return 1 } };
        expect(bf.blurX).toBe(1);
    });

    it("default test case20", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.blurX = { "toString":() => { return "1" } };
        expect(bf.blurX).toBe(1);
    });

    it("default test case21", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.blurX = { "toString":() => { return "1a" } };
        expect(bf.blurX).toBe(0);
    });

});

describe("BevelFilter.js distance test", () =>
{

    it("default test case1", () =>
    {
        let bf = new BevelFilter();
        expect(bf.distance).toBe(4);
    });

    it("default test case2", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.distance = null;
        expect(bf.distance).toBe(0);
    });

    it("default test case3", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.distance = undefined;
        expect(bf.distance).toBe(4);
    });

    it("default test case4", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.distance = true;
        expect(bf.distance).toBe(1);
    });

    it("default test case5", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.distance = "";
        expect(bf.distance).toBe(0);
    });

    it("default test case6", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.distance = "abc";
        expect(bf.distance).toBe(4);
    });

    it("default test case7", () =>
    {
        let bf = new BevelFilter();
        bf.distance = 0;
        expect(bf.distance).toBe(0);
    });

    it("default test case8", () =>
    {
        let bf = new BevelFilter();
        bf.distance = 1;
        expect(bf.distance).toBe(1);
    });

    it("default test case9", () =>
    {
        let bf = new BevelFilter();
        bf.distance = 500;
        expect(bf.distance).toBe(255);
    });

    it("default test case10", () =>
    {
        let bf = new BevelFilter();
        bf.distance = 50000000000000000;
        expect(bf.distance).toBe(255);
    });

    it("default test case11", () =>
    {
        let bf = new BevelFilter();
        bf.distance = -1;
        expect(bf.distance).toBe(-1);
    });

    it("default test case12", () =>
    {
        let bf = new BevelFilter();
        bf.distance = -500;
        expect(bf.distance).toBe(-255);
    });

    it("default test case13", () =>
    {
        let bf = new BevelFilter();
        bf.distance = -50000000000000000;
        expect(bf.distance).toBe(-255);
    });

    it("default test case14", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.distance = { "a":0 };
        expect(bf.distance).toBe(4);
    });

    it("default test case15", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.distance = function a() {};
        expect(bf.distance).toBe(4);
    });

    it("default test case16", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.distance = [1];
        expect(bf.distance).toBe(1);
    });

    it("default test case17", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.distance = [1,2];
        expect(bf.distance).toBe(4);
    });

    it("default test case18", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.distance = {};
        expect(bf.distance).toBe(4);
    });

    it("default test case19", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.distance = { "toString":() => { return 1 } };
        expect(bf.distance).toBe(1);
    });

    it("default test case20", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.distance = { "toString":() => { return "1" } };
        expect(bf.distance).toBe(1);
    });

    it("default test case21", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.distance = { "toString":() => { return "1a" } };
        expect(bf.distance).toBe(4);
    });

});

describe("BevelFilter.js highlightAlpha test", () =>
{

    it("default test case1", () =>
    {
        let bf = new BevelFilter();
        expect(bf.highlightAlpha).toBe(1);
    });

    it("default test case2", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.highlightAlpha = null;
        expect(bf.highlightAlpha).toBe(0);
    });

    it("default test case3", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.highlightAlpha = undefined;
        expect(bf.highlightAlpha).toBe(0);
    });

    it("default test case4", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.highlightAlpha = true;
        expect(bf.highlightAlpha).toBe(1);
    });

    it("default test case5", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.highlightAlpha = "";
        expect(bf.highlightAlpha).toBe(0);
    });

    it("default test case6", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.highlightAlpha = "abc";
        expect(bf.highlightAlpha).toBe(0);
    });

    it("default test case7", () =>
    {
        let bf = new BevelFilter();
        bf.highlightAlpha = 0;
        expect(bf.highlightAlpha).toBe(0);
    });

    it("default test case8", () =>
    {
        let bf = new BevelFilter();
        bf.highlightAlpha = 1;
        expect(bf.highlightAlpha).toBe(1);
    });

    it("default test case9", () =>
    {
        let bf = new BevelFilter();
        bf.highlightAlpha = 500;
        expect(bf.highlightAlpha).toBe(1);
    });

    it("default test case10", () =>
    {
        let bf = new BevelFilter();
        bf.highlightAlpha = 50000000000000000;
        expect(bf.highlightAlpha).toBe(1);
    });

    it("default test case11", () =>
    {
        let bf = new BevelFilter();
        bf.highlightAlpha = -1;
        expect(bf.highlightAlpha).toBe(0);
    });

    it("default test case12", () =>
    {
        let bf = new BevelFilter();
        bf.highlightAlpha = -500;
        expect(bf.highlightAlpha).toBe(0);
    });

    it("default test case13", () =>
    {
        let bf = new BevelFilter();
        bf.highlightAlpha = -50000000000000000;
        expect(bf.highlightAlpha).toBe(0);
    });

    it("default test case14", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.highlightAlpha = { "a":0 };
        expect(bf.highlightAlpha).toBe(0);
    });

    it("default test case15", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.highlightAlpha = function a() {};
        expect(bf.highlightAlpha).toBe(0);
    });

    it("default test case16", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.highlightAlpha = [1];
        expect(bf.highlightAlpha).toBe(1);
    });

    it("default test case17", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.highlightAlpha = [1,2];
        expect(bf.highlightAlpha).toBe(0);
    });

    it("default test case18", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.highlightAlpha = {};
        expect(bf.highlightAlpha).toBe(0);
    });

    it("default test case19", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.highlightAlpha = { "toString":() => { return 1 } };
        expect(bf.highlightAlpha).toBe(1);
    });

    it("default test case20", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.highlightAlpha = { "toString":() => { return "1" } };
        expect(bf.highlightAlpha).toBe(1);
    });

    it("default test case21", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.highlightAlpha = { "toString":() => { return "1a" } };
        expect(bf.highlightAlpha).toBe(0);
    });

});

describe("BevelFilter.js highlightColor test", () =>
{

    it("default test case1", () =>
    {
        let bf = new BevelFilter();
        expect(bf.highlightColor).toBe(16777215);
    });

    it("default test case7", () =>
    {
        let bf = new BevelFilter();
        bf.highlightColor = 0;
        expect(bf.highlightColor).toBe(0);
    });

    it("default test case8", () =>
    {
        let bf = new BevelFilter();
        bf.highlightColor = 1;
        expect(bf.highlightColor).toBe(1);
    });

    it("default test case9", () =>
    {
        let bf = new BevelFilter();
        bf.highlightColor = 500;
        expect(bf.highlightColor).toBe(500);
    });

    it("default test case10", () =>
    {
        let bf = new BevelFilter();
        bf.highlightColor = 50000000000000000;
        expect(bf.highlightColor).toBe(0xffffff);
    });

    it("default test case11", () =>
    {
        let bf = new BevelFilter();
        bf.highlightColor = -1;
        expect(bf.highlightColor).toBe(0);
    });

    it("default test case12", () =>
    {
        let bf = new BevelFilter();
        bf.highlightColor = -500;
        expect(bf.highlightColor).toBe(0);
    });

    it("default test case13", () =>
    {
        let bf = new BevelFilter();
        bf.highlightColor = -50000000000000000;
        expect(bf.highlightColor).toBe(0);
    });
});

describe("BevelFilter.js quality test", () =>
{

    it("default test case1", () =>
    {
        let bf = new BevelFilter();
        expect(bf.quality).toBe(1);
    });

    it("default test case2", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.quality = null;
        expect(bf.quality).toBe(0);
    });

    it("default test case3", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.quality = undefined;
        expect(bf.quality).toBe(0);
    });

    it("default test case4", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.quality = true;
        expect(bf.quality).toBe(1);
    });

    it("default test case5", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.quality = "";
        expect(bf.quality).toBe(0);
    });

    it("default test case6", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.quality = "abc";
        expect(bf.quality).toBe(0);
    });

    it("default test case7", () =>
    {
        let bf = new BevelFilter();
        bf.quality = 0;
        expect(bf.quality).toBe(0);
    });

    it("default test case8", () =>
    {
        let bf = new BevelFilter();
        bf.quality = 1;
        expect(bf.quality).toBe(1);
    });

    it("default test case9", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.quality = 500;
        expect(bf.quality).toBe(15);
    });

    it("default test case10", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.quality = 50000000000000000;
        expect(bf.quality).toBe(15);
    });

    it("default test case11", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.quality = -1;
        expect(bf.quality).toBe(0);
    });

    it("default test case12", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.quality = -500;
        expect(bf.quality).toBe(0);
    });

    it("default test case13", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.quality = -50000000000000000;
        expect(bf.quality).toBe(0);
    });

    it("default test case14", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.quality = { "a":0 };
        expect(bf.quality).toBe(0);
    });

    it("default test case15", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.quality = function a() {};
        expect(bf.quality).toBe(0);
    });

    it("default test case16", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.quality = [1];
        expect(bf.quality).toBe(1);
    });

    it("default test case17", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.quality = [1,2];
        expect(bf.quality).toBe(0);
    });

    it("default test case18", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.quality = {};
        expect(bf.quality).toBe(0);
    });

    it("default test case19", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.quality = { "toString":() => { return 1 } };
        expect(bf.quality).toBe(1);
    });

    it("default test case20", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.quality = { "toString":() => { return "1" } };
        expect(bf.quality).toBe(1);
    });

    it("default test case21", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.quality = { "toString":() => { return "1a" } };
        expect(bf.quality).toBe(0);
    });

});

describe("BevelFilter.js shadowAlpha test", () =>
{

    it("default test case1", () =>
    {
        let bf = new BevelFilter();
        expect(bf.shadowAlpha).toBe(1);
    });

    it("default test case2", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.shadowAlpha = null;
        expect(bf.shadowAlpha).toBe(0);
    });

    it("default test case3", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.shadowAlpha = undefined;
        expect(bf.shadowAlpha).toBe(0);
    });

    it("default test case4", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.shadowAlpha = true;
        expect(bf.shadowAlpha).toBe(1);
    });

    it("default test case5", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.shadowAlpha = "";
        expect(bf.shadowAlpha).toBe(0);
    });

    it("default test case6", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.shadowAlpha = "abc";
        expect(bf.shadowAlpha).toBe(0);
    });

    it("default test case7", () =>
    {
        let bf = new BevelFilter();
        bf.shadowAlpha = 0;
        expect(bf.shadowAlpha).toBe(0);
    });

    it("default test case8", () =>
    {
        let bf = new BevelFilter();
        bf.shadowAlpha = 1;
        expect(bf.shadowAlpha).toBe(1);
    });

    it("default test case9", () =>
    {
        let bf = new BevelFilter();
        bf.shadowAlpha = 500;
        expect(bf.shadowAlpha).toBe(1);
    });

    it("default test case10", () =>
    {
        let bf = new BevelFilter();
        bf.shadowAlpha = 50000000000000000;
        expect(bf.shadowAlpha).toBe(1);
    });

    it("default test case11", () =>
    {
        let bf = new BevelFilter();
        bf.shadowAlpha = -1;
        expect(bf.shadowAlpha).toBe(0);
    });

    it("default test case12", () =>
    {
        let bf = new BevelFilter();
        bf.shadowAlpha = -500;
        expect(bf.shadowAlpha).toBe(0);
    });

    it("default test case13", () =>
    {
        let bf = new BevelFilter();
        bf.shadowAlpha = -50000000000000000;
        expect(bf.shadowAlpha).toBe(0);
    });

    it("default test case14", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.shadowAlpha = { "a":0 };
        expect(bf.shadowAlpha).toBe(0);
    });

    it("default test case15", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.shadowAlpha = function a() {};
        expect(bf.shadowAlpha).toBe(0);
    });

    it("default test case16", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.shadowAlpha = [1];
        expect(bf.shadowAlpha).toBe(1);
    });

    it("default test case17", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.shadowAlpha = [1,2];
        expect(bf.shadowAlpha).toBe(0);
    });

    it("default test case18", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.shadowAlpha = {};
        expect(bf.shadowAlpha).toBe(0);
    });

    it("default test case19", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.shadowAlpha = { "toString":() => { return 1 } };
        expect(bf.shadowAlpha).toBe(1);
    });

    it("default test case20", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.shadowAlpha = { "toString":() => { return "1" } };
        expect(bf.shadowAlpha).toBe(1);
    });

    it("default test case21", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.shadowAlpha = { "toString":() => { return "1a" } };
        expect(bf.shadowAlpha).toBe(0);
    });

});

describe("BevelFilter.js shadowColor test", () =>
{

    it("default test case1", () =>
    {
        let bf = new BevelFilter();
        expect(bf.shadowColor).toBe(0);
    });

    it("default test case7", () =>
    {
        let bf = new BevelFilter();
        bf.shadowColor = 0;
        expect(bf.shadowColor).toBe(0);
    });

    it("default test case8", () =>
    {
        let bf = new BevelFilter();
        bf.shadowColor = 1;
        expect(bf.shadowColor).toBe(1);
    });

    it("default test case9", () =>
    {
        let bf = new BevelFilter();
        bf.shadowColor = 500;
        expect(bf.shadowColor).toBe(500);
    });

    it("default test case10", () =>
    {
        let bf = new BevelFilter();
        bf.shadowColor = 50000000000000000;
        expect(bf.shadowColor).toBe(0xffffff);
    });

    it("default test case11", () =>
    {
        let bf = new BevelFilter();
        bf.shadowColor = -1;
        expect(bf.shadowColor).toBe(0);
    });

    it("default test case12", () =>
    {
        let bf = new BevelFilter();
        bf.shadowColor = -500;
        expect(bf.shadowColor).toBe(0);
    });

    it("default test case13", () =>
    {
        let bf = new BevelFilter();
        bf.shadowColor = -50000000000000000;
        expect(bf.shadowColor).toBe(0);
    });
});

describe("BevelFilter.js strength test", () =>
{

    it("default test case1", () =>
    {
        let bf = new BevelFilter();
        expect(bf.strength).toBe(1);
    });

    it("default test case2", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.strength = null;
        expect(bf.strength).toBe(0);
    });

    it("default test case3", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.strength = undefined;
        expect(bf.strength).toBe(0);
    });

    it("default test case4", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.strength = true;
        expect(bf.strength).toBe(1);
    });

    it("default test case5", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.strength = "";
        expect(bf.strength).toBe(0);
    });

    it("default test case6", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.strength = "abc";
        expect(bf.strength).toBe(0);
    });

    it("default test case7", () =>
    {
        let bf = new BevelFilter();
        bf.strength = 0;
        expect(bf.strength).toBe(0);
    });

    it("default test case8", () =>
    {
        let bf = new BevelFilter();
        bf.strength = 1;
        expect(bf.strength).toBe(1);
    });

    it("default test case9", () =>
    {
        let bf = new BevelFilter();
        bf.strength = 500;
        expect(bf.strength).toBe(255);
    });

    it("default test case10", () =>
    {
        let bf = new BevelFilter();
        bf.strength = 50000000000000000;
        expect(bf.strength).toBe(255);
    });

    it("default test case11", () =>
    {
        let bf = new BevelFilter();
        bf.strength = -1;
        expect(bf.strength).toBe(0);
    });

    it("default test case12", () =>
    {
        let bf = new BevelFilter();
        bf.strength = -500;
        expect(bf.strength).toBe(0);
    });

    it("default test case13", () =>
    {
        let bf = new BevelFilter();
        bf.strength = -50000000000000000;
        expect(bf.strength).toBe(0);
    });

    it("default test case14", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.strength = { "a":0 };
        expect(bf.strength).toBe(0);
    });

    it("default test case15", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.strength = function a() {};
        expect(bf.strength).toBe(0);
    });

    it("default test case16", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.strength = [1];
        expect(bf.strength).toBe(1);
    });

    it("default test case17", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.strength = [1,2];
        expect(bf.strength).toBe(0);
    });

    it("default test case18", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.strength = {};
        expect(bf.strength).toBe(0);
    });

    it("default test case19", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.strength = { "toString":() => { return 1 } };
        expect(bf.strength).toBe(1);
    });

    it("default test case20", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.strength = { "toString":() => { return "1" } };
        expect(bf.strength).toBe(1);
    });

    it("default test case21", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.strength = { "toString":() => { return "1a" } };
        expect(bf.strength).toBe(0);
    });

});

describe("BevelFilter.js type test", () =>
{

    it("default test case1", () =>
    {
        let bf = new BevelFilter();
        expect(bf.type).toBe("inner");
    });

    it("default test case2", () =>
    {
        let bf = new BevelFilter();
        bf.type = "full";
        expect(bf.type).toBe("full");
    });
});