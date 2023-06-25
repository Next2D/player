import { $currentPlayer } from "../../../packages/util/Util";
import { Event } from "../../../packages/events/src/Event";
import { EventDispatcher } from "../../../packages/events/src/EventDispatcher";
import { MovieClip } from "../../../packages/display/src/MovieClip";
import {Sprite} from "../../../packages/display/src/Sprite";
import {Stage} from "../../../packages/display/src/Stage";
import {EventPhase} from "../../../packages/events/src/EventPhase";

describe("EventDispatcher.js toString test", function()
{

    // toString
    it("toString test success", () =>
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
        expect(object.namespace).toBe("next2d.events.EventDispatcher");
    });

    it("namespace test static", function()
    {
        expect(EventDispatcher.namespace).toBe("next2d.events.EventDispatcher");
    });

});

describe("EventDispatcher.js addEventListener test", function()
{
    // addEventListener
    it("addEventListener test success case1", () =>
    {
        const di = new EventDispatcher();

        di.addEventListener("test", () => { return "OK" });
        di.addEventListener("test", () => { return "NG" });

        if (!di._$events) {
            throw new Error("addEventListener test success case1");
        }

        const events = di._$events.get("test");
        if (!events) {
            throw new Error("the events is none.");
        }

        expect(events.length).toBe(2);
        expect(events[0].listener()).toBe("OK");
        expect(events[1].listener()).toBe("NG");
    });

    it("addEventListener test success case2", () =>
    {
        const di = new EventDispatcher();

        di.addEventListener("test", () => { return "NG" }, false, 50);
        di.addEventListener("test", () => { return "OK" }, false, 100);

        if (!di._$events) {
            throw new Error("addEventListener test success case1");
        }

        const events = di._$events.get("test");
        if (!events) {
            throw new Error("the events is none.");
        }

        expect(events.length).toBe(2);
        expect(events[0].listener()).toBe("OK");
        expect(events[1].listener()).toBe("NG");
    });

    it("addEventListener test success case3", () =>
    {
        const di = new EventDispatcher();

        di.addEventListener("123", () => { return "NG" }, false, 50);
        di.addEventListener("123", () => { return "OK" }, false, 100);

        if (!di._$events) {
            throw new Error("addEventListener test success case1");
        }

        const events = di._$events.get("123");
        if (!events) {
            throw new Error("the events is none.");
        }

        expect(events.length).toBe(2);
        expect(events[0].listener()).toBe("OK");
        expect(events[1].listener()).toBe("NG");
    });

    it("addEventListener test valid case1", () =>
    {
        const di = new EventDispatcher();

        // @ts-ignore
        di.addEventListener("test", {});
        // @ts-ignore
        di.addEventListener("test", []);
        di.addEventListener("test", () => { return "OK" });

        if (!di._$events) {
            throw new Error("addEventListener test success case1");
        }

        const events = di._$events.get("test");
        if (!events) {
            throw new Error("the events is none.");
        }

        expect(events.length).toBe(3);
        expect(events[2].listener()).toBe("OK");
    });

    it("addEventListener test duplicate case1", () =>
    {
        const di = new EventDispatcher();

        const a = () => { return "OK" };

        di.addEventListener("test", a);
        di.addEventListener("test", a);

        if (!di._$events) {
            throw new Error("addEventListener test success case1");
        }

        const events = di._$events.get("test");
        if (!events) {
            throw new Error("the events is none.");
        }

        expect(events.length).toBe(1);
        expect(events[0].listener()).toBe("OK");
    });

    it("addEventListener test duplicate case2", () =>
    {
        const di = new EventDispatcher();

        let name = null
        di.addEventListener("test", () => { name = "ok" });
        di.addEventListener("test", () => { name = "ng" });

        if (!di._$events) {
            throw new Error("addEventListener test success case1");
        }

        const events = di._$events.get("test");
        if (!events) {
            throw new Error("the events is none.");
        }

        expect(events.length).toBe(2);
        di.dispatchEvent(new Event("test"));
        expect(name).toBe("ng");
    });

    it("addEventListener test duplicate case4", () =>
    {
        const mc1 = new MovieClip();
        mc1.name = "mc1";

        const mc2 = new MovieClip();
        mc2.name = "mc2";

        const player = $currentPlayer();
        player.broadcastEvents.clear();

        let name = null
        const a = (e: any) => { name = e.currentTarget.name };

        mc1.addEventListener(Event.ENTER_FRAME, a);
        mc2.addEventListener(Event.ENTER_FRAME, a);

        const events = player.broadcastEvents.get(Event.ENTER_FRAME);
        if (!events) {
            throw new Error("events none");
        }

        expect(events.length).toBe(2);

        mc1.dispatchEvent(new Event(Event.ENTER_FRAME))
        expect(name).toBe("mc1");

        mc2.dispatchEvent(new Event(Event.ENTER_FRAME))
        expect(name).toBe("mc2");

        // end
        mc1.removeEventListener(Event.ENTER_FRAME, a);
        mc2.removeEventListener(Event.ENTER_FRAME, a);

    });

});

describe("EventDispatcher.js hasEventListener test", function()
{

    // hasEventListener
    it("hasEventListener test success", () =>
    {
        const di = new EventDispatcher();

        di.addEventListener("test1", () => { return "OK" });
        di.addEventListener("test3", () => { return "NG" });

        expect(di.hasEventListener("test1")).toBe(true);
        expect(di.hasEventListener("test2")).toBe(false);
        expect(di.hasEventListener("test3")).toBe(true);
        expect(di.hasEventListener("test4")).toBe(false);

    });

    // メソッドが所属する EventDispatcher インスタンスについてのみリスナーが登録されているか
    it("hasEventListener test success case2", () =>
    {
        const doc1 = new MovieClip();
        const doc2 = new MovieClip();
        const doc3 = new MovieClip();
        doc1.addChild(doc2);
        doc2.addChild(doc3);

        doc2.addEventListener(Event.ENTER_FRAME, () => { return "OK" });

        expect(doc1.hasEventListener(Event.ENTER_FRAME)).toBe(false);
        expect(doc2.hasEventListener(Event.ENTER_FRAME)).toBe(true);
        expect(doc3.hasEventListener(Event.ENTER_FRAME)).toBe(false);

    });
});

describe("EventDispatcher.js removeEventListener test", function()
{

    // removeEventListener
    it("removeEventListener test success case1", () =>
    {
        const di = new EventDispatcher();

        const test1 = () => { return "OK1" };
        const test2 = () => { return "OK2" };
        const test3 = () => { return "OK3" };

        di.addEventListener("test", test1, false, 10);
        di.addEventListener("test", test2, false, 20);
        di.addEventListener("test", test3, false, 30);

        di.removeEventListener("test", test2);

        if (!di._$events) {
            throw new Error("addEventListener test success case1");
        }

        const events = di._$events.get("test");
        if (!events) {
            throw new Error("the events is none.");
        }

        expect(events.length).toBe(2);
        expect(events[0].listener()).toBe("OK3");
        expect(events[1].listener()).toBe("OK1");
    });

    it("removeEventListener test success case2", () =>
    {
        const di = new EventDispatcher();

        const a = () => { return "ok" };
        const b = () => { return "no" };

        di.addEventListener("test", a);
        di.addEventListener("test", b);

        if (!di._$events) {
            throw new Error("addEventListener test success case1");
        }

        const events = di._$events.get("test");
        if (!events) {
            throw new Error("the events is none.");
        }

        expect(events.length).toBe(2);

        di.removeEventListener("test", a);

        expect(di._$events.has("test")).toBe(true);
        expect(events.length).toBe(1);
    });

    it("removeEventListener test success case3", () =>
    {
        const di = new EventDispatcher();

        const a = () => { return "yes" };
        const b = () => { return "no" };

        di.addEventListener("test", a, true);
        di.addEventListener("test", b, false);

        if (!di._$events) {
            throw new Error("addEventListener test success case1");
        }

        const events = di._$events.get("test");
        if (!events) {
            throw new Error("the events is none.");
        }

        expect(events.length).toBe(2);

        di.removeEventListener("test", b, true);
        di.removeEventListener("test", a, true);

        expect(events.length).toBe(1);
        expect(events[0].listener().toString()).toBe("no");
    });

    it("removeEventListener test success case4", () =>
    {
        const di = new EventDispatcher();

        const a = () => { return "ok" };
        const b = () => { return "no" };

        di.addEventListener("test", a, true);
        di.addEventListener("test", b, false);

        if (!di._$events) {
            throw new Error("addEventListener test success case1");
        }

        const events = di._$events.get("test");
        if (!events) {
            throw new Error("the events is none.");
        }

        expect(events.length).toBe(2);

        di.removeEventListener("test", a, false);
        di.removeEventListener("test", b, true);

        expect(events.length).toBe(2);
        expect(events[0].listener().toString()).toBe("ok");
        expect(events[1].listener().toString()).toBe("no");
    });

    it("removeEventListener test success case5", () =>
    {
        const player = $currentPlayer();
        player.broadcastEvents.clear();

        const mc1 = new MovieClip();
        const mc2 = new MovieClip();

        const a = () => { return undefined };

        mc1.addEventListener(Event.ENTER_FRAME, a);
        mc2.addEventListener(Event.ENTER_FRAME, a);

        const events = player.broadcastEvents.get(Event.ENTER_FRAME);
        if (!events) {
            throw new Error("events none");
        }

        expect(events.length).toBe(2);

        mc1.removeEventListener(Event.ENTER_FRAME, a);
        expect(events.length).toBe(1);

        mc2.removeEventListener(Event.ENTER_FRAME, a);
        expect(player.broadcastEvents.has(Event.ENTER_FRAME)).toBe(false);
    });

});

describe("EventDispatcher.js dispatchEvent test", function()
{

    // dispatchEvent
    it("dispatchEvent test success case1", () =>
    {
        const di = new EventDispatcher();

        let s = "";
        const test1 = () => { s += "O" };
        const test2 = () => { s += "K" };
        const test3 = () => { s += "!" };

        di.addEventListener("test", test1);
        di.addEventListener("test", test2);
        di.addEventListener("test", test3);

        di.dispatchEvent(new Event("test"));

        expect(s).toBe("OK!");
    });

    it("dispatchEvent test success case2", () =>
    {

        const di = new EventDispatcher();

        let s = "";
        const test1 = () => { return s += "!" };
        const test2 = () => { return s += "K" };
        const test3 = () => { return s += "O" };

        di.addEventListener("test", test2, false, 20);
        di.addEventListener("test", test1, false, 10);
        di.addEventListener("test", test3, false, 30);

        di.dispatchEvent(new Event("test"));

        expect(s).toBe("OK!");
    });

    it("dispatchEvent test success capture case1", () =>
    {
        const mc = new MovieClip();

        let s = "";
        const test = () => { return s = "capture" };

        mc.addEventListener("test", test, true);
        expect(s).toBe("");

        const sprite = new Sprite();
        mc.addChild(sprite);

        sprite.dispatchEvent(new Event("test"));
        expect(s).toBe("capture");
    });

    it("dispatchEvent test success capture case2", () =>
    {
        const mc = new MovieClip();

        let s = "";
        const test = () => { return s = "capture" };

        mc.addEventListener("test", test);

        const sprite = new Sprite();
        mc.addChild(sprite);

        sprite.dispatchEvent(new Event("test"));
        expect(s).toBe("");
    });

    it("dispatchEvent test success capture case2", () =>
    {
        const mc = new MovieClip();

        let s = "";
        const test1 = () => { return s += "cap" };
        const test2 = () => { return s += "ture" };

        mc.addEventListener("test", test1, true);

        const sprite = new Sprite();
        sprite.addEventListener("test", test2);
        mc.addChild(sprite);

        sprite.dispatchEvent(new Event("test"));
        expect(s).toBe("capture");
    });

    it("dispatchEvent test success capture and bubble case1", () =>
    {
        const mc = new MovieClip();

        let s = "";
        const test1 = () => { return s += "cap" };
        const test2 = () => { return s += "ture" };
        const test3 = () => { return s += " and bubble" };

        mc.addEventListener("test", test1, true);
        mc.addEventListener("test", test3);

        const sprite = new Sprite();
        sprite.addEventListener("test", test2);
        mc.addChild(sprite);

        sprite.dispatchEvent(new Event("test", true));

        expect(s).toBe("capture and bubble");
    });

    // stopImmediatePropagation
    it("dispatchEvent stopImmediatePropagation test case1", () =>
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
        const EventRemovedFunc = (e: any) =>
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
    it("dispatchEvent stopImmediatePropagation test case2", () =>
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
        const EventRemovedFuncA = (e: any) =>
        {

            strA += e.currentTarget.name;

            // ターゲットフェーズに到達した
            if (e.eventPhase === EventPhase.AT_TARGET) {
                // イベント通知の伝達を終了する
                e.stopPropagation();
            }
        }

        let strB = "";
        const EventRemovedFuncB = (e: any) =>
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
    it("dispatchEvent stopImmediatePropagation test case3", () =>
    {

        let strA = "";
        const sprite1 = new Sprite();
        sprite1.addEventListener(Event.ADDED_TO_STAGE, () =>
        {
            strA = "ADDED_TO_STAGE";
        }, true);

        let strB = "";
        sprite1.addEventListener(Event.REMOVED_FROM_STAGE, () =>
        {
            strB = "REMOVED_FROM_STAGE";
        }, true);

        const sprite2 = new Sprite();
        sprite1.addChild(sprite2);
        sprite1.removeChild(sprite2);

        expect(strA).toBe("");
        expect(strB).toBe("");

        const stage = new Stage();
        const root = new MovieClip();
        stage.addChild(root);

        root.addChild(sprite1);
        sprite1.addChild(sprite2);
        sprite1.removeChild(sprite2);

        expect(strA).toBe("ADDED_TO_STAGE");
        expect(strB).toBe("REMOVED_FROM_STAGE");

    });

    it("dispatchEvent test single dispatchEvent", () =>
    {
        const player = $currentPlayer();
        player.broadcastEvents.clear();

        const stage = new Stage();

        const mc = new MovieClip();
        stage.addChild(mc);

        let log = "";
        mc.addEventListener(Event.ENTER_FRAME, () =>
        {
            log += "MovieClip";
        });

        stage.addEventListener(Event.ENTER_FRAME, () =>
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
    it("willTrigger test success case1", () =>
    {
        const container = new Sprite();

        const s1 = container.addChild(new Sprite());
        const s2 = container.addChild(new Sprite());
        const s3 = s2.addChild(new Sprite());

        s2.addEventListener("test", () => {});

        expect(s1.willTrigger("test")).toBe(false);
        expect(s2.willTrigger("test")).toBe(true);
        expect(s3.willTrigger("test")).toBe(true);

    });

    // hasEventListener
    it("willTrigger test success case2", () =>
    {
        const container = new Sprite();

        const s1 = container.addChild(new Sprite());
        const s2 = s1.addChild(new Sprite());
        const s3 = s2.addChild(new Sprite());

        s1.addEventListener("test", () => {});

        expect(s1.willTrigger("test")).toBe(true);
        expect(s2.willTrigger("test")).toBe(true);
        expect(s3.willTrigger("test")).toBe(true);

    });

});

describe("EventDispatcher.js removeAllEventListener test", function()
{

    // hasEventListener
    it("removeAllEventListener test success case1", () =>
    {
        const sprite = new Sprite();
        sprite.addEventListener("test", () => {});
        sprite.addEventListener("test", () => {});
        sprite.addEventListener("test", () => {});

        expect(sprite.hasEventListener("test")).toBe(true);
        sprite.removeAllEventListener("test");
        expect(sprite.hasEventListener("test")).toBe(false);
    });

});
