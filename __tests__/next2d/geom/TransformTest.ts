import { Transform } from "../../../packages/geom/src/Transform";
import { MovieClip } from "../../../packages/display/src/MovieClip";
import { Sprite } from "../../../packages/display/src/Sprite";
import { ColorTransform } from "../../../packages/geom/src/ColorTransform";
import { Shape } from "@next2d/display";

describe("Transform.js toString test", () =>
{
    it("toString test success", () =>
    {
        let transform = new Transform(new Sprite());
        expect(transform.toString()).toBe("[object Transform]");
    });

});

describe("Transform.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(Transform.toString()).toBe("[class Transform]");
    });

});

describe("Transform.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new Transform(new Sprite());
        expect(object.namespace).toBe("next2d.geom.Transform");
    });

    it("namespace test static", () =>
    {
        expect(Transform.namespace).toBe("next2d.geom.Transform");
    });

});

describe("Transform.js matrix test", () =>
{

    it("matrix test1", () =>
    {
        let mc = new MovieClip();

        let matrix = mc.transform.matrix;
        expect(matrix.toString()).toBe("(a=1, b=0, c=0, d=1, tx=0, ty=0)");
    });

});

describe("colorTransform.js Transform test", () =>
{

    it("colorTransform test1", () =>
    {
        let mc = new MovieClip();

        let colorTransform = mc.transform.colorTransform;
        expect(colorTransform.toString()).toBe(
            "(redMultiplier=1, greenMultiplier=1, blueMultiplier=1, alphaMultiplier=1, redOffset=0, greenOffset=0, blueOffset=0, alphaOffset=0)"
        );
    });

});

describe("Transform.js concatenatedMatrix test", () =>
{
    it("concatenatedMatrix on stage test", () =>
    {

        let root = new MovieClip();

        let mc = new MovieClip();
        mc.y = 100;
        root.addChild(mc);

        let shape = mc.addChild(new Shape());
        shape
            .graphics
            .beginFill(0xff0000, 1)
            .drawRect(100, 100, 100, 100);

        shape.x = 100;
        shape.rotation = 45;

        expect(shape.transform.concatenatedMatrix.toString()).toBe(
            "(a=0.7071067690849304, b=0.7071067690849304, c=-0.7071067690849304, d=0.7071067690849304, tx=100, ty=100)"
        );
    });

});

describe("Transform.js concatenatedTransform test", () =>
{

    it("concatenatedTransform test", () =>
    {
        let root = new Sprite();
        root.transform.colorTransform = new ColorTransform(1,1,1,1,0,200,0,0);

        let shape = new Shape();
        shape.graphics.beginFill(0xff0000, 1);
        shape.graphics.drawRect(100, 100, 100, 100);
        root.addChild(shape);

        shape.x = 100;
        shape.rotation = 45;

        expect(shape.transform.concatenatedColorTransform.toString()).toBe(
            "(redMultiplier=1, greenMultiplier=1, blueMultiplier=1, alphaMultiplier=1, redOffset=0, greenOffset=200, blueOffset=0, alphaOffset=0)"
        );
    });

});
