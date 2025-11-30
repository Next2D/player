/**
 * @description ドロップシャドウフィルターシェーダー
 *              Drop shadow filter shader
 */
export class DropShadowFilterShader
{
    /**
     * @description ドロップシャドウ用のフラグメントシェーダー
     * @return {string}
     */
    static getFragmentShader(): string
    {
        return /* wgsl */`
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
            }

            struct DropShadowUniforms {
                shadowColor: vec4<f32>,
                offset: vec2<f32>,
                distance: f32,
                angle: f32,
                strength: f32,
                inner: f32,
                knockout: f32,
                hideObject: f32,
            }

            @group(0) @binding(0) var<uniform> uniforms: DropShadowUniforms;
            @group(0) @binding(1) var textureSampler: sampler;
            @group(0) @binding(2) var textureData: texture_2d<f32>;

            @fragment
            fn main(input: VertexOutput) -> @location(0) vec4<f32> {
                // 元のテクスチャから色を取得
                var originalColor = textureSample(textureData, textureSampler, input.texCoord);
                
                // シャドウの位置を計算
                let radian = uniforms.angle * 3.14159265 / 180.0;
                let offsetX = cos(radian) * uniforms.distance / 100.0;
                let offsetY = sin(radian) * uniforms.distance / 100.0;
                
                let shadowCoord = vec2<f32>(
                    input.texCoord.x + offsetX,
                    input.texCoord.y + offsetY
                );
                
                // シャドウ位置のアルファ値を取得
                var shadowAlpha = textureSample(textureData, textureSampler, shadowCoord).a;
                
                // シャドウカラーを適用
                var shadowColor = vec4<f32>(
                    uniforms.shadowColor.rgb,
                    shadowAlpha * uniforms.shadowColor.a * uniforms.strength
                );
                
                // 内側シャドウか外側シャドウか
                if (uniforms.inner > 0.5) {
                    // 内側シャドウ
                    let alpha = originalColor.a;
                    shadowColor.a *= alpha;
                    
                    if (uniforms.knockout > 0.5) {
                        return shadowColor;
                    } else {
                        return mix(shadowColor, originalColor, alpha);
                    }
                } else {
                    // 外側シャドウ（ドロップシャドウ）
                    if (uniforms.hideObject > 0.5) {
                        // オブジェクトを隠してシャドウのみ表示
                        return shadowColor * (1.0 - originalColor.a);
                    } else if (uniforms.knockout > 0.5) {
                        // ノックアウト: シャドウのみ
                        return shadowColor;
                    } else {
                        // 通常: オブジェクトとシャドウを合成
                        let combinedAlpha = originalColor.a + shadowColor.a * (1.0 - originalColor.a);
                        if (combinedAlpha > 0.0) {
                            let rgb = (originalColor.rgb * originalColor.a + 
                                      shadowColor.rgb * shadowColor.a * (1.0 - originalColor.a)) / combinedAlpha;
                            return vec4<f32>(rgb, combinedAlpha);
                        } else {
                            return vec4<f32>(0.0);
                        }
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
