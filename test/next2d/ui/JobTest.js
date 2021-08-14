
describe("Job.js toString test", function()
{
    it("toString test success", function()
    {
        let object = new Job();
        expect(object.toString()).toBe("[object Job]");
    });

});

describe("Job.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(Job.toString()).toBe("[class Job]");
    });

});

describe("Job.js namespace test", function()
{

    it("namespace test public", function()
    {
        expect(new Job().namespace).toBe("next2d.ui.Job");
    });

    it("namespace test static", function()
    {
        expect(Job.namespace).toBe("next2d.ui.Job");
    });

});