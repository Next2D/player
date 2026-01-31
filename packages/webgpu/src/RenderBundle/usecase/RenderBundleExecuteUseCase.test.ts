import { describe, it, expect, vi } from "vitest";
import { execute } from "./RenderBundleExecuteUseCase";

describe("RenderBundleExecuteUseCase", () =>
{
    const createMockPassEncoder = () =>
    {
        return {
            "executeBundles": vi.fn()
        } as unknown as GPURenderPassEncoder;
    };

    const createMockBundle = (label: string = "mockBundle"): GPURenderBundle =>
    {
        return { label } as unknown as GPURenderBundle;
    };

    describe("bundle execution", () =>
    {
        it("should call executeBundles with provided bundles", () =>
        {
            const passEncoder = createMockPassEncoder();
            const bundles = [createMockBundle("bundle1"), createMockBundle("bundle2")];

            execute(passEncoder, bundles);

            expect(passEncoder.executeBundles).toHaveBeenCalledWith(bundles);
        });

        it("should execute single bundle", () =>
        {
            const passEncoder = createMockPassEncoder();
            const bundles = [createMockBundle()];

            execute(passEncoder, bundles);

            expect(passEncoder.executeBundles).toHaveBeenCalledWith(bundles);
        });

        it("should execute multiple bundles", () =>
        {
            const passEncoder = createMockPassEncoder();
            const bundles = [
                createMockBundle("bundle1"),
                createMockBundle("bundle2"),
                createMockBundle("bundle3")
            ];

            execute(passEncoder, bundles);

            expect(passEncoder.executeBundles).toHaveBeenCalledWith(bundles);
        });
    });

    describe("empty bundles", () =>
    {
        it("should not call executeBundles when array is empty", () =>
        {
            const passEncoder = createMockPassEncoder();
            const bundles: GPURenderBundle[] = [];

            execute(passEncoder, bundles);

            expect(passEncoder.executeBundles).not.toHaveBeenCalled();
        });
    });

    describe("call count", () =>
    {
        it("should call executeBundles exactly once", () =>
        {
            const passEncoder = createMockPassEncoder();
            const bundles = [
                createMockBundle("bundle1"),
                createMockBundle("bundle2")
            ];

            execute(passEncoder, bundles);

            expect(passEncoder.executeBundles).toHaveBeenCalledTimes(1);
        });
    });
});
