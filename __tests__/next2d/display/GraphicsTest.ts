import { Graphics } from "../../../src/player/next2d/display/Graphics";

describe("Graphics.js toString test", () =>
{

    it("toString test", function ()
    {
        let g = new Graphics();
        expect(g.toString()).toBe("[object Graphics]");
    });

});

describe("Graphics.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(Graphics.toString()).toBe("[class Graphics]");
    });

});

describe("Graphics.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new Graphics();
        expect(object.namespace).toBe("next2d.display.Graphics");
    });

    it("namespace test static", () =>
    {
        expect(Graphics.namespace).toBe("next2d.display.Graphics");
    });

});

describe("Graphics.js beginFill test", () =>
{

    it("beginFill test case1", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x990000, 1);

        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);

        // @ts-ignore
        expect(g._$fillType).toBe(Graphics.FILL_STYLE);

    });

    it("beginFill test case2", function ()
    {
        let g = new Graphics();
        g.beginFill("red", 0.2);

        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);

        // @ts-ignore
        expect(g._$fillType).toBe(Graphics.FILL_STYLE);

    });

    it("beginFill test valid case1", function ()
    {
        let g = new Graphics();
        g.beginFill("red", 10);

        // beginPath
        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);

        // fill style
        // @ts-ignore
        expect(g._$fillType).toBe(Graphics.FILL_STYLE);

    });

    it("beginFill test valid case2", function ()
    {
        let g = new Graphics();
        g
            .beginFill("red", 10)
            .beginFill("green", 10);

        // beginPath
        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(1 in g._$fills).toBe(false);

    });

});

describe("Graphics.js moveTo test", () =>
{

    it("moveTo test success", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0x990000, 1)
            .moveTo(100, 60);

        // beginPath
        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(100);
        // @ts-ignore
        expect(g._$fills[3]).toBe(60);

    });

    it("moveTo test valid case1", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0x990000, 1)
            // @ts-ignore
            .moveTo("100", "60");

        // beginPath
        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(100);
        // @ts-ignore
        expect(g._$fills[3]).toBe(60);

    });

    it("moveTo test valid case1", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0x990000, 1)
            // @ts-ignore
            .moveTo("a", "b");

        // beginPath
        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(0);
        // @ts-ignore
        expect(g._$fills[3]).toBe(0);

    });

});

describe("Graphics.js lineTo test", () =>
{

    it("lineTo test success", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0x990000, 1)
            .lineTo(100, 60);

        // beginPath
        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(100);
        // @ts-ignore
        expect(g._$fills[3]).toBe(60);
    });

    it("lineTo test valid case1", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0x990000, 1)
            // @ts-ignore
            .lineTo("100", "60");

        // beginPath
        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(100);
        // @ts-ignore
        expect(g._$fills[3]).toBe(60);

    });

    it("lineTo test valid case2", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0x990000, 1)
            .moveTo(100, 100)
            // @ts-ignore
            .lineTo("a", "b");

        // beginPath
        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(100);
        // @ts-ignore
        expect(g._$fills[3]).toBe(100);
        // @ts-ignore
        expect(g._$fills[4]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$fills[5]).toBe(0);
        // @ts-ignore
        expect(g._$fills[6]).toBe(0);
    });

});

describe("Graphics.js endFill test", () =>
{

    it("endFill test success case1", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0xff0000, 1)
            .endFill();

        // fill style
        // @ts-ignore
        expect(g._$recode).toBe(null);
        // @ts-ignore
        expect(g._$fills).toBe(null);

    });

    it("endFill test success case2", function ()
    {
        let g = new Graphics();
        g
            .endFill();

        // @ts-ignore
        expect(g._$fills).toBe(null);
        // @ts-ignore
        expect(g._$recode).toBe(null);
    });

    it("drawRect test valid case3", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0xff0000, 1)
            .drawRect(10, 10, 100, 100)
            .endFill()
            .beginFill(0x00ff00, 1)
            .drawRect(120, 120, 100, 100)
            .endFill();

        if (!g._$recode) {
            throw new Error("Graphics non recode.");
        }

        // fill style
        expect(g._$recode[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$recode[1]).toBe(Graphics.MOVE_TO);
        expect(g._$recode[2]).toBe(10);
        expect(g._$recode[3]).toBe(10);
        expect(g._$recode[4]).toBe(Graphics.LINE_TO);
        expect(g._$recode[5]).toBe(10);
        expect(g._$recode[6]).toBe(110);
        expect(g._$recode[7]).toBe(Graphics.LINE_TO);
        expect(g._$recode[8]).toBe(110);
        expect(g._$recode[9]).toBe(110);
        expect(g._$recode[10]).toBe(Graphics.LINE_TO);
        expect(g._$recode[11]).toBe(110);
        expect(g._$recode[12]).toBe(10);
        expect(g._$recode[13]).toBe(Graphics.LINE_TO);
        expect(g._$recode[14]).toBe(10);
        expect(g._$recode[15]).toBe(10);
        expect(g._$recode[16]).toBe(Graphics.FILL_STYLE);
        expect(g._$recode[17]).toBe(255);
        expect(g._$recode[18]).toBe(0);
        expect(g._$recode[19]).toBe(0);
        expect(g._$recode[20]).toBe(255);
        expect(g._$recode[21]).toBe(Graphics.END_FILL);

        expect(g._$recode[22]).toBe(Graphics.BEGIN_PATH);
        expect(g._$recode[23]).toBe(Graphics.MOVE_TO);
        expect(g._$recode[24]).toBe(120);
        expect(g._$recode[25]).toBe(120);
        expect(g._$recode[26]).toBe(Graphics.LINE_TO);
        expect(g._$recode[27]).toBe(120);
        expect(g._$recode[28]).toBe(220);
        expect(g._$recode[29]).toBe(Graphics.LINE_TO);
        expect(g._$recode[30]).toBe(220);
        expect(g._$recode[31]).toBe(220);
        expect(g._$recode[32]).toBe(Graphics.LINE_TO);
        expect(g._$recode[33]).toBe(220);
        expect(g._$recode[34]).toBe(120);
        expect(g._$recode[35]).toBe(Graphics.LINE_TO);
        expect(g._$recode[36]).toBe(120);
        expect(g._$recode[37]).toBe(120);
        expect(g._$recode[38]).toBe(Graphics.FILL_STYLE);
        expect(g._$recode[39]).toBe(0);
        expect(g._$recode[40]).toBe(255);
        expect(g._$recode[41]).toBe(0);
        expect(g._$recode[42]).toBe(255);
        expect(g._$recode[43]).toBe(Graphics.END_FILL);

    });

});

describe("Graphics.js drawRect test", () =>
{

    it("drawRect test success", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0xff0000, 1)
            .drawRect(0, 1, 200, 300);

        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);

        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(0);
        // @ts-ignore
        expect(g._$fills[3]).toBe(1);

        // @ts-ignore
        expect(g._$fills[4]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$fills[5]).toBe(0);
        // @ts-ignore
        expect(g._$fills[6]).toBe(301);

        // @ts-ignore
        expect(g._$fills[7]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$fills[8]).toBe(200);
        // @ts-ignore
        expect(g._$fills[9]).toBe(301);

        // @ts-ignore
        expect(g._$fills[10]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$fills[11]).toBe(200);
        // @ts-ignore
        expect(g._$fills[12]).toBe(1);

        // @ts-ignore
        expect(g._$fills[13]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$fills[14]).toBe(0);
        // @ts-ignore
        expect(g._$fills[15]).toBe(1);
    });

    it("drawRect test valid case1", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0xff0000, 1)
            // @ts-ignore
            .drawRect("0", "1", "200", "300");

        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);

        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(0);
        // @ts-ignore
        expect(g._$fills[3]).toBe(1);

        // @ts-ignore
        expect(g._$fills[4]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$fills[5]).toBe(0);
        // @ts-ignore
        expect(g._$fills[6]).toBe(301);

        // @ts-ignore
        expect(g._$fills[7]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$fills[8]).toBe(200);
        // @ts-ignore
        expect(g._$fills[9]).toBe(301);

        // @ts-ignore
        expect(g._$fills[10]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$fills[11]).toBe(200);
        // @ts-ignore
        expect(g._$fills[12]).toBe(1);

        // @ts-ignore
        expect(g._$fills[13]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$fills[14]).toBe(0);
        // @ts-ignore
        expect(g._$fills[15]).toBe(1);
    });

    it("drawRect test valid case2", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0xff0000, 1)
            // @ts-ignore
            .drawRect("a", "b", "c", "d");

        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);

        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(0);
        // @ts-ignore
        expect(g._$fills[3]).toBe(0);
    });

});

describe("Graphics.js clear test", () =>
{

    it("clear test success", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0xff0000, 1)
            .drawRect(0, 1, 200, 300)
            .endFill();

        g.clear();

        // @ts-ignore
        expect(g._$fills).toBe(null);
        // @ts-ignore
        expect(g._$lines).toBe(null);
        // @ts-ignore
        expect(g._$doFill).toBe(false);
        // @ts-ignore
        expect(g._$doLine).toBe(false);

    });

});

describe("Graphics.js copyFrom test", () =>
{

    it("copyFrom test success", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0xff0000, 1)
            .drawRect(0, 1, 200, 300);

        let copy = new Graphics();
        copy.copyFrom(g);

        g.clear();
        // @ts-ignore
        expect(g._$fills).toBe(null);

        // @ts-ignore
        expect(copy._$fills[0]).toBe(Graphics.BEGIN_PATH);

        // @ts-ignore
        expect(copy._$fills[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(copy._$fills[2]).toBe(0);
        // @ts-ignore
        expect(copy._$fills[3]).toBe(1);

        // @ts-ignore
        expect(copy._$fills[4]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(copy._$fills[5]).toBe(0);
        // @ts-ignore
        expect(copy._$fills[6]).toBe(301);

        // @ts-ignore
        expect(copy._$fills[7]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(copy._$fills[8]).toBe(200);
        // @ts-ignore
        expect(copy._$fills[9]).toBe(301);

        // @ts-ignore
        expect(copy._$fills[10]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(copy._$fills[11]).toBe(200);
        // @ts-ignore
        expect(copy._$fills[12]).toBe(1);

        // @ts-ignore
        expect(copy._$fills[13]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(copy._$fills[14]).toBe(0);
        // @ts-ignore
        expect(copy._$fills[15]).toBe(1);

    });

});

describe("Graphics.js cubicCurveTo test", () =>
{

    it("cubicCurveTo test success", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            .cubicCurveTo(275, 0, 300, 25, 300, 50);

        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.CUBIC);
        // @ts-ignore
        expect(g._$fills[2]).toBe(275);
        // @ts-ignore
        expect(g._$fills[3]).toBe(0);
        // @ts-ignore
        expect(g._$fills[4]).toBe(300);
        // @ts-ignore
        expect(g._$fills[5]).toBe(25);
        // @ts-ignore
        expect(g._$fills[6]).toBe(300);
        // @ts-ignore
        expect(g._$fills[7]).toBe(50);

    });

    it("cubicCurveTo test valid case1", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            // @ts-ignore
            .cubicCurveTo("275", "0", "300", "25", "300", "50");

        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.CUBIC);
        // @ts-ignore
        expect(g._$fills[2]).toBe(275);
        // @ts-ignore
        expect(g._$fills[3]).toBe(0);
        // @ts-ignore
        expect(g._$fills[4]).toBe(300);
        // @ts-ignore
        expect(g._$fills[5]).toBe(25);
        // @ts-ignore
        expect(g._$fills[6]).toBe(300);
        // @ts-ignore
        expect(g._$fills[7]).toBe(50);

    });

    it("cubicCurveTo test valid case2", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            .moveTo(100, 100)
            // @ts-ignore
            .cubicCurveTo("a", "b", "c", "d", "e", "f");

        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(100);
        // @ts-ignore
        expect(g._$fills[3]).toBe(100);
        // @ts-ignore
        expect(g._$fills[4]).toBe(Graphics.CUBIC);
        // @ts-ignore
        expect(g._$fills[5]).toBe(0);
        // @ts-ignore
        expect(g._$fills[6]).toBe(0);
        // @ts-ignore
        expect(g._$fills[7]).toBe(0);
        // @ts-ignore
        expect(g._$fills[8]).toBe(0);
        // @ts-ignore
        expect(g._$fills[9]).toBe(0);
        // @ts-ignore
        expect(g._$fills[10]).toBe(0);

    });

});

describe("Graphics.js curveTo test", () =>
{

    it("curveTo test success", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            .curveTo(300, 100, 250, 100);

        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.CURVE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(300);
        // @ts-ignore
        expect(g._$fills[3]).toBe(100);
        // @ts-ignore
        expect(g._$fills[4]).toBe(250);
        // @ts-ignore
        expect(g._$fills[5]).toBe(100);

    });

    it("curveTo test valid case1", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            // @ts-ignore
            .curveTo("300", "100", "250", "100");
        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.CURVE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(300);
        // @ts-ignore
        expect(g._$fills[3]).toBe(100);
        // @ts-ignore
        expect(g._$fills[4]).toBe(250);
        // @ts-ignore
        expect(g._$fills[5]).toBe(100);

    });

    it("curveTo test valid case1", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            .moveTo(100, 100)
            // @ts-ignore
            .curveTo("a", "b", "c", "d");

        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(100);
        // @ts-ignore
        expect(g._$fills[3]).toBe(100);
        // @ts-ignore
        expect(g._$fills[4]).toBe(Graphics.CURVE_TO);
        // @ts-ignore
        expect(g._$fills[5]).toBe(0);
        // @ts-ignore
        expect(g._$fills[6]).toBe(0);
        // @ts-ignore
        expect(g._$fills[7]).toBe(0);
        // @ts-ignore
        expect(g._$fills[8]).toBe(0);

    });

});

describe("Graphics.js drawEllipse test", () =>
{

    it("drawEllipse test success", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            .drawEllipse(10, 10, 150, 200);

        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);

        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(85);
        // @ts-ignore
        expect(g._$fills[3]).toBe(10);

        // @ts-ignore
        expect(g._$fills[4]).toBe(Graphics.CUBIC);
        // @ts-ignore
        expect(g._$fills[5] | 0).toBe(126);
        // @ts-ignore
        expect(g._$fills[6]).toBe(10);
        // @ts-ignore
        expect(g._$fills[7]).toBe(160);
        // @ts-ignore
        expect(g._$fills[8] | 0).toBe(54);
        // @ts-ignore
        expect(g._$fills[9]).toBe(160);
        // @ts-ignore
        expect(g._$fills[10]).toBe(110);

        // @ts-ignore
        expect(g._$fills[11]).toBe(Graphics.CUBIC);
        // @ts-ignore
        expect(g._$fills[12]).toBe(160);
        // @ts-ignore
        expect(g._$fills[13] | 0).toBe(165);
        // @ts-ignore
        expect(g._$fills[14] | 0).toBe(126);
        // @ts-ignore
        expect(g._$fills[15]).toBe(210);
        // @ts-ignore
        expect(g._$fills[16]).toBe(85);
        // @ts-ignore
        expect(g._$fills[17]).toBe(210);

        // @ts-ignore
        expect(g._$fills[18]).toBe(Graphics.CUBIC);
        // @ts-ignore
        expect(g._$fills[19] | 0).toBe(43);
        // @ts-ignore
        expect(g._$fills[20]).toBe(210);
        // @ts-ignore
        expect(g._$fills[21]).toBe(10);
        // @ts-ignore
        expect(g._$fills[22] | 0).toBe(165);
        // @ts-ignore
        expect(g._$fills[23]).toBe(10);
        // @ts-ignore
        expect(g._$fills[24]).toBe(110);

        // @ts-ignore
        expect(g._$fills[25]).toBe(Graphics.CUBIC);
        // @ts-ignore
        expect(g._$fills[26]).toBe(10);
        // @ts-ignore
        expect(g._$fills[27] | 0).toBe(54);
        // @ts-ignore
        expect(g._$fills[28] | 0).toBe(43);
        // @ts-ignore
        expect(g._$fills[29]).toBe(10);
        // @ts-ignore
        expect(g._$fills[30]).toBe(85);
        // @ts-ignore
        expect(g._$fills[31]).toBe(10);
    });

});

describe("Graphics.js drawCircle test", () =>
{

    it("drawCircle test success", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            .drawCircle(120, 120, 50);

        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(170);
        // @ts-ignore
        expect(g._$fills[3]).toBe(120);
        // @ts-ignore
        expect(g._$fills[4]).toBe(Graphics.ARC);
        // @ts-ignore
        expect(g._$fills[5]).toBe(120);
        // @ts-ignore
        expect(g._$fills[6]).toBe(120);
        // @ts-ignore
        expect(g._$fills[7]).toBe(50);

    });

    it("drawCircle test success", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            // @ts-ignore
            .drawCircle("120", "120", "50");

        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(170);
        // @ts-ignore
        expect(g._$fills[3]).toBe(120);
        // @ts-ignore
        expect(g._$fills[4]).toBe(Graphics.ARC);
        // @ts-ignore
        expect(g._$fills[5]).toBe(120);
        // @ts-ignore
        expect(g._$fills[6]).toBe(120);
        // @ts-ignore
        expect(g._$fills[7]).toBe(50);

    });

    it("drawCircle test success", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            // @ts-ignore
            .drawCircle("a", "b", "c");

        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(0);
        // @ts-ignore
        expect(g._$fills[3]).toBe(0);
        // @ts-ignore
        expect(g._$fills[4]).toBe(Graphics.ARC);
        // @ts-ignore
        expect(g._$fills[5]).toBe(0);
        // @ts-ignore
        expect(g._$fills[6]).toBe(0);
        // @ts-ignore
        expect(g._$fills[7]).toBe(0);

    });

});

describe("Graphics.js drawRoundRect test", () =>
{

    it("drawRoundRect test success case1", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            .drawRoundRect(10, 10, 100, 100, 50, 50);

        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);

        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(35);
        // @ts-ignore
        expect(g._$fills[3]).toBe(10);

        // @ts-ignore
        expect(g._$fills[4]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$fills[5]).toBe(85);
        // @ts-ignore
        expect(g._$fills[6]).toBe(10);

        // @ts-ignore
        expect(g._$fills[7]).toBe(Graphics.CUBIC);
        // @ts-ignore
        expect(g._$fills[8] | 0).toBe(98);
        // @ts-ignore
        expect(g._$fills[9]).toBe(10);
        // @ts-ignore
        expect(g._$fills[10]).toBe(110);
        // @ts-ignore
        expect(g._$fills[11] | 0).toBe(21);
        // @ts-ignore
        expect(g._$fills[12]).toBe(110);
        // @ts-ignore
        expect(g._$fills[13]).toBe(35);

        // @ts-ignore
        expect(g._$fills[14]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$fills[15]).toBe(110);
        // @ts-ignore
        expect(g._$fills[16]).toBe(85);

        // @ts-ignore
        expect(g._$fills[17]).toBe(Graphics.CUBIC);
        // @ts-ignore
        expect(g._$fills[18]).toBe(110);
        // @ts-ignore
        expect(g._$fills[19] | 0).toBe(98);
        // @ts-ignore
        expect(g._$fills[20] | 0).toBe(98);
        // @ts-ignore
        expect(g._$fills[21]).toBe(110);
        // @ts-ignore
        expect(g._$fills[22]).toBe(85);
        // @ts-ignore
        expect(g._$fills[23]).toBe(110);

        // @ts-ignore
        expect(g._$fills[24]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$fills[25]).toBe(35);
        // @ts-ignore
        expect(g._$fills[26]).toBe(110);

        // @ts-ignore
        expect(g._$fills[27]).toBe(Graphics.CUBIC);
        // @ts-ignore
        expect(g._$fills[28] | 0).toBe(21);
        // @ts-ignore
        expect(g._$fills[29]).toBe(110);
        // @ts-ignore
        expect(g._$fills[30]).toBe(10);
        // @ts-ignore
        expect(g._$fills[31] | 0).toBe(98);
        // @ts-ignore
        expect(g._$fills[32]).toBe(10);
        // @ts-ignore
        expect(g._$fills[33]).toBe(85);

        // @ts-ignore
        expect(g._$fills[34]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$fills[35]).toBe(10);
        // @ts-ignore
        expect(g._$fills[36]).toBe(35);

        // @ts-ignore
        expect(g._$fills[37]).toBe(Graphics.CUBIC);
        // @ts-ignore
        expect(g._$fills[38]).toBe(10);
        // @ts-ignore
        expect(g._$fills[39] | 0).toBe(21);
        // @ts-ignore
        expect(g._$fills[40] | 0).toBe(21);
        // @ts-ignore
        expect(g._$fills[41]).toBe(10);
        // @ts-ignore
        expect(g._$fills[42]).toBe(35);
        // @ts-ignore
        expect(g._$fills[43]).toBe(10);
    });

});

describe("Graphics.js lineStyle test", () =>
{

    it("lineStyle test success case1", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0xff0000, 1.0)
            .moveTo(20.0 , 20.0)
            .lineTo(120.0 ,  20.0)
            .lineStyle(10, 0x00ff00, 1.0, "none", "miter", 1)
            .lineTo(120.0 ,  120.0 );

        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(20);
        // @ts-ignore
        expect(g._$fills[3]).toBe(20);
        // @ts-ignore
        expect(g._$fills[4]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$fills[5]).toBe(120);
        // @ts-ignore
        expect(g._$fills[6]).toBe(20);
        // @ts-ignore
        expect(g._$fills[7]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$fills[8]).toBe(120);
        // @ts-ignore
        expect(g._$fills[9]).toBe(120);

        // @ts-ignore
        expect(g._$lineType).toBe(Graphics.STROKE_STYLE);
        // @ts-ignore
        expect(g._$lineWidth).toBe(10);
        // @ts-ignore
        expect(g._$caps).toBe("none");
        // @ts-ignore
        expect(g._$joints).toBe("miter");
        // @ts-ignore
        expect(g._$miterLimit).toBe(1);

        // @ts-ignore
        expect(g._$lines[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$lines[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$lines[2]).toBe(120);
        // @ts-ignore
        expect(g._$lines[3]).toBe(20);
        // @ts-ignore
        expect(g._$lines[4]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$lines[5]).toBe(120);
        // @ts-ignore
        expect(g._$lines[6]).toBe(120);

        g
            .endLine()
            .lineTo(20.0 ,  120.0 );

        // @ts-ignore
        expect(g._$lineWidth).toBe(0);
        // @ts-ignore
        expect(g._$lines).toBe(null);

        g
            // @ts-ignore
            .lineStyle(20, 0x0000ff, 0.5, false, "normal", "none", 255)
            .lineTo(20.0 ,  20.0 )
            .endFill();

        // lines
        // @ts-ignore
        expect(g._$lineWidth).toBe(20);
        // @ts-ignore
        expect(g._$lines[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$lines[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$lines[2]).toBe(20);
        // @ts-ignore
        expect(g._$lines[3]).toBe(120);
        // @ts-ignore
        expect(g._$lines[4]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$lines[5]).toBe(20);
        // @ts-ignore
        expect(g._$lines[6]).toBe(20);

    });

    it("lineStyle test success case2", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0xff0000, 1.0)
            .moveTo(20.0 , 20.0)
            .lineTo(120.0 ,  20.0 )
            .lineStyle(10, 0x00ff00, 1.0, "none", "miter", 1)
            .lineTo(120.0 ,  120.0 );

        // @ts-ignore
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$fills[2]).toBe(20);
        // @ts-ignore
        expect(g._$fills[3]).toBe(20);
        // @ts-ignore
        expect(g._$fills[4]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$fills[5]).toBe(120);
        // @ts-ignore
        expect(g._$fills[6]).toBe(20);
        // @ts-ignore
        expect(g._$fills[7]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$fills[8]).toBe(120);
        // @ts-ignore
        expect(g._$fills[9]).toBe(120);

        // @ts-ignore
        expect(g._$lineType).toBe(Graphics.STROKE_STYLE);
        // @ts-ignore
        expect(g._$lineWidth).toBe(10);
        // @ts-ignore
        expect(g._$caps).toBe("none");
        // @ts-ignore
        expect(g._$joints).toBe("miter");
        // @ts-ignore
        expect(g._$miterLimit).toBe(1);

        // @ts-ignore
        expect(g._$lines[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$lines[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$lines[2]).toBe(120);
        // @ts-ignore
        expect(g._$lines[3]).toBe(20);
        // @ts-ignore
        expect(g._$lines[4]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$lines[5]).toBe(120);
        // @ts-ignore
        expect(g._$lines[6]).toBe(120);

        g
            .lineStyle(20, 0x0000ff, 0.5, "none", "bevel", 255)
            .lineTo(20.0 ,  120.0 )
            .lineTo(20.0 ,  20.0 ) // <= logic test
            .endFill();

        // line width
        // @ts-ignore
        expect(g._$lineWidth).toBe(20);

        // @ts-ignore
        expect(g._$lines[0]).toBe(Graphics.BEGIN_PATH);
        // @ts-ignore
        expect(g._$lines[1]).toBe(Graphics.MOVE_TO);
        // @ts-ignore
        expect(g._$lines[2]).toBe(120);
        // @ts-ignore
        expect(g._$lines[3]).toBe(120);
        // @ts-ignore
        expect(g._$lines[4]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$lines[5]).toBe(20);
        // @ts-ignore
        expect(g._$lines[6]).toBe(120);
        // @ts-ignore
        expect(g._$lines[7]).toBe(Graphics.LINE_TO);
        // @ts-ignore
        expect(g._$lines[8]).toBe(20);
        // @ts-ignore
        expect(g._$lines[9]).toBe(20);
    });

});