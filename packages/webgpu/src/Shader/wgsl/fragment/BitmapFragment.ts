export const BitmapFillFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) bezier: vec2<f32>,
    @location(1) color: vec4<f32>,
    @location(2) worldPos: vec2<f32>,
}

struct BitmapUniforms {
    bitmapMatrix: mat3x3<f32>,
    textureWidth: f32,
    textureHeight: f32,
    repeat: f32,
    _pad: f32,
}

@group(0) @binding(0) var<uniform> uniforms: BitmapUniforms;
@group(0) @binding(1) var bitmapSampler: sampler;
@group(0) @binding(2) var bitmapTexture: texture_2d<f32>;

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let u = input.bezier.x;
    let v = input.bezier.y;
    if (abs(u - 0.5) > 0.001 || abs(v - 0.5) > 0.001) {
        let d = u * u - v;
        if (d > 0.0) {
            discard;
        }
    }
    let transformedPos = uniforms.bitmapMatrix * vec3<f32>(input.worldPos, 1.0);
    var uv = vec2<f32>(
        transformedPos.x / uniforms.textureWidth,
        transformedPos.y / uniforms.textureHeight
    );
    if (uniforms.repeat > 0.5) {
        uv = fract(uv);
    }
    // repeat: falseの場合、サンプラーのclamp-to-edgeでクランプされる（WebGL版と同じ動作）
    let bitmapColor = textureSample(bitmapTexture, bitmapSampler, uv);
    let alpha = bitmapColor.a * input.color.a;
    return vec4<f32>(bitmapColor.rgb * input.color.a, alpha);
}
`;
