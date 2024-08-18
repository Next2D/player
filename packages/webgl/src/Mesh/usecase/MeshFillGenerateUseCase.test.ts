import { execute } from "./MeshFillGenerateUseCase";
import { describe, expect, it } from "vitest";

describe("MeshFillGenerateUseCase.js method test", () =>
{
    it("test case", async () =>
    {
        const vertices = [
            -0.75, 0.8999999761581421, false,
            0.15000000596046448, 1.149999976158142, false,
            0.949999988079071, 0.699999988079071, false,
            1.25, 0.25, true,
            1.149999976158142, -0.30000001192092896, false,
            0.8999999761581421, -1.25, true,
            -0.10000000149011612, -1.149999976158142, false,
            -1.149999976158142, -1.100000023841858, true,
            -1.2000000476837158, 0, false,
            -1.25, 0.550000011920929, true,
            -0.75, 0.8999999761581421, false
        ];

        const vertexArrayObject = execute([vertices]);
        expect(vertexArrayObject.indexRanges.length).toBe(1);
        expect(vertexArrayObject.indexRanges[0].first).toBe(0);
        expect(vertexArrayObject.indexRanges[0].count).toBe(27);
        expect(vertexArrayObject.buffer.length).toBe(108);
    });
});