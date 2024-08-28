import { execute } from "./AtlasManagerCreateNodeService";
import { $setActiveAtlasIndex } from "../../AtlasManager";
import { describe, expect, it } from "vitest";

describe("AtlasManagerCreateNodeService.js method test", () =>
{
    it("test case", () =>
    {
        const node1 = execute(100, 200);
        expect(node1.index).toBe(0);
        expect(node1.x).toBe(0);
        expect(node1.y).toBe(0);
        expect(node1.w).toBe(100);
        expect(node1.h).toBe(200);

        $setActiveAtlasIndex(1);
        const node2 = execute(100, 200);
        expect(node2.index).toBe(1);
        expect(node1.x).toBe(0);
        expect(node1.y).toBe(0);
        expect(node1.w).toBe(100);
        expect(node1.h).toBe(200);
    });
});