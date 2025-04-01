import { execute } from "./ContextUpdateAllTransferBoundsService";
import { describe, expect, it } from "vitest";
import { Node } from "@next2d/texture-packer";
import { $getActiveAllTransferBounds } from "../../AtlasManager";

describe("ContextUpdateAllTransferBoundsService.js method test", () =>
{
    it("test case", () =>
    {
        const node = new Node(0, 10, 20, 100, 200);
        const bounds = $getActiveAllTransferBounds(node.index);

        expect(bounds[0]).toBe(Infinity);
        expect(bounds[1]).toBe(Infinity);
        expect(bounds[2]).toBe(-Infinity);
        expect(bounds[3]).toBe(-Infinity);

        execute(node);
        
        expect(bounds[0]).toBe(10);
        expect(bounds[1]).toBe(20);
        expect(bounds[2]).toBe(110);
        expect(bounds[3]).toBe(220);
    });
});