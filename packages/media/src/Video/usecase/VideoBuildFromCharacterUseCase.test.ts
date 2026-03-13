import { execute } from "./VideoBuildFromCharacterUseCase";
import { describe, expect, it, vi } from "vitest";

describe("VideoBuildFromCharacterUseCase.js test", () => {

    it("execute test case1 - build video from character with buffer", () =>
    {
        const mockVideo = {
            "loop": false,
            "autoPlay": false,
            "videoWidth": 0,
            "videoHeight": 0,
            "volume": 0,
            "src": ""
        } as any;

        const character = {
            "loop": true,
            "autoPlay": true,
            "bounds": { "xMax": 320, "yMax": 240 },
            "volume": 0.8,
            "buffer": [0, 1, 2, 3],
            "videoData": null
        } as any;

        // Mock URL.createObjectURL
        const originalCreateObjectURL = URL.createObjectURL;
        URL.createObjectURL = vi.fn(() => "blob:mock-url");

        execute(mockVideo, character);

        expect(mockVideo.loop).toBe(true);
        expect(mockVideo.autoPlay).toBe(true);
        expect(mockVideo.videoWidth).toBe(320);
        expect(mockVideo.videoHeight).toBe(240);
        expect(mockVideo.volume).toBe(0.8);
        expect(mockVideo.src).toBe("blob:mock-url");
        expect(character.videoData).toBeInstanceOf(Uint8Array);
        expect(character.buffer).toBeNull();

        URL.createObjectURL = originalCreateObjectURL;
    });

    it("execute test case2 - reuse existing videoData", () =>
    {
        const mockVideo = {
            "loop": false,
            "autoPlay": false,
            "videoWidth": 0,
            "videoHeight": 0,
            "volume": 0,
            "src": ""
        } as any;

        const existingVideoData = new Uint8Array([10, 20, 30]);
        const character = {
            "loop": false,
            "autoPlay": false,
            "bounds": { "xMax": 640, "yMax": 480 },
            "volume": 1.0,
            "buffer": [5, 6, 7],
            "videoData": existingVideoData
        } as any;

        const originalCreateObjectURL = URL.createObjectURL;
        URL.createObjectURL = vi.fn(() => "blob:mock-url-2");

        execute(mockVideo, character);

        expect(character.videoData).toBe(existingVideoData);
        expect(character.buffer).not.toBeNull();
        expect(mockVideo.videoWidth).toBe(640);
        expect(mockVideo.videoHeight).toBe(480);

        URL.createObjectURL = originalCreateObjectURL;
    });
});
