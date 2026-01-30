import { describe, it, expect } from "vitest";
import { execute } from "./MeshCalculateNormalVectorService";

describe("MeshCalculateNormalVectorService", () =>
{
    it("should calculate normal for horizontal vector", () =>
    {
        // Horizontal vector (1, 0) -> normal should be (0, 1) * thickness
        const result = execute(1, 0, 1);

        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(1, 5);
    });

    it("should calculate normal for vertical vector", () =>
    {
        // Vertical vector (0, 1) -> normal should be (-1, 0) * thickness
        const result = execute(0, 1, 1);

        expect(result.x).toBeCloseTo(-1, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it("should scale by thickness", () =>
    {
        const thickness = 5;
        const result = execute(1, 0, thickness);

        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(thickness, 5);
    });

    it("should handle diagonal vector (45 degrees)", () =>
    {
        // Vector (1, 1) -> normal should be perpendicular with magnitude = thickness
        const result = execute(1, 1, 1);

        // magnitude of (1, 1) is sqrt(2)
        // normal = (-1/sqrt(2), 1/sqrt(2))
        const sqrt2 = Math.sqrt(2);
        expect(result.x).toBeCloseTo(-1 / sqrt2, 5);
        expect(result.y).toBeCloseTo(1 / sqrt2, 5);
    });

    it("should be perpendicular to input vector", () =>
    {
        const x = 3;
        const y = 4;
        const thickness = 1;

        const result = execute(x, y, thickness);

        // Dot product should be 0 for perpendicular vectors
        const dotProduct = x * result.x + y * result.y;
        expect(dotProduct).toBeCloseTo(0, 5);
    });

    it("should have correct magnitude equal to thickness", () =>
    {
        const thickness = 10;
        const result = execute(3, 4, thickness);

        const magnitude = Math.sqrt(result.x * result.x + result.y * result.y);
        expect(magnitude).toBeCloseTo(thickness, 5);
    });

    it("should handle negative input vector", () =>
    {
        const result = execute(-1, 0, 1);

        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(-1, 5);
    });

    it("should handle large values", () =>
    {
        const result = execute(1000, 0, 2);

        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(2, 5);
    });
});
