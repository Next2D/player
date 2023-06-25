import { $PREFIX } from "../../../packages/util/Util";
import { FrameLabel } from "../../../packages/display/src/FrameLabel";

describe("FrameLabel.js toString test", function()
{

    // toString
    it("toString test success", function ()
    {
        const frameLabel = new FrameLabel("test", 10);
        expect($PREFIX).toBe("__next2d__");
        expect(frameLabel.toString()).toBe("[object FrameLabel]");
    });

});

describe("FrameLabel.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(FrameLabel.toString()).toBe("[class FrameLabel]");
    });

});

describe("FrameLabel.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new FrameLabel("", 1);
        expect(object.namespace).toBe("next2d.display.FrameLabel");
    });

    it("namespace test static", function()
    {
        expect(FrameLabel.namespace).toBe("next2d.display.FrameLabel");
    });

});

describe("FrameLabel.js property test", function()
{

    // property
    it("property test", function()
    {
        const frameLabel = new FrameLabel("test", 10);

        expect(frameLabel.name).toBe("test");
        expect(frameLabel.frame).toBe(10);
    });

    // readonly
    it("property readonly test", function()
    {
        const frameLabel = new FrameLabel("testA", 10);

        let name = frameLabel.name;
        try {
            // @ts-ignore
            frameLabel.name  = "test2";
            name = frameLabel.name;
        } catch (e) {}

        let frame = frameLabel.frame;
        try {
            // @ts-ignore
            frameLabel.frame = 1;
            frame = frameLabel.frame;
        } catch (e) {}

        expect(name).toBe("testA");
        expect(frame).toBe(10);
    });

});
