import { WgslFullscreenPositions, WgslUnitQuadVertices } from "../common/SharedWgsl";

const createFullscreenQuadVertex = (yFlipTexCoord: boolean): string => /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@vertex
fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
${WgslFullscreenPositions}
    var texCoords = array<vec2<f32>, 6>(
        vec2<f32>(0.0, ${yFlipTexCoord ? "1.0" : "0.0"}),
        vec2<f32>(1.0, ${yFlipTexCoord ? "1.0" : "0.0"}),
        vec2<f32>(0.0, ${yFlipTexCoord ? "0.0" : "1.0"}),
        vec2<f32>(0.0, ${yFlipTexCoord ? "0.0" : "1.0"}),
        vec2<f32>(1.0, ${yFlipTexCoord ? "1.0" : "0.0"}),
        vec2<f32>(1.0, ${yFlipTexCoord ? "0.0" : "1.0"})
    );
    output.position = vec4<f32>(positions[vertexIndex], 0.0, 1.0);
    output.texCoord = texCoords[vertexIndex];
    return output;
}
`;

export const BlurFilterVertex = createFullscreenQuadVertex(true);
export const ComplexBlendVertex = createFullscreenQuadVertex(false);
export const ComplexBlendCopyVertex = createFullscreenQuadVertex(false);

export const NodeClearVertex = /* wgsl */`
struct VertexInput {
    @location(0) position: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
}

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    let ndc = input.position * 2.0 - 1.0;
    output.position = vec4<f32>(ndc.x, ndc.y, 0.0, 1.0);
    return output;
}
`;

export const PositionedTextureVertex = /* wgsl */`
struct PositionUniforms {
    offset: vec2<f32>,
    size: vec2<f32>,
    viewport: vec2<f32>,
    padding: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: PositionUniforms;

@vertex
fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
${WgslUnitQuadVertices}
    let vertex = vertices[vertexIndex];
    output.texCoord = vec2<f32>(vertex.x, 1.0 - vertex.y);
    var position = vertex * uniforms.size + uniforms.offset;
    position = position / uniforms.viewport;
    position = position * 2.0 - 1.0;
    output.position = vec4<f32>(position.x, -position.y, 0.0, 1.0);
    return output;
}
`;

export const BitmapSyncVertex = /* wgsl */`
struct BitmapSyncUniforms {
    nodeRect: vec4<f32>,
    textureSize: vec2<f32>,
    padding: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: BitmapSyncUniforms;

@vertex
fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
${WgslUnitQuadVertices}
    let vertex = vertices[vertexIndex];
    let pixelPos = vec2<f32>(
        uniforms.nodeRect.x + vertex.x * uniforms.nodeRect.z,
        uniforms.nodeRect.y + vertex.y * uniforms.nodeRect.w
    );
    let ndc = pixelPos / uniforms.textureSize * 2.0 - 1.0;
    output.position = vec4<f32>(ndc.x, -ndc.y, 0.0, 1.0);
    output.texCoord = pixelPos / uniforms.textureSize;
    return output;
}
`;

export const BlendModeVertex = /* wgsl */`
struct VertexInput {
    @location(0) position: vec2<f32>,
    @location(1) texCoord: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    output.position = vec4<f32>(input.position, 0.0, 1.0);
    output.texCoord = input.texCoord;
    return output;
}
`;

const ScaleUniformsAndStruct = `
struct ScaleUniforms {
    matrix: vec4<f32>,
    translate: vec2<f32>,
    srcSize: vec2<f32>,
    dstSize: vec2<f32>,
    padding: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: ScaleUniforms;
`;

const ScaleTransformBody = `
    var pos = vertex * uniforms.srcSize;
    let a = uniforms.matrix.x;
    let b = uniforms.matrix.y;
    let c = uniforms.matrix.z;
    let d = uniforms.matrix.w;
    let tx = uniforms.translate.x;
    let ty = uniforms.translate.y;
    let transformedX = pos.x * a + pos.y * c + tx;
    let transformedY = pos.x * b + pos.y * d + ty;
    var position = vec2<f32>(transformedX, transformedY) / uniforms.dstSize;
    position = position * 2.0 - 1.0;
    output.position = vec4<f32>(position.x, -position.y, 0.0, 1.0);
`;

const createScaleVertex = (yFlipTexCoord: boolean): string => /* wgsl */`
${ScaleUniformsAndStruct}

@vertex
fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
${WgslUnitQuadVertices}
    let vertex = vertices[vertexIndex];
    output.texCoord = ${yFlipTexCoord ? "vec2<f32>(vertex.x, 1.0 - vertex.y)" : "vertex"};
${ScaleTransformBody}
    return output;
}
`;

export const TextureScaleVertex = createScaleVertex(false);
export const TextureScaleBlendVertex = createScaleVertex(true);
export const ComplexBlendScaleVertex = createScaleVertex(false);

const createOutputVertex = (yFlipTexCoord: boolean): string => /* wgsl */`
struct PositionUniforms {
    offset: vec2<f32>,
    size: vec2<f32>,
    viewport: vec2<f32>,
    padding: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: PositionUniforms;

@vertex
fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
${WgslUnitQuadVertices}
    let vertex = vertices[vertexIndex];
    output.texCoord = ${yFlipTexCoord ? "vec2<f32>(vertex.x, 1.0 - vertex.y)" : "vertex"};
    var position = vertex * uniforms.size + uniforms.offset;
    position = position / uniforms.viewport;
    position = position * 2.0 - 1.0;
    output.position = vec4<f32>(position.x, -position.y, 0.0, 1.0);
    return output;
}
`;

export const ComplexBlendOutputVertex = createOutputVertex(false);
export const FilterComplexBlendOutputVertex = createOutputVertex(true);
