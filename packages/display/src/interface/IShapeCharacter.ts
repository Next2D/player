import { IGrid } from "./IGrid";
import { IBounds } from "./IBounds";

export interface IShapeCharacter {
    symbol?: string;
    extends: string;
    bitmapId: number;
    grid: IGrid | null;
    inBitmap: boolean;
    bounds: IBounds;
    recodes?: any[];
    buffer?: number[] | null;
    _$buffer?: Uint8Array;
}