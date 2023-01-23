
describe("ConvolutionFilter.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new ConvolutionFilter();
        expect(object.namespace).toBe("next2d.filters.ConvolutionFilter");
    });

    it("namespace test static", function()
    {
        expect(ConvolutionFilter.namespace).toBe("next2d.filters.ConvolutionFilter");
    });

});

describe("ConvolutionFilter.js toString test", function()
{
    it("toString test success", function()
    {
        let filter = new ConvolutionFilter();
        expect(filter.toString()).toBe("[object ConvolutionFilter]");
    });

});

describe("ConvolutionFilter.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(ConvolutionFilter.toString()).toBe("[class ConvolutionFilter]");
    });

});

describe("ConvolutionFilter.js property test", function()
{

    // default
    it("default test success", function()
    {
        let filter = new ConvolutionFilter();
        expect(filter.alpha).toBe(0);
        expect(filter.bias).toBe(0);
        expect(filter.clamp).toBe(true);
        expect(filter.color).toBe(0);
        expect(filter.divisor).toBe(1);
        expect(Array.isArray(filter.matrix)).toBe(true);
        expect(filter.matrixX).toBe(0);
        expect(filter.matrixY).toBe(0);
        expect(filter.preserveAlpha).toBe(true);
    });

    // matrixX
    it("matrixX test success case1", function()
    {
        let filter = new ConvolutionFilter(0);
        expect(filter.matrixX).toBe(0);
    });

    it("matrixX test success case2", function()
    {
        let filter = new ConvolutionFilter(0);
        filter.matrixX = 10;
        expect(filter.matrixX).toBe(10);
    });

    it("matrixX test valid case1", function()
    {
        let filter = new ConvolutionFilter("10");
        expect(filter.matrixX).toBe(10);
    });

    it("matrixX test valid case2", function()
    {
        let filter = new ConvolutionFilter(1);
        filter.matrixX = "10";
        expect(filter.matrixX).toBe(10);
    });

    it("matrixX test valid case3", function()
    {
        let filter = new ConvolutionFilter("test");
        expect(filter.matrixX).toBe(0);
    });

    it("matrixX test valid case4", function()
    {
        let filter = new ConvolutionFilter(1);
        filter.matrixX = "abc";
        expect(filter.matrixX).toBe(0);
    });

    // matrixY
    it("matrixY test success case1", function()
    {
        let filter = new ConvolutionFilter(3, 0);
        expect(filter.matrixY).toBe(0);
    });

    it("matrixY test success case2", function()
    {
        let filter = new ConvolutionFilter(3, 0);
        filter.matrixY = 10;
        expect(filter.matrixY).toBe(10);
    });

    it("matrixY test valid case1", function()
    {
        let filter = new ConvolutionFilter(2, "10");
        expect(filter.matrixY).toBe(10);
    });

    it("matrixY test valid case2", function()
    {
        let filter = new ConvolutionFilter(3, 1);
        filter.matrixY = "10";
        expect(filter.matrixY).toBe(10);
    });

    it("matrixY test valid case3", function()
    {
        let filter = new ConvolutionFilter(3, "test");
        expect(filter.matrixY).toBe(0);
    });

    it("matrixY test valid case4", function()
    {
        let filter = new ConvolutionFilter(3, 1);
        filter.matrixY = "abc";
        expect(filter.matrixY).toBe(0);
    });

    // matrix
    it("matrix test success case1", function()
    {
        let filter = new ConvolutionFilter(3, 1, [1,2,3,4,5,6,7,8,9]);
        expect(filter.matrix.length).toBe(9);
    });

    it("matrix test success case2", function()
    {
        let filter = new ConvolutionFilter(3, 1, null);
        filter.matrix = [1,2,3,4,5,6,7,8,9];
        expect(filter.matrix.length).toBe(9);
    });

    it("matrix test valid case1", function()
    {
        let filter = new ConvolutionFilter(3, 1, {});
        expect(Array.isArray(filter.matrix)).toBe(true);
    });

    // divisor
    it("divisor test success case1", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 2);
        expect(filter.divisor).toBe(2);
    });

    it("divisor test success case2", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 2);
        filter.divisor = 4.5;
        expect(filter.divisor).toBe(4.5);
    });

    it("divisor test valid case1", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0);
        expect(filter.divisor).toBe(0);
    });

    it("divisor test valid case2", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], "4");
        expect(filter.divisor).toBe(4);
    });

    it("divisor test valid case3", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 2);
        filter.divisor = "3";
        expect(filter.divisor).toBe(3);
    });

    it("divisor test valid case4", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], "test");
        expect(isNaN(filter.divisor)).toBe(true);
    });

    it("divisor test valid case5", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 10);
        filter.divisor = "abc";
        expect(isNaN(filter.divisor)).toBe(true);
    });

    // bias
    it("bias test success case1", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 2);
        expect(filter.bias).toBe(2);
    });

    it("bias test success case2", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 2);
        filter.bias = 4.5;
        expect(filter.bias).toBe(4.5);
    });

    it("bias test valid case1", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 0);
        expect(filter.bias).toBe(0);
    });

    it("bias test valid case2", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, "4");
        expect(filter.bias).toBe(4);
    });

    it("bias test valid case3", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 2);
        filter.bias = "3";
        expect(filter.bias).toBe(3);
    });

    it("bias test valid case4", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, "test");
        expect(isNaN(filter.bias)).toBe(true);
    });

    it("bias test valid case5", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10);
        filter.bias = "abc";
        expect(isNaN(filter.bias)).toBe(true);
    });

    // preserveAlpha
    it("preserveAlpha test success case1", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 2, false);
        expect(filter.preserveAlpha).toBe(false);
    });

    it("preserveAlpha test success case2", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 2, true);
        filter.preserveAlpha = false;
        expect(filter.preserveAlpha).toBe(false);
    });

    it("preserveAlpha test valid case1", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, "");
        expect(filter.preserveAlpha).toBe(false);
    });

    it("preserveAlpha test valid case2", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true);
        filter.preserveAlpha = "";
        expect(filter.preserveAlpha).toBe(false);
    });

    it("preserveAlpha test valid case3", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, "abc");
        expect(filter.preserveAlpha).toBe(true);
    });

    it("preserveAlpha test valid case4", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, []);
        expect(filter.preserveAlpha).toBe(true);
    });

    it("preserveAlpha test valid case5", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, {});
        expect(filter.preserveAlpha).toBe(true);
    });

    // clamp
    it("clamp test success case1", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true);
        expect(filter.clamp).toBe(true);
    });

    it("clamp test success case2", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true);
        filter.clamp = false;
        expect(filter.clamp).toBe(false);
    });

    it("clamp test valid case1", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, 1);
        expect(filter.clamp).toBe(true);
    });

    it("clamp test valid case2", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, false);
        filter.clamp = 1;
        expect(filter.clamp).toBe(true);
    });

    it("clamp test valid case3", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, 0);
        expect(filter.clamp).toBe(false);
    });

    it("clamp test valid case4", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true);
        filter.clamp = 0;
        expect(filter.clamp).toBe(false);
    });

    it("clamp test valid case5", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, "test");
        expect(filter.clamp).toBe(true);
    });

    it("clamp test valid case6", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true);
        filter.clamp = "";
        expect(filter.clamp).toBe(false);
    });

    it("clamp test valid case7", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, {});
        expect(filter.clamp).toBe(true);
    });

    it("clamp test valid case8", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, []);
        expect(filter.clamp).toBe(true);
    });

    // color
    it("color test success case1", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, 0);
        expect(filter.color).toBe(0);
    });

    it("color test success case2", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, 0xff0000);
        filter.color = 0x00ff00;
        expect(filter.color).toBe(0x00ff00);
    });

    it("color test valid case1", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, "0x0000ff");
        expect(filter.color).toBe(255);
    });

    it("color test valid case2", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, "red");
        expect(filter.color).toBe(0xff0000);
    });

    it("color test valid case3", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, -10);
        expect(filter.color).toBe(0);
    });

    it("color test valid case4", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, 16777220);
        expect(filter.color).toBe(0xffffff);
    });

    it("color test valid case5", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, 0xffffff);

        filter.color = "0x0000ff";
        expect(filter.color).toBe(0x0000ff);

        filter.color = "red";
        expect(filter.color).toBe(0xff0000);

        filter.color = -10;
        expect(filter.color).toBe(0);

        filter.color = 16777220;
        expect(filter.color).toBe(0xffffff);
    });

    // alpha
    it("alpha test success case1", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, 0xffffff, 0);
        expect(filter.alpha).toBe(0);
    });

    it("alpha test success case2", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, 0xffffff, 0.5);
        filter.alpha = 0.75;
        expect(filter.alpha).toBe(0.75);
    });

    it("alpha test valid case1", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, 0xffffff, "0.25");
        expect(filter.alpha).toBe(0.25);
    });

    it("alpha test valid case2", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, 0xffffff, -10);
        expect(filter.alpha).toBe(0);
    });

    it("alpha test valid case3", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, 0xffffff, 10);
        expect(filter.alpha).toBe(1);
    });

    it("alpha test valid case4", function()
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, 0xffffff, 1);

        filter.alpha = "0.75";
        expect(filter.alpha).toBe(0.75);

        filter.alpha = -10;
        expect(filter.alpha).toBe(0);

        filter.alpha = 16777220;
        expect(filter.alpha).toBe(1);
    });

});

describe("ConvolutionFilter.js clone test", function()
{

    it("clone test", function()
    {
        let filter = new ConvolutionFilter(
            2, 2, [1,2,3,4], 2, 1,
            false, false, 0xff0000, 1
        );
        let clone  = filter.clone();

        // clone check
        expect(clone.matrixX).toBe(2);
        expect(clone.matrixY).toBe(2);
        expect(clone.matrix[0]).toBe(1);
        expect(clone.matrix[1]).toBe(2);
        expect(clone.matrix[2]).toBe(3);
        expect(clone.matrix[3]).toBe(4);
        expect(clone.divisor).toBe(2);
        expect(clone.bias).toBe(1);
        expect(clone.preserveAlpha).toBe(false);
        expect(clone.clamp).toBe(false);
        expect(clone.color).toBe(0xff0000);
        expect(clone.alpha).toBe(1);

        // edit param
        clone.matrixX       = 3;
        clone.matrixY       = 3;
        clone.matrix        = [1,2,3,4,5,6,7,8,9];
        clone.divisor       = 1;
        clone.bias          = 2;
        clone.preserveAlpha = true;
        clone.clamp         = true;
        clone.color         = 0xffffff;
        clone.alpha         = 0.5;

        // origin
        expect(filter.matrixX).toBe(2);
        expect(filter.matrixY).toBe(2);
        expect(filter.matrix[0]).toBe(1);
        expect(filter.matrix[1]).toBe(2);
        expect(filter.matrix[2]).toBe(3);
        expect(filter.matrix[3]).toBe(4);
        expect(filter.divisor).toBe(2);
        expect(filter.bias).toBe(1);
        expect(filter.preserveAlpha).toBe(false);
        expect(filter.clamp).toBe(false);
        expect(filter.color).toBe(0xff0000);
        expect(filter.alpha).toBe(1);

        // clone
        expect(clone.matrixX).toBe(3);
        expect(clone.matrixY).toBe(3);
        expect(clone.matrix[0]).toBe(1);
        expect(clone.matrix[1]).toBe(2);
        expect(clone.matrix[2]).toBe(3);
        expect(clone.matrix[3]).toBe(4);
        expect(clone.matrix[4]).toBe(5);
        expect(clone.matrix[5]).toBe(6);
        expect(clone.matrix[6]).toBe(7);
        expect(clone.matrix[7]).toBe(8);
        expect(clone.matrix[8]).toBe(9);
        expect(clone.divisor).toBe(1);
        expect(clone.bias).toBe(2);
        expect(clone.preserveAlpha).toBe(true);
        expect(clone.clamp).toBe(true);
        expect(clone.color).toBe(0xffffff);
        expect(clone.alpha).toBe(0.5);

    });

});

describe("ConvolutionFilter.js clamp test", function()
{

    it("default test case1", function()
    {
        let cf = new ConvolutionFilter();
        expect(cf.clamp).toBe(true);
    });

    it("default test case2", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = null;
        expect(cf.clamp).toBe(false);
    });

    it("default test case3", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = undefined;
        expect(cf.clamp).toBe(false);
    });

    it("default test case4", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = true;
        expect(cf.clamp).toBe(true);
    });

    it("default test case5", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = "";
        expect(cf.clamp).toBe(false);
    });

    it("default test case6", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = "abc";
        expect(cf.clamp).toBe(true);
    });

    it("default test case7", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = 0;
        expect(cf.clamp).toBe(false);
    });

    it("default test case8", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = 1;
        expect(cf.clamp).toBe(true);
    });

    it("default test case9", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = 500;
        expect(cf.clamp).toBe(true);
    });

    it("default test case10", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = 50000000000000000;
        expect(cf.clamp).toBe(true);
    });

    it("default test case11", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = -1;
        expect(cf.clamp).toBe(true);
    });

    it("default test case12", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = -500;
        expect(cf.clamp).toBe(true);
    });

    it("default test case13", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = -50000000000000000;
        expect(cf.clamp).toBe(true);
    });

    it("default test case14", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = { "a":0 };
        expect(cf.clamp).toBe(true);
    });

    it("default test case15", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = function a() {};
        expect(cf.clamp).toBe(true);
    });

    it("default test case16", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = [1];
        expect(cf.clamp).toBe(true);
    });

    it("default test case17", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = [1,2];
        expect(cf.clamp).toBe(true);
    });

    it("default test case18", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = {};
        expect(cf.clamp).toBe(true);
    });

    it("default test case19", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = { "toString":function () { return 1 } };
        expect(cf.clamp).toBe(true);
    });

    it("default test case20", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = { "toString":function () { return "1" } };
        expect(cf.clamp).toBe(true);
    });

    it("default test case21", function()
    {
        let cf = new ConvolutionFilter();
        cf.clamp = { "toString":function () { return "1a" } };
        expect(cf.clamp).toBe(true);
    });

});

describe("ConvolutionFilter.js preserveAlpha test", function()
{

    it("default test case1", function()
    {
        let cf = new ConvolutionFilter();
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case2", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = null;
        expect(cf.preserveAlpha).toBe(false);
    });

    it("default test case3", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = undefined;
        expect(cf.preserveAlpha).toBe(false);
    });

    it("default test case4", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = true;
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case5", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = "";
        expect(cf.preserveAlpha).toBe(false);
    });

    it("default test case6", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = "abc";
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case7", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = 0;
        expect(cf.preserveAlpha).toBe(false);
    });

    it("default test case8", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = 1;
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case9", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = 500;
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case10", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = 50000000000000000;
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case11", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = -1;
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case12", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = -500;
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case13", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = -50000000000000000;
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case14", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = { "a":0 };
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case15", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = function a() {};
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case16", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = [1];
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case17", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = [1,2];
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case18", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = {};
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case19", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = { "toString":function () { return 1 } };
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case20", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = { "toString":function () { return "1" } };
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case21", function()
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = { "toString":function () { return "1a" } };
        expect(cf.preserveAlpha).toBe(true);
    });

});

describe("ConvolutionFilter.js alpha test", function()
{

    it("default test case1", function()
    {
        let cf = new ConvolutionFilter();
        expect(cf.alpha).toBe(0);
    });

    it("default test case2", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = null;
        expect(cf.alpha).toBe(0);
    });

    it("default test case3", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = undefined;
        expect(cf.alpha).toBe(0);
    });

    it("default test case4", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = true;
        expect(cf.alpha).toBe(1);
    });

    it("default test case5", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = "";
        expect(cf.alpha).toBe(0);
    });

    it("default test case6", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = "abc";
        expect(cf.alpha).toBe(0);
    });

    it("default test case7", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = 0;
        expect(cf.alpha).toBe(0);
    });

    it("default test case8", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = 1;
        expect(cf.alpha).toBe(1);
    });

    it("default test case9", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = 500;
        expect(cf.alpha).toBe(1);
    });

    it("default test case10", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = 50000000000000000;
        expect(cf.alpha).toBe(1);
    });

    it("default test case11", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = -1;
        expect(cf.alpha).toBe(0);
    });

    it("default test case12", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = -500;
        expect(cf.alpha).toBe(0);
    });

    it("default test case13", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = -50000000000000000;
        expect(cf.alpha).toBe(0);
    });

    it("default test case14", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = { "a":0 };
        expect(cf.alpha).toBe(0);
    });

    it("default test case15", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = function a() {};
        expect(cf.alpha).toBe(0);
    });

    it("default test case16", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = [1];
        expect(cf.alpha).toBe(1);
    });

    it("default test case17", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = [1,2];
        expect(cf.alpha).toBe(0);
    });

    it("default test case18", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = {};
        expect(cf.alpha).toBe(0);
    });

    it("default test case19", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = { "toString":function () { return 1 } };
        expect(cf.alpha).toBe(1);
    });

    it("default test case20", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = { "toString":function () { return "1" } };
        expect(cf.alpha).toBe(1);
    });

    it("default test case21", function()
    {
        let cf = new ConvolutionFilter();
        cf.alpha = { "toString":function () { return "1a" } };
        expect(cf.alpha).toBe(0);
    });

});

describe("ConvolutionFilter.js bias test", function()
{

    it("default test case1", function()
    {
        let cf = new ConvolutionFilter();
        expect(cf.bias).toBe(0);
    });

    it("default test case2", function()
    {
        let cf = new ConvolutionFilter();
        cf.bias = null;
        expect(cf.bias).toBe(0);
    });

    it("default test case3", function()
    {
        let cf = new ConvolutionFilter();
        cf.bias = undefined;
        expect(isNaN(cf.bias)).toBe(true);
    });

    it("default test case4", function()
    {
        let cf = new ConvolutionFilter();
        cf.bias = true;
        expect(cf.bias).toBe(1);
    });

    it("default test case5", function()
    {
        let cf = new ConvolutionFilter();
        cf.bias = "";
        expect(cf.bias).toBe(0);
    });

    it("default test case6", function()
    {
        let cf = new ConvolutionFilter();
        cf.bias = "abc";
        expect(isNaN(cf.bias)).toBe(true);
    });

    it("default test case7", function()
    {
        let cf = new ConvolutionFilter();
        cf.bias = 0;
        expect(cf.bias).toBe(0);
    });

    it("default test case8", function()
    {
        let cf = new ConvolutionFilter();
        cf.bias = 1;
        expect(cf.bias).toBe(1);
    });

    it("default test case9", function()
    {
        let cf = new ConvolutionFilter();
        cf.bias = 500;
        expect(cf.bias).toBe(500);
    });

    // it("default test case10", function()
    // {
    //     var cf = new ConvolutionFilter();
    //     cf.bias = 50000000000000000;
    //     expect(cf.bias).toBe(49999999215337470);
    // });

    it("default test case11", function()
    {
        let cf = new ConvolutionFilter();
        cf.bias = -1;
        expect(cf.bias).toBe(-1);
    });

    it("default test case12", function()
    {
        let cf = new ConvolutionFilter();
        cf.bias = -500;
        expect(cf.bias).toBe(-500);
    });

    // it("default test case13", function()
    // {
    //     var cf = new ConvolutionFilter();
    //     cf.bias = -50000000000000000;
    //     expect(cf.bias).toBe(-49999999215337470);
    // });

    it("default test case14", function()
    {
        let cf = new ConvolutionFilter();
        cf.bias = { "a":0 };
        expect(isNaN(cf.bias)).toBe(true);
    });

    it("default test case15", function()
    {
        let cf = new ConvolutionFilter();
        cf.bias = function a() {};
        expect(isNaN(cf.bias)).toBe(true);
    });

    it("default test case16", function()
    {
        let cf = new ConvolutionFilter();
        cf.bias = [1];
        expect(cf.bias).toBe(1);
    });

    it("default test case17", function()
    {
        let cf = new ConvolutionFilter();
        cf.bias = [1,2];
        expect(isNaN(cf.bias)).toBe(true);
    });

    it("default test case18", function()
    {
        let cf = new ConvolutionFilter();
        cf.bias = {};
        expect(isNaN(cf.bias)).toBe(true);
    });

    it("default test case19", function()
    {
        let cf = new ConvolutionFilter();
        cf.bias = { "toString":function () { return 1 } };
        expect(cf.bias).toBe(1);
    });

    it("default test case20", function()
    {
        let cf = new ConvolutionFilter();
        cf.bias = { "toString":function () { return "1" } };
        expect(cf.bias).toBe(1);
    });

    it("default test case21", function()
    {
        let cf = new ConvolutionFilter();
        cf.bias = { "toString":function () { return "1a" } };
        expect(isNaN(cf.bias)).toBe(true);
    });

});

describe("ConvolutionFilter.js color test", function()
{

    it("default test case1", function()
    {
        let cf = new ConvolutionFilter();
        expect(cf.color).toBe(0);
    });

    it("default test case2", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = null;
        expect(cf.color).toBe(0);
    });

    it("default test case3", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = undefined;
        expect(cf.color).toBe(0);
    });

    it("default test case4", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = true;
        expect(cf.color).toBe(1);
    });

    it("default test case5", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = "";
        expect(cf.color).toBe(0);
    });

    it("default test case6", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = "abc";
        expect(cf.color).toBe(0);
    });

    it("default test case7", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = 0;
        expect(cf.color).toBe(0);
    });

    it("default test case8", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = 1;
        expect(cf.color).toBe(1);
    });

    it("default test case9", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = 500;
        expect(cf.color).toBe(500);
    });

    it("default test case10", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = 50000000000000000;
        expect(cf.color).toBe(0xffffff);
    });

    it("default test case11", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = -1;
        expect(cf.color).toBe(0);
    });

    it("default test case12", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = -500;
        expect(cf.color).toBe(0);
    });

    it("default test case13", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = -50000000000000000;
        expect(cf.color).toBe(0);
    });

    it("default test case14", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = { "a":0 };
        expect(cf.color).toBe(0);
    });

    it("default test case15", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = function a() {};
        expect(cf.color).toBe(0);
    });

    it("default test case16", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = [1];
        expect(cf.color).toBe(1);
    });

    it("default test case17", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = [1,2];
        expect(cf.color).toBe(0);
    });

    it("default test case18", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = {};
        expect(cf.color).toBe(0);
    });

    it("default test case19", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = { "toString":function () { return 1 } };
        expect(cf.color).toBe(1);
    });

    it("default test case20", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = { "toString":function () { return "1" } };
        expect(cf.color).toBe(1);
    });

    it("default test case21", function()
    {
        let cf = new ConvolutionFilter();
        cf.color = { "toString":function () { return "1a" } };
        expect(cf.color).toBe(0);
    });

});

describe("ConvolutionFilter.js divisor test", function()
{

    it("default test case1", function()
    {
        let cf = new ConvolutionFilter();
        expect(cf.divisor).toBe(1);
    });

    it("default test case2", function()
    {
        let cf = new ConvolutionFilter();
        cf.divisor = null;
        expect(cf.divisor).toBe(0);
    });

    it("default test case3", function()
    {
        let cf = new ConvolutionFilter();
        cf.divisor = undefined;
        expect(isNaN(cf.divisor)).toBe(true);
    });

    it("default test case4", function()
    {
        let cf = new ConvolutionFilter();
        cf.divisor = true;
        expect(cf.divisor).toBe(1);
    });

    it("default test case5", function()
    {
        let cf = new ConvolutionFilter();
        cf.divisor = "";
        expect(cf.divisor).toBe(0);
    });

    it("default test case6", function()
    {
        let cf = new ConvolutionFilter();
        cf.divisor = "abc";
        expect(isNaN(cf.divisor)).toBe(true);
    });

    it("default test case7", function()
    {
        let cf = new ConvolutionFilter();
        cf.divisor = 0;
        expect(cf.divisor).toBe(0);
    });

    it("default test case8", function()
    {
        let cf = new ConvolutionFilter();
        cf.divisor = 1;
        expect(cf.divisor).toBe(1);
    });

    it("default test case9", function()
    {
        let cf = new ConvolutionFilter();
        cf.divisor = 500;
        expect(cf.divisor).toBe(500);
    });

    // it("default test case10", function()
    // {
    //     var cf = new ConvolutionFilter();
    //     cf.divisor = 50000000000000000;
    //     expect(cf.divisor).toBe(49999999215337470);
    // });

    it("default test case11", function()
    {
        let cf = new ConvolutionFilter();
        cf.divisor = -1;
        expect(cf.divisor).toBe(-1);
    });

    it("default test case12", function()
    {
        let cf = new ConvolutionFilter();
        cf.divisor = -500;
        expect(cf.divisor).toBe(-500);
    });

    // it("default test case13", function()
    // {
    //     var cf = new ConvolutionFilter();
    //     cf.divisor = -50000000000000000;
    //     expect(cf.divisor).toBe(-49999999215337470);
    // });

    it("default test case14", function()
    {
        let cf = new ConvolutionFilter();
        cf.divisor = { "a":0 };
        expect(isNaN(cf.divisor)).toBe(true);
    });

    it("default test case15", function()
    {
        let cf = new ConvolutionFilter();
        cf.divisor = function a() {};
        expect(isNaN(cf.divisor)).toBe(true);
    });

    it("default test case16", function()
    {
        let cf = new ConvolutionFilter();
        cf.divisor = [1];
        expect(cf.divisor).toBe(1);
    });

    it("default test case17", function()
    {
        let cf = new ConvolutionFilter();
        cf.divisor = [1,2];
        expect(isNaN(cf.divisor)).toBe(true);
    });

    it("default test case18", function()
    {
        let cf = new ConvolutionFilter();
        cf.divisor = {};
        expect(isNaN(cf.divisor)).toBe(true);
    });

    it("default test case19", function()
    {
        let cf = new ConvolutionFilter();
        cf.divisor = { "toString":function () { return 1 } };
        expect(cf.divisor).toBe(1);
    });

    it("default test case20", function()
    {
        let cf = new ConvolutionFilter();
        cf.divisor = { "toString":function () { return "1" } };
        expect(cf.divisor).toBe(1);
    });

    it("default test case21", function()
    {
        let cf = new ConvolutionFilter();
        cf.divisor = { "toString":function () { return "1a" } };
        expect(isNaN(cf.divisor)).toBe(true);
    });

});

describe("ConvolutionFilter.js matrixX test", function()
{

    it("default test case1", function()
    {
        let cf = new ConvolutionFilter();
        expect(cf.matrixX).toBe(0);
    });

    it("default test case2", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = null;
        expect(cf.matrixX).toBe(0);
    });

    it("default test case3", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = undefined;
        expect(cf.matrixX).toBe(0);
    });

    it("default test case4", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = true;
        expect(cf.matrixX).toBe(1);
    });

    it("default test case5", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = "";
        expect(cf.matrixX).toBe(0);
    });

    it("default test case6", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = "abc";
        expect(cf.matrixX).toBe(0);
    });

    it("default test case7", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = 0;
        expect(cf.matrixX).toBe(0);
    });

    it("default test case8", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = 1;
        expect(cf.matrixX).toBe(1);
    });

    it("default test case9", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = 500;
        expect(cf.matrixX).toBe(15);
    });

    it("default test case10", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = 50000000000000000;
        expect(cf.matrixX).toBe(15);
    });

    it("default test case11", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = -1;
        expect(cf.matrixX).toBe(0);
    });

    it("default test case12", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = -500;
        expect(cf.matrixX).toBe(0);
    });

    it("default test case13", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = -50000000000000000;
        expect(cf.matrixX).toBe(0);
    });

    it("default test case14", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = { "a":0 };
        expect(cf.matrixX).toBe(0);
    });

    it("default test case15", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = function a() {};
        expect(cf.matrixX).toBe(0);
    });

    it("default test case16", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = [1];
        expect(cf.matrixX).toBe(1);
    });

    it("default test case17", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = [1,2];
        expect(cf.matrixX).toBe(0);
    });

    it("default test case18", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = {};
        expect(cf.matrixX).toBe(0);
    });

    it("default test case19", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = { "toString":function () { return 1 } };
        expect(cf.matrixX).toBe(1);
    });

    it("default test case20", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = { "toString":function () { return "1" } };
        expect(cf.matrixX).toBe(1);
    });

    it("default test case21", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = { "toString":function () { return "1a" } };
        expect(cf.matrixX).toBe(0);
    });

});

describe("ConvolutionFilter.js matrixY test", function()
{

    it("default test case1", function()
    {
        let cf = new ConvolutionFilter();
        expect(cf.matrixY).toBe(0);
    });

    it("default test case2", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = null;
        expect(cf.matrixY).toBe(0);
    });

    it("default test case3", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = undefined;
        expect(cf.matrixY).toBe(0);
    });

    it("default test case4", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = true;
        expect(cf.matrixY).toBe(1);
    });

    it("default test case5", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = "";
        expect(cf.matrixY).toBe(0);
    });

    it("default test case6", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = "abc";
        expect(cf.matrixY).toBe(0);
    });

    it("default test case7", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = 0;
        expect(cf.matrixY).toBe(0);
    });

    it("default test case8", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = 1;
        expect(cf.matrixY).toBe(1);
    });

    it("default test case9", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = 500;
        expect(cf.matrixY).toBe(15);
    });

    it("default test case10", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = 50000000000000000;
        expect(cf.matrixY).toBe(15);
    });

    it("default test case11", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = -1;
        expect(cf.matrixY).toBe(0);
    });

    it("default test case12", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = -500;
        expect(cf.matrixY).toBe(0);
    });

    it("default test case13", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = -50000000000000000;
        expect(cf.matrixY).toBe(0);
    });

    it("default test case14", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = { "a":0 };
        expect(cf.matrixY).toBe(0);
    });

    it("default test case15", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = function a() {};
        expect(cf.matrixY).toBe(0);
    });

    it("default test case16", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = [1];
        expect(cf.matrixY).toBe(1);
    });

    it("default test case17", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = [1,2];
        expect(cf.matrixY).toBe(0);
    });

    it("default test case18", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = {};
        expect(cf.matrixY).toBe(0);
    });

    it("default test case19", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = { "toString":function () { return 1 } };
        expect(cf.matrixY).toBe(1);
    });

    it("default test case20", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = { "toString":function () { return "1" } };
        expect(cf.matrixY).toBe(1);
    });

    it("default test case21", function()
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = { "toString":function () { return "1a" } };
        expect(cf.matrixY).toBe(0);
    });

});