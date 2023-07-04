import { GlowFilter } from "../../../packages/filters/src/GlowFilter";

describe("GlowFilter.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new GlowFilter();
        expect(object.namespace).toBe("next2d.filters.GlowFilter");
    });

    it("namespace test static", () =>
    {
        expect(GlowFilter.namespace).toBe("next2d.filters.GlowFilter");
    });

});

describe("GlowFilter.js toString test", () =>
{
    it("toString test success", () =>
    {
        let filter = new GlowFilter();
        expect(filter.toString()).toBe("[object GlowFilter]");
    });

});

describe("GlowFilter.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(GlowFilter.toString()).toBe("[class GlowFilter]");
    });

});

describe("GlowFilter.js property test", () =>
{

    // default
    it("default test success", () =>
    {
        let filter = new GlowFilter();
        expect(filter.color).toBe(0);
        expect(filter.alpha).toBe(1);
        expect(filter.blurX).toBe(4);
        expect(filter.blurY).toBe(4);
        expect(filter.strength).toBe(1);
        expect(filter.quality).toBe(1);
        expect(filter.inner).toBe(false);
        expect(filter.knockout).toBe(false);
    });

    // color
    it("color test success case1", () =>
    {
        let filter = new GlowFilter(0x000000);
        expect(filter.color).toBe(0x000000);
    });

    it("color test success case2", () =>
    {
        let filter = new GlowFilter(0xff0000);
        filter.color = 0x00ff00;
        expect(filter.color).toBe(0x00ff00);
    });

    it("color test valid case3", () =>
    {
        let filter = new GlowFilter(-10);
        expect(filter.color).toBe(0);
    });

    it("color test valid case4", () =>
    {
        let filter = new GlowFilter(16777220);
        expect(filter.color).toBe(0xffffff);
    });

    it("color test valid case5", () =>
    {
        let filter = new GlowFilter(0xffffff);

        filter.color = -10;
        expect(filter.color).toBe(0);

        filter.color = 16777220;
        expect(filter.color).toBe(0xffffff);
    });

    // alpha
    it("alpha test success case1", () =>
    {
        let filter = new GlowFilter(0xff0000, 0);
        expect(filter.alpha).toBe(0);
    });

    it("alpha test success case2", () =>
    {
        let filter = new GlowFilter(0xff0000, 0.5);
        filter.alpha = 0.75;
        expect(filter.alpha).toBe(0.75);
    });

    it("alpha test valid case1", () =>
    {
        // @ts-ignore
        let filter = new GlowFilter(0xff0000, "0.25");
        expect(filter.alpha).toBe(0.25);
    });

    it("alpha test valid case2", () =>
    {
        let filter = new GlowFilter(0xff0000, -10);
        expect(filter.alpha).toBe(0);
    });

    it("alpha test valid case3", () =>
    {
        let filter = new GlowFilter(0xff0000, 10);
        expect(filter.alpha).toBe(1);
    });

    it("alpha test valid case4", () =>
    {
        let filter = new GlowFilter(0xffffff, 1);

        filter.alpha = -10;
        expect(filter.alpha).toBe(0);

        filter.alpha = 16777220;
        expect(filter.alpha).toBe(1);
    });

    // strength
    it("strength test success case1", () =>
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 100, 0);
        expect(filter.strength).toBe(0);
    });

    it("strength test success case2", () =>
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 100, 10);
        filter.strength = 2;
        expect(filter.strength).toBe(2);
    });

    it("strength test valid case1", () =>
    {
        // @ts-ignore
        let filter = new GlowFilter(0xffffff, 1, 10, 100, "9");
        expect(filter.strength).toBe(9);
    });

    it("strength test valid case2", () =>
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 2);
        // @ts-ignore
        filter.strength = "9";
        expect(filter.strength).toBe(9);
    });

    it("strength test valid case3", () =>
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, -1);
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case4", () =>
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 2);
        filter.strength = -10;
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case5", () =>
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 1000);
        expect(filter.strength).toBe(255);
    });

    it("strength test valid case6", () =>
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 2);
        filter.strength = 1000;
        expect(filter.strength).toBe(255);
    });

    it("strength test valid case7", () =>
    {
        // @ts-ignore
        let filter = new GlowFilter(0xffffff, 1, 10, 10, "test");
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case8", () =>
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3);
        // @ts-ignore
        filter.strength = "abc";
        expect(filter.strength).toBe(0);
    });

    // inner
    it("inner test success case1", () =>
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, true);
        expect(filter.inner).toBe(true);
    });

    it("inner test success case2", () =>
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, true);
        filter.inner = false;
        expect(filter.inner).toBe(false);
    });

    it("inner test valid case1", () =>
    {
        // @ts-ignore
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, 1);
        expect(filter.inner).toBe(true);
    });

    it("inner test valid case2", () =>
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, false);
        // @ts-ignore
        filter.inner = 1;
        expect(filter.inner).toBe(true);
    });

    it("inner test valid case3", () =>
    {
        // @ts-ignore
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, 0);
        expect(filter.inner).toBe(false);
    });

    it("inner test valid case4", () =>
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, true);
        // @ts-ignore
        filter.inner = 0;
        expect(filter.inner).toBe(false);
    });

    // knockout
    it("knockout test success case1", () =>
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, false, true);
        expect(filter.knockout).toBe(true);
    });

    it("knockout test success case2", () =>
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, false, true);
        filter.knockout = false;
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case1", () =>
    {
        // @ts-ignore
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, false, 1);
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case2", () =>
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, false, false);
        // @ts-ignore
        filter.knockout = 1;
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case3", () =>
    {
        // @ts-ignore
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, false, 0);
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case4", () =>
    {
        let filter = new GlowFilter(0xffffff, 1, 10, 10, 3, 5, false, true);
        // @ts-ignore
        filter.knockout = 0;
        expect(filter.knockout).toBe(false);
    });

});

describe("GlowFilter.js clone test", () =>
{

    it("clone test", () =>
    {
        let filter = new GlowFilter(
            0x000000, 0.2, 10, 20, 6,
            2, true, true
        );
        let clone  = filter.clone();

        // clone check
        expect(clone.color).toBe(0x000000);
        expect(clone.alpha).toBe(0.2);
        expect(clone.blurX).toBe(10);
        expect(clone.blurY).toBe(20);
        expect(clone.strength).toBe(6);
        expect(clone.quality).toBe(2);
        expect(clone.inner).toBe(true);
        expect(clone.knockout).toBe(true);

        // edit param
        clone.color    = 0xffffff;
        clone.alpha    = 1;
        clone.blurX    = 9;
        clone.blurY    = 19;
        clone.strength = 4;
        clone.quality  = 3;
        clone.inner    = false;
        clone.knockout = false;

        // origin
        expect(filter.color).toBe(0x000000);
        expect(filter.alpha).toBe(0.2);
        expect(filter.blurX).toBe(10);
        expect(filter.blurY).toBe(20);
        expect(filter.strength).toBe(6);
        expect(filter.quality).toBe(2);
        expect(filter.inner).toBe(true);
        expect(filter.knockout).toBe(true);

        // clone
        expect(clone.color).toBe(0xffffff);
        expect(clone.alpha).toBe(1);
        expect(clone.blurX).toBe(9);
        expect(clone.blurY).toBe(19);
        expect(clone.strength).toBe(4);
        expect(clone.quality).toBe(3);
        expect(clone.inner).toBe(false);
        expect(clone.knockout).toBe(false);

    });

});

describe("GlowFilter.js alpha test", () =>
{

    it("default test case1", () =>
    {
        let gf = new GlowFilter();
        expect(gf.alpha).toBe(1);
    });

    it("default test case4", () =>
    {
        let gf = new GlowFilter();
        // @ts-ignore
        gf.alpha = true;
        expect(gf.alpha).toBe(1);
    });

    it("default test case5", () =>
    {
        let gf = new GlowFilter();
        // @ts-ignore
        gf.alpha = "";
        expect(gf.alpha).toBe(0);
    });

    it("default test case7", () =>
    {
        let gf = new GlowFilter();
        gf.alpha = 0;
        expect(gf.alpha).toBe(0);
    });

    it("default test case8", () =>
    {
        let gf = new GlowFilter();
        gf.alpha = 1;
        expect(gf.alpha).toBe(1);
    });

    it("default test case9", () =>
    {
        let gf = new GlowFilter();
        gf.alpha = 500;
        expect(gf.alpha).toBe(1);
    });

    it("default test case10", () =>
    {
        let gf = new GlowFilter();
        gf.alpha = 50000000000000000;
        expect(gf.alpha).toBe(1);
    });

    it("default test case11", () =>
    {
        let gf = new GlowFilter();
        gf.alpha = -1;
        expect(gf.alpha).toBe(0);
    });

    it("default test case12", () =>
    {
        let gf = new GlowFilter();
        gf.alpha = -500;
        expect(gf.alpha).toBe(0);
    });

    it("default test case13", () =>
    {
        let gf = new GlowFilter();
        gf.alpha = -50000000000000000;
        expect(gf.alpha).toBe(0);
    });

});

describe("GlowFilter.js color test", () =>
{

    it("default test case1", () =>
    {
        let gf = new GlowFilter();
        expect(gf.color).toBe(0);
    });

    it("default test case7", () =>
    {
        let gf = new GlowFilter();
        gf.color = 0;
        expect(gf.color).toBe(0);
    });

    it("default test case8", () =>
    {
        let gf = new GlowFilter();
        gf.color = 1;
        expect(gf.color).toBe(1);
    });

    it("default test case9", () =>
    {
        let gf = new GlowFilter();
        gf.color = 500;
        expect(gf.color).toBe(500);
    });

    it("default test case10", () =>
    {
        let gf = new GlowFilter();
        gf.color = 50000000000000000;
        expect(gf.color).toBe(0xffffff);
    });

    it("default test case11", () =>
    {
        let gf = new GlowFilter();
        gf.color = -1;
        expect(gf.color).toBe(0);
    });

    it("default test case12", () =>
    {
        let gf = new GlowFilter();
        gf.color = -500;
        expect(gf.color).toBe(0);
    });

    it("default test case13", () =>
    {
        let gf = new GlowFilter();
        gf.color = -50000000000000000;
        expect(gf.color).toBe(0);
    });

});

describe("GlowFilter.js inner test", () =>
{

    it("default test case1", () =>
    {
        let gf = new GlowFilter();
        expect(gf.inner).toBe(false);
    });

    it("default test case4", () =>
    {
        let gf = new GlowFilter();
        gf.inner = true;
        expect(gf.inner).toBe(true);
    });

    it("default test case5", () =>
    {
        let gf = new GlowFilter();
        // @ts-ignore
        gf.inner = "";
        expect(gf.inner).toBe(false);
    });

    it("default test case7", () =>
    {
        let gf = new GlowFilter();
        // @ts-ignore
        gf.inner = 0;
        expect(gf.inner).toBe(false);
    });

    it("default test case8", () =>
    {
        let gf = new GlowFilter();
        // @ts-ignore
        gf.inner = 1;
        expect(gf.inner).toBe(true);
    });

});

describe("GlowFilter.js knockout test", () =>
{

    it("default test case1", () =>
    {
        let gf = new GlowFilter();
        expect(gf.knockout).toBe(false);
    });

    it("default test case4", () =>
    {
        let gf = new GlowFilter();
        gf.knockout = true;
        expect(gf.knockout).toBe(true);
    });

    it("default test case5", () =>
    {
        let gf = new GlowFilter();
        // @ts-ignore
        gf.knockout = "";
        expect(gf.knockout).toBe(false);
    });

    it("default test case7", () =>
    {
        let gf = new GlowFilter();
        // @ts-ignore
        gf.knockout = 0;
        expect(gf.knockout).toBe(false);
    });

    it("default test case8", () =>
    {
        let gf = new GlowFilter();
        // @ts-ignore
        gf.knockout = 1;
        expect(gf.knockout).toBe(true);
    });

});

describe("GlowFilter.js strength test", () =>
{

    it("default test case1", () =>
    {
        let gf = new GlowFilter();
        expect(gf.strength).toBe(1);
    });

    it("default test case7", () =>
    {
        let gf = new GlowFilter();
        gf.strength = 0;
        expect(gf.strength).toBe(0);
    });

    it("default test case8", () =>
    {
        let gf = new GlowFilter();
        gf.strength = 1;
        expect(gf.strength).toBe(1);
    });

    it("default test case9", () =>
    {
        let gf = new GlowFilter();
        gf.strength = 500;
        expect(gf.strength).toBe(255);
    });

    it("default test case10", () =>
    {
        let gf = new GlowFilter();
        gf.strength = 50000000000000000;
        expect(gf.strength).toBe(255);
    });

    it("default test case11", () =>
    {
        let gf = new GlowFilter();
        gf.strength = -1;
        expect(gf.strength).toBe(0);
    });

    it("default test case12", () =>
    {
        let gf = new GlowFilter();
        gf.strength = -500;
        expect(gf.strength).toBe(0);
    });

    it("default test case13", () =>
    {
        let gf = new GlowFilter();
        gf.strength = -50000000000000000;
        expect(gf.strength).toBe(0);
    });

});