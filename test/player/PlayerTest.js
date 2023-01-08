describe("Player.js base test", function()
{
    beforeEach(function() {
        window.next2d = new Next2D();
        window.next2d._$player._$canvas = document.createElement("canvas");
        Util.$renderURL = null;
    });

    it("base valid case1", function()
    {
        const root = next2d.createRootMovieClip(240, 240, 1, {
            "base": "https://sample.com/json"
        });

        const player = root.stage._$player;
        expect(player.base).toBe("https://sample.com/json/");
        player.stop();
    });

    it("base valid case2", function()
    {
        const root = next2d.createRootMovieClip(240, 240, 1, {
            "base": "https://sample.com/json/"
        });

        const player = root.stage._$player;
        expect(player.base).toBe("https://sample.com/json/");
        player.stop();
    });

    it("base valid case3", function()
    {
        const root = next2d.createRootMovieClip(240, 240, 1, {
            "base": "https://sample.com/json/?param=1"
        });

        const player = root.stage._$player;
        expect(player.base).toBe("https://sample.com/json/");
        player.stop();
    });

    it("base valid case4", function()
    {
        const root = next2d.createRootMovieClip(240, 240, 1, {
            "base": "https://sample.com/json?param=1"
        });

        const player = root.stage._$player;
        expect(player.base).toBe("https://sample.com/json/");
        player.stop();
    });

});

describe("Player.js hitTest test", function()
{
    beforeEach(function() {
        window.next2d = new Next2D();
        window.next2d._$player._$canvas = document.createElement("canvas");
        Util.$renderURL = null;
    });

    it("mouse move event case1", function()
    {
        let root = next2d.createRootMovieClip(640, 480, 1);
        const player = root.stage._$player;
        player._$stopFlag = false;

        let btn = root.addChild(new Sprite());
        btn.name = "btn";
        btn.x = 320;
        btn.y = 120;

        let sprite1 = btn.addChild(new Sprite());
        let sprite2 = btn.addChild(new Sprite());

        // sprite1
        sprite1.x = 50;
        sprite1.graphics.beginFill(0x00ff00, 1);
        sprite1.graphics.drawRect(0, 0, 70, 150);
        sprite1.graphics.endFill();

        // sprite2
        sprite2.name = "mc";

        let shape = sprite2.addChild(new Shape());
        shape.graphics.beginFill(0x000000, 1);
        shape.graphics.drawCircle(20, 20, 50);
        shape.graphics.endFill();

        let sprite3 = sprite2.addChild(new Sprite());
        sprite3.name = "mc3";
        sprite3.y = 30;
        sprite3.graphics.beginFill(0xff0000, 1);
        sprite3.graphics.drawCircle(0, 0, 30);
        sprite3.graphics.endFill();

        // reset
        let outString   = "";
        let moveString  = "";
        let overString  = "";
        let orderString = "";

        // add event
        sprite2.addEventListener(MouseEvent.MOUSE_OUT, function (e)
        {
            orderString += MouseEvent.MOUSE_OUT;
            outString   = ["btn", MouseEvent.MOUSE_OUT, e.target.name].join(" ");
        });
        sprite2.addEventListener(MouseEvent.MOUSE_MOVE, function (e)
        {
            orderString += MouseEvent.MOUSE_MOVE;
            moveString  = ["btn", MouseEvent.MOUSE_MOVE, e.target.name].join(" ");
        });
        sprite2.addEventListener(MouseEvent.MOUSE_OVER, function (e)
        {
            orderString += MouseEvent.MOUSE_OVER;
            overString  = ["btn", MouseEvent.MOUSE_OVER, e.target.name].join(" ");
        });

        const div = document.getElementById(player.contentElementId);
        const rect = div.getBoundingClientRect();
        Util.$event = {
            "pageX": 300 * player._$scale + rect.left,
            "pageY": 160 * player._$scale + rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_MOVE;

        // execute
        player._$hitTest();

        expect(outString).toBe("");
        expect(moveString).toBe("btn mouseMove mc3");
        expect(overString).toBe("btn mouseOver mc3");
        expect(orderString).toBe(MouseEvent.MOUSE_MOVE + "" + MouseEvent.MOUSE_OVER);

        //reset
        outString   = "";
        moveString  = "";
        overString  = "";
        orderString = "";

        Util.$event = {
            "pageX": rect.left,
            "pageY": rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_MOVE;

        // execute
        player._$hitTest();
        expect(outString).toBe("btn mouseOut mc3");
        expect(moveString).toBe("");
        expect(overString).toBe("");
        expect(orderString).toBe(MouseEvent.MOUSE_OUT);

        //reset
        outString   = "";
        moveString  = "";
        overString  = "";
        orderString = "";

        Util.$event = {
            "pageX": 345 * player._$scale + rect.left,
            "pageY": 185 * player._$scale + rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_MOVE;

        // execute
        player._$hitTest();

        expect(outString).toBe("");
        expect(moveString).toBe("btn mouseMove mc");
        expect(overString).toBe("btn mouseOver mc");
        expect(orderString).toBe(MouseEvent.MOUSE_MOVE + "" + MouseEvent.MOUSE_OVER);

        //reset
        outString   = "";
        moveString  = "";
        overString  = "";
        orderString = "";

        Util.$event = {
            "pageX": rect.left,
            "pageY": rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_MOVE;

        // execute
        player._$hitTest();

        expect(outString).toBe("btn mouseOut mc");
        expect(moveString).toBe("");
        expect(overString).toBe("");
        expect(orderString).toBe(MouseEvent.MOUSE_OUT);

        player.stop();
    });

    it("mouse move event case1", function()
    {
        let root = next2d.createRootMovieClip(640, 480, 1);
        const player = root.stage._$player;
        player._$stopFlag = false;

        let btn = root.addChild(new Sprite());
        btn.name = "btn";
        btn.x = 320;
        btn.y = 120;

        let sprite1 = btn.addChild(new Sprite());
        let sprite2 = btn.addChild(new Sprite());

        // sprite1
        sprite1.x = 50;
        sprite1.graphics.beginFill(0x00ff00, 1);
        sprite1.graphics.drawRect(0, 0, 70, 150);
        sprite1.graphics.endFill();

        // sprite2
        sprite2.name = "mc";

        let shape = sprite2.addChild(new Shape());
        shape.graphics.beginFill(0x000000, 1);
        shape.graphics.drawCircle(20, 20, 50);
        shape.graphics.endFill();

        let sprite3 = sprite2.addChild(new Sprite());
        sprite3.name = "mc3";
        sprite3.y = 30;
        sprite3.graphics.beginFill(0xff0000, 1);
        sprite3.graphics.drawCircle(0, 0, 30);
        sprite3.graphics.endFill();

        // reset
        let downString  = "";
        let upString    = "";
        let clickString = "";
        let orderString = "";

        // add event
        sprite2.addEventListener(MouseEvent.MOUSE_DOWN, function (e)
        {
            orderString += MouseEvent.MOUSE_DOWN;
            downString  = ["btn", MouseEvent.MOUSE_DOWN, e.target.name].join(" ");
        });
        sprite2.addEventListener(MouseEvent.MOUSE_UP, function (e)
        {
            orderString += MouseEvent.MOUSE_UP;
            upString    = ["btn", MouseEvent.MOUSE_UP, e.target.name].join(" ");
        });
        sprite2.addEventListener(MouseEvent.CLICK, function (e)
        {
            orderString += MouseEvent.CLICK;
            clickString = ["btn", MouseEvent.CLICK, e.target.name].join(" ");
        });

        const div = document.getElementById(player.contentElementId);
        const rect = div.getBoundingClientRect();
        Util.$event = {
            "pageX": 300 * player._$scale + rect.left,
            "pageY": 160 * player._$scale + rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_DOWN;

        // execute
        player._$hitTest();

        expect(downString).toBe("btn mouseDown mc3");
        expect(upString).toBe("");
        expect(clickString).toBe("");
        expect(orderString).toBe(MouseEvent.MOUSE_DOWN);

        //reset
        downString  = "";
        upString    = "";
        clickString = "";
        orderString = "";

        Util.$event = {
            "pageX": 300 * player._$scale + rect.left,
            "pageY": 160 * player._$scale + rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_UP;

        // execute
        player._$hitTest();

        expect(downString).toBe("");
        expect(upString).toBe("btn mouseUp mc3");
        expect(clickString).toBe("btn click mc3");
        expect(orderString).toBe(MouseEvent.MOUSE_UP + "" + MouseEvent.CLICK);

        //reset
        downString  = "";
        upString    = "";
        clickString = "";
        orderString = "";

        Util.$event = {
            "pageX": 345 * player._$scale + rect.left,
            "pageY": 185 * player._$scale + rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_DOWN;

        // execute
        player._$hitTest();

        expect(downString).toBe("btn mouseDown mc");
        expect(upString).toBe("");
        expect(clickString).toBe("");
        expect(orderString).toBe(MouseEvent.MOUSE_DOWN);

        //reset
        downString  = "";
        upString    = "";
        clickString = "";
        orderString = "";

        Util.$event = {
            "pageX": 345 * player._$scale + rect.left,
            "pageY": 185 * player._$scale + rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_UP;

        // execute
        player._$hitTest();

        expect(downString).toBe("");
        expect(upString).toBe("btn mouseUp mc");
        expect(clickString).toBe("btn click mc");
        expect(orderString).toBe(MouseEvent.MOUSE_UP + "" + MouseEvent.CLICK);

        //reset
        downString  = "";
        upString    = "";
        clickString = "";
        orderString = "";

        Util.$event = {
            "pageX": 300 * player._$scale + rect.left,
            "pageY": 160 * player._$scale + rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_DOWN;

        // execute
        player._$hitTest();

        expect(downString).toBe("btn mouseDown mc3");
        expect(upString).toBe("");
        expect(clickString).toBe("");
        expect(orderString).toBe(MouseEvent.MOUSE_DOWN);

        //reset
        downString  = "";
        upString    = "";
        clickString = "";
        orderString = "";

        Util.$event = {
            "pageX": rect.left,
            "pageY": rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_UP;

        // execute
        player._$hitTest();

        expect(downString).toBe("");
        expect(upString).toBe("");
        expect(clickString).toBe("");
        expect(orderString).toBe("");

        //reset
        downString  = "";
        upString    = "";
        clickString = "";
        orderString = "";

        Util.$event = {
            "pageX": rect.left,
            "pageY": rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_DOWN;

        player._$hitTest();

        expect(downString).toBe("");
        expect(upString).toBe("");
        expect(clickString).toBe("");
        expect(orderString).toBe("");

        //reset
        downString  = "";
        upString    = "";
        clickString = "";
        orderString = "";

        Util.$event = {
            "pageX": 345 * player._$scale + rect.left,
            "pageY": 185 * player._$scale + rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_UP;

        // execute
        player._$hitTest();

        expect(downString).toBe("");
        expect(upString).toBe("btn mouseUp mc");
        expect(clickString).toBe("");
        expect(orderString).toBe(MouseEvent.MOUSE_UP);

        player.stop();
    });

    it("mouse roll over and out event case1", function()
    {
        let root = next2d.createRootMovieClip(640, 480, 1);
        root.name = "root1";
        const player = root.stage._$player;
        player._$stopFlag = false;

        let btn = root.addChild(new Sprite());
        btn.name = "btn";
        btn.x = 320;
        btn.y = 120;

        let sprite1 = btn.addChild(new Sprite());
        let sprite2 = btn.addChild(new Sprite());

        // sprite1
        sprite1.name = "mc2";
        sprite1.x = 50;
        sprite1.graphics.beginFill(0x00ff00, 1);
        sprite1.graphics.drawRect(0, 0, 70, 150);
        sprite1.graphics.endFill();

        // sprite2
        sprite2.name = "mc";

        let shape = sprite2.addChild(new Shape());
        shape.graphics.beginFill(0x000000, 1);
        shape.graphics.drawCircle(20, 20, 50);
        shape.graphics.endFill();

        let sprite3 = sprite2.addChild(new Sprite());
        sprite3.name = "mc3";
        sprite3.y = 30;
        sprite3.graphics.beginFill(0xff0000, 1);
        sprite3.graphics.drawCircle(0, 0, 30);
        sprite3.graphics.endFill();

        // reset
        let orderString = [];

        // add event
        sprite2.addEventListener(MouseEvent.ROLL_OVER, function (e)
        {
            orderString[orderString.length] = ["sprite2", MouseEvent.ROLL_OVER, e.target.name].join(" ");
        });
        sprite3.addEventListener(MouseEvent.ROLL_OVER, function (e)
        {
            orderString[orderString.length] = ["sprite3", MouseEvent.ROLL_OVER, e.target.name].join(" ");
        });
        root.stage.addEventListener(MouseEvent.ROLL_OVER, function (e)
        {
            orderString[orderString.length] = ["stage", MouseEvent.ROLL_OVER, e.target.name].join(" ");
        }, true);
        sprite2.addEventListener(MouseEvent.ROLL_OUT, function (e)
        {
            orderString[orderString.length] = ["sprite2", MouseEvent.ROLL_OUT, e.target.name].join(" ");
        });

        const div = document.getElementById(player.contentElementId);
        const rect = div.getBoundingClientRect();
        Util.$event = {
            "pageX": 300 * player._$scale + rect.left,
            "pageY": 160 * player._$scale + rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_MOVE;

        // execute
        player._$hitTest();

        let stringArray = [
            "stage rollOver mc3",
            "sprite3 rollOver mc3",
            "stage rollOver mc",
            "sprite2 rollOver mc",
            "stage rollOver btn",
            "stage rollOver root1"
        ];
        for (let i = 0; i < orderString.length; i++) {

            expect(orderString[i]).toBe(stringArray[i]);

        }

        // reset
        orderString = [];

        Util.$event = {
            "pageX": rect.left,
            "pageY": rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_MOVE;

        // execute
        player._$hitTest();

        expect(orderString[0]).toBe("sprite2 rollOut mc");

        // reset
        orderString = [];

        Util.$event = {
            "pageX": 345 * player._$scale + rect.left,
            "pageY": 185 * player._$scale + rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_MOVE;

        // execute
        player._$hitTest();

        stringArray = [
            "stage rollOver mc",
            "sprite2 rollOver mc",
            "stage rollOver btn",
            "stage rollOver root1"
        ];
        for (let i = 0; i < orderString.length; i++) {

            expect(orderString[i]).toBe(stringArray[i]);

        }

        Util.$event = {
            "pageX": rect.left,
            "pageY": rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_MOVE;

        // execute reset
        player._$hitTest();

        // reset
        orderString = [];

        Util.$event = {
            "pageX": 426 * player._$scale + rect.left,
            "pageY": 216 * player._$scale + rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_MOVE;

        // execute
        player._$hitTest();

        stringArray = [
            "stage rollOver mc2",
            "stage rollOver btn",
            "stage rollOver root1"
        ];
        for (let i = 0; i < orderString.length; i++) {

            expect(orderString[i]).toBe(stringArray[i]);

        }

        Util.$event = {
            "pageX": 345 * player._$scale + rect.left,
            "pageY": 185 * player._$scale + rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_MOVE;

        // execute
        player._$hitTest();

        Util.$event = {
            "pageX": 300 * player._$scale + rect.left,
            "pageY": 160 * player._$scale + rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_MOVE;

        // execute
        player._$hitTest();

        Util.$event = {
            "pageX": rect.left,
            "pageY": rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_MOVE;

        // execute
        player._$hitTest();

        stringArray = [
            "stage rollOver mc2",
            "stage rollOver btn",
            "stage rollOver root1",
            "stage rollOver mc",
            "sprite2 rollOver mc",
            "sprite2 rollOut mc",
            "stage rollOver mc3",
            "sprite3 rollOver mc3",
            "stage rollOver mc",
            "sprite2 rollOver mc",
            "sprite2 rollOut mc"
        ];

        for (let i = 0; i < orderString.length; i++) {

            expect(orderString[i]).toBe(stringArray[i]);

        }

        player.stop();
    });

    it("mouse mouseChildren event case1", function()
    {
        let root = next2d.createRootMovieClip(640, 480, 1);
        root.name = "root1";
        const player = root.stage._$player;
        player._$stopFlag = false;

        let btn = root.addChild(new Sprite());
        btn.name = "btn";
        btn.x = 320;
        btn.y = 120;

        let sprite1 = btn.addChild(new Sprite());
        let sprite2 = btn.addChild(new Sprite());

        // sprite1
        sprite1.name = "mc2";
        sprite1.x = 50;
        sprite1.graphics.beginFill(0x00ff00, 1);
        sprite1.graphics.drawRect(0, 0, 70, 150);
        sprite1.graphics.endFill();

        // sprite2
        sprite2.name = "mc";

        let shape = sprite2.addChild(new Shape());
        shape.graphics.beginFill(0x000000, 1);
        shape.graphics.drawCircle(20, 20, 50);
        shape.graphics.endFill();

        let sprite3 = sprite2.addChild(new Sprite());
        sprite3.name = "mc3";
        sprite3.y = 30;
        sprite3.graphics.beginFill(0xff0000, 1);
        sprite3.graphics.drawCircle(0, 0, 30);
        sprite3.graphics.endFill();

        // reset
        let orderString = [];

        // add event
        sprite2.addEventListener(MouseEvent.ROLL_OVER, function (e)
        {
            orderString[orderString.length] = ["sprite2", MouseEvent.ROLL_OVER, e.target.name].join(" ");
            e.target.mouseChildren = false;
        });
        sprite3.addEventListener(MouseEvent.ROLL_OVER, function (e)
        {
            orderString[orderString.length] = ["sprite3", MouseEvent.ROLL_OVER, e.target.name].join(" ");
        });
        root.stage.addEventListener(MouseEvent.ROLL_OVER, function (e)
        {
            orderString[orderString.length] = ["stage", MouseEvent.ROLL_OVER, e.target.name].join(" ");
        }, true);
        sprite2.addEventListener(MouseEvent.ROLL_OUT, function (e)
        {
            orderString[orderString.length] = ["sprite2", MouseEvent.ROLL_OUT, e.target.name].join(" ");
        });

        const div = document.getElementById(player.contentElementId);
        const rect = div.getBoundingClientRect();
        Util.$event = {
            "pageX": 300 * player._$scale + rect.left,
            "pageY": 160 * player._$scale + rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_MOVE;

        // execute
        player._$hitTest();

        let stringArray = [
            "stage rollOver mc3",
            "sprite3 rollOver mc3",
            "stage rollOver mc",
            "sprite2 rollOver mc",
            "stage rollOver btn",
            "stage rollOver root1"
        ];
        for (let i = 0; i < orderString.length; i++) {

            expect(orderString[i]).toBe(stringArray[i]);

        }

        // reset
        orderString = [];

        Util.$event = {
            "pageX": rect.left,
            "pageY": rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_MOVE;

        // execute
        player._$hitTest();

        expect(orderString[0]).toBe("sprite2 rollOut mc");

        // reset
        orderString = [];

        Util.$event = {
            "pageX": 300 * player._$scale + rect.left,
            "pageY": 160 * player._$scale + rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_MOVE;

        // execute
        player._$hitTest();

        stringArray = [
            "stage rollOver mc",
            "sprite2 rollOver mc",
            "stage rollOver btn",
            "stage rollOver root1"
        ];
        for (let i = 0; i < orderString.length; i++) {

            expect(orderString[i]).toBe(stringArray[i]);

        }

        player.stop();
    });

    it("mouse mouseEnabled event case1", function()
    {
        let root = next2d.createRootMovieClip(640, 480, 1);
        root.name = "root1";
        const player = root.stage._$player;
        player._$stopFlag = false;

        let btn = root.addChild(new Sprite());
        btn.name = "btn";
        btn.x = 320;
        btn.y = 120;

        let sprite1 = btn.addChild(new Sprite());
        let sprite2 = btn.addChild(new Sprite());

        // sprite1
        sprite1.name = "mc2";
        sprite1.x = 50;
        sprite1.graphics.beginFill(0x00ff00, 1);
        sprite1.graphics.drawRect(0, 0, 70, 150);
        sprite1.graphics.endFill();

        // sprite2
        sprite2.name = "mc";

        let shape = sprite2.addChild(new Shape());
        shape.graphics.beginFill(0x000000, 1);
        shape.graphics.drawCircle(20, 20, 50);
        shape.graphics.endFill();

        let sprite3 = sprite2.addChild(new Sprite());
        sprite3.name = "mc3";
        sprite3.y = 30;
        sprite3.graphics.beginFill(0xff0000, 1);
        sprite3.graphics.drawCircle(0, 0, 30);
        sprite3.graphics.endFill();

        // reset
        let orderString = [];

        // add event
        sprite2.addEventListener(MouseEvent.ROLL_OVER, function (e)
        {
            orderString[orderString.length] = ["sprite2", MouseEvent.ROLL_OVER, e.target.name].join(" ");
        });
        sprite3.addEventListener(MouseEvent.ROLL_OVER, function (e)
        {
            orderString[orderString.length] = ["sprite3", MouseEvent.ROLL_OVER, e.target.name].join(" ");
            e.target.mouseEnabled = false;
        });
        root.stage.addEventListener(MouseEvent.ROLL_OVER, function (e)
        {
            orderString[orderString.length] = ["stage", MouseEvent.ROLL_OVER, e.target.name].join(" ");
        }, true);
        sprite2.addEventListener(MouseEvent.ROLL_OUT, function (e)
        {
            orderString[orderString.length] = ["sprite2", MouseEvent.ROLL_OUT, e.target.name].join(" ");
        });

        const div = document.getElementById(player.contentElementId);
        const rect = div.getBoundingClientRect();
        Util.$event = {
            "pageX": 300 * player._$scale + rect.left,
            "pageY": 160 * player._$scale + rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_MOVE;

        // execute
        player._$hitTest();

        let stringArray = [
            "stage rollOver mc3",
            "sprite3 rollOver mc3",
            "stage rollOver mc",
            "sprite2 rollOver mc",
            "stage rollOver btn",
            "stage rollOver root1"
        ];
        for (let i = 0; i < orderString.length; i++) {

            expect(orderString[i]).toBe(stringArray[i]);

        }

        // reset
        orderString = [];

        Util.$event = {
            "pageX": rect.left,
            "pageY": rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_MOVE;

        // execute
        player._$hitTest();

        expect(orderString[0]).toBe("sprite2 rollOut mc");

        // reset
        orderString = [];

        Util.$event = {
            "pageX": 300 * player._$scale + rect.left,
            "pageY": 160 * player._$scale + rect.top,
            "preventDefault": function () {}
        };
        Util.$eventType = Util.$MOUSE_MOVE;

        // execute
        player._$hitTest();

        stringArray = [
            "stage rollOver mc",
            "sprite2 rollOver mc",
            "stage rollOver btn",
            "stage rollOver root1"
        ];
        for (let i = 0; i < orderString.length; i++) {

            expect(orderString[i]).toBe(stringArray[i]);

        }

        player.stop();
    });

});
