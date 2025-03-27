import { execute } from "./DisplayObjectGetBlendModeService";
import { describe, expect, it } from "vitest";

describe("DisplayObjectGetBlendModeService.js test", () =>
{
    it("execute test", () =>
    {
        expect(execute(0)).toBe("copy");
        expect(execute(1)).toBe("add");
        expect(execute(2)).toBe("alpha");
        expect(execute(3)).toBe("darken");
        expect(execute(4)).toBe("difference");
        expect(execute(5)).toBe("erase");
        expect(execute(6)).toBe("hardlight");
        expect(execute(7)).toBe("invert");
        expect(execute(8)).toBe("layer");
        expect(execute(9)).toBe("lighten");
        expect(execute(10)).toBe("multiply");
        expect(execute(11)).toBe("normal");
        expect(execute(12)).toBe("overlay");
        expect(execute(13)).toBe("screen");
        expect(execute(14)).toBe("subtract");
        expect(execute(15)).toBe("normal");
    });
});