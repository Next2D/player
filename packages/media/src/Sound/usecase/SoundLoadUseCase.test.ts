import { Sound } from "../../Sound";
import { URLRequest } from "@next2d/net";
import { execute } from "./SoundLoadUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../MediaUtil", () => ({
    $ajax: vi.fn()
}));

vi.mock("../service/SoundLoadStartEventService", () => ({
    execute: vi.fn()
}));

vi.mock("../service/SoundProgressEventService", () => ({
    execute: vi.fn()
}));

vi.mock("../usecase/SoundLoadEndEventUseCase", () => ({
    execute: vi.fn(async () => {})
}));

describe("SoundLoadUseCase.js test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("execute test case1 - basic sound load", async () =>
    {
        const { $ajax } = await import("../../MediaUtil");
        
        const sound = new Sound();
        const request = new URLRequest("https://example.com/sound.mp3");

        vi.mocked($ajax).mockImplementation((options: any) => {
            // Simulate successful load
            if (options.event.loadend) {
                const mockEvent = {
                    target: {
                        status: 200,
                        response: new ArrayBuffer(100)
                    },
                    loaded: 100,
                    total: 100
                } as unknown as ProgressEvent;
                
                setTimeout(() => options.event.loadend(mockEvent), 0);
            }
        });

        await execute(sound, request);

        expect($ajax).toHaveBeenCalled();
    });

    it("execute test case2 - verify ajax options", async () =>
    {
        const { $ajax } = await import("../../MediaUtil");
        
        const sound = new Sound();
        const request = new URLRequest("https://example.com/audio.wav");
        request.method = "GET";
        request.data = { test: "data" };

        vi.mocked($ajax).mockImplementation((options: any) => {
            if (options.event.loadend) {
                const mockEvent = {
                    target: { status: 200, response: new ArrayBuffer(50) },
                    loaded: 50,
                    total: 50
                } as unknown as ProgressEvent;
                setTimeout(() => options.event.loadend(mockEvent), 0);
            }
        });

        await execute(sound, request);

        expect($ajax).toHaveBeenCalledWith(
            expect.objectContaining({
                format: "arraybuffer",
                url: "https://example.com/audio.wav",
                method: "GET",
                data: { test: "data" }
            })
        );
    });

    it("execute test case3 - loadstart event is triggered", async () =>
    {
        const { $ajax } = await import("../../MediaUtil");
        const { execute: soundLoadStartEventService } = await import("../service/SoundLoadStartEventService");
        
        const sound = new Sound();
        const request = new URLRequest("https://example.com/sound.mp3");

        vi.mocked($ajax).mockImplementation((options: any) => {
            if (options.event.loadstart) {
                const mockEvent = {
                    loaded: 0,
                    total: 100
                } as unknown as ProgressEvent;
                options.event.loadstart(mockEvent);
            }
            if (options.event.loadend) {
                const mockEvent = {
                    target: { status: 200, response: new ArrayBuffer(100) },
                    loaded: 100,
                    total: 100
                } as unknown as ProgressEvent;
                setTimeout(() => options.event.loadend(mockEvent), 0);
            }
        });

        await execute(sound, request);

        expect(soundLoadStartEventService).toHaveBeenCalled();
    });

    it("execute test case4 - progress event is triggered", async () =>
    {
        const { $ajax } = await import("../../MediaUtil");
        const { execute: soundProgressEventService } = await import("../service/SoundProgressEventService");
        
        const sound = new Sound();
        const request = new URLRequest("https://example.com/sound.mp3");

        vi.mocked($ajax).mockImplementation((options: any) => {
            if (options.event.progress) {
                const mockEvent = {
                    loaded: 50,
                    total: 100
                } as unknown as ProgressEvent;
                options.event.progress(mockEvent);
            }
            if (options.event.loadend) {
                const mockEvent = {
                    target: { status: 200, response: new ArrayBuffer(100) },
                    loaded: 100,
                    total: 100
                } as unknown as ProgressEvent;
                setTimeout(() => options.event.loadend(mockEvent), 0);
            }
        });

        await execute(sound, request);

        expect(soundProgressEventService).toHaveBeenCalled();
    });

    it("execute test case5 - loadend event is triggered", async () =>
    {
        const { $ajax } = await import("../../MediaUtil");
        const { execute: soundLoadEndEventUseCase } = await import("../usecase/SoundLoadEndEventUseCase");
        
        const sound = new Sound();
        const request = new URLRequest("https://example.com/sound.mp3");

        vi.mocked($ajax).mockImplementation((options: any) => {
            if (options.event.loadend) {
                const mockEvent = {
                    target: { status: 200, response: new ArrayBuffer(100) },
                    loaded: 100,
                    total: 100
                } as unknown as ProgressEvent;
                setTimeout(() => options.event.loadend(mockEvent), 0);
            }
        });

        await execute(sound, request);

        expect(soundLoadEndEventUseCase).toHaveBeenCalled();
    });

    it("execute test case6 - with POST method", async () =>
    {
        const { $ajax } = await import("../../MediaUtil");
        
        const sound = new Sound();
        const request = new URLRequest("https://example.com/sound.mp3");
        request.method = "POST";
        request.data = { userId: 123 };

        vi.mocked($ajax).mockImplementation((options: any) => {
            if (options.event.loadend) {
                const mockEvent = {
                    target: { status: 200, response: new ArrayBuffer(100) },
                    loaded: 100,
                    total: 100
                } as unknown as ProgressEvent;
                setTimeout(() => options.event.loadend(mockEvent), 0);
            }
        });

        await execute(sound, request);

        expect($ajax).toHaveBeenCalledWith(
            expect.objectContaining({
                method: "POST",
                data: { userId: 123 }
            })
        );
    });
});
