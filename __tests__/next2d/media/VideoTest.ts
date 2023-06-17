import { $PREFIX } from "../../../src/player/util/Util";
import { Video } from "../../../src/player/next2d/media/Video";

describe("Video.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new Video();
        expect(object.namespace).toBe("next2d.media.Video");
        expect($PREFIX).toBe("__next2d__");
    });

    it("namespace test static", function()
    {
        expect(Video.namespace).toBe("next2d.media.Video");
    });

});

describe("Video.js toString test", function()
{
    it("toString test success", function()
    {
        expect(new Video().toString()).toBe("[object Video]");
    });

});

describe("Video.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(Video.toString()).toBe("[class Video]");
    });

});

describe("Video.js smoothing test", function()
{

    it("default test case1", function()
    {
        let vi = new Video();
        expect(vi.smoothing).toBe(true);
    });

    it("default test case2", function()
    {
        let vi = new Video();
        // @ts-ignore
        vi.smoothing = null;
        expect(vi.smoothing).toBe(false);
    });

    it("default test case3", function()
    {
        let vi = new Video();
        // @ts-ignore
        vi.smoothing = undefined;
        expect(vi.smoothing).toBe(false);
    });

    it("default test case4", function()
    {
        let vi = new Video();
        vi.smoothing = true;
        expect(vi.smoothing).toBe(true);
    });

    it("default test case5", function()
    {
        let vi = new Video();
        // @ts-ignore
        vi.smoothing = "";
        expect(vi.smoothing).toBe(false);
    });

    it("default test case6", function()
    {
        let vi = new Video();
        // @ts-ignore
        vi.smoothing = "abc";
        expect(vi.smoothing).toBe(true);
    });

    it("default test case7", function()
    {
        let vi = new Video();
        // @ts-ignore
        vi.smoothing = 0;
        expect(vi.smoothing).toBe(false);
    });

    it("default test case8", function()
    {
        let vi = new Video();
        // @ts-ignore
        vi.smoothing = 1;
        expect(vi.smoothing).toBe(true);
    });

    it("default test case9", function()
    {
        let vi = new Video();
        // @ts-ignore
        vi.smoothing = { "a":0 };
        expect(vi.smoothing).toBe(true);
    });

    it("default test case10", function()
    {
        let vi = new Video();
        // @ts-ignore
        vi.smoothing = function a() {};
        expect(vi.smoothing).toBe(true);
    });

});