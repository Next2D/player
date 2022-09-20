
describe("Transform.js toString test", function()
{
    it("toString test success", function()
    {
        let transform = new Transform(new DisplayObject());
        expect(transform.toString()).toBe("[object Transform]");
    });

});

describe("Transform.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(Transform.toString()).toBe("[class Transform]");
    });

});

describe("Transform.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new Transform(new DisplayObject());
        expect(object.namespace).toBe("next2d.geom.Transform");
    });

    it("namespace test static", function()
    {
        expect(Transform.namespace).toBe("next2d.geom.Transform");
    });

});

describe("Transform.js matrix test", function()
{

    it("matrix test1", function()
    {
        let mc = new MovieClip();

        let matrix = mc.transform.matrix;
        expect(matrix.toString()).toBe("(a=1, b=0, c=0, d=1, tx=0, ty=0)");
    });

    it("matrix test2", function()
    {
        let mc = new MovieClip();

        let matrix = mc.transform.matrix;
        matrix.a = null;
        matrix.b = null;
        matrix.c = null;
        matrix.d = null;
        matrix.tx = null;
        matrix.ty = null;
        expect(matrix.toString()).toBe("(a=0, b=0, c=0, d=0, tx=0, ty=0)");
    });

    it("matrix test3", function()
    {
        let mc = new MovieClip();

        let matrix = mc.transform.matrix;
        matrix.a = undefined;
        matrix.b = undefined;
        matrix.c = undefined;
        matrix.d = undefined;
        matrix.tx = undefined;
        matrix.ty = undefined;
        expect(matrix.toString()).toBe("(a=0, b=0, c=0, d=0, tx=0, ty=0)");
    });

    it("matrix test4", function()
    {
        let mc = new MovieClip();

        let matrix = mc.transform.matrix;
        matrix.a = true;
        matrix.b = true;
        matrix.c = true;
        matrix.d = true;
        matrix.tx = true;
        matrix.ty = true;
        expect(matrix.toString()).toBe("(a=1, b=1, c=1, d=1, tx=1, ty=1)");
    });

    it("matrix test5", function()
    {
        let mc = new MovieClip();

        let matrix = mc.transform.matrix;
        matrix.a = "";
        matrix.b = "";
        matrix.c = "";
        matrix.d = "";
        matrix.tx = "";
        matrix.ty = "";
        expect(matrix.toString()).toBe("(a=0, b=0, c=0, d=0, tx=0, ty=0)");
    });

    it("matrix test6", function()
    {
        let mc = new MovieClip();

        let matrix = mc.transform.matrix;
        matrix.a = "abc";
        matrix.b = "abc";
        matrix.c = "abc";
        matrix.d = "abc";
        matrix.tx = "abc";
        matrix.ty = "abc";
        expect(matrix.toString()).toBe("(a=0, b=0, c=0, d=0, tx=0, ty=0)");
    });

    it("matrix test7", function()
    {
        let mc = new MovieClip();

        let matrix = mc.transform.matrix;
        matrix.a = 0;
        matrix.b = 0;
        matrix.c = 0;
        matrix.d = 0;
        matrix.tx = 0;
        matrix.ty = 0;
        expect(matrix.toString()).toBe("(a=0, b=0, c=0, d=0, tx=0, ty=0)");
    });

    it("matrix test8", function()
    {
        let mc = new MovieClip();

        let matrix = mc.transform.matrix;
        matrix.a = 1;
        matrix.b = 1;
        matrix.c = 1;
        matrix.d = 1;
        matrix.tx = 1;
        matrix.ty = 1;
        expect(matrix.toString()).toBe("(a=1, b=1, c=1, d=1, tx=1, ty=1)");
    });

    it("matrix test9", function()
    {
        let mc = new MovieClip();

        let matrix = mc.transform.matrix;
        matrix.a = -1;
        matrix.b = -1;
        matrix.c = -1;
        matrix.d = -1;
        matrix.tx = -1;
        matrix.ty = -1;
        expect(matrix.toString()).toBe("(a=-1, b=-1, c=-1, d=-1, tx=-1, ty=-1)");
    });

    it("matrix test10", function()
    {
        let mc = new MovieClip();

        let matrix = mc.transform.matrix;
        matrix.a = { "a":0 };
        matrix.b = { "a":0 };
        matrix.c = { "a":0 };
        matrix.d = { "a":0 };
        matrix.tx = { "a":0 };
        matrix.ty = { "a":0 };
        expect(matrix.toString()).toBe("(a=0, b=0, c=0, d=0, tx=0, ty=0)");
    });

    it("matrix test11", function()
    {
        let mc = new MovieClip();

        let matrix = mc.transform.matrix;
        matrix.a = function a() {};
        matrix.b = function a() {};
        matrix.c = function a() {};
        matrix.d = function a() {};
        matrix.tx = function a() {};
        matrix.ty = function a() {};
        expect(matrix.toString()).toBe("(a=0, b=0, c=0, d=0, tx=0, ty=0)");
    });

    it("matrix test12", function()
    {
        let mc = new MovieClip();

        let matrix = mc.transform.matrix;
        matrix.a = [1];
        matrix.b = [1];
        matrix.c = [1];
        matrix.d = [1];
        matrix.tx = [1];
        matrix.ty = [1];
        expect(matrix.toString()).toBe("(a=1, b=1, c=1, d=1, tx=1, ty=1)");
    });

    it("matrix test13", function()
    {
        let mc = new MovieClip();

        let matrix = mc.transform.matrix;
        matrix.a = [1,2];
        matrix.b = [1,2];
        matrix.c = [1,2];
        matrix.d = [1,2];
        matrix.tx = [1,2];
        matrix.ty = [1,2];
        expect(matrix.toString()).toBe("(a=0, b=0, c=0, d=0, tx=0, ty=0)");
    });

    it("matrix test14", function()
    {
        let mc = new MovieClip();

        let matrix = mc.transform.matrix;
        matrix.a = {};
        matrix.b = {};
        matrix.c = {};
        matrix.d = {};
        matrix.tx = {};
        matrix.ty = {};
        expect(matrix.toString()).toBe("(a=0, b=0, c=0, d=0, tx=0, ty=0)");
    });

    it("matrix test15", function()
    {
        let mc = new MovieClip();

        let matrix = mc.transform.matrix;
        matrix.a = { "toString":function () { return 1 } };
        matrix.b = { "toString":function () { return 1 } };
        matrix.c = { "toString":function () { return 1 } };
        matrix.d = { "toString":function () { return 1 } };
        matrix.tx = { "toString":function () { return 1 } };
        matrix.ty = { "toString":function () { return 1 } };
        expect(matrix.toString()).toBe("(a=1, b=1, c=1, d=1, tx=1, ty=1)");
    });

    it("matrix test16", function()
    {
        let mc = new MovieClip();

        let matrix = mc.transform.matrix;
        matrix.a = { "toString":function () { return "1" } };
        matrix.b = { "toString":function () { return "1" } };
        matrix.c = { "toString":function () { return "1" } };
        matrix.d = { "toString":function () { return "1" } };
        matrix.tx = { "toString":function () { return "1" } };
        matrix.ty = { "toString":function () { return "1" } };
        expect(matrix.toString()).toBe("(a=1, b=1, c=1, d=1, tx=1, ty=1)");
    });

    it("matrix test17", function()
    {
        let mc = new MovieClip();

        let matrix = mc.transform.matrix;
        matrix.a = { "toString":function () { return "1a" } };
        matrix.b = { "toString":function () { return "1a" } };
        matrix.c = { "toString":function () { return "1a" } };
        matrix.d = { "toString":function () { return "1a" } };
        matrix.tx = { "toString":function () { return "1a" } };
        matrix.ty = { "toString":function () { return "1a" } };
        expect(matrix.toString()).toBe("(a=0, b=0, c=0, d=0, tx=0, ty=0)");
    });

});

describe("colorTransform.js Transform test", function()
{

    it("colorTransform test1", function()
    {
        let mc = new MovieClip();

        let colorTransform = mc.transform.colorTransform;
        expect(colorTransform.toString()).toBe(
            "(redMultiplier=1, greenMultiplier=1, blueMultiplier=1, alphaMultiplier=1, redOffset=0, greenOffset=0, blueOffset=0, alphaOffset=0)"
        );
    });

    it("colorTransform test2", function()
    {
        let mc = new MovieClip();

        let colorTransform = mc.transform.colorTransform;
        colorTransform.redMultiplier = null;
        colorTransform.greenMultiplier = null;
        colorTransform.blueMultiplier = null;
        colorTransform.alphaMultiplier = null;
        colorTransform.redOffset = null;
        colorTransform.greenOffset = null;
        colorTransform.blueOffset = null;
        colorTransform.alphaOffset = null;
        expect(colorTransform.toString()).toBe(
            "(redMultiplier=0, greenMultiplier=0, blueMultiplier=0, alphaMultiplier=0, redOffset=0, greenOffset=0, blueOffset=0, alphaOffset=0)"
        );
    });

    it("colorTransform test3", function()
    {
        let mc = new MovieClip();

        let colorTransform = mc.transform.colorTransform;
        colorTransform.redMultiplier = undefined;
        colorTransform.greenMultiplier = undefined;
        colorTransform.blueMultiplier = undefined;
        colorTransform.alphaMultiplier = undefined;
        colorTransform.redOffset = undefined;
        colorTransform.greenOffset = undefined;
        colorTransform.blueOffset = undefined;
        colorTransform.alphaOffset = undefined;
        expect(colorTransform.toString()).toBe(
            "(redMultiplier=0, greenMultiplier=0, blueMultiplier=0, alphaMultiplier=0, redOffset=0, greenOffset=0, blueOffset=0, alphaOffset=0)"
        );
    });

    it("colorTransform test4", function()
    {
        let mc = new MovieClip();

        let colorTransform = mc.transform.colorTransform;
        colorTransform.redMultiplier = true;
        colorTransform.greenMultiplier = true;
        colorTransform.blueMultiplier = true;
        colorTransform.alphaMultiplier = true;
        colorTransform.redOffset = true;
        colorTransform.greenOffset = true;
        colorTransform.blueOffset = true;
        colorTransform.alphaOffset = true;
        expect(colorTransform.toString()).toBe(
            "(redMultiplier=1, greenMultiplier=1, blueMultiplier=1, alphaMultiplier=1, redOffset=1, greenOffset=1, blueOffset=1, alphaOffset=1)"
        );
    });

    it("colorTransform test5", function()
    {
        let mc = new MovieClip();

        let colorTransform = mc.transform.colorTransform;
        colorTransform.redMultiplier = "";
        colorTransform.greenMultiplier = "";
        colorTransform.blueMultiplier = "";
        colorTransform.alphaMultiplier = "";
        colorTransform.redOffset = "";
        colorTransform.greenOffset = "";
        colorTransform.blueOffset = "";
        colorTransform.alphaOffset = "";
        expect(colorTransform.toString()).toBe(
            "(redMultiplier=0, greenMultiplier=0, blueMultiplier=0, alphaMultiplier=0, redOffset=0, greenOffset=0, blueOffset=0, alphaOffset=0)"
        );
    });

    it("colorTransform test6", function()
    {
        let mc = new MovieClip();

        let colorTransform = mc.transform.colorTransform;
        colorTransform.redMultiplier = "abc";
        colorTransform.greenMultiplier = "abc";
        colorTransform.blueMultiplier = "abc";
        colorTransform.alphaMultiplier = "abc";
        colorTransform.redOffset = "abc";
        colorTransform.greenOffset = "abc";
        colorTransform.blueOffset = "abc";
        colorTransform.alphaOffset = "abc";
        expect(colorTransform.toString()).toBe(
            "(redMultiplier=0, greenMultiplier=0, blueMultiplier=0, alphaMultiplier=0, redOffset=0, greenOffset=0, blueOffset=0, alphaOffset=0)"
        );
    });

    it("colorTransform test7", function()
    {
        let mc = new MovieClip();

        let colorTransform = mc.transform.colorTransform;
        colorTransform.redMultiplier = 0;
        colorTransform.greenMultiplier = 0;
        colorTransform.blueMultiplier = 0;
        colorTransform.alphaMultiplier = 0;
        colorTransform.redOffset = 0;
        colorTransform.greenOffset = 0;
        colorTransform.blueOffset = 0;
        colorTransform.alphaOffset = 0;
        expect(colorTransform.toString()).toBe(
            "(redMultiplier=0, greenMultiplier=0, blueMultiplier=0, alphaMultiplier=0, redOffset=0, greenOffset=0, blueOffset=0, alphaOffset=0)"
        );
    });

    it("colorTransform test8", function()
    {
        let mc = new MovieClip();

        let colorTransform = mc.transform.colorTransform;
        colorTransform.redMultiplier = 1;
        colorTransform.greenMultiplier = 1;
        colorTransform.blueMultiplier = 1;
        colorTransform.alphaMultiplier = 1;
        colorTransform.redOffset = 1;
        colorTransform.greenOffset = 1;
        colorTransform.blueOffset = 1;
        colorTransform.alphaOffset = 1;
        expect(colorTransform.toString()).toBe(
            "(redMultiplier=1, greenMultiplier=1, blueMultiplier=1, alphaMultiplier=1, redOffset=1, greenOffset=1, blueOffset=1, alphaOffset=1)"
        );
    });

    it("colorTransform test9", function()
    {
        let mc = new MovieClip();

        let colorTransform = mc.transform.colorTransform;
        colorTransform.redMultiplier = -1;
        colorTransform.greenMultiplier = -1;
        colorTransform.blueMultiplier = -1;
        colorTransform.alphaMultiplier = -1;
        colorTransform.redOffset = -1;
        colorTransform.greenOffset = -1;
        colorTransform.blueOffset = -1;
        colorTransform.alphaOffset = -1;
        expect(colorTransform.toString()).toBe(
            "(redMultiplier=0, greenMultiplier=0, blueMultiplier=0, alphaMultiplier=0, redOffset=-1, greenOffset=-1, blueOffset=-1, alphaOffset=-1)"
        );
    });

    it("colorTransform test10", function()
    {
        let mc = new MovieClip();

        let colorTransform = mc.transform.colorTransform;
        colorTransform.redMultiplier = { "a":0 };
        colorTransform.greenMultiplier = { "a":0 };
        colorTransform.blueMultiplier = { "a":0 };
        colorTransform.alphaMultiplier = { "a":0 };
        colorTransform.redOffset = { "a":0 };
        colorTransform.greenOffset = { "a":0 };
        colorTransform.blueOffset = { "a":0 };
        colorTransform.alphaOffset = { "a":0 };
        expect(colorTransform.toString()).toBe(
            "(redMultiplier=0, greenMultiplier=0, blueMultiplier=0, alphaMultiplier=0, redOffset=0, greenOffset=0, blueOffset=0, alphaOffset=0)"
        );
    });

    it("colorTransform test11", function()
    {
        let mc = new MovieClip();

        let colorTransform = mc.transform.colorTransform;
        colorTransform.redMultiplier = function a() {};
        colorTransform.greenMultiplier = function a() {};
        colorTransform.blueMultiplier = function a() {};
        colorTransform.alphaMultiplier = function a() {};
        colorTransform.redOffset = function a() {};
        colorTransform.greenOffset = function a() {};
        colorTransform.blueOffset = function a() {};
        colorTransform.alphaOffset = function a() {};
        expect(colorTransform.toString()).toBe(
            "(redMultiplier=0, greenMultiplier=0, blueMultiplier=0, alphaMultiplier=0, redOffset=0, greenOffset=0, blueOffset=0, alphaOffset=0)"
        );
    });

});

describe("Transform.js concatenatedMatrix test", function()
{

    beforeEach(function() {
        window.next2d = new Next2D();
        window.next2d._$player.stop();
    });

    it("concatenatedMatrix on stage test", function()
    {

        let root = next2d.createRootMovieClip(640, 480, 1);

        let mc = new MovieClip();
        mc.y = 100;
        root.addChild(mc);

        let sprite = mc.addChild(new Sprite());
        sprite
            .graphics
            .beginFill(0xff0000, 1)
            .drawRect(100, 100, 100, 100);

        sprite.x = 100;
        sprite.rotation = 45;

        expect(sprite.transform.concatenatedMatrix.toString()).toBe(
            "(a=0.7071067690849304, b=0.7071067690849304, c=-0.7071067690849304, d=0.7071067690849304, tx=100, ty=100)"
        );

        next2d._$player.stop();
    });

});

describe("Transform.js concatenatedTransform test", function()
{

    beforeEach(function() {
        window.next2d = new Next2D();
        window.next2d._$player.stop();
    });

    it("concatenatedTransform test", function()
    {
        let root = next2d.createRootMovieClip(640, 480, 1);
        root.transform.colorTransform = new ColorTransform(1,1,1,1,0,200,0,0);

        let sprite = new Sprite();
        sprite.graphics.beginFill(0xff0000, 1);
        sprite.graphics.drawRect(100, 100, 100, 100);
        root.addChild(sprite);

        sprite.x = 100;
        sprite.rotation = 45;

        expect(sprite.transform.concatenatedColorTransform.toString()).toBe(
            "(redMultiplier=1, greenMultiplier=1, blueMultiplier=1, alphaMultiplier=1, redOffset=0, greenOffset=200, blueOffset=0, alphaOffset=0)"
        );

        next2d._$player.stop();
    });

});
