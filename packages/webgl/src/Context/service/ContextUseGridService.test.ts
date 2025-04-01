import { execute } from "./ContextUseGridService";
import { describe, expect, it } from "vitest";
import { $gridDataMap } from "../../Grid";

describe("ContextUseGridService.js method test", () =>
{
    it("test case", () =>
    {
        $gridDataMap.clear();
        expect($gridDataMap.size).toBe(0);

        execute(new Float32Array([10, 20, 110, 220]));
        
        expect($gridDataMap.size).toBe(1);
        $gridDataMap.clear();
    });
});