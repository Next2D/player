import { describe, it, expect, vi } from "vitest";

describe("NativeStencilFill.js test", () =>
{
    it("should be unknown until a render pass is seen", async () =>
    {
        vi.resetModules();
        const mod = await import("./NativeStencilFill");
        expect(mod.$nativeStencilFill).toBe(0);
    });

    it("should be 1 when the render pass has __next2dStencilFill", async () =>
    {
        vi.resetModules();
        const mod = await import("./NativeStencilFill");
        mod.$detectNativeStencilFill({ "__next2dStencilFill": (): void => {} } as unknown as GPURenderPassEncoder);
        expect(mod.$nativeStencilFill).toBe(1);
    });

    it("should be 2 when the render pass does not have it (browsers)", async () =>
    {
        vi.resetModules();
        const mod = await import("./NativeStencilFill");
        mod.$detectNativeStencilFill({ "draw": (): void => {} } as unknown as GPURenderPassEncoder);
        expect(mod.$nativeStencilFill).toBe(2);
    });
});
