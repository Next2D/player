import type { IIndexRange } from "./IIndexRange";

export interface IVertexArrayObject {
    resource: WebGLVertexArrayObject;
    indexRanges: IIndexRange[] | null;
    vertexBuffer: WebGLBuffer;
    vertexLength: number;
}