import { BevelFilter } from "./BevelFilter";
import { describe, expect, it } from "vitest";

describe("BevelFilter.js default property test", () =>
{
    it("test case", () =>
    {
        const bevelFilter = new BevelFilter();
        expect(bevelFilter.angle).toBe(45);
        expect(bevelFilter.blurX).toBe(4);
        expect(bevelFilter.blurY).toBe(4);
        expect(bevelFilter.distance).toBe(4);
        expect(bevelFilter.highlightAlpha).toBe(1);
        expect(bevelFilter.highlightColor).toBe(0xffffff);
        expect(bevelFilter.knockout).toBe(false);
        expect(bevelFilter.quality).toBe(1);
        expect(bevelFilter.shadowAlpha).toBe(1);
        expect(bevelFilter.shadowColor).toBe(0x000000);
        expect(bevelFilter.strength).toBe(1);
        expect(bevelFilter.type).toBe("inner");
    });
});

describe("BevelFilter.js knockout test", () =>
{
    it("test case1", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.knockout = null;
        expect(bevelFilter.knockout).toBe(false);
    });

    it("test case2", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.knockout = undefined;
        expect(bevelFilter.knockout).toBe(false);
    });

    it("test case3", () =>
    {
        const bevelFilter = new BevelFilter();

        bevelFilter.$updated = false;
        expect(bevelFilter.$updated).toBe(false);
        expect(bevelFilter.knockout).toBe(false);

        bevelFilter.knockout = true;
        expect(bevelFilter.$updated).toBe(true);
        expect(bevelFilter.knockout).toBe(true);
    });

    it("test case4", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.knockout = "";
        expect(bevelFilter.knockout).toBe(false);
    });

    it("test case5", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.knockout = 0;
        expect(bevelFilter.knockout).toBe(false);
    });

    it("test case6", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.knockout = 1;
        expect(bevelFilter.knockout).toBe(true);
    });
});

describe("BevelFilter.js angle test", () =>
{
    it("test case1", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.angle = null;
        expect(bevelFilter.angle).toBe(0);
    });

    it("test case2", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.angle = undefined;
        expect(bevelFilter.angle).toBe(45);
    });

    it("test case2", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.angle = true;
        expect(bevelFilter.angle).toBe(1);
    });

    it("test case3", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.angle = "";
        expect(bevelFilter.angle).toBe(0);
    });

    it("test case4", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.angle = "abc";
        expect(bevelFilter.angle).toBe(45);
    });

    it("test case5", () =>
    {
        const bevelFilter = new BevelFilter();

        bevelFilter.$updated = false;
        expect(bevelFilter.$updated).toBe(false);

        bevelFilter.angle = 0;
        expect(bevelFilter.angle).toBe(0);
        expect(bevelFilter.$updated).toBe(true);
    });
});

describe("BevelFilter.js blurX test", () =>
{
    it("test case1", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.blurX = null;
        expect(bevelFilter.blurX).toBe(0);
    });

    it("test case2", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.blurX = undefined;
        expect(bevelFilter.blurX).toBe(0);
    });

    it("test case3", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.blurX = true;
        expect(bevelFilter.blurX).toBe(1);
    });

    it("test case4", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.blurX = "";
        expect(bevelFilter.blurX).toBe(0);
    });

    it("test case5", () =>
    {
        let bf = new BevelFilter();
        // @ts-ignore
        bf.blurX = "abc";
        expect(bf.blurX).toBe(0);
    });

    it("test case6", () =>
    {
        const bevelFilter = new BevelFilter();
        
        bevelFilter.$updated = false;
        expect(bevelFilter.$updated).toBe(false);

        bevelFilter.blurX = 0;
        expect(bevelFilter.blurX).toBe(0);
        expect(bevelFilter.$updated).toBe(true);
    });
});

describe("BevelFilter.js distance test", () =>
{
    it("test case1", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.distance = null;
        expect(bevelFilter.distance).toBe(0);
    });

    it("test case2", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.distance = undefined;
        expect(bevelFilter.distance).toBe(4);
    });

    it("test case3", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.distance = true;
        expect(bevelFilter.distance).toBe(1);
    });

    it("test case4", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.distance = "";
        expect(bevelFilter.distance).toBe(0);
    });

    it("test case5", () =>
    {
        const bevelFilter = new BevelFilter();

        bevelFilter.$updated = false;
        expect(bevelFilter.$updated).toBe(false);

        bevelFilter.distance = 0;
        expect(bevelFilter.distance).toBe(0);
        expect(bevelFilter.$updated).toBe(true);
    });
});

describe("BevelFilter.js highlightAlpha test", () =>
{
    it("test case1", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.highlightAlpha = null;
        expect(bevelFilter.highlightAlpha).toBe(0);
    });

    it("test case2", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.highlightAlpha = undefined;
        expect(bevelFilter.highlightAlpha).toBe(0);
    });

    it("test case3", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.highlightAlpha = true;
        expect(bevelFilter.highlightAlpha).toBe(1);
    });

    it("test case4", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.highlightAlpha = "";
        expect(bevelFilter.highlightAlpha).toBe(0);
    });

    it("test case5", () =>
    {
        const bevelFilter = new BevelFilter();

        bevelFilter.$updated = false;
        expect(bevelFilter.$updated).toBe(false);

        bevelFilter.highlightAlpha = 0;
        expect(bevelFilter.highlightAlpha).toBe(0);
        expect(bevelFilter.$updated).toBe(true);
    });
});

describe("BevelFilter.js highlightColor test", () =>
{
    it("test case1", () =>
    {
        const bevelFilter = new BevelFilter();

        bevelFilter.$updated = false;
        expect(bevelFilter.$updated).toBe(false);

        bevelFilter.highlightColor = 0;
        expect(bevelFilter.highlightColor).toBe(0);
        expect(bevelFilter.$updated).toBe(true);
    });

    it("test case2", () =>
    {
        const bevelFilter = new BevelFilter();
        bevelFilter.highlightColor = 0xffffffff;
        expect(bevelFilter.highlightColor).toBe(0xffffff);
    });

    it("test case3", () =>
    {
        const bevelFilter = new BevelFilter();
        bevelFilter.highlightColor = -1;
        expect(bevelFilter.highlightColor).toBe(0);
    });

    it("test case4", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.highlightColor = null;
        expect(bevelFilter.highlightColor).toBe(0);
    });

    it("test case5", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.highlightColor = undefined;
        expect(bevelFilter.highlightColor).toBe(0xffffff);
    });

    it("test case6", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.highlightColor = true;
        expect(bevelFilter.highlightColor).toBe(1);
    });
});

describe("BevelFilter.js quality test", () =>
{
    it("test case1", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.quality = null;
        expect(bevelFilter.quality).toBe(0);
    });

    it("test case2", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.quality = undefined;
        expect(bevelFilter.quality).toBe(0);
    });

    it("test case3", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.quality = true;
        expect(bevelFilter.quality).toBe(1);
    });

    it("test case4", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.quality = "";
        expect(bevelFilter.quality).toBe(0);
    });

    it("test case5", () =>
    {
        const bevelFilter = new BevelFilter();

        bevelFilter.$updated = false;
        expect(bevelFilter.$updated).toBe(false);

        bevelFilter.quality = 0;
        expect(bevelFilter.quality).toBe(0);
        expect(bevelFilter.$updated).toBe(true);
    });
});

describe("BevelFilter.js shadowAlpha test", () =>
{
    it("test case1", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.shadowAlpha = null;
        expect(bevelFilter.shadowAlpha).toBe(0);
    });

    it("test case2", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.shadowAlpha = undefined;
        expect(bevelFilter.shadowAlpha).toBe(0);
    });

    it("test case3", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.shadowAlpha = true;
        expect(bevelFilter.shadowAlpha).toBe(1);
    });

    it("test case4", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.shadowAlpha = "";
        expect(bevelFilter.shadowAlpha).toBe(0);
    });

    it("test case5", () =>
    {
        const bevelFilter = new BevelFilter();

        bevelFilter.$updated = false;
        expect(bevelFilter.$updated).toBe(false);

        bevelFilter.shadowAlpha = 0;
        expect(bevelFilter.shadowAlpha).toBe(0);
        expect(bevelFilter.$updated).toBe(true);
    });
});

describe("BevelFilter.js shadowColor test", () =>
{
    it("test case1", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.shadowColor = null;
        expect(bevelFilter.shadowColor).toBe(0);
    });

    it("test case2", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.shadowColor = undefined;
        expect(bevelFilter.shadowColor).toBe(0);
    });
    
    it("test case3", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.shadowColor = true;
        expect(bevelFilter.shadowColor).toBe(1);
    });

    it("test case4", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.shadowColor = "";
        expect(bevelFilter.shadowColor).toBe(0);
    });

    it("test case5", () =>
    {
        const bevelFilter = new BevelFilter();

        bevelFilter.$updated = false;
        expect(bevelFilter.$updated).toBe(false);

        bevelFilter.shadowColor = 100;
        expect(bevelFilter.shadowColor).toBe(100);
        expect(bevelFilter.$updated).toBe(true);
    });

    it("test case6", () =>
    {
        const bevelFilter = new BevelFilter();
        bevelFilter.shadowColor = 0xffffffff;
        expect(bevelFilter.shadowColor).toBe(0xffffff);
    });

    it("test case7", () =>
    {
        const bevelFilter = new BevelFilter();
        bevelFilter.shadowColor = -1;
        expect(bevelFilter.shadowColor).toBe(0);
    });
});

describe("BevelFilter.js strength test", () =>
{
    it("test case1", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.strength = null;
        expect(bevelFilter.strength).toBe(0);
    });

    it("test case2", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.strength = undefined;
        expect(bevelFilter.strength).toBe(0);
    });

    it("test case3", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.strength = true;
        expect(bevelFilter.strength).toBe(1);
    });

    it("test case4", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.strength = "";
        expect(bevelFilter.strength).toBe(0);
    });

    it("test case5", () =>
    {
        const bevelFilter = new BevelFilter();

        bevelFilter.$updated = false;
        expect(bevelFilter.$updated).toBe(false);

        bevelFilter.strength = 0;
        expect(bevelFilter.strength).toBe(0);
        expect(bevelFilter.$updated).toBe(true);
    });
});

describe("BevelFilter.js type test", () =>
{
    it("test case1", () =>
    {
        const bevelFilter = new BevelFilter();

        bevelFilter.$updated = false;
        expect(bevelFilter.$updated).toBe(false);

        bevelFilter.type = "full";
        expect(bevelFilter.type).toBe("full");
        expect(bevelFilter.$updated).toBe(true);
    });

    it("test case2", () =>
    {
        const bevelFilter = new BevelFilter();
        bevelFilter.type = "outer";
        expect(bevelFilter.type).toBe("outer");
    });

    it("test case3", () =>
    {
        const bevelFilter = new BevelFilter();
        // @ts-ignore
        bevelFilter.type = "abc";
        expect(bevelFilter.type).toBe("inner");
    });
});