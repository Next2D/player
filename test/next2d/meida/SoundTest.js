
describe("Sound.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new Sound();
        expect(object.namespace).toBe("next2d.media.Sound");
    });

    it("namespace test static", function()
    {
        expect(Sound.namespace).toBe("next2d.media.Sound");
    });

});

describe("Sound.js toString test", function()
{
    it("toString test success", function()
    {
        expect(new Sound().toString()).toBe("[object Sound]");
    });

});

describe("Sound.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(Sound.toString()).toBe("[class Sound]");
    });

});