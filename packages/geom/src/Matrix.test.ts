import { Matrix } from "./Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new Matrix().namespace).toBe("next2d.geom.Matrix");
    });

    it("namespace test static", () =>
    {
        expect(Matrix.namespace).toBe("next2d.geom.Matrix");
    });
});