
describe("DisplayObject.js toString test", function()
{
    it("toString test success", function()
    {
        const obj = new DisplayObject();
        expect(obj.toString()).toBe("[object DisplayObject]");
    });

});

describe("DisplayObject.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new DisplayObject();
        expect(object.namespace).toBe("next2d.display.DisplayObject");
    });

    it("namespace test static", function()
    {
        expect(DisplayObject.namespace).toBe("next2d.display.DisplayObject");
    });

});

describe("DisplayObject.js property test", function()
{

    beforeEach(function() {
        window.next2d = new Next2D();
    });

    // stage
    it("stage test success case1", function ()
    {
        const obj = new DisplayObject();
        expect(obj.stage).toBe(null);
    });

    it("stage test success case2", function ()
    {
        const stage = new Stage();
        const obj   = stage.addChild(new DisplayObject());
        expect(stage._$id).toBe(obj.stage._$id); // reset
    });

    // parent
    it("parent test success case1", function () {
        const obj = new DisplayObject();
        expect(obj.parent).toBe(null);
    });

    it("parent test success case2", function () {
        const stage = new Stage();
        const obj   = stage.addChild(new DisplayObject());
        expect(obj.parent._$instanceId).toBe(stage._$instanceId);
    });

    // name
    it("name test success case1", function () {
        const obj  = new DisplayObject();
        obj.name = "abc";
        expect(obj.name).toBe("abc");
    });

    it("name test success case2", function () {
        const obj  = new DisplayObject();
        obj.name = 1;
        expect(obj.name).toBe("1");
    });

    // alpha
    it("alpha test success case1", function () {
        const obj   = new DisplayObject();
        obj.alpha = 0.5;
        expect(obj.alpha).toBe(0.5);
    });

    it("alpha test success case2", function () {
        const obj   = new DisplayObject();
        obj.alpha = "0.2";
        expect(obj.alpha).toBe(0.20000000298023224);
    });

    it("alpha test success case3", function () {
        const obj   = new DisplayObject();
        obj.alpha = 2;
        expect(obj.alpha).toBe(1);
    });

    it("alpha test success case4", function () {
        const obj   = new DisplayObject();
        obj.alpha = -1;
        expect(obj.alpha).toBe(0);
    });

    it("alpha test success valid", function () {
        const obj   = new DisplayObject();
        obj.alpha = "abc";
        expect(obj.alpha).toBe(0);
    });

    // rotation
    it("rotation test success case1", function () {
        const obj = new DisplayObject();
        expect(obj.rotation).toBe(0);
    });

    it("rotation test success case2", function () {
        const obj = new DisplayObject();

        for (let i = 0; i <= 360; i++) {
            obj.rotation = i;
            if (i > 180) {
                expect(Math.round(obj.rotation)).toBe(i - 360);
            } else {
                expect(Math.round(obj.rotation)).toBe(i);
            }
        }
    });

    it("rotation test success case3", function () {
        const obj = new DisplayObject();

        for (let i = 0; i <= 360; i++) {
            const value = i * -1;

            obj.rotation = value;
            if (i > 180) {
                expect(Math.round(obj.rotation)).toBe(360 - i);
            } else {
                expect(Math.round(obj.rotation)).toBe(value);
            }
        }
    });

    // scaleX
    it("scaleX test success case1", function () {
        const obj = new DisplayObject();
        expect(obj.scaleX).toBe(1);
    });

    it("scaleX test success case2", function () {
        const obj = new DisplayObject();
        obj.scaleX = 15;
        expect(obj.scaleX).toBe(15);
    });

    it("scaleX test success case3", function () {
        const obj = new DisplayObject();
        obj.scaleX = -11;
        expect(obj.scaleX).toBe(-11);
    });

    it("scaleX test valid case1", function () {
        const obj    = new DisplayObject();
        obj.scaleX = "abc";
        expect(obj.scaleX).toBe(0);
    });

    // scaleY
    it("scaleY test success case1", function () {
        const obj = new DisplayObject();
        expect(obj.scaleY).toBe(1);
    });

    it("scaleY test success case2", function () {
        const obj    = new DisplayObject();
        obj.scaleY = 15;
        expect(obj.scaleY).toBe(15);
    });

    it("scaleY test success case3", function () {
        const obj    = new DisplayObject();
        obj.scaleY = -11;
        expect(obj.scaleY).toBe(-11);
    });

    it("scaleY test success case4", function () {
        const obj    = new DisplayObject();
        obj.scaleY = -1;
        expect(obj.scaleY).toBe(-1);
    });

    it("scaleY test success case5", function () {
        const obj    = new DisplayObject();
        obj.scaleY = 0.5449999999999999;
        expect(obj.scaleY).toBe(0.5450000166893005);
    });

    it("scaleY test success case6", function () {
        const obj    = new DisplayObject();

        obj.scaleY = -0.6717931453290831;
        expect(obj.scaleY).toBe(-0.6717931628227234);
        obj.scaleY = -0.9990366556971153;
        expect(obj.scaleY).toBe(-0.9990366697311401);
    });

    it("scaleY test success case7", function () {
        const obj    = new DisplayObject();

        obj.scaleY = -0.9758;
        expect(obj.scaleY).toBe(-0.9757999777793884);
        obj.scaleY = 0.1858000000000002;
        expect(obj.scaleY).toBe(0.1858000010251999);
    });

    it("scaleY test success case7", function () {
        const obj    = new DisplayObject();

        obj.scaleY = -1;
        expect(obj.scaleY).toBe(-1);
        obj.scaleY = -0.7822;
        expect(obj.scaleY).toBe(-0.7821999788284302);
    });

    it("scaleY test valid case1", function () {
        const obj    = new DisplayObject();
        obj.scaleY = "abc";
        expect(obj.scaleY).toBe(0);
    });

    // scaleX and scaleY
    it("scaleX and scaleY test success case1", function () {
        const obj    = new DisplayObject();
        obj.scaleX = 2;
        obj.scaleY = 5;
        expect(obj.scaleX).toBe(2);
        expect(obj.scaleY).toBe(5);
    });

    // height
    it("height test success case1", function () {

        const mc = new MovieClip();

        const shape1  = new Shape();
        shape1
            .graphics
            .beginFill("red")
            .drawRect(0, 0, 50, 40)
            .endFill();

        const shape2  = new Shape();
        shape2
            .graphics
            .beginFill("red")
            .drawRect(25, 25, 50, 60)
            .endFill();

        mc.addChild(shape1);
        mc.addChild(shape2);

        expect(mc.height).toBe(85);
    });

    it("height test success case2", function () {

        const mc = new MovieClip();

        const shape1  = new Shape();
        shape1
            .graphics
            .beginFill("red")
            .drawRect(0, 0, 50, 40)
            .endFill();

        const shape2  = new Shape();
        shape2
            .graphics
            .beginFill("red")
            .drawRect(25, 25, 50, 60)
            .endFill();

        mc.addChild(shape1);
        mc.addChild(shape2);

        mc.height = 100;

        expect(mc.height).toBe(100.00000417232513);
    });

    it("height test success case3", function () {

        const mc = new MovieClip();

        const shape1  = new Shape();
        shape1
            .graphics
            .beginFill("red")
            .drawRect(0, 0, 50, 40)
            .endFill();

        const shape2  = new Shape();
        shape2
            .graphics
            .beginFill("red")
            .drawRect(25, 25, 50, 60)
            .endFill();

        mc.addChild(shape1);
        mc.addChild(shape2);

        mc.height = "123";

        expect(mc.height).toBe(122.9999977350235);
    });

    it("height test success case4", function () {

        const mc = new MovieClip();

        const shape1  = new Shape();
        shape1
            .graphics
            .beginFill("red")
            .drawRect(0, 0, 50, 40)
            .endFill();

        const shape2  = new Shape();
        shape2
            .graphics
            .beginFill("red")
            .drawRect(25, 25, 50, 60)
            .endFill();

        mc.addChild(shape1);
        mc.addChild(shape2);

        expect(mc.height).toBe(85);

        mc.height = 0;
        expect(mc.height).toBe(0);

        mc.height = 85;
        expect(mc.height).toBe(85);
    });

    it("height test valid case1", function () {

        const mc = new MovieClip();

        const shape1  = new Shape();
        shape1
            .graphics
            .beginFill("red")
            .drawRect(0, 0, 50, 40)
            .endFill();

        const shape2  = new Shape();
        shape2
            .graphics
            .beginFill("red")
            .drawRect(25, 25, 50, 60)
            .endFill();

        mc.addChild(shape1);
        mc.addChild(shape2);

        mc.height = "abc";

        expect(mc.height).toBe(85);
    });

    it("Height test set infinity case1", function () {

        const shape  = new Shape();
        shape.graphics.drawRect(0, 0, 50, 40).endFill();

        shape.height = Util.$Infinity;

        expect(shape.height).toBe(1310680);

        expect(shape.transform.matrix.d).toBe(32767);

        /**
         * TODO Flash側のバグ？
         * @see https://blog.gskinner.com/archives/2007/08/annoying_as3_bu.html
         */
        shape.width = 100;
        expect(shape.scaleY).toBe(32767);
    });

    it("Height test set case1", function () {

        const shape  = new Shape();
        shape.graphics.drawRect(0, 0, 50, 40).endFill();

        shape.rotation = 90;

        shape.height = 30;
        expect(shape.width).toBe(24.000000953674316);
        expect(shape.height).toBe(50);

        /**
         * TODO Flash側のバグ？
         * @see https://blog.gskinner.com/archives/2007/08/annoying_as3_bu.html
         */
        shape.height = 30;
        expect(shape.width).toBe(24.000000953674316);
        expect(shape.height).toBe(50);
    });

    // width
    it("width test success case1", function () {

        const mc = new MovieClip();

        const shape1  = new Shape();
        shape1
            .graphics
            .beginFill("red")
            .drawRect(0, 0, 50, 40)
            .endFill();

        const shape2  = new Shape();
        shape2
            .graphics
            .beginFill("red")
            .drawRect(25, 25, 50, 60)
            .endFill();

        mc.addChild(shape1);
        mc.addChild(shape2);

        expect(mc.width).toBe(75);
    });

    it("width test success case2", function () {

        const mc = new MovieClip();

        const shape1  = new Shape();
        shape1
            .graphics
            .beginFill("red")
            .drawRect(0, 0, 50, 40)
            .endFill();

        const shape2  = new Shape();
        shape2
            .graphics
            .beginFill("red")
            .drawRect(25, 25, 50, 60)
            .endFill();

        mc.addChild(shape1);
        mc.addChild(shape2);

        mc.width = 100;

        expect(mc.width).toBe(100.00000298023224);
    });

    it("width test success case3", function () {

        const mc = new MovieClip();

        const shape1  = new Shape();
        shape1
            .graphics
            .beginFill("red")
            .drawRect(0, 0, 50, 40)
            .endFill();

        const shape2  = new Shape();
        shape2
            .graphics
            .beginFill("red")
            .drawRect(25, 25, 50, 60)
            .endFill();

        mc.addChild(shape1);
        mc.addChild(shape2);

        expect(mc.width).toBe(75);

        mc.width = "312";
        expect(mc.width).toBe(311.9999885559082);
    });

    it("width test success case4", function () {

        const mc = new MovieClip();

        const shape1  = new Shape();
        shape1

            .graphics
            .beginFill("red")
            .drawRect(0, 0, 50, 40)
            .endFill();

        const shape2  = new Shape();
        shape2
            .graphics
            .beginFill("red")
            .drawRect(25, 25, 50, 60)
            .endFill();

        mc.addChild(shape1);
        mc.addChild(shape2);

        expect(mc.width).toBe(75);

        mc.width = 0;
        expect(mc.width).toBe(0);

        mc.width = 75;
        expect(mc.width).toBe(75);
    });

    it("width test valid case1", function () {

        const mc = new MovieClip();

        const shape1  = new Shape();
        shape1
            .graphics
            .beginFill("red")
            .drawRect(0, 0, 50, 40)
            .endFill();

        const shape2  = new Shape();
        shape2
            .graphics
            .beginFill("red")
            .drawRect(25, 25, 50, 60)
            .endFill();

        mc.addChild(shape1);
        mc.addChild(shape2);

        mc.width = "abc";

        expect(mc.width).toBe(75);
    });

    it("width test set infinity case1", function () {

        const shape  = new Shape();
        shape.graphics.drawRect(0, 0, 50, 40).endFill();

        shape.width = Util.$Infinity;

        expect(shape.width).toBe(1638350);

        expect(shape.transform.matrix.a).toBe(32767);

        shape.height = 100;
        expect(Math.round(shape.scaleX)).toBe(32767);
    });

    it("width test set case1", function () {

        const shape  = new Shape();
        shape.graphics.drawRect(0, 0, 50, 40).endFill();

        shape.rotation = 90;

        shape.width = 30;
        expect(shape.width).toBe(40);
        expect(shape.height).toBe(37.5);

        /**
         * TODO Flash側のバグ？
         * @see https://blog.gskinner.com/archives/2007/08/annoying_as3_bu.html
         */
        shape.width = 30;
        expect(shape.width).toBe(40);
        expect(shape.height).toBe(37.5);
    });

    // x
    it("x test success case1", function () {
        const obj = new DisplayObject();
        expect(obj.x).toBe(0);
    });

    it("x test success case2", function () {
        const obj = new DisplayObject();

        obj.x = 100;
        expect(obj.x).toBe(100);
    });

    it("x test success case2", function () {
        const obj = new DisplayObject();

        obj.x = "158";
        expect(obj.x).toBe(158);
    });

    it("x test valid case1", function () {
        const obj = new DisplayObject();

        obj.x = "abc";
        expect(obj.x).toBe(0);
    });

    // y
    it("y test success case1", function () {
        const obj = new DisplayObject();
        expect(obj.y).toBe(0);
    });

    it("y test success case2", function () {
        const obj = new DisplayObject();

        obj.y = 100;
        expect(obj.y).toBe(100);
    });

    it("y test success case2", function () {
        const obj = new DisplayObject();

        obj.y = "158";
        expect(obj.y).toBe(158);
    });

    it("y test valid case1", function () {
        const obj = new DisplayObject();

        obj.y = "abc";
        expect(obj.y).toBe(0);
    });

    // visible
    it("visible test success case1", function () {
        const obj = new DisplayObject();
        expect(obj.visible).toBe(true);
    });

    it("visible test success case2", function () {
        const obj = new DisplayObject();
        obj.visible = false;
        expect(obj.visible).toBe(false);
    });

    it("visible test valid case1", function () {
        const obj = new DisplayObject();
        obj.visible = "1";
        expect(obj.visible).toBe(true);
    });

});

describe("DisplayObject.js getBounds test", function()
{

    beforeEach(function() {
        window.next2d = new Next2D();
    });

    it("getBounds test success case1", function () {

        const sprite = new Sprite();

        const container = new Sprite();
        container.x = 100;
        container.y = 100;
        sprite.addChild(container);

        const contents = new Shape();
        contents.graphics.drawCircle(0, 0, 100);
        container.addChild(contents);

        const bounds1 = contents.getBounds(container);
        const bounds2 = contents.getBounds(sprite);

        expect(bounds1.toString()).toBe("(x=-100, y=-100, w=200, h=200)");
        expect(bounds2.toString()).toBe("(x=0, y=0, w=200, h=200)");
    });

    it("line point zero test case 0", function ()
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, true, CapsStyle.SQUARE, JointStyle.BEVEL, 10)
            .moveTo(0, 0)
            .lineTo(10, 0);

        expect(shape.getBounds(shape).toString()).toBe("(x=-10, y=-10, w=30, h=20)");

    });

    it("line point zero test case 45", function ()
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, true, CapsStyle.SQUARE, JointStyle.BEVEL, 10)
            .moveTo(0, 0)
            .lineTo(10, 10);

        expect(shape.getBounds(shape).toString())
            .toBe("(x=-10, y=-10, w=30, h=30)");

    });

    it("line point zero test case 90", function ()
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, true, CapsStyle.SQUARE, JointStyle.BEVEL, 10)
            .moveTo(0, 0)
            .lineTo(0, 10);

        expect(shape.getBounds(shape).toString())
            .toBe("(x=-10, y=-10, w=20, h=30)");

    });

    it("line point zero test case 135", function ()
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, true, CapsStyle.SQUARE, JointStyle.BEVEL, 10)
            .moveTo(0, 0)
            .lineTo(-10, 10);

        expect(shape.getBounds(shape).toString())
            .toBe("(x=-20, y=-10, w=30, h=30)");

    });

    it("line point zero test case 180", function ()
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, true, CapsStyle.SQUARE, JointStyle.BEVEL, 10)
            .moveTo(0, 0)
            .lineTo(-10, 0);

        expect(shape.getBounds(shape).toString()).toBe("(x=-20, y=-10, w=30, h=20)");

    });

    it("line point zero test case -45", function ()
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, true, CapsStyle.SQUARE, JointStyle.BEVEL, 10)
            .moveTo(0, 0)
            .lineTo(10, -10);

        expect(shape.getBounds(shape).toString())
            .toBe("(x=-10, y=-20, w=30, h=30)");

    });

    it("line point zero test case -90", function ()
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, true, CapsStyle.SQUARE, JointStyle.BEVEL, 10)
            .moveTo(0, 0)
            .lineTo(0, -10);

        expect(shape.getBounds(shape).toString()).toBe("(x=-10, y=-20, w=20, h=30)");

    });

    it("rect test case1", function ()
    {
        const shape = new Shape();

        shape
            .graphics
            .beginFill(0xff0000)
            .drawRect(50, 50, 100, 100)
            .endFill();

        expect(shape.getBounds(shape).toString()).toBe("(x=50, y=50, w=100, h=100)");

    });

    it("line point zero test case -135", function ()
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, true, CapsStyle.SQUARE, JointStyle.BEVEL, 10)
            .moveTo(0, 0)
            .lineTo(-10, -10);

        expect(shape.getBounds(shape).toString())
            .toBe("(x=-20, y=-20, w=30, h=30)");

    });

    // it("line MITER test case1", function ()
    // {
    //     const shape = new Shape();
    //
    //     shape
    //         .graphics
    //         .lineStyle(20, 0x000000, 1.0, true, LineScaleMode.NORMAL, CapsStyle.SQUARE, JointStyle.MITER, 10)
    //         .moveTo(0, 0)
    //         .lineTo(0, 100)
    //         .lineTo(100, 100)
    //         .lineTo(0, 0);
    //
    //
    //     const bounds = shape.getBounds(shape);
    //
    //     expect(bounds.x|0).toBe(-10);
    //     expect(bounds.y|0).toBe(-24);
    //     expect(bounds.width|0).toBe(134);
    //     expect(bounds.height|0).toBe(134);
    //
    // });

    // it("line MITER test case2", function ()
    // {
    //     const shape = new Shape();
    //
    //     shape
    //         .graphics
    //         .lineStyle(20, 0x000000, 1.0, true, LineScaleMode.NORMAL, CapsStyle.SQUARE, JointStyle.MITER, 10)
    //         .moveTo(0, 0)
    //         .lineTo(0, 100)
    //         .lineTo(100, 100)
    //         .lineTo(0, 0);
    //
    //     shape.x = 60;
    //     shape.y = 60;
    //
    //     const bounds = shape.getBounds(shape);
    //
    //     expect(bounds.x|0).toBe(-10);
    //     expect(bounds.y|0).toBe(-24);
    //     expect(bounds.width|0).toBe(134);
    //     expect(bounds.height|0).toBe(134);
    //
    // });

    // it("line MITER test case3", function ()
    // {
    //     const shape = new Shape();
    //
    //     shape
    //         .graphics
    //         .lineStyle(20, 0x000000, 1.0, true, LineScaleMode.NORMAL, CapsStyle.SQUARE, JointStyle.MITER, 10)
    //         .moveTo(0, 0)
    //         .lineTo(0, 100)
    //         .lineTo(100, 100)
    //         .lineTo(0, 0);
    //
    //     shape.x = 60;
    //     shape.y = 60;
    //
    //     const bounds = shape.getBounds(new Shape());
    //
    //     expect(bounds.x|0).toBe(50);
    //     expect(bounds.y|0).toBe(35);
    //     expect(bounds.width|0).toBe(134);
    //     expect(bounds.height|0).toBe(134);
    //
    // });

    it("line BEVEL test case1", function ()
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, true, CapsStyle.SQUARE, JointStyle.BEVEL, 10)
            .moveTo(0, 0)
            .lineTo(100, 50)
            .lineTo(0, 100)
            .lineTo(0, 0);

        const bounds = shape.getBounds(shape);

        expect(bounds.toString())
            .toBe("(x=-10, y=-10, w=120, h=120)");

    });

    it("line BEVEL test in curveTo case1", function ()
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, true, CapsStyle.SQUARE, JointStyle.BEVEL, 10)
            .moveTo(0, 0)
            .curveTo(10, 50, 100, 100)
            .lineTo(-10, 100)
            .lineTo(0, 0);

        shape.x = 60;
        shape.y = 60;

        const bounds = shape.getBounds(new Shape());

        expect(bounds.toString()).toBe("(x=40, y=50, w=130, h=120)");

    });

    // TextField
    it("TextField none text case1", function ()
    {
        const textField = new TextField();
        textField.x = 200;
        textField.y = 200;
        textField.border     = true;
        textField.background = true;

        const bounds = textField.getBounds(textField);
        expect(bounds.toString()).toBe("(x=0, y=0, w=100, h=100)");
    });

    it("TextField none text case2", function ()
    {
        const stage = new Stage();
        const root  = stage.addChildAt(new MovieClip(), 0);

        const textField = new TextField();
        textField.x = 200;
        textField.y = 200;
        textField.border     = true;
        textField.background = true;

        root.addChild(textField);

        const bounds = textField.getBounds(root);
        expect(bounds.toString()).toBe("(x=200, y=200, w=100, h=100)");
    });

    it("TextField none text and autoSize case3", function ()
    {
        const stage = new Stage();
        const root  = stage.addChildAt(new MovieClip(), 0);

        const textField = new TextField();
        textField.x = 200;
        textField.y = 200;
        textField.width  = 200;
        textField.height = 20;
        textField.border     = true;
        textField.background = true;

        root.addChild(textField);

        const bounds = textField.getBounds(root);
        expect(bounds.toString()).toBe("(x=200, y=200, w=200, h=20)");
    });

    it("TextField none text and autoSize case1", function ()
    {
        const textField = new TextField();
        textField.autoSize = TextFieldAutoSize.NONE;
        textField.x = 200;
        textField.y = 200;
        textField.border     = true;
        textField.background = true;

        const bounds = textField.getBounds(textField);
        expect(bounds.toString()).toBe("(x=0, y=0, w=100, h=100)");
    });

    it("TextField none text and autoSize case2", function ()
    {
        const stage = new Stage();
        const root  = stage.addChildAt(new MovieClip(), 0);

        const textField = new TextField();
        textField.defaultTextFormat.font = "Times";
        textField.autoSize = TextFieldAutoSize.LEFT;
        textField.x = 200;
        textField.y = 200;
        textField.border     = true;
        textField.background = true;
        textField.multiline  = true;

        textField.text = "aaa\naaa\naaa\naaa";

        root.addChild(textField);

        const bounds = textField.getBounds(root);
        expect(bounds.x).toBe(200);
        expect(bounds.y).toBe(200);

        // TODO pipeline
        const width = bounds.width | 0;
        expect(width >= 17 && width <= 20).toBe(true);
        expect(bounds.height | 0).toBe(54);
    });

    it("TextField none text and autoSize case3", function ()
    {
        const stage = new Stage();
        const root  = stage.addChildAt(new MovieClip(), 0);

        const textField = new TextField();
        textField.autoSize = TextFieldAutoSize.LEFT;
        textField.x = 200;
        textField.y = 200;
        textField.width  = 200;
        textField.height = 20;
        textField.border     = true;
        textField.background = true;

        root.addChild(textField);

        const bounds = textField.getBounds(root);
        expect(bounds.toString()).toBe("(x=200, y=200, w=4, h=4)");
    });

});

describe("DisplayObject.js hitTestObject test", function()
{

    beforeEach(function() {
        window.next2d = new Next2D();
    });

    function leaf(s) {
        while (s.numChildren) {
            s = s.getChildAt(0);
        }
        return s;
    }

    function createContainer(x, y, w, h) {
        const sp = new Sprite();
        sp.graphics.lineStyle(0, 1);
        sp.graphics.drawRect(0, 0, w, h);
        sp.x = x;
        sp.y = y;
        return sp;
    }

    function constructAndAssert(a, b, expectedResultOutOfStage, expectedResultOnStage) {
        const stage = new Stage();
        const x = 0;
        const y = 0;
        const s = 100;

        expect(leaf(a).hitTestObject(leaf(b))).toBe(expectedResultOutOfStage);

        const container = createContainer(x, y, s, s);
        container.addChild(a);
        container.addChild(b);

        stage.addChild(container);

        expect(leaf(a).hitTestObject(leaf(b))).toBe(expectedResultOnStage);
    }

    function wrap(x, y, w, h, o) {
        const container = createContainer(x, y, w, h);
        container.addChild(o);
        return container;
    }

    function createBound(x, y, w, h) {
        const sp = new Sprite();
        sp.graphics.beginFill(0, 0.5);
        sp.graphics.drawRect(-w * 0.5, - h * 0.5, w, h);
        sp.x = x;
        sp.y = y;
        return sp;
    }

    it("hitTestObject case1", function()
    {
        const a = createBound(32, 32, 32,32);
        const b = createBound(65, 65, 32, 32);
        constructAndAssert(a, b, false, false);
    });

    it("hitTestObject case2", function()
    {
        const a = createBound(32, 32, 32,32);
        const b = createBound(64, 64, 32, 32);
        a.rotation = b.rotation = 45;
        constructAndAssert(a, b, true, true);
    });

    it("hitTestObject case3", function()
    {
        const a = createBound(36, 36, 32,32);
        const b = createBound(60, 60, 32, 32);
        constructAndAssert(a, b, true, true);
    });

    it("hitTestObject case4", function()
    {
        const a = createBound(26, 50, 32,32);
        const b = createBound(74, 50, 32, 32);
        a.rotation = b.rotation = 45;
        constructAndAssert(a, b, false, false);
    });

    it("hitTestObject case5", function()
    {
        const a = createBound(28, 50, 32,32);
        const b = createBound(72, 50, 32, 32);
        a.rotation = b.rotation = 45;
        constructAndAssert(a, b, true, true);
    });

    it("hitTestObject case6", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(65, 65, 32, 32);
        const c = wrap(32, 32, 64, 64, a);
        constructAndAssert(c, b, false, false);
    });

    it("hitTestObject case7", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(64, 64, 32, 32);
        const c = wrap(32, 32, 64, 64, a);
        constructAndAssert(c, b, true, true);
    });

    it("hitTestObject case8", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(60, 60, 32, 32);
        const c = wrap(36, 36, 64, 64, a);
        constructAndAssert(c, b, true, true);
    });

    it("hitTestObject case9", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(74, 50, 32, 32);
        const c = wrap(26, 50, 64, 64, a);
        a.rotation = b.rotation = 45;
        constructAndAssert(c, b, false, false);
    });

    it("hitTestObject case10", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(72, 50, 32, 32);
        const c = wrap(28, 50, 64, 64, a);
        a.rotation = b.rotation = 45;
        constructAndAssert(c, b, true, true);
    });

    it("hitTestObject case11", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(65, 65, 32, 32);
        const c = wrap(32, 32, 64, 64, a);
        constructAndAssert(a, b, false, false);
    });

    it("hitTestObject case12", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(64, 64, 32, 32);
        const c = wrap(32, 32, 64, 64, a);
        constructAndAssert(a, b, true, false);
    });

    it("hitTestObject case13", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(60, 60, 32, 32);
        const c = wrap(36, 36, 64, 64, a);
        constructAndAssert(a, b, true, false);
    });

    it("hitTestObject case14", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(74, 50, 32, 32);
        const c = wrap(26, 50, 64, 64, a);
        a.rotation = b.rotation = 45;
        constructAndAssert(a, b, false, false);
    });

    it("hitTestObject case15", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(72, 50, 32, 32);
        const c = wrap(28, 50, 64, 64, a);
        a.rotation = b.rotation = 45;
        constructAndAssert(a, b, true, false);
    });

    it("hitTestObject case16", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(65, 65, 32, 32);
        const c = wrap(0, 32, 64, 64, a);
        const d = wrap(32, 0, 64, 64, c);
        constructAndAssert(d, b, false, false);
    });

    it("hitTestObject case17", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(64, 64, 32, 32);
        const c = wrap(0, 32, 64, 64, a);
        const d = wrap(32, 0, 64, 64, c);
        constructAndAssert(d, b, true, true);
    });

    it("hitTestObject case18", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(60, 60, 32, 32);
        const c = wrap(0, 36, 64, 64, a);
        const d = wrap(36, 0, 64, 64, c);
        constructAndAssert(d, b, true, true);
    });

    it("hitTestObject case19", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(74, 50, 32, 32);
        const c = wrap(0, 50, 64, 64, a);
        const d = wrap(26, 0, 64, 64, c);
        a.rotation = b.rotation = 45;
        constructAndAssert(d, b, false, false);
    });

    it("hitTestObject case20", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(72, 50, 32, 32);
        const c = wrap(0, 50, 64, 64, a);
        const d = wrap(28, 0, 64, 64, c);
        a.rotation = b.rotation = 45;
        constructAndAssert(d, b, true, true);
    });

    it("hitTestObject case21", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(65, 65, 32, 32);
        const c = wrap(0, 32, 64, 64, a);
        const d = wrap(32, 0, 64, 64, c);
        constructAndAssert(a, b, false, false);
    });

    it("hitTestObject case22", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(64, 64, 32, 32);
        const c = wrap(0, 32, 64, 64, a);
        const d = wrap(32, 0, 64, 64, c);
        constructAndAssert(a, b, true, false);
    });

    it("hitTestObject case23", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(60, 60, 32, 32);
        const c = wrap(0, 36, 64, 64, a);
        const d = wrap(36, 0, 64, 64, c);
        constructAndAssert(a, c, true, false);
    });

    it("hitTestObject case24", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(74, 50, 32, 32);
        const c = wrap(0, 50, 64, 64, a);
        const d = wrap(26, 0, 64, 64, c);
        a.rotation = b.rotation = 45;
        constructAndAssert(a, b, false, false);
    });

    it("hitTestObject case25", function()
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(72, 50, 32, 32);
        const c = wrap(0, 50, 64, 64, a);
        const d = wrap(28, 0, 64, 64, c);
        a.rotation = b.rotation = 45;
        constructAndAssert(a, b, true, false);
    });

});

describe("DisplayObject.js localToGlobal test", function()
{
    beforeEach(function() {
        window.next2d = new Next2D();
    });

    it("localToGlobal test success case1", function ()
    {
        const root = new Sprite();

        const sprite1 = new Sprite();
        sprite1.x = 400;
        sprite1.y = 400;

        const sprite2 = new Sprite();
        sprite2.x = -200;
        sprite2.y = -200;

        sprite1.addChild(sprite2);
        root.addChild(sprite1);

        const point = sprite1.localToGlobal(new Point(100, 100));
        expect(point.toString()).toBe("(x=500, y=500)");

    });

});

describe("DisplayObject.js globalToLocal test", function()
{

    beforeEach(function() {
        window.next2d = new Next2D();
    });

    it("globalToLocal test success case1", function ()
    {
        const root = new Sprite();

        const sprite1 = new Sprite();
        sprite1.x = 400;
        sprite1.y = 400;

        const sprite2 = new Sprite();
        sprite2.x = -200;
        sprite2.y = -200;

        sprite1.addChild(sprite2);
        root.addChild(sprite1);

        const point = sprite1.globalToLocal(new Point(100, 100));
        expect(point.toString()).toBe("(x=-300, y=-300)");

    });

});

describe("DisplayObject.js mouseX and mouseY test", function()
{

    beforeEach(function() {
        window.next2d = new Next2D();
    });

    it("mouseX and mouseY test success case1", function ()
    {

        const root = next2d.createRootMovieClip(640, 480, 1);

        const player = root.stage._$player;
        player._$stopFlag = false;

        const sprite = root.addChild(new Sprite());
        sprite.x = 50;
        sprite.y = 50;
        sprite.scaleX = 0.5;

        const div = document.getElementById(player.contentElementId);
        const rect = div.getBoundingClientRect();

        // execute
        Util.$event = {
            "pageX": rect.left,
            "pageY": rect.top,
            "preventDefault": function ()
            {
                return false;
            }
        };

        expect(sprite.mouseX).toBe(-100);
        expect(sprite.mouseY).toBe(-50);

        // execute
        Util.$event = {
            "pageX": 640 * player._$scale + rect.left,
            "pageY": 480 * player._$scale + rect.top,
            "preventDefault": function ()
            {
                return false;
            }
        };

        expect(sprite.mouseX <= 1180).toBe(true);
        expect(sprite.mouseY).toBe(430);

    });

});

describe("DisplayObject.js filters test", function()
{

    it("filters test success case1", function ()
    {
        const sprite = new Sprite();
        sprite.x = 10;
        sprite.y = 10;

        const blurFilter = new BlurFilter();
        sprite.filters = [blurFilter];

        expect(sprite.filters.length).toBe(1);
        expect(sprite.filters[0].toString()).toBe(blurFilter.toString());

        sprite.filters = null;

        expect(sprite.filters.length).toBe(0);

    });

});

describe("DisplayObject.js visible test", function()
{

    it("default test case1", function()
    {
        const obj = new DisplayObject();
        expect(obj.visible).toBe(true);
    });

    it("default test case2", function()
    {
        const obj = new DisplayObject();
        obj.visible = null;
        expect(obj.visible).toBe(false);
    });

    it("default test case3", function()
    {
        const obj = new DisplayObject();
        obj.visible = undefined;
        expect(obj.visible).toBe(false);
    });

    it("default test case4", function()
    {
        const obj = new DisplayObject();
        obj.visible = true;
        expect(obj.visible).toBe(true);
    });

    it("default test case5", function()
    {
        const obj = new DisplayObject();
        obj.visible = "";
        expect(obj.visible).toBe(false);
    });

    it("default test case6", function()
    {
        const obj = new DisplayObject();
        obj.visible = "abc";
        expect(obj.visible).toBe(true);
    });

    it("default test case7", function()
    {
        const obj = new DisplayObject();
        obj.visible = 0;
        expect(obj.visible).toBe(false);
    });

    it("default test case8", function()
    {
        const obj = new DisplayObject();
        obj.visible = 1;
        expect(obj.visible).toBe(true);
    });

    it("default test case9", function()
    {
        const obj = new DisplayObject();
        obj.visible = 500;
        expect(obj.visible).toBe(true);
    });

    it("default test case10", function()
    {
        const obj = new DisplayObject();
        obj.visible = -1;
        expect(obj.visible).toBe(true);
    });

    it("default test case11", function()
    {
        const obj = new DisplayObject();
        obj.visible = -500;
        expect(obj.visible).toBe(true);
    });

    it("default test case12", function()
    {
        const obj = new DisplayObject();
        obj.visible = { "a":0 };
        expect(obj.visible).toBe(true);
    });

    it("default test case13", function()
    {
        const obj = new DisplayObject();
        obj.visible = function a() {};
        expect(obj.visible).toBe(true);
    });

    it("default test case14", function()
    {
        const obj = new DisplayObject();
        obj.visible = [1];
        expect(obj.visible).toBe(true);
    });

    it("default test case15", function()
    {
        const obj = new DisplayObject();
        obj.visible = [1,2];
        expect(obj.visible).toBe(true);
    });

    it("default test case16", function()
    {
        const obj = new DisplayObject();
        obj.visible = {};
        expect(obj.visible).toBe(true);
    });

    it("default test case17", function()
    {
        const obj = new DisplayObject();
        obj.visible = { "toString":function () { return 1 } };
        expect(obj.visible).toBe(true);
    });

    it("default test case18", function()
    {
        const obj = new DisplayObject();
        obj.visible = { "toString":function () { return "1" } };
        expect(obj.visible).toBe(true);
    });

    it("default test case19", function()
    {
        const obj = new DisplayObject();
        obj.visible = { "toString":function () { return "1a" } };
        expect(obj.visible).toBe(true);
    });

});

describe("DisplayObject.js alpha test", function()
{

    it("default test case1", function()
    {
        const obj = new DisplayObject();
        expect(obj.alpha).toBe(1);
    });

    it("default test case2", function()
    {
        const obj = new DisplayObject();
        obj.alpha = null;
        expect(obj.alpha).toBe(0);
    });

    it("default test case3", function()
    {
        const obj = new DisplayObject();
        obj.alpha = undefined;
        expect(obj.alpha).toBe(0);
    });

    it("default test case4", function()
    {
        const obj = new DisplayObject();
        obj.alpha = true;
        expect(obj.alpha).toBe(1);
    });

    it("default test case5", function()
    {
        const obj = new DisplayObject();
        obj.alpha = "";
        expect(obj.alpha).toBe(0);
    });

    it("default test case6", function()
    {
        const obj = new DisplayObject();
        obj.alpha = "abc";
        expect(obj.alpha).toBe(0);
    });

    it("default test case7", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0;
        expect(obj.alpha).toBe(0);
    });

    it("default test case8", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1;
        expect(obj.alpha).toBe(1);
    });

    it("default test case9", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 500;
        expect(obj.alpha).toBe(1);
    });

    it("default test case10", function()
    {
        const obj = new DisplayObject();
        obj.alpha = -1;
        expect(obj.alpha).toBe(0);
    });

    it("default test case11", function()
    {
        const obj = new DisplayObject();
        obj.alpha = -500;
        expect(obj.alpha).toBe(0);
    });

    it("default test case12", function()
    {
        const obj = new DisplayObject();
        obj.alpha = { "a":0 };
        expect(obj.alpha).toBe(0);
    });

    it("default test case13", function()
    {
        const obj = new DisplayObject();
        obj.alpha = function a() {};
        expect(obj.alpha).toBe(0);
    });

    it("default test case14", function()
    {
        const obj = new DisplayObject();
        obj.alpha = [1];
        expect(obj.alpha).toBe(1);
    });

    it("default test case15", function()
    {
        const obj = new DisplayObject();
        obj.alpha = [1,2];
        expect(obj.alpha).toBe(0);
    });

    it("default test case16", function()
    {
        const obj = new DisplayObject();
        obj.alpha = {};
        expect(obj.alpha).toBe(0);
    });

    it("default test case17", function()
    {
        const obj = new DisplayObject();
        obj.alpha = { "toString":function () { return 1 } };
        expect(obj.alpha).toBe(1);
    });

    it("default test case18", function()
    {
        const obj = new DisplayObject();
        obj.alpha = { "toString":function () { return "1" } };
        expect(obj.alpha).toBe(1);
    });

    it("default test case19", function()
    {
        const obj = new DisplayObject();
        obj.alpha = { "toString":function () { return "1a" } };
        expect(obj.alpha).toBe(0);
    });

    it("default test case21", function()
    {
        const obj = new DisplayObject();
        obj.alpha = $Math.PI;
        expect(obj.alpha).toBe(1);
    });

    it("default test case22", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1.11111111;
        expect(obj.alpha).toBe(1);
    });

    it("default test case23", function()
    {
        const obj = new DisplayObject();
        obj.alpha = -1.11111111;
        expect(obj.alpha).toBe(0);
    });

    it("default test case24", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 10000000000000000;
        expect(obj.alpha).toBe(1);
    });

    it("default test case25", function()
    {
        const obj = new DisplayObject();
        obj.alpha = -10000000000000000;
        expect(obj.alpha).toBe(0);
    });

});

describe("DisplayObject.js height test", function()
{

    it("default test case1", function()
    {
        const obj = new MovieClip();
        expect(obj.height).toBe(0);
    });

    it("default test case2", function()
    {
        const obj = new MovieClip();
        obj.height = null;
        expect(obj.height).toBe(0);
    });

    it("default test case3", function()
    {
        const obj = new MovieClip();
        obj.height = undefined;
        expect(obj.height).toBe(0);
    });

    it("default test case4", function()
    {
        const obj = new MovieClip();
        obj.height = true;
        expect(obj.height).toBe(0);
    });

    it("default test case5", function()
    {
        const obj = new MovieClip();
        obj.height = "";
        expect(obj.height).toBe(0);
    });

    it("default test case6", function()
    {
        const obj = new MovieClip();
        obj.height = "abc";
        expect(obj.height).toBe(0);
    });

    it("default test case7", function()
    {
        const obj = new MovieClip();
        obj.height = 0;
        expect(obj.height).toBe(0);
    });

    it("default test case8", function()
    {
        const obj = new MovieClip();
        obj.height = 1;
        expect(obj.height).toBe(0);
    });

    it("default test case9", function()
    {
        const obj = new MovieClip();
        obj.height = 500;
        expect(obj.height).toBe(0);
    });

    it("default test case10", function()
    {
        const obj = new MovieClip();
        obj.height = -1;
        expect(obj.height).toBe(0);
    });

    it("default test case11", function()
    {
        const obj = new MovieClip();
        obj.height = -500;
        expect(obj.height).toBe(0);
    });

    it("default test case12", function()
    {
        const obj = new MovieClip();
        obj.height = { "a":0 };
        expect(obj.height).toBe(0);
    });

    it("default test case13", function()
    {
        const obj = new MovieClip();
        obj.height = function a() {};
        expect(obj.height).toBe(0);
    });

    it("default test case14", function()
    {
        const obj = new MovieClip();
        obj.height = [1];
        expect(obj.height).toBe(0);
    });

    it("default test case15", function()
    {
        const obj = new MovieClip();
        obj.height = [1,2];
        expect(obj.height).toBe(0);
    });

    it("default test case16", function()
    {
        const obj = new MovieClip();
        obj.height = {};
        expect(obj.height).toBe(0);
    });

    it("default test case17", function()
    {
        const obj = new MovieClip();
        obj.height = { "toString":function () { return 1 } };
        expect(obj.height).toBe(0);
    });

    it("default test case18", function()
    {
        const obj = new MovieClip();
        obj.height = { "toString":function () { return "1" } };
        expect(obj.height).toBe(0);
    });

    it("default test case19", function()
    {
        const obj = new MovieClip();
        obj.height = { "toString":function () { return "1a" } };
        expect(obj.height).toBe(0);
    });

});

describe("DisplayObject.js rotation test", function()
{

    it("default test case1", function()
    {
        const obj = new DisplayObject();
        expect(obj.rotation).toBe(0);
    });

    it("default test case2", function()
    {
        const obj = new DisplayObject();
        obj.rotation = null;
        expect(obj.rotation).toBe(0);
    });

    it("default test case3", function()
    {
        const obj = new DisplayObject();
        obj.rotation = undefined;
        expect(obj.rotation).toBe(0);
    });

    it("default test case4", function()
    {
        const obj = new DisplayObject();
        obj.rotation = true;
        expect(obj.rotation).toBe(0.9999999465488009);
    });

    it("default test case5", function()
    {
        const obj = new DisplayObject();
        obj.rotation = "";
        expect(obj.rotation).toBe(0);
    });

    it("default test case6", function()
    {
        const obj = new DisplayObject();
        obj.rotation = "abc";
        expect(obj.rotation).toBe(0);
    });

    it("default test case7", function()
    {
        const obj = new DisplayObject();
        obj.rotation = 0;
        expect(obj.rotation).toBe(0);
    });

    it("default test case8", function()
    {
        const obj = new DisplayObject();
        obj.rotation = 1;
        expect(obj.rotation).toBe(0.9999999465488009);
    });

    it("default test case9", function()
    {
        const obj = new DisplayObject();
        obj.rotation = 500;
        expect(obj.rotation).toBe(139.99999868188684);
    });

    it("default test case10", function()
    {
        const obj = new DisplayObject();
        obj.rotation = -1;
        expect(obj.rotation).toBe(-0.9999999465488009);
    });

    it("default test case11", function()
    {
        const obj = new DisplayObject();
        obj.rotation = -500;
        expect(obj.rotation).toBe(-139.99999868188684);
    });

    it("default test case12", function()
    {
        const obj = new DisplayObject();
        obj.rotation = { "a":0 };
        expect(obj.rotation).toBe(0);
    });

    it("default test case13", function()
    {
        const obj = new DisplayObject();
        obj.rotation = function a() {};
        expect(obj.rotation).toBe(0);
    });

    it("default test case14", function()
    {
        const obj = new DisplayObject();
        obj.rotation = [1];
        expect(obj.rotation).toBe(0.9999999465488009);
    });

    it("default test case15", function()
    {
        const obj = new DisplayObject();
        obj.rotation = [1,2];
        expect(obj.rotation).toBe(0);
    });

    it("default test case16", function()
    {
        const obj = new DisplayObject();
        obj.rotation = {};
        expect(obj.rotation).toBe(0);
    });

    it("default test case17", function()
    {
        const obj = new DisplayObject();
        obj.rotation = { "toString":function () { return 1 } };
        expect(obj.rotation).toBe(0.9999999465488009);
    });

    it("default test case18", function()
    {
        const obj = new DisplayObject();
        obj.rotation = { "toString":function () { return "1" } };
        expect(obj.rotation).toBe(0.9999999465488009);
    });

    it("default test case19", function()
    {
        const obj = new DisplayObject();
        obj.rotation = { "toString":function () { return "1a" } };
        expect(obj.rotation).toBe(0);
    });

});

describe("DisplayObject.js scaleX test", function()
{

    it("default test case1", function()
    {
        const obj = new DisplayObject();
        expect(obj.scaleX).toBe(1);
    });

    it("default test case2", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = null;
        expect(obj.scaleX).toBe(0);
    });

    it("default test case3", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = undefined;
        expect(obj.scaleX).toBe(0);
    });

    it("default test case4", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = true;
        expect(obj.scaleX).toBe(1);
    });

    it("default test case5", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = "";
        expect(obj.scaleX).toBe(0);
    });

    it("default test case6", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = "abc";
        expect(obj.scaleX).toBe(0);
    });

    it("default test case7", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = 0;
        expect(obj.scaleX).toBe(0);
    });

    it("default test case8", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = 1;
        expect(obj.scaleX).toBe(1);
    });

    it("default test case9", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = 500;
        expect(obj.scaleX).toBe(500);
    });

    it("default test case10", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = -1;
        expect(obj.scaleX).toBe(-1);
    });

    it("default test case11", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = -500;
        expect(obj.scaleX).toBe(-500);
    });

    it("default test case12", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = { "a":0 };
        expect(obj.scaleX).toBe(0);
    });

    it("default test case13", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = function a() {};
        expect(obj.scaleX).toBe(0);
    });

    it("default test case14", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = [1];
        expect(obj.scaleX).toBe(1);
    });

    it("default test case15", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = [1,2];
        expect(obj.scaleX).toBe(0);
    });

    it("default test case16", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = {};
        expect(obj.scaleX).toBe(0);
    });

    it("default test case17", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = { "toString":function () { return 1 } };
        expect(obj.scaleX).toBe(1);
    });

    it("default test case18", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = { "toString":function () { return "1" } };
        expect(obj.scaleX).toBe(1);
    });

    it("default test case19", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = { "toString":function () { return "1a" } };
        expect(obj.scaleX).toBe(0);
    });

});

describe("DisplayObject.js scaleY test", function()
{

    it("default test case1", function()
    {
        const obj = new DisplayObject();
        expect(obj.scaleY).toBe(1);
    });

    it("default test case2", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = null;
        expect(obj.scaleY).toBe(0);
    });

    it("default test case3", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = undefined;
        expect(obj.scaleY).toBe(0);
    });

    it("default test case4", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = true;
        expect(obj.scaleY).toBe(1);
    });

    it("default test case5", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = "";
        expect(obj.scaleY).toBe(0);
    });

    it("default test case6", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = "abc";
        expect(obj.scaleY).toBe(0);
    });

    it("default test case7", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = 0;
        expect(obj.scaleY).toBe(0);
    });

    it("default test case8", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = 1;
        expect(obj.scaleY).toBe(1);
    });

    it("default test case9", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = 500;
        expect(obj.scaleY).toBe(500);
    });

    it("default test case10", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = -1;
        expect(obj.scaleY).toBe(-1);
    });

    it("default test case11", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = -500;
        expect(obj.scaleY).toBe(-500);
    });

    it("default test case12", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = { "a":0 };
        expect(obj.scaleY).toBe(0);
    });

    it("default test case13", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = function a() {};
        expect(obj.scaleY).toBe(0);
    });

    it("default test case14", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = [1];
        expect(obj.scaleY).toBe(1);
    });

    it("default test case15", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = [1,2];
        expect(obj.scaleY).toBe(0);
    });

    it("default test case16", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = {};
        expect(obj.scaleY).toBe(0);
    });

    it("default test case17", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = { "toString":function () { return 1 } };
        expect(obj.scaleY).toBe(1);
    });

    it("default test case18", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = { "toString":function () { return "1" } };
        expect(obj.scaleY).toBe(1);
    });

    it("default test case19", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = { "toString":function () { return "1a" } };
        expect(obj.scaleY).toBe(0);
    });

});

describe("DisplayObject.js width test", function()
{

    it("default test case1", function()
    {
        const obj = new MovieClip();
        expect(obj.width).toBe(0);
    });

    it("default test case2", function()
    {
        const obj = new MovieClip();
        obj.width = null;
        expect(obj.width).toBe(0);
    });

    it("default test case3", function()
    {
        const obj = new MovieClip();
        obj.width = undefined;
        expect(obj.width).toBe(0);
    });

    it("default test case4", function()
    {
        const obj = new MovieClip();
        obj.width = true;
        expect(obj.width).toBe(0);
    });

    it("default test case5", function()
    {
        const obj = new MovieClip();
        obj.width = "";
        expect(obj.width).toBe(0);
    });

    it("default test case6", function()
    {
        const obj = new MovieClip();
        obj.width = "abc";
        expect(obj.width).toBe(0);
    });

    it("default test case7", function()
    {
        const obj = new MovieClip();
        obj.width = 0;
        expect(obj.width).toBe(0);
    });

    it("default test case8", function()
    {
        const obj = new MovieClip();
        obj.width = 1;
        expect(obj.width).toBe(0);
    });

    it("default test case9", function()
    {
        const obj = new MovieClip();
        obj.width = 500;
        expect(obj.width).toBe(0);
    });

    it("default test case10", function()
    {
        const obj = new MovieClip();
        obj.width = -1;
        expect(obj.width).toBe(0);
    });

    it("default test case11", function()
    {
        const obj = new MovieClip();
        obj.width = -500;
        expect(obj.width).toBe(0);
    });

    it("default test case12", function()
    {
        const obj = new MovieClip();
        obj.width = { "a":0 };
        expect(obj.width).toBe(0);
    });

    it("default test case13", function()
    {
        const obj = new MovieClip();
        obj.width = function a() {};
        expect(obj.width).toBe(0);
    });

    it("default test case14", function()
    {
        const obj = new MovieClip();
        obj.width = [1];
        expect(obj.width).toBe(0);
    });

    it("default test case15", function()
    {
        const obj = new MovieClip();
        obj.width = [1,2];
        expect(obj.width).toBe(0);
    });

    it("default test case16", function()
    {
        const obj = new MovieClip();
        obj.width = {};
        expect(obj.width).toBe(0);
    });

    it("default test case17", function()
    {
        const obj = new MovieClip();
        obj.width = { "toString":function () { return 1 } };
        expect(obj.width).toBe(0);
    });

    it("default test case18", function()
    {
        const obj = new MovieClip();
        obj.width = { "toString":function () { return "1" } };
        expect(obj.width).toBe(0);
    });

    it("default test case19", function()
    {
        const obj = new MovieClip();
        obj.width = { "toString":function () { return "1a" } };
        expect(obj.width).toBe(0);
    });

});

describe("DisplayObject.js x test", function()
{

    it("default test case1", function()
    {
        const obj = new DisplayObject();
        expect(obj.x).toBe(0);
    });

    it("default test case2", function()
    {
        const obj = new DisplayObject();
        obj.x = null;
        expect(obj.x).toBe(0);
    });

    it("default test case3", function()
    {
        const obj = new DisplayObject();
        obj.x = undefined;
        expect(obj.x).toBe(0);
    });

    it("default test case4", function()
    {
        const obj = new DisplayObject();
        obj.x = true;
        expect(obj.x).toBe(1);
    });

    it("default test case5", function()
    {
        const obj = new DisplayObject();
        obj.x = "";
        expect(obj.x).toBe(0);
    });

    it("default test case6", function()
    {
        const obj = new DisplayObject();
        obj.x = "abc";
        expect(obj.x).toBe(0);
    });

    it("default test case7", function()
    {
        const obj = new DisplayObject();
        obj.x = 0;
        expect(obj.x).toBe(0);
    });

    it("default test case8", function()
    {
        const obj = new DisplayObject();
        obj.x = 1;
        expect(obj.x).toBe(1);
    });

    it("default test case9", function()
    {
        const obj = new DisplayObject();
        obj.x = 500;
        expect(obj.x).toBe(500);
    });

    it("default test case10", function()
    {
        const obj = new DisplayObject();
        obj.x = -1;
        expect(obj.x).toBe(-1);
    });

    it("default test case11", function()
    {
        const obj = new DisplayObject();
        obj.x = -500;
        expect(obj.x).toBe(-500);
    });

    it("default test case12", function()
    {
        const obj = new DisplayObject();
        obj.x = { "a":0 };
        expect(obj.x).toBe(0);
    });

    it("default test case13", function()
    {
        const obj = new DisplayObject();
        obj.x = function a() {};
        expect(obj.x).toBe(0);
    });

    it("default test case14", function()
    {
        const obj = new DisplayObject();
        obj.x = [1];
        expect(obj.x).toBe(1);
    });

    it("default test case15", function()
    {
        const obj = new DisplayObject();
        obj.x = [1,2];
        expect(obj.x).toBe(0);
    });

    it("default test case16", function()
    {
        const obj = new DisplayObject();
        obj.x = {};
        expect(obj.x).toBe(0);
    });

    it("default test case17", function()
    {
        const obj = new DisplayObject();
        obj.x = { "toString":function () { return 1 } };
        expect(obj.x).toBe(1);
    });

    it("default test case18", function()
    {
        const obj = new DisplayObject();
        obj.x = { "toString":function () { return "1" } };
        expect(obj.x).toBe(1);
    });

    it("default test case19", function()
    {
        const obj = new DisplayObject();
        obj.x = { "toString":function () { return "1a" } };
        expect(obj.x).toBe(0);
    });

});

describe("DisplayObject.js y test", function()
{

    it("default test case1", function()
    {
        const obj = new DisplayObject();
        expect(obj.y).toBe(0);
    });

    it("default test case2", function()
    {
        const obj = new DisplayObject();
        obj.y = null;
        expect(obj.y).toBe(0);
    });

    it("default test case3", function()
    {
        const obj = new DisplayObject();
        obj.y = undefined;
        expect(obj.y).toBe(0);
    });

    it("default test case4", function()
    {
        const obj = new DisplayObject();
        obj.y = true;
        expect(obj.y).toBe(1);
    });

    it("default test case5", function()
    {
        const obj = new DisplayObject();
        obj.y = "";
        expect(obj.y).toBe(0);
    });

    it("default test case6", function()
    {
        const obj = new DisplayObject();
        obj.y = "abc";
        expect(obj.y).toBe(0);
    });

    it("default test case7", function()
    {
        const obj = new DisplayObject();
        obj.y = 0;
        expect(obj.y).toBe(0);
    });

    it("default test case8", function()
    {
        const obj = new DisplayObject();
        obj.y = 1;
        expect(obj.y).toBe(1);
    });

    it("default test case9", function()
    {
        const obj = new DisplayObject();
        obj.y = 500;
        expect(obj.y).toBe(500);
    });

    it("default test case10", function()
    {
        const obj = new DisplayObject();
        obj.y = -1;
        expect(obj.y).toBe(-1);
    });

    it("default test case11", function()
    {
        const obj = new DisplayObject();
        obj.y = -500;
        expect(obj.y).toBe(-500);
    });

    it("default test case12", function()
    {
        const obj = new DisplayObject();
        obj.y = { "a":0 };
        expect(obj.y).toBe(0);
    });

    it("default test case13", function()
    {
        const obj = new DisplayObject();
        obj.y = function a() {};
        expect(obj.y).toBe(0);
    });

    it("default test case14", function()
    {
        const obj = new DisplayObject();
        obj.y = [1];
        expect(obj.y).toBe(1);
    });

    it("default test case15", function()
    {
        const obj = new DisplayObject();
        obj.y = [1,2];
        expect(obj.y).toBe(0);
    });

    it("default test case16", function()
    {
        const obj = new DisplayObject();
        obj.y = {};
        expect(obj.y).toBe(0);
    });

    it("default test case17", function()
    {
        const obj = new DisplayObject();
        obj.y = { "toString":function () { return 1 } };
        expect(obj.y).toBe(1);
    });

    it("default test case18", function()
    {
        const obj = new DisplayObject();
        obj.y = { "toString":function () { return "1" } };
        expect(obj.y).toBe(1);
    });

    it("default test case19", function()
    {
        const obj = new DisplayObject();
        obj.y = { "toString":function () { return "1a" } };
        expect(obj.y).toBe(0);
    });
});

describe("DisplayObject.js LocalVariable test", function()
{
    it("default test case1", function()
    {
        const mc1 = new MovieClip();
        const mc2 = new MovieClip();

        mc1.setLocalVariable("test", 10);
        mc2.setLocalVariable("test", 20);

        expect(mc1.getLocalVariable("test")).toBe(10);
        expect(mc2.getLocalVariable("test")).toBe(20);

        mc1.deleteLocalVariable("test", 10);

        expect(mc1.hasLocalVariable("test")).toBe(false);
        expect(mc2.hasLocalVariable("test")).toBe(true);
    });
});

describe("DisplayObject.js GlobalVariable test", function()
{
    it("default test case1", function()
    {
        const mc1 = new MovieClip();
        const mc2 = new MovieClip();

        mc1.setGlobalVariable("test", 10);

        expect(mc1.getGlobalVariable("test")).toBe(10);
        expect(mc2.getGlobalVariable("test")).toBe(10);

        mc1.deleteGlobalVariable("test", 10);

        expect(mc1.hasGlobalVariable("test")).toBe(false);
        expect(mc2.hasGlobalVariable("test")).toBe(false);
    });
});


describe("DisplayObject.js _$id test", function()
{

    it("_$id default case", function()
    {
        const object = new DisplayObject();
        expect(object._$id).toBe(-1);
    });

});