import type { IIndexRange } from "./IIndexRange";

export interface IVertexArrayObject {
    resource: WebGLVertexArrayObject;
    indexRanges: IIndexRange[];
    vertexBuffer: WebGLBuffer;
    vertexLength: number;
}