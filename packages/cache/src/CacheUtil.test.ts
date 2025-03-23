import { $maps, $poolMap, $getMap } from "./CacheUtil";
import { describe, expect, it } from "vitest";

describe("CacheUtil.js test", () =>
{
    it("test case", () =>
    {
        $maps.length = 0;
        expect($maps.length).toBe(0);

        const map = $getMap();
        $poolMap(map);
        expect($maps.length).toBe(1);

        $getMap();
        expect($maps.length).toBe(0);
    });
});