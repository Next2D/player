import { Sound } from "../../Sound";
import { execute } from "./SoundBuildFromCharacterUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../service/SoundDecodeService", () => ({
    execute: vi.fn(async () => {
        // Mock AudioBuffer
        return {
            duration: 10,
            length: 44100,
            numberOfChannels: 2,
            sampleRate: 44100,
            getChannelData: vi.fn()
        } as unknown as AudioBuffer;
    })
}));

describe("SoundBuildFromCharacterUseCase.js test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("execute test case1 - build sound with existing audioBuffer", async () =>
    {
        const sound = new Sound();
        const mockAudioBuffer = {
            duration: 5,
            length: 22050,
            numberOfChannels: 1,
            sampleRate: 44100,
            getChannelData: vi.fn()
        } as unknown as AudioBuffer;

        const character = {
            buffer: [1, 2, 3, 4],
            audioBuffer: mockAudioBuffer
        };

        await execute(sound, character);

        expect(sound.audioBuffer).toBe(mockAudioBuffer);
    });

    it("execute test case2 - build sound without audioBuffer", async () =>
    {
        const sound = new Sound();
        const character = {
            buffer: [1, 2, 3, 4, 5, 6, 7, 8]
        };

        await execute(sound, character);

        expect(sound.audioBuffer).toBeDefined();
        expect(character.audioBuffer).toBeDefined();
    });

    it("execute test case3 - decode service is called for new buffer", async () =>
    {
        const { execute: soundDecodeService } = await import("../service/SoundDecodeService");
        
        const sound = new Sound();
        const character = {
            buffer: [10, 20, 30, 40]
        };

        await execute(sound, character);

        expect(soundDecodeService).toHaveBeenCalled();
    });

    it("execute test case4 - decode service returns null", async () =>
    {
        const { execute: soundDecodeService } = await import("../service/SoundDecodeService");
        vi.mocked(soundDecodeService).mockResolvedValueOnce(null);
        
        const sound = new Sound();
        const character = {
            buffer: [10, 20, 30]
        };

        await execute(sound, character);

        // When decode returns null, audioBuffer should remain null (not set)
        expect(sound.audioBuffer).toBeNull();
    });

    it("execute test case5 - buffer is converted to Uint8Array", async () =>
    {
        const { execute: soundDecodeService } = await import("../service/SoundDecodeService");
        
        const sound = new Sound();
        const character = {
            buffer: [100, 200, 50, 150]
        };

        await execute(sound, character);

        expect(soundDecodeService).toHaveBeenCalled();
        const callArg = vi.mocked(soundDecodeService).mock.calls[0][0];
        expect(callArg).toBeInstanceOf(ArrayBuffer);
    });

    it("execute test case6 - audioBuffer is cached in character", async () =>
    {
        const sound = new Sound();
        const character = {
            buffer: [1, 2, 3, 4]
        };

        await execute(sound, character);

        expect(character.audioBuffer).toBeDefined();
        
        // Second call should use cached audioBuffer
        const sound2 = new Sound();
        await execute(sound2, character);
        
        expect(sound2.audioBuffer).toBe(character.audioBuffer);
    });
});
