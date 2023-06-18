import { $PREFIX} from "../../../src/player/util/Util";
import { DisplayObject } from "../../../src/player/next2d/display/DisplayObject";
import { Stage } from "../../../src/player/next2d/display/Stage";
import { Shape } from "../../../src/player/next2d/display/Shape";
import { MovieClip } from "../../../src/player/next2d/display/MovieClip";
import {
    $clamp,
    $Infinity,
    $Math,
    $Rad2Deg
} from "../../../src/player/util/RenderUtil";
import { Sprite } from "../../../src/player/next2d/display/Sprite";
import { BlurFilter } from "../../../src/player/next2d/filters/BlurFilter";
import { Point } from "../../../src/player/next2d/geom/Point";
import type { DisplayObjectImpl } from "../../../src/interface/DisplayObjectImpl";
import type { ParentImpl } from "../../../src/interface/ParentImpl";

describe("DisplayObject.js property test", () =>
{
    it("stage test success case1", () =>
    {
        expect($PREFIX).toBe("__next2d__");
    });

    // stage
    it("stage test success case1", () =>
    {
        const obj = new DisplayObject();
        expect(obj.stage).toBe(null);
    });

    it("stage test success case2", () =>
    {
        const stage = new Stage();
        const obj   = stage.addChild(new Shape());
        expect(stage).toEqual(obj.stage); // reset
    });

    // parent
    it("parent test success case1", () => {
        const obj = new DisplayObject();
        expect(obj.parent).toBe(null);
    });

    it("parent test success case2", () => {
        const stage = new Stage();
        const obj   = stage.addChild(new Shape());
        expect(obj.parent._$instanceId).toBe(stage._$instanceId);
    });

    // name
    it("name test success case1", () => {
        const obj  = new DisplayObject();
        obj.name = "abc";
        expect(obj.name).toBe("abc");
    });

    it("name test success case2", () => {
        const obj  = new DisplayObject();
        // @ts-ignore
        obj.name = 1;
        expect(obj.name).toBe("1");
    });

    // alpha
    it("alpha test success case1", () => {
        const obj   = new DisplayObject();
        obj.alpha = 0.5;
        expect(obj.alpha).toBe(0.5);
    });

    it("alpha test success case2", () => {
        const obj   = new DisplayObject();
        // @ts-ignore
        obj.alpha = "0.2";
        expect(obj.alpha).toBe(0.20000000298023224);
    });

    it("alpha test success case3", () => {
        const obj   = new DisplayObject();
        obj.alpha = 2;
        expect(obj.alpha).toBe(1);
    });

    it("alpha test success case4", () => {
        const obj   = new DisplayObject();
        obj.alpha = -1;
        expect(obj.alpha).toBe(0);
    });

    // rotation
    it("rotation test success case1", () => {
        const obj = new DisplayObject();
        expect(obj.rotation).toBe(0);
    });

    it("rotation test success case2", () => {
        const obj = new DisplayObject();

        for (let i = 0; i <= 360; i++) {
            obj.rotation = i;
            expect(obj.rotation).toBe($clamp(i % 360, 0 - 360, 360, 0));
        }
    });

    it("rotation test success case3", () => {
        const obj = new DisplayObject();

        for (let i = 0; i <= 360; i++) {
            const value = i * -1;

            obj.rotation = value;
            expect(obj.rotation).toBe($clamp(value % 360, 0 - 360, 360, 0));
        }
    });

    // scaleX
    it("scaleX test success case1", () => {
        const obj = new DisplayObject();
        expect(obj.scaleX).toBe(1);
    });

    it("scaleX test success case2", () => {
        const obj = new DisplayObject();
        obj.scaleX = 15;
        expect(obj.scaleX).toBe(15);
    });

    it("scaleX test success case3", () => {
        const obj = new DisplayObject();
        obj.scaleX = -11;
        expect(obj.scaleX).toBe(-11);
    });

    // scaleY
    it("scaleY test success case1", () => {
        const obj = new DisplayObject();
        expect(obj.scaleY).toBe(1);
    });

    it("scaleY test success case2", () => {
        const obj    = new DisplayObject();
        obj.scaleY = 15;
        expect(obj.scaleY).toBe(15);
    });

    it("scaleY test success case3", () => {
        const obj    = new DisplayObject();
        obj.scaleY = -11;
        expect(obj.scaleY).toBe(-11);
    });

    it("scaleY test success case4", () => {
        const obj    = new DisplayObject();
        obj.scaleY = -1;
        expect(obj.scaleY).toBe(-1);
    });

    it("scaleY test success case5", () => {
        const obj    = new DisplayObject();
        obj.scaleY = 0.5449999999999999;
        expect(obj.scaleY).toBe(0.545);
    });

    it("scaleY test success case6", () => {
        const obj    = new DisplayObject();

        obj.scaleY = -0.6717931453290831;
        expect(obj.scaleY).toBe(-0.6718);
        obj.scaleY = -0.9990366556971153;
        expect(obj.scaleY).toBe(-0.999);
    });

    it("scaleY test success case7", () => {
        const obj    = new DisplayObject();

        obj.scaleY = -0.9758;
        expect(obj.scaleY).toBe(-0.9758);
        obj.scaleY = 0.1858000000000002;
        expect(obj.scaleY).toBe(0.1858);
    });

    it("scaleY test success case8", () => {
        const obj    = new DisplayObject();

        obj.scaleY = -1;
        expect(obj.scaleY).toBe(-1);
        obj.scaleY = -0.7822;
        expect(obj.scaleY).toBe(-0.7822);
    });

    // scaleX and scaleY
    it("scaleX and scaleY test success case1", () => {
        const obj    = new DisplayObject();
        obj.scaleX = 2;
        obj.scaleY = 5;
        expect(obj.scaleX).toBe(2);
        expect(obj.scaleY).toBe(5);
    });

    // height
    it("height test success case1", () => {

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

    it("height test success case2", () => {

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

        expect(mc.height).toBe(100);
    });

    it("height test success case3", () => {

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

        // @ts-ignore
        mc.height = "123";

        expect(mc.height).toBe(123);
    });

    it("height test success case4", () => {

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

    it("height test valid case1", () => {

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

    it("Height test set infinity case1", () => {

        const shape  = new Shape();
        shape.graphics.drawRect(0, 0, 50, 40).endFill();

        shape.height = $Infinity;

        expect(shape.height).toBe(1310680);

        expect(shape.transform.matrix.d).toBe(32767);

        /**
         * TODO Flash側のバグ？
         * @see https://blog.gskinner.com/archives/2007/08/annoying_as3_bu.html
         */
        shape.width = 100;
        expect(shape.scaleY).toBe(32767);
    });

    it("Height test set case1", () => {

        const shape  = new Shape();
        shape.graphics.drawRect(0, 0, 50, 40).endFill();

        shape.rotation = 90;

        shape.height = 30;
        expect(shape.width).toBe(24);
        expect(shape.height).toBe(50);

        /**
         * TODO Flash側のバグ？
         * @see https://blog.gskinner.com/archives/2007/08/annoying_as3_bu.html
         */
        shape.height = 30;
        expect(shape.width).toBe(24);
        expect(shape.height).toBe(50);
    });

    // width
    it("width test success case1", () => {

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

    it("width test success case2", () => {

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

        expect(mc.width).toBe(100);
    });

    it("width test success case3", () => {

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

        // @ts-ignore
        mc.width = "312";
        expect(mc.width).toBe(312);
    });

    it("width test success case4", () => {

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

    it("width test valid case1", () => {

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

    it("width test set infinity case1", () => {

        const shape  = new Shape();
        shape.graphics.drawRect(0, 0, 50, 40).endFill();

        shape.width = $Infinity;

        expect(shape.width).toBe(1638350);

        expect(shape.transform.matrix.a).toBe(32767);

        shape.height = 100;
        expect(Math.round(shape.scaleX)).toBe(32767);
    });

    it("width test set case1", () => {

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
    it("x test success case1", () => {
        const obj = new DisplayObject();
        expect(obj.x).toBe(0);
    });

    it("x test success case2", () => {
        const obj = new DisplayObject();

        obj.x = 100;
        expect(obj.x).toBe(100);
    });

    it("x test success case2", () => {
        const obj = new DisplayObject();

        // @ts-ignore
        obj.x = "158";
        expect(obj.x).toBe(158);
    });

    // y
    it("y test success case1", () => {
        const obj = new DisplayObject();
        expect(obj.y).toBe(0);
    });

    it("y test success case2", () => {
        const obj = new DisplayObject();

        obj.y = 100;
        expect(obj.y).toBe(100);
    });

    it("y test success case2", () => {
        const obj = new DisplayObject();

        // @ts-ignore
        obj.y = "158";
        expect(obj.y).toBe(158);
    });

    // visible
    it("visible test success case1", () => {
        const obj = new DisplayObject();
        expect(obj.visible).toBe(true);
    });

    it("visible test success case2", () => {
        const obj = new DisplayObject();
        obj.visible = false;
        expect(obj.visible).toBe(false);
    });

    it("visible test valid case1", () => {
        const obj = new DisplayObject();
        // @ts-ignore
        obj.visible = "1";
        expect(obj.visible).toBe(true);
    });

});

describe("DisplayObject.js getBounds test", () =>
{

    it("getBounds test success case1", () => {

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

    it("line point zero test case 0", () =>
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, "square", "bevel", 10)
            .moveTo(0, 0)
            .lineTo(10, 0);

        expect(shape.getBounds(shape).toString()).toBe("(x=-10, y=-10, w=30, h=20)");

    });

    it("line point zero test case 45", () =>
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, "square", "bevel", 10)
            .moveTo(0, 0)
            .lineTo(10, 10);

        expect(shape.getBounds(shape).toString())
            .toBe("(x=-14.142135623730951, y=-14.142135623730951, w=38.2842712474619, h=38.2842712474619)");

    });

    it("line point zero test case 90", () =>
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, "square", "bevel", 10)
            .moveTo(0, 0)
            .lineTo(0, 10);

        expect(shape.getBounds(shape).toString())
            .toBe("(x=-10, y=-20, w=20, h=50)");

    });

    it("line point zero test case 135", () =>
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, "square", "bevel", 10)
            .moveTo(0, 0)
            .lineTo(-10, 10);

        expect(shape.getBounds(shape).toString())
            .toBe("(x=-24.14213562373095, y=-14.142135623730951, w=38.2842712474619, h=38.2842712474619)");

    });

    it("line point zero test case 180", () =>
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, "square", "bevel", 10)
            .moveTo(0, 0)
            .lineTo(-10, 0);

        expect(shape.getBounds(shape).toString()).toBe("(x=-20, y=-10, w=30, h=20)");

    });

    it("line point zero test case -45", () =>
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, "square", "bevel", 10)
            .moveTo(0, 0)
            .lineTo(10, -10);

        expect(shape.getBounds(shape).toString())
            .toBe("(x=-14.142135623730951, y=-24.14213562373095, w=38.2842712474619, h=38.2842712474619)");

    });

    it("line point zero test case -90", () =>
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, "square", "bevel", 10)
            .moveTo(0, 0)
            .lineTo(0, -10);

        expect(shape.getBounds(shape).toString()).toBe("(x=-10, y=-30, w=20, h=50)");

    });

    it("rect test case1", () =>
    {
        const shape = new Shape();

        shape
            .graphics
            .beginFill(0xff0000)
            .drawRect(50, 50, 100, 100)
            .endFill();

        expect(shape.getBounds(shape).toString()).toBe("(x=50, y=50, w=100, h=100)");

    });

    it("line point zero test case -135", () =>
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, "square", "bevel", 10)
            .moveTo(0, 0)
            .lineTo(-10, -10);

        expect(shape.getBounds(shape).toString())
            .toBe("(x=-24.14213562373095, y=-24.14213562373095, w=38.2842712474619, h=38.2842712474619)");

    });

    // it("line MITER test case1", () =>
    // {
    //     const shape = new Shape();
    //
    //     shape
    //         .graphics
    //         .lineStyle(20, 0x000000, 1.0, LineScaleMode.NORMAL, "square", JointStyle.MITER, 10)
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

    // it("line MITER test case2", () =>
    // {
    //     const shape = new Shape();
    //
    //     shape
    //         .graphics
    //         .lineStyle(20, 0x000000, 1.0, LineScaleMode.NORMAL, "square", JointStyle.MITER, 10)
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

    // it("line MITER test case3", () =>
    // {
    //     const shape = new Shape();
    //
    //     shape
    //         .graphics
    //         .lineStyle(20, 0x000000, 1.0, LineScaleMode.NORMAL, "square", JointStyle.MITER, 10)
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

    it("line BEVEL test case1", () =>
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, "square", "bevel", 10)
            .moveTo(0, 0)
            .lineTo(100, 50)
            .lineTo(0, 100)
            .lineTo(0, 0);

        const bounds = shape.getBounds(shape);

        expect(bounds.toString())
            .toBe("(x=-13.41640786499874, y=-20, w=126.83281572999749, h=140)");

    });

    it("line BEVEL test in curveTo case1", () =>
    {
        const shape = new Shape();

        shape
            .graphics
            .lineStyle(20, 0x000000, 1.0, "square", "bevel", 10)
            .moveTo(0, 0)
            .curveTo(10, 50, 100, 100)
            .lineTo(-10, 100)
            .lineTo(0, 0);

        shape.x = 60;
        shape.y = 60;

        const bounds = shape.getBounds(new Shape());

        expect(bounds.toString()).toBe("(x=39.05459090769012, y=45.85786437626905, w=135.08754471604084, h=128.2842712474619)");

    });

});

describe("DisplayObject.js hitTestObject test", () =>
{

    function leaf(s: ParentImpl<any>) {
        while (s.numChildren) {
            s = s.getChildAt(0);
        }
        return s;
    }

    function createContainer(x: number, y: number, w: number, h: number) {
        const sp = new Sprite();
        sp.graphics.lineStyle(0, 1);
        sp.graphics.drawRect(0, 0, w, h);
        sp.x = x;
        sp.y = y;
        return sp;
    }

    function constructAndAssert(
        a: ParentImpl<any>, b: ParentImpl<any>,
        expectedResultOutOfStage: ParentImpl<any>,
        expectedResultOnStage: ParentImpl<any>
    ) {
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

    function wrap(x: number, y: number, w: number, h: number, o:DisplayObjectImpl<any>) {
        const container = createContainer(x, y, w, h);
        container.addChild(o);
        return container;
    }

    function createBound(x: number, y: number, w: number, h: number) {
        const sp = new Sprite();
        sp.graphics.beginFill(0, 0.5);
        sp.graphics.drawRect(-w * 0.5, - h * 0.5, w, h);
        sp.x = x;
        sp.y = y;
        return sp;
    }

    it("hitTestObject case1", () =>
    {
        const a = createBound(32, 32, 32,32);
        const b = createBound(65, 65, 32, 32);
        constructAndAssert(a, b, false, false);
    });

    it("hitTestObject case2", () =>
    {
        const a = createBound(32, 32, 32,32);
        const b = createBound(64, 64, 32, 32);
        a.rotation = b.rotation = 45;
        constructAndAssert(a, b, true, true);
    });

    it("hitTestObject case3", () =>
    {
        const a = createBound(36, 36, 32,32);
        const b = createBound(60, 60, 32, 32);
        constructAndAssert(a, b, true, true);
    });

    it("hitTestObject case4", () =>
    {
        const a = createBound(26, 50, 32,32);
        const b = createBound(74, 50, 32, 32);
        a.rotation = b.rotation = 45;
        constructAndAssert(a, b, false, false);
    });

    it("hitTestObject case5", () =>
    {
        const a = createBound(28, 50, 32,32);
        const b = createBound(72, 50, 32, 32);
        a.rotation = b.rotation = 45;
        constructAndAssert(a, b, true, true);
    });

    it("hitTestObject case6", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(65, 65, 32, 32);
        const c = wrap(32, 32, 64, 64, a);
        constructAndAssert(c, b, false, false);
    });

    it("hitTestObject case7", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(64, 64, 32, 32);
        const c = wrap(32, 32, 64, 64, a);
        constructAndAssert(c, b, true, true);
    });

    it("hitTestObject case8", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(60, 60, 32, 32);
        const c = wrap(36, 36, 64, 64, a);
        constructAndAssert(c, b, true, true);
    });

    it("hitTestObject case9", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(74, 50, 32, 32);
        const c = wrap(26, 50, 64, 64, a);
        a.rotation = b.rotation = 45;
        constructAndAssert(c, b, false, false);
    });

    it("hitTestObject case10", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(72, 50, 32, 32);
        const c = wrap(28, 50, 64, 64, a);
        a.rotation = b.rotation = 45;
        constructAndAssert(c, b, true, true);
    });

    it("hitTestObject case11", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(65, 65, 32, 32);
        const c = wrap(32, 32, 64, 64, a);
        constructAndAssert(a, b, false, false);
    });

    it("hitTestObject case12", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(64, 64, 32, 32);
        const c = wrap(32, 32, 64, 64, a);
        constructAndAssert(a, b, true, false);
    });

    it("hitTestObject case13", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(60, 60, 32, 32);
        const c = wrap(36, 36, 64, 64, a);
        constructAndAssert(a, b, true, false);
    });

    it("hitTestObject case14", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(74, 50, 32, 32);
        const c = wrap(26, 50, 64, 64, a);
        a.rotation = b.rotation = 45;
        constructAndAssert(a, b, false, false);
    });

    it("hitTestObject case15", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(72, 50, 32, 32);
        const c = wrap(28, 50, 64, 64, a);
        a.rotation = b.rotation = 45;
        constructAndAssert(a, b, true, false);
    });

    it("hitTestObject case16", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(65, 65, 32, 32);
        const c = wrap(0, 32, 64, 64, a);
        const d = wrap(32, 0, 64, 64, c);
        constructAndAssert(d, b, false, false);
    });

    it("hitTestObject case17", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(64, 64, 32, 32);
        const c = wrap(0, 32, 64, 64, a);
        const d = wrap(32, 0, 64, 64, c);
        constructAndAssert(d, b, true, true);
    });

    it("hitTestObject case18", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(60, 60, 32, 32);
        const c = wrap(0, 36, 64, 64, a);
        const d = wrap(36, 0, 64, 64, c);
        constructAndAssert(d, b, true, true);
    });

    it("hitTestObject case19", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(74, 50, 32, 32);
        const c = wrap(0, 50, 64, 64, a);
        const d = wrap(26, 0, 64, 64, c);
        a.rotation = b.rotation = 45;
        constructAndAssert(d, b, false, false);
    });

    it("hitTestObject case20", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(72, 50, 32, 32);
        const c = wrap(0, 50, 64, 64, a);
        const d = wrap(28, 0, 64, 64, c);
        a.rotation = b.rotation = 45;
        constructAndAssert(d, b, true, true);
    });

    it("hitTestObject case21", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(65, 65, 32, 32);
        const c = wrap(0, 32, 64, 64, a);
        const d = wrap(32, 0, 64, 64, c);
        constructAndAssert(a, b, false, false);
    });

    it("hitTestObject case22", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(64, 64, 32, 32);
        const c = wrap(0, 32, 64, 64, a);
        const d = wrap(32, 0, 64, 64, c);
        constructAndAssert(a, b, true, false);
    });

    it("hitTestObject case23", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(60, 60, 32, 32);
        const c = wrap(0, 36, 64, 64, a);
        const d = wrap(36, 0, 64, 64, c);
        constructAndAssert(a, c, true, false);
    });

    it("hitTestObject case24", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(74, 50, 32, 32);
        const c = wrap(0, 50, 64, 64, a);
        const d = wrap(26, 0, 64, 64, c);
        a.rotation = b.rotation = 45;
        constructAndAssert(a, b, false, false);
    });

    it("hitTestObject case25", () =>
    {
        const a = createBound(0, 0, 32,32);
        const b = createBound(72, 50, 32, 32);
        const c = wrap(0, 50, 64, 64, a);
        const d = wrap(28, 0, 64, 64, c);
        a.rotation = b.rotation = 45;
        constructAndAssert(a, b, true, false);
    });

});

describe("DisplayObject.js localToGlobal test", () =>
{

    it("localToGlobal test success case1", () =>
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

describe("DisplayObject.js globalToLocal test", () =>
{

    it("globalToLocal test success case1", () =>
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

describe("DisplayObject.js filters test", () =>
{

    it("filters test success case1", () =>
    {
        const sprite = new Sprite();
        sprite.x = 10;
        sprite.y = 10;

        const blurFilter = new BlurFilter();
        sprite.filters = [blurFilter];

        expect(sprite.filters.length).toBe(1);
        expect(sprite.filters[0].toString()).toBe(blurFilter.toString());

        sprite.filters = null;

        const filters = sprite.filters;
        if (!filters) {
            throw new Error("filter error.");
        }

        expect(filters.length).toBe(0);

    });

});

describe("DisplayObject.js visible test", () =>
{

    it("default test case1", () =>
    {
        const obj = new DisplayObject();
        expect(obj.visible).toBe(true);
    });

    it("default test case4", () =>
    {
        const obj = new DisplayObject();
        obj.visible = true;
        expect(obj.visible).toBe(true);
    });

    it("default test case7", () =>
    {
        const obj = new DisplayObject();
        // @ts-ignore
        obj.visible = 0;
        expect(obj.visible).toBe(false);
    });

    it("default test case8", () =>
    {
        const obj = new DisplayObject();
        // @ts-ignore
        obj.visible = 1;
        expect(obj.visible).toBe(true);
    });

});

describe("DisplayObject.js alpha test", () =>
{

    it("default test case1", () =>
    {
        const obj = new DisplayObject();
        expect(obj.alpha).toBe(1);
    });

    it("default test case7", () =>
    {
        const obj = new DisplayObject();
        obj.alpha = 0;
        expect(obj.alpha).toBe(0);
    });

    it("default test case8", () =>
    {
        const obj = new DisplayObject();
        obj.alpha = 1;
        expect(obj.alpha).toBe(1);
    });

    it("default test case9", () =>
    {
        const obj = new DisplayObject();
        obj.alpha = 500;
        expect(obj.alpha).toBe(1);
    });

    it("default test case10", () =>
    {
        const obj = new DisplayObject();
        obj.alpha = -1;
        expect(obj.alpha).toBe(0);
    });

    it("default test case11", () =>
    {
        const obj = new DisplayObject();
        obj.alpha = -500;
        expect(obj.alpha).toBe(0);
    });

    it("default test case21", () =>
    {
        const obj = new DisplayObject();
        obj.alpha = $Math.PI;
        expect(obj.alpha).toBe(1);
    });

    it("default test case22", () =>
    {
        const obj = new DisplayObject();
        obj.alpha = 1.11111111;
        expect(obj.alpha).toBe(1);
    });

    it("default test case23", () =>
    {
        const obj = new DisplayObject();
        obj.alpha = -1.11111111;
        expect(obj.alpha).toBe(0);
    });

    it("default test case24", () =>
    {
        const obj = new DisplayObject();
        obj.alpha = 10000000000000000;
        expect(obj.alpha).toBe(1);
    });

    it("default test case25", () =>
    {
        const obj = new DisplayObject();
        obj.alpha = -10000000000000000;
        expect(obj.alpha).toBe(0);
    });

});

describe("DisplayObject.js height test", () =>
{

    it("default test case1", () =>
    {
        const obj = new MovieClip();
        expect(obj.height).toBe(0);
    });

    it("default test case7", () =>
    {
        const obj = new MovieClip();
        obj.height = 0;
        expect(obj.height).toBe(0);
    });

    it("default test case8", () =>
    {
        const obj = new MovieClip();
        obj.height = 1;
        expect(obj.height).toBe(0);
    });

    it("default test case9", () =>
    {
        const obj = new MovieClip();
        obj.height = 500;
        expect(obj.height).toBe(0);
    });

    it("default test case10", () =>
    {
        const obj = new MovieClip();
        obj.height = -1;
        expect(obj.height).toBe(0);
    });

    it("default test case11", () =>
    {
        const obj = new MovieClip();
        obj.height = -500;
        expect(obj.height).toBe(0);
    });

});

describe("DisplayObject.js rotation test", () =>
{

    it("default test case1", () =>
    {
        const obj = new DisplayObject();
        expect(obj.rotation).toBe(0);
    });

    it("default test case7", () =>
    {
        const obj = new DisplayObject();
        obj.rotation = 0;
        expect(obj.rotation).toBe(0);
    });

    it("default test case8", () =>
    {
        const obj = new DisplayObject();
        obj.rotation = 1;

        const matrix = obj.transform._$rawMatrix();
        expect($Math.atan2(matrix[1], matrix[0]) * $Rad2Deg).toBe(0.9999999465488009);
        expect(obj.rotation).toBe(1);
    });

    it("default test case9", () =>
    {
        const obj = new DisplayObject();
        obj.rotation = 500;

        const matrix = obj.transform._$rawMatrix();
        expect($Math.atan2(matrix[1], matrix[0]) * $Rad2Deg).toBe(139.99999868188684);
        expect(obj.rotation).toBe($clamp(500 % 360, 0 - 360, 360, 0));
    });

    it("default test case10", () =>
    {
        const obj = new DisplayObject();
        obj.rotation = -1;

        const matrix = obj.transform._$rawMatrix();
        expect($Math.atan2(matrix[1], matrix[0]) * $Rad2Deg).toBe(-0.9999999465488009);
        expect(obj.rotation).toBe(-1);
    });

    it("default test case11", () =>
    {
        const obj = new DisplayObject();
        obj.rotation = -500;

        const matrix = obj.transform._$rawMatrix();
        expect($Math.atan2(matrix[1], matrix[0]) * $Rad2Deg).toBe(-139.99999868188684);
        expect(obj.rotation).toBe($clamp(-500 % 360, 0 - 360, 360, 0));
    });

});

describe("DisplayObject.js scaleX test", () =>
{

    it("default test case1", () =>
    {
        const obj = new DisplayObject();
        expect(obj.scaleX).toBe(1);
    });

    it("default test case7", () =>
    {
        const obj = new DisplayObject();
        obj.scaleX = 0;
        expect(obj.scaleX).toBe(0);
    });

    it("default test case8", () =>
    {
        const obj = new DisplayObject();
        obj.scaleX = 1;
        expect(obj.scaleX).toBe(1);
    });

    it("default test case9", () =>
    {
        const obj = new DisplayObject();
        obj.scaleX = 500;
        expect(obj.scaleX).toBe(500);
    });

    it("default test case10", () =>
    {
        const obj = new DisplayObject();
        obj.scaleX = -1;
        expect(obj.scaleX).toBe(-1);
    });

    it("default test case11", () =>
    {
        const obj = new DisplayObject();
        obj.scaleX = -500;
        expect(obj.scaleX).toBe(-500);
    });

});

describe("DisplayObject.js scaleY test", () =>
{

    it("default test case1", () =>
    {
        const obj = new DisplayObject();
        expect(obj.scaleY).toBe(1);
    });

    it("default test case7", () =>
    {
        const obj = new DisplayObject();
        obj.scaleY = 0;
        expect(obj.scaleY).toBe(0);
    });

    it("default test case8", () =>
    {
        const obj = new DisplayObject();
        obj.scaleY = 1;
        expect(obj.scaleY).toBe(1);
    });

    it("default test case9", () =>
    {
        const obj = new DisplayObject();
        obj.scaleY = 500;
        expect(obj.scaleY).toBe(500);
    });

    it("default test case10", () =>
    {
        const obj = new DisplayObject();
        obj.scaleY = -1;
        expect(obj.scaleY).toBe(-1);
    });

    it("default test case11", () =>
    {
        const obj = new DisplayObject();
        obj.scaleY = -500;
        expect(obj.scaleY).toBe(-500);
    });

});

describe("DisplayObject.js width test", () =>
{

    it("default test case1", () =>
    {
        const obj = new MovieClip();
        expect(obj.width).toBe(0);
    });

    it("default test case7", () =>
    {
        const obj = new MovieClip();
        obj.width = 0;
        expect(obj.width).toBe(0);
    });

    it("default test case8", () =>
    {
        const obj = new MovieClip();
        obj.width = 1;
        expect(obj.width).toBe(0);
    });

    it("default test case9", () =>
    {
        const obj = new MovieClip();
        obj.width = 500;
        expect(obj.width).toBe(0);
    });

    it("default test case10", () =>
    {
        const obj = new MovieClip();
        obj.width = -1;
        expect(obj.width).toBe(0);
    });

    it("default test case11", () =>
    {
        const obj = new MovieClip();
        obj.width = -500;
        expect(obj.width).toBe(0);
    });

});

describe("DisplayObject.js x test", () =>
{

    it("default test case1", () =>
    {
        const obj = new DisplayObject();
        expect(obj.x).toBe(0);
    });

    it("default test case7", () =>
    {
        const obj = new DisplayObject();
        obj.x = 0;
        expect(obj.x).toBe(0);
    });

    it("default test case8", () =>
    {
        const obj = new DisplayObject();
        obj.x = 1;
        expect(obj.x).toBe(1);
    });

    it("default test case9", () =>
    {
        const obj = new DisplayObject();
        obj.x = 500;
        expect(obj.x).toBe(500);
    });

    it("default test case10", () =>
    {
        const obj = new DisplayObject();
        obj.x = -1;
        expect(obj.x).toBe(-1);
    });

    it("default test case11", () =>
    {
        const obj = new DisplayObject();
        obj.x = -500;
        expect(obj.x).toBe(-500);
    });

});

describe("DisplayObject.js y test", () =>
{

    it("default test case1", () =>
    {
        const obj = new DisplayObject();
        expect(obj.y).toBe(0);
    });

    it("default test case7", () =>
    {
        const obj = new DisplayObject();
        obj.y = 0;
        expect(obj.y).toBe(0);
    });

    it("default test case8", () =>
    {
        const obj = new DisplayObject();
        obj.y = 1;
        expect(obj.y).toBe(1);
    });

    it("default test case9", () =>
    {
        const obj = new DisplayObject();
        obj.y = 500;
        expect(obj.y).toBe(500);
    });

    it("default test case10", () =>
    {
        const obj = new DisplayObject();
        obj.y = -1;
        expect(obj.y).toBe(-1);
    });

    it("default test case11", () =>
    {
        const obj = new DisplayObject();
        obj.y = -500;
        expect(obj.y).toBe(-500);
    });

});

describe("DisplayObject.js LocalVariable test", () =>
{
    it("default test case1", () =>
    {
        const mc1 = new MovieClip();
        const mc2 = new MovieClip();

        mc1.setLocalVariable("test", 10);
        mc2.setLocalVariable("test", 20);

        expect(mc1.getLocalVariable("test")).toBe(10);
        expect(mc2.getLocalVariable("test")).toBe(20);

        mc1.deleteLocalVariable("test");

        expect(mc1.hasLocalVariable("test")).toBe(false);
        expect(mc2.hasLocalVariable("test")).toBe(true);
    });
});

describe("DisplayObject.js GlobalVariable test", () =>
{
    it("default test case1", () =>
    {
        const mc1 = new MovieClip();
        const mc2 = new MovieClip();

        mc1.setGlobalVariable("test", 10);

        expect(mc1.getGlobalVariable("test")).toBe(10);
        expect(mc2.getGlobalVariable("test")).toBe(10);

        mc1.deleteGlobalVariable("test");

        expect(mc1.hasGlobalVariable("test")).toBe(false);
        expect(mc2.hasGlobalVariable("test")).toBe(false);
    });
});
