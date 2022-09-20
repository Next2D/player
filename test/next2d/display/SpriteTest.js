
describe("Sprite.js toString test", function()
{

    // toString
    it("toString test success", function ()
    {
        let sprite = new Sprite();
        expect(sprite.toString()).toBe("[object Sprite]");
    });

});

describe("Sprite.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(Sprite.toString()).toBe("[class Sprite]");
    });

});

describe("Sprite.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new Sprite();
        expect(object.namespace).toBe("next2d.display.Sprite");
    });

    it("namespace test static", function()
    {
        expect(Sprite.namespace).toBe("next2d.display.Sprite");
    });

});

describe("Sprite.js property test", function()
{

    it("buttonMode test case1", function ()
    {
        let s = new Sprite();
        expect(s.buttonMode).toBe(false);
    });

    it("buttonMode test case2", function ()
    {
        let s = new Sprite();
        s.buttonMode = true;
        expect(s.buttonMode).toBe(true);
    });

    it("buttonMode test case3", function ()
    {
        let s = new Sprite();
        s.buttonMode = 10;
        expect(s.buttonMode).toBe(true);
    });

    it("buttonMode test case3", function ()
    {
        let s = new Sprite();
        s.buttonMode = "";
        expect(s.buttonMode).toBe(false);
    });

});

describe("Sprite.js hitArea test", function()
{
    beforeEach(function() {
        if (!("next2d" in window)) {
            window.next2d = new Next2D();
        }
        window.next2d._$player.stop();
    });

    it("hitArea test case1", function ()
    {
        let root = next2d.createRootMovieClip(640, 480, 1);
        const player = root.stage._$player;
        player._$stopFlag = false;

        let circle = new Sprite();
        let square = new Sprite();
        root.addChild(circle);
        root.addChild(square);

        circle.name = "circle";
        circle.graphics.beginFill(0xFFCC00);
        circle.graphics.drawCircle(0, 0, 40);

        square.name = "square";
        square.graphics.beginFill(0xCCFF00);
        square.graphics.drawRect(200, 0, 100, 100);

        let targetName      = "";
        circle.hitArea      = square;
        square.mouseEnabled = false;
        circle.addEventListener("click", function (event)
        {
            targetName = event.target.name;
        });

        const div = document.getElementById(player.contentElementId);
        const rect = div.getBoundingClientRect();
        Util.$event = {
            "pageX": 250 * player._$scale + rect.left,
            "pageY": 50  * player._$scale + rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_DOWN;

        // execute
        player._$hitTest();

        Util.$event = {
            "pageX": 250 * player._$scale + rect.left,
            "pageY": 50  * player._$scale + rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_UP;

        // execute
        player._$hitTest();

        expect(targetName).toBe("circle");

    });

});

describe("Sprite.js buttonMode test", function()
{

    it("default test case1", function()
    {
        let sp = new Sprite();
        expect(sp.buttonMode).toBe(false);
    });

    it("default test case2", function()
    {
        let sp = new Sprite();
        sp.buttonMode = null;
        expect(sp.buttonMode).toBe(false);
    });

    it("default test case3", function()
    {
        let sp = new Sprite();
        sp.buttonMode = undefined;
        expect(sp.buttonMode).toBe(false);
    });

    it("default test case4", function()
    {
        let sp = new Sprite();
        sp.buttonMode = true;
        expect(sp.buttonMode).toBe(true);
    });

    it("default test case5", function()
    {
        let sp = new Sprite();
        sp.buttonMode = "";
        expect(sp.buttonMode).toBe(false);
    });

    it("default test case6", function()
    {
        let sp = new Sprite();
        sp.buttonMode = "abc";
        expect(sp.buttonMode).toBe(true);
    });

    it("default test case7", function()
    {
        let sp = new Sprite();
        sp.buttonMode = 0;
        expect(sp.buttonMode).toBe(false);
    });

    it("default test case8", function()
    {
        let sp = new Sprite();
        sp.buttonMode = 1;
        expect(sp.buttonMode).toBe(true);
    });

    it("default test case9", function()
    {
        let sp = new Sprite();
        sp.buttonMode = 500;
        expect(sp.buttonMode).toBe(true);
    });

    it("default test case10", function()
    {
        let sp = new Sprite();
        sp.buttonMode = -1;
        expect(sp.buttonMode).toBe(true);
    });

    it("default test case11", function()
    {
        let sp = new Sprite();
        sp.buttonMode = -500;
        expect(sp.buttonMode).toBe(true);
    });

    it("default test case12", function()
    {
        let sp = new Sprite();
        sp.buttonMode = { "a":0 };
        expect(sp.buttonMode).toBe(true);
    });

    it("default test case13", function()
    {
        let sp = new Sprite();
        sp.buttonMode = function a() {};
        expect(sp.buttonMode).toBe(true);
    });

    it("default test case14", function()
    {
        let sp = new Sprite();
        sp.buttonMode = [1];
        expect(sp.buttonMode).toBe(true);
    });

    it("default test case15", function()
    {
        let sp = new Sprite();
        sp.buttonMode = [1,2];
        expect(sp.buttonMode).toBe(true);
    });

    it("default test case16", function()
    {
        let sp = new Sprite();
        sp.buttonMode = {};
        expect(sp.buttonMode).toBe(true);
    });

    it("default test case17", function()
    {
        let sp = new Sprite();
        sp.buttonMode = { "toString":function () { return 1 } };
        expect(sp.buttonMode).toBe(true);
    });

    it("default test case18", function()
    {
        let sp = new Sprite();
        sp.buttonMode = { "toString":function () { return "1" } };
        expect(sp.buttonMode).toBe(true);
    });

    it("default test case19", function()
    {
        let sp = new Sprite();
        sp.buttonMode = { "toString":function () { return "1a" } };
        expect(sp.buttonMode).toBe(true);
    });

});
