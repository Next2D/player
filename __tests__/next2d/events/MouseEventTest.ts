import { MouseEvent } from "../../../src/next2d/events/MouseEvent";

describe("MouseEvent.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(MouseEvent.toString()).toBe("[class MouseEvent]");
    });

});

describe("MouseEvent.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new MouseEvent("test");
        expect(object.namespace).toBe("next2d.events.MouseEvent");
    });

    it("namespace test static", () =>
    {
        expect(MouseEvent.namespace).toBe("next2d.events.MouseEvent");
    });

});

describe("MouseEvent.js property test", () =>
{

    it("CLICK test", () =>
    {
        expect(MouseEvent.CLICK).toBe("click");
    });

    it("DOUBLE_CLICK test", () =>
    {
        expect(MouseEvent.DOUBLE_CLICK).toBe("dblclick");
    });

    it("MOUSE_DOWN test", () =>
    {
        expect(MouseEvent.MOUSE_DOWN).toBe("mouseDown");
    });

    it("MOUSE_MOVE test", () =>
    {
        expect(MouseEvent.MOUSE_MOVE).toBe("mouseMove");
    });

    it("MOUSE_OUT test", () =>
    {
        expect(MouseEvent.MOUSE_OUT).toBe("mouseOut");
    });

    it("MOUSE_OVER test", () =>
    {
        expect(MouseEvent.MOUSE_OVER).toBe("mouseOver");
    });

    it("MOUSE_UP test", () =>
    {
        expect(MouseEvent.MOUSE_UP).toBe("mouseUp");
    });

    it("MOUSE_WHEEL test", () =>{
        expect(MouseEvent.MOUSE_WHEEL).toBe("mouseWheel");
    });

    it("ROLL_OUT test", () =>
    {
        expect(MouseEvent.ROLL_OUT).toBe("rollOut");
    });

    it("ROLL_OVER test", () =>
    {
        expect(MouseEvent.ROLL_OVER).toBe("rollOver");
    });

});