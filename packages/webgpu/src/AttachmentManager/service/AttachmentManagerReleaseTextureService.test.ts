import { describe, it, expect, beforeEach } from "vitest";
import type { ITextureObject } from "../../interface/ITextureObject";
import { execute } from "./AttachmentManagerReleaseTextureService";

describe("AttachmentManagerReleaseTextureService", () =>
{
    let texturePool: Map<string, ITextureObject[]>;

    const createMockTexture = (
        width: number,
        height: number,
        smooth: boolean
    ): ITextureObject => ({
        "id": Math.random(),
        width,
        height,
        smooth,
        "resource": {} as GPUTexture,
        "view": {} as GPUTextureView
    });

    beforeEach(() =>
    {
        texturePool = new Map();
    });

    it("should add texture to pool with correct key", () =>
    {
        const texture = createMockTexture(256, 256, true);

        execute(texturePool, texture);

        expect(texturePool.has("256x256_smooth")).toBe(true);
        expect(texturePool.get("256x256_smooth")).toContain(texture);
    });

    it("should use 'nearest' key for non-smooth textures", () =>
    {
        const texture = createMockTexture(512, 512, false);

        execute(texturePool, texture);

        expect(texturePool.has("512x512_nearest")).toBe(true);
    });

    it("should create new array if key doesn't exist", () =>
    {
        const texture = createMockTexture(128, 128, true);

        execute(texturePool, texture);

        expect(texturePool.get("128x128_smooth")).toHaveLength(1);
    });

    it("should append to existing array", () =>
    {
        const texture1 = createMockTexture(256, 256, true);
        const texture2 = createMockTexture(256, 256, true);

        execute(texturePool, texture1);
        execute(texturePool, texture2);

        const pool = texturePool.get("256x256_smooth");
        expect(pool).toHaveLength(2);
        expect(pool).toContain(texture1);
        expect(pool).toContain(texture2);
    });

    it("should handle different sizes separately", () =>
    {
        const texture1 = createMockTexture(256, 256, true);
        const texture2 = createMockTexture(512, 512, true);

        execute(texturePool, texture1);
        execute(texturePool, texture2);

        expect(texturePool.size).toBe(2);
        expect(texturePool.get("256x256_smooth")).toHaveLength(1);
        expect(texturePool.get("512x512_smooth")).toHaveLength(1);
    });

    it("should handle same size but different smooth settings", () =>
    {
        const textureSmooth = createMockTexture(256, 256, true);
        const textureNearest = createMockTexture(256, 256, false);

        execute(texturePool, textureSmooth);
        execute(texturePool, textureNearest);

        expect(texturePool.size).toBe(2);
        expect(texturePool.has("256x256_smooth")).toBe(true);
        expect(texturePool.has("256x256_nearest")).toBe(true);
    });

    it("should handle non-square textures", () =>
    {
        const texture = createMockTexture(1024, 512, false);

        execute(texturePool, texture);

        expect(texturePool.has("1024x512_nearest")).toBe(true);
    });

    it("should preserve texture reference in pool", () =>
    {
        const texture = createMockTexture(256, 256, true);
        const originalId = texture.id;

        execute(texturePool, texture);

        const pooledTexture = texturePool.get("256x256_smooth")![0];
        expect(pooledTexture.id).toBe(originalId);
    });
});
