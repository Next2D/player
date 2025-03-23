import { describe, expect, it } from "vitest";
import { Node } from "../../Node";

describe("NodeInsertService.js method test", () =>
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

        expect(node1.x).toBe(0);
        expect(node1.y).toBe(0);
        expect(node1.w).toBe(300);
        expect(node1.h).toBe(120); 

        expect(node2.x).toBe(0);
        expect(node2.y).toBe(121);
        expect(node2.w).toBe(100);
        expect(node2.h).toBe(240); 

        expect(node3.x).toBe(101);
        expect(node3.y).toBe(121);
        expect(node3.w).toBe(400);
        expect(node3.h).toBe(240); 
    });
});