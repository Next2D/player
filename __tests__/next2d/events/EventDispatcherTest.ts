import { $currentPlayer } from "../../../packages/util/src/Util";
import { Event } from "../../../packages/events/src/Event";
import { EventDispatcher } from "../../../packages/events/src/EventDispatcher";
import { MovieClip } from "../../../packages/display/src/MovieClip";
import { Sprite } from "../../../packages/display/src/Sprite";
import { Stage } from "../../../packages/display/src/Stage";
import { EventPhase } from "../../../packages/events/src/EventPhase";

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

