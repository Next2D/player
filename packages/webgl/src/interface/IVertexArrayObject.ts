export interface IVertexArrayObject {
    id: number;
    resource: WebGLVertexArrayObject;
    indexCount: number;
    vertexBuffer: WebGLBuffer;
    vertexLength: number;
}