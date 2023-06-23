import { DropShadowFilter } from "../../../src/next2d/filters/DropShadowFilter";

describe("DropShadowFilter.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new DropShadowFilter();
        expect(object.namespace).toBe("next2d.filters.DropShadowFilter");
    });

    it("namespace test static", () =>
    {
        expect(DropShadowFilter.namespace).toBe("next2d.filters.DropShadowFilter");
    });

});

describe("DropShadowFilter.js toString test", () =>
{
    it("toString test success", () =>
    {
        let filter = new DropShadowFilter();
        expect(filter.toString()).toBe("[object DropShadowFilter]");
    });

});

describe("DropShadowFilter.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(DropShadowFilter.toString()).toBe("[class DropShadowFilter]");
    });

});

describe("DropShadowFilter.js property test", () =>
{

    // default
    it("default test success", () =>
    {
        let filter = new DropShadowFilter();
        expect(filter.distance).toBe(4);
        expect(filter.angle).toBe(45);
        expect(filter.color).toBe(0);
        expect(filter.alpha).toBe(1);
        expect(filter.blurX).toBe(4);
        expect(filter.blurY).toBe(4);
        expect(filter.strength).toBe(1);
        expect(filter.quality).toBe(1);
        expect(filter.inner).toBe(false);
        expect(filter.knockout).toBe(false);
        expect(filter.hideObject).toBe(false);
    });

    // distance
    it("distance test success case1", () =>
    {
        let filter = new DropShadowFilter(0);
        expect(filter.distance).toBe(0);
    });

    it("distance test success case2", () =>
    {
        let filter = new DropShadowFilter(10.5);
        filter.distance = -12.6;
        expect(filter.distance).toBe(-12.6);
    });

    it("distance test valid case1", () =>
    {
        // @ts-ignore
        let filter = new DropShadowFilter("23");
        expect(filter.distance).toBe(23);
    });

    it("distance test valid case2", () =>
    {
        let filter = new DropShadowFilter(1000);
        expect(filter.distance).toBe(255);
    });

    it("distance test valid case3", () =>
    {
        let filter = new DropShadowFilter(-1000);
        expect(filter.distance).toBe(-255);
    });

    it("distance test valid case4", () =>
    {
        let filter = new DropShadowFilter(10);
        // @ts-ignore
        filter.distance = "-56";
        expect(filter.distance).toBe(-56);
    });

    it("distance test valid case5", () =>
    {
        let filter = new DropShadowFilter(10);
        filter.distance = 400;
        expect(filter.distance).toBe(255);
    });

    it("distance test valid case6", () =>
    {
        let filter = new DropShadowFilter(10);
        filter.distance = -400;
        expect(filter.distance).toBe(-255);
    });

    it("distance test valid case7", () =>
    {
        // @ts-ignore
        let filter = new DropShadowFilter("test");
        expect(filter.distance).toBe(4);
    });

    it("distance test valid case8", () =>
    {
        let filter = new DropShadowFilter(10);
        // @ts-ignore
        filter.distance = "abc";
        expect(filter.distance).toBe(4);
    });

    // angle
    it("angle test success case1", () =>
    {
        let filter = new DropShadowFilter(10.5, 0);
        expect(filter.angle).toBe(0);
    });

    it("angle test success case2", () =>
    {
        let filter = new DropShadowFilter(10.5, 90);
        filter.angle = 180;
        expect(filter.angle).toBe(180);
    });

    it("angle test valid case1", () =>
    {
        // @ts-ignore
        let filter = new DropShadowFilter(10.5, "20");
        expect(filter.angle).toBe(20);
    });

    it("angle test valid case2", () =>
    {
        let filter = new DropShadowFilter(10.5, 20);
        // @ts-ignore
        filter.angle = "180";
        expect(filter.angle).toBe(180);
    });

    it("angle test valid case3", () =>
    {
        let filter = new DropShadowFilter(10.5, 20);
        filter.angle = 4500;
        expect(filter.angle).toBe(180);
    });

    it("angle test valid case4", () =>
    {
        let filter = new DropShadowFilter(10.5, 20);
        filter.angle = -4500;
        expect(filter.angle).toBe(-180);
    });

    it("angle test valid case5", () =>
    {
        // @ts-ignore
        let filter = new DropShadowFilter(10.5, "test");
        expect(filter.angle).toBe(45);
    });

    it("angle test valid case6", () =>
    {
        let filter = new DropShadowFilter(10.5, 20);
        // @ts-ignore
        filter.angle = "abc";
        expect(filter.angle).toBe(45);
    });

    // color
    it("color test success case1", () =>
    {
        let filter = new DropShadowFilter(10.5, 20, 0);
        expect(filter.color).toBe(0);
    });

    it("color test success case2", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xff0000);
        filter.color = 0x00ff00;
        expect(filter.color).toBe(0x00ff00);
    });

    it("color test valid case3", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, -10);
        expect(filter.color).toBe(0);
    });

    it("color test valid case4", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 16777220);
        expect(filter.color).toBe(0xffffff);
    });

    it("color test valid case5", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff);

        filter.color = -10;
        expect(filter.color).toBe(0);

        filter.color = 16777220;
        expect(filter.color).toBe(0xffffff);
    });

    // alpha
    it("alpha test success case1", () =>
    {
        let filter = new DropShadowFilter(10.5, 20, 0xff0000, 0);
        expect(filter.alpha).toBe(0);
    });

    it("alpha test success case2", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xff0000, 0.5);
        filter.alpha = 0.75;
        expect(filter.alpha).toBe(0.75);
    });

    it("alpha test valid case1", () =>
    {
        // @ts-ignore
        let filter = new DropShadowFilter(10.5, 90, 0xff0000, "0.25");
        expect(filter.alpha).toBe(0.25);
    });

    it("alpha test valid case2", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xff0000, -10);
        expect(filter.alpha).toBe(0);
    });

    it("alpha test valid case3", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xff0000, 10);
        expect(filter.alpha).toBe(1);
    });

    it("alpha test valid case4", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1);

        filter.alpha = -10;
        expect(filter.alpha).toBe(0);

        filter.alpha = 16777220;
        expect(filter.alpha).toBe(1);
    });

    // strength
    it("strength test success case1", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 100, 0);
        expect(filter.strength).toBe(0);
    });

    it("strength test success case2", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 100, 10);
        filter.strength = 2;
        expect(filter.strength).toBe(2);
    });

    it("strength test valid case1", () =>
    {
        // @ts-ignore
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 100, "9");
        expect(filter.strength).toBe(9);
    });

    it("strength test valid case2", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 2);
        // @ts-ignore
        filter.strength = "9";
        expect(filter.strength).toBe(9);
    });

    it("strength test valid case3", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, -1);
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case4", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 2);
        filter.strength = -10;
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case5", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 1000);
        expect(filter.strength).toBe(255);
    });

    it("strength test valid case6", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 2);
        filter.strength = 1000;
        expect(filter.strength).toBe(255);
    });

    it("strength test valid case7", () =>
    {
        // @ts-ignore
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, "test");
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case8", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3);
        // @ts-ignore
        filter.strength = "abc";
        expect(filter.strength).toBe(0);
    });

    // inner
    it("inner test success case1", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, true);
        expect(filter.inner).toBe(true);
    });

    it("inner test success case2", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, true);
        filter.inner = false;
        expect(filter.inner).toBe(false);
    });

    it("inner test valid case1", () =>
    {
        // @ts-ignore
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, 1);
        expect(filter.inner).toBe(true);
    });

    it("inner test valid case2", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false);
        // @ts-ignore
        filter.inner = 1;
        expect(filter.inner).toBe(true);
    });

    it("inner test valid case3", () =>
    {
        // @ts-ignore
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, 0);
        expect(filter.inner).toBe(false);
    });

    it("inner test valid case4", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, true);
        // @ts-ignore
        filter.inner = 0;
        expect(filter.inner).toBe(false);
    });

    it("inner test valid case5", () =>
    {
        // @ts-ignore
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, "test");
        expect(filter.inner).toBe(true);
    });

    it("inner test valid case6", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, true);
        // @ts-ignore
        filter.inner = "";
        expect(filter.inner).toBe(false);
    });

    // knockout
    it("knockout test success case1", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, true);
        expect(filter.knockout).toBe(true);
    });

    it("knockout test success case2", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, true);
        filter.knockout = false;
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case1", () =>
    {
        // @ts-ignore
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, 1);
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case2", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false);
        // @ts-ignore
        filter.knockout = 1;
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case3", () =>
    {
        // @ts-ignore
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, 0);
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case4", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, true);
        // @ts-ignore
        filter.knockout = 0;
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case5", () =>
    {
        // @ts-ignore
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, "test");
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case6", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, true);
        // @ts-ignore
        filter.knockout = "";
        expect(filter.knockout).toBe(false);
    });

    // hideObject
    it("hideObject test success case1", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false, true);
        expect(filter.hideObject).toBe(true);
    });

    it("hideObject test success case2", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false, true);
        filter.hideObject = false;
        expect(filter.hideObject).toBe(false);
    });

    it("hideObject test valid case1", () =>
    {
        // @ts-ignore
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false, 1);
        expect(filter.hideObject).toBe(true);
    });

    it("hideObject test valid case2", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false, false);
        // @ts-ignore
        filter.hideObject = 1;
        expect(filter.hideObject).toBe(true);
    });

    it("hideObject test valid case3", () =>
    {
        // @ts-ignore
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false, 0);
        expect(filter.hideObject).toBe(false);
    });

    it("hideObject test valid case4", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false, true);
        // @ts-ignore
        filter.hideObject = 0;
        expect(filter.hideObject).toBe(false);
    });

    it("hideObject test valid case5", () =>
    {
        // @ts-ignore
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false, "test");
        expect(filter.hideObject).toBe(true);
    });

    it("hideObject test valid case6", () =>
    {
        let filter = new DropShadowFilter(10.5, 90, 0xffffff, 1, 10, 10, 3, 5, false, false, true);
        // @ts-ignore
        filter.hideObject = "";
        expect(filter.hideObject).toBe(false);
    });
});

describe("DropShadowFilter.js clone test", () =>
{

    it("clone test", () =>
    {
        let filter = new DropShadowFilter(
            1, 90, 0xff0000, 0.3,
            10, 20, 2, 3,
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
        expect(clone.quality).toBe(3);
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
        clone.quality    = 2;
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
        expect(filter.quality).toBe(3);
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
        expect(clone.quality).toBe(2);
        expect(clone.inner).toBe(false);
        expect(clone.knockout).toBe(false);
        expect(clone.hideObject).toBe(false);

    });

});

describe("DropShadowFilter.js hideObject test", () =>
{

    it("default test case1", () =>
    {
        let dsf = new DropShadowFilter();
        expect(dsf.hideObject).toBe(false);
    });

    it("default test case4", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.hideObject = true;
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case5", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.hideObject = "";
        expect(dsf.hideObject).toBe(false);
    });

    it("default test case6", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.hideObject = "abc";
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case7", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.hideObject = 0;
        expect(dsf.hideObject).toBe(false);
    });

    it("default test case8", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.hideObject = 1;
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case9", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.hideObject = 500;
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case10", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.hideObject = 50000000000000000;
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case11", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.hideObject = -1;
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case12", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.hideObject = -500;
        expect(dsf.hideObject).toBe(true);
    });

    it("default test case13", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.hideObject = -50000000000000000;
        expect(dsf.hideObject).toBe(true);
    });
});

describe("DropShadowFilter.js inner test", () =>
{

    it("default test case1", () =>
    {
        let dsf = new DropShadowFilter();
        expect(dsf.inner).toBe(false);
    });

    it("default test case4", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.inner = true;
        expect(dsf.inner).toBe(true);
    });

    it("default test case5", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.inner = "";
        expect(dsf.inner).toBe(false);
    });

    it("default test case6", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.inner = "abc";
        expect(dsf.inner).toBe(true);
    });

    it("default test case7", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.inner = 0;
        expect(dsf.inner).toBe(false);
    });

    it("default test case8", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.inner = 1;
        expect(dsf.inner).toBe(true);
    });

    it("default test case9", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.inner = 500;
        expect(dsf.inner).toBe(true);
    });

    it("default test case10", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.inner = 50000000000000000;
        expect(dsf.inner).toBe(true);
    });

    it("default test case11", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.inner = -1;
        expect(dsf.inner).toBe(true);
    });

    it("default test case12", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.inner = -500;
        expect(dsf.inner).toBe(true);
    });

    it("default test case13", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.inner = -50000000000000000;
        expect(dsf.inner).toBe(true);
    });
});

describe("DropShadowFilter.js knockout test", () =>
{

    it("default test case1", () =>
    {
        let dsf = new DropShadowFilter();
        expect(dsf.knockout).toBe(false);
    });

    it("default test case4", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.knockout = true;
        expect(dsf.knockout).toBe(true);
    });

    it("default test case5", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.knockout = "";
        expect(dsf.knockout).toBe(false);
    });

    it("default test case6", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.knockout = "abc";
        expect(dsf.knockout).toBe(true);
    });

    it("default test case7", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.knockout = 0;
        expect(dsf.knockout).toBe(false);
    });

    it("default test case8", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.knockout = 1;
        expect(dsf.knockout).toBe(true);
    });
});

describe("DropShadowFilter.js alpha test", () =>
{

    it("default test case1", () =>
    {
        let dsf = new DropShadowFilter();
        expect(dsf.alpha).toBe(1);
    });

    it("default test case4", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.alpha = true;
        expect(dsf.alpha).toBe(1);
    });

    it("default test case5", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.alpha = "";
        expect(dsf.alpha).toBe(0);
    });

    it("default test case6", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.alpha = "abc";
        expect(dsf.alpha).toBe(0);
    });

    it("default test case7", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = 0;
        expect(dsf.alpha).toBe(0);
    });

    it("default test case8", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = 1;
        expect(dsf.alpha).toBe(1);
    });

    it("default test case9", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = 500;
        expect(dsf.alpha).toBe(1);
    });

    it("default test case10", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = 50000000000000000;
        expect(dsf.alpha).toBe(1);
    });

    it("default test case11", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = -1;
        expect(dsf.alpha).toBe(0);
    });

    it("default test case12", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = -500;
        expect(dsf.alpha).toBe(0);
    });

    it("default test case13", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.alpha = -50000000000000000;
        expect(dsf.alpha).toBe(0);
    });

});

describe("DropShadowFilter.js angle test", () =>
{

    it("default test case1", () =>
    {
        let dsf = new DropShadowFilter();
        expect(dsf.angle).toBe(45);
    });

    it("default test case4", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.angle = true;
        expect(dsf.angle).toBe(1);
    });

    it("default test case5", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.angle = "";
        expect(dsf.angle).toBe(0);
    });

    it("default test case6", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.angle = "abc";
        expect(dsf.angle).toBe(45);
    });

    it("default test case7", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.angle = 0;
        expect(dsf.angle).toBe(0);
    });

    it("default test case8", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.angle = 1;
        expect(dsf.angle).toBe(1);
    });

    it("default test case9", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.angle = 500;
        expect(dsf.angle).toBe(140);
    });

    it("default test case10", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.angle = 50000000000000000;
        expect(dsf.angle).toBe(320);
    });

    it("default test case11", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.angle = -1;
        expect(dsf.angle).toBe(-1);
    });

    it("default test case12", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.angle = -500;
        expect(dsf.angle).toBe(-140);
    });

    it("default test case13", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.angle = -50000000000000000;
        expect(dsf.angle).toBe(-320);
    });

});

describe("DropShadowFilter.js color test", () =>
{

    it("default test case1", () =>
    {
        let dsf = new DropShadowFilter();
        expect(dsf.color).toBe(0);
    });

    it("default test case4", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.color = true;
        expect(dsf.color).toBe(1);
    });

    it("default test case5", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.color = "";
        expect(dsf.color).toBe(0);
    });

    it("default test case7", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.color = 0;
        expect(dsf.color).toBe(0);
    });

    it("default test case8", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.color = 1;
        expect(dsf.color).toBe(1);
    });

    it("default test case9", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.color = 500;
        expect(dsf.color).toBe(500);
    });

    it("default test case10", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.color = 50000000000000000;
        expect(dsf.color).toBe(0xffffff);
    });

    it("default test case11", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.color = -1;
        expect(dsf.color).toBe(0);
    });

    it("default test case12", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.color = -500;
        expect(dsf.color).toBe(0);
    });

    it("default test case13", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.color = -50000000000000000;
        expect(dsf.color).toBe(0);
    });

});

describe("DropShadowFilter.js distance test", () =>
{

    it("default test case1", () =>
    {
        let dsf = new DropShadowFilter();
        expect(dsf.distance).toBe(4);
    });

    it("default test case4", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.distance = true;
        expect(dsf.distance).toBe(1);
    });

    it("default test case5", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.distance = "";
        expect(dsf.distance).toBe(0);
    });

    it("default test case6", () =>
    {
        let dsf = new DropShadowFilter();
        // @ts-ignore
        dsf.distance = "abc";
        expect(dsf.distance).toBe(4);
    });

    it("default test case7", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.distance = 0;
        expect(dsf.distance).toBe(0);
    });

    it("default test case8", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.distance = 1;
        expect(dsf.distance).toBe(1);
    });

    it("default test case9", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.distance = 500;
        expect(dsf.distance).toBe(255);
    });

    it("default test case10", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.distance = 50000000000000000;
        expect(dsf.distance).toBe(255);
    });

    it("default test case11", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.distance = -1;
        expect(dsf.distance).toBe(-1);
    });

    it("default test case12", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.distance = -500;
        expect(dsf.distance).toBe(-255);
    });

    it("default test case13", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.distance = -50000000000000000;
        expect(dsf.distance).toBe(-255);
    });
});

describe("DropShadowFilter.js strength test", () =>
{

    it("default test case1", () =>
    {
        let dsf = new DropShadowFilter();
        expect(dsf.strength).toBe(1);
    });

    it("default test case7", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.strength = 0;
        expect(dsf.strength).toBe(0);
    });

    it("default test case8", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.strength = 1;
        expect(dsf.strength).toBe(1);
    });

    it("default test case9", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.strength = 500;
        expect(dsf.strength).toBe(255);
    });

    it("default test case10", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.strength = 50000000000000000;
        expect(dsf.strength).toBe(255);
    });

    it("default test case11", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.strength = -1;
        expect(dsf.strength).toBe(0);
    });

    it("default test case12", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.strength = -500;
        expect(dsf.strength).toBe(0);
    });

    it("default test case13", () =>
    {
        let dsf = new DropShadowFilter();
        dsf.strength = -50000000000000000;
        expect(dsf.strength).toBe(0);
    });

});