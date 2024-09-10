import type { IIndexRange } from "./IIndexRange";

export interface IVertexArrayObject {
    id: number;
    resource: WebGLVertexArrayObject;
    indexCount: number;
    vertexBuffer: WebGLBuffer;
    vertexLength: number;
}