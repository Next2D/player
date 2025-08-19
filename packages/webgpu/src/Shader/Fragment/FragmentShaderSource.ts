/**
 * @return {string}
 * @method
 * @static
 */
export const TEXTURE_TEMPLATE = (): string =>
{
    return `
struct FragmentInput {
    @location(0) coord: vec2<f32>,
}

@group(0) @binding(0) var texture_sampler: sampler;
@group(0) @binding(1) var texture_data: texture_2d<f32>;

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
    return textureSample(texture_data, texture_sampler, input.coord);
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
struct FragmentInput {
    @location(0) coord: vec2<f32>,
}

struct Uniforms {
    color: vec4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
    return uniforms.color;
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
struct FragmentInput {
    @location(0) coord: vec2<f32>,
    @location(1) mul: vec4<f32>,
    @location(2) add: vec4<f32>,
}

@group(0) @binding(0) var texture_sampler: sampler;
@group(0) @binding(1) var texture_data: texture_2d<f32>;

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
    var color = textureSample(texture_data, texture_sampler, input.coord);
    color = color * input.mul + input.add;
    return color;
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
struct FragmentInput {
    @location(0) coord: vec2<f32>,
}

@group(0) @binding(0) var texture_sampler: sampler;
@group(0) @binding(1) var texture_data: texture_2d<f32>;

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
    return textureSample(texture_data, texture_sampler, input.coord);
}`;
};