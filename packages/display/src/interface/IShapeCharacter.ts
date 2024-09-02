import { IGrid } from "./IGrid";
import { IBounds } from "./IBounds";

export interface IShapeCharacter {
    extends: string;
    bounds: IBounds;
    symbol?: string;
    bitmapId: number;
    inBitmap?: boolean;
    grid?: IGrid | null;
    recodes?: any[] | null;
    buffer?: number[] | null;
    imageBuffer?: Uint8Array;
    recodeBuffer?: Float32Array;
}