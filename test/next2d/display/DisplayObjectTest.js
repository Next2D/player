
describe("DisplayObject.js toString test", function()
{
    it("toString test success", function()
    {
        const obj = new DisplayObject();
        expect(obj.toString()).toBe("[object DisplayObject]");
    });

});

describe("DisplayObject.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(Util.$toString(DisplayObject)).toBe("[class DisplayObject]");
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
            .lineStyle(20, 0x000000, 1.0, true, DisplayObject.SQUARE, JointStyle.BEVEL, 10)
            .moveTo(0, 0)
            .lineTo(10, 0);

        expect(shape.getBounds(shape).toString()).toBe("(x=-10, y=-10, w=30, h=20)");

    });

    it("line point zero test case 45", function ()
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, true, DisplayObject.SQUARE, JointStyle.BEVEL, 10)
            .moveTo(0, 0)
            .lineTo(10, 10);

        expect(shape.getBounds(shape).toString()).toBe("(x=-10, y=-10, w=27.071067811865476, h=27.071067811865476)");

    });

    it("line point zero test case 90", function ()
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, true, DisplayObject.SQUARE, JointStyle.BEVEL, 10)
            .moveTo(0, 0)
            .lineTo(0, 10);

        expect(shape.getBounds(shape).toString()).toBe("(x=-10, y=-10, w=20, h=30)");

    });

    it("line point zero test case 135", function ()
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, true, DisplayObject.SQUARE, JointStyle.BEVEL, 10)
            .moveTo(0, 0)
            .lineTo(-10, 10);

        expect(shape.getBounds(shape).toString()).toBe("(x=-17.071067811865476, y=-10, w=27.071067811865476, h=27.071067811865476)");

    });

    it("line point zero test case 180", function ()
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, true, DisplayObject.SQUARE, JointStyle.BEVEL, 10)
            .moveTo(0, 0)
            .lineTo(-10, 0);

        expect(shape.getBounds(shape).toString()).toBe("(x=-20, y=-10, w=30, h=20)");

    });

    it("line point zero test case -45", function ()
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, true, DisplayObject.SQUARE, JointStyle.BEVEL, 10)
            .moveTo(0, 0)
            .lineTo(10, -10);

        expect(shape.getBounds(shape).toString()).toBe("(x=-10, y=-17.071067811865476, w=27.071067811865476, h=27.071067811865476)'");

    });

    it("line point zero test case -90", function ()
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, true, DisplayObject.SQUARE, JointStyle.BEVEL, 10)
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
            .lineStyle(20, 0x000000, 1.0, true, DisplayObject.SQUARE, JointStyle.BEVEL, 10)
            .moveTo(0, 0)
            .lineTo(-10, -10);

        expect(shape.getBounds(shape).toString()).toBe("(x=-17.071067811865476, y=-17.071067811865476, w=27.071067811865476, h=27.071067811865476)");

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
    //         .lineStyle(20, 0x000000, 1.0, true, LineScaleMode.NORMAL, DisplayObject.SQUARE, JointStyle.MITER, 10)
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
    //         .lineStyle(20, 0x000000, 1.0, true, LineScaleMode.NORMAL, DisplayObject.SQUARE, JointStyle.MITER, 10)
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

        expect(bounds.toString()).toBe("(x=-10, y=-10, w=114.47213595499959, h=120)");

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
        textField.autoSize = TextFieldAutoSize.LEFT;
        textField.x = 200;
        textField.y = 200;
        textField.border     = true;
        textField.background = true;

        textField.text = "aaa\naaa\naaa\naaa";

        root.addChild(textField);

        const bounds = textField.getBounds(root);
        expect(bounds.x).toBe(200);
        expect(bounds.y).toBe(200);

        // TODO pipeline
        const width = bounds.width | 0;
        expect(width === 18 || width === 19 || width === 20).toBe(true);
        expect(bounds.height | 0).toBe(57);
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

    it("mouseX and mouseY test success case1", function ()
    {
        Util.$stages  = [];
        Util.$players = [];

        const root = new Swf2js()
            .createRootMovieClip(640, 480, 1);

        const sprite = root.addChild(new Sprite());
        sprite.x = 50;
        sprite.y = 50;
        sprite.scaleX = 0.5;

        // execute
        Util.$event = {
            "pageX": 8,
            "pageY": 8,
            "preventDefault": function () {}
        };

        expect(sprite.mouseX).toBe(-100);
        expect(sprite.mouseY).toBe(-50);

        // execute
        Util.$event = {
            "pageX": 648,
            "pageY": 488,
            "preventDefault": function () {}
        };

        expect(sprite.mouseX).toBe(1180);
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

describe("DisplayObject.js cacheAsBitmap test", function()
{

    it("default test case1", function()
    {
        const obj = new DisplayObject();
        expect(obj.cacheAsBitmap).toBe(false);
    });

    it("default test case2", function()
    {
        const obj = new DisplayObject();
        obj.cacheAsBitmap = null;
        expect(obj.cacheAsBitmap).toBe(false);
    });

    it("default test case3", function()
    {
        const obj = new DisplayObject();
        obj.cacheAsBitmap = undefined;
        expect(obj.cacheAsBitmap).toBe(false);
    });

    it("default test case4", function()
    {
        const obj = new DisplayObject();
        obj.cacheAsBitmap = true;
        expect(obj.cacheAsBitmap).toBe(true);
    });

    it("default test case5", function()
    {
        const obj = new DisplayObject();
        obj.cacheAsBitmap = "";
        expect(obj.cacheAsBitmap).toBe(false);
    });

    it("default test case6", function()
    {
        const obj = new DisplayObject();
        obj.cacheAsBitmap = "abc";
        expect(obj.cacheAsBitmap).toBe(true);
    });

    it("default test case7", function()
    {
        const obj = new DisplayObject();
        obj.cacheAsBitmap = 0;
        expect(obj.cacheAsBitmap).toBe(false);
    });

    it("default test case8", function()
    {
        const obj = new DisplayObject();
        obj.cacheAsBitmap = 1;
        expect(obj.cacheAsBitmap).toBe(true);
    });

    it("default test case9", function()
    {
        const obj = new DisplayObject();
        obj.cacheAsBitmap = 500;
        expect(obj.cacheAsBitmap).toBe(true);
    });

    it("default test case10", function()
    {
        const obj = new DisplayObject();
        obj.cacheAsBitmap = -1;
        expect(obj.cacheAsBitmap).toBe(true);
    });

    it("default test case11", function()
    {
        const obj = new DisplayObject();
        obj.cacheAsBitmap = -500;
        expect(obj.cacheAsBitmap).toBe(true);
    });

    it("default test case12", function()
    {
        const obj = new DisplayObject();
        obj.cacheAsBitmap = { "a":0 };
        expect(obj.cacheAsBitmap).toBe(true);
    });

    it("default test case13", function()
    {
        const obj = new DisplayObject();
        obj.cacheAsBitmap = function a() {};
        expect(obj.cacheAsBitmap).toBe(true);
    });

    it("default test case14", function()
    {
        const obj = new DisplayObject();
        obj.cacheAsBitmap = [1];
        expect(obj.cacheAsBitmap).toBe(true);
    });

    it("default test case15", function()
    {
        const obj = new DisplayObject();
        obj.cacheAsBitmap = [1,2];
        expect(obj.cacheAsBitmap).toBe(true);
    });

    it("default test case16", function()
    {
        const obj = new DisplayObject();
        obj.cacheAsBitmap = {};
        expect(obj.cacheAsBitmap).toBe(true);
    });

    it("default test case17", function()
    {
        const obj = new DisplayObject();
        obj.cacheAsBitmap = { "toString":function () { return 1 } };
        expect(obj.cacheAsBitmap).toBe(true);
    });

    it("default test case18", function()
    {
        const obj = new DisplayObject();
        obj.cacheAsBitmap = { "toString":function () { return "1" } };
        expect(obj.cacheAsBitmap).toBe(true);
    });

    it("default test case19", function()
    {
        const obj = new DisplayObject();
        obj.cacheAsBitmap = { "toString":function () { return "1a" } };
        expect(obj.cacheAsBitmap).toBe(true);
    });

    it("default test case20", function()
    {
        const obj = new DisplayObject();
        obj.cacheAsBitmap = new XML("<a>100</a>");
        expect(obj.cacheAsBitmap).toBe(true);
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

    it("default test case20", function()
    {
        const obj = new DisplayObject();
        obj.visible = new XML("<a>100</a>");
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
        expect(obj.alpha).toBe(-12);
    });

    it("default test case10", function()
    {
        const obj = new DisplayObject();
        obj.alpha = -1;
        expect(obj.alpha).toBe(-1);
    });

    it("default test case11", function()
    {
        const obj = new DisplayObject();
        obj.alpha = -500;
        expect(obj.alpha).toBe(12);

        // const value = -1 * Math.PI;
        //
        // const str = value.toString(2);
        //
        // const num = str.split('.')[1];
        //
        //
        //
        //
        // value = Util.$toFloat16(value);
        //
        // expect(value).toBe(1);
        // expect(str).toBe(2);
        // expect(num).toBe(3);
        // expect(num.substr(0,1)).toBe(4);
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

    it("default test case20", function()
    {
        const obj = new DisplayObject();
        obj.alpha = new XML("<a>100</a>");
        expect(obj.alpha).toBe(100);
    });

    it("default test case21", function()
    {
        const obj = new DisplayObject();
        obj.alpha = Util.$PI;
        expect(obj.alpha).toBe(3.140625);
    });

    it("default test case22", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1.11111111;
        expect(obj.alpha).toBe(1.109375);
    });

    it("default test case23", function()
    {
        const obj = new DisplayObject();
        obj.alpha = -1.11111111;
        expect(obj.alpha).toBe(-1.109375);
    });

    it("default test case24", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 10000000000000000;
        expect(obj.alpha).toBe(0);
    });

    it("default test case25", function()
    {
        const obj = new DisplayObject();
        obj.alpha = -10000000000000000;
        expect(obj.alpha).toBe(0);
    });

});

describe("DisplayObject.js alpha decimal test", function()
{

    it("default test case1", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8832893008366227;
        expect(obj.alpha).toBe(0.8828125);
    });

    it("default test case2", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5522632361389697;
        expect(obj.alpha).toBe(0.55078125);
    });

    it("default test case3", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.12048360193148255;
        expect(obj.alpha).toBe(0.1171875);
    });

    it("default test case4", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7548370724543929;
        expect(obj.alpha).toBe(0.75390625);
    });

    it("default test case5", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8835925702005625;
        expect(obj.alpha).toBe(0.8828125);
    });

    it("default test case6", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8211931460537016;
        expect(obj.alpha).toBe(0.8203125);
    });

    it("default test case7", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6293210689909756;
        expect(obj.alpha).toBe(0.62890625);
    });

    it("default test case8", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3103896011598408;
        expect(obj.alpha).toBe(0.30859375);
    });

    it("default test case9", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7884013559669256;
        expect(obj.alpha).toBe(0.78515625);
    });

    it("default test case10", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.37597701139748096;
        expect(obj.alpha).toBe(0.375);
    });

    it("default test case11", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3860435844399035;
        expect(obj.alpha).toBe(0.3828125);
    });

    it("default test case12", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.11877393443137407;
        expect(obj.alpha).toBe(0.1171875);
    });

    it("default test case13", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5797391193918884;
        expect(obj.alpha).toBe(0.578125);
    });

    it("default test case14", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8871577056124806;
        expect(obj.alpha).toBe(0.88671875);
    });

    it("default test case15", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8882563253864646;
        expect(obj.alpha).toBe(0.88671875);
    });

    it("default test case16", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.02784070186316967;
        expect(obj.alpha).toBe(0.02734375);
    });

    it("default test case17", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.22240505274385214;
        expect(obj.alpha).toBe(0.21875);
    });

    it("default test case18", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.14195381198078394;
        expect(obj.alpha).toBe(0.140625);
    });

    it("default test case19", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5055202492512763;
        expect(obj.alpha).toBe(0.50390625);
    });

    it("default test case20", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.02668507630005479;
        expect(obj.alpha).toBe(0.0234375);
    });

    it("default test case21", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5522245252504945;
        expect(obj.alpha).toBe(0.55078125);
    });

    it("default test case22", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6595762991346419;
        expect(obj.alpha).toBe(0.65625);
    });

    it("default test case23", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8112633335404098;
        expect(obj.alpha).toBe(0.80859375);
    });

    it("default test case24", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.28223389852792025;
        expect(obj.alpha).toBe(0.28125);
    });

    it("default test case25", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4606512584723532;
        expect(obj.alpha).toBe(0.45703125);
    });

    it("default test case26", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7929927734658122;
        expect(obj.alpha).toBe(0.79296875);
    });

    it("default test case27", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2443031775765121;
        expect(obj.alpha).toBe(0.2421875);
    });

    it("default test case28", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6042034719139338;
        expect(obj.alpha).toBe(0.6015625);
    });

    it("default test case29", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8636030894704163;
        expect(obj.alpha).toBe(0.86328125);
    });

    it("default test case30", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.14813476474955678;
        expect(obj.alpha).toBe(0.14453125);
    });

    it("default test case31", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8016955386847258;
        expect(obj.alpha).toBe(0.80078125);
    });

    it("default test case32", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7411954812705517;
        expect(obj.alpha).toBe(0.73828125);
    });

    it("default test case33", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.47121890680864453;
        expect(obj.alpha).toBe(0.46875);
    });

    it("default test case34", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7656764094717801;
        expect(obj.alpha).toBe(0.765625);
    });

    it("default test case35", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.01124934758991003;
        expect(obj.alpha).toBe(0.0078125);
    });

    it("default test case36", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7184074171818793;
        expect(obj.alpha).toBe(0.71484375);
    });

    it("default test case37", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8465911950916052;
        expect(obj.alpha).toBe(0.84375);
    });

    it("default test case38", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.952963818795979;
        expect(obj.alpha).toBe(0.94921875);
    });

    it("default test case39", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.18583790306001902;
        expect(obj.alpha).toBe(0.18359375);
    });

    it("default test case40", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9474182329140604;
        expect(obj.alpha).toBe(0.9453125);
    });

    it("default test case41", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1957384468987584;
        expect(obj.alpha).toBe(0.1953125);
    });

    it("default test case42", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4427877408452332;
        expect(obj.alpha).toBe(0.44140625);
    });

    it("default test case43", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.11236615804955363;
        expect(obj.alpha).toBe(0.109375);
    });

    it("default test case44", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6649165241979063;
        expect(obj.alpha).toBe(0.6640625);
    });

    it("default test case45", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9757154770195484;
        expect(obj.alpha).toBe(0.97265625);
    });

    it("default test case46", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.36114136362448335;
        expect(obj.alpha).toBe(0.359375);
    });

    it("default test case47", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8953263470903039;
        expect(obj.alpha).toBe(0.89453125);
    });

    it("default test case48", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8347276020795107;
        expect(obj.alpha).toBe(0.83203125);
    });

    it("default test case49", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.14111511129885912;
        expect(obj.alpha).toBe(0.140625);
    });

    it("default test case50", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6773124332539737;
        expect(obj.alpha).toBe(0.67578125);
    });

    it("default test case51", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.496790190692991;
        expect(obj.alpha).toBe(0.49609375);
    });

    it("default test case52", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9926100880838931;
        expect(obj.alpha).toBe(0.9921875);
    });

    it("default test case53", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.42064037499949336;
        expect(obj.alpha).toBe(0.41796875);
    });

    it("default test case54", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5395298949442804;
        expect(obj.alpha).toBe(0.5390625);
    });

    it("default test case55", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.52731449669227;
        expect(obj.alpha).toBe(0.5234375);
    });

    it("default test case56", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.42806512070819736;
        expect(obj.alpha).toBe(0.42578125);
    });

    it("default test case57", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9928888943977654;
        expect(obj.alpha).toBe(0.9921875);
    });

    it("default test case58", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.41988925030454993;
        expect(obj.alpha).toBe(0.41796875);
    });

    it("default test case59", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8531829249113798;
        expect(obj.alpha).toBe(0.8515625);
    });

    it("default test case60", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5839234627783298;
        expect(obj.alpha).toBe(0.58203125);
    });

    it("default test case61", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.06204064702615142;
        expect(obj.alpha).toBe(0.05859375);
    });

    it("default test case62", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9309361213818192;
        expect(obj.alpha).toBe(0.9296875);
    });

    it("default test case63", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.13577180076390505;
        expect(obj.alpha).toBe(0.1328125);
    });

    it("default test case64", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9835568885318935;
        expect(obj.alpha).toBe(0.98046875);
    });

    it("default test case65", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8634911170229316;
        expect(obj.alpha).toBe(0.86328125);
    });

    it("default test case66", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.37358081666752696;
        expect(obj.alpha).toBe(0.37109375);
    });

    it("default test case67", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1570385810919106;
        expect(obj.alpha).toBe(0.15625);
    });

    it("default test case68", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7630934342741966;
        expect(obj.alpha).toBe(0.76171875);
    });

    it("default test case69", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9002567576244473;
        expect(obj.alpha).toBe(0.8984375);
    });

    it("default test case70", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3564776456914842;
        expect(obj.alpha).toBe(0.35546875);
    });

    it("default test case71", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1884435168467462;
        expect(obj.alpha).toBe(0.1875);
    });

    it("default test case72", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2761372630484402;
        expect(obj.alpha).toBe(0.2734375);
    });

    it("default test case73", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9046399933286011;
        expect(obj.alpha).toBe(0.90234375);
    });

    it("default test case74", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.521835015155375;
        expect(obj.alpha).toBe(0.51953125);
    });

    it("default test case75", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3610940985381603;
        expect(obj.alpha).toBe(0.359375);
    });

    it("default test case76", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.016896767541766167;
        expect(obj.alpha).toBe(0.015625);
    });

    it("default test case77", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9361098185181618;
        expect(obj.alpha).toBe(0.93359375);
    });

    it("default test case78", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.773137588519603;
        expect(obj.alpha).toBe(0.76953125);
    });

    it("default test case79", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8578186980448663;
        expect(obj.alpha).toBe(0.85546875);
    });

    it("default test case80", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.07492906600236893;
        expect(obj.alpha).toBe(0.07421875);
    });

    it("default test case81", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3469164250418544;
        expect(obj.alpha).toBe(0.34375);
    });

    it("default test case82", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5165021340362728;
        expect(obj.alpha).toBe(0.515625);
    });

    it("default test case83", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7340679713524878;
        expect(obj.alpha).toBe(0.73046875);
    });

    it("default test case84", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.557509905193001;
        expect(obj.alpha).toBe(0.5546875);
    });

    it("default test case85", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.39219693560153246;
        expect(obj.alpha).toBe(0.390625);
    });

    it("default test case86", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.22802129853516817;
        expect(obj.alpha).toBe(0.2265625);
    });

    it("default test case87", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6340131107717752;
        expect(obj.alpha).toBe(0.6328125);
    });

    it("default test case88", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.11100691743195057;
        expect(obj.alpha).toBe(0.109375);
    });

    it("default test case89", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5508637907914817;
        expect(obj.alpha).toBe(0.55078125);
    });

    it("default test case90", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.04253232944756746;
        expect(obj.alpha).toBe(0.0390625);
    });

    it("default test case91", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.26423168554902077;
        expect(obj.alpha).toBe(0.26171875);
    });

    it("default test case92", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9595725680701435;
        expect(obj.alpha).toBe(0.95703125);
    });

    it("default test case93", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.27541998121887445;
        expect(obj.alpha).toBe(0.2734375);
    });

    it("default test case94", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.22899598209187388;
        expect(obj.alpha).toBe(0.2265625);
    });

    it("default test case95", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6465671970508993;
        expect(obj.alpha).toBe(0.64453125);
    });

    it("default test case96", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.024231582414358854;
        expect(obj.alpha).toBe(0.0234375);
    });

    it("default test case97", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5131293837912381;
        expect(obj.alpha).toBe(0.51171875);
    });

    it("default test case98", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.23180646682158113;
        expect(obj.alpha).toBe(0.23046875);
    });

    it("default test case99", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.18334723496809602;
        expect(obj.alpha).toBe(0.1796875);
    });

    it("default test case100", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.09646192379295826;
        expect(obj.alpha).toBe(0.09375);
    });

    it("default test case101", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9719213368371129;
        expect(obj.alpha).toBe(0.96875);
    });

    it("default test case102", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7769636907614768;
        expect(obj.alpha).toBe(0.7734375);
    });

    it("default test case103", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8123468053527176;
        expect(obj.alpha).toBe(0.80859375);
    });

    it("default test case104", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9622791558504105;
        expect(obj.alpha).toBe(0.9609375);
    });

    it("default test case105", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8462427197955549;
        expect(obj.alpha).toBe(0.84375);
    });

    it("default test case106", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2955872896127403;
        expect(obj.alpha).toBe(0.29296875);
    });

    it("default test case107", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6737204641103745;
        expect(obj.alpha).toBe(0.671875);
    });

    it("default test case108", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.037327736616134644;
        expect(obj.alpha).toBe(0.03515625);
    });

    it("default test case109", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.12195542780682445;
        expect(obj.alpha).toBe(0.12109375);
    });

    it("default test case110", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3145644497126341;
        expect(obj.alpha).toBe(0.3125);
    });

    it("default test case111", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2352499500848353;
        expect(obj.alpha).toBe(0.234375);
    });

    it("default test case112", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.428834758233279;
        expect(obj.alpha).toBe(0.42578125);
    });

    it("default test case113", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.07311994675546885;
        expect(obj.alpha).toBe(0.0703125);
    });

    it("default test case114", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5376589577645063;
        expect(obj.alpha).toBe(0.53515625);
    });

    it("default test case115", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2893453664146364;
        expect(obj.alpha).toBe(0.2890625);
    });

    it("default test case116", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.29894047789275646;
        expect(obj.alpha).toBe(0.296875);
    });

    it("default test case117", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2948172972537577;
        expect(obj.alpha).toBe(0.29296875);
    });

    it("default test case118", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8806509086862206;
        expect(obj.alpha).toBe(0.87890625);
    });

    it("default test case119", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9302949481643736;
        expect(obj.alpha).toBe(0.9296875);
    });

    it("default test case120", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6345587270334363;
        expect(obj.alpha).toBe(0.6328125);
    });

    it("default test case121", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.45329682901501656;
        expect(obj.alpha).toBe(0.453125);
    });

    it("default test case122", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5877371970564127;
        expect(obj.alpha).toBe(0.5859375);
    });

    it("default test case123", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6789579694159329;
        expect(obj.alpha).toBe(0.67578125);
    });

    it("default test case124", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1525920727290213;
        expect(obj.alpha).toBe(0.15234375);
    });

    it("default test case125", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.010110137518495321;
        expect(obj.alpha).toBe(0.0078125);
    });

    it("default test case126", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4390374617651105;
        expect(obj.alpha).toBe(0.4375);
    });

    it("default test case127", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8025043439120054;
        expect(obj.alpha).toBe(0.80078125);
    });

    it("default test case128", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3131542941555381;
        expect(obj.alpha).toBe(0.3125);
    });

    it("default test case129", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.27877615112811327;
        expect(obj.alpha).toBe(0.27734375);
    });

    it("default test case130", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3447970221750438;
        expect(obj.alpha).toBe(0.34375);
    });

    it("default test case131", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.17889944789931178;
        expect(obj.alpha).toBe(0.17578125);
    });

    it("default test case132", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6675481204874814;
        expect(obj.alpha).toBe(0.6640625);
    });

    it("default test case133", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7526148674078286;
        expect(obj.alpha).toBe(0.75);
    });

    it("default test case134", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3272436880506575;
        expect(obj.alpha).toBe(0.32421875);
    });

    it("default test case135", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.28983767749741673;
        expect(obj.alpha).toBe(0.2890625);
    });

    it("default test case136", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6735951863229275;
        expect(obj.alpha).toBe(0.671875);
    });

    it("default test case137", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2097662938758731;
        expect(obj.alpha).toBe(0.20703125);
    });

    it("default test case138", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9138172389939427;
        expect(obj.alpha).toBe(0.91015625);
    });

    it("default test case139", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4684225465171039;
        expect(obj.alpha).toBe(0.46484375);
    });

    it("default test case140", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5894475323148072;
        expect(obj.alpha).toBe(0.5859375);
    });

    it("default test case141", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.32446900429204106;
        expect(obj.alpha).toBe(0.32421875);
    });

    it("default test case142", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.969913003500551;
        expect(obj.alpha).toBe(0.96875);
    });

    it("default test case143", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7434891033917665;
        expect(obj.alpha).toBe(0.7421875);
    });

    it("default test case144", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8865939434617758;
        expect(obj.alpha).toBe(0.8828125);
    });

    it("default test case145", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.11399521958082914;
        expect(obj.alpha).toBe(0.11328125);
    });

    it("default test case146", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5660912441089749;
        expect(obj.alpha).toBe(0.5625);
    });

    it("default test case147", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9222354460507631;
        expect(obj.alpha).toBe(0.921875);
    });

    it("default test case148", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6306222723796964;
        expect(obj.alpha).toBe(0.62890625);
    });

    it("default test case149", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.053860854357481;
        expect(obj.alpha).toBe(0.05078125);
    });

    it("default test case150", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6834515356458724;
        expect(obj.alpha).toBe(0.6796875);
    });

    it("default test case151", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.15937725408002734;
        expect(obj.alpha).toBe(0.15625);
    });

    it("default test case152", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4709377959370613;
        expect(obj.alpha).toBe(0.46875);
    });

    it("default test case153", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4445443991571665;
        expect(obj.alpha).toBe(0.44140625);
    });

    it("default test case154", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.860960328951478;
        expect(obj.alpha).toBe(0.859375);
    });

    it("default test case155", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.41674634255468845;
        expect(obj.alpha).toBe(0.4140625);
    });

    it("default test case156", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8618927211500704;
        expect(obj.alpha).toBe(0.859375);
    });

    it("default test case157", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9306728653609753;
        expect(obj.alpha).toBe(0.9296875);
    });

    it("default test case158", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6156046879477799;
        expect(obj.alpha).toBe(0.61328125);
    });

    it("default test case159", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.502236288972199;
        expect(obj.alpha).toBe(0.5);
    });

    it("default test case160", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.19154093181714416;
        expect(obj.alpha).toBe(0.19140625);
    });

    it("default test case161", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7340003391727805;
        expect(obj.alpha).toBe(0.73046875);
    });

    it("default test case162", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.39845494041219354;
        expect(obj.alpha).toBe(0.3984375);
    });

    it("default test case163", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8927217461168766;
        expect(obj.alpha).toBe(0.890625);
    });

    it("default test case164", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9096299912780523;
        expect(obj.alpha).toBe(0.90625);
    });

    it("default test case165", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5224331533536315;
        expect(obj.alpha).toBe(0.51953125);
    });

    it("default test case166", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.01916029443964362;
        expect(obj.alpha).toBe(0.015625);
    });

    it("default test case167", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5865328195504844;
        expect(obj.alpha).toBe(0.5859375);
    });

    it("default test case168", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.524214340839535;
        expect(obj.alpha).toBe(0.5234375);
    });

    it("default test case169", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.04293972626328468;
        expect(obj.alpha).toBe(0.0390625);
    });

    it("default test case170", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4667078973725438;
        expect(obj.alpha).toBe(0.46484375);
    });

    it("default test case171", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.42514230217784643;
        expect(obj.alpha).toBe(0.421875);
    });

    it("default test case172", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8391327508725226;
        expect(obj.alpha).toBe(0.8359375);
    });

    it("default test case173", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.907562408130616;
        expect(obj.alpha).toBe(0.90625);
    });

    it("default test case174", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.32916296645998955;
        expect(obj.alpha).toBe(0.328125);
    });

    it("default test case175", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.29083137679845095;
        expect(obj.alpha).toBe(0.2890625);
    });

    it("default test case176", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5417855838313699;
        expect(obj.alpha).toBe(0.5390625);
    });

    it("default test case177", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.18637917563319206;
        expect(obj.alpha).toBe(0.18359375);
    });

    it("default test case178", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.21498286398127675;
        expect(obj.alpha).toBe(0.21484375);
    });

    it("default test case179", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.21263953484594822;
        expect(obj.alpha).toBe(0.2109375);
    });

    it("default test case180", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7514127907343209;
        expect(obj.alpha).toBe(0.75);
    });

    it("default test case181", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.33523116959258914;
        expect(obj.alpha).toBe(0.33203125);
    });

    it("default test case182", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4306347155943513;
        expect(obj.alpha).toBe(0.4296875);
    });

    it("default test case183", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.341544842813164;
        expect(obj.alpha).toBe(0.33984375);
    });

    it("default test case184", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8507895627990365;
        expect(obj.alpha).toBe(0.84765625);
    });

    it("default test case185", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.49342916533350945;
        expect(obj.alpha).toBe(0.4921875);
    });

    it("default test case186", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.08740269392728806;
        expect(obj.alpha).toBe(0.0859375);
    });

    it("default test case187", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4183252062648535;
        expect(obj.alpha).toBe(0.41796875);
    });

    it("default test case188", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9969044364988804;
        expect(obj.alpha).toBe(0.99609375);
    });

    it("default test case189", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.957352431025356;
        expect(obj.alpha).toBe(0.95703125);
    });

    it("default test case190", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.781913373619318;
        expect(obj.alpha).toBe(0.78125);
    });

    it("default test case191", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.727960292249918;
        expect(obj.alpha).toBe(0.7265625);
    });

    it("default test case192", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6436117361299694;
        expect(obj.alpha).toBe(0.640625);
    });

    it("default test case193", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.23012691643089056;
        expect(obj.alpha).toBe(0.2265625);
    });

    it("default test case194", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4460448739118874;
        expect(obj.alpha).toBe(0.4453125);
    });

    it("default test case195", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6497288993559778;
        expect(obj.alpha).toBe(0.6484375);
    });

    it("default test case196", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6758787431754172;
        expect(obj.alpha).toBe(0.67578125);
    });

    it("default test case197", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7439982020296156;
        expect(obj.alpha).toBe(0.7421875);
    });

    it("default test case198", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9981675869785249;
        expect(obj.alpha).toBe(0.99609375);
    });

    it("default test case199", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2332345168106258;
        expect(obj.alpha).toBe(0.23046875);
    });

    it("default test case200", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.03630100330337882;
        expect(obj.alpha).toBe(0.03515625);
    });

    it("default test case201", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6719382503069937;
        expect(obj.alpha).toBe(0.671875);
    });

    it("default test case202", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5969215095974505;
        expect(obj.alpha).toBe(0.59375);
    });

    it("default test case203", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.14726989064365625;
        expect(obj.alpha).toBe(0.14453125);
    });

    it("default test case204", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.43118731724098325;
        expect(obj.alpha).toBe(0.4296875);
    });

    it("default test case205", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.09007724095135927;
        expect(obj.alpha).toBe(0.08984375);
    });

    it("default test case206", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6031664512120187;
        expect(obj.alpha).toBe(0.6015625);
    });

    it("default test case207", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.21679502446204424;
        expect(obj.alpha).toBe(0.21484375);
    });

    it("default test case208", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5752894594334066;
        expect(obj.alpha).toBe(0.57421875);
    });

    it("default test case209", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9830781281925738;
        expect(obj.alpha).toBe(0.98046875);
    });

    it("default test case210", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.38162202201783657;
        expect(obj.alpha).toBe(0.37890625);
    });

    it("default test case211", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.13702832348644733;
        expect(obj.alpha).toBe(0.13671875);
    });

    it("default test case212", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4264282900840044;
        expect(obj.alpha).toBe(0.42578125);
    });

    it("default test case213", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.574896817561239;
        expect(obj.alpha).toBe(0.57421875);
    });

    it("default test case214", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6038933228701353;
        expect(obj.alpha).toBe(0.6015625);
    });

    it("default test case215", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4540942367166281;
        expect(obj.alpha).toBe(0.453125);
    });

    it("default test case216", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.28519106935709715;
        expect(obj.alpha).toBe(0.28515625);
    });

    it("default test case217", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.07490914734080434;
        expect(obj.alpha).toBe(0.07421875);
    });

    it("default test case218", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6452524340711534;
        expect(obj.alpha).toBe(0.64453125);
    });

    it("default test case219", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8747667744755745;
        expect(obj.alpha).toBe(0.87109375);
    });

    it("default test case220", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6940730554051697;
        expect(obj.alpha).toBe(0.69140625);
    });

    it("default test case221", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6640214533545077;
        expect(obj.alpha).toBe(0.66015625);
    });

    it("default test case222", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.09376778500154614;
        expect(obj.alpha).toBe(0.09375);
    });

    it("default test case223", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.015134019311517477;
        expect(obj.alpha).toBe(0.01171875);
    });

    it("default test case224", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.30113226640969515;
        expect(obj.alpha).toBe(0.30078125);
    });

    it("default test case225", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9407881242223084;
        expect(obj.alpha).toBe(0.9375);
    });

    it("default test case226", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1975011546164751;
        expect(obj.alpha).toBe(0.1953125);
    });

    it("default test case227", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6568939108401537;
        expect(obj.alpha).toBe(0.65625);
    });

    it("default test case228", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1560693164356053;
        expect(obj.alpha).toBe(0.15234375);
    });

    it("default test case229", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2915835897438228;
        expect(obj.alpha).toBe(0.2890625);
    });

    it("default test case230", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8071725638583302;
        expect(obj.alpha).toBe(0.8046875);
    });

    it("default test case231", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7568900212645531;
        expect(obj.alpha).toBe(0.75390625);
    });

    it("default test case232", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7656242283992469;
        expect(obj.alpha).toBe(0.76171875);
    });

    it("default test case233", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9178803917020559;
        expect(obj.alpha).toBe(0.9140625);
    });

    it("default test case234", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7355261258780956;
        expect(obj.alpha).toBe(0.734375);
    });

    it("default test case235", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9077467690221965;
        expect(obj.alpha).toBe(0.90625);
    });

    it("default test case236", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9179467973299325;
        expect(obj.alpha).toBe(0.9140625);
    });

    it("default test case237", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6730728214606643;
        expect(obj.alpha).toBe(0.671875);
    });

    it("default test case238", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2977496311068535;
        expect(obj.alpha).toBe(0.296875);
    });

    it("default test case239", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4918409842066467;
        expect(obj.alpha).toBe(0.48828125);
    });

    it("default test case240", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9374533691443503;
        expect(obj.alpha).toBe(0.93359375);
    });

    it("default test case241", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.13798257056623697;
        expect(obj.alpha).toBe(0.13671875);
    });

    it("default test case242", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8899128148332238;
        expect(obj.alpha).toBe(0.88671875);
    });

    it("default test case243", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2800628370605409;
        expect(obj.alpha).toBe(0.27734375);
    });

    it("default test case244", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.35567787243053317;
        expect(obj.alpha).toBe(0.35546875);
    });

    it("default test case245", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6295260451734066;
        expect(obj.alpha).toBe(0.62890625);
    });

    it("default test case246", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7872755923308432;
        expect(obj.alpha).toBe(0.78515625);
    });

    it("default test case247", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8747378643602133;
        expect(obj.alpha).toBe(0.87109375);
    });

    it("default test case248", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.03002878464758396;
        expect(obj.alpha).toBe(0.02734375);
    });

    it("default test case249", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9906797208823264;
        expect(obj.alpha).toBe(0.98828125);
    });

    it("default test case250", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.607614429667592;
        expect(obj.alpha).toBe(0.60546875);
    });

    it("default test case251", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6193600599654019;
        expect(obj.alpha).toBe(0.6171875);
    });

    it("default test case252", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9537313883192837;
        expect(obj.alpha).toBe(0.953125);
    });

    it("default test case253", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9521264550276101;
        expect(obj.alpha).toBe(0.94921875);
    });

    it("default test case254", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9469319782219827;
        expect(obj.alpha).toBe(0.9453125);
    });

    it("default test case255", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.590113241225481;
        expect(obj.alpha).toBe(0.58984375);
    });

    it("default test case256", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7824328038841486;
        expect(obj.alpha).toBe(0.78125);
    });

    it("default test case257", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8349334830418229;
        expect(obj.alpha).toBe(0.83203125);
    });

    it("default test case258", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3340232181362808;
        expect(obj.alpha).toBe(0.33203125);
    });

    it("default test case259", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8468268704600632;
        expect(obj.alpha).toBe(0.84375);
    });

    it("default test case260", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4604222043417394;
        expect(obj.alpha).toBe(0.45703125);
    });

    it("default test case261", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3861148087307811;
        expect(obj.alpha).toBe(0.3828125);
    });

    it("default test case262", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9910947633907199;
        expect(obj.alpha).toBe(0.98828125);
    });

    it("default test case263", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.22078909259289503;
        expect(obj.alpha).toBe(0.21875);
    });

    it("default test case264", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.137169330380857;
        expect(obj.alpha).toBe(0.13671875);
    });

    it("default test case265", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.22849490400403738;
        expect(obj.alpha).toBe(0.2265625);
    });

    it("default test case266", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8641063836403191;
        expect(obj.alpha).toBe(0.86328125);
    });

    it("default test case267", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.008062376640737057;
        expect(obj.alpha).toBe(0.0078125);
    });

    it("default test case268", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9815579699352384;
        expect(obj.alpha).toBe(0.98046875);
    });

    it("default test case269", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.19589873729273677;
        expect(obj.alpha).toBe(0.1953125);
    });

    it("default test case270", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.17551894346252084;
        expect(obj.alpha).toBe(0.171875);
    });

    it("default test case271", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8973481538705528;
        expect(obj.alpha).toBe(0.89453125);
    });

    it("default test case272", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.887067976873368;
        expect(obj.alpha).toBe(0.88671875);
    });

    it("default test case273", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.37555774580687284;
        expect(obj.alpha).toBe(0.375);
    });

    it("default test case274", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7268824689090252;
        expect(obj.alpha).toBe(0.7265625);
    });

    it("default test case275", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4586184872314334;
        expect(obj.alpha).toBe(0.45703125);
    });

    it("default test case276", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.22885780734941363;
        expect(obj.alpha).toBe(0.2265625);
    });

    it("default test case277", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.029968569986522198;
        expect(obj.alpha).toBe(0.02734375);
    });

    it("default test case278", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5601241462863982;
        expect(obj.alpha).toBe(0.55859375);
    });

    it("default test case279", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5614514434710145;
        expect(obj.alpha).toBe(0.55859375);
    });

    it("default test case280", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8360365475527942;
        expect(obj.alpha).toBe(0.8359375);
    });

    it("default test case281", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.29456059029325843;
        expect(obj.alpha).toBe(0.29296875);
    });

    it("default test case282", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7758577964268625;
        expect(obj.alpha).toBe(0.7734375);
    });

    it("default test case283", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.909010595176369;
        expect(obj.alpha).toBe(0.90625);
    });

    it("default test case284", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.14405791414901614;
        expect(obj.alpha).toBe(0.140625);
    });

    it("default test case285", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3151561925187707;
        expect(obj.alpha).toBe(0.3125);
    });

    it("default test case286", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9022337193600833;
        expect(obj.alpha).toBe(0.8984375);
    });

    it("default test case287", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8345231702551246;
        expect(obj.alpha).toBe(0.83203125);
    });

    it("default test case288", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3966487222351134;
        expect(obj.alpha).toBe(0.39453125);
    });

    it("default test case289", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.029685277957469225;
        expect(obj.alpha).toBe(0.02734375);
    });

    it("default test case290", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.10942588839679956;
        expect(obj.alpha).toBe(0.109375);
    });

    it("default test case291", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.12683795718476176;
        expect(obj.alpha).toBe(0.125);
    });

    it("default test case292", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.018664557486772537;
        expect(obj.alpha).toBe(0.015625);
    });

    it("default test case293", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4608499673195183;
        expect(obj.alpha).toBe(0.45703125);
    });

    it("default test case294", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.40366216842085123;
        expect(obj.alpha).toBe(0.40234375);
    });

    it("default test case295", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4475292512215674;
        expect(obj.alpha).toBe(0.4453125);
    });

    it("default test case296", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.06370669277384877;
        expect(obj.alpha).toBe(0.0625);
    });

    it("default test case297", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.49044192815199494;
        expect(obj.alpha).toBe(0.48828125);
    });

    it("default test case298", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6252580829896033;
        expect(obj.alpha).toBe(0.625);
    });

    it("default test case299", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9030940812081099;
        expect(obj.alpha).toBe(0.90234375);
    });

    it("default test case300", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.43629827396944165;
        expect(obj.alpha).toBe(0.43359375);
    });

    it("default test case301", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.35274670273065567;
        expect(obj.alpha).toBe(0.3515625);
    });

    it("default test case302", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4124563070945442;
        expect(obj.alpha).toBe(0.41015625);
    });

    it("default test case303", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.38650118093937635;
        expect(obj.alpha).toBe(0.3828125);
    });

    it("default test case304", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9468768574297428;
        expect(obj.alpha).toBe(0.9453125);
    });

    it("default test case305", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8229970829561353;
        expect(obj.alpha).toBe(0.8203125);
    });

    it("default test case306", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5273050921969116;
        expect(obj.alpha).toBe(0.5234375);
    });

    it("default test case307", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4691686062142253;
        expect(obj.alpha).toBe(0.46875);
    });

    it("default test case308", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8120704372413456;
        expect(obj.alpha).toBe(0.80859375);
    });

    it("default test case309", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.19872005935758352;
        expect(obj.alpha).toBe(0.1953125);
    });

    it("default test case310", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.49241292709484696;
        expect(obj.alpha).toBe(0.4921875);
    });

    it("default test case311", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.46416469383984804;
        expect(obj.alpha).toBe(0.4609375);
    });

    it("default test case312", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7347740163095295;
        expect(obj.alpha).toBe(0.734375);
    });

    it("default test case313", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7780538410879672;
        expect(obj.alpha).toBe(0.77734375);
    });

    it("default test case314", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.15494449576362967;
        expect(obj.alpha).toBe(0.15234375);
    });

    it("default test case315", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5551388165913522;
        expect(obj.alpha).toBe(0.5546875);
    });

    it("default test case316", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5918849660083652;
        expect(obj.alpha).toBe(0.58984375);
    });

    it("default test case317", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8724950458854437;
        expect(obj.alpha).toBe(0.87109375);
    });

    it("default test case318", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4290355583652854;
        expect(obj.alpha).toBe(0.42578125);
    });

    it("default test case319", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.14570797979831696;
        expect(obj.alpha).toBe(0.14453125);
    });

    it("default test case320", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.28359957598149776;
        expect(obj.alpha).toBe(0.28125);
    });

    it("default test case321", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.09163920627906919;
        expect(obj.alpha).toBe(0.08984375);
    });

    it("default test case322", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.37178017385303974;
        expect(obj.alpha).toBe(0.37109375);
    });

    it("default test case323", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.22499618120491505;
        expect(obj.alpha).toBe(0.22265625);
    });

    it("default test case324", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3422135910950601;
        expect(obj.alpha).toBe(0.33984375);
    });

    it("default test case325", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.500055676791817;
        expect(obj.alpha).toBe(0.5);
    });

    it("default test case326", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.14610892068594694;
        expect(obj.alpha).toBe(0.14453125);
    });

    it("default test case327", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.11548879789188504;
        expect(obj.alpha).toBe(0.11328125);
    });

    it("default test case328", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8311104327440262;
        expect(obj.alpha).toBe(0.828125);
    });

    it("default test case329", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.30276682088151574;
        expect(obj.alpha).toBe(0.30078125);
    });

    it("default test case330", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5852847290225327;
        expect(obj.alpha).toBe(0.58203125);
    });

    it("default test case331", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6152633735910058;
        expect(obj.alpha).toBe(0.61328125);
    });

    it("default test case332", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.21652666619047523;
        expect(obj.alpha).toBe(0.21484375);
    });

    it("default test case333", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9058144679293036;
        expect(obj.alpha).toBe(0.90234375);
    });

    it("default test case334", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.040018790401518345;
        expect(obj.alpha).toBe(0.0390625);
    });

    it("default test case335", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6546377269551158;
        expect(obj.alpha).toBe(0.65234375);
    });

    it("default test case336", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.0693195415660739;
        expect(obj.alpha).toBe(0.06640625);
    });

    it("default test case337", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5216347905807197;
        expect(obj.alpha).toBe(0.51953125);
    });

    it("default test case338", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2507627001032233;
        expect(obj.alpha).toBe(0.25);
    });

    it("default test case339", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1733947484754026;
        expect(obj.alpha).toBe(0.171875);
    });

    it("default test case340", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4899900588206947;
        expect(obj.alpha).toBe(0.48828125);
    });

    it("default test case341", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.797707193531096;
        expect(obj.alpha).toBe(0.796875);
    });

    it("default test case342", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6529447822831571;
        expect(obj.alpha).toBe(0.65234375);
    });

    it("default test case343", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6167013379745185;
        expect(obj.alpha).toBe(0.61328125);
    });

    it("default test case344", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.03496318915858865;
        expect(obj.alpha).toBe(0.03125);
    });

    it("default test case345", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.14837026968598366;
        expect(obj.alpha).toBe(0.14453125);
    });

    it("default test case346", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7353426492772996;
        expect(obj.alpha).toBe(0.734375);
    });

    it("default test case347", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.26939430041238666;
        expect(obj.alpha).toBe(0.265625);
    });

    it("default test case348", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8177434024401009;
        expect(obj.alpha).toBe(0.81640625);
    });

    it("default test case349", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1862630071118474;
        expect(obj.alpha).toBe(0.18359375);
    });

    it("default test case350", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.20759320491924882;
        expect(obj.alpha).toBe(0.20703125);
    });

    it("default test case351", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4404132072813809;
        expect(obj.alpha).toBe(0.4375);
    });

    it("default test case352", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.08769174525514245;
        expect(obj.alpha).toBe(0.0859375);
    });

    it("default test case353", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6420841407962143;
        expect(obj.alpha).toBe(0.640625);
    });

    it("default test case354", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8050896688364446;
        expect(obj.alpha).toBe(0.8046875);
    });

    it("default test case355", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6166181140579283;
        expect(obj.alpha).toBe(0.61328125);
    });

    it("default test case356", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.431828283239156;
        expect(obj.alpha).toBe(0.4296875);
    });

    it("default test case357", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.16937022982165217;
        expect(obj.alpha).toBe(0.16796875);
    });

    it("default test case358", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.16280694073066115;
        expect(obj.alpha).toBe(0.16015625);
    });

    it("default test case359", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8500862950459123;
        expect(obj.alpha).toBe(0.84765625);
    });

    it("default test case360", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7269321382045746;
        expect(obj.alpha).toBe(0.7265625);
    });

    it("default test case361", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2784980582073331;
        expect(obj.alpha).toBe(0.27734375);
    });

    it("default test case362", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2661718763411045;
        expect(obj.alpha).toBe(0.265625);
    });

    it("default test case363", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.842710402328521;
        expect(obj.alpha).toBe(0.83984375);
    });

    it("default test case364", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5120421280153096;
        expect(obj.alpha).toBe(0.51171875);
    });

    it("default test case365", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9482788825407624;
        expect(obj.alpha).toBe(0.9453125);
    });

    it("default test case366", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5401243292726576;
        expect(obj.alpha).toBe(0.5390625);
    });

    it("default test case367", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6550076184794307;
        expect(obj.alpha).toBe(0.65234375);
    });

    it("default test case368", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.980670319404453;
        expect(obj.alpha).toBe(0.98046875);
    });

    it("default test case369", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2917011925019324;
        expect(obj.alpha).toBe(0.2890625);
    });

    it("default test case370", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.934085845015943;
        expect(obj.alpha).toBe(0.93359375);
    });

    it("default test case371", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2644910616800189;
        expect(obj.alpha).toBe(0.26171875);
    });

    it("default test case372", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2800632673315704;
        expect(obj.alpha).toBe(0.27734375);
    });

    it("default test case373", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6398822613991797;
        expect(obj.alpha).toBe(0.63671875);
    });

    it("default test case374", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.08513115299865603;
        expect(obj.alpha).toBe(0.08203125);
    });

    it("default test case375", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.814028216060251;
        expect(obj.alpha).toBe(0.8125);
    });

    it("default test case376", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.11768280575051904;
        expect(obj.alpha).toBe(0.1171875);
    });

    it("default test case377", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.09994888724759221;
        expect(obj.alpha).toBe(0.09765625);
    });

    it("default test case378", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7114121215417981;
        expect(obj.alpha).toBe(0.7109375);
    });

    it("default test case379", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.06638594204559922;
        expect(obj.alpha).toBe(0.0625);
    });

    it("default test case380", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.22130068996921182;
        expect(obj.alpha).toBe(0.21875);
    });

    it("default test case381", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7201686785556376;
        expect(obj.alpha).toBe(0.71875);
    });

    it("default test case382", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6818609698675573;
        expect(obj.alpha).toBe(0.6796875);
    });

    it("default test case383", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4959076242521405;
        expect(obj.alpha).toBe(0.4921875);
    });

    it("default test case384", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7533157784491777;
        expect(obj.alpha).toBe(0.75);
    });

    it("default test case385", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.12328478367999196;
        expect(obj.alpha).toBe(0.12109375);
    });

    it("default test case386", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5240554711781442;
        expect(obj.alpha).toBe(0.5234375);
    });

    it("default test case387", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5428390488959849;
        expect(obj.alpha).toBe(0.5390625);
    });

    it("default test case388", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9448348102159798;
        expect(obj.alpha).toBe(0.94140625);
    });

    it("default test case389", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.940111231058836;
        expect(obj.alpha).toBe(0.9375);
    });

    it("default test case390", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7668549255467951;
        expect(obj.alpha).toBe(0.765625);
    });

    it("default test case391", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8400679575279355;
        expect(obj.alpha).toBe(0.83984375);
    });

    it("default test case392", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8523379736579955;
        expect(obj.alpha).toBe(0.8515625);
    });

    it("default test case393", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6947697964496911;
        expect(obj.alpha).toBe(0.69140625);
    });

    it("default test case394", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.039136290550231934;
        expect(obj.alpha).toBe(0.0390625);
    });

    it("default test case395", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.42215037159621716;
        expect(obj.alpha).toBe(0.421875);
    });

    it("default test case396", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9941729628480971;
        expect(obj.alpha).toBe(0.9921875);
    });

    it("default test case397", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1616534902714193;
        expect(obj.alpha).toBe(0.16015625);
    });

    it("default test case398", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.15136164473369718;
        expect(obj.alpha).toBe(0.1484375);
    });

    it("default test case399", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3023871807381511;
        expect(obj.alpha).toBe(0.30078125);
    });

    it("default test case400", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.34140246780589223;
        expect(obj.alpha).toBe(0.33984375);
    });

    it("default test case401", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8648789832368493;
        expect(obj.alpha).toBe(0.86328125);
    });

    it("default test case402", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5400513652712107;
        expect(obj.alpha).toBe(0.5390625);
    });

    it("default test case403", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9546126276254654;
        expect(obj.alpha).toBe(0.953125);
    });

    it("default test case404", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3678081179969013;
        expect(obj.alpha).toBe(0.3671875);
    });

    it("default test case405", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1388714495114982;
        expect(obj.alpha).toBe(0.13671875);
    });

    it("default test case406", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.745927435811609;
        expect(obj.alpha).toBe(0.7421875);
    });

    it("default test case407", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5129419527947903;
        expect(obj.alpha).toBe(0.51171875);
    });

    it("default test case408", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.382550192065537;
        expect(obj.alpha).toBe(0.37890625);
    });

    it("default test case409", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8620294970460236;
        expect(obj.alpha).toBe(0.859375);
    });

    it("default test case410", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3596378485672176;
        expect(obj.alpha).toBe(0.359375);
    });

    it("default test case411", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8735134582966566;
        expect(obj.alpha).toBe(0.87109375);
    });

    it("default test case412", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8708618097007275;
        expect(obj.alpha).toBe(0.8671875);
    });

    it("default test case413", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3981662420555949;
        expect(obj.alpha).toBe(0.39453125);
    });

    it("default test case414", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8047757968306541;
        expect(obj.alpha).toBe(0.8046875);
    });

    it("default test case415", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2604680983349681;
        expect(obj.alpha).toBe(0.2578125);
    });

    it("default test case416", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.740880352910608;
        expect(obj.alpha).toBe(0.73828125);
    });

    it("default test case417", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5133136375807226;
        expect(obj.alpha).toBe(0.51171875);
    });

    it("default test case418", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.05110422847792506;
        expect(obj.alpha).toBe(0.05078125);
    });

    it("default test case419", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.21167735941708088;
        expect(obj.alpha).toBe(0.2109375);
    });

    it("default test case420", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.04147498030215502;
        expect(obj.alpha).toBe(0.0390625);
    });

    it("default test case421", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.07727485056966543;
        expect(obj.alpha).toBe(0.07421875);
    });

    it("default test case422", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.34566778503358364;
        expect(obj.alpha).toBe(0.34375);
    });

    it("default test case423", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3193129566498101;
        expect(obj.alpha).toBe(0.31640625);
    });

    it("default test case424", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.34477169113233685;
        expect(obj.alpha).toBe(0.34375);
    });

    it("default test case425", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.959105160087347;
        expect(obj.alpha).toBe(0.95703125);
    });

    it("default test case426", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.08223135769367218;
        expect(obj.alpha).toBe(0.08203125);
    });

    it("default test case427", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.0810199067927897;
        expect(obj.alpha).toBe(0.078125);
    });

    it("default test case428", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5373017359524965;
        expect(obj.alpha).toBe(0.53515625);
    });

    it("default test case429", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6085720867849886;
        expect(obj.alpha).toBe(0.60546875);
    });

    it("default test case430", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9065622808411717;
        expect(obj.alpha).toBe(0.90625);
    });

    it("default test case431", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.42889607371762395;
        expect(obj.alpha).toBe(0.42578125);
    });

    it("default test case432", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2981541845947504;
        expect(obj.alpha).toBe(0.296875);
    });

    it("default test case433", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.24873885652050376;
        expect(obj.alpha).toBe(0.24609375);
    });

    it("default test case434", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4298633988946676;
        expect(obj.alpha).toBe(0.4296875);
    });

    it("default test case435", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7007670048624277;
        expect(obj.alpha).toBe(0.69921875);
    });

    it("default test case436", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8295751144178212;
        expect(obj.alpha).toBe(0.828125);
    });

    it("default test case437", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3443674761801958;
        expect(obj.alpha).toBe(0.34375);
    });

    it("default test case438", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.13978451257571578;
        expect(obj.alpha).toBe(0.13671875);
    });

    it("default test case439", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3835316328331828;
        expect(obj.alpha).toBe(0.3828125);
    });

    it("default test case440", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.18361254688352346;
        expect(obj.alpha).toBe(0.18359375);
    });

    it("default test case441", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.12919320538640022;
        expect(obj.alpha).toBe(0.12890625);
    });

    it("default test case442", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.29074450209736824;
        expect(obj.alpha).toBe(0.2890625);
    });

    it("default test case443", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7481146072968841;
        expect(obj.alpha).toBe(0.74609375);
    });

    it("default test case444", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3874930185265839;
        expect(obj.alpha).toBe(0.38671875);
    });

    it("default test case445", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.31289916671812534;
        expect(obj.alpha).toBe(0.3125);
    });

    it("default test case446", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9684770195744932;
        expect(obj.alpha).toBe(0.96484375);
    });

    it("default test case447", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2191633228212595;
        expect(obj.alpha).toBe(0.21875);
    });

    it("default test case448", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.42478038603439927;
        expect(obj.alpha).toBe(0.421875);
    });

    it("default test case449", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7016330440528691;
        expect(obj.alpha).toBe(0.69921875);
    });

    it("default test case450", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4809911847114563;
        expect(obj.alpha).toBe(0.48046875);
    });

    it("default test case451", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6515687755309045;
        expect(obj.alpha).toBe(0.6484375);
    });

    it("default test case452", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.08099858881905675;
        expect(obj.alpha).toBe(0.078125);
    });

    it("default test case453", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.945824527181685;
        expect(obj.alpha).toBe(0.9453125);
    });

    it("default test case454", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.39772935025393963;
        expect(obj.alpha).toBe(0.39453125);
    });

    it("default test case455", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5370316812768579;
        expect(obj.alpha).toBe(0.53515625);
    });

    it("default test case456", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9683610405772924;
        expect(obj.alpha).toBe(0.96484375);
    });

    it("default test case457", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.17680565267801285;
        expect(obj.alpha).toBe(0.17578125);
    });

    it("default test case458", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8440913995727897;
        expect(obj.alpha).toBe(0.84375);
    });

    it("default test case459", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3514021523296833;
        expect(obj.alpha).toBe(0.34765625);
    });

    it("default test case460", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9594366289675236;
        expect(obj.alpha).toBe(0.95703125);
    });

    it("default test case461", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4764615437015891;
        expect(obj.alpha).toBe(0.47265625);
    });

    it("default test case462", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.20999137591570616;
        expect(obj.alpha).toBe(0.20703125);
    });

    it("default test case463", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6521479832008481;
        expect(obj.alpha).toBe(0.6484375);
    });

    it("default test case464", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2701271618716419;
        expect(obj.alpha).toBe(0.26953125);
    });

    it("default test case465", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4284455291926861;
        expect(obj.alpha).toBe(0.42578125);
    });

    it("default test case466", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1966311908327043;
        expect(obj.alpha).toBe(0.1953125);
    });

    it("default test case467", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7145249131135643;
        expect(obj.alpha).toBe(0.7109375);
    });

    it("default test case468", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8469452438876033;
        expect(obj.alpha).toBe(0.84375);
    });

    it("default test case469", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.39749332470819354;
        expect(obj.alpha).toBe(0.39453125);
    });

    it("default test case470", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9545098440721631;
        expect(obj.alpha).toBe(0.953125);
    });

    it("default test case471", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.43561413045972586;
        expect(obj.alpha).toBe(0.43359375);
    });

    it("default test case472", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6832684623077512;
        expect(obj.alpha).toBe(0.6796875);
    });

    it("default test case473", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5698501821607351;
        expect(obj.alpha).toBe(0.56640625);
    });

    it("default test case474", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9014189494773746;
        expect(obj.alpha).toBe(0.8984375);
    });

    it("default test case475", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.31201269244775176;
        expect(obj.alpha).toBe(0.30859375);
    });

    it("default test case476", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9518477795645595;
        expect(obj.alpha).toBe(0.94921875);
    });

    it("default test case477", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6615991177968681;
        expect(obj.alpha).toBe(0.66015625);
    });

    it("default test case478", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.20583576476201415;
        expect(obj.alpha).toBe(0.203125);
    });

    it("default test case479", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.24867881974205375;
        expect(obj.alpha).toBe(0.24609375);
    });

    it("default test case480", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7046039793640375;
        expect(obj.alpha).toBe(0.703125);
    });

    it("default test case481", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.643251521512866;
        expect(obj.alpha).toBe(0.640625);
    });

    it("default test case482", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8860416240058839;
        expect(obj.alpha).toBe(0.8828125);
    });

    it("default test case483", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6956188231706619;
        expect(obj.alpha).toBe(0.6953125);
    });

    it("default test case484", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.28948533721268177;
        expect(obj.alpha).toBe(0.2890625);
    });

    it("default test case485", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6617523487657309;
        expect(obj.alpha).toBe(0.66015625);
    });

    it("default test case486", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7739334437064826;
        expect(obj.alpha).toBe(0.7734375);
    });

    it("default test case487", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1031738412566483;
        expect(obj.alpha).toBe(0.1015625);
    });

    it("default test case488", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9713865946978331;
        expect(obj.alpha).toBe(0.96875);
    });

    it("default test case489", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1359019218944013;
        expect(obj.alpha).toBe(0.1328125);
    });

    it("default test case490", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2830041251145303;
        expect(obj.alpha).toBe(0.28125);
    });

    it("default test case491", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.19319492671638727;
        expect(obj.alpha).toBe(0.19140625);
    });

    it("default test case492", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.877547372598201;
        expect(obj.alpha).toBe(0.875);
    });

    it("default test case493", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9922765721566975;
        expect(obj.alpha).toBe(0.9921875);
    });

    it("default test case494", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7990090516395867;
        expect(obj.alpha).toBe(0.796875);
    });

    it("default test case495", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7867877003736794;
        expect(obj.alpha).toBe(0.78515625);
    });

    it("default test case496", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.11681727273389697;
        expect(obj.alpha).toBe(0.11328125);
    });

    it("default test case497", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9356785188429058;
        expect(obj.alpha).toBe(0.93359375);
    });

    it("default test case498", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6313935206271708;
        expect(obj.alpha).toBe(0.62890625);
    });

    it("default test case499", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7006920240819454;
        expect(obj.alpha).toBe(0.69921875);
    });

    it("default test case500", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5596301122568548;
        expect(obj.alpha).toBe(0.55859375);
    });

    it("default test case501", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5983923217281699;
        expect(obj.alpha).toBe(0.59765625);
    });

    it("default test case502", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1088772271759808;
        expect(obj.alpha).toBe(0.10546875);
    });

    it("default test case503", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.27170474035665393;
        expect(obj.alpha).toBe(0.26953125);
    });

    it("default test case504", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.12755997525528073;
        expect(obj.alpha).toBe(0.125);
    });

    it("default test case505", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4433312937617302;
        expect(obj.alpha).toBe(0.44140625);
    });

    it("default test case506", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.499241994228214;
        expect(obj.alpha).toBe(0.49609375);
    });

    it("default test case507", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2018454521894455;
        expect(obj.alpha).toBe(0.19921875);
    });

    it("default test case508", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.11349772475659847;
        expect(obj.alpha).toBe(0.11328125);
    });

    it("default test case509", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3070053611882031;
        expect(obj.alpha).toBe(0.3046875);
    });

    it("default test case510", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8538005659356713;
        expect(obj.alpha).toBe(0.8515625);
    });

    it("default test case511", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3270984389819205;
        expect(obj.alpha).toBe(0.32421875);
    });

    it("default test case512", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.10857063299044967;
        expect(obj.alpha).toBe(0.10546875);
    });

    it("default test case513", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.04098570765927434;
        expect(obj.alpha).toBe(0.0390625);
    });

    it("default test case514", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7719367332756519;
        expect(obj.alpha).toBe(0.76953125);
    });

    it("default test case515", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.47062757797539234;
        expect(obj.alpha).toBe(0.46875);
    });

    it("default test case516", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.23874283907935023;
        expect(obj.alpha).toBe(0.23828125);
    });

    it("default test case517", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7217581276781857;
        expect(obj.alpha).toBe(0.71875);
    });

    it("default test case518", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1580605609342456;
        expect(obj.alpha).toBe(0.15625);
    });

    it("default test case519", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.17623163107782602;
        expect(obj.alpha).toBe(0.17578125);
    });

    it("default test case520", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.31802332680672407;
        expect(obj.alpha).toBe(0.31640625);
    });

    it("default test case521", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.05326332291588187;
        expect(obj.alpha).toBe(0.05078125);
    });

    it("default test case522", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7494795862585306;
        expect(obj.alpha).toBe(0.74609375);
    });

    it("default test case523", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6334539749659598;
        expect(obj.alpha).toBe(0.6328125);
    });

    it("default test case524", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.18091563833877444;
        expect(obj.alpha).toBe(0.1796875);
    });

    it("default test case525", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4850536813028157;
        expect(obj.alpha).toBe(0.484375);
    });

    it("default test case526", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3797755311243236;
        expect(obj.alpha).toBe(0.37890625);
    });

    it("default test case527", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6573580433614552;
        expect(obj.alpha).toBe(0.65625);
    });

    it("default test case528", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.29192153085023165;
        expect(obj.alpha).toBe(0.2890625);
    });

    it("default test case529", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6268247677944601;
        expect(obj.alpha).toBe(0.625);
    });

    it("default test case530", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.06853714631870389;
        expect(obj.alpha).toBe(0.06640625);
    });

    it("default test case531", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.35954582830891013;
        expect(obj.alpha).toBe(0.359375);
    });

    it("default test case532", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6476427474990487;
        expect(obj.alpha).toBe(0.64453125);
    });

    it("default test case533", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.27901610638946295;
        expect(obj.alpha).toBe(0.27734375);
    });

    it("default test case534", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9824077780358493;
        expect(obj.alpha).toBe(0.98046875);
    });

    it("default test case535", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8569097276777029;
        expect(obj.alpha).toBe(0.85546875);
    });

    it("default test case536", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4479212877340615;
        expect(obj.alpha).toBe(0.4453125);
    });

    it("default test case537", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6594648156315088;
        expect(obj.alpha).toBe(0.65625);
    });

    it("default test case538", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.08730487944558263;
        expect(obj.alpha).toBe(0.0859375);
    });

    it("default test case539", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.0012214090675115585;
        expect(obj.alpha).toBe(0);
    });

    it("default test case540", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7951261252164841;
        expect(obj.alpha).toBe(0.79296875);
    });

    it("default test case541", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6266481652855873;
        expect(obj.alpha).toBe(0.625);
    });

    it("default test case542", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.16450428403913975;
        expect(obj.alpha).toBe(0.1640625);
    });

    it("default test case543", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.19932668562978506;
        expect(obj.alpha).toBe(0.19921875);
    });

    it("default test case544", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7159940456040204;
        expect(obj.alpha).toBe(0.71484375);
    });

    it("default test case545", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5825923192314804;
        expect(obj.alpha).toBe(0.58203125);
    });

    it("default test case546", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.42654506862163544;
        expect(obj.alpha).toBe(0.42578125);
    });

    it("default test case547", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.09891994949430227;
        expect(obj.alpha).toBe(0.09765625);
    });

    it("default test case548", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8264355175197124;
        expect(obj.alpha).toBe(0.82421875);
    });

    it("default test case549", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5409536734223366;
        expect(obj.alpha).toBe(0.5390625);
    });

    it("default test case550", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.27161874901503325;
        expect(obj.alpha).toBe(0.26953125);
    });

    it("default test case551", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.013567730318754911;
        expect(obj.alpha).toBe(0.01171875);
    });

    it("default test case552", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.13233620440587401;
        expect(obj.alpha).toBe(0.12890625);
    });

    it("default test case553", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8361888416111469;
        expect(obj.alpha).toBe(0.8359375);
    });

    it("default test case554", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.24635205557569861;
        expect(obj.alpha).toBe(0.24609375);
    });

    it("default test case555", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6459647207520902;
        expect(obj.alpha).toBe(0.64453125);
    });

    it("default test case556", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5335670486092567;
        expect(obj.alpha).toBe(0.53125);
    });

    it("default test case557", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8442138726823032;
        expect(obj.alpha).toBe(0.84375);
    });

    it("default test case558", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5227313139475882;
        expect(obj.alpha).toBe(0.51953125);
    });

    it("default test case559", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8481078175827861;
        expect(obj.alpha).toBe(0.84765625);
    });

    it("default test case560", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9042872842401266;
        expect(obj.alpha).toBe(0.90234375);
    });

    it("default test case561", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9344093133695424;
        expect(obj.alpha).toBe(0.93359375);
    });

    it("default test case562", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6287646782584488;
        expect(obj.alpha).toBe(0.625);
    });

    it("default test case563", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3316634460352361;
        expect(obj.alpha).toBe(0.328125);
    });

    it("default test case564", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7414199649356306;
        expect(obj.alpha).toBe(0.73828125);
    });

    it("default test case565", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5686084874905646;
        expect(obj.alpha).toBe(0.56640625);
    });

    it("default test case566", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4399769618175924;
        expect(obj.alpha).toBe(0.4375);
    });

    it("default test case567", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8735095355659723;
        expect(obj.alpha).toBe(0.87109375);
    });

    it("default test case568", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.35138120874762535;
        expect(obj.alpha).toBe(0.34765625);
    });

    it("default test case569", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8776824213564396;
        expect(obj.alpha).toBe(0.875);
    });

    it("default test case570", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.48237441247329116;
        expect(obj.alpha).toBe(0.48046875);
    });

    it("default test case571", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4732018378563225;
        expect(obj.alpha).toBe(0.47265625);
    });

    it("default test case572", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.24653398990631104;
        expect(obj.alpha).toBe(0.24609375);
    });

    it("default test case573", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8587635536678135;
        expect(obj.alpha).toBe(0.85546875);
    });

    it("default test case574", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.24437734810635448;
        expect(obj.alpha).toBe(0.2421875);
    });

    it("default test case575", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3024034220725298;
        expect(obj.alpha).toBe(0.30078125);
    });

    it("default test case576", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.18146790098398924;
        expect(obj.alpha).toBe(0.1796875);
    });

    it("default test case577", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4762233616784215;
        expect(obj.alpha).toBe(0.47265625);
    });

    it("default test case578", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.22347037820145488;
        expect(obj.alpha).toBe(0.22265625);
    });

    it("default test case579", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.36587069975212216;
        expect(obj.alpha).toBe(0.36328125);
    });

    it("default test case580", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5204285560175776;
        expect(obj.alpha).toBe(0.51953125);
    });

    it("default test case581", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.13988671405240893;
        expect(obj.alpha).toBe(0.13671875);
    });

    it("default test case582", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8307454874739051;
        expect(obj.alpha).toBe(0.828125);
    });

    it("default test case583", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8975395085290074;
        expect(obj.alpha).toBe(0.89453125);
    });

    it("default test case584", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.22635386046022177;
        expect(obj.alpha).toBe(0.22265625);
    });

    it("default test case585", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.19935697177425027;
        expect(obj.alpha).toBe(0.19921875);
    });

    it("default test case586", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5075435526669025;
        expect(obj.alpha).toBe(0.50390625);
    });

    it("default test case587", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.03859739098697901;
        expect(obj.alpha).toBe(0.03515625);
    });

    it("default test case588", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.08873951435089111;
        expect(obj.alpha).toBe(0.0859375);
    });

    it("default test case589", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6767072710208595;
        expect(obj.alpha).toBe(0.67578125);
    });

    it("default test case590", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7973350672982633;
        expect(obj.alpha).toBe(0.796875);
    });

    it("default test case591", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.08737701969221234;
        expect(obj.alpha).toBe(0.0859375);
    });

    it("default test case592", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4419824490323663;
        expect(obj.alpha).toBe(0.44140625);
    });

    it("default test case593", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4879991947673261;
        expect(obj.alpha).toBe(0.484375);
    });

    it("default test case594", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.03762453515082598;
        expect(obj.alpha).toBe(0.03515625);
    });

    it("default test case595", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.16706082271412015;
        expect(obj.alpha).toBe(0.1640625);
    });

    it("default test case596", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1346447952091694;
        expect(obj.alpha).toBe(0.1328125);
    });

    it("default test case597", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4719873582944274;
        expect(obj.alpha).toBe(0.46875);
    });

    it("default test case598", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5104842009022832;
        expect(obj.alpha).toBe(0.5078125);
    });

    it("default test case599", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5150998053140938;
        expect(obj.alpha).toBe(0.51171875);
    });

    it("default test case600", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8867856780998409;
        expect(obj.alpha).toBe(0.88671875);
    });

    it("default test case601", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9148731287568808;
        expect(obj.alpha).toBe(0.9140625);
    });

    it("default test case602", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.16807126300409436;
        expect(obj.alpha).toBe(0.16796875);
    });

    it("default test case603", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4654666050337255;
        expect(obj.alpha).toBe(0.46484375);
    });

    it("default test case604", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9626012560911477;
        expect(obj.alpha).toBe(0.9609375);
    });

    it("default test case605", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8955330899916589;
        expect(obj.alpha).toBe(0.89453125);
    });

    it("default test case606", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.30336232064291835;
        expect(obj.alpha).toBe(0.30078125);
    });

    it("default test case607", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4384468737989664;
        expect(obj.alpha).toBe(0.4375);
    });

    it("default test case608", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3536699158139527;
        expect(obj.alpha).toBe(0.3515625);
    });

    it("default test case609", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9556217696517706;
        expect(obj.alpha).toBe(0.953125);
    });

    it("default test case610", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.21369642345234752;
        expect(obj.alpha).toBe(0.2109375);
    });

    it("default test case611", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8426908664405346;
        expect(obj.alpha).toBe(0.83984375);
    });

    it("default test case612", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5393020859919488;
        expect(obj.alpha).toBe(0.5390625);
    });

    it("default test case613", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6325914091430604;
        expect(obj.alpha).toBe(0.62890625);
    });

    it("default test case614", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.598339544609189;
        expect(obj.alpha).toBe(0.59765625);
    });

    it("default test case615", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.24004373233765364;
        expect(obj.alpha).toBe(0.23828125);
    });

    it("default test case616", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7326970594003797;
        expect(obj.alpha).toBe(0.73046875);
    });

    it("default test case617", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2698031119070947;
        expect(obj.alpha).toBe(0.26953125);
    });

    it("default test case618", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.470105005428195;
        expect(obj.alpha).toBe(0.46875);
    });

    it("default test case619", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.971295912284404;
        expect(obj.alpha).toBe(0.96875);
    });

    it("default test case620", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8964231461286545;
        expect(obj.alpha).toBe(0.89453125);
    });

    it("default test case621", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.13022884353995323;
        expect(obj.alpha).toBe(0.12890625);
    });

    it("default test case622", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4989154487848282;
        expect(obj.alpha).toBe(0.49609375);
    });

    it("default test case623", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6047095158137381;
        expect(obj.alpha).toBe(0.6015625);
    });

    it("default test case624", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.26303170900791883;
        expect(obj.alpha).toBe(0.26171875);
    });

    it("default test case625", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.06425515655428171;
        expect(obj.alpha).toBe(0.0625);
    });

    it("default test case626", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8236525407992303;
        expect(obj.alpha).toBe(0.8203125);
    });

    it("default test case627", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5829263301566243;
        expect(obj.alpha).toBe(0.58203125);
    });

    it("default test case628", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.04453466273844242;
        expect(obj.alpha).toBe(0.04296875);
    });

    it("default test case629", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.05285864369943738;
        expect(obj.alpha).toBe(0.05078125);
    });

    it("default test case630", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8723158263601363;
        expect(obj.alpha).toBe(0.87109375);
    });

    it("default test case631", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8847454134374857;
        expect(obj.alpha).toBe(0.8828125);
    });

    it("default test case632", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3129504742100835;
        expect(obj.alpha).toBe(0.3125);
    });

    it("default test case633", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6840517269447446;
        expect(obj.alpha).toBe(0.68359375);
    });

    it("default test case634", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7813720107078552;
        expect(obj.alpha).toBe(0.78125);
    });

    it("default test case635", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8970967759378254;
        expect(obj.alpha).toBe(0.89453125);
    });

    it("default test case636", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5204204330220819;
        expect(obj.alpha).toBe(0.51953125);
    });

    it("default test case637", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5936324149370193;
        expect(obj.alpha).toBe(0.58984375);
    });

    it("default test case638", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7901388569734991;
        expect(obj.alpha).toBe(0.7890625);
    });

    it("default test case639", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.38682193867862225;
        expect(obj.alpha).toBe(0.38671875);
    });

    it("default test case640", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7824480310082436;
        expect(obj.alpha).toBe(0.78125);
    });

    it("default test case641", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6439051562920213;
        expect(obj.alpha).toBe(0.640625);
    });

    it("default test case642", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9687561928294599;
        expect(obj.alpha).toBe(0.96875);
    });

    it("default test case643", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1900885789655149;
        expect(obj.alpha).toBe(0.1875);
    });

    it("default test case644", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6391735416837037;
        expect(obj.alpha).toBe(0.63671875);
    });

    it("default test case645", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5548330140300095;
        expect(obj.alpha).toBe(0.5546875);
    });

    it("default test case646", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4762073210440576;
        expect(obj.alpha).toBe(0.47265625);
    });

    it("default test case647", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.25382068660110235;
        expect(obj.alpha).toBe(0.25);
    });

    it("default test case648", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.31752810813486576;
        expect(obj.alpha).toBe(0.31640625);
    });

    it("default test case649", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7087624380365014;
        expect(obj.alpha).toBe(0.70703125);
    });

    it("default test case650", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9358567637391388;
        expect(obj.alpha).toBe(0.93359375);
    });

    it("default test case651", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.10482050431892276;
        expect(obj.alpha).toBe(0.1015625);
    });

    it("default test case652", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5918864016421139;
        expect(obj.alpha).toBe(0.58984375);
    });

    it("default test case653", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7847585063427687;
        expect(obj.alpha).toBe(0.78125);
    });

    it("default test case654", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.10364646138623357;
        expect(obj.alpha).toBe(0.1015625);
    });

    it("default test case655", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8525225254707038;
        expect(obj.alpha).toBe(0.8515625);
    });

    it("default test case656", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7068136399611831;
        expect(obj.alpha).toBe(0.703125);
    });

    it("default test case657", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.0845639486797154;
        expect(obj.alpha).toBe(0.08203125);
    });

    it("default test case658", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5100920563563704;
        expect(obj.alpha).toBe(0.5078125);
    });

    it("default test case659", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9636814165860415;
        expect(obj.alpha).toBe(0.9609375);
    });

    it("default test case660", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.437972703948617;
        expect(obj.alpha).toBe(0.4375);
    });

    it("default test case661", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.40300441114231944;
        expect(obj.alpha).toBe(0.40234375);
    });

    it("default test case662", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2591269537806511;
        expect(obj.alpha).toBe(0.2578125);
    });

    it("default test case663", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2125545283779502;
        expect(obj.alpha).toBe(0.2109375);
    });

    it("default test case664", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3685021195560694;
        expect(obj.alpha).toBe(0.3671875);
    });

    it("default test case665", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.10751843126490712;
        expect(obj.alpha).toBe(0.10546875);
    });

    it("default test case666", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.06855011964216828;
        expect(obj.alpha).toBe(0.06640625);
    });

    it("default test case667", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.05429102946072817;
        expect(obj.alpha).toBe(0.05078125);
    });

    it("default test case668", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3345961472950876;
        expect(obj.alpha).toBe(0.33203125);
    });

    it("default test case669", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5804962310940027;
        expect(obj.alpha).toBe(0.578125);
    });

    it("default test case670", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.06015680870041251;
        expect(obj.alpha).toBe(0.05859375);
    });

    it("default test case671", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6008405229076743;
        expect(obj.alpha).toBe(0.59765625);
    });

    it("default test case672", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.37121909810230136;
        expect(obj.alpha).toBe(0.37109375);
    });

    it("default test case673", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7747961063869298;
        expect(obj.alpha).toBe(0.7734375);
    });

    it("default test case674", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.08568848622962832;
        expect(obj.alpha).toBe(0.08203125);
    });

    it("default test case675", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6711253402754664;
        expect(obj.alpha).toBe(0.66796875);
    });

    it("default test case676", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.26434271689504385;
        expect(obj.alpha).toBe(0.26171875);
    });

    it("default test case677", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7042224882170558;
        expect(obj.alpha).toBe(0.703125);
    });

    it("default test case678", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2069333023391664;
        expect(obj.alpha).toBe(0.203125);
    });

    it("default test case679", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9224589844234288;
        expect(obj.alpha).toBe(0.921875);
    });

    it("default test case680", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8582472880370915;
        expect(obj.alpha).toBe(0.85546875);
    });

    it("default test case681", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5495147830806673;
        expect(obj.alpha).toBe(0.546875);
    });

    it("default test case682", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5646841456182301;
        expect(obj.alpha).toBe(0.5625);
    });

    it("default test case683", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4357299762777984;
        expect(obj.alpha).toBe(0.43359375);
    });

    it("default test case684", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4726917836815119;
        expect(obj.alpha).toBe(0.47265625);
    });

    it("default test case685", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2598130782134831;
        expect(obj.alpha).toBe(0.2578125);
    });

    it("default test case686", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.33558088541030884;
        expect(obj.alpha).toBe(0.33203125);
    });

    it("default test case687", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7631825003772974;
        expect(obj.alpha).toBe(0.76171875);
    });

    it("default test case688", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.47539005195721984;
        expect(obj.alpha).toBe(0.47265625);
    });

    it("default test case689", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9721118751913309;
        expect(obj.alpha).toBe(0.96875);
    });

    it("default test case690", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4667212856002152;
        expect(obj.alpha).toBe(0.46484375);
    });

    it("default test case691", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6192929232493043;
        expect(obj.alpha).toBe(0.6171875);
    });

    it("default test case692", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.48960631247609854;
        expect(obj.alpha).toBe(0.48828125);
    });

    it("default test case693", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8011363996192813;
        expect(obj.alpha).toBe(0.80078125);
    });

    it("default test case694", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6490433276630938;
        expect(obj.alpha).toBe(0.6484375);
    });

    it("default test case695", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7997332164086401;
        expect(obj.alpha).toBe(0.796875);
    });

    it("default test case696", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.33257062919437885;
        expect(obj.alpha).toBe(0.33203125);
    });

    it("default test case697", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.28073677234351635;
        expect(obj.alpha).toBe(0.27734375);
    });

    it("default test case698", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1734125199727714;
        expect(obj.alpha).toBe(0.171875);
    });

    it("default test case699", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7205729619599879;
        expect(obj.alpha).toBe(0.71875);
    });

    it("default test case700", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.48182186717167497;
        expect(obj.alpha).toBe(0.48046875);
    });

    it("default test case701", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.35542433289811015;
        expect(obj.alpha).toBe(0.3515625);
    });

    it("default test case702", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5187049536034465;
        expect(obj.alpha).toBe(0.515625);
    });

    it("default test case703", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8505604527890682;
        expect(obj.alpha).toBe(0.84765625);
    });

    it("default test case704", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.16266491264104843;
        expect(obj.alpha).toBe(0.16015625);
    });

    it("default test case705", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.10300343297421932;
        expect(obj.alpha).toBe(0.1015625);
    });

    it("default test case706", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.24012853298336267;
        expect(obj.alpha).toBe(0.23828125);
    });

    it("default test case707", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7342979712411761;
        expect(obj.alpha).toBe(0.73046875);
    });

    it("default test case708", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.09916678676381707;
        expect(obj.alpha).toBe(0.09765625);
    });

    it("default test case709", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.05324041564017534;
        expect(obj.alpha).toBe(0.05078125);
    });

    it("default test case710", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7372247749008238;
        expect(obj.alpha).toBe(0.734375);
    });

    it("default test case711", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8788385861553252;
        expect(obj.alpha).toBe(0.875);
    });

    it("default test case712", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8044698312878609;
        expect(obj.alpha).toBe(0.80078125);
    });

    it("default test case713", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3872016225941479;
        expect(obj.alpha).toBe(0.38671875);
    });

    it("default test case714", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.008818839211016893;
        expect(obj.alpha).toBe(0.0078125);
    });

    it("default test case715", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.47164578828960657;
        expect(obj.alpha).toBe(0.46875);
    });

    it("default test case716", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.840650434140116;
        expect(obj.alpha).toBe(0.83984375);
    });

    it("default test case717", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9130523409694433;
        expect(obj.alpha).toBe(0.91015625);
    });

    it("default test case718", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.21234257239848375;
        expect(obj.alpha).toBe(0.2109375);
    });

    it("default test case719", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6401044870726764;
        expect(obj.alpha).toBe(0.63671875);
    });

    it("default test case720", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5412222873419523;
        expect(obj.alpha).toBe(0.5390625);
    });

    it("default test case721", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8409799770452082;
        expect(obj.alpha).toBe(0.83984375);
    });

    it("default test case722", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.07562845479696989;
        expect(obj.alpha).toBe(0.07421875);
    });

    it("default test case723", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7539949030615389;
        expect(obj.alpha).toBe(0.75390625);
    });

    it("default test case724", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.13410430867224932;
        expect(obj.alpha).toBe(0.1328125);
    });

    it("default test case725", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9032476744614542;
        expect(obj.alpha).toBe(0.90234375);
    });

    it("default test case726", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5520695936866105;
        expect(obj.alpha).toBe(0.55078125);
    });

    it("default test case727", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6533160987310112;
        expect(obj.alpha).toBe(0.65234375);
    });

    it("default test case728", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8696349700912833;
        expect(obj.alpha).toBe(0.8671875);
    });

    it("default test case729", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4077507555484772;
        expect(obj.alpha).toBe(0.40625);
    });

    it("default test case730", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.24702251702547073;
        expect(obj.alpha).toBe(0.24609375);
    });

    it("default test case731", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6449173842556775;
        expect(obj.alpha).toBe(0.64453125);
    });

    it("default test case732", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2857773541472852;
        expect(obj.alpha).toBe(0.28515625);
    });

    it("default test case733", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1842067502439022;
        expect(obj.alpha).toBe(0.18359375);
    });

    it("default test case734", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.71182865742594;
        expect(obj.alpha).toBe(0.7109375);
    });

    it("default test case735", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9884994588792324;
        expect(obj.alpha).toBe(0.98828125);
    });

    it("default test case736", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3184593110345304;
        expect(obj.alpha).toBe(0.31640625);
    });

    it("default test case737", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.49185781879350543;
        expect(obj.alpha).toBe(0.48828125);
    });

    it("default test case738", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8782494780607522;
        expect(obj.alpha).toBe(0.875);
    });

    it("default test case739", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.19140503695234656;
        expect(obj.alpha).toBe(0.1875);
    });

    it("default test case740", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3607712434604764;
        expect(obj.alpha).toBe(0.359375);
    });

    it("default test case741", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.41125760041177273;
        expect(obj.alpha).toBe(0.41015625);
    });

    it("default test case742", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7249460108578205;
        expect(obj.alpha).toBe(0.72265625);
    });

    it("default test case743", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.48755425913259387;
        expect(obj.alpha).toBe(0.484375);
    });

    it("default test case744", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8293785182759166;
        expect(obj.alpha).toBe(0.828125);
    });

    it("default test case745", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.47395756281912327;
        expect(obj.alpha).toBe(0.47265625);
    });

    it("default test case746", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.0416521979495883;
        expect(obj.alpha).toBe(0.0390625);
    });

    it("default test case747", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.15465386305004358;
        expect(obj.alpha).toBe(0.15234375);
    });

    it("default test case748", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7852305443957448;
        expect(obj.alpha).toBe(0.78515625);
    });

    it("default test case749", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9146327250637114;
        expect(obj.alpha).toBe(0.9140625);
    });

    it("default test case750", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.41958005586639047;
        expect(obj.alpha).toBe(0.41796875);
    });

    it("default test case751", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3230975060723722;
        expect(obj.alpha).toBe(0.3203125);
    });

    it("default test case752", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.008654907811433077;
        expect(obj.alpha).toBe(0.0078125);
    });

    it("default test case753", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2134302919730544;
        expect(obj.alpha).toBe(0.2109375);
    });

    it("default test case754", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2053014962002635;
        expect(obj.alpha).toBe(0.203125);
    });

    it("default test case755", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.22939437068998814;
        expect(obj.alpha).toBe(0.2265625);
    });

    it("default test case756", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5366837936453521;
        expect(obj.alpha).toBe(0.53515625);
    });

    it("default test case757", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6087312623858452;
        expect(obj.alpha).toBe(0.60546875);
    });

    it("default test case758", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5510338530875742;
        expect(obj.alpha).toBe(0.55078125);
    });

    it("default test case759", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.00028457725420594215;
        expect(obj.alpha).toBe(0);
    });

    it("default test case760", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.29768343130126595;
        expect(obj.alpha).toBe(0.296875);
    });

    it("default test case761", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.651725422590971;
        expect(obj.alpha).toBe(0.6484375);
    });

    it("default test case762", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.28328915359452367;
        expect(obj.alpha).toBe(0.28125);
    });

    it("default test case763", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5728181707672775;
        expect(obj.alpha).toBe(0.5703125);
    });

    it("default test case764", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6087665879167616;
        expect(obj.alpha).toBe(0.60546875);
    });

    it("default test case765", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.09875017777085304;
        expect(obj.alpha).toBe(0.09765625);
    });

    it("default test case766", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.21087641548365355;
        expect(obj.alpha).toBe(0.20703125);
    });

    it("default test case767", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.03399490751326084;
        expect(obj.alpha).toBe(0.03125);
    });

    it("default test case768", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7211740999482572;
        expect(obj.alpha).toBe(0.71875);
    });

    it("default test case769", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.35832037776708603;
        expect(obj.alpha).toBe(0.35546875);
    });

    it("default test case770", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7327414704486728;
        expect(obj.alpha).toBe(0.73046875);
    });

    it("default test case771", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5617776741273701;
        expect(obj.alpha).toBe(0.55859375);
    });

    it("default test case772", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2425289279781282;
        expect(obj.alpha).toBe(0.2421875);
    });

    it("default test case773", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5707289101555943;
        expect(obj.alpha).toBe(0.5703125);
    });

    it("default test case774", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7099735215306282;
        expect(obj.alpha).toBe(0.70703125);
    });

    it("default test case775", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.42010725988075137;
        expect(obj.alpha).toBe(0.41796875);
    });

    it("default test case776", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.307733619119972;
        expect(obj.alpha).toBe(0.3046875);
    });

    it("default test case777", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8771708053536713;
        expect(obj.alpha).toBe(0.875);
    });

    it("default test case778", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9439655039459467;
        expect(obj.alpha).toBe(0.94140625);
    });

    it("default test case779", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5204972070641816;
        expect(obj.alpha).toBe(0.51953125);
    });

    it("default test case780", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8422344913706183;
        expect(obj.alpha).toBe(0.83984375);
    });

    it("default test case781", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9660669793374836;
        expect(obj.alpha).toBe(0.96484375);
    });

    it("default test case782", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8392626438289881;
        expect(obj.alpha).toBe(0.8359375);
    });

    it("default test case783", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.28537464141845703;
        expect(obj.alpha).toBe(0.28515625);
    });

    it("default test case784", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.22364427242428064;
        expect(obj.alpha).toBe(0.22265625);
    });

    it("default test case785", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7890377552248538;
        expect(obj.alpha).toBe(0.78515625);
    });

    it("default test case786", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4735634485259652;
        expect(obj.alpha).toBe(0.47265625);
    });

    it("default test case787", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3967815972864628;
        expect(obj.alpha).toBe(0.39453125);
    });

    it("default test case788", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5625357199460268;
        expect(obj.alpha).toBe(0.5625);
    });

    it("default test case789", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9116212301887572;
        expect(obj.alpha).toBe(0.91015625);
    });

    it("default test case790", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6647098651155829;
        expect(obj.alpha).toBe(0.6640625);
    });

    it("default test case791", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9567426857538521;
        expect(obj.alpha).toBe(0.953125);
    });

    it("default test case792", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8492653304710984;
        expect(obj.alpha).toBe(0.84765625);
    });

    it("default test case793", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.05092918314039707;
        expect(obj.alpha).toBe(0.05078125);
    });

    it("default test case794", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7053753905929625;
        expect(obj.alpha).toBe(0.703125);
    });

    it("default test case795", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6443457650020719;
        expect(obj.alpha).toBe(0.640625);
    });

    it("default test case796", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6484222947619855;
        expect(obj.alpha).toBe(0.64453125);
    });

    it("default test case797", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.0070968810468912125;
        expect(obj.alpha).toBe(0.00390625);
    });

    it("default test case798", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4654819411225617;
        expect(obj.alpha).toBe(0.46484375);
    });

    it("default test case799", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.03373775817453861;
        expect(obj.alpha).toBe(0.03125);
    });

    it("default test case800", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7995217936113477;
        expect(obj.alpha).toBe(0.796875);
    });

    it("default test case801", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.08669596491381526;
        expect(obj.alpha).toBe(0.0859375);
    });

    it("default test case802", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.958700358401984;
        expect(obj.alpha).toBe(0.95703125);
    });

    it("default test case803", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.14195483550429344;
        expect(obj.alpha).toBe(0.140625);
    });

    it("default test case804", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6861137086525559;
        expect(obj.alpha).toBe(0.68359375);
    });

    it("default test case805", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7382984459400177;
        expect(obj.alpha).toBe(0.73828125);
    });

    it("default test case806", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9901104066520929;
        expect(obj.alpha).toBe(0.98828125);
    });

    it("default test case807", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.19860959891229868;
        expect(obj.alpha).toBe(0.1953125);
    });

    it("default test case808", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.07514651445671916;
        expect(obj.alpha).toBe(0.07421875);
    });

    it("default test case809", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.497765532694757;
        expect(obj.alpha).toBe(0.49609375);
    });

    it("default test case810", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.0973523217253387;
        expect(obj.alpha).toBe(0.09375);
    });

    it("default test case811", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8009785008616745;
        expect(obj.alpha).toBe(0.80078125);
    });

    it("default test case812", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.053927571047097445;
        expect(obj.alpha).toBe(0.05078125);
    });

    it("default test case813", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8255739375017583;
        expect(obj.alpha).toBe(0.82421875);
    });

    it("default test case814", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.14941699896007776;
        expect(obj.alpha).toBe(0.1484375);
    });

    it("default test case815", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.05055176466703415;
        expect(obj.alpha).toBe(0.046875);
    });

    it("default test case816", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5107759172096848;
        expect(obj.alpha).toBe(0.5078125);
    });

    it("default test case817", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7483612494543195;
        expect(obj.alpha).toBe(0.74609375);
    });

    it("default test case818", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6260691625066102;
        expect(obj.alpha).toBe(0.625);
    });

    it("default test case819", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.603838425129652;
        expect(obj.alpha).toBe(0.6015625);
    });

    it("default test case820", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.23556881351396441;
        expect(obj.alpha).toBe(0.234375);
    });

    it("default test case821", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1960792876780033;
        expect(obj.alpha).toBe(0.1953125);
    });

    it("default test case822", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6832792982459068;
        expect(obj.alpha).toBe(0.6796875);
    });

    it("default test case823", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6624080007895827;
        expect(obj.alpha).toBe(0.66015625);
    });

    it("default test case824", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3362122122198343;
        expect(obj.alpha).toBe(0.3359375);
    });

    it("default test case825", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.45304736820980906;
        expect(obj.alpha).toBe(0.44921875);
    });

    it("default test case826", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.17047210782766342;
        expect(obj.alpha).toBe(0.16796875);
    });

    it("default test case827", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.10281836334615946;
        expect(obj.alpha).toBe(0.1015625);
    });

    it("default test case828", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.44423485780134797;
        expect(obj.alpha).toBe(0.44140625);
    });

    it("default test case829", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.588269074447453;
        expect(obj.alpha).toBe(0.5859375);
    });

    it("default test case830", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7598892981186509;
        expect(obj.alpha).toBe(0.7578125);
    });

    it("default test case831", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.07453170465305448;
        expect(obj.alpha).toBe(0.07421875);
    });

    it("default test case832", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6603169799782336;
        expect(obj.alpha).toBe(0.66015625);
    });

    it("default test case833", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6506164986640215;
        expect(obj.alpha).toBe(0.6484375);
    });

    it("default test case834", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.13959377398714423;
        expect(obj.alpha).toBe(0.13671875);
    });

    it("default test case835", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.191800978500396;
        expect(obj.alpha).toBe(0.19140625);
    });

    it("default test case836", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5591599768958986;
        expect(obj.alpha).toBe(0.55859375);
    });

    it("default test case837", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2943379464559257;
        expect(obj.alpha).toBe(0.29296875);
    });

    it("default test case838", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9681318406946957;
        expect(obj.alpha).toBe(0.96484375);
    });

    it("default test case839", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3619806547649205;
        expect(obj.alpha).toBe(0.359375);
    });

    it("default test case840", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.20310560800135136;
        expect(obj.alpha).toBe(0.19921875);
    });

    it("default test case841", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7231045453809202;
        expect(obj.alpha).toBe(0.72265625);
    });

    it("default test case842", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.979272729717195;
        expect(obj.alpha).toBe(0.9765625);
    });

    it("default test case843", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.909466068726033;
        expect(obj.alpha).toBe(0.90625);
    });

    it("default test case844", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9579421817325056;
        expect(obj.alpha).toBe(0.95703125);
    });

    it("default test case845", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7673606462776661;
        expect(obj.alpha).toBe(0.765625);
    });

    it("default test case846", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1270438963547349;
        expect(obj.alpha).toBe(0.125);
    });

    it("default test case847", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.31626696744933724;
        expect(obj.alpha).toBe(0.3125);
    });

    it("default test case848", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6905595045536757;
        expect(obj.alpha).toBe(0.6875);
    });

    it("default test case849", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.30664789443835616;
        expect(obj.alpha).toBe(0.3046875);
    });

    it("default test case850", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5197979244403541;
        expect(obj.alpha).toBe(0.51953125);
    });

    it("default test case851", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.22829163121059537;
        expect(obj.alpha).toBe(0.2265625);
    });

    it("default test case852", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.48135185427963734;
        expect(obj.alpha).toBe(0.48046875);
    });

    it("default test case853", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.46817642729729414;
        expect(obj.alpha).toBe(0.46484375);
    });

    it("default test case854", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.12529931217432022;
        expect(obj.alpha).toBe(0.125);
    });

    it("default test case855", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6923343711532652;
        expect(obj.alpha).toBe(0.69140625);
    });

    it("default test case856", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.742025172803551;
        expect(obj.alpha).toBe(0.73828125);
    });

    it("default test case857", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.496741209179163;
        expect(obj.alpha).toBe(0.49609375);
    });

    it("default test case858", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7353193378075957;
        expect(obj.alpha).toBe(0.734375);
    });

    it("default test case859", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9715886632911861;
        expect(obj.alpha).toBe(0.96875);
    });

    it("default test case860", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.792247012257576;
        expect(obj.alpha).toBe(0.7890625);
    });

    it("default test case861", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9218019121326506;
        expect(obj.alpha).toBe(0.91796875);
    });

    it("default test case862", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.01757870288565755;
        expect(obj.alpha).toBe(0.015625);
    });

    it("default test case863", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6606053840368986;
        expect(obj.alpha).toBe(0.66015625);
    });

    it("default test case864", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5430284482426941;
        expect(obj.alpha).toBe(0.54296875);
    });

    it("default test case865", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.26216790778562427;
        expect(obj.alpha).toBe(0.26171875);
    });

    it("default test case866", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.41700971545651555;
        expect(obj.alpha).toBe(0.4140625);
    });

    it("default test case867", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6069458965212107;
        expect(obj.alpha).toBe(0.60546875);
    });

    it("default test case868", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6379336374811828;
        expect(obj.alpha).toBe(0.63671875);
    });

    it("default test case869", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7023672638460994;
        expect(obj.alpha).toBe(0.69921875);
    });

    it("default test case870", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.45932136895135045;
        expect(obj.alpha).toBe(0.45703125);
    });

    it("default test case871", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5572970472276211;
        expect(obj.alpha).toBe(0.5546875);
    });

    it("default test case872", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.05028734216466546;
        expect(obj.alpha).toBe(0.046875);
    });

    it("default test case873", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.04623272828757763;
        expect(obj.alpha).toBe(0.04296875);
    });

    it("default test case874", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9815398040227592;
        expect(obj.alpha).toBe(0.98046875);
    });

    it("default test case875", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4894563676789403;
        expect(obj.alpha).toBe(0.48828125);
    });

    it("default test case876", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6005414305254817;
        expect(obj.alpha).toBe(0.59765625);
    });

    it("default test case877", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.028378017712384462;
        expect(obj.alpha).toBe(0.02734375);
    });

    it("default test case878", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6776445708237588;
        expect(obj.alpha).toBe(0.67578125);
    });

    it("default test case879", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.042671328876167536;
        expect(obj.alpha).toBe(0.0390625);
    });

    it("default test case880", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.31553131248801947;
        expect(obj.alpha).toBe(0.3125);
    });

    it("default test case881", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5919581446796656;
        expect(obj.alpha).toBe(0.58984375);
    });

    it("default test case882", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4115998209454119;
        expect(obj.alpha).toBe(0.41015625);
    });

    it("default test case883", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4666076209396124;
        expect(obj.alpha).toBe(0.46484375);
    });

    it("default test case884", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3334628203883767;
        expect(obj.alpha).toBe(0.33203125);
    });

    it("default test case885", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.12485588667914271;
        expect(obj.alpha).toBe(0.12109375);
    });

    it("default test case886", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.19451556960120797;
        expect(obj.alpha).toBe(0.19140625);
    });

    it("default test case887", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.32545651542022824;
        expect(obj.alpha).toBe(0.32421875);
    });

    it("default test case888", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.06258994480594993;
        expect(obj.alpha).toBe(0.0625);
    });

    it("default test case889", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.43633827986195683;
        expect(obj.alpha).toBe(0.43359375);
    });

    it("default test case890", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8490452221594751;
        expect(obj.alpha).toBe(0.84765625);
    });

    it("default test case891", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3257948509417474;
        expect(obj.alpha).toBe(0.32421875);
    });

    it("default test case892", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3666124027222395;
        expect(obj.alpha).toBe(0.36328125);
    });

    it("default test case893", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3427456635981798;
        expect(obj.alpha).toBe(0.33984375);
    });

    it("default test case894", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7344705420546234;
        expect(obj.alpha).toBe(0.734375);
    });

    it("default test case895", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7381563587114215;
        expect(obj.alpha).toBe(0.734375);
    });

    it("default test case896", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7552995649166405;
        expect(obj.alpha).toBe(0.75390625);
    });

    it("default test case897", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6835317760705948;
        expect(obj.alpha).toBe(0.6796875);
    });

    it("default test case898", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8818230321630836;
        expect(obj.alpha).toBe(0.87890625);
    });

    it("default test case899", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4733053003437817;
        expect(obj.alpha).toBe(0.47265625);
    });

    it("default test case900", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4513781201094389;
        expect(obj.alpha).toBe(0.44921875);
    });

    it("default test case901", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.639189281500876;
        expect(obj.alpha).toBe(0.63671875);
    });

    it("default test case902", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5484599694609642;
        expect(obj.alpha).toBe(0.546875);
    });

    it("default test case903", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4295507725328207;
        expect(obj.alpha).toBe(0.42578125);
    });

    it("default test case904", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.34098511980846524;
        expect(obj.alpha).toBe(0.33984375);
    });

    it("default test case905", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9685348160564899;
        expect(obj.alpha).toBe(0.96484375);
    });

    it("default test case906", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8285335670225322;
        expect(obj.alpha).toBe(0.828125);
    });

    it("default test case907", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7233369094319642;
        expect(obj.alpha).toBe(0.72265625);
    });

    it("default test case908", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6224107095040381;
        expect(obj.alpha).toBe(0.62109375);
    });

    it("default test case909", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5005194726400077;
        expect(obj.alpha).toBe(0.5);
    });

    it("default test case910", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.18911930872127414;
        expect(obj.alpha).toBe(0.1875);
    });

    it("default test case911", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7739649442955852;
        expect(obj.alpha).toBe(0.7734375);
    });

    it("default test case912", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.05891529191285372;
        expect(obj.alpha).toBe(0.05859375);
    });

    it("default test case913", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.09407593170180917;
        expect(obj.alpha).toBe(0.09375);
    });

    it("default test case914", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8460380830802023;
        expect(obj.alpha).toBe(0.84375);
    });

    it("default test case915", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.10401744581758976;
        expect(obj.alpha).toBe(0.1015625);
    });

    it("default test case916", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.49971119593828917;
        expect(obj.alpha).toBe(0.49609375);
    });

    it("default test case917", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6416287194006145;
        expect(obj.alpha).toBe(0.640625);
    });

    it("default test case918", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5822105100378394;
        expect(obj.alpha).toBe(0.58203125);
    });

    it("default test case919", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.21726977871730924;
        expect(obj.alpha).toBe(0.21484375);
    });

    it("default test case920", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.006424290593713522;
        expect(obj.alpha).toBe(0.00390625);
    });

    it("default test case921", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.10898959543555975;
        expect(obj.alpha).toBe(0.10546875);
    });

    it("default test case922", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9666602644138038;
        expect(obj.alpha).toBe(0.96484375);
    });

    it("default test case923", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.19083370454609394;
        expect(obj.alpha).toBe(0.1875);
    });

    it("default test case924", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2644922495819628;
        expect(obj.alpha).toBe(0.26171875);
    });

    it("default test case925", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8926813704892993;
        expect(obj.alpha).toBe(0.890625);
    });

    it("default test case926", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2388588422909379;
        expect(obj.alpha).toBe(0.23828125);
    });

    it("default test case927", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.1811038893647492;
        expect(obj.alpha).toBe(0.1796875);
    });

    it("default test case928", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4172655986621976;
        expect(obj.alpha).toBe(0.4140625);
    });

    it("default test case929", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2973261093720794;
        expect(obj.alpha).toBe(0.296875);
    });

    it("default test case930", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7307433858513832;
        expect(obj.alpha).toBe(0.73046875);
    });

    it("default test case931", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4904888099990785;
        expect(obj.alpha).toBe(0.48828125);
    });

    it("default test case932", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.10878545884042978;
        expect(obj.alpha).toBe(0.10546875);
    });

    it("default test case933", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3338357964530587;
        expect(obj.alpha).toBe(0.33203125);
    });

    it("default test case934", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4742671507410705;
        expect(obj.alpha).toBe(0.47265625);
    });

    it("default test case935", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6861943774856627;
        expect(obj.alpha).toBe(0.68359375);
    });

    it("default test case936", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4948249068111181;
        expect(obj.alpha).toBe(0.4921875);
    });

    it("default test case937", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8582975938916206;
        expect(obj.alpha).toBe(0.85546875);
    });

    it("default test case938", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9453152543865144;
        expect(obj.alpha).toBe(0.9453125);
    });

    it("default test case939", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5277790338732302;
        expect(obj.alpha).toBe(0.52734375);
    });

    it("default test case940", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.18437384022399783;
        expect(obj.alpha).toBe(0.18359375);
    });

    it("default test case941", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3796612969599664;
        expect(obj.alpha).toBe(0.37890625);
    });

    it("default test case942", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.29451038409024477;
        expect(obj.alpha).toBe(0.29296875);
    });

    it("default test case943", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8042627344839275;
        expect(obj.alpha).toBe(0.80078125);
    });

    it("default test case944", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3155023423023522;
        expect(obj.alpha).toBe(0.3125);
    });

    it("default test case945", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.88050427287817;
        expect(obj.alpha).toBe(0.87890625);
    });

    it("default test case946", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.048957990016788244;
        expect(obj.alpha).toBe(0.046875);
    });

    it("default test case947", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7084880168549716;
        expect(obj.alpha).toBe(0.70703125);
    });

    it("default test case948", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.36873348616063595;
        expect(obj.alpha).toBe(0.3671875);
    });

    it("default test case949", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.11053532874211669;
        expect(obj.alpha).toBe(0.109375);
    });

    it("default test case950", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.837237551342696;
        expect(obj.alpha).toBe(0.8359375);
    });

    it("default test case951", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.06684993905946612;
        expect(obj.alpha).toBe(0.06640625);
    });

    it("default test case952", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3225045879371464;
        expect(obj.alpha).toBe(0.3203125);
    });

    it("default test case953", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8553959089331329;
        expect(obj.alpha).toBe(0.8515625);
    });

    it("default test case954", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9337984542362392;
        expect(obj.alpha).toBe(0.93359375);
    });

    it("default test case955", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.23070229729637504;
        expect(obj.alpha).toBe(0.23046875);
    });

    it("default test case956", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2630704934708774;
        expect(obj.alpha).toBe(0.26171875);
    });

    it("default test case957", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9992277077399194;
        expect(obj.alpha).toBe(0.99609375);
    });

    it("default test case958", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2169146160595119;
        expect(obj.alpha).toBe(0.21484375);
    });

    it("default test case959", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9755304073914886;
        expect(obj.alpha).toBe(0.97265625);
    });

    it("default test case960", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.33788407081738114;
        expect(obj.alpha).toBe(0.3359375);
    });

    it("default test case961", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5549766179174185;
        expect(obj.alpha).toBe(0.5546875);
    });

    it("default test case962", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9343700679019094;
        expect(obj.alpha).toBe(0.93359375);
    });

    it("default test case963", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8623309517279267;
        expect(obj.alpha).toBe(0.859375);
    });

    it("default test case964", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9022734486497939;
        expect(obj.alpha).toBe(0.8984375);
    });

    it("default test case965", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.057669606525450945;
        expect(obj.alpha).toBe(0.0546875);
    });

    it("default test case966", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7521226741373539;
        expect(obj.alpha).toBe(0.75);
    });

    it("default test case967", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7618754669092596;
        expect(obj.alpha).toBe(0.76171875);
    });

    it("default test case968", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5761108021251857;
        expect(obj.alpha).toBe(0.57421875);
    });

    it("default test case969", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2331782653927803;
        expect(obj.alpha).toBe(0.23046875);
    });

    it("default test case970", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2735215127468109;
        expect(obj.alpha).toBe(0.2734375);
    });

    it("default test case971", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.322932300157845;
        expect(obj.alpha).toBe(0.3203125);
    });

    it("default test case972", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4339009877294302;
        expect(obj.alpha).toBe(0.43359375);
    });

    it("default test case973", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8164251251146197;
        expect(obj.alpha).toBe(0.81640625);
    });

    it("default test case974", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.5868491688743234;
        expect(obj.alpha).toBe(0.5859375);
    });

    it("default test case975", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.44312226586043835;
        expect(obj.alpha).toBe(0.44140625);
    });

    it("default test case976", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.43994630314409733;
        expect(obj.alpha).toBe(0.4375);
    });

    it("default test case977", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.2395922071300447;
        expect(obj.alpha).toBe(0.23828125);
    });

    it("default test case978", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9780018362216651;
        expect(obj.alpha).toBe(0.9765625);
    });

    it("default test case979", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7817592406645417;
        expect(obj.alpha).toBe(0.78125);
    });

    it("default test case980", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8960684519261122;
        expect(obj.alpha).toBe(0.89453125);
    });

    it("default test case981", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.26238536601886153;
        expect(obj.alpha).toBe(0.26171875);
    });

    it("default test case982", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.17961157346144319;
        expect(obj.alpha).toBe(0.17578125);
    });

    it("default test case983", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.534682716242969;
        expect(obj.alpha).toBe(0.53125);
    });

    it("default test case984", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.0724638793617487;
        expect(obj.alpha).toBe(0.0703125);
    });

    it("default test case985", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.8746851175092161;
        expect(obj.alpha).toBe(0.87109375);
    });

    it("default test case986", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9399315952323377;
        expect(obj.alpha).toBe(0.9375);
    });

    it("default test case987", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.7035114471800625;
        expect(obj.alpha).toBe(0.703125);
    });

    it("default test case988", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9540885020978749;
        expect(obj.alpha).toBe(0.953125);
    });

    it("default test case989", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.11058540735393763;
        expect(obj.alpha).toBe(0.109375);
    });

    it("default test case990", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.026731420774012804;
        expect(obj.alpha).toBe(0.0234375);
    });

    it("default test case991", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.3271355223841965;
        expect(obj.alpha).toBe(0.32421875);
    });

    it("default test case992", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.08201286848634481;
        expect(obj.alpha).toBe(0.078125);
    });

    it("default test case993", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6889734687283635;
        expect(obj.alpha).toBe(0.6875);
    });

    it("default test case994", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4571193805895746;
        expect(obj.alpha).toBe(0.45703125);
    });

    it("default test case995", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.251145850867033;
        expect(obj.alpha).toBe(0.25);
    });

    it("default test case996", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.4383451514877379;
        expect(obj.alpha).toBe(0.4375);
    });

    it("default test case997", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6966313710436225;
        expect(obj.alpha).toBe(0.6953125);
    });

    it("default test case998", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.9158857380971313;
        expect(obj.alpha).toBe(0.9140625);
    });

    it("default test case999", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.6226072437129915;
        expect(obj.alpha).toBe(0.62109375);
    });

    it("default test case1000", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 0.29703431064262986;
        expect(obj.alpha).toBe(0.296875);
    });

});

describe("DisplayObject.js alpha integer test", function()
{

    it("default test case1", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6614634;
        expect(obj.alpha).toBe(106);
    });

    it("default test case2", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1766857;
        expect(obj.alpha).toBe(-55);
    });

    it("default test case3", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8207611;
        expect(obj.alpha).toBe(-5);
    });

    it("default test case4", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9827071;
        expect(obj.alpha).toBe(0);
    });

    it("default test case5", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8054583;
        expect(obj.alpha).toBe(55);
    });

    it("default test case6", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 227819;
        expect(obj.alpha).toBe(-21);
    });

    it("default test case7", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4605400;
        expect(obj.alpha).toBe(-40);
    });

    it("default test case8", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1974558;
        expect(obj.alpha).toBe(30);
    });

    it("default test case9", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7747750;
        expect(obj.alpha).toBe(-90);
    });

    it("default test case10", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9155641;
        expect(obj.alpha).toBe(0);
    });

    it("default test case11", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8596092;
        expect(obj.alpha).toBe(0);
    });

    it("default test case12", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9249478;
        expect(obj.alpha).toBe(0);
    });

    it("default test case13", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7956884;
        expect(obj.alpha).toBe(-108);
    });

    it("default test case14", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4156099;
        expect(obj.alpha).toBe(-61);
    });

    it("default test case15", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5369182;
        expect(obj.alpha).toBe(94);
    });

    it("default test case16", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 334114;
        expect(obj.alpha).toBe(34);
    });

    it("default test case17", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3042113;
        expect(obj.alpha).toBe(65);
    });

    it("default test case18", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9189396;
        expect(obj.alpha).toBe(0);
    });

    it("default test case19", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4681552;
        expect(obj.alpha).toBe(80);
    });

    it("default test case20", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9136076;
        expect(obj.alpha).toBe(0);
    });

    it("default test case21", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8612396;
        expect(obj.alpha).toBe(0);
    });

    it("default test case22", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 909004;
        expect(obj.alpha).toBe(-52);
    });

    it("default test case23", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8547629;
        expect(obj.alpha).toBe(0);
    });

    it("default test case24", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5462987;
        expect(obj.alpha).toBe(-53);
    });

    it("default test case25", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8080195;
        expect(obj.alpha).toBe(67);
    });

    it("default test case26", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5350291;
        expect(obj.alpha).toBe(-109);
    });

    it("default test case27", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8254980;
        expect(obj.alpha).toBe(4);
    });

    it("default test case28", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5211717;
        expect(obj.alpha).toBe(69);
    });

    it("default test case29", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3953376;
        expect(obj.alpha).toBe(-32);
    });

    it("default test case30", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 181957;
        expect(obj.alpha).toBe(-59);
    });

    it("default test case31", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4862392;
        expect(obj.alpha).toBe(-72);
    });

    it("default test case32", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1475592;
        expect(obj.alpha).toBe(8);
    });

    it("default test case33", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3161394;
        expect(obj.alpha).toBe(50);
    });

    it("default test case34", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9601684;
        expect(obj.alpha).toBe(0);
    });

    it("default test case35", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8258530;
        expect(obj.alpha).toBe(-30);
    });

    it("default test case36", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4777295;
        expect(obj.alpha).toBe(79);
    });

    it("default test case37", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9779542;
        expect(obj.alpha).toBe(0);
    });

    it("default test case38", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7047684;
        expect(obj.alpha).toBe(4);
    });

    it("default test case39", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 21789;
        expect(obj.alpha).toBe(29);
    });

    it("default test case40", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6999342;
        expect(obj.alpha).toBe(46);
    });

    it("default test case41", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3486088;
        expect(obj.alpha).toBe(-120);
    });

    it("default test case42", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 44301;
        expect(obj.alpha).toBe(13);
    });

    it("default test case43", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3580496;
        expect(obj.alpha).toBe(80);
    });

    it("default test case44", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3275280;
        expect(obj.alpha).toBe(16);
    });

    it("default test case45", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 963771;
        expect(obj.alpha).toBe(-69);
    });

    it("default test case46", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2729393;
        expect(obj.alpha).toBe(-79);
    });

    it("default test case47", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6912993;
        expect(obj.alpha).toBe(-31);
    });

    it("default test case48", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6547021;
        expect(obj.alpha).toBe(77);
    });

    it("default test case49", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6710104;
        expect(obj.alpha).toBe(88);
    });

    it("default test case50", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 717298;
        expect(obj.alpha).toBe(-14);
    });

    it("default test case51", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9586204;
        expect(obj.alpha).toBe(0);
    });

    it("default test case52", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1447301;
        expect(obj.alpha).toBe(-123);
    });

    it("default test case53", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4196913;
        expect(obj.alpha).toBe(49);
    });

    it("default test case54", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3847821;
        expect(obj.alpha).toBe(-115);
    });

    it("default test case55", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9429407;
        expect(obj.alpha).toBe(0);
    });

    it("default test case56", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1067928;
        expect(obj.alpha).toBe(-104);
    });

    it("default test case57", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2049931;
        expect(obj.alpha).toBe(-117);
    });

    it("default test case58", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9503994;
        expect(obj.alpha).toBe(0);
    });

    it("default test case59", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6610916;
        expect(obj.alpha).toBe(-28);
    });

    it("default test case60", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3919516;
        expect(obj.alpha).toBe(-100);
    });

    it("default test case61", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2242705;
        expect(obj.alpha).toBe(-111);
    });

    it("default test case62", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5559509;
        expect(obj.alpha).toBe(-43);
    });

    it("default test case63", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6198836;
        expect(obj.alpha).toBe(52);
    });

    it("default test case64", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5840064;
        expect(obj.alpha).toBe(-64);
    });

    it("default test case65", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 749901;
        expect(obj.alpha).toBe(77);
    });

    it("default test case66", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 331696;
        expect(obj.alpha).toBe(-80);
    });

    it("default test case67", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2597691;
        expect(obj.alpha).toBe(59);
    });

    it("default test case68", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7530565;
        expect(obj.alpha).toBe(69);
    });

    it("default test case69", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 895416;
        expect(obj.alpha).toBe(-72);
    });

    it("default test case70", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4640903;
        expect(obj.alpha).toBe(-121);
    });

    it("default test case71", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2911304;
        expect(obj.alpha).toBe(72);
    });

    it("default test case72", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2088080;
        expect(obj.alpha).toBe(-112);
    });

    it("default test case73", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 979143;
        expect(obj.alpha).toBe(-57);
    });

    it("default test case74", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6756983;
        expect(obj.alpha).toBe(119);
    });

    it("default test case75", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4364121;
        expect(obj.alpha).toBe(89);
    });

    it("default test case76", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8811662;
        expect(obj.alpha).toBe(0);
    });

    it("default test case77", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4004430;
        expect(obj.alpha).toBe(78);
    });

    it("default test case78", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5927176;
        expect(obj.alpha).toBe(8);
    });

    it("default test case79", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6870150;
        expect(obj.alpha).toBe(-122);
    });

    it("default test case80", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2980776;
        expect(obj.alpha).toBe(-88);
    });

    it("default test case81", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1419312;
        expect(obj.alpha).toBe(48);
    });

    it("default test case82", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5269923;
        expect(obj.alpha).toBe(-93);
    });

    it("default test case83", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2050889;
        expect(obj.alpha).toBe(73);
    });

    it("default test case84", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1980737;
        expect(obj.alpha).toBe(65);
    });

    it("default test case85", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3827506;
        expect(obj.alpha).toBe(50);
    });

    it("default test case86", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6804223;
        expect(obj.alpha).toBe(-1);
    });

    it("default test case87", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9110356;
        expect(obj.alpha).toBe(0);
    });

    it("default test case88", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9077189;
        expect(obj.alpha).toBe(0);
    });

    it("default test case89", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3448669;
        expect(obj.alpha).toBe(93);
    });

    it("default test case90", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2686967;
        expect(obj.alpha).toBe(-9);
    });

    it("default test case91", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8969590;
        expect(obj.alpha).toBe(0);
    });

    it("default test case92", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7993294;
        expect(obj.alpha).toBe(-50);
    });

    it("default test case93", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5713209;
        expect(obj.alpha).toBe(57);
    });

    it("default test case94", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7230054;
        expect(obj.alpha).toBe(102);
    });

    it("default test case95", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2234513;
        expect(obj.alpha).toBe(-111);
    });

    it("default test case96", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 143056;
        expect(obj.alpha).toBe(-48);
    });

    it("default test case97", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5271542;
        expect(obj.alpha).toBe(-10);
    });

    it("default test case98", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5630785;
        expect(obj.alpha).toBe(65);
    });

    it("default test case99", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6402134;
        expect(obj.alpha).toBe(86);
    });

    it("default test case100", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3848971;
        expect(obj.alpha).toBe(11);
    });

    it("default test case101", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4103259;
        expect(obj.alpha).toBe(91);
    });

    it("default test case102", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9799355;
        expect(obj.alpha).toBe(0);
    });

    it("default test case103", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5445289;
        expect(obj.alpha).toBe(-87);
    });

    it("default test case104", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8740824;
        expect(obj.alpha).toBe(0);
    });

    it("default test case105", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2661916;
        expect(obj.alpha).toBe(28);
    });

    it("default test case106", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4714989;
        expect(obj.alpha).toBe(-19);
    });

    it("default test case107", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8305827;
        expect(obj.alpha).toBe(-93);
    });

    it("default test case108", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6501003;
        expect(obj.alpha).toBe(-117);
    });

    it("default test case109", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9317352;
        expect(obj.alpha).toBe(0);
    });

    it("default test case110", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7210617;
        expect(obj.alpha).toBe(121);
    });

    it("default test case111", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4371793;
        expect(obj.alpha).toBe(81);
    });

    it("default test case112", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 16590;
        expect(obj.alpha).toBe(-50);
    });

    it("default test case113", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1943368;
        expect(obj.alpha).toBe(72);
    });

    it("default test case114", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 894546;
        expect(obj.alpha).toBe(82);
    });

    it("default test case115", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6715491;
        expect(obj.alpha).toBe(99);
    });

    it("default test case116", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2666908;
        expect(obj.alpha).toBe(-100);
    });

    it("default test case117", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7412304;
        expect(obj.alpha).toBe(80);
    });

    it("default test case118", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4083588;
        expect(obj.alpha).toBe(-124);
    });

    it("default test case119", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8352526;
        expect(obj.alpha).toBe(14);
    });

    it("default test case120", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4033277;
        expect(obj.alpha).toBe(-3);
    });

    it("default test case121", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8808964;
        expect(obj.alpha).toBe(0);
    });

    it("default test case122", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 988296;
        expect(obj.alpha).toBe(-120);
    });

    it("default test case123", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5605696;
        expect(obj.alpha).toBe(64);
    });

    it("default test case124", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 734613;
        expect(obj.alpha).toBe(-107);
    });

    it("default test case125", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8459429;
        expect(obj.alpha).toBe(0);
    });

    it("default test case126", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1965581;
        expect(obj.alpha).toBe(13);
    });

    it("default test case127", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6230812;
        expect(obj.alpha).toBe(28);
    });

    it("default test case128", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9016927;
        expect(obj.alpha).toBe(0);
    });

    it("default test case129", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9028630;
        expect(obj.alpha).toBe(0);
    });

    it("default test case130", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2951089;
        expect(obj.alpha).toBe(-79);
    });

    it("default test case131", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5741322;
        expect(obj.alpha).toBe(10);
    });

    it("default test case132", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5848358;
        expect(obj.alpha).toBe(38);
    });

    it("default test case133", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7181922;
        expect(obj.alpha).toBe(98);
    });

    it("default test case134", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3735832;
        expect(obj.alpha).toBe(24);
    });

    it("default test case135", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4105918;
        expect(obj.alpha).toBe(-66);
    });

    it("default test case136", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9201840;
        expect(obj.alpha).toBe(0);
    });

    it("default test case137", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3941544;
        expect(obj.alpha).toBe(-88);
    });

    it("default test case138", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6376651;
        expect(obj.alpha).toBe(-53);
    });

    it("default test case139", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 897512;
        expect(obj.alpha).toBe(-24);
    });

    it("default test case140", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9588105;
        expect(obj.alpha).toBe(0);
    });

    it("default test case141", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8093190;
        expect(obj.alpha).toBe(6);
    });

    it("default test case142", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9352824;
        expect(obj.alpha).toBe(0);
    });

    it("default test case143", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1540595;
        expect(obj.alpha).toBe(-13);
    });

    it("default test case144", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7086719;
        expect(obj.alpha).toBe(127);
    });

    it("default test case145", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3464612;
        expect(obj.alpha).toBe(-92);
    });

    it("default test case146", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1742168;
        expect(obj.alpha).toBe(88);
    });

    it("default test case147", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8870264;
        expect(obj.alpha).toBe(0);
    });

    it("default test case148", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3723566;
        expect(obj.alpha).toBe(46);
    });

    it("default test case149", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9686781;
        expect(obj.alpha).toBe(0);
    });

    it("default test case150", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7993239;
        expect(obj.alpha).toBe(-105);
    });

    it("default test case151", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 322586;
        expect(obj.alpha).toBe(26);
    });

    it("default test case152", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2019564;
        expect(obj.alpha).toBe(-20);
    });

    it("default test case153", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 854705;
        expect(obj.alpha).toBe(-79);
    });

    it("default test case154", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7657029;
        expect(obj.alpha).toBe(69);
    });

    it("default test case155", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7966317;
        expect(obj.alpha).toBe(109);
    });

    it("default test case156", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4638514;
        expect(obj.alpha).toBe(50);
    });

    it("default test case157", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1992624;
        expect(obj.alpha).toBe(-80);
    });

    it("default test case158", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9410996;
        expect(obj.alpha).toBe(0);
    });

    it("default test case159", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1339583;
        expect(obj.alpha).toBe(-65);
    });

    it("default test case160", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2291212;
        expect(obj.alpha).toBe(12);
    });

    it("default test case161", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1268533;
        expect(obj.alpha).toBe(53);
    });

    it("default test case162", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1455843;
        expect(obj.alpha).toBe(-29);
    });

    it("default test case163", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8871759;
        expect(obj.alpha).toBe(0);
    });

    it("default test case164", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1573545;
        expect(obj.alpha).toBe(-87);
    });

    it("default test case165", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3954253;
        expect(obj.alpha).toBe(77);
    });

    it("default test case166", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7285418;
        expect(obj.alpha).toBe(-86);
    });

    it("default test case167", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9671833;
        expect(obj.alpha).toBe(0);
    });

    it("default test case168", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5144653;
        expect(obj.alpha).toBe(77);
    });

    it("default test case169", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4097770;
        expect(obj.alpha).toBe(-22);
    });

    it("default test case170", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6527122;
        expect(obj.alpha).toBe(-110);
    });

    it("default test case171", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5106332;
        expect(obj.alpha).toBe(-100);
    });

    it("default test case172", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1483289;
        expect(obj.alpha).toBe(25);
    });

    it("default test case173", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6328034;
        expect(obj.alpha).toBe(-30);
    });

    it("default test case174", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2274217;
        expect(obj.alpha).toBe(-87);
    });

    it("default test case175", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4404474;
        expect(obj.alpha).toBe(-6);
    });

    it("default test case176", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1502962;
        expect(obj.alpha).toBe(-14);
    });

    it("default test case177", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5086015;
        expect(obj.alpha).toBe(63);
    });

    it("default test case178", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8941251;
        expect(obj.alpha).toBe(0);
    });

    it("default test case179", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1446233;
        expect(obj.alpha).toBe(89);
    });

    it("default test case180", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 880635;
        expect(obj.alpha).toBe(-5);
    });

    it("default test case181", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3740906;
        expect(obj.alpha).toBe(-22);
    });

    it("default test case182", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3991090;
        expect(obj.alpha).toBe(50);
    });

    it("default test case183", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 987889;
        expect(obj.alpha).toBe(-15);
    });

    it("default test case184", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4430967;
        expect(obj.alpha).toBe(119);
    });

    it("default test case185", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3024200;
        expect(obj.alpha).toBe(72);
    });

    it("default test case186", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6014636;
        expect(obj.alpha).toBe(-84);
    });

    it("default test case187", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6605819;
        expect(obj.alpha).toBe(-5);
    });

    it("default test case188", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 521950;
        expect(obj.alpha).toBe(-34);
    });

    it("default test case189", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5393765;
        expect(obj.alpha).toBe(101);
    });

    it("default test case190", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8084783;
        expect(obj.alpha).toBe(47);
    });

    it("default test case191", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9760428;
        expect(obj.alpha).toBe(0);
    });

    it("default test case192", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5947292;
        expect(obj.alpha).toBe(-100);
    });

    it("default test case193", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6666934;
        expect(obj.alpha).toBe(-74);
    });

    it("default test case194", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7263748;
        expect(obj.alpha).toBe(4);
    });

    it("default test case195", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1985920;
        expect(obj.alpha).toBe(-128);
    });

    it("default test case196", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4367964;
        expect(obj.alpha).toBe(92);
    });

    it("default test case197", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9454502;
        expect(obj.alpha).toBe(0);
    });

    it("default test case198", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4052497;
        expect(obj.alpha).toBe(17);
    });

    it("default test case199", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6690376;
        expect(obj.alpha).toBe(72);
    });

    it("default test case200", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6309674;
        expect(obj.alpha).toBe(42);
    });

    it("default test case201", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4234139;
        expect(obj.alpha).toBe(-101);
    });

    it("default test case202", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7827246;
        expect(obj.alpha).toBe(46);
    });

    it("default test case203", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6371587;
        expect(obj.alpha).toBe(3);
    });

    it("default test case204", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5719396;
        expect(obj.alpha).toBe(100);
    });

    it("default test case205", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9408605;
        expect(obj.alpha).toBe(0);
    });

    it("default test case206", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3826889;
        expect(obj.alpha).toBe(-55);
    });

    it("default test case207", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 633602;
        expect(obj.alpha).toBe(2);
    });

    it("default test case208", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2354007;
        expect(obj.alpha).toBe(87);
    });

    it("default test case209", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8886291;
        expect(obj.alpha).toBe(0);
    });

    it("default test case210", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 863643;
        expect(obj.alpha).toBe(-101);
    });

    it("default test case211", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8712189;
        expect(obj.alpha).toBe(0);
    });

    it("default test case212", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1649671;
        expect(obj.alpha).toBe(7);
    });

    it("default test case213", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7201443;
        expect(obj.alpha).toBe(-93);
    });

    it("default test case214", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6854363;
        expect(obj.alpha).toBe(-37);
    });

    it("default test case215", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2062642;
        expect(obj.alpha).toBe(50);
    });

    it("default test case216", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5879779;
        expect(obj.alpha).toBe(-29);
    });

    it("default test case217", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8423069;
        expect(obj.alpha).toBe(0);
    });

    it("default test case218", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1245671;
        expect(obj.alpha).toBe(-25);
    });

    it("default test case219", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5351942;
        expect(obj.alpha).toBe(6);
    });

    it("default test case220", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6888358;
        expect(obj.alpha).toBe(-90);
    });

    it("default test case221", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7896157;
        expect(obj.alpha).toBe(93);
    });

    it("default test case222", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8089505;
        expect(obj.alpha).toBe(-95);
    });

    it("default test case223", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2924806;
        expect(obj.alpha).toBe(6);
    });

    it("default test case224", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9089936;
        expect(obj.alpha).toBe(0);
    });

    it("default test case225", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8171208;
        expect(obj.alpha).toBe(-56);
    });

    it("default test case226", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7750183;
        expect(obj.alpha).toBe(39);
    });

    it("default test case227", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8000735;
        expect(obj.alpha).toBe(-33);
    });

    it("default test case228", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 38770;
        expect(obj.alpha).toBe(114);
    });

    it("default test case229", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 696830;
        expect(obj.alpha).toBe(-2);
    });

    it("default test case230", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4273029;
        expect(obj.alpha).toBe(-123);
    });

    it("default test case231", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6419977;
        expect(obj.alpha).toBe(9);
    });

    it("default test case232", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3155084;
        expect(obj.alpha).toBe(-116);
    });

    it("default test case233", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3806829;
        expect(obj.alpha).toBe(109);
    });

    it("default test case234", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1577110;
        expect(obj.alpha).toBe(-106);
    });

    it("default test case235", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9231987;
        expect(obj.alpha).toBe(0);
    });

    it("default test case236", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2293054;
        expect(obj.alpha).toBe(62);
    });

    it("default test case237", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9657735;
        expect(obj.alpha).toBe(0);
    });

    it("default test case238", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7811038;
        expect(obj.alpha).toBe(-34);
    });

    it("default test case239", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4547293;
        expect(obj.alpha).toBe(-35);
    });

    it("default test case240", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1283759;
        expect(obj.alpha).toBe(-81);
    });

    it("default test case241", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9561702;
        expect(obj.alpha).toBe(0);
    });

    it("default test case242", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2140056;
        expect(obj.alpha).toBe(-104);
    });

    it("default test case243", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5732827;
        expect(obj.alpha).toBe(-37);
    });

    it("default test case244", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6743749;
        expect(obj.alpha).toBe(-59);
    });

    it("default test case245", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6559362;
        expect(obj.alpha).toBe(-126);
    });

    it("default test case246", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1057759;
        expect(obj.alpha).toBe(-33);
    });

    it("default test case247", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8912065;
        expect(obj.alpha).toBe(0);
    });

    it("default test case248", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6615026;
        expect(obj.alpha).toBe(-14);
    });

    it("default test case249", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1989038;
        expect(obj.alpha).toBe(-82);
    });

    it("default test case250", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2550767;
        expect(obj.alpha).toBe(-17);
    });

    it("default test case251", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8173844;
        expect(obj.alpha).toBe(20);
    });

    it("default test case252", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 71479;
        expect(obj.alpha).toBe(55);
    });

    it("default test case253", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3543295;
        expect(obj.alpha).toBe(-1);
    });

    it("default test case254", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7713335;
        expect(obj.alpha).toBe(55);
    });

    it("default test case255", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9046111;
        expect(obj.alpha).toBe(0);
    });

    it("default test case256", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4662654;
        expect(obj.alpha).toBe(126);
    });

    it("default test case257", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5871551;
        expect(obj.alpha).toBe(-65);
    });

    it("default test case258", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3793580;
        expect(obj.alpha).toBe(-84);
    });

    it("default test case259", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6113912;
        expect(obj.alpha).toBe(120);
    });

    it("default test case260", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8575790;
        expect(obj.alpha).toBe(0);
    });

    it("default test case261", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 161125;
        expect(obj.alpha).toBe(101);
    });

    it("default test case262", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4237233;
        expect(obj.alpha).toBe(-79);
    });

    it("default test case263", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3813273;
        expect(obj.alpha).toBe(-103);
    });

    it("default test case264", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4368316;
        expect(obj.alpha).toBe(-68);
    });

    it("default test case265", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 613060;
        expect(obj.alpha).toBe(-60);
    });

    it("default test case266", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3942251;
        expect(obj.alpha).toBe(107);
    });

    it("default test case267", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1439576;
        expect(obj.alpha).toBe(88);
    });

    it("default test case268", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3609862;
        expect(obj.alpha).toBe(6);
    });

    it("default test case269", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5787061;
        expect(obj.alpha).toBe(-75);
    });

    it("default test case270", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5714605;
        expect(obj.alpha).toBe(-83);
    });

    it("default test case271", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4933792;
        expect(obj.alpha).toBe(-96);
    });

    it("default test case272", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3463041;
        expect(obj.alpha).toBe(-127);
    });

    it("default test case273", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6744082;
        expect(obj.alpha).toBe(18);
    });

    it("default test case274", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6199261;
        expect(obj.alpha).toBe(-35);
    });

    it("default test case275", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7547157;
        expect(obj.alpha).toBe(21);
    });

    it("default test case276", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6290671;
        expect(obj.alpha).toBe(-17);
    });

    it("default test case277", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4829705;
        expect(obj.alpha).toBe(9);
    });

    it("default test case278", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7201697;
        expect(obj.alpha).toBe(-95);
    });

    it("default test case279", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7626161;
        expect(obj.alpha).toBe(-79);
    });

    it("default test case280", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1336778;
        expect(obj.alpha).toBe(-54);
    });

    it("default test case281", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 314136;
        expect(obj.alpha).toBe(24);
    });

    it("default test case282", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5657940;
        expect(obj.alpha).toBe(84);
    });

    it("default test case283", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3161407;
        expect(obj.alpha).toBe(63);
    });

    it("default test case284", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7717210;
        expect(obj.alpha).toBe(90);
    });

    it("default test case285", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6342835;
        expect(obj.alpha).toBe(-77);
    });

    it("default test case286", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9502283;
        expect(obj.alpha).toBe(0);
    });

    it("default test case287", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2081543;
        expect(obj.alpha).toBe(7);
    });

    it("default test case288", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7370384;
        expect(obj.alpha).toBe(-112);
    });

    it("default test case289", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6722468;
        expect(obj.alpha).toBe(-92);
    });

    it("default test case290", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 357137;
        expect(obj.alpha).toBe(17);
    });

    it("default test case291", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2539552;
        expect(obj.alpha).toBe(32);
    });

    it("default test case292", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4817653;
        expect(obj.alpha).toBe(-11);
    });

    it("default test case293", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2438675;
        expect(obj.alpha).toBe(19);
    });

    it("default test case294", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3131920;
        expect(obj.alpha).toBe(16);
    });

    it("default test case295", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6378857;
        expect(obj.alpha).toBe(105);
    });

    it("default test case296", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9985686;
        expect(obj.alpha).toBe(0);
    });

    it("default test case297", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9440967;
        expect(obj.alpha).toBe(0);
    });

    it("default test case298", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 570562;
        expect(obj.alpha).toBe(-62);
    });

    it("default test case299", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6419012;
        expect(obj.alpha).toBe(68);
    });

    it("default test case300", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8462833;
        expect(obj.alpha).toBe(0);
    });

    it("default test case301", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6040744;
        expect(obj.alpha).toBe(-88);
    });

    it("default test case302", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4664293;
        expect(obj.alpha).toBe(-27);
    });

    it("default test case303", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 476454;
        expect(obj.alpha).toBe(38);
    });

    it("default test case304", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2775342;
        expect(obj.alpha).toBe(46);
    });

    it("default test case305", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 932568;
        expect(obj.alpha).toBe(-40);
    });

    it("default test case306", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2580129;
        expect(obj.alpha).toBe(-95);
    });

    it("default test case307", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8519955;
        expect(obj.alpha).toBe(0);
    });

    it("default test case308", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 63545;
        expect(obj.alpha).toBe(57);
    });

    it("default test case309", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3105772;
        expect(obj.alpha).toBe(-20);
    });

    it("default test case310", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7438332;
        expect(obj.alpha).toBe(-4);
    });

    it("default test case311", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2483227;
        expect(obj.alpha).toBe(27);
    });

    it("default test case312", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4349829;
        expect(obj.alpha).toBe(-123);
    });

    it("default test case313", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1033033;
        expect(obj.alpha).toBe(73);
    });

    it("default test case314", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8654483;
        expect(obj.alpha).toBe(0);
    });

    it("default test case315", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1226033;
        expect(obj.alpha).toBe(49);
    });

    it("default test case316", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4348931;
        expect(obj.alpha).toBe(3);
    });

    it("default test case317", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8029859;
        expect(obj.alpha).toBe(-93);
    });

    it("default test case318", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5949115;
        expect(obj.alpha).toBe(-69);
    });

    it("default test case319", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6200686;
        expect(obj.alpha).toBe(110);
    });

    it("default test case320", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5503644;
        expect(obj.alpha).toBe(-100);
    });

    it("default test case321", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4879778;
        expect(obj.alpha).toBe(-94);
    });

    it("default test case322", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5493887;
        expect(obj.alpha).toBe(127);
    });

    it("default test case323", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3123700;
        expect(obj.alpha).toBe(-12);
    });

    it("default test case324", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1449364;
        expect(obj.alpha).toBe(-108);
    });

    it("default test case325", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2223235;
        expect(obj.alpha).toBe(-125);
    });

    it("default test case326", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3482590;
        expect(obj.alpha).toBe(-34);
    });

    it("default test case327", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 438166;
        expect(obj.alpha).toBe(-106);
    });

    it("default test case328", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 255494;
        expect(obj.alpha).toBe(6);
    });

    it("default test case329", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4593300;
        expect(obj.alpha).toBe(-108);
    });

    it("default test case330", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9194384;
        expect(obj.alpha).toBe(0);
    });

    it("default test case331", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6017860;
        expect(obj.alpha).toBe(68);
    });

    it("default test case332", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5431610;
        expect(obj.alpha).toBe(58);
    });

    it("default test case333", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7474437;
        expect(obj.alpha).toBe(5);
    });

    it("default test case334", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3555138;
        expect(obj.alpha).toBe(66);
    });

    it("default test case335", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 574028;
        expect(obj.alpha).toBe(76);
    });

    it("default test case336", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2194942;
        expect(obj.alpha).toBe(-2);
    });

    it("default test case337", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 479983;
        expect(obj.alpha).toBe(-17);
    });

    it("default test case338", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8051618;
        expect(obj.alpha).toBe(-94);
    });

    it("default test case339", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7261542;
        expect(obj.alpha).toBe(102);
    });

    it("default test case340", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9075395;
        expect(obj.alpha).toBe(0);
    });

    it("default test case341", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4323502;
        expect(obj.alpha).toBe(-82);
    });

    it("default test case342", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1309379;
        expect(obj.alpha).toBe(-61);
    });

    it("default test case343", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6374360;
        expect(obj.alpha).toBe(-40);
    });

    it("default test case344", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1587408;
        expect(obj.alpha).toBe(-48);
    });

    it("default test case345", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4157341;
        expect(obj.alpha).toBe(-99);
    });

    it("default test case346", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8373244;
        expect(obj.alpha).toBe(-4);
    });

    it("default test case347", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8813447;
        expect(obj.alpha).toBe(0);
    });

    it("default test case348", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4763056;
        expect(obj.alpha).toBe(-80);
    });

    it("default test case349", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5880067;
        expect(obj.alpha).toBe(3);
    });

    it("default test case350", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4581312;
        expect(obj.alpha).toBe(-64);
    });

    it("default test case351", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7860964;
        expect(obj.alpha).toBe(-28);
    });

    it("default test case352", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7540725;
        expect(obj.alpha).toBe(-11);
    });

    it("default test case353", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6696043;
        expect(obj.alpha).toBe(107);
    });

    it("default test case354", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2907205;
        expect(obj.alpha).toBe(69);
    });

    it("default test case355", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6689141;
        expect(obj.alpha).toBe(117);
    });

    it("default test case356", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2059771;
        expect(obj.alpha).toBe(-5);
    });

    it("default test case357", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3528566;
        expect(obj.alpha).toBe(118);
    });

    it("default test case358", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5435709;
        expect(obj.alpha).toBe(61);
    });

    it("default test case359", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6961647;
        expect(obj.alpha).toBe(-17);
    });

    it("default test case360", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4233028;
        expect(obj.alpha).toBe(68);
    });

    it("default test case361", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6724952;
        expect(obj.alpha).toBe(88);
    });

    it("default test case362", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3668817;
        expect(obj.alpha).toBe(81);
    });

    it("default test case363", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8744765;
        expect(obj.alpha).toBe(0);
    });

    it("default test case364", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7765818;
        expect(obj.alpha).toBe(58);
    });

    it("default test case365", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4770749;
        expect(obj.alpha).toBe(-67);
    });

    it("default test case366", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3628852;
        expect(obj.alpha).toBe(52);
    });

    it("default test case367", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1005838;
        expect(obj.alpha).toBe(14);
    });

    it("default test case368", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 805377;
        expect(obj.alpha).toBe(1);
    });

    it("default test case369", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5171948;
        expect(obj.alpha).toBe(-20);
    });

    it("default test case370", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 692991;
        expect(obj.alpha).toBe(-1);
    });

    it("default test case371", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9046316;
        expect(obj.alpha).toBe(0);
    });

    it("default test case372", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5209350;
        expect(obj.alpha).toBe(6);
    });

    it("default test case373", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7060126;
        expect(obj.alpha).toBe(-98);
    });

    it("default test case374", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6651381;
        expect(obj.alpha).toBe(-11);
    });

    it("default test case375", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 535875;
        expect(obj.alpha).toBe(67);
    });

    it("default test case376", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6028061;
        expect(obj.alpha).toBe(29);
    });

    it("default test case377", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7069080;
        expect(obj.alpha).toBe(-104);
    });

    it("default test case378", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2842488;
        expect(obj.alpha).toBe(120);
    });

    it("default test case379", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2882439;
        expect(obj.alpha).toBe(-121);
    });

    it("default test case380", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2455218;
        expect(obj.alpha).toBe(-78);
    });

    it("default test case381", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2594361;
        expect(obj.alpha).toBe(57);
    });

    it("default test case382", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7584692;
        expect(obj.alpha).toBe(-76);
    });

    it("default test case383", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9139121;
        expect(obj.alpha).toBe(0);
    });

    it("default test case384", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3653078;
        expect(obj.alpha).toBe(-42);
    });

    it("default test case385", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1125904;
        expect(obj.alpha).toBe(16);
    });

    it("default test case386", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1434486;
        expect(obj.alpha).toBe(118);
    });

    it("default test case387", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3055648;
        expect(obj.alpha).toBe(32);
    });

    it("default test case388", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 910690;
        expect(obj.alpha).toBe(98);
    });

    it("default test case389", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4168085;
        expect(obj.alpha).toBe(-107);
    });

    it("default test case390", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2342165;
        expect(obj.alpha).toBe(21);
    });

    it("default test case391", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 569140;
        expect(obj.alpha).toBe(52);
    });

    it("default test case392", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6784542;
        expect(obj.alpha).toBe(30);
    });

    it("default test case393", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1776349;
        expect(obj.alpha).toBe(-35);
    });

    it("default test case394", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9689956;
        expect(obj.alpha).toBe(0);
    });

    it("default test case395", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4365855;
        expect(obj.alpha).toBe(31);
    });

    it("default test case396", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8901452;
        expect(obj.alpha).toBe(0);
    });

    it("default test case397", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5862864;
        expect(obj.alpha).toBe(-48);
    });

    it("default test case398", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9277922;
        expect(obj.alpha).toBe(0);
    });

    it("default test case399", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1991699;
        expect(obj.alpha).toBe(19);
    });

    it("default test case400", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 274429;
        expect(obj.alpha).toBe(-3);
    });

    it("default test case401", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7513086;
        expect(obj.alpha).toBe(-2);
    });

    it("default test case402", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6115008;
        expect(obj.alpha).toBe(-64);
    });

    it("default test case403", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9639437;
        expect(obj.alpha).toBe(0);
    });

    it("default test case404", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9122299;
        expect(obj.alpha).toBe(0);
    });

    it("default test case405", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 368445;
        expect(obj.alpha).toBe(61);
    });

    it("default test case406", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8912532;
        expect(obj.alpha).toBe(0);
    });

    it("default test case407", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 58264;
        expect(obj.alpha).toBe(-104);
    });

    it("default test case408", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4382307;
        expect(obj.alpha).toBe(99);
    });

    it("default test case409", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9614360;
        expect(obj.alpha).toBe(0);
    });

    it("default test case410", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2091222;
        expect(obj.alpha).toBe(-42);
    });

    it("default test case411", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1564211;
        expect(obj.alpha).toBe(51);
    });

    it("default test case412", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2347446;
        expect(obj.alpha).toBe(-74);
    });

    it("default test case413", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8628100;
        expect(obj.alpha).toBe(0);
    });

    it("default test case414", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5530447;
        expect(obj.alpha).toBe(79);
    });

    it("default test case415", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1182252;
        expect(obj.alpha).toBe(44);
    });

    it("default test case416", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2038778;
        expect(obj.alpha).toBe(-6);
    });

    it("default test case417", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8350482;
        expect(obj.alpha).toBe(18);
    });

    it("default test case418", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8434262;
        expect(obj.alpha).toBe(0);
    });

    it("default test case419", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8725594;
        expect(obj.alpha).toBe(0);
    });

    it("default test case420", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9813354;
        expect(obj.alpha).toBe(0);
    });

    it("default test case421", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3557342;
        expect(obj.alpha).toBe(-34);
    });

    it("default test case422", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3910829;
        expect(obj.alpha).toBe(-83);
    });

    it("default test case423", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5277604;
        expect(obj.alpha).toBe(-92);
    });

    it("default test case424", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2894213;
        expect(obj.alpha).toBe(-123);
    });

    it("default test case425", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1531608;
        expect(obj.alpha).toBe(-40);
    });

    it("default test case426", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9822236;
        expect(obj.alpha).toBe(0);
    });

    it("default test case427", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2937303;
        expect(obj.alpha).toBe(-41);
    });

    it("default test case428", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 876703;
        expect(obj.alpha).toBe(-97);
    });

    it("default test case429", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9792929;
        expect(obj.alpha).toBe(0);
    });

    it("default test case430", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2181647;
        expect(obj.alpha).toBe(15);
    });

    it("default test case431", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8633748;
        expect(obj.alpha).toBe(0);
    });

    it("default test case432", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2409406;
        expect(obj.alpha).toBe(-66);
    });

    it("default test case433", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5314895;
        expect(obj.alpha).toBe(79);
    });

    it("default test case434", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9665225;
        expect(obj.alpha).toBe(0);
    });

    it("default test case435", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2367925;
        expect(obj.alpha).toBe(-75);
    });

    it("default test case436", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2323021;
        expect(obj.alpha).toBe(77);
    });

    it("default test case437", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5701084;
        expect(obj.alpha).toBe(-36);
    });

    it("default test case438", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 650391;
        expect(obj.alpha).toBe(-105);
    });

    it("default test case439", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8050508;
        expect(obj.alpha).toBe(76);
    });

    it("default test case440", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9268255;
        expect(obj.alpha).toBe(0);
    });

    it("default test case441", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8619644;
        expect(obj.alpha).toBe(0);
    });

    it("default test case442", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4747982;
        expect(obj.alpha).toBe(-50);
    });

    it("default test case443", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8757756;
        expect(obj.alpha).toBe(0);
    });

    it("default test case444", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7455976;
        expect(obj.alpha).toBe(-24);
    });

    it("default test case445", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7560921;
        expect(obj.alpha).toBe(-39);
    });

    it("default test case446", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3312608;
        expect(obj.alpha).toBe(-32);
    });

    it("default test case447", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7150668;
        expect(obj.alpha).toBe(76);
    });

    it("default test case448", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7785853;
        expect(obj.alpha).toBe(125);
    });

    it("default test case449", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1165625;
        expect(obj.alpha).toBe(57);
    });

    it("default test case450", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7419108;
        expect(obj.alpha).toBe(-28);
    });

    it("default test case451", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1016588;
        expect(obj.alpha).toBe(12);
    });

    it("default test case452", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2873510;
        expect(obj.alpha).toBe(-90);
    });

    it("default test case453", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4889414;
        expect(obj.alpha).toBe(70);
    });

    it("default test case454", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5196398;
        expect(obj.alpha).toBe(110);
    });

    it("default test case455", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 60662;
        expect(obj.alpha).toBe(-10);
    });

    it("default test case456", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2769702;
        expect(obj.alpha).toBe(38);
    });

    it("default test case457", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6843041;
        expect(obj.alpha).toBe(-95);
    });

    it("default test case458", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8956271;
        expect(obj.alpha).toBe(0);
    });

    it("default test case459", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8203619;
        expect(obj.alpha).toBe(99);
    });

    it("default test case460", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6382625;
        expect(obj.alpha).toBe(33);
    });

    it("default test case461", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 885829;
        expect(obj.alpha).toBe(69);
    });

    it("default test case462", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2727168;
        expect(obj.alpha).toBe(0);
    });

    it("default test case463", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5027394;
        expect(obj.alpha).toBe(66);
    });

    it("default test case464", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6916383;
        expect(obj.alpha).toBe(31);
    });

    it("default test case465", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3781180;
        expect(obj.alpha).toBe(60);
    });

    it("default test case466", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 76213;
        expect(obj.alpha).toBe(-75);
    });

    it("default test case467", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7671571;
        expect(obj.alpha).toBe(19);
    });

    it("default test case468", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8531911;
        expect(obj.alpha).toBe(0);
    });

    it("default test case469", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6674044;
        expect(obj.alpha).toBe(124);
    });

    it("default test case470", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4404862;
        expect(obj.alpha).toBe(126);
    });

    it("default test case471", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1210474;
        expect(obj.alpha).toBe(106);
    });

    it("default test case472", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3354464;
        expect(obj.alpha).toBe(96);
    });

    it("default test case473", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7781459;
        expect(obj.alpha).toBe(83);
    });

    it("default test case474", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1105133;
        expect(obj.alpha).toBe(-19);
    });

    it("default test case475", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4471623;
        expect(obj.alpha).toBe(71);
    });

    it("default test case476", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3063257;
        expect(obj.alpha).toBe(-39);
    });

    it("default test case477", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5414234;
        expect(obj.alpha).toBe(90);
    });

    it("default test case478", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5496553;
        expect(obj.alpha).toBe(-23);
    });

    it("default test case479", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6957944;
        expect(obj.alpha).toBe(120);
    });

    it("default test case480", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 723304;
        expect(obj.alpha).toBe(104);
    });

    it("default test case481", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9556277;
        expect(obj.alpha).toBe(0);
    });

    it("default test case482", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2400968;
        expect(obj.alpha).toBe(-56);
    });

    it("default test case483", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5918235;
        expect(obj.alpha).toBe(27);
    });

    it("default test case484", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8273196;
        expect(obj.alpha).toBe(44);
    });

    it("default test case485", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6682141;
        expect(obj.alpha).toBe(29);
    });

    it("default test case486", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1392236;
        expect(obj.alpha).toBe(108);
    });

    it("default test case487", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 202547;
        expect(obj.alpha).toBe(51);
    });

    it("default test case488", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4179374;
        expect(obj.alpha).toBe(-82);
    });

    it("default test case489", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 947718;
        expect(obj.alpha).toBe(6);
    });

    it("default test case490", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8684469;
        expect(obj.alpha).toBe(0);
    });

    it("default test case491", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8918138;
        expect(obj.alpha).toBe(0);
    });

    it("default test case492", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5875113;
        expect(obj.alpha).toBe(-87);
    });

    it("default test case493", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6628278;
        expect(obj.alpha).toBe(-74);
    });

    it("default test case494", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8335379;
        expect(obj.alpha).toBe(19);
    });

    it("default test case495", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 562687;
        expect(obj.alpha).toBe(-1);
    });

    it("default test case496", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1731804;
        expect(obj.alpha).toBe(-36);
    });

    it("default test case497", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 75041;
        expect(obj.alpha).toBe(33);
    });

    it("default test case498", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9235243;
        expect(obj.alpha).toBe(0);
    });

    it("default test case499", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6596173;
        expect(obj.alpha).toBe(77);
    });

    it("default test case500", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1680460;
        expect(obj.alpha).toBe(76);
    });

    it("default test case501", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5024712;
        expect(obj.alpha).toBe(-56);
    });

    it("default test case502", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7908963;
        expect(obj.alpha).toBe(99);
    });

    it("default test case503", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5449113;
        expect(obj.alpha).toBe(-103);
    });

    it("default test case504", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1800899;
        expect(obj.alpha).toBe(-61);
    });

    it("default test case505", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7617717;
        expect(obj.alpha).toBe(-75);
    });

    it("default test case506", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 320161;
        expect(obj.alpha).toBe(-95);
    });

    it("default test case507", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9020603;
        expect(obj.alpha).toBe(0);
    });

    it("default test case508", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9888729;
        expect(obj.alpha).toBe(0);
    });

    it("default test case509", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3814006;
        expect(obj.alpha).toBe(118);
    });

    it("default test case510", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2374021;
        expect(obj.alpha).toBe(-123);
    });

    it("default test case511", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7799227;
        expect(obj.alpha).toBe(-69);
    });

    it("default test case512", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6981066;
        expect(obj.alpha).toBe(-54);
    });

    it("default test case513", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2409313;
        expect(obj.alpha).toBe(97);
    });

    it("default test case514", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9018123;
        expect(obj.alpha).toBe(0);
    });

    it("default test case515", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5388753;
        expect(obj.alpha).toBe(-47);
    });

    it("default test case516", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6665206;
        expect(obj.alpha).toBe(-10);
    });

    it("default test case517", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5420166;
        expect(obj.alpha).toBe(-122);
    });

    it("default test case518", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 141426;
        expect(obj.alpha).toBe(114);
    });

    it("default test case519", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2021205;
        expect(obj.alpha).toBe(85);
    });

    it("default test case520", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3596906;
        expect(obj.alpha).toBe(106);
    });

    it("default test case521", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6202171;
        expect(obj.alpha).toBe(59);
    });

    it("default test case522", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4580067;
        expect(obj.alpha).toBe(-29);
    });

    it("default test case523", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4480676;
        expect(obj.alpha).toBe(-92);
    });

    it("default test case524", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9857394;
        expect(obj.alpha).toBe(0);
    });

    it("default test case525", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2101611;
        expect(obj.alpha).toBe(107);
    });

    it("default test case526", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2132800;
        expect(obj.alpha).toBe(64);
    });

    it("default test case527", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2356906;
        expect(obj.alpha).toBe(-86);
    });

    it("default test case528", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1328463;
        expect(obj.alpha).toBe(79);
    });

    it("default test case529", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5249011;
        expect(obj.alpha).toBe(-13);
    });

    it("default test case530", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1069309;
        expect(obj.alpha).toBe(-3);
    });

    it("default test case531", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6130012;
        expect(obj.alpha).toBe(92);
    });

    it("default test case532", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4490689;
        expect(obj.alpha).toBe(-63);
    });

    it("default test case533", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1911100;
        expect(obj.alpha).toBe(60);
    });

    it("default test case534", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4610566;
        expect(obj.alpha).toBe(6);
    });

    it("default test case535", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2274255;
        expect(obj.alpha).toBe(-49);
    });

    it("default test case536", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6154313;
        expect(obj.alpha).toBe(73);
    });

    it("default test case537", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1822555;
        expect(obj.alpha).toBe(91);
    });

    it("default test case538", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6849204;
        expect(obj.alpha).toBe(-76);
    });

    it("default test case539", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8226702;
        expect(obj.alpha).toBe(-114);
    });

    it("default test case540", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6725228;
        expect(obj.alpha).toBe(108);
    });

    it("default test case541", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2428310;
        expect(obj.alpha).toBe(-106);
    });

    it("default test case542", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6624556;
        expect(obj.alpha).toBe(44);
    });

    it("default test case543", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1619928;
        expect(obj.alpha).toBe(-40);
    });

    it("default test case544", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3136809;
        expect(obj.alpha).toBe(41);
    });

    it("default test case545", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3495966;
        expect(obj.alpha).toBe(30);
    });

    it("default test case546", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5961581;
        expect(obj.alpha).toBe(109);
    });

    it("default test case547", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8322809;
        expect(obj.alpha).toBe(-7);
    });

    it("default test case548", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3920200;
        expect(obj.alpha).toBe(72);
    });

    it("default test case549", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 347176;
        expect(obj.alpha).toBe(40);
    });

    it("default test case550", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1547511;
        expect(obj.alpha).toBe(-9);
    });

    it("default test case551", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4523181;
        expect(obj.alpha).toBe(-83);
    });

    it("default test case552", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5983102;
        expect(obj.alpha).toBe(126);
    });

    it("default test case553", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2913194;
        expect(obj.alpha).toBe(-86);
    });

    it("default test case554", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9457355;
        expect(obj.alpha).toBe(0);
    });

    it("default test case555", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5006952;
        expect(obj.alpha).toBe(104);
    });

    it("default test case556", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 972933;
        expect(obj.alpha).toBe(-123);
    });

    it("default test case557", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8953158;
        expect(obj.alpha).toBe(0);
    });

    it("default test case558", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3290934;
        expect(obj.alpha).toBe(54);
    });

    it("default test case559", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6923774;
        expect(obj.alpha).toBe(-2);
    });

    it("default test case560", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5775657;
        expect(obj.alpha).toBe(41);
    });

    it("default test case561", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8458326;
        expect(obj.alpha).toBe(0);
    });

    it("default test case562", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7557841;
        expect(obj.alpha).toBe(-47);
    });

    it("default test case563", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8637131;
        expect(obj.alpha).toBe(0);
    });

    it("default test case564", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4075555;
        expect(obj.alpha).toBe(35);
    });

    it("default test case565", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 651855;
        expect(obj.alpha).toBe(79);
    });

    it("default test case566", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1072830;
        expect(obj.alpha).toBe(-66);
    });

    it("default test case567", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8188955;
        expect(obj.alpha).toBe(27);
    });

    it("default test case568", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6103493;
        expect(obj.alpha).toBe(-59);
    });

    it("default test case569", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6880764;
        expect(obj.alpha).toBe(-4);
    });

    it("default test case570", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1118147;
        expect(obj.alpha).toBe(-61);
    });

    it("default test case571", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9541144;
        expect(obj.alpha).toBe(0);
    });

    it("default test case572", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6827795;
        expect(obj.alpha).toBe(19);
    });

    it("default test case573", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5864768;
        expect(obj.alpha).toBe(64);
    });

    it("default test case574", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 353437;
        expect(obj.alpha).toBe(-99);
    });

    it("default test case575", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 786461;
        expect(obj.alpha).toBe(29);
    });

    it("default test case576", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9730299;
        expect(obj.alpha).toBe(0);
    });

    it("default test case577", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5008464;
        expect(obj.alpha).toBe(80);
    });

    it("default test case578", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1372522;
        expect(obj.alpha).toBe(106);
    });

    it("default test case579", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1172547;
        expect(obj.alpha).toBe(67);
    });

    it("default test case580", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3150690;
        expect(obj.alpha).toBe(98);
    });

    it("default test case581", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2194214;
        expect(obj.alpha).toBe(38);
    });

    it("default test case582", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5353138;
        expect(obj.alpha).toBe(-78);
    });

    it("default test case583", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4994933;
        expect(obj.alpha).toBe(117);
    });

    it("default test case584", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8207912;
        expect(obj.alpha).toBe(40);
    });

    it("default test case585", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 897861;
        expect(obj.alpha).toBe(69);
    });

    it("default test case586", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5233933;
        expect(obj.alpha).toBe(13);
    });

    it("default test case587", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 823290;
        expect(obj.alpha).toBe(-6);
    });

    it("default test case588", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6432716;
        expect(obj.alpha).toBe(-52);
    });

    it("default test case589", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9202572;
        expect(obj.alpha).toBe(0);
    });

    it("default test case590", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 61764;
        expect(obj.alpha).toBe(68);
    });

    it("default test case591", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9203063;
        expect(obj.alpha).toBe(0);
    });

    it("default test case592", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1631273;
        expect(obj.alpha).toBe(41);
    });

    it("default test case593", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1043858;
        expect(obj.alpha).toBe(-110);
    });

    it("default test case594", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1709897;
        expect(obj.alpha).toBe(73);
    });

    it("default test case595", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9280582;
        expect(obj.alpha).toBe(0);
    });

    it("default test case596", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6918373;
        expect(obj.alpha).toBe(-27);
    });

    it("default test case597", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8125904;
        expect(obj.alpha).toBe(-48);
    });

    it("default test case598", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5812494;
        expect(obj.alpha).toBe(14);
    });

    it("default test case599", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8611208;
        expect(obj.alpha).toBe(0);
    });

    it("default test case600", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 786367;
        expect(obj.alpha).toBe(-65);
    });

    it("default test case601", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6589465;
        expect(obj.alpha).toBe(25);
    });

    it("default test case602", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5207552;
        expect(obj.alpha).toBe(0);
    });

    it("default test case603", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3083908;
        expect(obj.alpha).toBe(-124);
    });

    it("default test case604", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9153273;
        expect(obj.alpha).toBe(0);
    });

    it("default test case605", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8572378;
        expect(obj.alpha).toBe(0);
    });

    it("default test case606", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4076675;
        expect(obj.alpha).toBe(-125);
    });

    it("default test case607", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4063553;
        expect(obj.alpha).toBe(65);
    });

    it("default test case608", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9587841;
        expect(obj.alpha).toBe(0);
    });

    it("default test case609", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4703734;
        expect(obj.alpha).toBe(-10);
    });

    it("default test case610", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9923252;
        expect(obj.alpha).toBe(0);
    });

    it("default test case611", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5340994;
        expect(obj.alpha).toBe(66);
    });

    it("default test case612", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7728209;
        expect(obj.alpha).toBe(81);
    });

    it("default test case613", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9394449;
        expect(obj.alpha).toBe(0);
    });

    it("default test case614", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5977043;
        expect(obj.alpha).toBe(-45);
    });

    it("default test case615", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1515841;
        expect(obj.alpha).toBe(65);
    });

    it("default test case616", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6144732;
        expect(obj.alpha).toBe(-36);
    });

    it("default test case617", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8848444;
        expect(obj.alpha).toBe(0);
    });

    it("default test case618", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9475989;
        expect(obj.alpha).toBe(0);
    });

    it("default test case619", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8170479;
        expect(obj.alpha).toBe(-17);
    });

    it("default test case620", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3052991;
        expect(obj.alpha).toBe(-65);
    });

    it("default test case621", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1030613;
        expect(obj.alpha).toBe(-43);
    });

    it("default test case622", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8385668;
        expect(obj.alpha).toBe(-124);
    });

    it("default test case623", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6340992;
        expect(obj.alpha).toBe(-128);
    });

    it("default test case624", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5704315;
        expect(obj.alpha).toBe(123);
    });

    it("default test case625", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3633873;
        expect(obj.alpha).toBe(-47);
    });

    it("default test case626", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9612033;
        expect(obj.alpha).toBe(0);
    });

    it("default test case627", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6102494;
        expect(obj.alpha).toBe(-34);
    });

    it("default test case628", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7059253;
        expect(obj.alpha).toBe(53);
    });

    it("default test case629", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5828647;
        expect(obj.alpha).toBe(39);
    });

    it("default test case630", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2835398;
        expect(obj.alpha).toBe(-58);
    });

    it("default test case631", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 28971;
        expect(obj.alpha).toBe(43);
    });

    it("default test case632", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8479058;
        expect(obj.alpha).toBe(0);
    });

    it("default test case633", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9420395;
        expect(obj.alpha).toBe(0);
    });

    it("default test case634", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6793926;
        expect(obj.alpha).toBe(-58);
    });

    it("default test case635", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8283098;
        expect(obj.alpha).toBe(-38);
    });

    it("default test case636", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8708200;
        expect(obj.alpha).toBe(0);
    });

    it("default test case637", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4120461;
        expect(obj.alpha).toBe(-115);
    });

    it("default test case638", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4879907;
        expect(obj.alpha).toBe(35);
    });

    it("default test case639", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3525520;
        expect(obj.alpha).toBe(-112);
    });

    it("default test case640", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1297078;
        expect(obj.alpha).toBe(-74);
    });

    it("default test case641", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2889391;
        expect(obj.alpha).toBe(-81);
    });

    it("default test case642", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9248023;
        expect(obj.alpha).toBe(0);
    });

    it("default test case643", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4848281;
        expect(obj.alpha).toBe(-103);
    });

    it("default test case644", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5067079;
        expect(obj.alpha).toBe(71);
    });

    it("default test case645", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1467836;
        expect(obj.alpha).toBe(-68);
    });

    it("default test case646", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7109609;
        expect(obj.alpha).toBe(-23);
    });

    it("default test case647", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2148698;
        expect(obj.alpha).toBe(90);
    });

    it("default test case648", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4028176;
        expect(obj.alpha).toBe(16);
    });

    it("default test case649", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7197392;
        expect(obj.alpha).toBe(-48);
    });

    it("default test case650", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8457432;
        expect(obj.alpha).toBe(0);
    });

    it("default test case651", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3703612;
        expect(obj.alpha).toBe(60);
    });

    it("default test case652", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9406909;
        expect(obj.alpha).toBe(0);
    });

    it("default test case653", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9538884;
        expect(obj.alpha).toBe(0);
    });

    it("default test case654", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2905875;
        expect(obj.alpha).toBe(19);
    });

    it("default test case655", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7895843;
        expect(obj.alpha).toBe(35);
    });

    it("default test case656", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1561285;
        expect(obj.alpha).toBe(-59);
    });

    it("default test case657", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9862210;
        expect(obj.alpha).toBe(0);
    });

    it("default test case658", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9472828;
        expect(obj.alpha).toBe(0);
    });

    it("default test case659", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8027667;
        expect(obj.alpha).toBe(19);
    });

    it("default test case660", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4151373;
        expect(obj.alpha).toBe(77);
    });

    it("default test case661", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2470162;
        expect(obj.alpha).toBe(18);
    });

    it("default test case662", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7689860;
        expect(obj.alpha).toBe(-124);
    });

    it("default test case663", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1486608;
        expect(obj.alpha).toBe(16);
    });

    it("default test case664", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8926694;
        expect(obj.alpha).toBe(0);
    });

    it("default test case665", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4907642;
        expect(obj.alpha).toBe(122);
    });

    it("default test case666", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3785657;
        expect(obj.alpha).toBe(-71);
    });

    it("default test case667", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7538630;
        expect(obj.alpha).toBe(-58);
    });

    it("default test case668", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9467572;
        expect(obj.alpha).toBe(0);
    });

    it("default test case669", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3089374;
        expect(obj.alpha).toBe(-34);
    });

    it("default test case670", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4113801;
        expect(obj.alpha).toBe(-119);
    });

    it("default test case671", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2090192;
        expect(obj.alpha).toBe(-48);
    });

    it("default test case672", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 407181;
        expect(obj.alpha).toBe(-115);
    });

    it("default test case673", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8465290;
        expect(obj.alpha).toBe(0);
    });

    it("default test case674", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9913025;
        expect(obj.alpha).toBe(0);
    });

    it("default test case675", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1091179;
        expect(obj.alpha).toBe(107);
    });

    it("default test case676", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 820395;
        expect(obj.alpha).toBe(-85);
    });

    it("default test case677", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2956525;
        expect(obj.alpha).toBe(-19);
    });

    it("default test case678", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2540232;
        expect(obj.alpha).toBe(-56);
    });

    it("default test case679", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6097995;
        expect(obj.alpha).toBe(75);
    });

    it("default test case680", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1921465;
        expect(obj.alpha).toBe(-71);
    });

    it("default test case681", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8424859;
        expect(obj.alpha).toBe(0);
    });

    it("default test case682", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2913139;
        expect(obj.alpha).toBe(115);
    });

    it("default test case683", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5098886;
        expect(obj.alpha).toBe(-122);
    });

    it("default test case684", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 225368;
        expect(obj.alpha).toBe(88);
    });

    it("default test case685", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9917561;
        expect(obj.alpha).toBe(0);
    });

    it("default test case686", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4003781;
        expect(obj.alpha).toBe(-59);
    });

    it("default test case687", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5105924;
        expect(obj.alpha).toBe(4);
    });

    it("default test case688", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6696251;
        expect(obj.alpha).toBe(59);
    });

    it("default test case689", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8093897;
        expect(obj.alpha).toBe(-55);
    });

    it("default test case690", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2055473;
        expect(obj.alpha).toBe(49);
    });

    it("default test case691", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7900550;
        expect(obj.alpha).toBe(-122);
    });

    it("default test case692", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4488192;
        expect(obj.alpha).toBe(0);
    });

    it("default test case693", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5597154;
        expect(obj.alpha).toBe(-30);
    });

    it("default test case694", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5834865;
        expect(obj.alpha).toBe(113);
    });

    it("default test case695", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7846331;
        expect(obj.alpha).toBe(-69);
    });

    it("default test case696", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3067365;
        expect(obj.alpha).toBe(-27);
    });

    it("default test case697", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3772412;
        expect(obj.alpha).toBe(-4);
    });

    it("default test case698", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3275218;
        expect(obj.alpha).toBe(-46);
    });

    it("default test case699", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3320722;
        expect(obj.alpha).toBe(-110);
    });

    it("default test case700", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7133780;
        expect(obj.alpha).toBe(84);
    });

    it("default test case701", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6156878;
        expect(obj.alpha).toBe(78);
    });

    it("default test case702", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 723821;
        expect(obj.alpha).toBe(109);
    });

    it("default test case703", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1279615;
        expect(obj.alpha).toBe(127);
    });

    it("default test case704", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9082354;
        expect(obj.alpha).toBe(0);
    });

    it("default test case705", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7568826;
        expect(obj.alpha).toBe(-70);
    });

    it("default test case706", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 770738;
        expect(obj.alpha).toBe(-78);
    });

    it("default test case707", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5488159;
        expect(obj.alpha).toBe(31);
    });

    it("default test case708", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7847448;
        expect(obj.alpha).toBe(24);
    });

    it("default test case709", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4838957;
        expect(obj.alpha).toBe(45);
    });

    it("default test case710", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4100848;
        expect(obj.alpha).toBe(-16);
    });

    it("default test case711", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4408874;
        expect(obj.alpha).toBe(42);
    });

    it("default test case712", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 422376;
        expect(obj.alpha).toBe(-24);
    });

    it("default test case713", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7436457;
        expect(obj.alpha).toBe(-87);
    });

    it("default test case714", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3469951;
        expect(obj.alpha).toBe(127);
    });

    it("default test case715", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7385602;
        expect(obj.alpha).toBe(2);
    });

    it("default test case716", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5950583;
        expect(obj.alpha).toBe(119);
    });

    it("default test case717", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 194884;
        expect(obj.alpha).toBe(68);
    });

    it("default test case718", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5604328;
        expect(obj.alpha).toBe(-24);
    });

    it("default test case719", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5554602;
        expect(obj.alpha).toBe(-86);
    });

    it("default test case720", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 352498;
        expect(obj.alpha).toBe(-14);
    });

    it("default test case721", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1752316;
        expect(obj.alpha).toBe(-4);
    });

    it("default test case722", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3437882;
        expect(obj.alpha).toBe(58);
    });

    it("default test case723", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2653800;
        expect(obj.alpha).toBe(104);
    });

    it("default test case724", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3570524;
        expect(obj.alpha).toBe(92);
    });

    it("default test case725", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7083797;
        expect(obj.alpha).toBe(21);
    });

    it("default test case726", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8201502;
        expect(obj.alpha).toBe(30);
    });

    it("default test case727", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3100967;
        expect(obj.alpha).toBe(39);
    });

    it("default test case728", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8783255;
        expect(obj.alpha).toBe(0);
    });

    it("default test case729", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4380691;
        expect(obj.alpha).toBe(19);
    });

    it("default test case730", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9921264;
        expect(obj.alpha).toBe(0);
    });

    it("default test case731", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 669595;
        expect(obj.alpha).toBe(-101);
    });

    it("default test case732", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 375493;
        expect(obj.alpha).toBe(-59);
    });

    it("default test case733", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5934204;
        expect(obj.alpha).toBe(124);
    });

    it("default test case734", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6756244;
        expect(obj.alpha).toBe(-108);
    });

    it("default test case735", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4496980;
        expect(obj.alpha).toBe(84);
    });

    it("default test case736", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2648249;
        expect(obj.alpha).toBe(-71);
    });

    it("default test case737", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1868120;
        expect(obj.alpha).toBe(88);
    });

    it("default test case738", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7364508;
        expect(obj.alpha).toBe(-100);
    });

    it("default test case739", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4854688;
        expect(obj.alpha).toBe(-96);
    });

    it("default test case740", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6358139;
        expect(obj.alpha).toBe(123);
    });

    it("default test case741", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9922958;
        expect(obj.alpha).toBe(0);
    });

    it("default test case742", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3977278;
        expect(obj.alpha).toBe(62);
    });

    it("default test case743", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2410262;
        expect(obj.alpha).toBe(22);
    });

    it("default test case744", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9627254;
        expect(obj.alpha).toBe(0);
    });

    it("default test case745", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1971869;
        expect(obj.alpha).toBe(-99);
    });

    it("default test case746", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4140591;
        expect(obj.alpha).toBe(47);
    });

    it("default test case747", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5596917;
        expect(obj.alpha).toBe(-11);
    });

    it("default test case748", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9741304;
        expect(obj.alpha).toBe(0);
    });

    it("default test case749", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3319314;
        expect(obj.alpha).toBe(18);
    });

    it("default test case750", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9931327;
        expect(obj.alpha).toBe(0);
    });

    it("default test case751", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4066409;
        expect(obj.alpha).toBe(105);
    });

    it("default test case752", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5216326;
        expect(obj.alpha).toBe(70);
    });

    it("default test case753", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5651045;
        expect(obj.alpha).toBe(101);
    });

    it("default test case754", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7419879;
        expect(obj.alpha).toBe(-25);
    });

    it("default test case755", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9460813;
        expect(obj.alpha).toBe(0);
    });

    it("default test case756", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3001256;
        expect(obj.alpha).toBe(-88);
    });

    it("default test case757", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 918369;
        expect(obj.alpha).toBe(97);
    });

    it("default test case758", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1490957;
        expect(obj.alpha).toBe(13);
    });

    it("default test case759", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9756136;
        expect(obj.alpha).toBe(0);
    });

    it("default test case760", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5225261;
        expect(obj.alpha).toBe(45);
    });

    it("default test case761", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3849506;
        expect(obj.alpha).toBe(34);
    });

    it("default test case762", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4569884;
        expect(obj.alpha).toBe(28);
    });

    it("default test case763", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9938609;
        expect(obj.alpha).toBe(0);
    });

    it("default test case764", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7036452;
        expect(obj.alpha).toBe(36);
    });

    it("default test case765", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 19249;
        expect(obj.alpha).toBe(49);
    });

    it("default test case766", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4351922;
        expect(obj.alpha).toBe(-78);
    });

    it("default test case767", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2433757;
        expect(obj.alpha).toBe(-35);
    });

    it("default test case768", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9914620;
        expect(obj.alpha).toBe(0);
    });

    it("default test case769", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8649425;
        expect(obj.alpha).toBe(0);
    });

    it("default test case770", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4120909;
        expect(obj.alpha).toBe(77);
    });

    it("default test case771", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8933348;
        expect(obj.alpha).toBe(0);
    });

    it("default test case772", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4433998;
        expect(obj.alpha).toBe(78);
    });

    it("default test case773", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4885386;
        expect(obj.alpha).toBe(-118);
    });

    it("default test case774", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 322078;
        expect(obj.alpha).toBe(30);
    });

    it("default test case775", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7904497;
        expect(obj.alpha).toBe(-15);
    });

    it("default test case776", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4895556;
        expect(obj.alpha).toBe(68);
    });

    it("default test case777", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 630312;
        expect(obj.alpha).toBe(40);
    });

    it("default test case778", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9595600;
        expect(obj.alpha).toBe(0);
    });

    it("default test case779", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8742378;
        expect(obj.alpha).toBe(0);
    });

    it("default test case780", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2804413;
        expect(obj.alpha).toBe(-67);
    });

    it("default test case781", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1418263;
        expect(obj.alpha).toBe(23);
    });

    it("default test case782", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2280072;
        expect(obj.alpha).toBe(-120);
    });

    it("default test case783", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2442057;
        expect(obj.alpha).toBe(73);
    });

    it("default test case784", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2967456;
        expect(obj.alpha).toBe(-96);
    });

    it("default test case785", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2979639;
        expect(obj.alpha).toBe(55);
    });

    it("default test case786", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8337382;
        expect(obj.alpha).toBe(-26);
    });

    it("default test case787", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1005279;
        expect(obj.alpha).toBe(-33);
    });

    it("default test case788", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6248178;
        expect(obj.alpha).toBe(-14);
    });

    it("default test case789", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1193705;
        expect(obj.alpha).toBe(-23);
    });

    it("default test case790", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5626039;
        expect(obj.alpha).toBe(-73);
    });

    it("default test case791", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1646372;
        expect(obj.alpha).toBe(36);
    });

    it("default test case792", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5861207;
        expect(obj.alpha).toBe(87);
    });

    it("default test case793", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2704617;
        expect(obj.alpha).toBe(-23);
    });

    it("default test case794", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6047777;
        expect(obj.alpha).toBe(33);
    });

    it("default test case795", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8151832;
        expect(obj.alpha).toBe(24);
    });

    it("default test case796", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8221184;
        expect(obj.alpha).toBe(0);
    });

    it("default test case797", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1589363;
        expect(obj.alpha).toBe(115);
    });

    it("default test case798", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1453520;
        expect(obj.alpha).toBe(-48);
    });

    it("default test case799", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2400823;
        expect(obj.alpha).toBe(55);
    });

    it("default test case800", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5922994;
        expect(obj.alpha).toBe(-78);
    });

    it("default test case801", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8612013;
        expect(obj.alpha).toBe(0);
    });

    it("default test case802", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2893063;
        expect(obj.alpha).toBe(7);
    });

    it("default test case803", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9281886;
        expect(obj.alpha).toBe(0);
    });

    it("default test case804", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 939774;
        expect(obj.alpha).toBe(-2);
    });

    it("default test case805", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8940844;
        expect(obj.alpha).toBe(0);
    });

    it("default test case806", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5593427;
        expect(obj.alpha).toBe(83);
    });

    it("default test case807", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6008456;
        expect(obj.alpha).toBe(-120);
    });

    it("default test case808", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3581295;
        expect(obj.alpha).toBe(111);
    });

    it("default test case809", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6113354;
        expect(obj.alpha).toBe(74);
    });

    it("default test case810", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2314640;
        expect(obj.alpha).toBe(-112);
    });

    it("default test case811", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5451524;
        expect(obj.alpha).toBe(4);
    });

    it("default test case812", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9867207;
        expect(obj.alpha).toBe(0);
    });

    it("default test case813", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8391977;
        expect(obj.alpha).toBe(0);
    });

    it("default test case814", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 104465;
        expect(obj.alpha).toBe(17);
    });

    it("default test case815", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1930069;
        expect(obj.alpha).toBe(85);
    });

    it("default test case816", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2606711;
        expect(obj.alpha).toBe(119);
    });

    it("default test case817", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6845836;
        expect(obj.alpha).toBe(-116);
    });

    it("default test case818", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1501996;
        expect(obj.alpha).toBe(44);
    });

    it("default test case819", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9310782;
        expect(obj.alpha).toBe(0);
    });

    it("default test case820", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2583230;
        expect(obj.alpha).toBe(-66);
    });

    it("default test case821", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8644542;
        expect(obj.alpha).toBe(0);
    });

    it("default test case822", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2543834;
        expect(obj.alpha).toBe(-38);
    });

    it("default test case823", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8046057;
        expect(obj.alpha).toBe(-23);
    });

    it("default test case824", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5646015;
        expect(obj.alpha).toBe(-65);
    });

    it("default test case825", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3418600;
        expect(obj.alpha).toBe(-24);
    });

    it("default test case826", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8256940;
        expect(obj.alpha).toBe(-84);
    });

    it("default test case827", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1914175;
        expect(obj.alpha).toBe(63);
    });

    it("default test case828", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9188163;
        expect(obj.alpha).toBe(0);
    });

    it("default test case829", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 702437;
        expect(obj.alpha).toBe(-27);
    });

    it("default test case830", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4225516;
        expect(obj.alpha).toBe(-20);
    });

    it("default test case831", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8267125;
        expect(obj.alpha).toBe(117);
    });

    it("default test case832", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3918814;
        expect(obj.alpha).toBe(-34);
    });

    it("default test case833", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8265260;
        expect(obj.alpha).toBe(44);
    });

    it("default test case834", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6728619;
        expect(obj.alpha).toBe(-85);
    });

    it("default test case835", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2113534;
        expect(obj.alpha).toBe(-2);
    });

    it("default test case836", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2307700;
        expect(obj.alpha).toBe(116);
    });

    it("default test case837", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1135364;
        expect(obj.alpha).toBe(4);
    });

    it("default test case838", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5774673;
        expect(obj.alpha).toBe(81);
    });

    it("default test case839", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3450564;
        expect(obj.alpha).toBe(-60);
    });

    it("default test case840", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2942356;
        expect(obj.alpha).toBe(-108);
    });

    it("default test case841", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 578878;
        expect(obj.alpha).toBe(62);
    });

    it("default test case842", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9219511;
        expect(obj.alpha).toBe(0);
    });

    it("default test case843", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4645075;
        expect(obj.alpha).toBe(-45);
    });

    it("default test case844", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8194766;
        expect(obj.alpha).toBe(-50);
    });

    it("default test case845", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 448041;
        expect(obj.alpha).toBe(41);
    });

    it("default test case846", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9950314;
        expect(obj.alpha).toBe(0);
    });

    it("default test case847", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 365786;
        expect(obj.alpha).toBe(-38);
    });

    it("default test case848", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7664823;
        expect(obj.alpha).toBe(-73);
    });

    it("default test case849", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5605816;
        expect(obj.alpha).toBe(-72);
    });

    it("default test case850", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 142558;
        expect(obj.alpha).toBe(-34);
    });

    it("default test case851", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2958643;
        expect(obj.alpha).toBe(51);
    });

    it("default test case852", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 663853;
        expect(obj.alpha).toBe(45);
    });

    it("default test case853", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5781566;
        expect(obj.alpha).toBe(62);
    });

    it("default test case854", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5781010;
        expect(obj.alpha).toBe(18);
    });

    it("default test case855", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3079317;
        expect(obj.alpha).toBe(-107);
    });

    it("default test case856", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8983210;
        expect(obj.alpha).toBe(0);
    });

    it("default test case857", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5616360;
        expect(obj.alpha).toBe(-24);
    });

    it("default test case858", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4612147;
        expect(obj.alpha).toBe(51);
    });

    it("default test case859", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 238030;
        expect(obj.alpha).toBe(-50);
    });

    it("default test case860", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4370840;
        expect(obj.alpha).toBe(-104);
    });

    it("default test case861", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3212085;
        expect(obj.alpha).toBe(53);
    });

    it("default test case862", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1071022;
        expect(obj.alpha).toBe(-82);
    });

    it("default test case863", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4882813;
        expect(obj.alpha).toBe(125);
    });

    it("default test case864", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4108657;
        expect(obj.alpha).toBe(113);
    });

    it("default test case865", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3684801;
        expect(obj.alpha).toBe(-63);
    });

    it("default test case866", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5528555;
        expect(obj.alpha).toBe(-21);
    });

    it("default test case867", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2527762;
        expect(obj.alpha).toBe(18);
    });

    it("default test case868", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1020985;
        expect(obj.alpha).toBe(57);
    });

    it("default test case869", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8898100;
        expect(obj.alpha).toBe(0);
    });

    it("default test case870", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6864166;
        expect(obj.alpha).toBe(38);
    });

    it("default test case871", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7941645;
        expect(obj.alpha).toBe(13);
    });

    it("default test case872", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2076088;
        expect(obj.alpha).toBe(-72);
    });

    it("default test case873", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8921304;
        expect(obj.alpha).toBe(0);
    });

    it("default test case874", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9932604;
        expect(obj.alpha).toBe(0);
    });

    it("default test case875", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1026782;
        expect(obj.alpha).toBe(-34);
    });

    it("default test case876", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4637410;
        expect(obj.alpha).toBe(-30);
    });

    it("default test case877", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3904074;
        expect(obj.alpha).toBe(74);
    });

    it("default test case878", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5421794;
        expect(obj.alpha).toBe(-30);
    });

    it("default test case879", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4700454;
        expect(obj.alpha).toBe(38);
    });

    it("default test case880", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1064354;
        expect(obj.alpha).toBe(-94);
    });

    it("default test case881", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4056749;
        expect(obj.alpha).toBe(-83);
    });

    it("default test case882", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8494597;
        expect(obj.alpha).toBe(0);
    });

    it("default test case883", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 942669;
        expect(obj.alpha).toBe(77);
    });

    it("default test case884", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8496136;
        expect(obj.alpha).toBe(0);
    });

    it("default test case885", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2203923;
        expect(obj.alpha).toBe(19);
    });

    it("default test case886", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4024914;
        expect(obj.alpha).toBe(82);
    });

    it("default test case887", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7940699;
        expect(obj.alpha).toBe(91);
    });

    it("default test case888", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7943856;
        expect(obj.alpha).toBe(-80);
    });

    it("default test case889", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1160955;
        expect(obj.alpha).toBe(-5);
    });

    it("default test case890", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4628341;
        expect(obj.alpha).toBe(117);
    });

    it("default test case891", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3328194;
        expect(obj.alpha).toBe(-62);
    });

    it("default test case892", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2023942;
        expect(obj.alpha).toBe(6);
    });

    it("default test case893", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3800908;
        expect(obj.alpha).toBe(76);
    });

    it("default test case894", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9842879;
        expect(obj.alpha).toBe(0);
    });

    it("default test case895", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6738196;
        expect(obj.alpha).toBe(20);
    });

    it("default test case896", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3875125;
        expect(obj.alpha).toBe(53);
    });

    it("default test case897", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4075323;
        expect(obj.alpha).toBe(59);
    });

    it("default test case898", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3620349;
        expect(obj.alpha).toBe(-3);
    });

    it("default test case899", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7777102;
        expect(obj.alpha).toBe(78);
    });

    it("default test case900", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1651588;
        expect(obj.alpha).toBe(-124);
    });

    it("default test case901", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4945730;
        expect(obj.alpha).toBe(66);
    });

    it("default test case902", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3061522;
        expect(obj.alpha).toBe(18);
    });

    it("default test case903", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 474525;
        expect(obj.alpha).toBe(-99);
    });

    it("default test case904", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8825139;
        expect(obj.alpha).toBe(0);
    });

    it("default test case905", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 922705;
        expect(obj.alpha).toBe(81);
    });

    it("default test case906", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8866130;
        expect(obj.alpha).toBe(0);
    });

    it("default test case907", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6602432;
        expect(obj.alpha).toBe(-64);
    });

    it("default test case908", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9757867;
        expect(obj.alpha).toBe(0);
    });

    it("default test case909", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6663509;
        expect(obj.alpha).toBe(85);
    });

    it("default test case910", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4820611;
        expect(obj.alpha).toBe(-125);
    });

    it("default test case911", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3102147;
        expect(obj.alpha).toBe(-61);
    });

    it("default test case912", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 39002;
        expect(obj.alpha).toBe(90);
    });

    it("default test case913", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 246100;
        expect(obj.alpha).toBe(84);
    });

    it("default test case914", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 26780;
        expect(obj.alpha).toBe(-100);
    });

    it("default test case915", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9670792;
        expect(obj.alpha).toBe(0);
    });

    it("default test case916", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6775567;
        expect(obj.alpha).toBe(15);
    });

    it("default test case917", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5721758;
        expect(obj.alpha).toBe(-98);
    });

    it("default test case918", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2393386;
        expect(obj.alpha).toBe(42);
    });

    it("default test case919", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9714449;
        expect(obj.alpha).toBe(0);
    });

    it("default test case920", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6486121;
        expect(obj.alpha).toBe(105);
    });

    it("default test case921", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9983923;
        expect(obj.alpha).toBe(0);
    });

    it("default test case922", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8023526;
        expect(obj.alpha).toBe(-26);
    });

    it("default test case923", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7646677;
        expect(obj.alpha).toBe(-43);
    });

    it("default test case924", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7544979;
        expect(obj.alpha).toBe(-109);
    });

    it("default test case925", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 179283;
        expect(obj.alpha).toBe(83);
    });

    it("default test case926", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1398634;
        expect(obj.alpha).toBe(106);
    });

    it("default test case927", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4166438;
        expect(obj.alpha).toBe(38);
    });

    it("default test case928", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3053591;
        expect(obj.alpha).toBe(23);
    });

    it("default test case929", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2442160;
        expect(obj.alpha).toBe(-80);
    });

    it("default test case930", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2187883;
        expect(obj.alpha).toBe(107);
    });

    it("default test case931", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7725485;
        expect(obj.alpha).toBe(-83);
    });

    it("default test case932", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1263360;
        expect(obj.alpha).toBe(0);
    });

    it("default test case933", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3403442;
        expect(obj.alpha).toBe(-78);
    });

    it("default test case934", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9666851;
        expect(obj.alpha).toBe(0);
    });

    it("default test case935", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9443717;
        expect(obj.alpha).toBe(0);
    });

    it("default test case936", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8081378;
        expect(obj.alpha).toBe(-30);
    });

    it("default test case937", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7398654;
        expect(obj.alpha).toBe(-2);
    });

    it("default test case938", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2554041;
        expect(obj.alpha).toBe(-71);
    });

    it("default test case939", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1695929;
        expect(obj.alpha).toBe(-71);
    });

    it("default test case940", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9230987;
        expect(obj.alpha).toBe(0);
    });

    it("default test case941", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5334876;
        expect(obj.alpha).toBe(92);
    });

    it("default test case942", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9303955;
        expect(obj.alpha).toBe(0);
    });

    it("default test case943", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8775511;
        expect(obj.alpha).toBe(0);
    });

    it("default test case944", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5288651;
        expect(obj.alpha).toBe(-53);
    });

    it("default test case945", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2472654;
        expect(obj.alpha).toBe(-50);
    });

    it("default test case946", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5109860;
        expect(obj.alpha).toBe(100);
    });

    it("default test case947", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8895691;
        expect(obj.alpha).toBe(0);
    });

    it("default test case948", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2159016;
        expect(obj.alpha).toBe(-88);
    });

    it("default test case949", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3410847;
        expect(obj.alpha).toBe(-97);
    });

    it("default test case950", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3741947;
        expect(obj.alpha).toBe(-5);
    });

    it("default test case951", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4372816;
        expect(obj.alpha).toBe(80);
    });

    it("default test case952", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2853171;
        expect(obj.alpha).toBe(51);
    });

    it("default test case953", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1287964;
        expect(obj.alpha).toBe(28);
    });

    it("default test case954", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6901768;
        expect(obj.alpha).toBe(8);
    });

    it("default test case955", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9565987;
        expect(obj.alpha).toBe(0);
    });

    it("default test case956", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4731512;
        expect(obj.alpha).toBe(120);
    });

    it("default test case957", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3236829;
        expect(obj.alpha).toBe(-35);
    });

    it("default test case958", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3615919;
        expect(obj.alpha).toBe(-81);
    });

    it("default test case959", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6808701;
        expect(obj.alpha).toBe(125);
    });

    it("default test case960", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1509851;
        expect(obj.alpha).toBe(-37);
    });

    it("default test case961", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3137385;
        expect(obj.alpha).toBe(105);
    });

    it("default test case962", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8831192;
        expect(obj.alpha).toBe(0);
    });

    it("default test case963", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1927224;
        expect(obj.alpha).toBe(56);
    });

    it("default test case964", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8376055;
        expect(obj.alpha).toBe(-9);
    });

    it("default test case965", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4452986;
        expect(obj.alpha).toBe(122);
    });

    it("default test case966", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7368156;
        expect(obj.alpha).toBe(-36);
    });

    it("default test case967", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2469610;
        expect(obj.alpha).toBe(-22);
    });

    it("default test case968", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6246658;
        expect(obj.alpha).toBe(2);
    });

    it("default test case969", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3049150;
        expect(obj.alpha).toBe(-66);
    });

    it("default test case970", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 310269;
        expect(obj.alpha).toBe(-3);
    });

    it("default test case971", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6404663;
        expect(obj.alpha).toBe(55);
    });

    it("default test case972", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2193182;
        expect(obj.alpha).toBe(30);
    });

    it("default test case973", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4397253;
        expect(obj.alpha).toBe(-59);
    });

    it("default test case974", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 583999;
        expect(obj.alpha).toBe(63);
    });

    it("default test case975", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1244333;
        expect(obj.alpha).toBe(-83);
    });

    it("default test case976", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9290091;
        expect(obj.alpha).toBe(0);
    });

    it("default test case977", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5985543;
        expect(obj.alpha).toBe(7);
    });

    it("default test case978", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9118505;
        expect(obj.alpha).toBe(0);
    });

    it("default test case979", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3348032;
        expect(obj.alpha).toBe(64);
    });

    it("default test case980", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3330635;
        expect(obj.alpha).toBe(75);
    });

    it("default test case981", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 582434;
        expect(obj.alpha).toBe(34);
    });

    it("default test case982", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1460702;
        expect(obj.alpha).toBe(-34);
    });

    it("default test case983", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5971476;
        expect(obj.alpha).toBe(20);
    });

    it("default test case984", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 5605344;
        expect(obj.alpha).toBe(-32);
    });

    it("default test case985", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 6125948;
        expect(obj.alpha).toBe(124);
    });

    it("default test case986", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1946906;
        expect(obj.alpha).toBe(26);
    });

    it("default test case987", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8631080;
        expect(obj.alpha).toBe(0);
    });

    it("default test case988", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 975780;
        expect(obj.alpha).toBe(-92);
    });

    it("default test case989", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 9373225;
        expect(obj.alpha).toBe(0);
    });

    it("default test case990", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7209297;
        expect(obj.alpha).toBe(81);
    });

    it("default test case991", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 7255379;
        expect(obj.alpha).toBe(83);
    });

    it("default test case992", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 211961;
        expect(obj.alpha).toBe(-7);
    });

    it("default test case993", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 4881347;
        expect(obj.alpha).toBe(-61);
    });

    it("default test case994", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 2762965;
        expect(obj.alpha).toBe(-43);
    });

    it("default test case995", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 3236827;
        expect(obj.alpha).toBe(-37);
    });

    it("default test case996", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1743036;
        expect(obj.alpha).toBe(-68);
    });

    it("default test case997", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1182059;
        expect(obj.alpha).toBe(107);
    });

    it("default test case998", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 8687554;
        expect(obj.alpha).toBe(0);
    });

    it("default test case999", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 1888817;
        expect(obj.alpha).toBe(49);
    });

    it("default test case1000", function()
    {
        const obj = new DisplayObject();
        obj.alpha = 396420;
        expect(obj.alpha).toBe(-124);
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

    it("default test case20", function()
    {
        const obj = new MovieClip();
        obj.height = new XML("<a>100</a>");
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
        expect(isNaN(obj.rotation)).toBe(true);
    });

    it("default test case4", function()
    {
        const obj = new DisplayObject();
        obj.rotation = true;
        expect(obj.rotation).toBe(1);
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
        expect(isNaN(obj.rotation)).toBe(true);
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
        expect(obj.rotation).toBe(1);
    });

    it("default test case9", function()
    {
        const obj = new DisplayObject();
        obj.rotation = 500;
        expect(obj.rotation).toBe(140);
    });

    it("default test case10", function()
    {
        const obj = new DisplayObject();
        obj.rotation = -1;
        expect(obj.rotation).toBe(-1);
    });

    it("default test case11", function()
    {
        const obj = new DisplayObject();
        obj.rotation = -500;
        expect(obj.rotation).toBe(-140);
    });

    it("default test case12", function()
    {
        const obj = new DisplayObject();
        obj.rotation = { "a":0 };
        expect(isNaN(obj.rotation)).toBe(true);
    });

    it("default test case13", function()
    {
        const obj = new DisplayObject();
        obj.rotation = function a() {};
        expect(isNaN(obj.rotation)).toBe(true);
    });

    it("default test case14", function()
    {
        const obj = new DisplayObject();
        obj.rotation = [1];
        expect(obj.rotation).toBe(1);
    });

    it("default test case15", function()
    {
        const obj = new DisplayObject();
        obj.rotation = [1,2];
        expect(isNaN(obj.rotation)).toBe(true);
    });

    it("default test case16", function()
    {
        const obj = new DisplayObject();
        obj.rotation = {};
        expect(isNaN(obj.rotation)).toBe(true);
    });

    it("default test case17", function()
    {
        const obj = new DisplayObject();
        obj.rotation = { "toString":function () { return 1 } };
        expect(obj.rotation).toBe(1);
    });

    it("default test case18", function()
    {
        const obj = new DisplayObject();
        obj.rotation = { "toString":function () { return "1" } };
        expect(obj.rotation).toBe(1);
    });

    it("default test case19", function()
    {
        const obj = new DisplayObject();
        obj.rotation = { "toString":function () { return "1a" } };
        expect(isNaN(obj.rotation)).toBe(true);
    });

    it("default test case20", function()
    {
        const obj = new DisplayObject();
        obj.rotation = new XML("<a>100</a>");
        expect(obj.rotation).toBe(100);
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
        expect(isNaN(obj.scaleX)).toBe(true);
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
        expect(isNaN(obj.scaleX)).toBe(true);
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
        expect(isNaN(obj.scaleX)).toBe(true);
    });

    it("default test case13", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = function a() {};
        expect(isNaN(obj.scaleX)).toBe(true);
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
        expect(isNaN(obj.scaleX)).toBe(true);
    });

    it("default test case16", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = {};
        expect(isNaN(obj.scaleX)).toBe(true);
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
        expect(isNaN(obj.scaleX)).toBe(true);
    });

    it("default test case20", function()
    {
        const obj = new DisplayObject();
        obj.scaleX = new XML("<a>100</a>");
        expect(obj.scaleX).toBe(100);
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
        expect(isNaN(obj.scaleY)).toBe(true);
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
        expect(isNaN(obj.scaleY)).toBe(true);
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
        expect(isNaN(obj.scaleY)).toBe(true);
    });

    it("default test case13", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = function a() {};
        expect(isNaN(obj.scaleY)).toBe(true);
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
        expect(isNaN(obj.scaleY)).toBe(true);
    });

    it("default test case16", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = {};
        expect(isNaN(obj.scaleY)).toBe(true);
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
        expect(isNaN(obj.scaleY)).toBe(true);
    });

    it("default test case20", function()
    {
        const obj = new DisplayObject();
        obj.scaleY = new XML("<a>100</a>");
        expect(obj.scaleY).toBe(100);
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

    it("default test case20", function()
    {
        const obj = new MovieClip();
        obj.width = new XML("<a>100</a>");
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

    it("default test case20", function()
    {
        const obj = new DisplayObject();
        obj.x = new XML("<a>100</a>");
        expect(obj.x).toBe(100);
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

    it("default test case20", function()
    {
        const obj = new DisplayObject();
        obj.y = new XML("<a>100</a>");
        expect(obj.y).toBe(100);
    });

});