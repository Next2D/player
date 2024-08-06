import type { Video } from "../../Video";
import { execute } from "./VideoLoadedmetadataEventService";
import { describe, expect, it, vi } from "vitest";

describe("VideoLoadedmetadataEventService.js test", () =>
{
    it("execute test case1", () =>
    {
        const MockVideo = vi.fn().mockImplementation(() =>
        {
            return {
                "currentTime": 100,
                "duration": 0
            } as unknown as Video;
        });

        const mockVideo = new MockVideo();
        expect(mockVideo.currentTime).toBe(100);
        expect(mockVideo.duration).toBe(0);

        const MockHTMLVideoElement = vi.fn().mockImplementation(() =>
        {
            return {
                "duration": 100,
                "videoWidth": 200,
                "videoHeight": 300
            } as unknown as HTMLVideoElement;
        });

        const mockElement = new MockHTMLVideoElement();
        expect(mockElement.duration).toBe(100);
        expect(mockElement.videoWidth).toBe(200);
        expect(mockElement.videoHeight).toBe(300);

        const bounds = {
            "xMin": 0,
            "yMin": 0,
            "xMax": 0,
            "yMax": 0
        };
        expect(bounds.xMax).toBe(0);
        expect(bounds.yMax).toBe(0);

        execute(mockElement, mockVideo, bounds);

        // after
        expect(mockVideo.currentTime).toBe(0);
        expect(mockVideo.duration).toBe(100);
        expect(bounds.xMax).toBe(200);
        expect(bounds.yMax).toBe(300);
    });
});