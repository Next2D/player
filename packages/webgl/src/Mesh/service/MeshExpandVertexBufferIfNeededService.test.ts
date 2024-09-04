import { execute } from "./MeshExpandVertexBufferIfNeededService";
import {
    $getVertexBufferData,
    $setVertexBufferData,
    $getVertexBufferPosition,
    $setVertexBufferPosition
} from "../../Mesh";
import { describe, expect, it } from "vitest";

describe("MeshExpandVertexBufferIfNeededService.js method test", () =>
{
    it("test case", () =>
    {
        $setVertexBufferData(new Float32Array(1024));
        const vertexBufferData = $getVertexBufferData();
        expect(vertexBufferData.length).toBe(1024);

        $setVertexBufferPosition(1024);
        expect($getVertexBufferPosition()).toBe(1024);

        execute(1);

        expect($getVertexBufferData().length).toBe(2048);
    });
});