
describe("GraphicsBitmapFill.js repeat test", function()
{

    it("default test case1", function()
    {
        let gbf = new GraphicsBitmapFill();
        expect(gbf._$repeat).toBe(false);
    });

    it("default test case2", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, null);
        expect(gbf._$repeat).toBe(false);
    });

    it("default test case3", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, undefined);
        expect(gbf._$repeat).toBe(false);
    });

    it("default test case4", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, true);
        expect(gbf._$repeat).toBe(true);
    });

    it("default test case5", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, "");
        expect(gbf._$repeat).toBe(false);
    });

    it("default test case6", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, "abc");
        expect(gbf._$repeat).toBe(true);
    });

    it("default test case7", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, 0);
        expect(gbf._$repeat).toBe(false);
    });

    it("default test case8", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, 1);
        expect(gbf._$repeat).toBe(true);
    });

    it("default test case12", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, { "a":0 });
        expect(gbf._$repeat).toBe(true);
    });

    it("default test case13", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, function a() {});
        expect(gbf._$repeat).toBe(true);
    });

    it("default test case14", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, [0]);
        expect(gbf._$repeat).toBe(true);
    });

    it("default test case15", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, [1,2]);
        expect(gbf._$repeat).toBe(true);
    });

    it("default test case16", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, {});
        expect(gbf._$repeat).toBe(true);
    });

    it("default test case17", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, { "toString":function () { return 0 } });
        expect(gbf._$repeat).toBe(true);
    });

});

describe("GraphicsBitmapFill.js smooth test", function()
{

    it("default test case1", function()
    {
        let gbf = new GraphicsBitmapFill();
        expect(gbf._$smooth).toBe(false);
    });

    it("default test case2", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, null, null);
        expect(gbf._$smooth).toBe(false);
    });

    it("default test case3", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, null, undefined);
        expect(gbf._$smooth).toBe(false);
    });

    it("default test case4", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, null, true);
        expect(gbf._$smooth).toBe(true);
    });

    it("default test case5", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, null, "");
        expect(gbf._$smooth).toBe(false);
    });

    it("default test case6", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, null, "abc");
        expect(gbf._$smooth).toBe(true);
    });

    it("default test case7", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, null, 0);
        expect(gbf._$smooth).toBe(false);
    });

    it("default test case8", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, null, 1);
        expect(gbf._$smooth).toBe(true);
    });

    it("default test case12", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, null, { "a":0 });
        expect(gbf._$smooth).toBe(true);
    });

    it("default test case13", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, null, function a() {});
        expect(gbf._$smooth).toBe(true);
    });

    it("default test case14", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, null, [0]);
        expect(gbf._$smooth).toBe(true);
    });

    it("default test case15", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, null, [1,2]);
        expect(gbf._$smooth).toBe(true);
    });

    it("default test case16", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, null, {});
        expect(gbf._$smooth).toBe(true);
    });

    it("default test case17", function()
    {
        let gbf = new GraphicsBitmapFill(null, null, null, { "toString": function () { return 0 } });
        expect(gbf._$smooth).toBe(true);
    });

});