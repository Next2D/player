import { execute } from "./VertexArrayObjectReleaseVertexArrayObjectService";
import { describe, expect, it } from "vitest";
import { $objectPool } from "../../VertexArrayObject";

describe("VertexArrayObjectReleaseVertexArrayObjectService.js method test", () =>
{
    it("test case", () =>
    {
        $objectPool.length = 0;
        const vertexArrayObject = {
            "id": 1,
            "resource": "createVertexArray",
            "indexCount": 6,
            "vertexBuffer": "createBuffer",
            "vertexLength": 0,
        };

        expect($objectPool.length).toBe(0);
        execute(vertexArrayObject);
        expect($objectPool.length).toBe(1);
    });
});