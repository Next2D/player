import { describe, it, expect } from "vitest";
import { DropShadowFilterShader } from "./DropShadowFilterShader";

describe("DropShadowFilterShader", () =>
{
    describe("getVertexShader", () =>
    {
        it("should return a valid WGSL vertex shader string", () =>
        {
            const shader = DropShadowFilterShader.getVertexShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @vertex attribute", () =>
        {
            const shader = DropShadowFilterShader.getVertexShader();

            expect(shader).toContain("@vertex");
        });

        it("should define VertexInput and VertexOutput structs", () =>
        {
            const shader = DropShadowFilterShader.getVertexShader();

            expect(shader).toContain("struct VertexInput");
            expect(shader).toContain("struct VertexOutput");
        });
    });

    describe("getFragmentShader", () =>
    {
        it("should return a valid WGSL fragment shader string", () =>
        {
            const shader = DropShadowFilterShader.getFragmentShader();

            expect(typeof shader).toBe("string");
            expect(shader.length).toBeGreaterThan(0);
        });

        it("should contain @fragment attribute", () =>
        {
            const shader = DropShadowFilterShader.getFragmentShader();

            expect(shader).toContain("@fragment");
        });

        it("should define DropShadowUniforms struct", () =>
        {
            const shader = DropShadowFilterShader.getFragmentShader();

            expect(shader).toContain("struct DropShadowUniforms");
        });

        it("should include shadow parameters", () =>
        {
            const shader = DropShadowFilterShader.getFragmentShader();

            expect(shader).toContain("shadowColor");
            expect(shader).toContain("distance");
            expect(shader).toContain("angle");
            expect(shader).toContain("strength");
        });

        it("should include inner shadow option", () =>
        {
            const shader = DropShadowFilterShader.getFragmentShader();

            expect(shader).toContain("inner");
        });

        it("should include knockout option", () =>
        {
            const shader = DropShadowFilterShader.getFragmentShader();

            expect(shader).toContain("knockout");
        });

        it("should include hideObject option", () =>
        {
            const shader = DropShadowFilterShader.getFragmentShader();

            expect(shader).toContain("hideObject");
        });

        it("should calculate shadow offset using angle", () =>
        {
            const shader = DropShadowFilterShader.getFragmentShader();

            expect(shader).toContain("cos(radian)");
            expect(shader).toContain("sin(radian)");
        });
    });
});
