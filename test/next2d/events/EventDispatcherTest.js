
describe("EventDispatcher.js toString test", function()
{

    // toString
    it("toString test success", function ()
    {
        const object = new EventDispatcher();
        expect(object.toString()).toBe("[object EventDispatcher]");
    });

});

describe("EventDispatcher.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(EventDispatcher.toString()).toBe("[class EventDispatcher]");
    });

});


describe("EventDispatcher.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new EventDispatcher();
        expect(object.namespace).toBe("next2d.events:EventDispatcher");
    });

    it("namespace test static", function()
    {
        expect(EventDispatcher.namespace).toBe("next2d.events:EventDispatcher");
    });

});


describe("EventDispatcher.js addEventListener test", function()
{

    // addEventListener
    it("addEventListener test success case1", function ()
    {
        const di = new EventDispatcher();

        di.addEventListener("test", function () { return "OK"; });
        di.addEventListener("test", function () { return "NG"; });

        expect(di._$events.get("test").length).toBe(2);
        expect(di._$events.get("test")[0].listener()).toBe("OK");
        expect(di._$events.get("test")[1].listener()).toBe("NG");
    });

    it("addEventListener test success case2", function ()
    {
        const di = new EventDispatcher();

        di.addEventListener("test", function () { return "NG"; }, false, 50);
        di.addEventListener("test", function () { return "OK"; }, false, 100);

        expect(di._$events.get("test").length).toBe(2);
        expect(di._$events.get("test")[0].listener()).toBe("OK");
        expect(di._$events.get("test")[1].listener()).toBe("NG");
    });

    it("addEventListener test success case3", function ()
    {
        const di = new EventDispatcher();

        di.addEventListener(123, function () { return "NG"; }, false, 50);
        di.addEventListener(123, function () { return "OK"; }, false, 100);

        expect(di._$events.get("123").length).toBe(2);
        expect(di._$events.get("123")[0].listener()).toBe("OK");
        expect(di._$events.get("123")[1].listener()).toBe("NG");
    });


    it("addEventListener test valid case1", function ()
    {
        const di = new EventDispatcher();

        di.addEventListener("test", {});
        di.addEventListener("test", []);
        di.addEventListener("test", function () { return "OK"; });

        expect(di._$events.get("test").length).toBe(3);
        expect(di._$events.get("test")[2].listener()).toBe("OK");
    });


    it("addEventListener test duplicate case1", function ()
    {
        const di = new EventDispatcher();

        const a = function () { return "OK"; };

        di.addEventListener("test", a);
        di.addEventListener("test", a);

        expect(di._$events.get("test").length).toBe(1);
        expect(di._$events.get("test")[0].listener()).toBe("OK");
    });

    it("addEventListener test duplicate case2", function ()
    {
        const di = new EventDispatcher();

        const a = function () { return this; };

        const x = a.bind("ok");
        x.toString = function () { return a.toString(); };

        const y = a.bind("no");
        y.toString = function () { return a.toString(); };

        di.addEventListener("test", x);
        di.addEventListener("test", y);

        expect(di._$events.get("test").length).toBe(2);
        expect(di._$events.get("test")[0].listener().toString()).toBe("ok");
        expect(di._$events.get("test")[1].listener().toString()).toBe("no");
    });


    it("addEventListener test duplicate case3", function ()
    {
        const di = new EventDispatcher();

        const a = function () { return this; };

        const x = a.bind("ok");
        x.toString = function () { return a.toString(); };

        const y = a.bind("no");
        y.toString = function () { return a.toString(); };

        di.addEventListener("test", x, true);
        di.addEventListener("test", y, false);

        expect(di._$events.get("test").length).toBe(2);
        expect(di._$events.get("test")[0].listener().toString()).toBe("ok");
        expect(di._$events.get("test")[1].listener().toString()).toBe("no");
    });


    it("addEventListener test duplicate case4", function ()
    {
        const mc1 = new MovieClip();
        mc1.name = "mc1";

        const mc2 = new MovieClip();
        mc2.name = "mc2";

        const player = new Player();
        Util.$currentPlayerId = player._$id;

        const a = function (e) { return e.currentTarget.name; };

        mc1.addEventListener(Event.ENTER_FRAME, a);
        mc2.addEventListener(Event.ENTER_FRAME, a);
        expect(player.broadcastEvents.get(Event.ENTER_FRAME).length).toBe(2);


        const event1 = new Event(Event.ENTER_FRAME);
        event1._$target = player.broadcastEvents.get(Event.ENTER_FRAME)[0].target;
        event1._$currentTarget = player.broadcastEvents.get(Event.ENTER_FRAME)[0].target;
        expect(player.broadcastEvents.get(Event.ENTER_FRAME)[0].listener.call(Util.$window, event1)).toBe("mc1");

        const event2 = new Event(Event.ENTER_FRAME);
        event2._$target = player.broadcastEvents.get(Event.ENTER_FRAME)[1].target;
        event2._$currentTarget = player.broadcastEvents.get(Event.ENTER_FRAME)[1].target;
        expect(player.broadcastEvents.get(Event.ENTER_FRAME)[1].listener.call(Util.$window, event2)).toBe("mc2");

        // end
        mc1.removeEventListener(Event.ENTER_FRAME, a);
        mc2.removeEventListener(Event.ENTER_FRAME, a);

    });

});


describe("EventDispatcher.js hasEventListener test", function()
{

    // hasEventListener
    it("hasEventListener test success", function ()
    {
        const di = new EventDispatcher();

        di.addEventListener("test1", function () { return "OK"; });
        di.addEventListener("test3", function () { return "NG"; });

        expect(di.hasEventListener("test1")).toBe(true);
        expect(di.hasEventListener("test2")).toBe(false);
        expect(di.hasEventListener("test3")).toBe(true);
        expect(di.hasEventListener("test4")).toBe(false);

    });

    // メソッドが所属する EventDispatcher インスタンスについてのみリスナーが登録されているか
    it("hasEventListener test success case2", function ()
    {
        const player = new Player();
        Util.$currentPlayerId = player._$id;

        const doc1 = new MovieClip();
        const doc2 = new MovieClip();
        const doc3 = new MovieClip();
        doc1.addChild(doc2);
        doc2.addChild(doc3);

        doc2.addEventListener(Event.ENTER_FRAME, function () { return "OK"; });

        expect(doc1.hasEventListener(Event.ENTER_FRAME)).toBe(false);
        expect(doc2.hasEventListener(Event.ENTER_FRAME)).toBe(true);
        expect(doc3.hasEventListener(Event.ENTER_FRAME)).toBe(false);

    });
});


describe("EventDispatcher.js removeEventListener test", function()
{

    // removeEventListener
    it("removeEventListener test success case1", function ()
    {
        const di = new EventDispatcher();

        const test1 = function () { return "OK1"; };
        const test2 = function () { return "OK2"; };
        const test3 = function () { return "OK3"; };

        di.addEventListener("test", test1, false, 10);
        di.addEventListener("test", test2, false, 20);
        di.addEventListener("test", test3, false, 30);

        di.removeEventListener("test", test2);

        expect(di._$events.get("test").length).toBe(2);
        expect(di._$events.get("test")[0].listener()).toBe("OK3");
        expect(di._$events.get("test")[1].listener()).toBe("OK1");
    });


    it("removeEventListener test success case2", function ()
    {
        const di = new EventDispatcher();

        const a = function () { return this; };
        const b = function () { return this; };

        const x = a.bind("ok");
        x.toString = function () { return a.toString(); };

        const y = b.bind("no");
        y.toString = function () { return b.toString(); };

        di.addEventListener("test", x);
        di.addEventListener("test", y);
        expect(di._$events.get("test").length).toBe(2);

        di.removeEventListener("test", x);

        expect(di._$events.has("test")).toBe(true);
        expect(di._$events.get("test").length).toBe(1);
    });


    it("removeEventListener test success case3", function ()
    {
        const di = new EventDispatcher();

        const a = function () { return this; };

        const x = a.bind("ok");
        x.toString = function () { return a.toString(); };

        const y = a.bind("no");
        y.toString = function () { return b.toString(); };

        di.addEventListener("test", x, true);
        di.addEventListener("test", y, false);
        expect(di._$events.get("test").length).toBe(2);

        di.removeEventListener("test", x, true);

        expect(di._$events.get("test").length).toBe(1);
        expect(di._$events.get("test")[0].listener().toString()).toBe("no");
    });


    it("removeEventListener test success case4", function ()
    {
        const di = new EventDispatcher();

        const a = function () { return this; };

        const x = a.bind("ok");
        x.toString = function () { return a.toString(); };

        const y = a.bind("no");
        y.toString = function () { return b.toString(); };

        di.addEventListener("test", x, true);
        di.addEventListener("test", y, false);
        expect(di._$events.get("test").length).toBe(2);

        di.removeEventListener("test", x, false);

        expect(di._$events.get("test").length).toBe(2);
        expect(di._$events.get("test")[0].listener().toString()).toBe("ok");
        expect(di._$events.get("test")[1].listener().toString()).toBe("no");
    });


    it("removeEventListener test success case5", function ()
    {
        const player = new Player();
        Util.$currentPlayerId = player._$id;

        const mc1 = new MovieClip();
        const mc2 = new MovieClip();

        const a = function () { return this; };

        mc1.addEventListener(Event.ENTER_FRAME, a);
        mc2.addEventListener(Event.ENTER_FRAME, a);
        expect(player.broadcastEvents.get(Event.ENTER_FRAME).length).toBe(2);

        mc1.removeEventListener(Event.ENTER_FRAME, a);
        expect(player.broadcastEvents.get(Event.ENTER_FRAME).length).toBe(1);

        mc2.removeEventListener(Event.ENTER_FRAME, a);
        expect(player.broadcastEvents.has(Event.ENTER_FRAME)).toBe(false);
    });

});


describe("EventDispatcher.js dispatchEvent test", function()
{

    // dispatchEvent
    it("dispatchEvent test success case1", function ()
    {
        const di = new EventDispatcher();

        let s = "";
        const test1 = function () { s += "O"; };
        const test2 = function () { s += "K"; };
        const test3 = function () { s += "!"; };

        di.addEventListener("test", test1);
        di.addEventListener("test", test2);
        di.addEventListener("test", test3);


        di.dispatchEvent(new Event("test"));

        expect(s).toBe("OK!");
    });


    it("dispatchEvent test success case2", function ()
    {

        const di = new EventDispatcher();

        let s = "";
        const test1 = function () { return s += "!"; };
        const test2 = function () { return s += "K"; };
        const test3 = function () { return s += "O"; };

        di.addEventListener("test", test2, false, 20);
        di.addEventListener("test", test1, false, 10);
        di.addEventListener("test", test3, false, 30);


        di.dispatchEvent(new Event("test"));

        expect(s).toBe("OK!");
    });


    it("dispatchEvent test success capture case1", function ()
    {
        const mc = new MovieClip();

        let s = "";
        const test = function () { return s = "capture"; };

        mc.addEventListener("test", test, true);
        expect(s).toBe("");

        const sprite = new Sprite();
        mc.addChild(sprite);

        sprite.dispatchEvent(new Event("test"));
        expect(s).toBe("capture");
    });


    it("dispatchEvent test success capture case2", function ()
    {
        const mc = new MovieClip();

        let s = "";
        const test = function () { return s = "capture"; };

        mc.addEventListener("test", test);

        const sprite = new Sprite();
        mc.addChild(sprite);

        sprite.dispatchEvent(new Event("test"));
        expect(s).toBe("");
    });


    it("dispatchEvent test success capture case2", function ()
    {
        const mc = new MovieClip();

        let s = "";
        const test1 = function () { return s += "cap"; };
        const test2 = function () { return s += "ture"; };

        mc.addEventListener("test", test1, true);

        const sprite = new Sprite();
        sprite.addEventListener("test", test2);
        mc.addChild(sprite);

        sprite.dispatchEvent(new Event("test"));
        expect(s).toBe("capture");
    });


    it("dispatchEvent test success capture and bubble case1", function ()
    {
        const mc = new MovieClip();

        let s = "";
        const test1 = function () { return s += "cap"; };
        const test2 = function () { return s += "ture"; };
        const test3 = function () { return s += " and bubble"; };

        mc.addEventListener("test", test1, true);
        mc.addEventListener("test", test3);

        const sprite = new Sprite();
        sprite.addEventListener("test", test2);
        mc.addChild(sprite);

        sprite.dispatchEvent(new Event("test", true));

        expect(s).toBe("capture and bubble");
    });


    // stopImmediatePropagation
    it("dispatchEvent stopImmediatePropagation test case1", function ()
    {
        const stage = new Stage();
        stage.name = "stage";

        const root = new MovieClip();
        stage.addChild(root);

        const sprite_a = new Sprite();
        sprite_a.name = "A";
        stage.addChild(sprite_a);


        const sprite_b = new Sprite();
        sprite_b.name = "B";
        sprite_a.addChild(sprite_b);

        const sprite_c = new Sprite();
        sprite_c.name = "C";
        sprite_b.addChild(sprite_c);


        let str = "";
        function EventRemovedFunc(e)
        {
            str += e.currentTarget.name;

            // ターゲットフェーズに到達した
            if (e.eventPhase === EventPhase.AT_TARGET) {
                e.stopImmediatePropagation();
            }
        }

        // event
        stage.addEventListener(Event.REMOVED, EventRemovedFunc, true);
        stage.addEventListener(Event.REMOVED, EventRemovedFunc, false);
        sprite_a.addEventListener(Event.REMOVED, EventRemovedFunc, true);
        sprite_a.addEventListener(Event.REMOVED, EventRemovedFunc, false);
        sprite_b.addEventListener(Event.REMOVED, EventRemovedFunc, true);
        sprite_b.addEventListener(Event.REMOVED, EventRemovedFunc, false);
        sprite_c.addEventListener(Event.REMOVED, EventRemovedFunc, true);
        sprite_c.addEventListener(Event.REMOVED, EventRemovedFunc, false);

        sprite_c.parent.removeChild(sprite_c);

        expect(str).toBe("stageABC");
    });


    // stopPropagation
    it("dispatchEvent stopImmediatePropagation test case2", function ()
    {
        const stage = new Stage();
        stage.name = "stage1";

        const root = new MovieClip();
        stage.addChild(root);


        const sprite_a = new Sprite();
        sprite_a.name = "A";
        stage.addChild(sprite_a);


        const sprite_b = new Sprite();
        sprite_b.name = "B";
        sprite_a.addChild(sprite_b);


        const sprite_c = new Sprite();
        sprite_c.name = "C";
        sprite_b.addChild(sprite_c);


        let strA = "";
        function EventRemovedFuncA(e)
        {

            strA += e.currentTarget.name;

            // ターゲットフェーズに到達した
            if (e.eventPhase === EventPhase.AT_TARGET) {
                // イベント通知の伝達を終了する
                e.stopPropagation();
            }
        }


        let strB = "";
        function EventRemovedFuncB(e)
        {
            strB += e.currentTarget.name;
        }


        // A
        stage.addEventListener(Event.REMOVED, EventRemovedFuncA, true);
        stage.addEventListener(Event.REMOVED, EventRemovedFuncA, false);
        sprite_a.addEventListener(Event.REMOVED, EventRemovedFuncA, true);
        sprite_a.addEventListener(Event.REMOVED, EventRemovedFuncA, false);
        sprite_b.addEventListener(Event.REMOVED, EventRemovedFuncA, true);
        sprite_b.addEventListener(Event.REMOVED, EventRemovedFuncA, false);
        sprite_c.addEventListener(Event.REMOVED, EventRemovedFuncA, true);
        sprite_c.addEventListener(Event.REMOVED, EventRemovedFuncA, false);

        // B
        stage.addEventListener(Event.REMOVED, EventRemovedFuncB, true);
        stage.addEventListener(Event.REMOVED, EventRemovedFuncB, false);
        sprite_a.addEventListener(Event.REMOVED, EventRemovedFuncB, true);
        sprite_a.addEventListener(Event.REMOVED, EventRemovedFuncB, false);
        sprite_b.addEventListener(Event.REMOVED, EventRemovedFuncB, true);
        sprite_b.addEventListener(Event.REMOVED, EventRemovedFuncB, false);
        sprite_c.addEventListener(Event.REMOVED, EventRemovedFuncB, true);
        sprite_c.addEventListener(Event.REMOVED, EventRemovedFuncB, false);

        // execute
        sprite_c.parent.removeChild(sprite_c);

        expect(strA).toBe("stage1ABC");
        expect(strB).toBe("stage1ABC");

    });


    // stopPropagation
    it("dispatchEvent stopImmediatePropagation test case3", function ()
    {

        let strA = "";
        const sprite1 = new Sprite();
        sprite1.addEventListener(Event.ADDED_TO_STAGE, function (e)
        {
            strA = "ADDED_TO_STAGE";
        }, true);

        let strB = "";
        sprite1.addEventListener(Event.REMOVED_FROM_STAGE, function (e)
        {
            strB = "REMOVED_FROM_STAGE";
        }, true);

        const sprite2 = new Sprite();
        sprite1.addChild(sprite2);
        sprite1.removeChild(sprite2);

        expect(strA).toBe("");
        expect(strB).toBe("");


        const player = new Player();
        const root = new MovieClip();
        player.stage.addChild(root);

        root.addChild(sprite1);
        sprite1.addChild(sprite2);
        sprite1.removeChild(sprite2);

        expect(strA).toBe("ADDED_TO_STAGE");
        expect(strB).toBe("REMOVED_FROM_STAGE");

    });

    it("dispatchEvent test single dispatchEvent", function ()
    {
        const player = new Player();
        Util.$currentPlayerId = player._$id;

        const stage = player.stage;

        const mc = new MovieClip();
        stage.addChild(mc);


        let log = "";
        mc.addEventListener(Event.ENTER_FRAME, function (e)
        {
            log += "MovieClip";
        });

        stage.addEventListener(Event.ENTER_FRAME, function (e)
        {
            log += "Stage";
        });

        mc.dispatchEvent(new Event(Event.ENTER_FRAME));
        expect(log).toBe("MovieClip");
    });

});


describe("EventDispatcher.js willTrigger test", function()
{

    // hasEventListener
    it("willTrigger test success case1", function ()
    {
        const container = new Sprite();

        const s1 = container.addChild(new Sprite());
        const s2 = container.addChild(new Sprite());
        const s3 = s2.addChild(new Sprite());

        s2.addEventListener("test", function () {});

        expect(s1.willTrigger("test")).toBe(false);
        expect(s2.willTrigger("test")).toBe(true);
        expect(s3.willTrigger("test")).toBe(true);

    });


    // hasEventListener
    it("willTrigger test success case2", function ()
    {
        const container = new Sprite();

        const s1 = container.addChild(new Sprite());
        const s2 = s1.addChild(new Sprite());
        const s3 = s2.addChild(new Sprite());

        s1.addEventListener("test", function () {});

        expect(s1.willTrigger("test")).toBe(true);
        expect(s2.willTrigger("test")).toBe(true);
        expect(s3.willTrigger("test")).toBe(true);

    });

});