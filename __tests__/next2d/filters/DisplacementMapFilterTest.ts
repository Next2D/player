import { $PREFIX } from "../../../src/util/Util";
import { DisplacementMapFilter } from "../../../src/next2d/filters/DisplacementMapFilter";
import { BitmapData } from "../../../src/next2d/display/BitmapData";
import { Point } from "../../../src/next2d/geom/Point";

describe("DisplacementMapFilter.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new DisplacementMapFilter();
        expect($PREFIX).toBe("__next2d__");
        expect(object.namespace).toBe("next2d.filters.DisplacementMapFilter");
    });

    it("namespace test static", () =>
    {
        expect(DisplacementMapFilter.namespace).toBe("next2d.filters.DisplacementMapFilter");
    });

});

describe("DisplacementMapFilter.js toString test", () =>
{
    it("toString test success", () =>
    {
        let filter = new DisplacementMapFilter();
        expect(filter.toString()).toBe("[object DisplacementMapFilter]");
    });

});

describe("DisplacementMapFilter.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(DisplacementMapFilter.toString()).toBe("[class DisplacementMapFilter]");
    });

});

describe("DisplacementMapFilter.js property test", () =>
{

    // default
    it("default test success", () =>
    {
        let filter = new DisplacementMapFilter();
        expect(filter.mapBitmap).toBe(null);
        expect(filter.mapPoint).toBe(null);
        expect(filter.componentX).toBe(0);
        expect(filter.componentY).toBe(0);
        expect(filter.scaleX).toBe(0);
        expect(filter.scaleY).toBe(0);
        expect(filter.mode).toBe("wrap");
        expect(filter.color).toBe(0);
        expect(filter.alpha).toBe(0);
    });

    // mapBitmap
    it("mapBitmap test success case1", () =>
    {
        let filter = new DisplacementMapFilter(new BitmapData(100, 100));
        expect(filter.mapBitmap instanceof BitmapData).toBe(true);
    });

    it("mapBitmap test success case2", () =>
    {
        let filter = new DisplacementMapFilter(new BitmapData());
        filter.mapBitmap = null;
        expect(filter.mapBitmap).toBe(null);
    });

    // mapPoint
    it("mapPoint test success case1", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0)
        );
        expect(filter.mapPoint instanceof Point).toBe(true);
    });

    it("mapPoint test success case2", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0)
        );
        filter.mapPoint = null;
        expect(filter.mapPoint).toBe(null);
    });

    // componentX
    it("componentX test success case1", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1
        );
        expect(filter.componentX).toBe(1);
    });

    it("componentX test success case2", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1
        );
        filter.componentX = 8;
        expect(filter.componentX).toBe(8);
    });

    it("componentX test valid case1", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1
        );
        filter.componentX = 2;
        expect(filter.componentX).toBe(2);
    });

    // componentY
    it("componentY test success case1", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2
        );
        expect(filter.componentY).toBe(2);
    });

    it("componentY test success case2", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2
        );
        filter.componentY = 8;
        expect(filter.componentY).toBe(8);
    });

    it("componentY test valid case1", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2
        );
        filter.componentY = 4;
        expect(filter.componentY).toBe(4);
    });

    // scaleX
    it("scaleX test success case1", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            10
        );
        expect(filter.scaleX).toBe(10);
    });

    it("scaleX test success case2", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            10
        );
        filter.scaleX = -20;
        expect(filter.scaleX).toBe(-20);
    });

    it("scaleX test valid case1", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            100
        );
        // @ts-ignore
        filter.scaleX = "abc";
        expect(filter.scaleX).toBe(0);
    });

    // scaleY
    it("scaleY test success case1", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            10,
            20
        );
        expect(filter.scaleY).toBe(20);
    });

    it("scaleY test success case2", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            10,
            30
        );
        filter.scaleY = -40;
        expect(filter.scaleY).toBe(-40);
    });

    it("scaleY test valid case1", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            100,
            50
        );
        // @ts-ignore
        filter.scaleY = "abc";
        expect(filter.scaleY).toBe(0);
    });

    // mode
    it("mode test success case1", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            10,
            20,
            "clamp"
        );
        expect(filter.mode).toBe("clamp");
    });

    it("mode test success case2", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            10,
            30,
            "clamp"
        );
        filter.mode = "ignore";
        expect(filter.mode).toBe("ignore");
    });

    it("mode test valid case1", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            10,
            30,
            "clamp"
        );
        expect(filter.mode).toBe("clamp");
        filter.mode = "ignore";
        expect(filter.mode).toBe("ignore");
    });

    // color
    it("color test success case1", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            10,
            20,
            "clamp",
            0
        );
        expect(filter.color).toBe(0);
    });

    it("color test success case2", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            10,
            20,
            "clamp",
            0xff0000
        );
        filter.color = 0x00ff00;
        expect(filter.color).toBe(0x00ff00);
    });

    it("color test valid case3", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            10,
            20,
            "clamp",
            -10
        );
        expect(filter.color).toBe(0);
    });

    it("color test valid case4", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            10,
            20,
            "clamp",
            16777220
        );
        expect(filter.color).toBe(0xffffff);
    });

    it("color test valid case5", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            10,
            20,
            "clamp",
            0xffffff
        );

        filter.color = -10;
        expect(filter.color).toBe(0);

        filter.color = 16777220;
        expect(filter.color).toBe(0xffffff);
    });

    // alpha
    it("alpha test success case1", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            10,
            20,
            "clamp",
            0xffffff,
            0
        );
        expect(filter.alpha).toBe(0);
    });

    it("alpha test success case2", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            10,
            20,
            "clamp",
            0xffffff,
            0.5
        );
        filter.alpha = 0.75;
        expect(filter.alpha).toBe(0.75);
    });

    it("alpha test valid case1", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            10,
            20,
            "clamp",
            0xffffff,
            // @ts-ignore
            "0.25"
        );
        expect(filter.alpha).toBe(0.25);
    });

    it("alpha test valid case2", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            10,
            20,
            "clamp",
            0xffffff,
            -10
        );
        expect(filter.alpha).toBe(0);
    });

    it("alpha test valid case3", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            10,
            20,
            "clamp",
            0xffffff,
            10
        );
        expect(filter.alpha).toBe(1);
    });

    it("alpha test valid case4", () =>
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100),
            new Point(0,0),
            1,
            2,
            10,
            20,
            "clamp",
            0xffffff,
            1
        );

        // @ts-ignore
        filter.alpha = "0.75";
        expect(filter.alpha).toBe(0.75);

        filter.alpha = -10;
        expect(filter.alpha).toBe(0);

        filter.alpha = 16777220;
        expect(filter.alpha).toBe(1);
    });
});

describe("DisplacementMapFilter.js clone test", () =>
{

    it("clone test", () =>
    {
        let bitmapData = new BitmapData(100, 100);
        let point = new Point();
        let filter = new DisplacementMapFilter(
            bitmapData,
            point,
            1,
            2,
            1.0, 2.0,
            "clamp",
            20,
            0.5
        );

        let clone  = filter.clone();

        // clone check
        expect(clone.mapBitmap instanceof BitmapData).toBe(true);
        expect(clone.mapPoint instanceof Point).toBe(true);
        expect(clone.componentX).toBe(1);
        expect(clone.componentY).toBe(2);
        expect(clone.scaleX).toBe(1);
        expect(clone.scaleY).toBe(2);
        expect(clone.mode).toBe("clamp");
        expect(clone.color).toBe(20);
        expect(clone.alpha).toBe(0.5);

        // edit param
        clone.mapBitmap   = null;
        clone.mapPoint    = null;
        clone.componentX  = 4;
        clone.componentY  = 8;
        clone.scaleX      = 3;
        clone.scaleY      = 4;
        clone.mode        = "color";
        clone.color       = 100;
        clone.alpha       = 1;

        // origin
        expect(filter.mapBitmap instanceof BitmapData).toBe(true);
        expect(filter.mapPoint instanceof Point).toBe(true);
        expect(filter.componentX).toBe(1);
        expect(filter.componentY).toBe(2);
        expect(filter.scaleX).toBe(1);
        expect(filter.scaleY).toBe(2);
        expect(filter.mode).toBe("clamp");
        expect(filter.color).toBe(20);
        expect(filter.alpha).toBe(0.5);

        // clone
        expect(clone.mapBitmap).toBe(null);
        expect(clone.mapPoint).toBe(null);
        expect(clone.componentX).toBe(4);
        expect(clone.componentY).toBe(8);
        expect(clone.scaleX).toBe(3);
        expect(clone.scaleY).toBe(4);
        expect(clone.mode).toBe("color");
        expect(clone.color).toBe(100);
        expect(clone.alpha).toBe(1);

    });

});

describe("DisplacementMapFilter.js alpha test", () =>
{

    it("default test case1", () =>
    {
        let dm = new DisplacementMapFilter();
        expect(dm.alpha).toBe(0);
    });

    it("default test case7", () =>
    {
        let dm = new DisplacementMapFilter();
        dm.alpha = 0;
        expect(dm.alpha).toBe(0);
    });

    it("default test case8", () =>
    {
        let dm = new DisplacementMapFilter();
        dm.alpha = 1;
        expect(dm.alpha).toBe(1);
    });

    it("default test case9", () =>
    {
        let dm = new DisplacementMapFilter();
        dm.alpha = -1;
        expect(dm.alpha).toBe(0);
    });

    it("default test case19", () =>
    {

        let ds = new DisplacementMapFilter();
        ds.alpha = 500;
        expect(ds.alpha).toBe(1);
    });

    it("default test case20", () =>
    {

        let ds = new DisplacementMapFilter();
        ds.alpha = -500;
        expect(ds.alpha).toBe(0);
    });

});

describe("DisplacementMapFilter.js color test", () =>
{

    it("default test case1", () =>
    {
        let dm = new DisplacementMapFilter();
        expect(dm.color).toBe(0);
    });

    it("default test case7", () =>
    {
        let dm = new DisplacementMapFilter();
        dm.color = 0;
        expect(dm.color).toBe(0);
    });

    it("default test case8", () =>
    {
        let dm = new DisplacementMapFilter();
        dm.color = 1;
        expect(dm.color).toBe(1);
    });

    it("default test case9", () =>
    {
        let dm = new DisplacementMapFilter();
        dm.color = -1;
        expect(dm.color).toBe(0);
    });

    it("default test case19", () =>
    {
        let dm = new DisplacementMapFilter();
        dm.color = 500;
        expect(dm.color).toBe(500);
    });

    it("default test case20", () =>
    {
        let dm = new DisplacementMapFilter();
        dm.color = -500;
        expect(dm.color).toBe(0);
    });

});

describe("DisplacementMapFilter.js componentX test", () =>
{

    it("default test case1", () =>
    {
        let dm = new DisplacementMapFilter();
        expect(dm.componentX).toBe(0);
    });

    it("default test case7", () =>
    {
        let dm = new DisplacementMapFilter();
        dm.componentX = 0;
        expect(dm.componentX).toBe(0);
    });

    it("default test case8", () =>
    {
        let dm = new DisplacementMapFilter();
        dm.componentX = 1;
        expect(dm.componentX).toBe(1);
    });
});

describe("DisplacementMapFilter.js componentY test", () =>
{

    it("default test case1", () =>
    {

        let dm = new DisplacementMapFilter();
        expect(dm.componentY).toBe(0);
    });

    it("default test case7", () =>
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = 0;
        expect(dm.componentY).toBe(0);
    });

    it("default test case8", () =>
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = 1;
        expect(dm.componentY).toBe(1);
    });
});

describe("DisplacementMapFilter.js scaleX test", () =>
{

    it("default test case1", () =>
    {

        let dm = new DisplacementMapFilter();
        expect(dm.scaleX).toBe(0);
    });

    it("default test case7", () =>
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = 0;
        expect(dm.scaleX).toBe(0);
    });

    it("default test case8", () =>
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = 1;
        expect(dm.scaleX).toBe(1);
    });

    it("default test case9", () =>
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = -1;
        expect(dm.scaleX).toBe(-1);
    });

    it("default test case19", () =>
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = 500;
        expect(dm.scaleX).toBe(500);
    });

    it("default test case20", () =>
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = -500;
        expect(dm.scaleX).toBe(-500);
    });

});

describe("DisplacementMapFilter.js scaleY test", () =>
{

    it("default test case1", () =>
    {

        let dm = new DisplacementMapFilter();
        expect(dm.scaleY).toBe(0);
    });

    it("default test case7", () =>
    {
        let dm = new DisplacementMapFilter();
        dm.scaleY = 0;
        expect(dm.scaleY).toBe(0);
    });

    it("default test case8", () =>
    {
        let dm = new DisplacementMapFilter();
        dm.scaleY = 1;
        expect(dm.scaleY).toBe(1);
    });

    it("default test case9", () =>
    {
        let dm = new DisplacementMapFilter();
        dm.scaleY = -1;
        expect(dm.scaleY).toBe(-1);
    });

    it("default test case19", () =>
    {
        let dm = new DisplacementMapFilter();
        dm.scaleY = 500;
        expect(dm.scaleY).toBe(500);
    });

    it("default test case20", () =>
    {
        let dm = new DisplacementMapFilter();
        dm.scaleY = -500;
        expect(dm.scaleY).toBe(-500);
    });

});