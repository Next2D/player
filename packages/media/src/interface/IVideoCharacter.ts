import type { IBounds } from "./IBounds";

export interface IVideoCharacter {
    symbol?: string;
    extends: string;
    buffer: number[] | null;
    videoData: null | Uint8Array;
    volume: number;
    loop: boolean;
    autoPlay: boolean;
    bounds: IBounds;
}