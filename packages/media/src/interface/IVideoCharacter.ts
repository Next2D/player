export interface IVideoCharacter {
    symbol?: string;
    extends: string;
    buffer: number[] | null;
    videoData: Uint8Array;
    volume: number;
    loop: boolean;
    autoPlay: boolean;
}