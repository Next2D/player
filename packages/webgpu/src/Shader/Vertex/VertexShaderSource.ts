/**
 * @return {string}
 * @method
 * @static
 */
export const TEXTURE_TEMPLATE = (): string =>
{
    return `
struct VertexInput {
    @location(0) position: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) coord: vec2<f32>,
}

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    output.coord = input.position;
    
    let position = input.position * 2.0 - 1.0;
    output.position = vec4<f32>(position, 0.0, 1.0);
    
    return output;
}`;
};

/**
 * @return {string}
 * @method
 * @static
 */
export const VECTOR_TEMPLATE = (): string =>
{
    return `
struct VertexInput {
    @location(0) position: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) coord: vec2<f32>,
}

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    output.coord = input.position;
    
    let position = input.position * 2.0 - 1.0;
    output.position = vec4<f32>(position.x, -position.y, 0.0, 1.0);
    
    return output;
}`;
};

/**
 * @return {string}
 * @method
 * @static
 */
export const INSTANCE_TEMPLATE = (): string =>
{
    return `
struct VertexInput {
    @location(0) vertex: vec2<f32>,
    @location(1) rect: vec4<f32>,
    @location(2) size: vec4<f32>,
    @location(3) offset: vec2<f32>,
    @location(4) matrix: vec4<f32>,
    @location(5) mul: vec4<f32>,
    @location(6) add: vec4<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) coord: vec2<f32>,
    @location(1) mul: vec4<f32>,
    @location(2) add: vec4<f32>,
}

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    output.coord = input.vertex * input.rect.zw + input.rect.xy;
    output.mul = input.mul;
    output.add = input.add;
    
    var position = vec2<f32>(input.vertex.x, 1.0 - input.vertex.y);
    position = position * input.size.xy;
    
    let matrix = mat3x3<f32>(
        input.matrix.x, input.matrix.y, 0.0,
        input.matrix.z, input.matrix.w, 0.0,
        input.offset.x, input.offset.y, 1.0
    );
    
    position = (matrix * vec3<f32>(position, 1.0)).xy;
    position = position / input.size.zw;
    
    position = position * 2.0 - 1.0;
    output.position = vec4<f32>(position.x, -position.y, 0.0, 1.0);
    
    return output;
}`;
};

/**
 * @return {string}
 * @method
 * @static
 */
export const BLEND_TEMPLATE = (): string =>
{
    return `
struct Uniforms {
    highp: array<vec4<f32>, 2>,
}

struct VertexInput {
    @location(0) vertex: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) coord: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    output.coord = input.vertex;
    
    let offset = uniforms.highp[0].xy;
    let size = uniforms.highp[0].zw;
    let viewport = vec2<f32>(uniforms.highp[1].x, uniforms.highp[1].y);
    
    var position = vec2<f32>(input.vertex.x, 1.0 - input.vertex.y);
    position = position * size + offset;
    position = position / viewport;
    
    position = position * 2.0 - 1.0;
    output.position = vec4<f32>(position.x, -position.y, 0.0, 1.0);
    
    return output;
}`;
};