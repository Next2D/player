import type { IIndexRange } from "./IIndexRange";

export interface IFillMesh {
    buffer: Float32Array;
    indexRanges: IIndexRange[];
}