import type { IIndexRange } from "./IIndexRange";

export interface IVertexArrayObject {
    id: number;
    resource: WebGLVertexArrayObject;
    indexRanges: IIndexRange[] | null;
    vertexBuffer: WebGLBuffer;
    vertexLength: number;
}