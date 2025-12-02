/**
 * @description グローフィルターシェーダー
 *              Glow filter shader
 */
export class GlowFilterShader
{
    /**
     * @description グロー用のフラグメントシェーダー
     * @return {string}
     */
    static getFragmentShader(): string
    {
        return /* wgsl */`
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
            }

            struct GlowUniforms {
                glowColor: vec4<f32>,
                strength: f32,
                inner: f32,
                knockout: f32,
                _padding: f32,
            }

            @group(0) @binding(0) var<uniform> uniforms: GlowUniforms;
            @group(0) @binding(1) var textureSampler: sampler;
            @group(0) @binding(2) var textureData: texture_2d<f32>;

            @fragment
            fn main(input: VertexOutput) -> @location(0) vec4<f32> {
                var originalColor = textureSample(textureData, textureSampler, input.texCoord);
                
                // アルファ値でグローの強度を決定
                let alpha = originalColor.a;
                
                // グローカラーを適用
                var glowColor = uniforms.glowColor * uniforms.strength * alpha;
                
                // インナーグローかアウターグローか
                if (uniforms.inner > 0.5) {
                    // インナーグロー: 元の色とグローを合成
                    if (uniforms.knockout > 0.5) {
                        return glowColor;
                    } else {
                        return mix(originalColor, glowColor, alpha);
                    }
                } else {
                    // アウターグロー: 元の色とグローを加算合成
                    if (uniforms.knockout > 0.5) {
                        return vec4<f32>(glowColor.rgb, glowColor.a * (1.0 - alpha));
                    } else {
                        return originalColor + glowColor;
                    }
                }
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
