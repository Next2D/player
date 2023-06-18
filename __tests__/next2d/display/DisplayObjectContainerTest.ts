import { $PREFIX } from "../../../src/player/util/Util";
import { Event } from "../../../src/player/next2d/events/Event";
import { DisplayObjectContainer } from "../../../src/player/next2d/display/DisplayObjectContainer";
import { Sprite } from "../../../src/player/next2d/display/Sprite";
import { MovieClip } from "../../../src/player/next2d/display/MovieClip";

describe("DisplayObjectContainer.js property test", function()
{
    // mouseChildren
    it("mouseChildren test success", function()
    {
        expect($PREFIX).toBe("__next2d__");

        let doc = new DisplayObjectContainer();

        // reset
        expect(doc.mouseChildren).toBe(true);

        // start
        doc.mouseChildren = false;
        expect(doc.mouseChildren).toBe(false);
    });

    it("mouseChildren test valid case1", function()
    {
        let doc = new DisplayObjectContainer();

        // reset
        expect(doc.mouseChildren).toBe(true);

        // @ts-ignore
        doc.mouseChildren = 0;
        expect(doc.mouseChildren).toBe(false);

        // @ts-ignore
        doc.mouseChildren = 1;
        expect(doc.mouseChildren).toBe(true);
    });

    // numChildren
    it("numChildren test success", function()
    {
        let doc = new DisplayObjectContainer();

        expect(doc.numChildren).toBe(0);

        // start
        try {
            // @ts-ignore
            doc.numChildren = 10;
        } catch (e) {}

        expect(doc.numChildren).toBe(0);
    });

});

describe("DisplayObjectContainer.js addChild test", function()
{

    it("addChild success case", function()
    {

        let container1 = new Sprite();
        let container2 = new Sprite();

        let circle1 = new Sprite();
        circle1.graphics.beginFill(0xFFCC00);
        circle1.graphics.drawCircle(40, 40, 40);

        let circle2 = new Sprite();
        circle2.graphics.beginFill(0x00CCFF);
        circle2.graphics.drawCircle(80, 40, 40);

        container2.addChild(container1);
        container1.addChild(circle1);
        container1.addChild(circle2);

        expect(container1.numChildren).toBe(2);
        expect(container2.numChildren).toBe(1);
        expect(circle1.numChildren).toBe(0);
        expect(circle2.numChildren).toBe(0);
    });

    it("addChild duplicate case", function()
    {
        let sprite = new Sprite();

        let str = "";
        sprite.addEventListener(Event.REMOVED, function ()
        {
            str = Event.REMOVED;
        });

        let parent1 = new MovieClip();
        let parent2 = new MovieClip();

        let a = parent1.addChild(sprite);
        let b = parent2.addChild(sprite);

        expect(a === b).toBe(true);
        expect(str).toBe(Event.REMOVED);
        expect(parent1.numChildren).toBe(0);
        expect(parent2.numChildren).toBe(1);
    });

});

describe("DisplayObjectContainer.js addChildAt test", function()
{

    it("addChildAt success case", function()
    {
        let container = new Sprite();

        let circle1 = new Sprite();
        let circle2 = new Sprite();

        container.addChild(circle1);
        container.addChildAt(circle2, 0);

        expect(container.getChildAt(0)._$instanceId === circle2._$instanceId).toBe(true);
        expect(container.getChildAt(1)._$instanceId === circle1._$instanceId).toBe(true);

    });

});

describe("DisplayObjectContainer.js contains test", function()
{

    it("contains success case", function()
    {
        let sprite1 = new Sprite();
        let sprite2 = new Sprite();
        let sprite3 = new Sprite();
        let sprite4 = new Sprite();

        sprite1.addChild(sprite2);
        sprite2.addChild(sprite3);

        expect(sprite1.contains(sprite1)).toBe(true);
        expect(sprite1.contains(sprite2)).toBe(true);
        expect(sprite1.contains(sprite3)).toBe(true);
        expect(sprite1.contains(sprite4)).toBe(false);
    });

});

describe("DisplayObjectContainer.js getChildAt test", function()
{
    it("getChildAt success case", function()
    {
        let container = new Sprite();

        let sprite1 = new Sprite();
        let sprite2 = new Sprite();
        let sprite3 = new Sprite();

        container.addChild(sprite1); // 0 => 1
        container.addChild(sprite2); // 1 => 2
        container.addChildAt(sprite3, 0);

        expect(container.getChildAt(0)._$instanceId === sprite3._$instanceId).toBe(true);
        expect(container.getChildAt(1)._$instanceId === sprite1._$instanceId).toBe(true);
        expect(container.getChildAt(2)._$instanceId === sprite2._$instanceId).toBe(true);
    });

});

describe("DisplayObjectContainer.js getChildIndex test", function()
{

    it("getChildIndex success case1", function()
    {
        let container = new Sprite();

        let sprite1 = new Sprite();
        sprite1.name = "sprite1";

        let sprite2 = new Sprite();
        sprite2.name = "sprite2";

        container.addChild(sprite1);
        container.addChild(sprite2);

        let target = container.getChildByName("sprite1");
        expect(container.getChildIndex(target)).toBe(0);

    });

});

describe("DisplayObjectContainer.js getChildByName test", function()
{

    it("addChild name path test case1", function()
    {
        let container = new Sprite();

        let sprite1 = new Sprite();
        sprite1.name = "test";
        sprite1.x = 1;

        let sprite2 = new Sprite();
        sprite2.name = "test";
        sprite2.x = 2;

        container.addChild(sprite2);
        container.addChild(sprite1);

        expect(container.getChildByName("test").x).toBe(2);
    });

    it("addChild name path test case2", function()
    {
        let mc = new MovieClip();

        let sprite1 = new Sprite();
        sprite1.name = "test";
        sprite1.x = 1;

        let sprite2 = new Sprite();
        sprite2.name = "test";
        sprite2.x = 2;

        mc.addChild(sprite1);
        mc.addChild(sprite2);

        expect(mc.getChildByName("test").x).toBe(1);
    });

});

describe("DisplayObjectContainer.js removeChild test", function()
{
    it("removeChild success", function()
    {

        let container = new Sprite();

        let circle1 = new Sprite();
        circle1.graphics.beginFill(0xFFCC00);
        circle1.graphics.drawCircle(40, 40, 40);

        let circle2 = new Sprite();
        circle2.graphics.beginFill(0x00CCFF);
        circle2.graphics.drawCircle(120, 40, 40);

        container.addChild(circle1);
        container.addChild(circle2);
        expect(container.numChildren).toBe(2);

        container.removeChild(circle1);
        expect(container.numChildren).toBe(1);
        expect(container.getChildAt(0)._$instanceId).toBe(circle2._$instanceId);

    });

});

describe("DisplayObjectContainer.js removeChildAt test", function()
{

    it("removeChildAt success", function ()
    {
        let container = new Sprite();

        let sprite1 = new Sprite();
        sprite1.name = "sprite1";
        let sprite2 = new Sprite();
        sprite2.name = "sprite2";

        container.addChild(sprite1);
        container.addChild(sprite2);

        expect(container.numChildren).toBe(2);
        container.removeChildAt(0);
        expect(container.numChildren).toBe(1);
        expect(container.getChildAt(0).name).toBe("sprite2");
    });

});

describe("DisplayObjectContainer.js removeChildren test", function()
{

    it("removeChildren success case1", function ()
    {
        let container = new Sprite();

        let sprite1 = new Sprite();
        sprite1.name = "sprite1";
        let sprite2 = new Sprite();
        sprite2.name = "sprite2";
        let sprite3 = new Sprite();
        sprite3.name = "sprite3";

        container.addChild(sprite1);
        container.addChild(sprite2);
        container.addChild(sprite3);

        expect(container.numChildren).toBe(3);
        container.removeChildren(0, 1);
        expect(container.numChildren).toBe(1);
    });

    it("removeChildren success case2", function ()
    {
        let container = new Sprite();

        let sprite1 = new Sprite();
        sprite1.name = "sprite1";
        let sprite2 = new Sprite();
        sprite2.name = "sprite2";
        let sprite3 = new Sprite();
        sprite3.name = "sprite3";

        container.addChild(sprite1);
        container.addChild(sprite2);
        container.addChild(sprite3);

        expect(container.numChildren).toBe(3);
        container.removeChildren(1, 1);
        expect(container.numChildren).toBe(2);
    });

    it("removeChildren success case3", function ()
    {
        let container = new Sprite();

        let sprite1 = new Sprite();
        sprite1.name = "sprite1";
        let sprite2 = new Sprite();
        sprite2.name = "sprite2";
        let sprite3 = new Sprite();
        sprite3.name = "sprite3";

        container.addChild(sprite1);
        container.addChild(sprite2);
        container.addChild(sprite3);

        expect(container.numChildren).toBe(3);
        container.removeChildren();
        expect(container.numChildren).toBe(0);
    });

});

describe("DisplayObjectContainer.js setChildIndex test", function()
{

    it("setChildIndex success case1", function ()
    {
        let container = new Sprite();

        let sprite1 = new Sprite();
        sprite1.name = "sprite1";
        let sprite2 = new Sprite();
        sprite2.name = "sprite2";
        let sprite3 = new Sprite();
        sprite3.name = "sprite3";

        container.addChild(sprite1); // 0
        container.addChild(sprite2); // 1
        container.addChild(sprite3); // 2

        var children = container._$getChildren();

        expect(children[0] === sprite1).toBe(true);
        expect(children[1] === sprite2).toBe(true);
        expect(children[2] === sprite3).toBe(true);

        container.setChildIndex(sprite3, 0);

        var children = container._$getChildren();
        expect(children[0] === sprite3).toBe(true);
        expect(children[1] === sprite1).toBe(true);
        expect(children[2] === sprite2).toBe(true);
    });

    it("setChildIndex success case2", function ()
    {
        let container = new Sprite();

        let sprite1 = new Sprite();
        sprite1.name = "sprite1";
        let sprite2 = new Sprite();
        sprite2.name = "sprite2";
        let sprite3 = new Sprite();
        sprite3.name = "sprite3";

        container.addChild(sprite1); // 0
        container.addChild(sprite2); // 1
        container.addChild(sprite3); // 2

        var children = container._$getChildren();
        expect(children[0] === sprite1).toBe(true);
        expect(children[1] === sprite2).toBe(true);
        expect(children[2] === sprite3).toBe(true);

        container.setChildIndex(sprite1, 2);

        var children = container._$getChildren();
        expect(children[0] === sprite2).toBe(true);
        expect(children[1] === sprite3).toBe(true);
        expect(children[2] === sprite1).toBe(true);
    });

    it("setChildIndex success case3", function ()
    {
        let container = new Sprite();

        let sprite1 = new Sprite();
        sprite1.name = "sprite1";
        let sprite2 = new Sprite();
        sprite2.name = "sprite2";
        let sprite3 = new Sprite();
        sprite3.name = "sprite3";
        let sprite4 = new Sprite();
        sprite4.name = "sprite4";
        let sprite5 = new Sprite();
        sprite5.name = "sprite5";

        container.addChild(sprite1); // 0
        container.addChild(sprite2); // 1
        container.addChild(sprite3); // 2
        container.addChild(sprite4); // 3
        container.addChild(sprite5); // 4

        var children = container._$getChildren();
        expect(children[0] === sprite1).toBe(true);
        expect(children[1] === sprite2).toBe(true);
        expect(children[2] === sprite3).toBe(true);
        expect(children[3] === sprite4).toBe(true);
        expect(children[4] === sprite5).toBe(true);

        container.setChildIndex(sprite4, 1);

        var children = container._$getChildren();
        expect(children[0] === sprite1).toBe(true);
        expect(children[2] === sprite2).toBe(true);
        expect(children[3] === sprite3).toBe(true);
        expect(children[1] === sprite4).toBe(true);
        expect(children[4] === sprite5).toBe(true);
    });

    it("setChildIndex success case4", function ()
    {
        let container = new Sprite();

        let sprite1 = new Sprite();
        sprite1.name = "sprite1";
        let sprite2 = new Sprite();
        sprite2.name = "sprite2";
        let sprite3 = new Sprite();
        sprite3.name = "sprite3";
        let sprite4 = new Sprite();
        sprite4.name = "sprite4";
        let sprite5 = new Sprite();
        sprite5.name = "sprite5";

        container.addChild(sprite1); // 0
        container.addChild(sprite2); // 1
        container.addChild(sprite3); // 2
        container.addChild(sprite4); // 3
        container.addChild(sprite5); // 4

        var children = container._$getChildren();
        expect(children[0] === sprite1).toBe(true);
        expect(children[1] === sprite2).toBe(true);
        expect(children[2] === sprite3).toBe(true);
        expect(children[3] === sprite4).toBe(true);
        expect(children[4] === sprite5).toBe(true);

        container.setChildIndex(sprite2, 3);

        var children = container._$getChildren();
        expect(children[0] === sprite1).toBe(true);
        expect(children[3] === sprite2).toBe(true);
        expect(children[1] === sprite3).toBe(true);
        expect(children[2] === sprite4).toBe(true);
        expect(children[4] === sprite5).toBe(true);
    });

});

describe("DisplayObjectContainer.js swapChildren test", function()
{

    it("swapChildren success case1", function ()
    {
        let container = new Sprite();

        let sprite1 = new Sprite();
        sprite1.name = "sprite1";
        let sprite2 = new Sprite();
        sprite2.name = "sprite2";
        let sprite3 = new Sprite();
        sprite3.name = "sprite3";

        container.addChild(sprite1);
        container.addChild(sprite2);
        container.addChild(sprite3);

        var children = container._$getChildren();
        expect(children[0] === sprite1).toBe(true);
        expect(children[1] === sprite2).toBe(true);
        expect(children[2] === sprite3).toBe(true);

        container.swapChildren(sprite1, sprite3);

        var children = container._$getChildren();
        expect(children[2] === sprite1).toBe(true);
        expect(children[1] === sprite2).toBe(true);
        expect(children[0] === sprite3).toBe(true);
    });

    it("swapChildren success case2", function ()
    {
        let container = new Sprite();

        let sprite1 = new Sprite();
        sprite1.name = "sprite1";
        let sprite2 = new Sprite();
        sprite2.name = "sprite2";

        container.addChild(sprite1);
        container.addChild(sprite2);

        expect(container.getChildAt(0).name).toBe("sprite1");
        expect(container.getChildAt(1).name).toBe("sprite2");

        container.swapChildren(sprite1, sprite2);
        container._$getChildren();
        expect(container.getChildAt(0).name).toBe("sprite2");
        expect(container.getChildAt(1).name).toBe("sprite1");
    });

});

describe("DisplayObjectContainer.js swapChildrenAt test", function()
{

    it("swapChildrenAt success case1", function ()
    {
        let container = new Sprite();

        let sprite1 = new Sprite();
        sprite1.name = "sprite1";
        let sprite2 = new Sprite();
        sprite2.name = "sprite2";
        let sprite3 = new Sprite();
        sprite3.name = "sprite3";

        container.addChild(sprite1);
        container.addChild(sprite2);
        container.addChild(sprite3);

        expect(container.getChildAt(0).name).toBe("sprite1");
        expect(container.getChildAt(1).name).toBe("sprite2");
        expect(container.getChildAt(2).name).toBe("sprite3");

        container.swapChildrenAt(0, 2);
        container._$getChildren();
        expect(container.getChildAt(0).name).toBe("sprite3");
        expect(container.getChildAt(1).name).toBe("sprite2");
        expect(container.getChildAt(2).name).toBe("sprite1");
    });

});
