
describe("SoundMixer.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new SoundMixer();
        expect(object.namespace).toBe("next2d.media.SoundMixer");
    });

    it("namespace test static", function()
    {
        expect(SoundMixer.namespace).toBe("next2d.media.SoundMixer");
    });

});

describe("SoundMixer.js toString test", function()
{
    it("toString test success", function()
    {
        expect(new SoundMixer().toString()).toBe("[object SoundMixer]");
    });

});

describe("SoundMixer.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(SoundMixer.toString()).toBe("[class SoundMixer]");
    });

});