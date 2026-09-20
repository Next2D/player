import type { Sound } from "../Sound";
import type { URLRequest } from "@next2d/net";
import { Event, IOErrorEvent } from "@next2d/events";
import { $getAudioContext, $getVolume } from "../MediaUtil";
import { register, unregister } from "./StreamSoundRegistry";

/** Internal, opt-in backend. Never fetches/decodeAudioData()s a complete BGM into JS memory. */
export class StreamSound
{
    private element: HTMLAudioElement | null = null;
    private source: MediaElementAudioSourceNode | null = null;
    private gain: GainNode | null = null;
    private url: string | null = null;
    private credentials = false;
    private ready = false;
    private active = false;
    private count = 0;
    private generation = 0;
    private playPending = false;
    private cancelLoad: (() => void) | null = null;
    private removePlaybackEvents: (() => void) | null = null;

    constructor (public readonly sound: Sound)
    {
        // Browser resources are allocated only by load()/play().
    }

    get canLoop (): boolean
    {
        return this.active && this.sound.loopCount >= this.count;
    }

    setVolume (volume: number): void
    {
        if (this.gain) {
            this.gain.gain.value = volume;
        }
    }

    private getElement (): HTMLAudioElement
    {
        if (!this.element) {
            this.element = new Audio();
            this.element.preload = "none";
            this.element.volume = 1;
        }
        return this.element;
    }

    private restoreSource (): HTMLAudioElement
    {
        const element = this.getElement();
        if (!element.getAttribute("src") && this.url) {
            // Must be assigned before src, including when cloning/replaying a stopped stream.
            element.crossOrigin = this.credentials ? "use-credentials" : "anonymous";
            element.src = this.url;
        }
        return element;
    }

    private emitError (error: unknown): void
    {
        if (this.sound.willTrigger(IOErrorEvent.IO_ERROR)) {
            this.sound.dispatchEvent(new IOErrorEvent(
                IOErrorEvent.IO_ERROR, false, error instanceof Error ? error.message : String(error)
            ));
        }
    }

    /** Resolves at metadata readiness, not full download. Byte progress is unavailable. */
    async load (request: URLRequest): Promise<void>
    {
        // Do not silently replace a streaming request with a full-file fetch/blob fallback.
        if (request.method.toUpperCase() !== "GET" || request.requestHeaders.length || request.data !== null) {
            throw new TypeError("Stream Sound requires a GET URL without requestHeaders or data.");
        }
        if (!request.url) {
            throw new TypeError("Stream Sound requires a non-empty URL.");
        }
        this.stop();
        this.ready = false;
        this.url = request.url;
        this.credentials = request.withCredentials;
        const element = this.getElement();
        const generation = this.generation;

        await new Promise<void>((resolve, reject) => {
            const cleanup = (): void => {
                element.removeEventListener("loadstart", opened);
                element.removeEventListener("loadedmetadata", loaded);
                element.removeEventListener("error", failed);
                element.removeEventListener("abort", aborted);
                this.cancelLoad = null;
            };
            const opened = (): void => {
                if (generation === this.generation && this.sound.willTrigger(Event.OPEN)) {
                    this.sound.dispatchEvent(new Event(Event.OPEN));
                }
            };
            const loaded = (): void => {
                if (generation !== this.generation) {
                    return;
                }
                cleanup();
                this.ready = true;
                resolve();
                if (this.sound.willTrigger(Event.COMPLETE)) {
                    this.sound.dispatchEvent(new Event(Event.COMPLETE));
                }
            };
            const failed = (): void => {
                if (generation !== this.generation) {
                    return;
                }
                const error = new Error(element.error?.message || "Stream Sound could not load metadata.");
                cleanup();
                this.stop();
                reject(error);
                this.emitError(error);
            };
            const aborted = (): void => {
                if (generation !== this.generation) {
                    return;
                }
                this.stop();
            };
            this.cancelLoad = (): void => {
                cleanup();
                reject(new DOMException("Stream Sound loading was cancelled.", "AbortError"));
            };
            element.addEventListener("loadstart", opened);
            element.addEventListener("loadedmetadata", loaded);
            element.addEventListener("error", failed);
            element.addEventListener("abort", aborted);
            try {
                element.preload = "metadata";
                this.restoreSource();
                element.load();
            } catch (error) {
                cleanup();
                this.stop();
                reject(error);
                this.emitError(error);
            }
        });
    }

    play (start_time: number): void
    {
        if (start_time !== 0) {
            throw new RangeError("Stream Sound supports play() only; scheduled start_time requires buffer mode.");
        }
        if (this.active || !this.ready || !this.url) {
            return;
        }
        const element = this.restoreSource();
        const context = $getAudioContext();
        // One source per element, retained across stop/replay and URL changes.
        if (!this.source) {
            this.source = context.createMediaElementSource(element);
        }
        if (!this.gain) {
            this.gain = context.createGain();
        }
        this.gain.gain.value = Math.min($getVolume(), this.sound.volume);
        this.source.connect(this.gain);
        this.gain.connect(context.destination);
        element.currentTime = 0;
        element.loop = this.sound.loopCount === Infinity;
        this.active = true;
        this.count = 1;
        const generation = ++this.generation;
        const ended = (): void => {
            if (generation !== this.generation || !this.active || !element.ended) {
                return;
            }
            if (this.canLoop) {
                this.count++;
                element.currentTime = 0;
                element.loop = this.sound.loopCount === Infinity;
                this.retry();
                return;
            }
            this.stop();
            if (this.sound.willTrigger(Event.COMPLETE)) {
                this.sound.dispatchEvent(new Event(Event.COMPLETE));
            }
        };
        const failed = (): void => {
            if (generation !== this.generation || !this.active) {
                return;
            }
            const error = new Error(element.error?.message || "Stream Sound playback failed.");
            this.stop();
            this.emitError(error);
        };
        element.addEventListener("ended", ended);
        element.addEventListener("error", failed);
        this.removePlaybackEvents = (): void => {
            element.removeEventListener("ended", ended);
            element.removeEventListener("error", failed);
        };
        register(this);
        this.retry();
    }

    /** Both resume() and play() must be invoked synchronously inside a user gesture. */
    retry (): void
    {
        if (!this.active || !this.element) {
            return;
        }
        const context = $getAudioContext();
        if (context.state !== "running") {
            void context.resume().catch(() => { /* Retry on the next gesture, including iOS interruptions. */ });
        }
        if (!this.element.paused || this.playPending) {
            return;
        }
        const generation = this.generation;
        this.playPending = true;
        void this.element.play().then(() => {
            if (generation === this.generation) {
                this.playPending = false;
            }
        }, (error: unknown) => {
            if (generation !== this.generation) {
                return;
            }
            this.playPending = false;
            // DOMException is not an Error subclass in every browser/realm.
            const name = error && typeof error === "object" && "name" in error ? error.name : "";
            if (name !== "NotAllowedError" && name !== "AbortError") {
                this.stop();
                this.emitError(error);
            }
        });
    }

    stop (): void
    {
        ++this.generation;
        this.active = false;
        this.count = 0;
        this.playPending = false;
        unregister(this);
        this.cancelLoad?.();
        this.removePlaybackEvents?.();
        this.removePlaybackEvents = null;
        if (this.gain) {
            this.gain.gain.value = 0;
            this.gain.disconnect();
        }
        this.source?.disconnect();
        if (this.element) {
            this.element.pause();
            if (this.element.hasAttribute("src")) {
                this.element.removeAttribute("src");
                this.element.load();
            }
        }
    }

    cloneTo (target: StreamSound): void
    {
        target.url = this.url;
        target.credentials = this.credentials;
        target.ready = this.ready;
    }

    /** Release references as well as media data. load() can initialize this instance again. */
    dispose (): void
    {
        this.stop();
        this.ready = false;
        this.url = null;
        this.element = null;
        this.source = null;
        this.gain = null;
    }
}
