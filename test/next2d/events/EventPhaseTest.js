
describe("EventPhase.js toString test", function()
{
    it("toString test success", function()
    {
        let object = new EventPhase();
        expect(object.toString()).toBe("[object EventPhase]");
    });

});

describe("EventPhase.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(EventPhase.toString()).toBe("[class EventPhase]");
    });

});

describe("EventPhase.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new EventPhase();
        expect(object.namespace).toBe("next2d.events.EventPhase");
    });

    it("namespace test static", function()
    {
        expect(EventPhase.namespace).toBe("next2d.events.EventPhase");
    });

});

describe("EventPhase.js property test", function()
{

    it("CAPTURING_PHASE test", function () {
        expect(EventPhase.CAPTURING_PHASE).toBe(1);
    });

    it("AT_TARGET test", function () {
        expect(EventPhase.AT_TARGET).toBe(2);
    });

    it("BUBBLING_PHASE test", function () {
        expect(EventPhase.BUBBLING_PHASE).toBe(3);
    });

});