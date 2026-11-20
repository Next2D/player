import { execute } from "./ShapeGenerateBitmapKeyService";
import { describe, expect, it } from "vitest";

const pixels = (count: number, seed: number = 0): Uint8Array =>
{
    const buffer = new Uint8Array(count * 4);
    for (let idx = 0; idx < buffer.length; ++idx) {
        buffer[idx] = idx * 31 + seed & 0xff;
    }
    return buffer;
};

describe("ShapeGenerateBitmapKeyService.js test", () =>
{
    it("returns the same key for the same source and image", () =>
    {
        const buffer = pixels(16);
        expect(execute("./image.png", 4, 4, buffer))
            .toBe(execute("./image.png", 4, 4, new Uint8Array(buffer)));
    });

    it("returns a 24-bit non-negative integer", () =>
    {
        for (const src of ["", "a", "./image.png", "https://example.com/a.png?v=1"]) {
            const key = execute(src, 4, 4, pixels(16));
            expect(Number.isInteger(key)).toBe(true);
            expect(key).toBeGreaterThanOrEqual(0);
            expect(key).toBeLessThanOrEqual(0xffffff);
        }
    });

    it("returns different keys for different sources", () =>
    {
        const buffer = pixels(16);
        expect(execute("./a.png", 4, 4, buffer)).not.toBe(execute("./b.png", 4, 4, buffer));
    });

    it("returns different keys when the image size differs", () =>
    {
        const buffer = pixels(16);
        expect(execute("./a.png", 4, 4, buffer)).not.toBe(execute("./a.png", 8, 2, buffer));
        expect(execute("./a.png", 4, 4, buffer)).not.toBe(execute("./a.png", 4, 8, pixels(32)));
    });

    it("returns a different key when a small image changes behind the same source", () =>
    {
        // 256 ピクセル以下の画像は全ピクセルを見る
        const before = pixels(64);
        const after = new Uint8Array(before);
        after[after.length - 1] ^= 0xff;
        expect(execute("./a.png", 8, 8, before)).not.toBe(execute("./a.png", 8, 8, after));
    });

    it("returns different keys for long data URLs that differ", () =>
    {
        const head = "data:image/png;base64,";
        const a = head + "A".repeat(20000) + "B".repeat(20000);
        const b = head + "A".repeat(20000) + "C".repeat(20000);
        const buffer = pixels(16);
        expect(execute(a, 4, 4, buffer)).not.toBe(execute(b, 4, 4, buffer));
    });

    it("does not read every pixel of a large image", () =>
    {
        // 1024x1024 の画像でも、読むピクセルは一定数に収まる
        let reads = 0;
        const buffer = new Proxy(new Uint8Array(1024 * 1024 * 4), {
            "get": (target, property): unknown => {
                if (typeof property === "string" && /^\d+$/.test(property)) {
                    ++reads;
                }
                return Reflect.get(target, property);
            }
        }) as Uint8Array;
        execute("./large.png", 1024, 1024, buffer);
        expect(reads).toBeLessThanOrEqual(256 * 4);
    });

    it("handles an empty buffer", () =>
    {
        const key = execute("./empty.png", 0, 0, new Uint8Array(0));
        expect(key).toBeGreaterThanOrEqual(0);
        expect(key).toBeLessThanOrEqual(0xffffff);
    });
});
