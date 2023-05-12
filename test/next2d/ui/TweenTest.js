
describe("Tween.js toString test", function()
{
    it("toString test success", function()
    {
        let object = new Tween();
        expect(object.toString()).toBe("[object Tween]");
    });

});

describe("Tween.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(Tween.toString()).toBe("[class Tween]");
    });

});

describe("Tween.js namespace test", function()
{

    it("namespace test public", function()
    {
        expect(new Tween().namespace).toBe("next2d.ui.Tween");
    });

    it("namespace test static", function()
    {
        expect(Tween.namespace).toBe("next2d.ui.Tween");
    });

});

describe("Tween.js add test", function()
{

    it("add test case1", function()
    {
        const job = Tween.add(new Shape(), { "x": 0 }, { "x": 100 });
        expect(job.constructor === Job).toBe(true);
    });

});