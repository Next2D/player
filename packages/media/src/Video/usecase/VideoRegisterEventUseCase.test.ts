import { Video } from "../../Video";
import { execute } from "./VideoRegisterEventUseCase";
import { describe, expect, it, vi } from "vitest";

describe("VideoRegisterEventUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const types: string[] = [];
        const MockHTMLVideoElement = vi.fn(function(this: any) {
            this.duration = 100;
            this.videoWidth = 200;
            this.videoHeight = 300;
            this.addEventListener = vi.fn((type: string) => {
                types.push(type);
            });
        }) as any;

        const mockElement = new MockHTMLVideoElement();

        const MockVideo = vi.fn(function(this: any) {
            this.currentTime = 100;
            this.duration = 0;
        }) as any;

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