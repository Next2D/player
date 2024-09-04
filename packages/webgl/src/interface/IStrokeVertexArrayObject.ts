import type { IIndexRange } from "./IIndexRange";
import type { IVertexArrayObject } from "./IVertexArrayObject";

export interface IStrokeVertexArrayObject extends IVertexArrayObject {
    indexBuffer: WebGLBuffer;
    indexLength: number;
    indexCount: number;
}