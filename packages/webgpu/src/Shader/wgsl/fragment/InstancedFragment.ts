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
    var src = textureSample(textureData, textureSampler, input.texCoord);
    // colorTransform: mulColor.w (globalAlpha) が 1.0 でない場合も処理が必要
    if (input.mulColor.x != 1.0 || input.mulColor.y != 1.0 || input.mulColor.z != 1.0 || input.mulColor.w != 1.0
        || input.addColor.x != 0.0 || input.addColor.y != 0.0 || input.addColor.z != 0.0
    ) {
        src = vec4<f32>(src.rgb / max(0.0001, src.a), src.a);
        // colorTransform適用: src * mulColor + addColor
        src = clamp(src * input.mulColor + input.addColor, vec4<f32>(0.0), vec4<f32>(1.0));
        src = vec4<f32>(src.rgb * src.a, src.a);
    }
    return src;
}
`;
