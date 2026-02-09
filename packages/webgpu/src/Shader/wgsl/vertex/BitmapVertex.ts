const createBitmapFillVertex = (yFlip: boolean): string => /* wgsl */`
struct VertexInput {
    @location(0) position: vec2<f32>,
    @location(1) bezier: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) bezier: vec2<f32>,
    @location(1) color: vec4<f32>,
    @location(2) worldPos: vec2<f32>,
}

struct BitmapUniforms {
    bitmapMatrix: mat3x3<f32>,
    width: f32,
    height: f32,
    repeat: f32,
    _pad: f32,
    color: vec4<f32>,
    contextMatrix0: vec4<f32>,
    contextMatrix1: vec4<f32>,
    contextMatrix2: vec4<f32>,
}

@group(0) @binding(0) var<uniform> bitmap: BitmapUniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    let matrix = mat3x3<f32>(bitmap.contextMatrix0.xyz, bitmap.contextMatrix1.xyz, bitmap.contextMatrix2.xyz);
    let transformedPos = matrix * vec3<f32>(input.position, 1.0);
    let clipX = transformedPos.x * 2.0 - 1.0;
    let clipY = ${yFlip ? "-(transformedPos.y * 2.0 - 1.0)" : "transformedPos.y * 2.0 - 1.0"};
    output.position = vec4<f32>(clipX, clipY, 0.0, 1.0);
    output.bezier = input.bezier;
    output.color = bitmap.color;
    output.worldPos = input.position;
    return output;
}
`;

export const BitmapFillVertex = createBitmapFillVertex(false);
export const BitmapFillMainVertex = createBitmapFillVertex(true);
