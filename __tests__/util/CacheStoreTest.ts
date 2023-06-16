import { CacheStore } from "../../src/player/util/CacheStore";

describe("CacheStore.js packages test", () =>
{

    it("generateHash test case1", () =>
    {
        const cacheStore = new CacheStore();
        expect(cacheStore.generateHash("test")).toBe("_3556498");
    });

    it("colorToString test case1", () =>
    {
        const cacheStore = new CacheStore();
        expect(cacheStore.colorToString(new Float32Array([1,1,1,1,0,0,0,0])))
            .toBe("");

        expect(cacheStore.colorToString(new Float32Array([1,1,1,1,0,0,0,10])))
            .toBe("_10");
    });

    it("generateKeys test case1", () =>
    {
        const cacheStore = new CacheStore();
        const color = new Float32Array([1,1,1,1,0,0,0,10]);
        expect(cacheStore.generateKeys(1, [1, 1], color))
            .toEqual(["1", "_1492115515"]);

        expect(cacheStore.generateKeys(10, [1.2242, 2.098], color))
            .toEqual(["10", "_-103490129"]);
    });

    it("get set has remove test case1", () =>
    {
        const cacheStore = new CacheStore();
        const color = new Float32Array([1,1,1,1,0,0,0,10]);

        const keys = cacheStore.generateKeys(1, [1, 1], color);
        expect(cacheStore.has(keys)).toBe(false);

        cacheStore.set(keys, "sample");
        expect(cacheStore.has(keys)).toBe(true);

        expect(cacheStore.get(keys)).toBe("sample");

        cacheStore.set(keys, null);
        expect(cacheStore.has(keys)).toBe(false);
    });
});