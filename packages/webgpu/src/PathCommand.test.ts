import { describe, it, expect, beforeEach } from "vitest";
import { PathCommand } from "./PathCommand";

describe("PathCommand", () =>
{
    let pathCommand: PathCommand;

    beforeEach(() =>
    {
        pathCommand = new PathCommand();
    });

    describe("beginPath", () =>
    {
        it("should reset all state", () =>
        {
            pathCommand.moveTo(10, 20);
            pathCommand.lineTo(30, 40);
            pathCommand.beginPath();

            const vertices = pathCommand.getVerticesForStroke();
            expect(vertices.length).toBe(0);
        });
    });

    describe("moveTo", () =>
    {
        it("should start a new path", () =>
        {
            pathCommand.moveTo(10, 20);
            pathCommand.lineTo(30, 40);
            const vertices = pathCommand.getVerticesForStroke();

            expect(vertices.length).toBe(1);
            expect(vertices[0][0]).toBe(10);
            expect(vertices[0][1]).toBe(20);
        });

        it("should save previous path if long enough", () =>
        {
            pathCommand.moveTo(0, 0);
            pathCommand.lineTo(10, 0);
            pathCommand.lineTo(10, 10);
            pathCommand.lineTo(0, 10);
            pathCommand.moveTo(100, 100);
            pathCommand.lineTo(110, 100);

            const vertices = pathCommand.getVerticesForStroke();
            expect(vertices.length).toBe(2);
        });
    });

    describe("lineTo", () =>
    {
        it("should add a point", () =>
        {
            pathCommand.moveTo(0, 0);
            pathCommand.lineTo(10, 20);

            const vertices = pathCommand.getVerticesForStroke();
            expect(vertices.length).toBe(1);
            // Path: [0, 0, false, 10, 20, false] = 6 elements
            expect(vertices[0].length).toBe(6);
            expect(vertices[0][3]).toBe(10);
            expect(vertices[0][4]).toBe(20);
        });

        it("should ignore same point", () =>
        {
            pathCommand.moveTo(10, 20);
            pathCommand.lineTo(10, 20);
            pathCommand.lineTo(30, 40);

            const vertices = pathCommand.getVerticesForStroke();
            // moveTo + lineTo(same) + lineTo = 2 unique points (6 elements)
            expect(vertices[0].length).toBe(6);
        });

        it("should add multiple lines", () =>
        {
            pathCommand.moveTo(0, 0);
            pathCommand.lineTo(10, 0);
            pathCommand.lineTo(10, 10);
            pathCommand.lineTo(0, 10);

            const vertices = pathCommand.getVerticesForStroke();
            // 4 points * 3 elements = 12
            expect(vertices[0].length).toBe(12);
        });
    });

    describe("quadraticCurveTo", () =>
    {
        it("should add control point and end point", () =>
        {
            pathCommand.moveTo(0, 0);
            pathCommand.quadraticCurveTo(50, 100, 100, 0);

            const vertices = pathCommand.getVerticesForStroke();
            expect(vertices.length).toBe(1);
            // Should have: start(0,0,false), control(50,100,true), end(100,0,false)
            expect(vertices[0].length).toBe(9);
        });
    });

    describe("bezierCurveTo", () =>
    {
        it("should convert cubic bezier to quadratic segments", () =>
        {
            pathCommand.moveTo(0, 0);
            pathCommand.bezierCurveTo(10, 50, 90, 50, 100, 0);

            const vertices = pathCommand.getVerticesForStroke();
            // Should have at least start point and some segments
            expect(vertices[0].length).toBeGreaterThan(3);
        });
    });

    describe("arc", () =>
    {
        it("should create circular arc with adaptive tessellation", () =>
        {
            pathCommand.moveTo(150, 100);
            pathCommand.arc(100, 100, 50);

            const vertices = pathCommand.getVerticesForStroke();
            // Adaptive tessellation produces variable segment count
            expect(vertices[0].length).toBeGreaterThan(3);
        });

        it("should be centered at specified position", () =>
        {
            pathCommand.moveTo(150, 100);
            pathCommand.arc(100, 100, 50);

            const vertices = pathCommand.getVerticesForStroke();
            // First point should be at (150, 100) from moveTo
            expect(vertices[0][0]).toBeCloseTo(150, 1);
            expect(vertices[0][1]).toBeCloseTo(100, 1);
        });
    });

    describe("closePath", () =>
    {
        it("should add line back to start point", () =>
        {
            pathCommand.moveTo(0, 0);
            pathCommand.lineTo(100, 0);
            pathCommand.lineTo(100, 100);
            pathCommand.closePath();

            const vertices = pathCommand.getVerticesForStroke();
            const path = vertices[0];
            // Last point should be (0, 0)
            expect(path[path.length - 3]).toBe(0);
            expect(path[path.length - 2]).toBe(0);
        });

        it("should not add duplicate point if already at start", () =>
        {
            pathCommand.moveTo(0, 0);
            pathCommand.lineTo(100, 0);
            pathCommand.lineTo(0, 0);
            const lengthBefore = pathCommand.getVerticesForStroke()[0].length;
            pathCommand.closePath();
            const lengthAfter = pathCommand.getVerticesForStroke()[0].length;

            expect(lengthAfter).toBe(lengthBefore);
        });
    });

    describe("getVerticesForStroke", () =>
    {
        it("should return all paths", () =>
        {
            pathCommand.moveTo(0, 0);
            pathCommand.lineTo(10, 0);
            pathCommand.lineTo(10, 10);
            pathCommand.lineTo(0, 10);

            pathCommand.moveTo(100, 100);
            pathCommand.lineTo(110, 100);
            pathCommand.lineTo(110, 110);
            pathCommand.lineTo(100, 110);

            const vertices = pathCommand.getVerticesForStroke();
            expect(vertices.length).toBe(2);
            // Each path has 4 points * 3 elements = 12
            expect(vertices[0].length).toBe(12);
            expect(vertices[1].length).toBe(12);
        });
    });

    describe("reset", () =>
    {
        it("should clear all state", () =>
        {
            pathCommand.moveTo(10, 20);
            pathCommand.lineTo(30, 40);
            pathCommand.reset();

            const vertices = pathCommand.getVerticesForStroke();
            expect(vertices.length).toBe(0);
        });
    });
});
