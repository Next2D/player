// vitest-webgl-canvas-mock の読み込み後に実行され、
// モックに不足している WebGL2 のメソッドを補完する。
// (アトラスの TEXTURE_2D_ARRAY 化で texStorage3D / framebufferTextureLayer を使用)
const canvas = document.createElement("canvas");
const gl = canvas.getContext("webgl2") as any;
if (gl) {
    const glPrototype = Object.getPrototypeOf(gl);
    if (typeof glPrototype.texStorage3D !== "function") {
        glPrototype.texStorage3D = () => { return undefined; };
    }
    if (typeof glPrototype.framebufferTextureLayer !== "function") {
        glPrototype.framebufferTextureLayer = () => { return undefined; };
    }
}

export {};
