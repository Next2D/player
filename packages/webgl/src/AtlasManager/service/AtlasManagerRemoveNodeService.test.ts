import { execute } from "./AtlasManagerRemoveNodeService";
import { execute as atlasManagerCreateNodeService } from "./AtlasManagerCreateNodeService";
import { $rootNodes } from "../../AtlasManager";
import { describe, expect, it } from "vitest";

describe("AtlasManagerRemoveNodeService.js method test", () =>
{
    it("test case", () =>
    {
        const node = atlasManagerCreateNodeService(100, 200);
        expect(node.left === null).toBe(true);
        expect(node.right === null).toBe(true);
        execute(node);
        expect(node.left).toBe(null);
        expect(node.right).toBe(null);
    });
});