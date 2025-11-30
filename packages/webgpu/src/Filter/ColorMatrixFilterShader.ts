/**
 * @description カラーマトリックスフィルターシェーダー
 *              Color matrix filter shader
 */
export class ColorMatrixFilterShader
{
    /**
     * @description カラーマトリックス用のフラグメントシェーダー
     * @return {string}
     */
    static getFragmentShader(): string
    {
        return /* wgsl */`
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
            }

            struct ColorMatrixUniforms {
                matrix: mat4x4<f32>,
                offset: vec4<f32>,
            }

            @group(0) @binding(0) var<uniform> uniforms: ColorMatrixUniforms;
            @group(0) @binding(1) var textureSampler: sampler;
            @group(0) @binding(2) var textureData: texture_2d<f32>;

            @fragment
            fn main(input: VertexOutput) -> @location(0) vec4<f32> {
                var color = textureSample(textureData, textureSampler, input.texCoord);
                
                // カラーマトリックス適用
                var result = uniforms.matrix * color + uniforms.offset;
                
                // 0-1にクランプ
                result = clamp(result, vec4<f32>(0.0), vec4<f32>(1.0));
                
                return result;
            }
        `;
    }

    /**
     * @description 頂点シェーダー
     * @return {string}
     */
    static getVertexShader(): string
    {
        return /* wgsl */`
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
    }
}
