import type { IGrid } from "./IGrid";
import type { IBounds } from "./IBounds";

export interface IShapeCharacter {
    symbol?: string;
    extends: string;
    bounds: IBounds;
    bitmapId: number;
    inBitmap?: boolean;
    grid?: IGrid | null;
    recodes?: any[] | null;
    buffer?: number[] | null;
    imageBuffer?: Uint8Array;
    recodeBuffer?: Float32Array;
}