
import { execute } from "./PathCommandBeginPathService";
import { describe, expect, it } from "vitest";
import {
    $currentPath,
    $vertices
} from "../../PathCommand";

describe("PathCommandBeginPathService.js method test", () =>
{
    it("test case", () =>
    {
        $currentPath.length = 0;
        $vertices.length = 0;
        $currentPath.push(1, 2, true);
        $vertices.push([1, 2, true], [3, 4, false]);

        expect($currentPath.length).toBe(3);
        expect($vertices.length).toBe(2);

        execute();

        expect($currentPath.length).toBe(0);
        expect($vertices.length).toBe(0);
    });
});