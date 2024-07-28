import { execute } from "./CacheStoreGenerateKeysService";
import { describe, expect, it } from "vitest";

describe("CacheStoreGenerateKeysService.js test", () =>
{
    it("test case1", () =>
    {
        const keys = [];
        expect(keys.length).toBe(0);

        execute("1", keys);

        expect(keys.length).toBe(2);
        expect(keys[0]).toBe("1");
        expect(keys[1]).toBe("0");
    });

    it("test case2", () =>
    {
        const keys = [];
        expect(keys.length).toBe(0);

        execute("2", keys, [0.25, 0.5]);

        expect(keys.length).toBe(2);
        expect(keys[0]).toBe("2");
        expect(keys[1]).toBe("1409295737");
    });

    it("test case3", () =>
    {
        const keys = [];
        expect(keys.length).toBe(0);

        execute("2", keys, [0.25, 0.5], new Float32Array([1,1,1,1,0,0,0,0.3]));

        expect(keys.length).toBe(2);
        expect(keys[0]).toBe("2");
        expect(keys[1]).toBe("-837721580");
    });
});
