import { execute } from "./PathCommandMoveToUseCase";
import { describe, expect, it, beforeEach } from "vitest";
import {
    $currentPath,
    $vertices
} from "../PathCommandState";

describe("PathCommandMoveToUseCase.ts method test", () =>
{
    beforeEach(() =>
    {
        $currentPath.length = 0;
        $vertices.length = 0;
    });

    it("test case - adds point to empty path", () =>
    {
        expect($currentPath.length).toBe(0);

        execute(10, 20);

        expect($currentPath.length).toBe(3);
        expect($currentPath[0]).toBe(10);
        expect($currentPath[1]).toBe(20);
        expect($currentPath[2]).toBe(false);
    });

    it("test case - does nothing if point equals last point", () =>
    {
        execute(10, 20);
        expect($currentPath.length).toBe(3);

        execute(10, 20);
        expect($currentPath.length).toBe(3);
    });

    it("test case - moves current path to vertices and starts new path", () =>
    {
        // 十分な頂点を追加（minVertices = 10）
        for (let i = 0; i < 4; i++) {
            $currentPath.push(i * 10, i * 10, false);
        }
        expect($currentPath.length).toBe(12);
        expect($vertices.length).toBe(0);

        execute(100, 100);

        expect($vertices.length).toBe(1);
        expect($currentPath.length).toBe(3);
        expect($currentPath[0]).toBe(100);
        expect($currentPath[1]).toBe(100);
    });
});
