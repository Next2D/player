export interface AttachmentImpl {
    width: number;
    height: number;
    color: WebGLTexture | WebGLRenderbuffer | null;
    texture: WebGLTexture | null;
    msaa: boolean;
    stencil: WebGLRenderbuffer | null;
    mask: boolean;
    clipLevel: number;
    isActive: boolean;
}