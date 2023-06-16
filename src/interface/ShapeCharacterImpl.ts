import { GridImpl } from "./GridImpl";
import { BoundsImpl } from "./BoundsImpl";
import { CharacterImpl } from "./CharacterImpl";

export interface ShapeCharacterImpl extends CharacterImpl {
    symbol: string;
    extends: string;
    bitmapId: number;
    grid: GridImpl | null;
    inBitmap: boolean;
    bounds: BoundsImpl;
    recodes?: any[];
    buffer?: number[] | null;
    _$buffer?: Uint8Array;
}