import type { CharacterImpl } from "./CharacterImpl";

export interface SoundCharacterImpl extends CharacterImpl {
    buffer: number[] | null;
    audioBuffer: AudioBuffer | null;
}