import type { IIndexRange } from "./IIndexRange";

export interface IFillMesh {
    vertexBufferData: Float32Array;
    indexRanges: IIndexRange[];
}