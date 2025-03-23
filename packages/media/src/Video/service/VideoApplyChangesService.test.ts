import { execute } from "./VideoApplyChangesService";
import { Video } from "../../Video";
import { describe, expect, it } from "vitest";

describe("TextFieldApplyChangesService.js test", () =>
{
    it("execute test case1", () =>
    {
        const video = new Video();

        video.changed = false;
        expect(video.changed).toBe(false);

        execute(video);
        expect(video.changed).toBe(true);
    });
});