import { BoundsImpl } from "./BoundsImpl";
import { CharacterImpl } from "./CharacterImpl";

export interface VideoCharacterImpl extends CharacterImpl {
    symbol: string;
    extends: string;
    buffer: number[] | null;
    _$buffer: Uint8Array;
    bounds: BoundsImpl;
    volume: number;
    loop: boolean;
    autoPlay: boolean;
}