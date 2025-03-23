import { execute } from "./MeshFillGenerateUseCase";
import { describe, expect, it, vi } from "vitest";

describe("MeshFillGenerateUseCase.js method test", () =>
{
    it("test case", async () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                "$context": {
                    "$fillStyle": new Float32Array([0, 0, 0, 1]),
                    "$matrix": new Float32Array([1, 0, 0, 1, 0, 0, 0, 0, 1]),
                }
            }
        });

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
        expect(vertexArrayObject.indexCount).toBe(27);
        expect(vertexArrayObject.buffer.length).toBe(459);
    });
});