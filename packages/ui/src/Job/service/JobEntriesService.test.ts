import type { IEntriesObject } from "../../interface/IEntriesObject";
import { execute } from "./JobEntriesService";
import { describe, expect, it } from "vitest";

describe("JobEntriesService.js test", () =>
{
    it("execute test case1", () =>
    {
        const entries = execute({ "x": 100, "y": 200 });
        expect(entries.length).toBe(2);
        expect(entries[0].name).toBe("x");
        expect(entries[0].value).toBe(100);
        expect(entries[1].name).toBe("y");
        expect(entries[1].value).toBe(200);
    });

    it("execute test case2", () =>
    {
        const entries = execute({
            "x": 100,
            "y": 200,
            "matrix": {
                "a": 1,
                "b": 2
            }
        });

        expect(entries.length).toBe(3);
        expect(entries[0].name).toBe("x");
        expect(entries[0].value).toBe(100);
        expect(entries[1].name).toBe("y");
        expect(entries[1].value).toBe(200);

        const matrix = entries[2].value;
        expect(matrix[0].name).toBe("a");
        expect(matrix[0].value).toBe(1);
        expect(matrix[1].name).toBe("b");
        expect(matrix[1].value).toBe(2);
    });

    it("execute test case3", () =>
    {
        const entries = execute({
            "x": 100,
            "y": 200,
            "transform": {
                "matrix": {
                    "a": 1,
                    "b": 2
                },
                "color": {
                    "red": 255,
                    "green": 255
                }
            }

        });

        expect(entries.length).toBe(3);
        expect(entries[0].name).toBe("x");
        expect(entries[0].value).toBe(100);
        expect(entries[1].name).toBe("y");
        expect(entries[1].value).toBe(200);

        const transform = entries[2].value as IEntriesObject[];
        expect(transform.length).toBe(2);

        const matrix = transform[0].value;
        expect(matrix[0].name).toBe("a");
        expect(matrix[0].value).toBe(1);
        expect(matrix[1].name).toBe("b");
        expect(matrix[1].value).toBe(2);

        const color = transform[1].value;
        expect(color[0].name).toBe("red");
        expect(color[0].value).toBe(255);
        expect(color[1].name).toBe("green");
        expect(color[1].value).toBe(255);
    });
});