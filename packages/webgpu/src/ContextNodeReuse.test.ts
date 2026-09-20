import { beforeEach, describe, expect, it, vi } from "vitest";
import { Context } from "./Context";
import { Node, TexturePacker } from "@next2d/texture-packer";
import { $rootNodes, $setActiveAtlasIndex, $getActiveAtlasIndex } from "./AtlasManager";
const makeContext = (): Context => {
    const context = Object.create(Context.prototype) as Context;
    Reflect.set(context, "_nodeRoots", new WeakMap<Node, TexturePacker>());
    return context;
};
beforeEach(() => {
    $rootNodes.length = 0;
    $rootNodes[0] = new TexturePacker(0, 256, 256);
    $rootNodes[1] = new TexturePacker(1, 256, 256);
    $setActiveAtlasIndex(0);
    vi.clearAllMocks();
});
describe("cached atlas node reuse", () => {
    it("selects an owned node's page while keeping both allocations", () => {
        const context = makeContext();
        const first = context.createNode(17, 19);
        $setActiveAtlasIndex(1);
        const second = context.createNode(21, 23);
        expect(context.reuseNode(first)).toBe(true);
        expect($getActiveAtlasIndex()).toBe(0);
        expect(first.used).toBe(true);
        expect(second.used).toBe(true);
        expect(context.createNode(17, 19)).not.toBe(first);
        expect(context.reuseNode(second)).toBe(true);
        expect($getActiveAtlasIndex()).toBe(1);
    });
    it("rejects nodes from another Context and from a replaced atlas", () => {
        const context = makeContext(), other = makeContext();
        const node = context.createNode(17, 19);
        expect(other.reuseNode(node)).toBe(false);
        $rootNodes[0] = new TexturePacker(0, 256, 256);
        expect(node.used).toBe(true);
        expect(context.reuseNode(node)).toBe(false);
    });
    it.each(["removeNode", "releaseTextureCache"] as const)("rejects nodes after %s", method => {
        const context = makeContext();
        const node = context.createNode(17, 19);
        context[method](node);
        expect(context.reuseNode(node)).toBe(false);
        const fresh = context.createNode(17, 19);
        expect(context.reuseNode(fresh)).toBe(true);
    });
});
