describe("MouseEvent.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(MouseEvent.toString()).toBe("[class MouseEvent]");
    });

});

describe("MouseEvent.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new MouseEvent("test");
        expect(object.namespace).toBe("next2d.events.MouseEvent");
    });

    it("namespace test static", function()
    {
        expect(MouseEvent.namespace).toBe("next2d.events.MouseEvent");
    });

});

describe("MouseEvent.js property test", function()
{

    it("CLICK test", function () {
        expect(MouseEvent.CLICK).toBe("click");
    });

    it("DOUBLE_CLICK test", function () {
        expect(MouseEvent.DOUBLE_CLICK).toBe("dblclick");
    });

    it("MOUSE_DOWN test", function () {
        expect(MouseEvent.MOUSE_DOWN).toBe("mouseDown");
    });

    it("MOUSE_MOVE test", function () {
        expect(MouseEvent.MOUSE_MOVE).toBe("mouseMove");
    });

    it("MOUSE_OUT test", function () {
        expect(MouseEvent.MOUSE_OUT).toBe("mouseOut");
    });

    it("MOUSE_OVER test", function () {
        expect(MouseEvent.MOUSE_OVER).toBe("mouseOver");
    });

    it("MOUSE_UP test", function () {
        expect(MouseEvent.MOUSE_UP).toBe("mouseUp");
    });

    it("MOUSE_WHEEL test", function () {
        expect(MouseEvent.MOUSE_WHEEL).toBe("mouseWheel");
    });

    it("ROLL_OUT test", function () {
        expect(MouseEvent.ROLL_OUT).toBe("rollOut");
    });

    it("ROLL_OVER test", function () {
        expect(MouseEvent.ROLL_OVER).toBe("rollOver");
    });

    it("instance test", function ()
    {
        expect(new MouseEvent() instanceof MouseEvent).toBe(true);
    });

});