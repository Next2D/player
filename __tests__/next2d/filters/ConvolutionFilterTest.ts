import { ConvolutionFilter } from "../../../src/player/next2d/filters/ConvolutionFilter";

describe("ConvolutionFilter.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new ConvolutionFilter();
        expect(object.namespace).toBe("next2d.filters.ConvolutionFilter");
    });

    it("namespace test static", () =>
    {
        expect(ConvolutionFilter.namespace).toBe("next2d.filters.ConvolutionFilter");
    });

});

describe("ConvolutionFilter.js toString test", () =>
{
    it("toString test success", () =>
    {
        let filter = new ConvolutionFilter();
        expect(filter.toString()).toBe("[object ConvolutionFilter]");
    });

});

describe("ConvolutionFilter.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(ConvolutionFilter.toString()).toBe("[class ConvolutionFilter]");
    });

});

describe("ConvolutionFilter.js property test", () =>
{

    // default
    it("default test success", () =>
    {
        let filter = new ConvolutionFilter();
        expect(filter.alpha).toBe(0);
        expect(filter.bias).toBe(0);
        expect(filter.clamp).toBe(true);
        expect(filter.color).toBe(0);
        expect(filter.divisor).toBe(1);
        expect(filter.matrix).toBe(null);
        expect(filter.matrixX).toBe(0);
        expect(filter.matrixY).toBe(0);
        expect(filter.preserveAlpha).toBe(true);
    });

    // matrixX
    it("matrixX test success case1", () =>
    {
        let filter = new ConvolutionFilter(0);
        expect(filter.matrixX).toBe(0);
    });

    it("matrixX test success case2", () =>
    {
        let filter = new ConvolutionFilter(0);
        filter.matrixX = 10;
        expect(filter.matrixX).toBe(10);
    });

    it("matrixX test valid case1", () =>
    {
        // @ts-ignore
        let filter = new ConvolutionFilter("10");
        expect(filter.matrixX).toBe(10);
    });

    it("matrixX test valid case2", () =>
    {
        let filter = new ConvolutionFilter(1);
        // @ts-ignore
        filter.matrixX = "10";
        expect(filter.matrixX).toBe(10);
    });

    it("matrixX test valid case3", () =>
    {
        // @ts-ignore
        let filter = new ConvolutionFilter("test");
        expect(filter.matrixX).toBe(0);
    });

    it("matrixX test valid case4", () =>
    {
        let filter = new ConvolutionFilter(1);
        // @ts-ignore
        filter.matrixX = "abc";
        expect(filter.matrixX).toBe(0);
    });

    // matrixY
    it("matrixY test success case1", () =>
    {
        let filter = new ConvolutionFilter(3, 0);
        expect(filter.matrixY).toBe(0);
    });

    it("matrixY test success case2", () =>
    {
        let filter = new ConvolutionFilter(3, 0);
        filter.matrixY = 10;
        expect(filter.matrixY).toBe(10);
    });

    it("matrixY test valid case1", () =>
    {
        // @ts-ignore
        let filter = new ConvolutionFilter(2, "10");
        expect(filter.matrixY).toBe(10);
    });

    it("matrixY test valid case2", () =>
    {
        let filter = new ConvolutionFilter(3, 1);
        // @ts-ignore
        filter.matrixY = "10";
        expect(filter.matrixY).toBe(10);
    });

    it("matrixY test valid case3", () =>
    {
        // @ts-ignore
        let filter = new ConvolutionFilter(3, "test");
        expect(filter.matrixY).toBe(0);
    });

    it("matrixY test valid case4", () =>
    {
        let filter = new ConvolutionFilter(3, 1);
        // @ts-ignore
        filter.matrixY = "abc";
        expect(filter.matrixY).toBe(0);
    });

    // matrix
    it("matrix test success case1", () =>
    {
        let filter = new ConvolutionFilter(3, 1, [1,2,3,4,5,6,7,8,9]);
        // @ts-ignore
        expect(filter.matrix.length).toBe(9);
    });

    it("matrix test success case2", () =>
    {
        let filter = new ConvolutionFilter(3, 1, null);
        filter.matrix = [1,2,3,4,5,6,7,8,9];
        // @ts-ignore
        expect(filter.matrix.length).toBe(9);
    });

    it("matrix test valid case1", () =>
    {
        // @ts-ignore
        let filter = new ConvolutionFilter(3, 1, {});
        expect(filter.matrix).toBe(null);
    });

    // divisor
    it("divisor test success case1", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 2);
        expect(filter.divisor).toBe(2);
    });

    it("divisor test success case2", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 2);
        filter.divisor = 4.5;
        expect(filter.divisor).toBe(4);
    });

    it("divisor test valid case1", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0);
        expect(filter.divisor).toBe(0);
    });

    it("divisor test valid case2", () =>
    {
        // @ts-ignore
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], "4");
        expect(filter.divisor).toBe(4);
    });

    it("divisor test valid case3", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 2);
        // @ts-ignore
        filter.divisor = "3";
        expect(filter.divisor).toBe(3);
    });

    // bias
    it("bias test success case1", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 2);
        expect(filter.bias).toBe(2);
    });

    it("bias test success case2", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 2);
        filter.bias = 4.5;
        expect(filter.bias).toBe(4);
    });

    it("bias test valid case1", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 0);
        expect(filter.bias).toBe(0);
    });

    it("bias test valid case2", () =>
    {
        // @ts-ignore
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, "4");
        expect(filter.bias).toBe(4);
    });

    it("bias test valid case3", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 2);
        // @ts-ignore
        filter.bias = "3";
        expect(filter.bias).toBe(3);
    });

    // preserveAlpha
    it("preserveAlpha test success case1", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 2, false);
        expect(filter.preserveAlpha).toBe(false);
    });

    it("preserveAlpha test success case2", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 2, true);
        filter.preserveAlpha = false;
        expect(filter.preserveAlpha).toBe(false);
    });

    it("preserveAlpha test valid case1", () =>
    {
        // @ts-ignore
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, "");
        expect(filter.preserveAlpha).toBe(false);
    });

    it("preserveAlpha test valid case2", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true);
        // @ts-ignore
        filter.preserveAlpha = "";
        expect(filter.preserveAlpha).toBe(false);
    });

    it("preserveAlpha test valid case3", () =>
    {
        // @ts-ignore
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, "abc");
        expect(filter.preserveAlpha).toBe(true);
    });

    it("preserveAlpha test valid case4", () =>
    {
        // @ts-ignore
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, []);
        expect(filter.preserveAlpha).toBe(true);
    });

    it("preserveAlpha test valid case5", () =>
    {
        // @ts-ignore
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, {});
        expect(filter.preserveAlpha).toBe(true);
    });

    // clamp
    it("clamp test success case1", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true);
        expect(filter.clamp).toBe(true);
    });

    it("clamp test success case2", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true);
        filter.clamp = false;
        expect(filter.clamp).toBe(false);
    });

    it("clamp test valid case1", () =>
    {
        // @ts-ignore
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, 1);
        expect(filter.clamp).toBe(true);
    });

    it("clamp test valid case2", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, false);
        // @ts-ignore
        filter.clamp = 1;
        expect(filter.clamp).toBe(true);
    });

    it("clamp test valid case3", () =>
    {
        // @ts-ignore
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, 0);
        expect(filter.clamp).toBe(false);
    });

    it("clamp test valid case4", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true);
        // @ts-ignore
        filter.clamp = 0;
        expect(filter.clamp).toBe(false);
    });

    it("clamp test valid case5", () =>
    {
        // @ts-ignore
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, "test");
        expect(filter.clamp).toBe(true);
    });

    it("clamp test valid case6", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true);
        // @ts-ignore
        filter.clamp = "";
        expect(filter.clamp).toBe(false);
    });

    it("clamp test valid case7", () =>
    {
        // @ts-ignore
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, {});
        expect(filter.clamp).toBe(true);
    });

    it("clamp test valid case8", () =>
    {
        // @ts-ignore
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, []);
        expect(filter.clamp).toBe(true);
    });

    // color
    it("color test success case1", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, 0);
        expect(filter.color).toBe(0);
    });

    it("color test success case2", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, 0xff0000);
        filter.color = 0x00ff00;
        expect(filter.color).toBe(0x00ff00);
    });

    it("color test valid case3", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, -10);
        expect(filter.color).toBe(0);
    });

    it("color test valid case4", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, 16777220);
        expect(filter.color).toBe(0xffffff);
    });

    // alpha
    it("alpha test success case1", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, 0xffffff, 0);
        expect(filter.alpha).toBe(0);
    });

    it("alpha test success case2", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, 0xffffff, 0.5);
        filter.alpha = 0.75;
        expect(filter.alpha).toBe(0.75);
    });

    it("alpha test valid case1", () =>
    {
        // @ts-ignore
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, 0xffffff, "0.25");
        expect(filter.alpha).toBe(0.25);
    });

    it("alpha test valid case2", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, 0xffffff, -10);
        expect(filter.alpha).toBe(0);
    });

    it("alpha test valid case3", () =>
    {
        let filter = new ConvolutionFilter(3, 3, [1,2,3,4,5,6,7,8,9], 0, 10, true, true, 0xffffff, 10);
        expect(filter.alpha).toBe(1);
    });
});

describe("ConvolutionFilter.js clone test", () =>
{

    it("clone test", () =>
    {
        let filter = new ConvolutionFilter(
            2, 2, [1,2,3,4], 2, 1,
            false, false, 0xff0000, 1
        );
        let clone  = filter.clone();

        // clone check
        expect(clone.matrixX).toBe(2);
        expect(clone.matrixY).toBe(2);
        // @ts-ignore
        expect(clone.matrix[0]).toBe(1);
        // @ts-ignore
        expect(clone.matrix[1]).toBe(2);
        // @ts-ignore
        expect(clone.matrix[2]).toBe(3);
        // @ts-ignore
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
        // @ts-ignore
        expect(filter.matrix[0]).toBe(1);
        // @ts-ignore
        expect(filter.matrix[1]).toBe(2);
        // @ts-ignore
        expect(filter.matrix[2]).toBe(3);
        // @ts-ignore
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
        // @ts-ignore
        expect(clone.matrix[0]).toBe(1);
        // @ts-ignore
        expect(clone.matrix[1]).toBe(2);
        // @ts-ignore
        expect(clone.matrix[2]).toBe(3);
        // @ts-ignore
        expect(clone.matrix[3]).toBe(4);
        // @ts-ignore
        expect(clone.matrix[4]).toBe(5);
        // @ts-ignore
        expect(clone.matrix[5]).toBe(6);
        // @ts-ignore
        expect(clone.matrix[6]).toBe(7);
        // @ts-ignore
        expect(clone.matrix[7]).toBe(8);
        // @ts-ignore
        expect(clone.matrix[8]).toBe(9);
        expect(clone.divisor).toBe(1);
        expect(clone.bias).toBe(2);
        expect(clone.preserveAlpha).toBe(true);
        expect(clone.clamp).toBe(true);
        expect(clone.color).toBe(0xffffff);
        expect(clone.alpha).toBe(0.5);

    });

});

describe("ConvolutionFilter.js clamp test", () =>
{

    it("default test case1", () =>
    {
        let cf = new ConvolutionFilter();
        expect(cf.clamp).toBe(true);
    });

    it("default test case2", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.clamp = null;
        expect(cf.clamp).toBe(false);
    });

    it("default test case3", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.clamp = undefined;
        expect(cf.clamp).toBe(false);
    });

    it("default test case4", () =>
    {
        let cf = new ConvolutionFilter();
        cf.clamp = true;
        expect(cf.clamp).toBe(true);
    });

    it("default test case5", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.clamp = "";
        expect(cf.clamp).toBe(false);
    });

    it("default test case6", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.clamp = "abc";
        expect(cf.clamp).toBe(true);
    });

    it("default test case7", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.clamp = 0;
        expect(cf.clamp).toBe(false);
    });

    it("default test case8", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.clamp = 1;
        expect(cf.clamp).toBe(true);
    });

    it("default test case9", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.clamp = 500;
        expect(cf.clamp).toBe(true);
    });

    it("default test case10", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.clamp = 50000000000000000;
        expect(cf.clamp).toBe(true);
    });

    it("default test case11", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.clamp = -1;
        expect(cf.clamp).toBe(true);
    });

    it("default test case12", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.clamp = -500;
        expect(cf.clamp).toBe(true);
    });

    it("default test case13", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.clamp = -50000000000000000;
        expect(cf.clamp).toBe(true);
    });

    it("default test case14", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.clamp = { "a":0 };
        expect(cf.clamp).toBe(true);
    });

    it("default test case15", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.clamp = function a() {};
        expect(cf.clamp).toBe(true);
    });

    it("default test case16", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.clamp = [1];
        expect(cf.clamp).toBe(true);
    });

    it("default test case17", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.clamp = [1,2];
        expect(cf.clamp).toBe(true);
    });

    it("default test case18", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.clamp = {};
        expect(cf.clamp).toBe(true);
    });

    it("default test case19", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.clamp = { "toString":() => { return 1 } };
        expect(cf.clamp).toBe(true);
    });

    it("default test case20", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.clamp = { "toString":() => { return "1" } };
        expect(cf.clamp).toBe(true);
    });

    it("default test case21", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.clamp = { "toString":() => { return "1a" } };
        expect(cf.clamp).toBe(true);
    });

});

describe("ConvolutionFilter.js preserveAlpha test", () =>
{

    it("default test case1", () =>
    {
        let cf = new ConvolutionFilter();
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case2", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.preserveAlpha = null;
        expect(cf.preserveAlpha).toBe(false);
    });

    it("default test case3", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.preserveAlpha = undefined;
        expect(cf.preserveAlpha).toBe(false);
    });

    it("default test case4", () =>
    {
        let cf = new ConvolutionFilter();
        cf.preserveAlpha = true;
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case5", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.preserveAlpha = "";
        expect(cf.preserveAlpha).toBe(false);
    });

    it("default test case6", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.preserveAlpha = "abc";
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case7", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.preserveAlpha = 0;
        expect(cf.preserveAlpha).toBe(false);
    });

    it("default test case8", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.preserveAlpha = 1;
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case9", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.preserveAlpha = 500;
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case10", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.preserveAlpha = 50000000000000000;
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case11", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.preserveAlpha = -1;
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case12", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.preserveAlpha = -500;
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case13", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.preserveAlpha = -50000000000000000;
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case14", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.preserveAlpha = { "a":0 };
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case15", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.preserveAlpha = function a() {};
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case16", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.preserveAlpha = [1];
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case17", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.preserveAlpha = [1,2];
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case18", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.preserveAlpha = {};
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case19", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.preserveAlpha = { "toString":() => { return 1 } };
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case20", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.preserveAlpha = { "toString":() => { return "1" } };
        expect(cf.preserveAlpha).toBe(true);
    });

    it("default test case21", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.preserveAlpha = { "toString":() => { return "1a" } };
        expect(cf.preserveAlpha).toBe(true);
    });

});

describe("ConvolutionFilter.js alpha test", () =>
{

    it("default test case1", () =>
    {
        let cf = new ConvolutionFilter();
        expect(cf.alpha).toBe(0);
    });

    it("default test case2", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.alpha = null;
        expect(cf.alpha).toBe(0);
    });

    it("default test case3", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.alpha = undefined;
        expect(cf.alpha).toBe(0);
    });

    it("default test case4", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.alpha = true;
        expect(cf.alpha).toBe(1);
    });

    it("default test case5", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.alpha = "";
        expect(cf.alpha).toBe(0);
    });

    it("default test case6", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.alpha = "abc";
        expect(cf.alpha).toBe(0);
    });

    it("default test case7", () =>
    {
        let cf = new ConvolutionFilter();
        cf.alpha = 0;
        expect(cf.alpha).toBe(0);
    });

    it("default test case8", () =>
    {
        let cf = new ConvolutionFilter();
        cf.alpha = 1;
        expect(cf.alpha).toBe(1);
    });

    it("default test case9", () =>
    {
        let cf = new ConvolutionFilter();
        cf.alpha = 500;
        expect(cf.alpha).toBe(1);
    });

    it("default test case10", () =>
    {
        let cf = new ConvolutionFilter();
        cf.alpha = 50000000000000000;
        expect(cf.alpha).toBe(1);
    });

    it("default test case11", () =>
    {
        let cf = new ConvolutionFilter();
        cf.alpha = -1;
        expect(cf.alpha).toBe(0);
    });

    it("default test case12", () =>
    {
        let cf = new ConvolutionFilter();
        cf.alpha = -500;
        expect(cf.alpha).toBe(0);
    });

    it("default test case13", () =>
    {
        let cf = new ConvolutionFilter();
        cf.alpha = -50000000000000000;
        expect(cf.alpha).toBe(0);
    });

    it("default test case14", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.alpha = { "a":0 };
        expect(cf.alpha).toBe(0);
    });

    it("default test case15", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.alpha = function a() {};
        expect(cf.alpha).toBe(0);
    });

    it("default test case16", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.alpha = [1];
        expect(cf.alpha).toBe(1);
    });

    it("default test case17", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.alpha = [1,2];
        expect(cf.alpha).toBe(0);
    });

    it("default test case18", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.alpha = {};
        expect(cf.alpha).toBe(0);
    });

    it("default test case19", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.alpha = { "toString":() => { return 1 } };
        expect(cf.alpha).toBe(1);
    });

    it("default test case20", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.alpha = { "toString":() => { return "1" } };
        expect(cf.alpha).toBe(1);
    });

    it("default test case21", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.alpha = { "toString":() => { return "1a" } };
        expect(cf.alpha).toBe(0);
    });

});

describe("ConvolutionFilter.js bias test", () =>
{

    it("default test case1", () =>
    {
        let cf = new ConvolutionFilter();
        expect(cf.bias).toBe(0);
    });

    it("default test case4", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.bias = true;
        expect(cf.bias).toBe(1);
    });

    it("default test case5", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.bias = "";
        expect(cf.bias).toBe(0);
    });

    it("default test case7", () =>
    {
        let cf = new ConvolutionFilter();
        cf.bias = 0;
        expect(cf.bias).toBe(0);
    });

    it("default test case8", () =>
    {
        let cf = new ConvolutionFilter();
        cf.bias = 1;
        expect(cf.bias).toBe(1);
    });

    it("default test case9", () =>
    {
        let cf = new ConvolutionFilter();
        cf.bias = 500;
        expect(cf.bias).toBe(500);
    });

    it("default test case11", () =>
    {
        let cf = new ConvolutionFilter();
        cf.bias = -1;
        expect(cf.bias).toBe(-1);
    });

    it("default test case12", () =>
    {
        let cf = new ConvolutionFilter();
        cf.bias = -500;
        expect(cf.bias).toBe(-500);
    });

});

describe("ConvolutionFilter.js color test", () =>
{

    it("default test case1", () =>
    {
        let cf = new ConvolutionFilter();
        expect(cf.color).toBe(0);
    });

    it("default test case7", () =>
    {
        let cf = new ConvolutionFilter();
        cf.color = 0;
        expect(cf.color).toBe(0);
    });

    it("default test case8", () =>
    {
        let cf = new ConvolutionFilter();
        cf.color = 1;
        expect(cf.color).toBe(1);
    });

    it("default test case9", () =>
    {
        let cf = new ConvolutionFilter();
        cf.color = 500;
        expect(cf.color).toBe(500);
    });

    it("default test case10", () =>
    {
        let cf = new ConvolutionFilter();
        cf.color = 50000000000000000;
        expect(cf.color).toBe(0xffffff);
    });

    it("default test case11", () =>
    {
        let cf = new ConvolutionFilter();
        cf.color = -1;
        expect(cf.color).toBe(0);
    });

    it("default test case12", () =>
    {
        let cf = new ConvolutionFilter();
        cf.color = -500;
        expect(cf.color).toBe(0);
    });

    it("default test case13", () =>
    {
        let cf = new ConvolutionFilter();
        cf.color = -50000000000000000;
        expect(cf.color).toBe(0);
    });
});

describe("ConvolutionFilter.js divisor test", () =>
{

    it("default test case1", () =>
    {
        let cf = new ConvolutionFilter();
        expect(cf.divisor).toBe(1);
    });

    it("default test case2", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.divisor = null;
        expect(cf.divisor).toBe(0);
    });

    it("default test case7", () =>
    {
        let cf = new ConvolutionFilter();
        cf.divisor = 0;
        expect(cf.divisor).toBe(0);
    });

    it("default test case8", () =>
    {
        let cf = new ConvolutionFilter();
        cf.divisor = 1;
        expect(cf.divisor).toBe(1);
    });

    it("default test case9", () =>
    {
        let cf = new ConvolutionFilter();
        cf.divisor = 500;
        expect(cf.divisor).toBe(500);
    });

    it("default test case11", () =>
    {
        let cf = new ConvolutionFilter();
        cf.divisor = -1;
        expect(cf.divisor).toBe(-1);
    });

    it("default test case12", () =>
    {
        let cf = new ConvolutionFilter();
        cf.divisor = -500;
        expect(cf.divisor).toBe(-500);
    });
});

describe("ConvolutionFilter.js matrixX test", () =>
{

    it("default test case1", () =>
    {
        let cf = new ConvolutionFilter();
        expect(cf.matrixX).toBe(0);
    });

    it("default test case4", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.matrixX = true;
        expect(cf.matrixX).toBe(1);
    });

    it("default test case5", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.matrixX = "";
        expect(cf.matrixX).toBe(0);
    });

    it("default test case6", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.matrixX = "abc";
        expect(cf.matrixX).toBe(0);
    });

    it("default test case7", () =>
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = 0;
        expect(cf.matrixX).toBe(0);
    });

    it("default test case8", () =>
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = 1;
        expect(cf.matrixX).toBe(1);
    });

    it("default test case9", () =>
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = 500;
        expect(cf.matrixX).toBe(15);
    });

    it("default test case10", () =>
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = 50000000000000000;
        expect(cf.matrixX).toBe(15);
    });

    it("default test case11", () =>
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = -1;
        expect(cf.matrixX).toBe(0);
    });

    it("default test case12", () =>
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = -500;
        expect(cf.matrixX).toBe(0);
    });

    it("default test case13", () =>
    {
        let cf = new ConvolutionFilter();
        cf.matrixX = -50000000000000000;
        expect(cf.matrixX).toBe(0);
    });
});

describe("ConvolutionFilter.js matrixY test", () =>
{

    it("default test case1", () =>
    {
        let cf = new ConvolutionFilter();
        expect(cf.matrixY).toBe(0);
    });

    it("default test case2", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.matrixY = null;
        expect(cf.matrixY).toBe(0);
    });

    it("default test case3", () =>
    {
        let cf = new ConvolutionFilter();
        // @ts-ignore
        cf.matrixY = undefined;
        expect(cf.matrixY).toBe(0);
    });

    it("default test case7", () =>
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = 0;
        expect(cf.matrixY).toBe(0);
    });

    it("default test case8", () =>
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = 1;
        expect(cf.matrixY).toBe(1);
    });

    it("default test case9", () =>
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = 500;
        expect(cf.matrixY).toBe(15);
    });

    it("default test case10", () =>
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = 50000000000000000;
        expect(cf.matrixY).toBe(15);
    });

    it("default test case11", () =>
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = -1;
        expect(cf.matrixY).toBe(0);
    });

    it("default test case12", () =>
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = -500;
        expect(cf.matrixY).toBe(0);
    });

    it("default test case13", () =>
    {
        let cf = new ConvolutionFilter();
        cf.matrixY = -50000000000000000;
        expect(cf.matrixY).toBe(0);
    });
});