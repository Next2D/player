import { execute } from "./MeahExpandIndexBufferIfNeededService";
import {
    $getIndexBufferData,
    $setIndexBufferData,
    $getIndexBufferPosition,
    $setIndexBufferPosition
} from "../../Mesh";
import { describe, expect, it } from "vitest";

describe("MeahExpandIndexBufferIfNeededService.js method test", () =>
{
    it("test case", () =>
    {
        $setIndexBufferData(new Int16Array(256));
        const vertexBufferData = $getIndexBufferData();
        expect(vertexBufferData.length).toBe(256);

        $setIndexBufferPosition(256);
        expect($getIndexBufferPosition()).toBe(256);

        execute(1);

        expect($getIndexBufferData().length).toBe(512);
    });
});