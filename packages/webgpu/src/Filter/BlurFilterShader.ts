/**
 * @description ブラーフィルターシェーダー
 *              Blur filter shader
 */
export class BlurFilterShader
{
    /**
     * @description ブラー用の頂点シェーダー
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

    /**
     * @description 水平ブラー用のフラグメントシェーダー
     * @return {string}
     */
    static getHorizontalBlurShader(): string
    {
        return /* wgsl */`
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
            }

            struct BlurUniforms {
                blurSize: f32,
                textureWidth: f32,
                textureHeight: f32,
                _padding: f32,
            }

            @group(0) @binding(0) var<uniform> uniforms: BlurUniforms;
            @group(0) @binding(1) var textureSampler: sampler;
            @group(0) @binding(2) var textureData: texture_2d<f32>;

            @fragment
            fn main(input: VertexOutput) -> @location(0) vec4<f32> {
                let texelSize = 1.0 / uniforms.textureWidth;
                var color = vec4<f32>(0.0);
                let blurRadius = i32(uniforms.blurSize);
                
                var totalWeight = 0.0;
                
                for (var i = -blurRadius; i <= blurRadius; i++) {
                    let offset = f32(i) * texelSize;
                    let weight = 1.0 - abs(f32(i)) / f32(blurRadius + 1);
                    
                    let sampleCoord = vec2<f32>(
                        input.texCoord.x + offset,
                        input.texCoord.y
                    );
                    
                    color += textureSample(textureData, textureSampler, sampleCoord) * weight;
                    totalWeight += weight;
                }
                
                return color / totalWeight;
            }
        `;
    }

    /**
     * @description 垂直ブラー用のフラグメントシェーダー
     * @return {string}
     */
    static getVerticalBlurShader(): string
    {
        return /* wgsl */`
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
            }

            struct BlurUniforms {
                blurSize: f32,
                textureWidth: f32,
                textureHeight: f32,
                _padding: f32,
            }

            @group(0) @binding(0) var<uniform> uniforms: BlurUniforms;
            @group(0) @binding(1) var textureSampler: sampler;
            @group(0) @binding(2) var textureData: texture_2d<f32>;

            @fragment
            fn main(input: VertexOutput) -> @location(0) vec4<f32> {
                let texelSize = 1.0 / uniforms.textureHeight;
                var color = vec4<f32>(0.0);
                let blurRadius = i32(uniforms.blurSize);
                
                var totalWeight = 0.0;
                
                for (var i = -blurRadius; i <= blurRadius; i++) {
                    let offset = f32(i) * texelSize;
                    let weight = 1.0 - abs(f32(i)) / f32(blurRadius + 1);
                    
                    let sampleCoord = vec2<f32>(
                        input.texCoord.x,
                        input.texCoord.y + offset
                    );
                    
                    color += textureSample(textureData, textureSampler, sampleCoord) * weight;
                    totalWeight += weight;
                }
                
                return color / totalWeight;
            }
        `;
    }
}
