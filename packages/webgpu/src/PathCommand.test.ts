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

            const paths = pathCommand.getAllPaths();
            expect(paths.length).toBe(0);
        });
    });

    describe("moveTo", () =>
    {
        it("should start a new path", () =>
        {
            pathCommand.moveTo(10, 20);
            const path = pathCommand.getCurrentPath();

            expect(path.length).toBe(1);
            expect(path[0].x).toBe(10);
            expect(path[0].y).toBe(20);
        });

        it("should save previous path if long enough", () =>
        {
            pathCommand.moveTo(0, 0);
            pathCommand.lineTo(10, 0);
            pathCommand.lineTo(10, 10);
            pathCommand.lineTo(0, 10);
            pathCommand.moveTo(100, 100);

            const paths = pathCommand.getAllPaths();
            expect(paths.length).toBe(2);
        });
    });

    describe("lineTo", () =>
    {
        it("should add a point", () =>
        {
            pathCommand.moveTo(0, 0);
            pathCommand.lineTo(10, 20);

            const path = pathCommand.getCurrentPath();
            expect(path.length).toBe(2);
            expect(path[1].x).toBe(10);
            expect(path[1].y).toBe(20);
        });

        it("should ignore same point", () =>
        {
            pathCommand.moveTo(10, 20);
            pathCommand.lineTo(10, 20);

            const path = pathCommand.getCurrentPath();
            expect(path.length).toBe(1);
        });

        it("should add multiple lines", () =>
        {
            pathCommand.moveTo(0, 0);
            pathCommand.lineTo(10, 0);
            pathCommand.lineTo(10, 10);
            pathCommand.lineTo(0, 10);

            const path = pathCommand.getCurrentPath();
            expect(path.length).toBe(4);
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
            // Path format: [x, y, isCurve, ...]
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

            const path = pathCommand.getCurrentPath();
            // Should have at least start point and some segments
            expect(path.length).toBeGreaterThan(1);
        });
    });

    describe("arc", () =>
    {
        it("should create circular arc with adaptive tessellation", () =>
        {
            pathCommand.moveTo(150, 100);
            pathCommand.arc(100, 100, 50);

            const path = pathCommand.getCurrentPath();
            // Adaptive tessellation produces variable segment count
            // 4 cubic bezier curves, each converted to quadratic segments
            expect(path.length).toBeGreaterThan(1);
        });

        it("should be centered at specified position", () =>
        {
            pathCommand.moveTo(150, 100);
            pathCommand.arc(100, 100, 50);

            const path = pathCommand.getCurrentPath();
            // First point should be at (100+50, 100) = (150, 100) from moveTo
            expect(path[0].x).toBeCloseTo(150, 1);
            expect(path[0].y).toBeCloseTo(100, 1);
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

            const path = pathCommand.getCurrentPath();
            const lastPoint = path[path.length - 1];
            expect(lastPoint.x).toBe(0);
            expect(lastPoint.y).toBe(0);
        });

        it("should not add duplicate point if already at start", () =>
        {
            pathCommand.moveTo(0, 0);
            pathCommand.lineTo(100, 0);
            pathCommand.lineTo(0, 0);
            const lengthBefore = pathCommand.getCurrentPath().length;
            pathCommand.closePath();
            const lengthAfter = pathCommand.getCurrentPath().length;

            expect(lengthAfter).toBe(lengthBefore);
        });
    });

    describe("generateVertices", () =>
    {
        it("should generate triangle vertices for simple triangle", () =>
        {
            pathCommand.moveTo(0, 0);
            pathCommand.lineTo(100, 0);
            pathCommand.lineTo(50, 100);
            pathCommand.closePath();

            const vertices = pathCommand.generateVertices();
            // 1 triangle = 6 values (3 points * 2 coords)
            expect(vertices.length).toBeGreaterThanOrEqual(6);
        });

        it("should generate triangles using fan triangulation", () =>
        {
            pathCommand.moveTo(0, 0);
            pathCommand.lineTo(100, 0);
            pathCommand.lineTo(100, 100);
            pathCommand.lineTo(0, 100);
            pathCommand.closePath();

            const vertices = pathCommand.generateVertices();
            // Square with 5 points (including close) should generate multiple triangles
            expect(vertices.length).toBeGreaterThan(6);
        });
    });

    describe("getAllPaths", () =>
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

            const paths = pathCommand.getAllPaths();
            expect(paths.length).toBe(2);
            expect(paths[0].length).toBe(4);
            expect(paths[1].length).toBe(4);
        });
    });

    describe("setScale", () =>
    {
        it("should adjust flatness threshold based on scale", () =>
        {
            pathCommand.setScale(2.0);
            // We can't directly access the private threshold,
            // but we can verify the bezierCurveTo still works
            pathCommand.moveTo(0, 0);
            pathCommand.bezierCurveTo(10, 50, 90, 50, 100, 0);

            const path = pathCommand.getCurrentPath();
            expect(path.length).toBeGreaterThan(1);
        });
    });

    describe("reset", () =>
    {
        it("should clear all state", () =>
        {
            pathCommand.moveTo(10, 20);
            pathCommand.lineTo(30, 40);
            pathCommand.reset();

            const paths = pathCommand.getAllPaths();
            expect(paths.length).toBe(0);

            const currentPath = pathCommand.getCurrentPath();
            expect(currentPath.length).toBe(0);
        });
    });
});
