import { execute } from "./VertexArrayObjectReleaseVertexArrayObjectService";
import { describe, expect, it } from "vitest";
import { $objectPool } from "../../VertexArrayObject";
import { $objectPool as $meshObjectPool } from "../../Mesh";

describe("VertexArrayObjectReleaseVertexArrayObjectService.js method test", () =>
{
    it("test case", () =>
    {
        $objectPool.length = 0;
        $meshObjectPool.length = 0;
        const vertexArrayObject = {
            "resource": "createVertexArray",
            "indexRanges": [{
                "first": 0,
                "count": 6
            }],
            "vertexBuffer": "createBuffer",
            "vertexLength": 0,
        };

        expect($objectPool.length).toBe(0);
        expect($meshObjectPool.length).toBe(0);
        execute(vertexArrayObject);
        expect($objectPool.length).toBe(1);
        expect($meshObjectPool.length).toBe(1);
        expect(vertexArrayObject.indexRanges).toBe(null);
    });
});