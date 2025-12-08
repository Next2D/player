import { execute } from "./PathCommandBeginPathService";
import { describe, expect, it, beforeEach } from "vitest";
import {
    $currentPath,
    $vertices
} from "../PathCommandState";

describe("PathCommandBeginPathService.ts method test", () =>
{
    beforeEach(() =>
    {
        $currentPath.length = 0;
        $vertices.length = 0;
    });

    it("test case - clears current path", () =>
    {
        $currentPath.push(10, 20, false);
        $currentPath.push(30, 40, false);

        expect($currentPath.length).toBe(6);

        execute();

        expect($currentPath.length).toBe(0);
    });

    it("test case - clears vertices", () =>
    {
        $vertices.push([10, 20, false, 30, 40, false]);
        $vertices.push([50, 60, false, 70, 80, false]);

        expect($vertices.length).toBe(2);

        execute();

        expect($vertices.length).toBe(0);
    });

    it("test case - clears both current path and vertices", () =>
    {
        $currentPath.push(10, 20, false);
        $vertices.push([30, 40, false, 50, 60, false]);

        expect($currentPath.length).toBe(3);
        expect($vertices.length).toBe(1);

        execute();

        expect($currentPath.length).toBe(0);
        expect($vertices.length).toBe(0);
    });
});
