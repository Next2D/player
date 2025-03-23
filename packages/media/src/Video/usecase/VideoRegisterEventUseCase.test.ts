import { Video } from "../../Video";
import { execute } from "./VideoRegisterEventUseCase";
import { describe, expect, it, vi } from "vitest";

describe("VideoRegisterEventUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const types: string[] = [];
        const MockHTMLVideoElement = vi.fn().mockImplementation(() =>
        {
            return {
                "duration": 100,
                "videoWidth": 200,
                "videoHeight": 300,
                "addEventListener": vi.fn((type: string) => {
                    types.push(type);
                })
            } as unknown as HTMLVideoElement;
        });

        const mockElement = new MockHTMLVideoElement();

        const MockVideo = vi.fn().mockImplementation(() =>
        {
            return {
                "currentTime": 100,
                "duration": 0
            } as unknown as Video;
        });

        const mockVideo = new MockVideo();

        expect(types.length).toBe(0);
        execute(mockElement, mockVideo, {
            "xMin": 0,
            "yMin": 0,
            "xMax": 0,
            "yMax": 0
        });

        expect(types.length).toBe(4);
        expect(types[0]).toBe("loadedmetadata");
        expect(types[1]).toBe("progress");
        expect(types[2]).toBe("canplaythrough");
        expect(types[3]).toBe("ended");
    });
});