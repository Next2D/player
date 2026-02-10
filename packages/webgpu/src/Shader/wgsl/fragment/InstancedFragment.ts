export const InstancedFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
    @location(1) mulColor: vec4<f32>,
    @location(2) addColor: vec4<f32>,
}

@group(0) @binding(0) var textureSampler: sampler;
@group(0) @binding(1) var textureData: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    var src = textureSampleLevel(textureData, textureSampler, input.texCoord, 0);
    src = vec4<f32>(src.rgb / max(0.0001, src.a), src.a);
    src = clamp(src * input.mulColor + input.addColor, vec4<f32>(0.0), vec4<f32>(1.0));
    src = vec4<f32>(src.rgb * src.a, src.a);
    return src;
}
`;
