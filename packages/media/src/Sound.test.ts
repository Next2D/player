import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Sound } from "./Sound";
import { SoundMixer } from "./SoundMixer";
import { $getPlayingSounds, $setVolume } from "./MediaUtil";
import { stopAll } from "./Sound/StreamSoundRegistry";
import { Event as SoundEvent, IOErrorEvent } from "@next2d/events";
import { URLRequest } from "@next2d/net";

const audio = vi.hoisted(() => ({
    state: "running",
    destination: {},
    createGain: vi.fn(),
    createMediaElementSource: vi.fn(),
    createBufferSource: vi.fn(),
    decodeAudioData: vi.fn(),
    resume: vi.fn<() => Promise<void>>()
}));
vi.mock("./MediaUtil", async (original) => ({
    ...await original<typeof import("./MediaUtil")>(),
    $getAudioContext: () => audio
}));
vi.mock("./Sound/usecase/SoundLoadUseCase", () => ({ execute: vi.fn(async () => {}) }));

class MediaElement extends EventTarget {
    static instances: MediaElement[] = [];
    src = "";
    crossOrigin = "";
    preload = "";
    volume = 1;
    loop = false;
    paused = true;
    ended = false;
    currentTime = 0;
    error: { message: string } | null = null;
    constructor() { super(); MediaElement.instances.push(this); }
    getAttribute(name: string) { return name === "src" ? this.src || null : null; }
    hasAttribute(name: string) { return this.getAttribute(name) !== null; }
    removeAttribute(name: string) { if (name === "src") { this.src = ""; } }
    load = vi.fn();
    pause = vi.fn(() => { this.paused = true; });
    play = vi.fn(async () => { this.paused = false; this.ended = false; });
    finish() { this.paused = true; this.ended = true; this.dispatchEvent(new Event("ended")); }
}
const node = () => ({ connect: vi.fn(), disconnect: vi.fn() });
const gains = () => audio.createGain.mock.results.map(result => result.value);
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };
const load = async (sound: Sound, url = "/bgm.mp3") => {
    const pending = sound.load(new URLRequest(url));
    const element = MediaElement.instances.at(-1)!;
    element.dispatchEvent(new Event("loadedmetadata"));
    await pending;
    return element;
};

beforeEach(() => {
    vi.clearAllMocks();
    MediaElement.instances.length = 0;
    vi.stubGlobal("Audio", MediaElement);
    $setVolume(1);
    $getPlayingSounds().length = 0;
    audio.state = "running";
    audio.createGain.mockImplementation(() => ({ ...node(), gain: { value: 1 } }));
    audio.createMediaElementSource.mockImplementation(() => node());
    audio.createBufferSource.mockImplementation(() => ({ ...node(), start: vi.fn(), addEventListener: vi.fn(), buffer: null }));
    audio.resume.mockImplementation(async () => { audio.state = "running"; });
});
afterEach(() => {
    stopAll();
    for (const sound of [...$getPlayingSounds()]) { sound.stop(); }
    vi.unstubAllGlobals();
});

describe("Sound buffer compatibility", () => {
    it("defaults to the existing backend without allocating a media element or context graph", () => {
        const sound = new Sound();
        expect(sound.mode).toBe("buffer");
        expect(sound.audioBuffer).toBeNull();
        expect(sound.volume).toBe(1);
        expect(sound.loopCount).toBe(0);
        expect(sound.canLoop).toBe(false);
        sound.play();
        expect(MediaElement.instances).toHaveLength(0);
        expect(audio.createBufferSource).not.toHaveBeenCalled();
    });

    it("keeps the existing load usecase, including requests with POST data and headers", async () => {
        const { execute } = await import("./Sound/usecase/SoundLoadUseCase");
        const sound = new Sound();
        const request = new URLRequest("/effect");
        request.method = "POST";
        request.data = "body";
        request.requestHeaders = [{ name: "X-Effect", value: "one" }];
        await sound.load(request);
        expect(execute).toHaveBeenCalledExactlyOnceWith(sound, request);
        expect(MediaElement.instances).toHaveLength(0);
    });

    it("preserves start_time, duplicate-play guard, gain and replay behavior", () => {
        const sound = new Sound();
        sound.audioBuffer = {} as AudioBuffer;
        sound.volume = 0.7;
        sound.play(12.5);
        sound.play();
        const source = audio.createBufferSource.mock.results[0].value;
        expect(source.start).toHaveBeenCalledExactlyOnceWith(12.5);
        expect(source.buffer).toBe(sound.audioBuffer);
        expect(gains()[0].gain.value).toBe(0.7);
        expect($getPlayingSounds()).toEqual([sound]);
        sound.volume = 0.3;
        expect(gains()[0].gain.value).toBe(0.3);
        sound.stop();
        expect(source.disconnect).toHaveBeenCalledOnce();
        expect($getPlayingSounds()).toEqual([]);
        sound.play();
        expect(audio.createBufferSource).toHaveBeenCalledTimes(2);
        expect(audio.createMediaElementSource).not.toHaveBeenCalled();
    });

    it("preserves mixer min/overwrite semantics and clone buffer sharing", () => {
        const sound = new Sound();
        sound.audioBuffer = {} as AudioBuffer;
        SoundMixer.volume = 0.6;
        sound.volume = 0.8;
        expect(sound.volume).toBe(0.6);
        sound.loopCount = 2;
        const clone = sound.clone();
        expect(clone.mode).toBe("buffer");
        expect(clone.audioBuffer).toBe(sound.audioBuffer);
        expect(clone.loopCount).toBe(2);
        expect(clone.volume).toBe(0.6);
        sound.play();
        SoundMixer.volume = 0.4;
        expect(sound.volume).toBe(0.4);
        expect(gains()[0].gain.value).toBe(0.4);
        expect(sound.canLoop).toBe(true);
        sound.stop();
        expect(sound.canLoop).toBe(false);
    });

    it("preserves the existing natural completion event", () => {
        const sound = new Sound();
        sound.audioBuffer = {} as AudioBuffer;
        const complete = vi.fn();
        sound.addEventListener(SoundEvent.COMPLETE, complete);
        sound.play();
        const source = audio.createBufferSource.mock.results[0].value;
        source.addEventListener.mock.calls[0][1]();
        expect(complete).toHaveBeenCalledOnce();
        expect($getPlayingSounds()).toHaveLength(0);
    });
});

describe("Sound stream backend", () => {
    it("loads metadata with no AudioBuffer decode or graph, and emits OPEN/COMPLETE", async () => {
        const sound = new Sound({ mode: "stream" });
        const events: string[] = [];
        sound.addEventListener(SoundEvent.OPEN, () => events.push("open"));
        sound.addEventListener(SoundEvent.COMPLETE, () => events.push("complete"));
        const pending = sound.load(new URLRequest("/bgm.mp3"));
        const element = MediaElement.instances[0];
        expect(element.preload).toBe("metadata");
        expect(element.crossOrigin).toBe("anonymous");
        expect(element.src).toBe("/bgm.mp3");
        element.dispatchEvent(new Event("loadstart"));
        element.dispatchEvent(new Event("loadedmetadata"));
        await pending;
        expect(events).toEqual(["open", "complete"]);
        expect(sound.audioBuffer).toBeNull();
        expect(audio.createMediaElementSource).not.toHaveBeenCalled();
        expect(audio.decodeAudioData).not.toHaveBeenCalled();
    });

    it("applies credentials and rejects unsupported requests without replacing a loaded stream", async () => {
        const sound = new Sound({ mode: "stream" });
        const request = new URLRequest("https://example.com/bgm.mp3");
        request.withCredentials = true;
        const pending = sound.load(request);
        const element = MediaElement.instances[0];
        expect(element.crossOrigin).toBe("use-credentials");
        element.dispatchEvent(new Event("loadedmetadata"));
        await pending;
        request.method = "POST";
        await expect(sound.load(request)).rejects.toThrow("GET URL");
        sound.play();
        expect(element.src).toBe("https://example.com/bgm.mp3");
        await expect(sound.$build({ buffer: [], audioBuffer: null })).rejects.toThrow("buffer mode");
        expect(() => sound.play(1)).toThrow("start_time");
    });

    it("uses one gain with live volume/mixer changes without restarting or double attenuation", async () => {
        const sound = new Sound({ mode: "stream" });
        const element = await load(sound);
        sound.volume = 0.5;
        sound.play();
        sound.play();
        expect(element.volume).toBe(1);
        expect(gains()[0].gain.value).toBe(0.5);
        sound.volume = 0;
        expect(gains()[0].gain.value).toBe(0);
        SoundMixer.volume = 0.2;
        expect(sound.volume).toBe(0.2);
        expect(gains()[0].gain.value).toBe(0.2);
        expect(element.play).toHaveBeenCalledOnce();
        expect(audio.createMediaElementSource).toHaveBeenCalledExactlyOnceWith(element);
        expect(audio.createMediaElementSource.mock.results[0].value.connect).toHaveBeenCalledExactlyOnceWith(gains()[0]);
        expect(gains()[0].connect).toHaveBeenCalledExactlyOnceWith(audio.destination);
        expect($getPlayingSounds()).toHaveLength(0);
    });

    it("reuses a native infinite-loop player and releases inactive media across twenty replays", async () => {
        const sound = new Sound({ mode: "stream" });
        const element = await load(sound);
        sound.loopCount = Infinity;
        for (let index = 0; index < 20; index++) {
            sound.play();
            expect(element.loop).toBe(true);
            expect(element.src).toBe("/bgm.mp3");
            expect(sound.canLoop).toBe(true);
            sound.stop();
            expect(element.src).toBe("");
            expect(element.paused).toBe(true);
            expect(sound.canLoop).toBe(false);
        }
        expect(audio.createMediaElementSource).toHaveBeenCalledOnce();
        expect(audio.createGain).toHaveBeenCalledOnce();
        expect(audio.createBufferSource).not.toHaveBeenCalled();
        expect(audio.decodeAudioData).not.toHaveBeenCalled();
        window.dispatchEvent(new Event("touchend"));
        expect(element.play).toHaveBeenCalledTimes(20);
    });

    it.each([0, 1, 3])("repeats %i additional times and completes once", async (repeats) => {
        const sound = new Sound({ mode: "stream" });
        const element = await load(sound);
        const complete = vi.fn();
        sound.addEventListener(SoundEvent.COMPLETE, complete);
        sound.loopCount = repeats;
        sound.play();
        for (let count = 0; count <= repeats; count++) {
            await flush();
            element.finish();
        }
        expect(element.play).toHaveBeenCalledTimes(repeats + 1);
        expect(complete).toHaveBeenCalledOnce();
        expect(element.src).toBe("");
    });

    it("retries blocked playback and an interrupted context from gestures, but never after stop", async () => {
        const sound = new Sound({ mode: "stream" });
        const element = await load(sound);
        audio.state = "suspended";
        audio.resume.mockRejectedValueOnce(new DOMException("Gesture", "NotAllowedError"));
        element.play.mockRejectedValueOnce(new DOMException("Gesture", "NotAllowedError"));
        sound.play();
        await flush();
        expect(element.paused).toBe(true);
        window.dispatchEvent(new Event("touchend"));
        await flush();
        expect(element.paused).toBe(false);
        expect(audio.state).toBe("running");
        audio.state = "interrupted";
        window.dispatchEvent(new Event("pointerdown"));
        expect(audio.resume).toHaveBeenCalledTimes(3);
        sound.stop();
        window.dispatchEvent(new Event("touchend"));
        expect(element.play).toHaveBeenCalledTimes(2);
    });

    it("ignores late play rejection and ended callbacks from an earlier playback generation", async () => {
        const sound = new Sound({ mode: "stream" });
        const element = await load(sound);
        let reject!: (reason: Error) => void;
        element.play.mockImplementationOnce(() => new Promise<void>((_resolve, fail) => { reject = fail; }));
        const listener = vi.spyOn(element, "addEventListener");
        const error = vi.fn();
        sound.addEventListener(IOErrorEvent.IO_ERROR, error);
        sound.play();
        const oldEnded = listener.mock.calls.find(([event]) => event === "ended")![1] as EventListener;
        sound.stop();
        sound.play();
        reject(new Error("old playback"));
        oldEnded(new Event("ended"));
        await flush();
        expect(error).not.toHaveBeenCalled();
        expect(element.paused).toBe(false);
        expect(element.src).toBe("/bgm.mp3");
    });

    it("rejects metadata failures and cancelled/replaced loads without late completion", async () => {
        const sound = new Sound({ mode: "stream" });
        const first = sound.load(new URLRequest("/one.mp3"));
        const firstResult = expect(first).rejects.toMatchObject({ name: "AbortError" });
        const second = sound.load(new URLRequest("/two.mp3"));
        await firstResult;
        const secondResult = expect(second).rejects.toThrow("missing");
        const element = MediaElement.instances[0];
        const error = vi.fn();
        sound.addEventListener(IOErrorEvent.IO_ERROR, error);
        element.error = { message: "missing" };
        element.dispatchEvent(new Event("error"));
        await secondResult;
        expect(error).toHaveBeenCalledOnce();
        expect(element.src).toBe("");
        sound.play();
        expect(element.play).not.toHaveBeenCalled();
    });

    it("clones an independent stream without allocating/decoding another complete track", async () => {
        const sound = new Sound({ mode: "stream" });
        const element = await load(sound);
        sound.loopCount = Infinity;
        sound.volume = 0.3;
        const clone = sound.clone();
        expect(MediaElement.instances).toHaveLength(1);
        expect(clone.mode).toBe("stream");
        expect(clone.audioBuffer).toBeNull();
        expect(clone.volume).toBe(0.3);
        expect(clone.loopCount).toBe(Infinity);
        sound.play();
        clone.play();
        const clonedElement = MediaElement.instances[1];
        expect(clonedElement.src).toBe(element.src);
        clone.stop();
        expect(element.paused).toBe(false);
        expect(clonedElement.paused).toBe(true);
    });

    it("reuses the element/source when loading a different URL and ignores the old ended callback", async () => {
        const sound = new Sound({ mode: "stream" });
        const element = await load(sound, "/first.mp3");
        const listen = vi.spyOn(element, "addEventListener");
        sound.play();
        const ended = listen.mock.calls.find(([type]) => type === "ended")![1] as EventListener;
        await load(sound, "/second.mp3");
        sound.play();
        ended(new Event("ended"));
        expect(element.src).toBe("/second.mp3");
        expect(element.paused).toBe(false);
        expect(MediaElement.instances).toHaveLength(1);
        expect(audio.createMediaElementSource).toHaveBeenCalledOnce();
        expect(audio.decodeAudioData).not.toHaveBeenCalled();
    });

    it("cancels a stopped load and requires a new load before play", async () => {
        const sound = new Sound({ mode: "stream" });
        const pending = sound.load(new URLRequest("/first.mp3"));
        const rejected = expect(pending).rejects.toMatchObject({ name: "AbortError" });
        const element = MediaElement.instances[0];
        sound.stop();
        await rejected;
        element.dispatchEvent(new Event("loadedmetadata"));
        sound.play();
        expect(element.play).not.toHaveBeenCalled();
        await load(sound);
        sound.play();
        expect(element.play).toHaveBeenCalledOnce();
    });

    it("stops on fatal playback errors and removes the gesture retry", async () => {
        const sound = new Sound({ mode: "stream" });
        const element = await load(sound);
        const failed = vi.fn();
        sound.addEventListener(IOErrorEvent.IO_ERROR, failed);
        element.play.mockRejectedValueOnce(new DOMException("Unsupported", "NotSupportedError"));
        sound.play();
        await flush();
        expect(failed).toHaveBeenCalledOnce();
        expect(element.src).toBe("");
        window.dispatchEvent(new Event("touchend"));
        expect(element.play).toHaveBeenCalledOnce();
    });

    it("stops all streams alongside a legacy sound without changing the legacy registry", async () => {
        const legacy = new Sound();
        legacy.audioBuffer = {} as AudioBuffer;
        legacy.play();
        const one = new Sound({ mode: "stream" });
        const two = new Sound({ mode: "stream" });
        const first = await load(one);
        const second = await load(two);
        one.play();
        two.play();
        expect($getPlayingSounds()).toEqual([legacy]);
        SoundMixer.stopAll();
        expect($getPlayingSounds()).toHaveLength(0);
        expect(first.src).toBe("");
        expect(second.src).toBe("");
        expect(gains().map(gain => gain.gain.value)).toEqual([0, 0, 0]);
    });

    it("disposes loading and active resources, and can be explicitly loaded again", async () => {
        const sound = new Sound({ mode: "stream" });
        const pending = sound.load(new URLRequest("/bgm.mp3"));
        const cancelled = expect(pending).rejects.toMatchObject({ name: "AbortError" });
        sound.dispose();
        await cancelled;
        const element = await load(sound);
        sound.play();
        sound.dispose();
        expect(element.src).toBe("");
        sound.play();
        window.dispatchEvent(new Event("keydown"));
        expect(element.play).toHaveBeenCalledOnce();
        await load(sound, "/new.mp3");
        sound.play();
        expect(audio.createMediaElementSource).toHaveBeenCalledTimes(2);
    });
});
