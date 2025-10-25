import type { Video } from "../../Video";
import { execute } from "./VideoLoadedmetadataEventService";
import { describe, expect, it, vi } from "vitest";

describe("VideoLoadedmetadataEventService.js test", () =>
{
    it("execute test case1", () =>
    {
        const MockVideo = vi.fn(function(this: any) {
            this.currentTime = 100;
            this.duration = 0;
        }) as any;

        const mockVideo = new MockVideo();
        expect(mockVideo.currentTime).toBe(100);
        expect(mockVideo.duration).toBe(0);

        const MockHTMLVideoElement = vi.fn(function(this: any) {
            this.duration = 100;
            this.videoWidth = 200;
            this.videoHeight = 300;
        }) as any;

        const mockElement = new MockHTMLVideoElement();
        expect(mockElement.duration).toBe(100);
        expect(mockElement.videoWidth).toBe(200);
        expect(mockElement.videoHeight).toBe(300);

        execute(mockElement, mockVideo);

        // after
        expect(mockVideo.currentTime).toBe(0);
        expect(mockVideo.duration).toBe(100);
        expect(mockVideo.videoWidth).toBe(200);
        expect(mockVideo.videoHeight).toBe(300);
    });
});