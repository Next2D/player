
describe("SoundTransform.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new SoundTransform();
        expect(object.namespace).toBe("next2d.media.SoundTransform");
    });

    it("namespace test static", function()
    {
        expect(SoundTransform.namespace).toBe("next2d.media.SoundTransform");
    });

});

describe("SoundTransform.js toString test", function()
{
    it("toString test success", function()
    {
        expect(new SoundTransform().toString()).toBe("[object SoundTransform]");
    });

});

describe("SoundTransform.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(SoundTransform.toString()).toBe("[class SoundTransform]");
    });

});

describe("SoundTransform.js property test", function()
{

    // volume
    it("volume test success default", function ()
    {
        let soundTransform = new SoundTransform();
        expect(soundTransform.volume).toBe(1);
    });

    it("volume test success case1", function ()
    {
        let soundTransform = new SoundTransform();
        soundTransform.volume = 100;
        expect(soundTransform.volume).toBe(1);
    });

    it("volume test success case2", function ()
    {
        let soundTransform = new SoundTransform();
        soundTransform.volume = -32;
        expect(soundTransform.volume).toBe(0);
    });

    it("volume test success case3", function ()
    {
        let soundTransform = new SoundTransform(100);
        expect(soundTransform.volume).toBe(1);
    });

    it("volume test not a number case1", function ()
    {
        let soundTransform = new SoundTransform();
        soundTransform.volume = "test";
        expect(soundTransform.volume).toBe(0);
    });

    it("volume test not a number case2", function ()
    {
        let soundTransform = new SoundTransform();
        soundTransform.volume = "";
        expect(soundTransform.volume).toBe(0);
    });

});

describe("SoundTransform.js volume test", function()
{

    it("default test case1", function()
    {
        let st = new SoundTransform();
        expect(st.volume).toBe(1);
    });

    it("default test case2", function()
    {
        let st = new SoundTransform();
        st.volume = null;
        expect(st.volume).toBe(0);
    });

    it("default test case3", function()
    {
        let st = new SoundTransform();
        st.volume = undefined;
        expect(st.volume).toBe(0);
    });

    it("default test case4", function()
    {
        let st = new SoundTransform();
        st.volume = true;
        expect(st.volume).toBe(1);
    });

    it("default test case5", function()
    {
        let st = new SoundTransform();
        st.volume = "";
        expect(st.volume).toBe(0);
    });

    it("default test case6", function()
    {
        let st = new SoundTransform();
        st.volume = "abc";
        expect(st.volume).toBe(0);
    });

    it("default test case7", function()
    {
        let st = new SoundTransform();
        st.volume = 0;
        expect(st.volume).toBe(0);
    });

    it("default test case8", function()
    {
        let st = new SoundTransform();
        st.volume = 1;
        expect(st.volume).toBe(1);
    });

    it("default test case9", function()
    {
        let st = new SoundTransform();
        st.volume = 500;
        expect(st.volume).toBe(1);
    });

    it("default test case10", function()
    {
        let st = new SoundTransform();
        st.volume = 50000000000000000;
        expect(st.volume).toBe(1);
    });

    it("default test case11", function()
    {
        let st = new SoundTransform();
        st.volume = -1;
        expect(st.volume).toBe(0);
    });

    it("default test case12", function()
    {
        let st = new SoundTransform();
        st.volume = -500;
        expect(st.volume).toBe(0);
    });

    it("default test case13", function()
    {
        let st = new SoundTransform();
        st.volume = -50000000000000000;
        expect(st.volume).toBe(0);
    });

    it("default test case14", function()
    {
        let st = new SoundTransform();
        st.volume = { "a":0 };
        expect(st.volume).toBe(0);
    });

    it("default test case15", function()
    {
        let st = new SoundTransform();
        st.volume = function a() {};
        expect(st.volume).toBe(0);
    });

    it("default test case16", function()
    {
        let st = new SoundTransform();
        st.volume = [1];
        expect(st.volume).toBe(1);
    });

    it("default test case17", function()
    {
        let st = new SoundTransform();
        st.volume = [1,2];
        expect(st.volume).toBe(0);
    });

    it("default test case18", function()
    {
        let st = new SoundTransform();
        st.volume = {};
        expect(st.volume).toBe(0);
    });

    it("default test case19", function()
    {
        let st = new SoundTransform();
        st.volume = { "toString":function () { return 1 } };
        expect(st.volume).toBe(1);
    });

    it("default test case20", function()
    {
        let st = new SoundTransform();
        st.volume = { "toString":function () { return "10" } };
        expect(st.volume).toBe(1);
    });

    it("default test case21", function()
    {
        let st = new SoundTransform();
        st.volume = { "toString":function () { return "1a" } };
        expect(st.volume).toBe(0);
    });

});