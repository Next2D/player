export interface IVideoCharacter {
    symbol?: string;
    extends: string;
    buffer: number[] | null;
    _$buffer: Uint8Array;
    volume: number;
    loop: boolean;
    autoPlay: boolean;
}