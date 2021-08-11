
describe("DisplacementMapFilter.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new DisplacementMapFilter();
        expect(object.namespace).toBe("next2d.filters.DisplacementMapFilter");
    });

    it("namespace test static", function()
    {
        expect(DisplacementMapFilter.namespace).toBe("next2d.filters.DisplacementMapFilter");
    });

});

describe("DisplacementMapFilter.js toString test", function()
{
    it("toString test success", function()
    {
        let filter = new DisplacementMapFilter();
        expect(filter.toString()).toBe("[object DisplacementMapFilter]");
    });

});

describe("DisplacementMapFilter.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(DisplacementMapFilter.toString()).toBe("[class DisplacementMapFilter]");
    });

});

describe("DisplacementMapFilter.js property test", function()
{

    // default
    it("default test success", function()
    {
        let filter = new DisplacementMapFilter();
        expect(filter.mapBitmap).toBe(null);
        expect(filter.mapPoint).toBe(null);
        expect(filter.componentX).toBe(0);
        expect(filter.componentY).toBe(0);
        expect(filter.scaleX).toBe(0);
        expect(filter.scaleY).toBe(0);
        expect(filter.mode).toBe(DisplacementMapFilterMode.WRAP);
        expect(filter.color).toBe(0);
        expect(filter.alpha).toBe(0);
    });

    // mapBitmap
    it("mapBitmap test success case1", function()
    {
        let filter = new DisplacementMapFilter(new BitmapData(100, 100, true, 0x00000000));
        expect(filter.mapBitmap instanceof BitmapData).toBe(true);
    });

    it("mapBitmap test success case2", function()
    {
        let filter = new DisplacementMapFilter(new BitmapData());
        filter.mapBitmap = null;
        expect(filter.mapBitmap).toBe(null);
    });

    it("mapBitmap test valid case1", function()
    {
        let filter = new DisplacementMapFilter({});
        expect(filter.mapBitmap).toBe(null);
    });

    // mapPoint
    it("mapPoint test success case1", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0)
        );
        expect(filter.mapPoint instanceof Point).toBe(true);
    });

    it("mapPoint test success case2", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0)
        );
        filter.mapPoint = null;
        expect(filter.mapPoint).toBe(null);
    });

    it("mapPoint test valid case1", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            {}
        );
        expect(filter.mapPoint).toBe(null);
    });

    // componentX
    it("componentX test success case1", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED
        );
        expect(filter.componentX).toBe(BitmapDataChannel.RED);
    });

    it("componentX test success case2", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED
        );
        filter.componentX = BitmapDataChannel.ALPHA;
        expect(filter.componentX).toBe(BitmapDataChannel.ALPHA);
    });

    it("componentX test valid case1", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED
        );
        filter.componentX = 10;
        expect(filter.componentX).toBe(0);
    });

    // componentY
    it("componentY test success case1", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN
        );
        expect(filter.componentY).toBe(BitmapDataChannel.GREEN);
    });

    it("componentY test success case2", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN
        );
        filter.componentY = BitmapDataChannel.ALPHA;
        expect(filter.componentY).toBe(BitmapDataChannel.ALPHA);
    });

    it("componentY test valid case1", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN
        );
        filter.componentY = 10;
        expect(filter.componentY).toBe(0);
    });

    // scaleX
    it("scaleX test success case1", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10
        );
        expect(filter.scaleX).toBe(10);
    });

    it("scaleX test success case2", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10
        );
        filter.scaleX = -20;
        expect(filter.scaleX).toBe(-20);
    });

    it("scaleX test valid case1", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            100
        );
        filter.scaleX = "abc";
        expect(filter.scaleX).toBe(0);
    });

    // scaleY
    it("scaleY test success case1", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10,
            20
        );
        expect(filter.scaleY).toBe(20);
    });

    it("scaleY test success case2", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10,
            30
        );
        filter.scaleY = -40;
        expect(filter.scaleY).toBe(-40);
    });

    it("scaleY test valid case1", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            100,
            50
        );
        filter.scaleY = "abc";
        expect(filter.scaleY).toBe(0);
    });

    // mode
    it("mode test success case1", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10,
            20,
            DisplacementMapFilterMode.CLAMP
        );
        expect(filter.mode).toBe(DisplacementMapFilterMode.CLAMP);
    });

    it("mode test success case2", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10,
            30,
            DisplacementMapFilterMode.CLAMP
        );
        filter.mode = DisplacementMapFilterMode.IGNORE;
        expect(filter.mode).toBe(DisplacementMapFilterMode.IGNORE);
    });

    it("mode test valid case1", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10,
            30,
            DisplacementMapFilterMode.CLAMP
        );
        filter.mode = "test";
        expect(filter.mode).toBe(DisplacementMapFilterMode.WRAP);
    });

    // color
    it("color test success case1", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10,
            20,
            DisplacementMapFilterMode.CLAMP,
            0
        );
        expect(filter.color).toBe(0);
    });

    it("color test success case2", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10,
            20,
            DisplacementMapFilterMode.CLAMP,
            0xff0000
        );
        filter.color = 0x00ff00;
        expect(filter.color).toBe(0x00ff00);
    });

    it("color test valid case1", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10,
            20,
            DisplacementMapFilterMode.CLAMP,
            "0x0000ff"
        );
        expect(filter.color).toBe(255);
    });

    it("color test valid case2", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10,
            20,
            DisplacementMapFilterMode.CLAMP,
            "red"
        );
        expect(filter.color).toBe(0xff0000);
    });

    it("color test valid case3", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10,
            20,
            DisplacementMapFilterMode.CLAMP,
            -10
        );
        expect(filter.color).toBe(0);
    });

    it("color test valid case4", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10,
            20,
            DisplacementMapFilterMode.CLAMP,
            16777220
        );
        expect(filter.color).toBe(0xffffff);
    });

    it("color test valid case5", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10,
            20,
            DisplacementMapFilterMode.CLAMP,
            0xffffff
        );

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
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10,
            20,
            DisplacementMapFilterMode.CLAMP,
            0xffffff,
            0
        );
        expect(filter.alpha).toBe(0);
    });

    it("alpha test success case2", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10,
            20,
            DisplacementMapFilterMode.CLAMP,
            0xffffff,
            0.5
        );
        filter.alpha = 0.75;
        expect(filter.alpha).toBe(0.75);
    });

    it("alpha test valid case1", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10,
            20,
            DisplacementMapFilterMode.CLAMP,
            0xffffff,
            "0.25"
        );
        expect(filter.alpha).toBe(0.25);
    });

    it("alpha test valid case2", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10,
            20,
            DisplacementMapFilterMode.CLAMP,
            0xffffff,
            -10
        );
        expect(filter.alpha).toBe(0);
    });

    it("alpha test valid case3", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10,
            20,
            DisplacementMapFilterMode.CLAMP,
            0xffffff,
            10
        );
        expect(filter.alpha).toBe(1);
    });

    it("alpha test valid case4", function()
    {
        let filter = new DisplacementMapFilter(
            new BitmapData(100, 100, true, 0x00000000),
            new Point(0,0),
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            10,
            20,
            DisplacementMapFilterMode.CLAMP,
            0xffffff,
            1
        );

        filter.alpha = "0.75";
        expect(filter.alpha).toBe(0.75);

        filter.alpha = -10;
        expect(filter.alpha).toBe(0);

        filter.alpha = 16777220;
        expect(filter.alpha).toBe(1);
    });
});

describe("DisplacementMapFilter.js clone test", function()
{

    it("clone test", function()
    {
        let bitmapData = new BitmapData(100, 100, true, 0x00000000);
        let point = new Point();
        let filter = new DisplacementMapFilter(
            bitmapData,
            point,
            BitmapDataChannel.RED,
            BitmapDataChannel.GREEN,
            1.0, 2.0,
            DisplacementMapFilterMode.CLAMP,
            20,
            0.5
        );

        let clone  = filter.clone();

        // clone check
        expect(clone.mapBitmap instanceof BitmapData).toBe(true);
        expect(clone.mapPoint instanceof Point).toBe(true);
        expect(clone.componentX).toBe(BitmapDataChannel.RED);
        expect(clone.componentY).toBe(BitmapDataChannel.GREEN);
        expect(clone.scaleX).toBe(1);
        expect(clone.scaleY).toBe(2);
        expect(clone.mode).toBe(DisplacementMapFilterMode.CLAMP);
        expect(clone.color).toBe(20);
        expect(clone.alpha).toBe(0.5);

        // edit param
        clone.mapBitmap   = null;
        clone.mapPoint    = null;
        clone.componentX  = BitmapDataChannel.BLUE;
        clone.componentY  = BitmapDataChannel.ALPHA;
        clone.scaleX      = 3;
        clone.scaleY      = 4;
        clone.mode        = DisplacementMapFilterMode.COLOR;
        clone.color       = 100;
        clone.alpha       = 1;

        // origin
        expect(filter.mapBitmap instanceof BitmapData).toBe(true);
        expect(filter.mapPoint instanceof Point).toBe(true);
        expect(filter.componentX).toBe(BitmapDataChannel.RED);
        expect(filter.componentY).toBe(BitmapDataChannel.GREEN);
        expect(filter.scaleX).toBe(1);
        expect(filter.scaleY).toBe(2);
        expect(filter.mode).toBe(DisplacementMapFilterMode.CLAMP);
        expect(filter.color).toBe(20);
        expect(filter.alpha).toBe(0.5);

        // clone
        expect(clone.mapBitmap).toBe(null);
        expect(clone.mapPoint).toBe(null);
        expect(clone.componentX).toBe(BitmapDataChannel.BLUE);
        expect(clone.componentY).toBe(BitmapDataChannel.ALPHA);
        expect(clone.scaleX).toBe(3);
        expect(clone.scaleY).toBe(4);
        expect(clone.mode).toBe(DisplacementMapFilterMode.COLOR);
        expect(clone.color).toBe(100);
        expect(clone.alpha).toBe(1);

    });

});

describe("DisplacementMapFilter.js alpha test", function()
{

    it("default test case1", function()
    {
        let dm = new DisplacementMapFilter();
        expect(dm.alpha).toBe(0);
    });

    it("default test case2", function()
    {
        let dm = new DisplacementMapFilter();
        dm.alpha = null;
        expect(dm.alpha).toBe(0);
    });

    it("default test case3", function()
    {
        let dm = new DisplacementMapFilter();
        dm.alpha = undefined;
        expect(dm.alpha).toBe(0);
    });

    it("default test case4", function()
    {
        let dm = new DisplacementMapFilter();
        dm.alpha = true;
        expect(dm.alpha).toBe(1);
    });

    it("default test case5", function()
    {
        let dm = new DisplacementMapFilter();
        dm.alpha = "";
        expect(dm.alpha).toBe(0);
    });

    it("default test case6", function()
    {
        let dm = new DisplacementMapFilter();
        dm.alpha = "abc";
        expect(dm.alpha).toBe(0);
    });

    it("default test case7", function()
    {
        let dm = new DisplacementMapFilter();
        dm.alpha = 0;
        expect(dm.alpha).toBe(0);
    });

    it("default test case8", function()
    {
        let dm = new DisplacementMapFilter();
        dm.alpha = 1;
        expect(dm.alpha).toBe(1);
    });

    it("default test case9", function()
    {
        let dm = new DisplacementMapFilter();
        dm.alpha = -1;
        expect(dm.alpha).toBe(0);
    });

    it("default test case10", function()
    {
        let dm = new DisplacementMapFilter();
        dm.alpha = { "a":0 };
        expect(dm.alpha).toBe(0);
    });

    it("default test case11", function()
    {
        let dm = new DisplacementMapFilter();
        dm.alpha = function a() {};
        expect(dm.alpha).toBe(0);
    });

    it("default test case12", function()
    {
        let dm = new DisplacementMapFilter();
        dm.alpha = [1];
        expect(dm.alpha).toBe(1);
    });

    it("default test case13", function()
    {
        let dm = new DisplacementMapFilter();
        dm.alpha = [1,2];
        expect(dm.alpha).toBe(0);
    });

    it("default test case14", function()
    {
        let dm = new DisplacementMapFilter();
        dm.alpha = {};
        expect(dm.alpha).toBe(0);
    });

    it("default test case15", function()
    {
        let dm = new DisplacementMapFilter();
        dm.alpha = { "toString":function () { return 1 } };
        expect(dm.alpha).toBe(1);
    });

    it("default test case16", function()
    {
        let dm = new DisplacementMapFilter();
        dm.alpha = { "toString":function () { return "1" } };
        expect(dm.alpha).toBe(1);
    });

    it("default test case17", function()
    {

        let dm = new DisplacementMapFilter();
        dm.alpha = { "toString":function () { return "1a" } };
        expect(dm.alpha).toBe(0);
    });

    it("default test case19", function()
    {

        let ds = new DisplacementMapFilter();
        ds.alpha = 500;
        expect(ds.alpha).toBe(1);
    });

    it("default test case20", function()
    {

        let ds = new DisplacementMapFilter();
        ds.alpha = -500;
        expect(ds.alpha).toBe(0);
    });

});

describe("DisplacementMapFilter.js color test", function()
{

    it("default test case1", function()
    {
        let dm = new DisplacementMapFilter();
        expect(dm.color).toBe(0);
    });

    it("default test case2", function()
    {
        let dm = new DisplacementMapFilter();
        dm.color = null;
        expect(dm.color).toBe(0);
    });

    it("default test case3", function()
    {
        let dm = new DisplacementMapFilter();
        dm.color = undefined;
        expect(dm.color).toBe(0);
    });

    it("default test case4", function()
    {
        let dm = new DisplacementMapFilter();
        dm.color = true;
        expect(dm.color).toBe(1);
    });

    it("default test case5", function()
    {
        let dm = new DisplacementMapFilter();
        dm.color = "";
        expect(dm.color).toBe(0);
    });

    it("default test case6", function()
    {
        let dm = new DisplacementMapFilter();
        dm.color = "abc";
        expect(dm.color).toBe(0);
    });

    it("default test case7", function()
    {
        let dm = new DisplacementMapFilter();
        dm.color = 0;
        expect(dm.color).toBe(0);
    });

    it("default test case8", function()
    {
        let dm = new DisplacementMapFilter();
        dm.color = 1;
        expect(dm.color).toBe(1);
    });

    it("default test case9", function()
    {
        let dm = new DisplacementMapFilter();
        dm.color = -1;
        expect(dm.color).toBe(0);
    });

    it("default test case10", function()
    {
        let dm = new DisplacementMapFilter();
        dm.color = { "a":0 };
        expect(dm.color).toBe(0);
    });

    it("default test case11", function()
    {
        let dm = new DisplacementMapFilter();
        dm.color = function a() {};
        expect(dm.color).toBe(0);
    });

    it("default test case12", function()
    {
        let dm = new DisplacementMapFilter();
        dm.color = [1];
        expect(dm.color).toBe(1);
    });

    it("default test case13", function()
    {
        let dm = new DisplacementMapFilter();
        dm.color = [1,2];
        expect(dm.color).toBe(0);
    });

    it("default test case14", function()
    {
        let dm = new DisplacementMapFilter();
        dm.color = {};
        expect(dm.color).toBe(0);
    });

    it("default test case15", function()
    {
        let dm = new DisplacementMapFilter();
        dm.color = { "toString":function () { return 1 } };
        expect(dm.color).toBe(1);
    });

    it("default test case16", function()
    {
        let dm = new DisplacementMapFilter();
        dm.color = { "toString":function () { return "1" } };
        expect(dm.color).toBe(1);
    });

    it("default test case17", function()
    {
        let dm = new DisplacementMapFilter();
        dm.color = { "toString":function () { return "1a" } };
        expect(dm.color).toBe(0);
    });

    it("default test case19", function()
    {
        let dm = new DisplacementMapFilter();
        dm.color = 500;
        expect(dm.color).toBe(500);
    });

    it("default test case20", function()
    {
        let dm = new DisplacementMapFilter();
        dm.color = -500;
        expect(dm.color).toBe(0);
    });

});

describe("DisplacementMapFilter.js componentX test", function()
{

    it("default test case1", function()
    {
        let dm = new DisplacementMapFilter();
        expect(dm.componentX).toBe(0);
    });

    it("default test case2", function()
    {
        let dm = new DisplacementMapFilter();
        dm.componentX = null;
        expect(dm.componentX).toBe(0);
    });

    it("default test case3", function()
    {
        let dm = new DisplacementMapFilter();
        dm.componentX = undefined;
        expect(dm.componentX).toBe(0);
    });

    it("default test case4", function()
    {
        let dm = new DisplacementMapFilter();
        dm.componentX = true;
        expect(dm.componentX).toBe(1);
    });

    it("default test case5", function()
    {
        let dm = new DisplacementMapFilter();
        dm.componentX = "";
        expect(dm.componentX).toBe(0);
    });

    it("default test case6", function()
    {
        let dm = new DisplacementMapFilter();
        dm.componentX = "abc";
        expect(dm.componentX).toBe(0);
    });

    it("default test case7", function()
    {
        let dm = new DisplacementMapFilter();
        dm.componentX = 0;
        expect(dm.componentX).toBe(0);
    });

    it("default test case8", function()
    {
        let dm = new DisplacementMapFilter();
        dm.componentX = 1;
        expect(dm.componentX).toBe(1);
    });

    it("default test case9", function()
    {
        let dm = new DisplacementMapFilter();
        dm.componentX = -1;
        expect(dm.componentX).toBe(0);
    });

    it("default test case10", function()
    {
        let dm = new DisplacementMapFilter();
        dm.componentX = { "a":0 };
        expect(dm.componentX).toBe(0);
    });

    it("default test case11", function()
    {
        let dm = new DisplacementMapFilter();
        dm.componentX = function a() {};
        expect(dm.componentX).toBe(0);
    });

    it("default test case12", function()
    {
        let dm = new DisplacementMapFilter();
        dm.componentX = [1];
        expect(dm.componentX).toBe(1);
    });

    it("default test case13", function()
    {
        let dm = new DisplacementMapFilter();
        dm.componentX = [1,2];
        expect(dm.componentX).toBe(0);
    });

    it("default test case14", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentX = {};
        expect(dm.componentX).toBe(0);
    });

    it("default test case15", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentX = { "toString":function () { return 1 } };
        expect(dm.componentX).toBe(1);
    });

    it("default test case16", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentX = { "toString":function () { return "1" } };
        expect(dm.componentX).toBe(1);
    });

    it("default test case17", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentX = { "toString":function () { return "1a" } };
        expect(dm.componentX).toBe(0);
    });

    it("default test case19", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentX = -100;
        expect(dm.componentX).toBe(0);
    });

    it("default test case20", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentX = 10000000000;
        expect(dm.componentX).toBe(0);
    });

    it("default test case21", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentX = -10000000000;
        expect(dm.componentX).toBe(0);
    });

    it("default test case22", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentX = 10000000000000000;
        expect(dm.componentX).toBe(0);
    });

});

describe("DisplacementMapFilter.js componentY test", function()
{

    it("default test case1", function()
    {

        let dm = new DisplacementMapFilter();
        expect(dm.componentY).toBe(0);
    });

    it("default test case2", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = null;
        expect(dm.componentY).toBe(0);
    });

    it("default test case3", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = undefined;
        expect(dm.componentY).toBe(0);
    });

    it("default test case4", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = true;
        expect(dm.componentY).toBe(1);
    });

    it("default test case5", function()
    {
        let dm = new DisplacementMapFilter();
        dm.componentY = "";
        expect(dm.componentY).toBe(0);
    });

    it("default test case6", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = "abc";
        expect(dm.componentY).toBe(0);
    });

    it("default test case7", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = 0;
        expect(dm.componentY).toBe(0);
    });

    it("default test case8", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = 1;
        expect(dm.componentY).toBe(1);
    });

    it("default test case9", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = -1;
        expect(dm.componentY).toBe(0);
    });

    it("default test case10", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = { "a":0 };
        expect(dm.componentY).toBe(0);
    });

    it("default test case11", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = function a() {};
        expect(dm.componentY).toBe(0);
    });

    it("default test case12", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = [1];
        expect(dm.componentY).toBe(1);
    });

    it("default test case13", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = [1,2];
        expect(dm.componentY).toBe(0);
    });

    it("default test case14", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = {};
        expect(dm.componentY).toBe(0);
    });

    it("default test case15", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = { "toString":function () { return 1 } };
        expect(dm.componentY).toBe(1);
    });

    it("default test case16", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = { "toString":function () { return "1" } };
        expect(dm.componentY).toBe(1);
    });

    it("default test case17", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = { "toString":function () { return "1a" } };
        expect(dm.componentY).toBe(0);
    });

    it("default test case19", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = -100;
        expect(dm.componentY).toBe(0);
    });

    it("default test case20", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = 10000000000;
        expect(dm.componentY).toBe(0);
    });

    it("default test case21", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = -10000000000;
        expect(dm.componentY).toBe(0);
    });

    it("default test case22", function()
    {

        let dm = new DisplacementMapFilter();
        dm.componentY = 10000000000000000;
        expect(dm.componentY).toBe(0);
    });

});

describe("DisplacementMapFilter.js scaleX test", function()
{

    it("default test case1", function()
    {

        let dm = new DisplacementMapFilter();
        expect(dm.scaleX).toBe(0);
    });

    it("default test case2", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = null;
        expect(dm.scaleX).toBe(0);
    });

    it("default test case3", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = undefined;
        expect(dm.scaleX).toBe(0);
    });

    it("default test case4", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = true;
        expect(dm.scaleX).toBe(1);
    });

    it("default test case5", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = "";
        expect(dm.scaleX).toBe(0);
    });

    it("default test case6", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = "abc";
        expect(dm.scaleX).toBe(0);
    });

    it("default test case7", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = 0;
        expect(dm.scaleX).toBe(0);
    });

    it("default test case8", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = 1;
        expect(dm.scaleX).toBe(1);
    });

    it("default test case9", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = -1;
        expect(dm.scaleX).toBe(-1);
    });

    it("default test case10", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = { "a":0 };
        expect(dm.scaleX).toBe(0);
    });

    it("default test case11", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = function a() {};
        expect(dm.scaleX).toBe(0);
    });

    it("default test case12", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = [1];
        expect(dm.scaleX).toBe(1);
    });

    it("default test case13", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = [1,2];
        expect(dm.scaleX).toBe(0);
    });

    it("default test case14", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = {};
        expect(dm.scaleX).toBe(0);
    });

    it("default test case15", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = { "toString":function () { return 1 } };
        expect(dm.scaleX).toBe(1);
    });

    it("default test case16", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = { "toString":function () { return "1" } };
        expect(dm.scaleX).toBe(1);
    });

    it("default test case17", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = { "toString":function () { return "1a" } };
        expect(dm.scaleX).toBe(0);
    });

    it("default test case19", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = 500;
        expect(dm.scaleX).toBe(500);
    });

    it("default test case20", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleX = -500;
        expect(dm.scaleX).toBe(-500);
    });

});

describe("DisplacementMapFilter.js scaleY test", function()
{

    it("default test case1", function()
    {

        let dm = new DisplacementMapFilter();
        expect(dm.scaleY).toBe(0);
    });

    it("default test case2", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleY = null;
        expect(dm.scaleY).toBe(0);
    });

    it("default test case3", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleY = undefined;
        expect(dm.scaleY).toBe(0);
    });

    it("default test case4", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleY = true;
        expect(dm.scaleY).toBe(1);
    });

    it("default test case5", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleY = "";
        expect(dm.scaleY).toBe(0);
    });

    it("default test case6", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleY = "abc";
        expect(dm.scaleY).toBe(0);
    });

    it("default test case7", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleY = 0;
        expect(dm.scaleY).toBe(0);
    });

    it("default test case8", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleY = 1;
        expect(dm.scaleY).toBe(1);
    });

    it("default test case9", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleY = -1;
        expect(dm.scaleY).toBe(-1);
    });

    it("default test case10", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleY = { "a":0 };
        expect(dm.scaleY).toBe(0);
    });

    it("default test case11", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleY = function a() {};
        expect(dm.scaleY).toBe(0);
    });

    it("default test case12", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleY = [1];
        expect(dm.scaleY).toBe(1);
    });

    it("default test case13", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleY = [1,2];
        expect(dm.scaleY).toBe(0);
    });

    it("default test case14", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleY = {};
        expect(dm.scaleY).toBe(0);
    });

    it("default test case15", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleY = { "toString":function () { return 1 } };
        expect(dm.scaleY).toBe(1);
    });

    it("default test case16", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleY = { "toString":function () { return "1" } };
        expect(dm.scaleY).toBe(1);
    });

    it("default test case17", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleY = { "toString":function () { return "1a" } };
        expect(dm.scaleY).toBe(0);
    });

    it("default test case19", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleY = 500;
        expect(dm.scaleY).toBe(500);
    });

    it("default test case20", function()
    {

        let dm = new DisplacementMapFilter();
        dm.scaleY = -500;
        expect(dm.scaleY).toBe(-500);
    });

});