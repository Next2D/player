import { $PREFIX } from "../../../src/util/Util";
import { Sound } from "../../../src/next2d/media/Sound";

describe("Sound.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new Sound();
        expect(object.namespace).toBe("next2d.media.Sound");
        expect($PREFIX).toBe("__next2d__");
    });

    it("namespace test static", () =>
    {
        expect(Sound.namespace).toBe("next2d.media.Sound");
    });

});

describe("Sound.js toString test", () =>
{
    it("toString test success", () =>
    {
        expect(new Sound().toString()).toBe("[object Sound]");
    });

});

describe("Sound.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(Sound.toString()).toBe("[class Sound]");
    });

});