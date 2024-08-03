import { Event } from "../Event";
import { EventDispatcher } from "../EventDispatcher";
import { EventPhase } from "../EventPhase";
import { $broadcastEvents } from "../EventUtil";
import { describe, expect, it } from "vitest";

describe("EventDispatcher.js dispatchEvent test", () =>
{
    it("dispatchEvent test case1", () =>
    {
        const eventDispatcher = new EventDispatcher();

        let result = "";
        const test1 = () => { result += "O" };
        const test2 = () => { result += "K" };
        const test3 = () => { result += "!" };

        eventDispatcher.addEventListener("test", test1);
        eventDispatcher.addEventListener("test", test2);
        eventDispatcher.addEventListener("test", test3);

        eventDispatcher.dispatchEvent(new Event("test"));

        expect(result).toBe("OK!");
    });

    it("dispatchEvent test case2", () =>
    {
        const eventDispatcher = new EventDispatcher();

        let result = "";
        const test1 = () => { result += "!" };
        const test2 = () => { result += "K" };
        const test3 = () => { result += "O" };

        eventDispatcher.addEventListener("test", test2, false, 20);
        eventDispatcher.addEventListener("test", test1, false, 10);
        eventDispatcher.addEventListener("test", test3, false, 30);

        eventDispatcher.dispatchEvent(new Event("test"));

        expect(result).toBe("OK!");
    });

    it("dispatchEvent test case3", () =>
    {
        class Parent extends EventDispatcher {}

        const parent = new Parent();
        class Child extends EventDispatcher
        {
            private _$parent: Parent;
            constructor (src: Parent)
            {
                super();

                this._$parent = src;
            }
            get parent ()
            {
                return this._$parent;
            }
        }
        const child = new Child(parent);

        let result = "";
        const test = () => { result = "capture" };

        parent.addEventListener("test", test, true);
        parent.dispatchEvent(new Event("test"));
        expect(result).toBe("");

        child.dispatchEvent(new Event("test"));
        expect(result).toBe("capture");
    });

    it("dispatchEvent test case4", () =>
    {
        class Parent extends EventDispatcher {}

        const parent = new Parent();
        class Child extends EventDispatcher
        {
            private _$parent: Parent;
            constructor (src: Parent)
            {
                super();

                this._$parent = src;
            }
            get parent ()
            {
                return this._$parent;
            }
        }
        const child = new Child(parent);

        let result = "";
        const test = () => { result = "parent" };

        parent.addEventListener("test", test);

        child.dispatchEvent(new Event("test"));
        expect(result).toBe("");

        parent.dispatchEvent(new Event("test"));
        expect(result).toBe("parent");
    });

    it("dispatchEvent test case5", () =>
    {
        class Parent extends EventDispatcher {}

        const parent = new Parent();
        class Child extends EventDispatcher
        {
            private _$parent: Parent;
            constructor (src: Parent)
            {
                super();

                this._$parent = src;
            }
            get parent ()
            {
                return this._$parent;
            }
        }
        const child = new Child(parent);

        let result = "";
        const test1 = () => { result += "cap" };
        const test2 = () => { result += "ture" };

        parent.addEventListener("test", test1, true);
        child.addEventListener("test", test2);

        child.dispatchEvent(new Event("test"));
        expect(result).toBe("capture");
    });

    it("dispatchEvent test case6", () =>
    {
        class Parent extends EventDispatcher {}

        const parent = new Parent();
        class Child extends EventDispatcher
        {
            private _$parent: Parent;
            constructor (src: Parent)
            {
                super();

                this._$parent = src;
            }
            get parent ()
            {
                return this._$parent;
            }
        }
        const child = new Child(parent);

        let result = "";
        const test1 = () => { result += "cap" };
        const test2 = () => { result += "ture" };
        const test3 = () => { result += " and bubble" };

        parent.addEventListener("test", test1, true);
        parent.addEventListener("test", test3);

        child.addEventListener("test", test2);
        child.dispatchEvent(new Event("test", true));

        expect(result).toBe("capture and bubble");
    });

    // stopImmediatePropagation
    it("dispatchEvent stopImmediatePropagation test case1", () =>
    {
        class Mock extends EventDispatcher
        {
            // eslint-disable-next-line no-use-before-define
            private _$parent: Mock | null;
            public name: string;
            constructor (src: Mock | null = null)
            {
                super();

                this._$parent = src;

                this.name = "";
            }
            get parent (): Mock | null
            {
                return this._$parent;
            }

        }

        const stage = new Mock();
        stage.name = "stage";

        const sprite_a = new Mock(stage);
        sprite_a.name = "A";

        const sprite_b = new Mock(sprite_a);
        sprite_b.name = "B";

        const sprite_c = new Mock(sprite_b);
        sprite_c.name = "C";

        let result = "";
        const EventRemovedFunc = (event: Event): void =>
        {
            result += event.currentTarget.name;

            // ターゲットフェーズに到達した
            if (event.eventPhase === EventPhase.AT_TARGET) {
                event.stopImmediatePropagation();
            }
        };

        // event
        stage.addEventListener(Event.REMOVED, EventRemovedFunc, true);
        stage.addEventListener(Event.REMOVED, EventRemovedFunc, false);
        sprite_a.addEventListener(Event.REMOVED, EventRemovedFunc, true);
        sprite_a.addEventListener(Event.REMOVED, EventRemovedFunc, false);
        sprite_b.addEventListener(Event.REMOVED, EventRemovedFunc, true);
        sprite_b.addEventListener(Event.REMOVED, EventRemovedFunc, false);
        sprite_c.addEventListener(Event.REMOVED, EventRemovedFunc, true);
        sprite_c.addEventListener(Event.REMOVED, EventRemovedFunc, false);

        sprite_c.dispatchEvent(new Event(Event.REMOVED, true));
        expect(result).toBe("stageABC");
    });

    // stopPropagation
    it("dispatchEvent stopImmediatePropagation test case2", () =>
    {
        class Mock extends EventDispatcher
        {
            // eslint-disable-next-line no-use-before-define
            private _$parent: Mock | null;
            public name: string;
            constructor (src: Mock | null = null)
            {
                super();

                this._$parent = src;

                this.name = "";
            }
            get parent (): Mock | null
            {
                return this._$parent;
            }

        }

        const stage = new Mock();
        stage.name = "stage1";

        const sprite_a = new Mock(stage);
        sprite_a.name = "A";

        const sprite_b = new Mock(sprite_a);
        sprite_b.name = "B";

        const sprite_c = new Mock(sprite_b);
        sprite_c.name = "C";

        let resultCaseA = "";
        const EventRemovedFuncA = (e: any) =>
        {

            resultCaseA += e.currentTarget.name;

            // ターゲットフェーズに到達した
            if (e.eventPhase === EventPhase.AT_TARGET) {
                // イベント通知の伝達を終了する
                e.stopPropagation();
            }
        };

        let resultCaseB = "";
        const EventRemovedFuncB = (e: any) =>
        {
            resultCaseB += e.currentTarget.name;
        };

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
        sprite_c.dispatchEvent(new Event(Event.REMOVED, true));

        expect(resultCaseA).toBe("stage1ABC");
        expect(resultCaseB).toBe("stage1ABC");

    });
});