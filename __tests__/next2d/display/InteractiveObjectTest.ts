import { $PREFIX } from "../../../src/player/util/Util";
import { InteractiveObject } from "../../../src/player/next2d/display/InteractiveObject";

describe("InteractiveObject.js mouseEnabled test", function()
{

    it("default test case1", function()
    {
        let io = new InteractiveObject();
        expect($PREFIX).toBe("__next2d__");
        expect(io.mouseEnabled).toBe(true);
    });

    it("default test case4", function()
    {
        let io = new InteractiveObject();
        io.mouseEnabled = true;
        expect(io.mouseEnabled).toBe(true);
    });

    it("default test case7", function()
    {
        let io = new InteractiveObject();
        // @ts-ignore
        io.mouseEnabled = 0;
        expect(io.mouseEnabled).toBe(false);
    });

    it("default test case8", function()
    {
        let io = new InteractiveObject();
        // @ts-ignore
        io.mouseEnabled = 1;
        expect(io.mouseEnabled).toBe(true);
    });

});