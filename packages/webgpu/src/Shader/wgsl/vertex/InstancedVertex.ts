/**
 * @description インスタンス描画用頂点シェーダー（インスタンスごとの変換・カラー）
 *              Instanced rendering vertex shader with per-instance transform and color
 *
 * @type {string}
 * @constant
 */
export const InstancedVertex = /* wgsl */`
struct VertexInput {
    @location(0) position: vec2<f32>,
    @location(1) texCoord: vec2<f32>,
}

struct InstanceInput {
    @location(2) textureRect: vec4<f32>,
    @location(3) textureDim: vec4<f32>,
    @location(4) matrixTx: vec4<f32>,
    @location(5) matrixScale: vec4<f32>,
    @location(6) mulColor: vec4<f32>,
    @location(7) addColor: vec4<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
    @location(1) mulColor: vec4<f32>,
    @location(2) addColor: vec4<f32>,
}

@vertex
fn main(
    input: VertexInput,
    instance: InstanceInput,
    @builtin(instance_index) instanceIdx: u32
) -> VertexOutput {
    var output: VertexOutput;
    let texX = instance.textureRect.x + input.texCoord.x * instance.textureRect.z;
    let texY = instance.textureRect.y + input.texCoord.y * instance.textureRect.w;
    output.texCoord = vec2<f32>(texX, texY);
    var pos = vec2<f32>(input.position.x, 1.0 - input.position.y);
    pos = pos * vec2<f32>(instance.textureDim.x, instance.textureDim.y);
    let scale0 = instance.matrixScale.x;
    let rotate0 = instance.matrixScale.y;
    let scale1 = instance.matrixScale.z;
    let rotate1 = instance.matrixScale.w;
    let transformedX = pos.x * scale0 + pos.y * scale1 + instance.matrixTx.x;
    let transformedY = pos.x * rotate0 + pos.y * rotate1 + instance.matrixTx.y;
    var position = vec2<f32>(transformedX, transformedY) / vec2<f32>(instance.textureDim.z, instance.textureDim.w);
    position = position * 2.0 - 1.0;
    output.position = vec4<f32>(position.x, -position.y, 0.0, 1.0);
    output.mulColor = instance.mulColor;
    output.addColor = instance.addColor;
    return output;
}
`;
