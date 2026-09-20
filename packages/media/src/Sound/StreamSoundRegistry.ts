import type { StreamSound } from "./StreamSound";

// Keep streams separate: the legacy playing-sound array and its iteration semantics stay unchanged.
const streams = new Set<StreamSound>();
const gestures = ["pointerdown", "touchend", "keydown"];

const retry = (): void =>
{
    for (const stream of streams) {
        stream.retry();
    }
};

export const register = (stream: StreamSound): void =>
{
    if (!streams.size) {
        for (const gesture of gestures) {
            window.addEventListener(gesture, retry);
        }
    }
    streams.add(stream);
};

export const unregister = (stream: StreamSound): void =>
{
    streams.delete(stream);
    if (!streams.size) {
        for (const gesture of gestures) {
            window.removeEventListener(gesture, retry);
        }
    }
};

export const updateVolume = (volume: number): void =>
{
    for (const stream of streams) {
        stream.sound.volume = volume;
    }
};

export const stopAll = (): void =>
{
    for (const stream of Array.from(streams)) {
        stream.stop();
    }
};
