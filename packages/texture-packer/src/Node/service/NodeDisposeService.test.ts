import { describe, expect, it } from "vitest";
import { Node } from "../../Node";

describe("NodeDisposeService.js method test", () =>
{
    it("test case1", () =>
    {
        const rootNode = new Node(0, 0, 0, 4096, 4096);
        
        const node1 = rootNode.insert(300, 120);;
        const node2 = rootNode.insert(100, 240);
        const node3 = rootNode.insert(400, 240);

        if (!node1 || !node2 || !node3) {
            throw new Error("node is null");
        }

        rootNode.dispose(node1.x, node1.y, node1.w, node1.h);
        expect(rootNode.left?.used).toBe(false);

        rootNode.dispose(node2.x, node2.y, node2.w, node2.h);
        expect(rootNode.right?.left?.used).toBe(false);
        
        rootNode.dispose(node3.x, node3.y, node3.w, node3.h);
        expect(rootNode.left).toBe(null);
        expect(rootNode.right).toBe(null);
    });
});