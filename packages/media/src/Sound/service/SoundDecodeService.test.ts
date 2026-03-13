import { execute } from "./SoundDecodeService";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../MediaUtil", () => ({
    "$getAudioContext": vi.fn(() => ({
        "decodeAudioData": vi.fn(() => Promise.resolve({ "length": 100 }))
    }))
}));

describe("SoundDecodeService.js test", () => {

    it("execute test case1 - empty buffer returns undefined", async () =>
    {
        const emptyBuffer = new ArrayBuffer(0);
        const result = await execute(emptyBuffer);
        expect(result).toBeUndefined();
    });

    it("execute test case2 - successful decode", async () =>
    {
        const buffer = new ArrayBuffer(10);
        new Uint8Array(buffer).set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        const result = await execute(buffer);
        expect(result).toEqual({ "length": 100 });
    });
});
