import { execute } from "./MeshFillGenerateService";
import { $setViewportSize } from "../../WebGLUtil.ts";
import { describe, expect, it, vi } from "vitest";

describe("MeshFillGenerateService.js method test", () =>
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

        $setViewportSize(10, 10);
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

        const buffer = new Float32Array((vertices.length / 3 - 2) * 51);
        const index = execute(vertices, buffer, 0);
        expect(index).toBe(27);
        expect(buffer.length).toBe(459);

        expect(buffer[0]).toBe(-0.75);
        expect(buffer[1]).toBe(0.8999999761581421);
        expect(buffer[2]).toBe(0.5);
        expect(buffer[3]).toBe(0.5);
        expect(buffer[4]).toBe(0);
        expect(buffer[5]).toBe(0);
        expect(buffer[6]).toBe(0);
        expect(buffer[7]).toBe(1);
        expect(buffer[8]).toBe(0.10000000149011612);
        expect(buffer[9]).toBe(0);
        expect(buffer[10]).toBe(0);
        expect(buffer[11]).toBe(0.10000000149011612);
        expect(buffer[12]).toBe(0);
        expect(buffer[13]).toBe(0);
        expect(buffer[14]).toBe(0);
        expect(buffer[15]).toBe(0);
        expect(buffer[16]).toBe(0);
        expect(buffer[17]).toBe(0.15000000596046448);
        expect(buffer[18]).toBe(1.149999976158142);
        expect(buffer[19]).toBe(0.5);
        expect(buffer[20]).toBe(0.5);
        expect(buffer[21]).toBe(0);
        expect(buffer[22]).toBe(0);
        expect(buffer[23]).toBe(0);
        expect(buffer[24]).toBe(1);
        expect(buffer[25]).toBe(0.10000000149011612);
        expect(buffer[26]).toBe(0);
        expect(buffer[27]).toBe(0);
        expect(buffer[28]).toBe(0.10000000149011612);
        expect(buffer[29]).toBe(0);
        expect(buffer[30]).toBe(0);
        expect(buffer[31]).toBe(0);
        expect(buffer[32]).toBe(0);
        expect(buffer[33]).toBe(0);
        expect(buffer[34]).toBe(0.949999988079071);
        expect(buffer[35]).toBe(0.699999988079071);
        expect(buffer[36]).toBe(0.5);
        expect(buffer[37]).toBe(0.5);
        expect(buffer[38]).toBe(0);
        expect(buffer[39]).toBe(0);
        expect(buffer[40]).toBe(0);
        expect(buffer[41]).toBe(1);
        expect(buffer[42]).toBe(0.10000000149011612);
        expect(buffer[43]).toBe(0);
        expect(buffer[44]).toBe(0);
        expect(buffer[45]).toBe(0.10000000149011612);
        expect(buffer[46]).toBe(0);
        expect(buffer[47]).toBe(0);
        expect(buffer[48]).toBe(0);
        expect(buffer[49]).toBe(0);
        expect(buffer[50]).toBe(0);
        expect(buffer[51]).toBe(-0.75);
        expect(buffer[52]).toBe(0.8999999761581421);
        expect(buffer[53]).toBe(0.5);
        expect(buffer[54]).toBe(0.5);
        expect(buffer[55]).toBe(0);
        expect(buffer[56]).toBe(0);
        expect(buffer[57]).toBe(0);
        expect(buffer[58]).toBe(1);
        expect(buffer[59]).toBe(0.10000000149011612);
        expect(buffer[60]).toBe(0);
        expect(buffer[61]).toBe(0);
        expect(buffer[62]).toBe(0.10000000149011612);
        expect(buffer[63]).toBe(0);
        expect(buffer[64]).toBe(0);
        expect(buffer[65]).toBe(0);
        expect(buffer[66]).toBe(0);
        expect(buffer[67]).toBe(0);
        expect(buffer[68]).toBe(0.949999988079071);
        expect(buffer[69]).toBe(0.699999988079071);
        expect(buffer[70]).toBe(0.5);
        expect(buffer[71]).toBe(0.5);
        expect(buffer[72]).toBe(0);
        expect(buffer[73]).toBe(0);
        expect(buffer[74]).toBe(0);
        expect(buffer[75]).toBe(1);
        expect(buffer[76]).toBe(0.10000000149011612);
        expect(buffer[77]).toBe(0);
        expect(buffer[78]).toBe(0);
        expect(buffer[79]).toBe(0.10000000149011612);
        expect(buffer[80]).toBe(0);
        expect(buffer[81]).toBe(0);
        expect(buffer[82]).toBe(0);
        expect(buffer[83]).toBe(0);
        expect(buffer[84]).toBe(0);
        expect(buffer[85]).toBe(1.149999976158142);
        expect(buffer[86]).toBe(-0.30000001192092896);
        expect(buffer[87]).toBe(0.5);
        expect(buffer[88]).toBe(0.5);
        expect(buffer[89]).toBe(0);
        expect(buffer[90]).toBe(0);
        expect(buffer[91]).toBe(0);
        expect(buffer[92]).toBe(1);
        expect(buffer[93]).toBe(0.10000000149011612);
        expect(buffer[94]).toBe(0);
        expect(buffer[95]).toBe(0);
        expect(buffer[96]).toBe(0.10000000149011612);
        expect(buffer[97]).toBe(0);
        expect(buffer[98]).toBe(0);
        expect(buffer[99]).toBe(0);
        expect(buffer[100]).toBe(0);
        expect(buffer[101]).toBe(0);
        expect(buffer[102]).toBe(0.949999988079071);
        expect(buffer[103]).toBe(0.699999988079071);
        expect(buffer[104]).toBe(0);
        expect(buffer[105]).toBe(0);
        expect(buffer[106]).toBe(0);
        expect(buffer[107]).toBe(0);
    });
});