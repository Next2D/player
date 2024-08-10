import { IGrid } from "./IGrid";
import { IBounds } from "./IBounds";

export interface IShapeCharacter {
    symbol?: string;
    extends: string;
    bitmapId: number;
    grid: IGrid | null;
    inBitmap: boolean;
    bounds: IBounds;
    recodes?: any[] | null;
    buffer?: number[] | null;
    imageBuffer?: Uint8Array;
    recodeBuffer?: Float32Array;
}