import { execute } from "./PathCommandPushPointToCurrentPathService";
import { describe, expect, it } from "vitest";
import { $currentPath } from "../../PathCommand";

describe("PathCommandPushPointToCurrentPathService.js method test", () =>
{
    it("test case", () =>
    {
        $currentPath.length = 0;
        
        expect($currentPath.length).toBe(0);
        execute(1, 2, true);

        expect($currentPath.length).toBe(3);
        expect($currentPath[0]).toBe(1);
        expect($currentPath[1]).toBe(2);
        expect($currentPath[2]).toBe(true);

        execute(3, 4, false);
        expect($currentPath.length).toBe(6);
        expect($currentPath[3]).toBe(3);
        expect($currentPath[4]).toBe(4);
        expect($currentPath[5]).toBe(false);
    });
});