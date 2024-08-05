import type { ICharacter } from "./ICharacter";

export interface ISoundCharacter extends ICharacter {
    buffer: number[] | null;
    audioBuffer: AudioBuffer | null;
}