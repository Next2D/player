import { BlurFilter } from "./BlurFilter";
import { describe, expect, it } from "vitest";

describe("BlurFilter.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new BlurFilter().namespace).toBe("next2d.filters.BlurFilter");
    });

    it("namespace test static", () =>
    {
        expect(BlurFilter.namespace).toBe("next2d.filters.BlurFilter");
    });
});

describe("BlurFilter.js property test", () =>
{
    it("default test success", () =>
    {
        const blurFilter = new BlurFilter();
        expect(blurFilter.blurX).toBe(4);
        expect(blurFilter.blurY).toBe(4);
        expect(blurFilter.quality).toBe(1);
    });
});

describe("BlurFilter.js blurX test", () =>
{
    it("test case1", () =>
    {
        const blurFilter = new BlurFilter();
        // @ts-ignore
        blurFilter.blurX = null;
        expect(blurFilter.blurX).toBe(0);
    });

    it("test case2", () =>
    {
        const blurFilter = new BlurFilter();
        // @ts-ignore
        blurFilter.blurX = undefined;
        expect(blurFilter.blurX).toBe(0);
    });

    it("test case3", () =>
    {
        const blurFilter = new BlurFilter();
        // @ts-ignore
        blurFilter.blurX = true;
        expect(blurFilter.blurX).toBe(1);
    });

    it("test case4", () =>
    {
        const blurFilter = new BlurFilter();
        // @ts-ignore
        blurFilter.blurX = "";
        expect(blurFilter.blurX).toBe(0);
    });

    it("test case5", () =>
    {
        const blurFilter = new BlurFilter();

        blurFilter.$updated = false;
        expect(blurFilter.$updated).toBe(false);

        blurFilter.blurX = 10;
        expect(blurFilter.blurX).toBe(10);
        expect(blurFilter.$updated).toBe(true);
    });

    it("test case6", () =>
    {
        const blurFilter = new BlurFilter();
        blurFilter.blurX = 1000;
        expect(blurFilter.blurX).toBe(255);
    });

    it("test case7", () =>
    {
        const blurFilter = new BlurFilter();
        blurFilter.blurX = -500;
        expect(blurFilter.blurX).toBe(0);
    });
});

describe("BlurFilter.js blurY test", () =>
{
    it("test case1", () =>
    {
        const blurFilter = new BlurFilter();
        // @ts-ignore
        blurFilter.blurY = null;
        expect(blurFilter.blurY).toBe(0);
    });

    it("test case2", () =>
    {
        const blurFilter = new BlurFilter();
        // @ts-ignore
        blurFilter.blurY = undefined;
        expect(blurFilter.blurY).toBe(0);
    });

    it("test case3", () =>
    {
        const blurFilter = new BlurFilter();
        // @ts-ignore
        blurFilter.blurY = true;
        expect(blurFilter.blurY).toBe(1);
    });

    it("test case4", () =>
    {
        const blurFilter = new BlurFilter();
        // @ts-ignore
        blurFilter.blurY = "";
        expect(blurFilter.blurY).toBe(0);
    });

    it("test case5", () =>
    {
        const blurFilter = new BlurFilter();

        blurFilter.$updated = false;
        expect(blurFilter.$updated).toBe(false);

        blurFilter.blurY = 10;
        expect(blurFilter.blurY).toBe(10);
        expect(blurFilter.$updated).toBe(true);
    });

    it("test case6", () =>
    {
        const blurFilter = new BlurFilter();
        blurFilter.blurY = 1000;
        expect(blurFilter.blurY).toBe(255);
    });

    it("test case7", () =>
    {
        const blurFilter = new BlurFilter();
        blurFilter.blurY = -500;
        expect(blurFilter.blurY).toBe(0);
    });
});

describe("BlurFilter.js quality test", () =>
{
    it("test case1", () =>
    {
        const blurFilter = new BlurFilter();
        // @ts-ignore
        blurFilter.quality = null;
        expect(blurFilter.quality).toBe(0);
    });

    it("test case2", () =>
    {
        const blurFilter = new BlurFilter();
        // @ts-ignore
        blurFilter.quality = undefined;
        expect(blurFilter.quality).toBe(0);
    });

    it("test case3", () =>
    {
        const blurFilter = new BlurFilter();
        // @ts-ignore
        blurFilter.quality = true;
        expect(blurFilter.quality).toBe(1);
    });

    it("test case4", () =>
    {
        const blurFilter = new BlurFilter();
        // @ts-ignore
        blurFilter.quality = "";
        expect(blurFilter.quality).toBe(0);
    });

    it("test case5", () =>
    {
        const blurFilter = new BlurFilter();

        blurFilter.$updated = false;
        expect(blurFilter.$updated).toBe(false);

        blurFilter.quality = 10;
        expect(blurFilter.quality).toBe(10);
        expect(blurFilter.$updated).toBe(true);
    });

    it("test case6", () =>
    {
        const blurFilter = new BlurFilter();
        // @ts-ignore
        blurFilter.quality = 1000;
        expect(blurFilter.quality).toBe(15);
    });

    it("test case7", () =>
    {
        const blurFilter = new BlurFilter();
        // @ts-ignore
        blurFilter.quality = -500;
        expect(blurFilter.quality).toBe(0);
    });
});
