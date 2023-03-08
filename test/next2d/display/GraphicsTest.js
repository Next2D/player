
describe("Graphics.js toString test", function()
{

    it("toString test", function ()
    {
        let g = new Graphics();
        expect(g.toString()).toBe("[object Graphics]");
    });

});

describe("Graphics.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(Graphics.toString()).toBe("[class Graphics]");
    });

});

describe("Graphics.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new Graphics();
        expect(object.namespace).toBe("next2d.display.Graphics");
    });

    it("namespace test static", function()
    {
        expect(Graphics.namespace).toBe("next2d.display.Graphics");
    });

});

describe("Graphics.js beginFill test", function()
{

    it("beginFill test case1", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x990000, 1);

        // beginPath
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);

        // fill style
        expect(g._$fillType).toBe(Graphics.FILL_STYLE);

    });

    it("beginFill test case2", function ()
    {
        let g = new Graphics();
        g.beginFill("red", 0.2);

        // beginPath
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);

        // fill style
        expect(g._$fillType).toBe(Graphics.FILL_STYLE);

    });

    it("beginFill test valid case1", function ()
    {
        let g = new Graphics();
        g.beginFill("red", 10);

        // beginPath
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);

        // fill style
        expect(g._$fillType).toBe(Graphics.FILL_STYLE);

    });

    it("beginFill test valid case2", function ()
    {
        let g = new Graphics();
        g
            .beginFill("red", 10)
            .beginFill("green", 10);

        // beginPath
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        expect(1 in g._$fills).toBe(false);

    });

});

describe("Graphics.js moveTo test", function()
{

    it("moveTo test success", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0x990000, 1)
            .moveTo(100, 60);

        // beginPath
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        expect(g._$fills[2]).toBe(100);
        expect(g._$fills[3]).toBe(60);

    });

    it("moveTo test valid case1", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0x990000, 1)
            .moveTo("100", "60");

        // beginPath
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        expect(g._$fills[2]).toBe(100);
        expect(g._$fills[3]).toBe(60);

    });

    it("moveTo test valid case1", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0x990000, 1)
            .moveTo("a", "b");

        // beginPath
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        expect(g._$fills[2]).toBe(0);
        expect(g._$fills[3]).toBe(0);

    });

});

describe("Graphics.js lineTo test", function()
{

    it("lineTo test success", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0x990000, 1)
            .lineTo(100, 60);

        // beginPath
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$fills[1]).toBe(Graphics.LINE_TO);
        expect(g._$fills[2]).toBe(100);
        expect(g._$fills[3]).toBe(60);
    });

    it("lineTo test valid case1", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0x990000, 1)
            .lineTo("100", "60");

        // beginPath
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$fills[1]).toBe(Graphics.LINE_TO);
        expect(g._$fills[2]).toBe(100);
        expect(g._$fills[3]).toBe(60);

    });

    it("lineTo test valid case2", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0x990000, 1)
            .moveTo(100, 100)
            .lineTo("a", "b");

        // beginPath
        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        expect(g._$fills[2]).toBe(100);
        expect(g._$fills[3]).toBe(100);
        expect(g._$fills[4]).toBe(Graphics.LINE_TO);
        expect(g._$fills[5]).toBe(0);
        expect(g._$fills[6]).toBe(0);
    });

});

describe("Graphics.js endFill test", function()
{

    it("endFill test success case1", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0xff0000, 1)
            .endFill();

        // fill style
        expect(g._$recode).toBe(null);
        expect(g._$fills).toBe(null);

    });

    it("endFill test success case2", function ()
    {
        let g = new Graphics();
        g
            .endFill();

        expect(g._$fills).toBe(null);
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

describe("Graphics.js drawRect test", function()
{

    it("drawRect test success", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0xff0000, 1)
            .drawRect(0, 1, 200, 300);

        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);

        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        expect(g._$fills[2]).toBe(0);
        expect(g._$fills[3]).toBe(1);

        expect(g._$fills[4]).toBe(Graphics.LINE_TO);
        expect(g._$fills[5]).toBe(0);
        expect(g._$fills[6]).toBe(301);

        expect(g._$fills[7]).toBe(Graphics.LINE_TO);
        expect(g._$fills[8]).toBe(200);
        expect(g._$fills[9]).toBe(301);

        expect(g._$fills[10]).toBe(Graphics.LINE_TO);
        expect(g._$fills[11]).toBe(200);
        expect(g._$fills[12]).toBe(1);

        expect(g._$fills[13]).toBe(Graphics.LINE_TO);
        expect(g._$fills[14]).toBe(0);
        expect(g._$fills[15]).toBe(1);
    });

    it("drawRect test valid case1", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0xff0000, 1)
            .drawRect("0", "1", "200", "300");

        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);

        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        expect(g._$fills[2]).toBe(0);
        expect(g._$fills[3]).toBe(1);

        expect(g._$fills[4]).toBe(Graphics.LINE_TO);
        expect(g._$fills[5]).toBe(0);
        expect(g._$fills[6]).toBe(301);

        expect(g._$fills[7]).toBe(Graphics.LINE_TO);
        expect(g._$fills[8]).toBe(200);
        expect(g._$fills[9]).toBe(301);

        expect(g._$fills[10]).toBe(Graphics.LINE_TO);
        expect(g._$fills[11]).toBe(200);
        expect(g._$fills[12]).toBe(1);

        expect(g._$fills[13]).toBe(Graphics.LINE_TO);
        expect(g._$fills[14]).toBe(0);
        expect(g._$fills[15]).toBe(1);
    });

    it("drawRect test valid case2", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0xff0000, 1)
            .drawRect("a", "b", "c", "d");

        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);

        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        expect(g._$fills[2]).toBe(0);
        expect(g._$fills[3]).toBe(0);
    });

});

describe("Graphics.js clear test", function()
{

    it("clear test success", function ()
    {
        let g = new Graphics();
        g
            .beginFill(0xff0000, 1)
            .drawRect(0, 1, 200, 300)
            .endFill();

        g.clear();

        expect(g._$fills).toBe(null);
        expect(g._$lines).toBe(null);
        expect(g._$doFill).toBe(false);
        expect(g._$doLine).toBe(false);

    });

});

describe("Graphics.js copyFrom test", function()
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
        expect(g._$fills).toBe(null);

        expect(copy._$fills[0]).toBe(Graphics.BEGIN_PATH);

        expect(copy._$fills[1]).toBe(Graphics.MOVE_TO);
        expect(copy._$fills[2]).toBe(0);
        expect(copy._$fills[3]).toBe(1);

        expect(copy._$fills[4]).toBe(Graphics.LINE_TO);
        expect(copy._$fills[5]).toBe(0);
        expect(copy._$fills[6]).toBe(301);

        expect(copy._$fills[7]).toBe(Graphics.LINE_TO);
        expect(copy._$fills[8]).toBe(200);
        expect(copy._$fills[9]).toBe(301);

        expect(copy._$fills[10]).toBe(Graphics.LINE_TO);
        expect(copy._$fills[11]).toBe(200);
        expect(copy._$fills[12]).toBe(1);

        expect(copy._$fills[13]).toBe(Graphics.LINE_TO);
        expect(copy._$fills[14]).toBe(0);
        expect(copy._$fills[15]).toBe(1);

    });

    it("copyFrom test valid", function ()
    {
        let g = new Graphics();
        g.copyFrom({});

        expect(g._$fills).toBe(null);
        expect(g._$lines).toBe(null);
        expect(g._$doFill).toBe(false);
        expect(g._$doLine).toBe(false);
    });

});

describe("Graphics.js cubicCurveTo test", function()
{

    it("cubicCurveTo test success", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            .cubicCurveTo(275, 0, 300, 25, 300, 50);

        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$fills[1]).toBe(Graphics.CUBIC);
        expect(g._$fills[2]).toBe(275);
        expect(g._$fills[3]).toBe(0);
        expect(g._$fills[4]).toBe(300);
        expect(g._$fills[5]).toBe(25);
        expect(g._$fills[6]).toBe(300);
        expect(g._$fills[7]).toBe(50);

    });

    it("cubicCurveTo test valid case1", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            .cubicCurveTo("275", "0", "300", "25", "300", "50");

        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$fills[1]).toBe(Graphics.CUBIC);
        expect(g._$fills[2]).toBe(275);
        expect(g._$fills[3]).toBe(0);
        expect(g._$fills[4]).toBe(300);
        expect(g._$fills[5]).toBe(25);
        expect(g._$fills[6]).toBe(300);
        expect(g._$fills[7]).toBe(50);

    });

    it("cubicCurveTo test valid case2", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            .moveTo(100, 100)
            .cubicCurveTo("a", "b", "c", "d", "e", "f");

        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        expect(g._$fills[2]).toBe(100);
        expect(g._$fills[3]).toBe(100);
        expect(g._$fills[4]).toBe(Graphics.CUBIC);
        expect(g._$fills[5]).toBe(0);
        expect(g._$fills[6]).toBe(0);
        expect(g._$fills[7]).toBe(0);
        expect(g._$fills[8]).toBe(0);
        expect(g._$fills[9]).toBe(0);
        expect(g._$fills[10]).toBe(0);

    });

});

describe("Graphics.js curveTo test", function()
{

    it("curveTo test success", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            .curveTo(300, 100, 250, 100);

        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$fills[1]).toBe(Graphics.CURVE_TO);
        expect(g._$fills[2]).toBe(300);
        expect(g._$fills[3]).toBe(100);
        expect(g._$fills[4]).toBe(250);
        expect(g._$fills[5]).toBe(100);

    });

    it("curveTo test valid case1", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            .curveTo("300", "100", "250", "100");

        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$fills[1]).toBe(Graphics.CURVE_TO);
        expect(g._$fills[2]).toBe(300);
        expect(g._$fills[3]).toBe(100);
        expect(g._$fills[4]).toBe(250);
        expect(g._$fills[5]).toBe(100);

    });

    it("curveTo test valid case1", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            .moveTo(100, 100)
            .curveTo("a", "b", "c", "d");

        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        expect(g._$fills[2]).toBe(100);
        expect(g._$fills[3]).toBe(100);
        expect(g._$fills[4]).toBe(Graphics.CURVE_TO);
        expect(g._$fills[5]).toBe(0);
        expect(g._$fills[6]).toBe(0);
        expect(g._$fills[7]).toBe(0);
        expect(g._$fills[8]).toBe(0);

    });

});

describe("Graphics.js drawEllipse test", function()
{

    it("drawEllipse test success", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            .drawEllipse(10, 10, 150, 200);

        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);

        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        expect(g._$fills[2]).toBe(85);
        expect(g._$fills[3]).toBe(10);

        expect(g._$fills[4]).toBe(Graphics.CUBIC);
        expect(g._$fills[5] | 0).toBe(126);
        expect(g._$fills[6]).toBe(10);
        expect(g._$fills[7]).toBe(160);
        expect(g._$fills[8] | 0).toBe(54);
        expect(g._$fills[9]).toBe(160);
        expect(g._$fills[10]).toBe(110);

        expect(g._$fills[11]).toBe(Graphics.CUBIC);
        expect(g._$fills[12]).toBe(160);
        expect(g._$fills[13] | 0).toBe(165);
        expect(g._$fills[14] | 0).toBe(126);
        expect(g._$fills[15]).toBe(210);
        expect(g._$fills[16]).toBe(85);
        expect(g._$fills[17]).toBe(210);

        expect(g._$fills[18]).toBe(Graphics.CUBIC);
        expect(g._$fills[19] | 0).toBe(43);
        expect(g._$fills[20]).toBe(210);
        expect(g._$fills[21]).toBe(10);
        expect(g._$fills[22] | 0).toBe(165);
        expect(g._$fills[23]).toBe(10);
        expect(g._$fills[24]).toBe(110);

        expect(g._$fills[25]).toBe(Graphics.CUBIC);
        expect(g._$fills[26]).toBe(10);
        expect(g._$fills[27] | 0).toBe(54);
        expect(g._$fills[28] | 0).toBe(43);
        expect(g._$fills[29]).toBe(10);
        expect(g._$fills[30]).toBe(85);
        expect(g._$fills[31]).toBe(10);
    });

});

describe("Graphics.js drawCircle test", function()
{

    it("drawCircle test success", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            .drawCircle(120, 120, 50);

        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        expect(g._$fills[2]).toBe(170);
        expect(g._$fills[3]).toBe(120);
        expect(g._$fills[4]).toBe(Graphics.ARC);
        expect(g._$fills[5]).toBe(120);
        expect(g._$fills[6]).toBe(120);
        expect(g._$fills[7]).toBe(50);

    });

    it("drawCircle test success", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            .drawCircle("120", "120", "50");

        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        expect(g._$fills[2]).toBe(170);
        expect(g._$fills[3]).toBe(120);
        expect(g._$fills[4]).toBe(Graphics.ARC);
        expect(g._$fills[5]).toBe(120);
        expect(g._$fills[6]).toBe(120);
        expect(g._$fills[7]).toBe(50);

    });

    it("drawCircle test success", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            .drawCircle("a", "b", "c");

        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        expect(g._$fills[2]).toBe(0);
        expect(g._$fills[3]).toBe(0);
        expect(g._$fills[4]).toBe(Graphics.ARC);
        expect(g._$fills[5]).toBe(0);
        expect(g._$fills[6]).toBe(0);
        expect(g._$fills[7]).toBe(0);

    });

});

describe("Graphics.js drawRoundRect test", function()
{

    it("drawRoundRect test success case1", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0x0000FF, 1)
            .drawRoundRect(10, 10, 100, 100, 50, 50);

        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);

        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        expect(g._$fills[2]).toBe(35);
        expect(g._$fills[3]).toBe(10);

        expect(g._$fills[4]).toBe(Graphics.LINE_TO);
        expect(g._$fills[5]).toBe(85);
        expect(g._$fills[6]).toBe(10);

        expect(g._$fills[7]).toBe(Graphics.CUBIC);
        expect(g._$fills[8] | 0).toBe(98);
        expect(g._$fills[9]).toBe(10);
        expect(g._$fills[10]).toBe(110);
        expect(g._$fills[11] | 0).toBe(21);
        expect(g._$fills[12]).toBe(110);
        expect(g._$fills[13]).toBe(35);

        expect(g._$fills[14]).toBe(Graphics.LINE_TO);
        expect(g._$fills[15]).toBe(110);
        expect(g._$fills[16]).toBe(85);

        expect(g._$fills[17]).toBe(Graphics.CUBIC);
        expect(g._$fills[18]).toBe(110);
        expect(g._$fills[19] | 0).toBe(98);
        expect(g._$fills[20] | 0).toBe(98);
        expect(g._$fills[21]).toBe(110);
        expect(g._$fills[22]).toBe(85);
        expect(g._$fills[23]).toBe(110);

        expect(g._$fills[24]).toBe(Graphics.LINE_TO);
        expect(g._$fills[25]).toBe(35);
        expect(g._$fills[26]).toBe(110);

        expect(g._$fills[27]).toBe(Graphics.CUBIC);
        expect(g._$fills[28] | 0).toBe(21);
        expect(g._$fills[29]).toBe(110);
        expect(g._$fills[30]).toBe(10);
        expect(g._$fills[31] | 0).toBe(98);
        expect(g._$fills[32]).toBe(10);
        expect(g._$fills[33]).toBe(85);

        expect(g._$fills[34]).toBe(Graphics.LINE_TO);
        expect(g._$fills[35]).toBe(10);
        expect(g._$fills[36]).toBe(35);

        expect(g._$fills[37]).toBe(Graphics.CUBIC);
        expect(g._$fills[38]).toBe(10);
        expect(g._$fills[39] | 0).toBe(21);
        expect(g._$fills[40] | 0).toBe(21);
        expect(g._$fills[41]).toBe(10);
        expect(g._$fills[42]).toBe(35);
        expect(g._$fills[43]).toBe(10);
    });

});

describe("Graphics.js lineStyle test", function()
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

        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        expect(g._$fills[2]).toBe(20);
        expect(g._$fills[3]).toBe(20);
        expect(g._$fills[4]).toBe(Graphics.LINE_TO);
        expect(g._$fills[5]).toBe(120);
        expect(g._$fills[6]).toBe(20);
        expect(g._$fills[7]).toBe(Graphics.LINE_TO);
        expect(g._$fills[8]).toBe(120);
        expect(g._$fills[9]).toBe(120);

        expect(g._$lineType).toBe(Graphics.STROKE_STYLE);
        expect(g._$lineWidth).toBe(10);
        expect(g._$caps).toBe(CapsStyle.NONE);
        expect(g._$joints).toBe(JointStyle.MITER);
        expect(g._$miterLimit).toBe(1);

        expect(g._$lines[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$lines[1]).toBe(Graphics.MOVE_TO);
        expect(g._$lines[2]).toBe(120);
        expect(g._$lines[3]).toBe(20);
        expect(g._$lines[4]).toBe(Graphics.LINE_TO);
        expect(g._$lines[5]).toBe(120);
        expect(g._$lines[6]).toBe(120);

        g
            .endLine()
            .lineTo(20.0 ,  120.0 );

        expect(g._$lineWidth).toBe(0);
        expect(g._$lines).toBe(null);

        g
            .lineStyle(20, 0x0000ff, 0.5, false, "normal", CapsStyle.NONE, JointStyle.BEVEL, 255)
            .lineTo(20.0 ,  20.0 )
            .endFill();

        // lines
        expect(g._$lineWidth).toBe(20);
        expect(g._$lines[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$lines[1]).toBe(Graphics.MOVE_TO);
        expect(g._$lines[2]).toBe(20);
        expect(g._$lines[3]).toBe(120);
        expect(g._$lines[4]).toBe(Graphics.LINE_TO);
        expect(g._$lines[5]).toBe(20);
        expect(g._$lines[6]).toBe(20);

    });

    it("lineStyle test success case2", function ()
    {
        let g = new Graphics();

        g
            .beginFill(0xff0000, 1.0)
            .moveTo(20.0 , 20.0)
            .lineTo(120.0 ,  20.0 )
            .lineStyle(10, 0x00ff00, 1.0, CapsStyle.NONE, JointStyle.MITER, 1)
            .lineTo(120.0 ,  120.0 );

        expect(g._$fills[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$fills[1]).toBe(Graphics.MOVE_TO);
        expect(g._$fills[2]).toBe(20);
        expect(g._$fills[3]).toBe(20);
        expect(g._$fills[4]).toBe(Graphics.LINE_TO);
        expect(g._$fills[5]).toBe(120);
        expect(g._$fills[6]).toBe(20);
        expect(g._$fills[7]).toBe(Graphics.LINE_TO);
        expect(g._$fills[8]).toBe(120);
        expect(g._$fills[9]).toBe(120);

        expect(g._$lineType).toBe(Graphics.STROKE_STYLE);
        expect(g._$lineWidth).toBe(10);
        expect(g._$caps).toBe(CapsStyle.NONE);
        expect(g._$joints).toBe(JointStyle.MITER);
        expect(g._$miterLimit).toBe(1);

        console.log(g._$lines);
        expect(g._$lines[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$lines[1]).toBe(Graphics.MOVE_TO);
        expect(g._$lines[2]).toBe(120);
        expect(g._$lines[3]).toBe(20);
        expect(g._$lines[4]).toBe(Graphics.LINE_TO);
        expect(g._$lines[5]).toBe(120);
        expect(g._$lines[6]).toBe(120);

        g
            .lineStyle(20, 0x0000ff, 0.5, CapsStyle.NONE, JointStyle.BEVEL, 255)
            .lineTo(20.0 ,  120.0 )
            .lineTo(20.0 ,  20.0 ) // <= logic test
            .endFill();

        // line width
        expect(g._$lineWidth).toBe(20);

        expect(g._$lines[0]).toBe(Graphics.BEGIN_PATH);
        expect(g._$lines[1]).toBe(Graphics.MOVE_TO);
        expect(g._$lines[2]).toBe(120);
        expect(g._$lines[3]).toBe(120);
        expect(g._$lines[4]).toBe(Graphics.LINE_TO);
        expect(g._$lines[5]).toBe(20);
        expect(g._$lines[6]).toBe(120);
        expect(g._$lines[7]).toBe(Graphics.LINE_TO);
        expect(g._$lines[8]).toBe(20);
        expect(g._$lines[9]).toBe(20);
    });

});