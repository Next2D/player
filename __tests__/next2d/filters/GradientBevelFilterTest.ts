import { GradientBevelFilter } from "../../../packages/filters/src/GradientBevelFilter";

describe("GradientBevelFilter.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new GradientBevelFilter();
        expect(object.namespace).toBe("next2d.filters.GradientBevelFilter");
    });

    it("namespace test static", () =>
    {
        expect(GradientBevelFilter.namespace).toBe("next2d.filters.GradientBevelFilter");
    });

});

describe("GradientBevelFilter.js toString test", () =>
{
    it("toString test success", () =>
    {
        let filter = new GradientBevelFilter();
        expect(filter.toString()).toBe("[object GradientBevelFilter]");
    });

});

describe("GradientBevelFilter.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(GradientBevelFilter.toString()).toBe("[class GradientBevelFilter]");
    });

});

describe("GradientBevelFilter.js property test", () =>
{

    // default
    it("default test success", () =>
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
        expect(filter.quality).toBe(1);
        expect(filter.type).toBe("inner");
        expect(filter.knockout).toBe(false);
    });

    // distance
    it("distance test success case1", () =>
    {
        let filter = new GradientBevelFilter(0);
        expect(filter.distance).toBe(0);
    });

    it("distance test success case2", () =>
    {
        let filter = new GradientBevelFilter(10.5);
        filter.distance = -12.6;
        expect(filter.distance).toBe(-12.6);
    });

    it("distance test valid case1", () =>
    {
        // @ts-ignore
        let filter = new GradientBevelFilter("23");
        expect(filter.distance).toBe(23);
    });

    it("distance test valid case2", () =>
    {
        let filter = new GradientBevelFilter(1000);
        expect(filter.distance).toBe(255);
    });

    it("distance test valid case3", () =>
    {
        let filter = new GradientBevelFilter(-1000);
        expect(filter.distance).toBe(-255);
    });

    it("distance test valid case4", () =>
    {
        let filter = new GradientBevelFilter(10);
        // @ts-ignore
        filter.distance = "-56";
        expect(filter.distance).toBe(-56);
    });

    it("distance test valid case5", () =>
    {
        let filter = new GradientBevelFilter(10);
        filter.distance = 400;
        expect(filter.distance).toBe(255);
    });

    it("distance test valid case6", () =>
    {
        let filter = new GradientBevelFilter(10);
        filter.distance = -400;
        expect(filter.distance).toBe(-255);
    });

    // angle
    it("angle test success case1", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0);
        expect(filter.angle).toBe(0);
    });

    it("angle test success case2", () =>
    {
        let filter = new GradientBevelFilter(10.5, 90);
        filter.angle = 180;
        expect(filter.angle).toBe(180);
    });

    it("angle test valid case1", () =>
    {
        // @ts-ignore
        let filter = new GradientBevelFilter(10.5, "20");
        expect(filter.angle).toBe(20);
    });

    it("angle test valid case2", () =>
    {
        let filter = new GradientBevelFilter(10.5, 20);
        // @ts-ignore
        filter.angle = "180";
        expect(filter.angle).toBe(180);
    });

    it("angle test valid case3", () =>
    {
        let filter = new GradientBevelFilter(10.5, 20);
        filter.angle = 4500;
        expect(filter.angle).toBe(180);
    });

    it("angle test valid case4", () =>
    {
        let filter = new GradientBevelFilter(10.5, 20);
        filter.angle = -4500;
        expect(filter.angle).toBe(-180);
    });

    // colors
    it("colors test success case1", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255]);
        if (!filter.colors) {
            throw new Error("colors");
        }
        expect(filter.colors[0]).toBe(0xffffff);
        expect(filter.colors[1]).toBe(0xff00ff);
    });

    it("colors test valid case1", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [16777216, -1], [1, 1], [0, 255]);
        if (!filter.colors) {
            throw new Error("colors");
        }
        expect(filter.colors[0]).toBe(0xffffff);
        expect(filter.colors[1]).toBe(0x000000);
    });

    // alphas
    it("alphas test success case1", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 0.5], [0, 255]);
        if (!filter.alphas) {
            throw new Error("alphas");
        }
        expect(filter.alphas[0]).toBe(1);
        expect(filter.alphas[1]).toBe(0.5);
    });

    it("alphas test valid case1", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [2, -1], [0, 255]);
        if (!filter.alphas) {
            throw new Error("ratios");
        }
        expect(filter.alphas[0]).toBe(1);
        expect(filter.alphas[1]).toBe(0);
    });

    // ratios
    it("ratios test success case1", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255]);
        if (!filter.ratios) {
            throw new Error("ratios");
        }
        expect(filter.ratios[0]).toBe(0);
        expect(filter.ratios[1]).toBe(255);
    });

    it("ratios test valid case1", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [-1, 256]);
        if (!filter.ratios) {
            throw new Error("ratios");
        }
        expect(filter.ratios[0]).toBe(0);
        expect(filter.ratios[1]).toBe(255);
    });

    // strength
    it("strength test success case1", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 0);
        expect(filter.strength).toBe(0);
    });

    it("strength test success case2", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 10);
        filter.strength = 2;
        expect(filter.strength).toBe(2);
    });

    it("strength test valid case1", () =>
    {
        // @ts-ignore
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, "9");
        expect(filter.strength).toBe(9);
    });

    it("strength test valid case2", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 2);
        // @ts-ignore
        filter.strength = "9";
        expect(filter.strength).toBe(9);
    });

    it("strength test valid case3", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, -1);
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case4", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 2);
        filter.strength = -10;
        expect(filter.strength).toBe(0);
    });

    it("strength test valid case5", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 1000);
        expect(filter.strength).toBe(255);
    });

    it("strength test valid case6", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 2);
        filter.strength = 1000;
        expect(filter.strength).toBe(255);
    });

    // type
    it("type test success case1", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, "inner");
        expect(filter.type).toBe("inner");
    });

    it("type test success case1", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, "outer");
        expect(filter.type).toBe("outer");
    });

    it("type test success case3", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, "full");
        expect(filter.type).toBe("full");
    });

    it("type test success case4", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, "inner");
        filter.type = "outer";
        expect(filter.type).toBe("outer");
    });

    it("type test valid case1", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, "full");
        expect(filter.type).toBe("full");
    });

    it("type test valid case2", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, "full");
        filter.type = "inner";
        expect(filter.type).toBe("inner");
    });

    // knockout
    it("knockout test success case1", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, "full", true);
        expect(filter.knockout).toBe(true);
    });

    it("knockout test success case2", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, "full", true);
        filter.knockout = false;
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case1", () =>
    {
        // @ts-ignore
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, "full", 1);
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case2", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, "full", false);
        // @ts-ignore
        filter.knockout = 1;
        expect(filter.knockout).toBe(true);
    });

    it("knockout test valid case3", () =>
    {
        // @ts-ignore
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, "full", 0);
        expect(filter.knockout).toBe(false);
    });

    it("knockout test valid case4", () =>
    {
        let filter = new GradientBevelFilter(10.5, 0, [0xffffff, 0xff00ff], [1, 1], [0, 255], 10, 10, 3, 10, "full", true);
        // @ts-ignore
        filter.knockout = 0;
        expect(filter.knockout).toBe(false);
    });

});

describe("GradientBevelFilter.js clone test", () =>
{

    it("clone test", () =>
    {
        let filter = new GradientBevelFilter(
            10, 90, [0xffffff, 0xff00ff], [1, 0.2], [0, 255],
            10, 20, 3, 2, "full", true
        );
        let clone  = filter.clone();

        // clone check
        expect(clone.distance).toBe(10);
        expect(clone.angle).toBe(90);
        if (clone.colors) {
            expect(clone.colors[0]).toBe(0xffffff);
            expect(clone.colors[1]).toBe(0xff00ff);
        }
        if (clone.alphas) {
            expect(clone.alphas[0]).toBe(1);
            expect(clone.alphas[1]).toBe(0.2);
        }
        if (clone.ratios) {
            expect(clone.ratios[0]).toBe(0);
            expect(clone.ratios[1]).toBe(255);
        }
        expect(clone.blurX).toBe(10);
        expect(clone.blurY).toBe(20);
        expect(clone.strength).toBe(3);
        expect(clone.quality).toBe(2);
        expect(clone.type).toBe("full");
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
        clone.quality  = 1;
        clone.type     = "inner";
        clone.knockout = false;

        // origin
        expect(filter.distance).toBe(10);
        expect(filter.angle).toBe(90);
        if (filter.colors) {
            expect(filter.colors[0]).toBe(0xffffff);
            expect(filter.colors[1]).toBe(0xff00ff);
        }
        if (filter.alphas) {
            expect(filter.alphas[0]).toBe(1);
            expect(filter.alphas[1]).toBe(0.2);
        }
        if (filter.ratios) {
            expect(filter.ratios[0]).toBe(0);
            expect(filter.ratios[1]).toBe(255);
        }
        expect(filter.blurX).toBe(10);
        expect(filter.blurY).toBe(20);
        expect(filter.strength).toBe(3);
        expect(filter.quality).toBe(2);
        expect(filter.type).toBe("full");
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
        expect(clone.quality).toBe(1);
        expect(clone.type).toBe("inner");
        expect(clone.knockout).toBe(false);

    });

});

describe("GradientBevelFilter.js knockout test", () =>
{

    it("default test case1", () =>
    {
        let gbf = new GradientBevelFilter();
        expect(gbf.knockout).toBe(false);
    });

    it("default test case4", () =>
    {
        let gbf = new GradientBevelFilter();
        gbf.knockout = true;
        expect(gbf.knockout).toBe(true);
    });

    it("default test case7", () =>
    {
        let gbf = new GradientBevelFilter();
        // @ts-ignore
        gbf.knockout = 0;
        expect(gbf.knockout).toBe(false);
    });

    it("default test case8", () =>
    {
        let gbf = new GradientBevelFilter();
        // @ts-ignore
        gbf.knockout = 1;
        expect(gbf.knockout).toBe(true);
    });
});

describe("GradientBevelFilter.js angle test", () =>
{

    it("default test case1", () =>
    {
        let gbf = new GradientBevelFilter();
        expect(gbf.angle).toBe(45);
    });

    it("default test case7", () =>
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = 0;
        expect(gbf.angle).toBe(0);
    });

    it("default test case8", () =>
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = 1;
        expect(gbf.angle).toBe(1);
    });

    it("default test case9", () =>
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = 500;
        expect(gbf.angle).toBe(140);
    });

    it("default test case10", () =>
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = 50000000000000000;
        expect(gbf.angle).toBe(320);
    });

    it("default test case11", () =>
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = -1;
        expect(gbf.angle).toBe(-1);
    });

    it("default test case12", () =>
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = -500;
        expect(gbf.angle).toBe(-140);
    });

    it("default test case13", () =>
    {
        let gbf = new GradientBevelFilter();
        gbf.angle = -50000000000000000;
        expect(gbf.angle).toBe(-320);
    });

});

describe("GradientBevelFilter.js distance test", () =>
{

    it("default test case1", () =>
    {
        let gbf = new GradientBevelFilter();
        expect(gbf.distance).toBe(4);
    });

    it("default test case7", () =>
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = 0;
        expect(gbf.distance).toBe(0);
    });

    it("default test case8", () =>
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = 1;
        expect(gbf.distance).toBe(1);
    });

    it("default test case9", () =>
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = 500;
        expect(gbf.distance).toBe(255);
    });

    it("default test case10", () =>
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = 50000000000000000;
        expect(gbf.distance).toBe(255);
    });

    it("default test case11", () =>
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = -1;
        expect(gbf.distance).toBe(-1);
    });

    it("default test case12", () =>
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = -500;
        expect(gbf.distance).toBe(-255);
    });

    it("default test case13", () =>
    {
        let gbf = new GradientBevelFilter();
        gbf.distance = -50000000000000000;
        expect(gbf.distance).toBe(-255);
    });

});