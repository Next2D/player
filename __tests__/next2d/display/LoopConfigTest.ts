import { LoopConfig } from "../../../packages/display/src/LoopConfig";

describe("LoopConfig.js toString test", function()
{

    // toString
    it("toString test success", function ()
    {
        expect(new LoopConfig().toString()).toBe("[object LoopConfig]");
    });

});

describe("LoopConfig.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(LoopConfig.toString()).toBe("[class LoopConfig]");
    });

});

describe("LoopConfig.js namespace test", function()
{

    it("namespace test public", function()
    {
        expect(new LoopConfig().namespace).toBe("next2d.display.LoopConfig");
    });

    it("namespace test static", function()
    {
        expect(LoopConfig.namespace).toBe("next2d.display.LoopConfig");
    });

});

describe("LoopConfig.js property test", function()
{
    // default
    it("default test success", function()
    {
        let loopConfig = new LoopConfig();
        expect(loopConfig.type).toBe(0);
        expect(loopConfig.start).toBe(1);
        expect(loopConfig.end).toBe(0);
        expect(loopConfig.frame).toBe(1);
    });

    // type
    it("type test success case1", function()
    {
        for (let idx = 0; idx < 10; ++idx) {
            expect(new LoopConfig(idx).type).toBe(Math.min(4, idx));
            expect(new LoopConfig(idx + 0.5).type).toBe(Math.min(4, idx));
            expect(new LoopConfig(idx * -1).type).toBe(0);
        }
    });

    // start
    it("start test success case1", function()
    {
        for (let idx = 0; idx < 10; ++idx) {
            expect(new LoopConfig(0, idx + 1).start).toBe(idx + 1);
            expect(new LoopConfig(0, idx + 1.5).start).toBe(idx + 1);
            expect(new LoopConfig(0, idx * -1).start).toBe(1);
        }
    });

    // end
    it("end test success case1", function()
    {
        for (let idx = 0; idx < 10; ++idx) {
            expect(new LoopConfig(0, 1, idx).end).toBe(idx);
            expect(new LoopConfig(0, 1, idx + 0.5).end).toBe(idx);
            expect(new LoopConfig(0, 1, idx * -1).end).toBe(0);
        }
    });
});
