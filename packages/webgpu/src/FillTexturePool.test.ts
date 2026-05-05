import {
    $acquireFillTexture,
    $releaseFillTexture,
    $acquireRenderTexture,
    $releaseRenderTexture,
    $clearFillTexturePool,
    $getOrCreateView
} from "./FillTexturePool";
import { beforeEach, describe, expect, it, vi } from "vitest";

interface IMockTexture {
    width: number;
    height: number;
    destroyed: boolean;
    destroy: () => void;
    createView: () => object;
}

const createMockDevice = () =>
{
    return {
        "createTexture": vi.fn(({ size }: { size: { width: number; height: number } }) =>
        {
            const tex: IMockTexture = {
                "width":  size.width,
                "height": size.height,
                "destroyed": false,
                "destroy": vi.fn(function (this: IMockTexture) { this.destroyed = true; }),
                "createView": vi.fn(() => ({}))
            };
            return tex;
        })
    } as unknown as GPUDevice;
};

beforeEach(() =>
{
    // モジュール状態をクリーンに
    $clearFillTexturePool();
});

describe("FillTexturePool basic acquire/release", () =>
{
    it("acquire creates a new texture when pool is empty", () =>
    {
        const device = createMockDevice();
        const texture = $acquireFillTexture(device, 256, 1);

        expect(device.createTexture).toHaveBeenCalledTimes(1);
        expect((texture as unknown as IMockTexture).width).toBe(256);
        expect((texture as unknown as IMockTexture).height).toBe(1);
    });

    it("release then acquire returns the same texture (bucket reuse)", () =>
    {
        const device = createMockDevice();
        const t1 = $acquireFillTexture(device, 128, 128);
        $releaseFillTexture(t1);

        const t2 = $acquireFillTexture(device, 128, 128);
        expect(t2).toBe(t1);
        // 2 度目は新規作成されない
        expect(device.createTexture).toHaveBeenCalledTimes(1);
    });

    it("different sizes use different buckets", () =>
    {
        const device = createMockDevice();
        const a = $acquireFillTexture(device, 256, 1);
        const b = $acquireFillTexture(device, 512, 1);
        $releaseFillTexture(a);
        $releaseFillTexture(b);

        const reused = $acquireFillTexture(device, 256, 1);
        expect(reused).toBe(a);
        // 別バケットには影響しない
        const reusedB = $acquireFillTexture(device, 512, 1);
        expect(reusedB).toBe(b);
    });
});

describe("FillTexturePool bucket size limit", () =>
{
    it("destroys texture when bucket exceeds $MAX_BUCKET_SIZE (32)", () =>
    {
        const device = createMockDevice();
        const textures: IMockTexture[] = [];
        for (let idx = 0; idx < 33; ++idx) {
            const t = $acquireFillTexture(device, 64, 64) as unknown as IMockTexture;
            textures.push(t);
        }
        // 33 個を release
        for (const t of textures) {
            $releaseFillTexture(t as unknown as GPUTexture);
        }

        // 32 個までは保持、33 個目は destroy される
        const destroyedCount = textures.filter((t) => t.destroyed).length;
        expect(destroyedCount).toBe(1);
        expect(textures[32].destroyed).toBe(true);
    });
});

describe("FillTexturePool total count limit", () =>
{
    it("destroys texture when total exceeds $MAX_TOTAL (256) across multiple buckets", () =>
    {
        const device = createMockDevice();
        const textures: IMockTexture[] = [];

        // 9 種類の (width, height) × 32 = 288 個生成
        for (let bucket = 0; bucket < 9; ++bucket) {
            const w = 100 + bucket;
            for (let idx = 0; idx < 32; ++idx) {
                const t = $acquireFillTexture(device, w, 1) as unknown as IMockTexture;
                textures.push(t);
            }
        }

        for (const t of textures) {
            $releaseFillTexture(t as unknown as GPUTexture);
        }

        // 各バケット 32 で計 288。バケット上限ピッタリ + 総数 256 の組合せ判定:
        // - バケット 1~8: 各 32 push → 計 256 で総数到達
        // - バケット 9 の 32 個は全て総数上限により destroy
        const destroyedCount = textures.filter((t) => t.destroyed).length;
        expect(destroyedCount).toBe(32);
    });
});

describe("FillTexturePool render pool independence", () =>
{
    it("fill and render pools track counts independently", () =>
    {
        const device = createMockDevice();
        const fill = $acquireFillTexture(device, 32, 32) as unknown as IMockTexture;
        const render = $acquireRenderTexture(device, 32, 32) as unknown as IMockTexture;

        $releaseFillTexture(fill as unknown as GPUTexture);
        $releaseRenderTexture(render as unknown as GPUTexture);

        // 別々のプールに格納されており再取得時に両方使い回される
        const fillReused = $acquireFillTexture(device, 32, 32);
        const renderReused = $acquireRenderTexture(device, 32, 32);
        expect(fillReused).toBe(fill);
        expect(renderReused).toBe(render);
    });

    it("render pool also enforces bucket limit", () =>
    {
        const device = createMockDevice();
        const textures: IMockTexture[] = [];
        for (let idx = 0; idx < 33; ++idx) {
            const t = $acquireRenderTexture(device, 200, 200) as unknown as IMockTexture;
            textures.push(t);
        }
        for (const t of textures) {
            $releaseRenderTexture(t as unknown as GPUTexture);
        }
        const destroyedCount = textures.filter((t) => t.destroyed).length;
        expect(destroyedCount).toBe(1);
    });
});

describe("FillTexturePool clear", () =>
{
    it("destroys all pooled textures and resets internal counts", () =>
    {
        const device = createMockDevice();

        // 10 個 acquire → release で fill プールに 10 個保持
        const fillTextures: IMockTexture[] = [];
        for (let idx = 0; idx < 10; ++idx) {
            fillTextures.push($acquireFillTexture(device, 256, 256) as unknown as IMockTexture);
        }
        for (const t of fillTextures) {
            $releaseFillTexture(t as unknown as GPUTexture);
        }

        // 10 個 acquire → release で render プールに 10 個保持
        const renderTextures: IMockTexture[] = [];
        for (let idx = 0; idx < 10; ++idx) {
            renderTextures.push($acquireRenderTexture(device, 256, 256) as unknown as IMockTexture);
        }
        for (const t of renderTextures) {
            $releaseRenderTexture(t as unknown as GPUTexture);
        }

        $clearFillTexturePool();

        // 全 texture が destroy 済み
        for (const t of fillTextures) {
            expect(t.destroyed).toBe(true);
        }
        for (const t of renderTextures) {
            expect(t.destroyed).toBe(true);
        }

        // クリア後は新規 acquire で createTexture が呼ばれることで内部カウンタもリセット済みと検証
        const callsBefore = (device.createTexture as ReturnType<typeof vi.fn>).mock.calls.length;
        $acquireFillTexture(device, 256, 256);
        const callsAfter = (device.createTexture as ReturnType<typeof vi.fn>).mock.calls.length;
        expect(callsAfter).toBe(callsBefore + 1);
    });

    it("clear after exceeding limits also resets total count tracking", () =>
    {
        const device = createMockDevice();

        // バケット上限を超えて release（一部 destroy される）
        const textures: IMockTexture[] = [];
        for (let idx = 0; idx < 40; ++idx) {
            textures.push($acquireFillTexture(device, 16, 16) as unknown as IMockTexture);
        }
        for (const t of textures) {
            $releaseFillTexture(t as unknown as GPUTexture);
        }

        $clearFillTexturePool();

        // クリア後、新たに 32 個 release できる（カウンタが 0 に戻っている）
        const fresh: IMockTexture[] = [];
        for (let idx = 0; idx < 32; ++idx) {
            fresh.push($acquireFillTexture(device, 16, 16) as unknown as IMockTexture);
        }
        for (const t of fresh) {
            $releaseFillTexture(t as unknown as GPUTexture);
        }

        // この 32 個は全て保持される（destroy されていない）
        const destroyedFresh = fresh.filter((t) => t.destroyed).length;
        expect(destroyedFresh).toBe(0);
    });
});

describe("FillTexturePool $getOrCreateView", () =>
{
    it("returns the same view for the same texture across multiple calls", () =>
    {
        const device = createMockDevice();
        const tex = $acquireFillTexture(device, 64, 64);

        const v1 = $getOrCreateView(tex);
        const v2 = $getOrCreateView(tex);

        expect(v1).toBe(v2);
        expect((tex as unknown as IMockTexture).createView).toHaveBeenCalledTimes(1);
    });
});
