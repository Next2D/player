import { SoundTransform } from "../../../src/player/next2d/media/SoundTransform";

describe("SoundTransform.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new SoundTransform();
        expect(object.namespace).toBe("next2d.media.SoundTransform");
    });

    it("namespace test static", () =>
    {
        expect(SoundTransform.namespace).toBe("next2d.media.SoundTransform");
    });

});

describe("SoundTransform.js toString test", () =>
{
    it("toString test success", () =>
    {
        expect(new SoundTransform().toString()).toBe("[object SoundTransform]");
    });

});

describe("SoundTransform.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(SoundTransform.toString()).toBe("[class SoundTransform]");
    });

});

describe("SoundTransform.js property test", () =>
{

    // volume
    it("volume test success default", () =>
    {
        let soundTransform = new SoundTransform();
        expect(soundTransform.volume).toBe(1);
    });

    it("volume test success case1", () =>
    {
        let soundTransform = new SoundTransform();
        soundTransform.volume = 100;
        expect(soundTransform.volume).toBe(1);
    });

    it("volume test success case2", () =>
    {
        let soundTransform = new SoundTransform();
        soundTransform.volume = -32;
        expect(soundTransform.volume).toBe(0);
    });

    it("volume test success case3", () =>
    {
        let soundTransform = new SoundTransform(100);
        expect(soundTransform.volume).toBe(1);
    });

    it("volume test not a number case1", () =>
    {
        let soundTransform = new SoundTransform();
        // @ts-ignore
        soundTransform.volume = "test";
        expect(soundTransform.volume).toBe(0);
    });

    it("volume test not a number case2", () =>
    {
        let soundTransform = new SoundTransform();
        // @ts-ignore
        soundTransform.volume = "";
        expect(soundTransform.volume).toBe(0);
    });

});

describe("SoundTransform.js volume test", () =>
{

    it("default test case1", () =>
    {
        let st = new SoundTransform();
        expect(st.volume).toBe(1);
    });

    it("default test case2", () =>
    {
        let st = new SoundTransform();
        // @ts-ignore
        st.volume = null;
        expect(st.volume).toBe(0);
    });

    it("default test case3", () =>
    {
        let st = new SoundTransform();
        // @ts-ignore
        st.volume = undefined;
        expect(st.volume).toBe(0);
    });

    it("default test case4", () =>
    {
        let st = new SoundTransform();
        // @ts-ignore
        st.volume = true;
        expect(st.volume).toBe(1);
    });

    it("default test case5", () =>
    {
        let st = new SoundTransform();
        // @ts-ignore
        st.volume = "";
        expect(st.volume).toBe(0);
    });

    it("default test case6", () =>
    {
        let st = new SoundTransform();
        // @ts-ignore
        st.volume = "abc";
        expect(st.volume).toBe(0);
    });

    it("default test case7", () =>
    {
        let st = new SoundTransform();
        st.volume = 0;
        expect(st.volume).toBe(0);
    });

    it("default test case8", () =>
    {
        let st = new SoundTransform();
        st.volume = 1;
        expect(st.volume).toBe(1);
    });

    it("default test case9", () =>
    {
        let st = new SoundTransform();
        st.volume = 500;
        expect(st.volume).toBe(1);
    });

    it("default test case10", () =>
    {
        let st = new SoundTransform();
        st.volume = 50000000000000000;
        expect(st.volume).toBe(1);
    });

    it("default test case11", () =>
    {
        let st = new SoundTransform();
        st.volume = -1;
        expect(st.volume).toBe(0);
    });

    it("default test case12", () =>
    {
        let st = new SoundTransform();
        st.volume = -500;
        expect(st.volume).toBe(0);
    });

    it("default test case13", () =>
    {
        let st = new SoundTransform();
        st.volume = -50000000000000000;
        expect(st.volume).toBe(0);
    });

    it("default test case14", () =>
    {
        let st = new SoundTransform();
        // @ts-ignore
        st.volume = { "a":0 };
        expect(st.volume).toBe(0);
    });

    it("default test case15", () =>
    {
        let st = new SoundTransform();
        // @ts-ignore
        st.volume = function a() {};
        expect(st.volume).toBe(0);
    });

    it("default test case16", () =>
    {
        let st = new SoundTransform();
        // @ts-ignore
        st.volume = [1];
        expect(st.volume).toBe(1);
    });

    it("default test case17", () =>
    {
        let st = new SoundTransform();
        // @ts-ignore
        st.volume = [1,2];
        expect(st.volume).toBe(0);
    });

    it("default test case18", () =>
    {
        let st = new SoundTransform();
        // @ts-ignore
        st.volume = {};
        expect(st.volume).toBe(0);
    });

    it("default test case19", () =>
    {
        let st = new SoundTransform();
        // @ts-ignore
        st.volume = { "toString":() => { return 1 } };
        expect(st.volume).toBe(1);
    });

    it("default test case20", () =>
    {
        let st = new SoundTransform();
        // @ts-ignore
        st.volume = { "toString":() => { return "10" } };
        expect(st.volume).toBe(1);
    });

    it("default test case21", () =>
    {
        let st = new SoundTransform();
        // @ts-ignore
        st.volume = { "toString":() => { return "1a" } };
        expect(st.volume).toBe(0);
    });

});