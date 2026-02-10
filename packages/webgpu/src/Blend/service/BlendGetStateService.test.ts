import { describe, it, expect } from "vitest";
import { execute } from "./BlendGetStateService";

describe("BlendGetStateService", () =>
{
    describe("normal blend mode", () =>
    {
        it("should return correct blend state for normal mode", () =>
        {
            const result = execute("normal");

            expect(result.color.srcFactor).toBe("one");
            expect(result.color.dstFactor).toBe("one-minus-src-alpha");
            expect(result.color.operation).toBe("add");
            expect(result.alpha.srcFactor).toBe("one");
            expect(result.alpha.dstFactor).toBe("one-minus-src-alpha");
            expect(result.alpha.operation).toBe("add");
        });
    });

    describe("add blend mode", () =>
    {
        it("should return correct blend state for add mode", () =>
        {
            const result = execute("add");

            expect(result.color.srcFactor).toBe("one");
            expect(result.color.dstFactor).toBe("one");
            expect(result.color.operation).toBe("add");
            expect(result.alpha.srcFactor).toBe("one");
            expect(result.alpha.dstFactor).toBe("one-minus-src-alpha");
        });
    });

    describe("screen blend mode", () =>
    {
        it("should return correct blend state for screen mode", () =>
        {
            const result = execute("screen");

            expect(result.color.srcFactor).toBe("one-minus-dst");
            expect(result.color.dstFactor).toBe("one");
            expect(result.color.operation).toBe("add");
        });
    });

    describe("alpha blend mode", () =>
    {
        it("should return correct blend state for alpha mode", () =>
        {
            const result = execute("alpha");

            expect(result.color.srcFactor).toBe("zero");
            expect(result.color.dstFactor).toBe("src-alpha");
            expect(result.color.operation).toBe("add");
            expect(result.alpha.srcFactor).toBe("zero");
            expect(result.alpha.dstFactor).toBe("src-alpha");
        });
    });

    describe("erase blend mode", () =>
    {
        it("should return correct blend state for erase mode", () =>
        {
            const result = execute("erase");

            expect(result.color.srcFactor).toBe("zero");
            expect(result.color.dstFactor).toBe("one-minus-src-alpha");
            expect(result.color.operation).toBe("add");
            expect(result.alpha.srcFactor).toBe("zero");
            expect(result.alpha.dstFactor).toBe("one-minus-src-alpha");
        });
    });

    describe("copy blend mode", () =>
    {
        it("should return correct blend state for copy mode", () =>
        {
            const result = execute("copy");

            expect(result.color.srcFactor).toBe("one");
            expect(result.color.dstFactor).toBe("zero");
            expect(result.color.operation).toBe("add");
            expect(result.alpha.srcFactor).toBe("one");
            expect(result.alpha.dstFactor).toBe("zero");
        });
    });

    describe("default behavior", () =>
    {
        it("should return normal state for unknown mode", () =>
        {
            const result = execute("unknown" as any);

            expect(result.color.srcFactor).toBe("one");
            expect(result.color.dstFactor).toBe("one-minus-src-alpha");
        });
    });
});
