
describe("Stage.js toString test", function()
{
    // toString
    it("toString test success", function()
    {
        let stage = new Stage();
        expect(stage.toString()).toBe("[object Stage]");
    });

});

describe("Stage.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(Stage.toString()).toBe("[class Stage]");
    });

});

describe("Stage.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new Stage();
        expect(object.namespace).toBe("next2d.display.Stage");
    });

    it("namespace test static", function()
    {
        expect(Stage.namespace).toBe("next2d.display.Stage");
    });

});

describe("Stage.js property test", function()
{

    // color
    it("color test success case1", function()
    {
        let stage = new Stage();
        stage.color = 0x00990000;
        expect(stage.color).toBe(0x00990000);
    });

    it("color test success case2", function()
    {
        let stage = new Stage();
        stage.color = "red";
        expect(stage.color).toBe(16711680);
    });

    // frameRate
    it("frameRate test success case1", function()
    {
        let stage = new Stage();
        stage.frameRate = 50;
        expect(stage.frameRate).toBe(50);
    });

    it("frameRate test success case2", function()
    {
        let stage = new Stage();
        stage.frameRate = 0.001;
        expect(stage.frameRate).toBe(1);
    });

    it("frameRate test valid case1", function()
    {
        let stage = new Stage();
        stage.frameRate = 0;
        expect(stage.frameRate).toBe(1);
    });

    it("frameRate test valid case2", function()
    {
        let stage = new Stage();
        stage.frameRate = 1200;
        expect(stage.frameRate).toBe(60);
    });

    it("frameRate test valid case3", function()
    {
        let stage = new Stage();
        stage.frameRate = "a";
        expect(stage.frameRate).toBe(60);
    });

});