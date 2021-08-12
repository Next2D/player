
describe("FocusEvent.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(FocusEvent.toString()).toBe("[class FocusEvent]");
    });

});

describe("FocusEvent.js toString test", function()
{
    // toString
    it("toString test success", function()
    {
        let event = new FocusEvent("focusIn");
        expect(event.toString()).toBe("[FocusEvent type=\"focusIn\" bubbles=true cancelable=false eventPhase=2]");
    });

});

describe("FocusEvent.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new FocusEvent("test");
        expect(object.namespace).toBe("next2d.events.FocusEvent");
    });

    it("namespace test static", function()
    {
        expect(FocusEvent.namespace).toBe("next2d.events.FocusEvent");
    });

});

describe("FocusEvent.js property test", function()
{

    it("FOCUS_IN test", function () {
        expect(FocusEvent.FOCUS_IN).toBe("focusIn");
    });

    it("FOCUS_OUT test", function () {
        expect(FocusEvent.FOCUS_OUT).toBe("focusOut");
    });

    it("instance test", function ()
    {
        expect(new FocusEvent() instanceof FocusEvent).toBe(true);
    });

});

