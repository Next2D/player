/**
 * @description WebGPU用の基本的なシェーダーソース
 *              Basic shader sources for WebGPU
 */
export class ShaderSource
{
    /**
     * @description 単色塗りつぶし用頂点シェーダー（Loop-Blinn対応・17 floats頂点フォーマット）
     * @return {string}
     */
    static getFillVertexShader(): string
    {
        return /* wgsl */`
            struct VertexInput {
                @location(0) position: vec2<f32>,
                @location(1) bezier: vec2<f32>,
                @location(2) color: vec4<f32>,
                @location(3) matrix0: vec3<f32>,
                @location(4) matrix1: vec3<f32>,
                @location(5) matrix2: vec3<f32>,
            }

            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) bezier: vec2<f32>,
                @location(1) color: vec4<f32>,
            }

            struct Uniforms {
                viewportSize: vec2<f32>,
            }

            @group(0) @binding(0) var<uniform> uniforms: Uniforms;

            @vertex
            fn main(input: VertexInput) -> VertexOutput {
                var output: VertexOutput;

                // Build matrix from vertex attributes
                let matrix = mat3x3<f32>(
                    input.matrix0,
                    input.matrix1,
                    input.matrix2
                );

                // Apply matrix transformation
                let transformed = matrix * vec3<f32>(input.position, 1.0);

                // Normalize by viewport size
                let pos = transformed.xy / uniforms.viewportSize;

                // Convert to NDC: 0-1 → -1 to 1
                let ndc = pos * 2.0 - 1.0;

                // Flip Y axis (WebGL compatible)
                output.position = vec4<f32>(ndc.x, -ndc.y, 0.0, 1.0);

                // Pass through bezier coordinates for fragment shader
                output.bezier = input.bezier;

                // Pass color as-is (premultiplication happens in fragment shader after AA)
                output.color = input.color;

                return output;
            }
        `;
    }

    /**
     * @description 単色塗りつぶし用フラグメントシェーダー（Loop-Blinnアンチエイリアシング対応）
     * @return {string}
     */
    static getFillFragmentShader(): string
    {
        return /* wgsl */`
            struct FragmentInput {
                @builtin(position) position: vec4<f32>,
                @location(0) bezier: vec2<f32>,
                @location(1) color: vec4<f32>,
            }

            @fragment
            fn main(input: FragmentInput) -> @location(0) vec4<f32> {
                // Loop-Blinn法による2次ベジエ曲線のアンチエイリアシング
                // 暗黙的関数: f(u, v) = u² - v
                let f_val = input.bezier.x * input.bezier.x - input.bezier.y;

                // スクリーン空間での勾配を計算
                let dx = dpdx(f_val);
                let dy = dpdy(f_val);

                // 符号付き距離（勾配で正規化）
                let dist = f_val / length(vec2<f32>(dx, dy));

                // smoothstepによるアンチエイリアシング（約1ピクセル幅の遷移）
                let aa = smoothstep(0.5, -0.5, dist);

                // アルファを適用
                if (aa <= 0.001) {
                    discard;
                }

                // input.color is already premultiplied (RGB = baseRGB * alpha)
                // Apply AA by multiplying the entire premultiplied color
                return input.color * aa;
            }
        `;
    }

    /**
     * @description マスク用頂点シェーダー（ベジェ曲線）
     * @return {string}
     */
    static getMaskVertexShader(): string
    {
        return /* wgsl */`
            struct VertexInput {
                @location(0) position: vec2<f32>,
                @location(1) bezier: vec2<f32>,
            }

            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) bezier: vec2<f32>,
            }

            struct Uniforms {
                viewportSize: vec2<f32>,
                _padding0: vec2<f32>,
                matrixCol0: vec3<f32>,
                _padding1: f32,
                matrixCol1: vec3<f32>,
                _padding2: f32,
                matrixCol2: vec3<f32>,
                _padding3: f32,
            }

            @group(0) @binding(0) var<uniform> uniforms: Uniforms;

            @vertex
            fn main(input: VertexInput) -> VertexOutput {
                var output: VertexOutput;
                
                // Build matrix (already normalized by viewport in CPU)
                let matrix = mat3x3<f32>(
                    uniforms.matrixCol0,
                    uniforms.matrixCol1,
                    uniforms.matrixCol2
                );
                
                // Apply matrix transformation (result is in 0-1 normalized space)
                let transformed = matrix * vec3<f32>(input.position, 1.0);
                let pos = transformed.xy;
                
                // Convert to NDC: 0-1 → -1 to 1 (WebGL compatible)
                let ndc = pos * 2.0 - 1.0;
                
                // Flip Y axis (WebGL compatible)
                output.position = vec4<f32>(ndc.x, -ndc.y, 0.0, 1.0);
                
                // Pass through bezier coordinates
                output.bezier = input.bezier;
                
                return output;
            }
        `;
    }

    /**
     * @description マスク用フラグメントシェーダー（ベジェ曲線アンチエイリアシング）
     * @return {string}
     */
    static getMaskFragmentShader(): string
    {
        return /* wgsl */`
            struct FragmentInput {
                @location(0) bezier: vec2<f32>,
            }

            @fragment
            fn main(input: FragmentInput) -> @location(0) vec4<f32> {
                // Calculate partial derivatives for anti-aliasing
                let px = dpdx(input.bezier);
                let py = dpdy(input.bezier);
                
                // Bezier curve equation: x^2 - y = 0
                // Calculate gradient for anti-aliasing
                let f = (2.0 * input.bezier.x) * vec2<f32>(px.x, py.x) - vec2<f32>(px.y, py.y);
                let alpha = 0.5 - (input.bezier.x * input.bezier.x - input.bezier.y) / length(f);
                
                // Discard pixels outside the curve
                if (alpha <= 0.0) {
                    discard;
                }
                
                // Output with anti-aliased alpha
                return vec4<f32>(min(alpha, 1.0));
            }
        `;
    }

    /**
     * @description 基本的な頂点シェーダー（テクスチャ用、後方互換性のため残す）
     * @return {string}
     */
    static getBasicVertexShader(): string
    {
        return /* wgsl */`
            struct VertexInput {
                @location(0) position: vec2<f32>,
                @location(1) texCoord: vec2<f32>,
            }

            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
                @location(1) color: vec4<f32>,
            }

            struct Uniforms {
                matrix: mat3x3<f32>,
                color: vec4<f32>,
                alpha: f32,
            }

            @group(0) @binding(0) var<uniform> uniforms: Uniforms;

            @vertex
            fn main(input: VertexInput) -> VertexOutput {
                var output: VertexOutput;
                
                let pos = uniforms.matrix * vec3<f32>(input.position, 1.0);
                output.position = vec4<f32>(pos.xy, 0.0, 1.0);
                output.texCoord = input.texCoord;
                output.color = uniforms.color * uniforms.alpha;
                
                return output;
            }
        `;
    }

    /**
     * @description 基本的なフラグメントシェーダー（単色塗りつぶし）
     * @return {string}
     */
    static getBasicFragmentShader(): string
    {
        return /* wgsl */`
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
                @location(1) color: vec4<f32>,
            }

            @fragment
            fn main(input: VertexOutput) -> @location(0) vec4<f32> {
                return input.color;
            }
        `;
    }

    /**
     * @description テクスチャ用フラグメントシェーダー
     * @return {string}
     */
    static getTextureFragmentShader(): string
    {
        return /* wgsl */`
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
                @location(1) color: vec4<f32>,
            }

            @group(0) @binding(1) var textureSampler: sampler;
            @group(0) @binding(2) var textureData: texture_2d<f32>;

            @fragment
            fn main(input: VertexOutput) -> @location(0) vec4<f32> {
                let textureColor = textureSample(textureData, textureSampler, input.texCoord);
                return textureColor * input.color;
            }
        `;
    }

    /**
     * @description インスタンス描画用頂点シェーダー
     * @return {string}
     */
    static getInstancedVertexShader(): string
    {
        return /* wgsl */`
            struct VertexInput {
                @location(0) position: vec2<f32>,
                @location(1) texCoord: vec2<f32>,
            }

            struct InstanceInput {
                @location(2) textureRect: vec4<f32>,     // x, y, w, h (normalized)
                @location(3) textureDim: vec4<f32>,      // w, h, viewportW, viewportH
                @location(4) matrixTx: vec4<f32>,        // tx, ty, _pad, _pad
                @location(5) matrixScale: vec4<f32>,     // scale0, rotate0, scale1, rotate1
                @location(6) mulColor: vec4<f32>,        // r, g, b, a
                @location(7) addColor: vec4<f32>,        // r, g, b, a
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
                
                // テクスチャ座標を計算
                let texW = instance.textureRect.z;
                let texH = instance.textureRect.w;
                let texX = instance.textureRect.x + input.texCoord.x * texW;
                let texY = instance.textureRect.y + input.texCoord.y * texH;
                output.texCoord = vec2<f32>(texX, texY);
                
                // 変換行列を適用
                let scale0 = instance.matrixScale.x;
                let rotate0 = instance.matrixScale.y;
                let scale1 = instance.matrixScale.z;
                let rotate1 = instance.matrixScale.w;
                
                let pos = vec2<f32>(
                    input.position.x * instance.textureDim.x,
                    input.position.y * instance.textureDim.y
                );
                
                let transformedX = pos.x * scale0 + pos.y * scale1 + instance.matrixTx.x;
                let transformedY = pos.x * rotate0 + pos.y * rotate1 + instance.matrixTx.y;
                
                // NDC座標に変換
                let ndcX = (transformedX / instance.textureDim.z) * 2.0 - 1.0;
                let ndcY = 1.0 - (transformedY / instance.textureDim.w) * 2.0;
                
                output.position = vec4<f32>(ndcX, ndcY, 0.0, 1.0);
                
                // カラー変換
                output.mulColor = instance.mulColor;
                output.addColor = instance.addColor;
                
                return output;
            }
        `;
    }

    /**
     * @description インスタンス描画用フラグメントシェーダー（アトラステクスチャから描画）
     * @return {string}
     */
    static getInstancedFragmentShader(): string
    {
        return /* wgsl */`
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

                // Always apply color transform (matches WebGL behavior)
                // Unpremultiply: divide RGB by alpha
                let unpremultiplied = vec4<f32>(src.rgb / max(0.0001, src.a), src.a);

                // Apply color transform: multiply + add
                var transformed = clamp(unpremultiplied * input.mulColor + input.addColor, vec4<f32>(0.0), vec4<f32>(1.0));

                // Premultiply again: multiply RGB by alpha
                return vec4<f32>(transformed.rgb * transformed.a, transformed.a);
            }
        `;
    }

    /**
     * @description グラデーション用フラグメントシェーダー
     * @return {string}
     */
    static getGradientFragmentShader(): string
    {
        return /* wgsl */`
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
                @location(1) color: vec4<f32>,
            }

            struct GradientUniforms {
                gradientType: f32,
                focal: f32,
            }

            @group(0) @binding(1) var<uniform> gradient: GradientUniforms;
            @group(0) @binding(2) var gradientSampler: sampler;
            @group(0) @binding(3) var gradientTexture: texture_2d<f32>;

            @fragment
            fn main(input: VertexOutput) -> @location(0) vec4<f32> {
                var t: f32;
                
                if (gradient.gradientType < 0.5) {
                    // Linear gradient
                    t = input.texCoord.x;
                } else {
                    // Radial gradient
                    let dx = input.texCoord.x - 0.5;
                    let dy = input.texCoord.y - 0.5;
                    t = sqrt(dx * dx + dy * dy) * 2.0;
                }
                
                t = clamp(t, 0.0, 1.0);
                let gradientColor = textureSample(gradientTexture, gradientSampler, vec2<f32>(t, 0.5));
                
                return gradientColor * input.color;
            }
        `;
    }

    /**
     * @description ブレンドモード用フラグメントシェーダー
     * @return {string}
     */
    static getBlendFragmentShader(): string
    {
        return /* wgsl */`
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
                @location(1) color: vec4<f32>,
            }

            struct BlendUniforms {
                blendMode: f32,
            }

            @group(0) @binding(1) var<uniform> blend: BlendUniforms;
            @group(0) @binding(2) var srcSampler: sampler;
            @group(0) @binding(3) var srcTexture: texture_2d<f32>;
            @group(0) @binding(4) var dstSampler: sampler;
            @group(0) @binding(5) var dstTexture: texture_2d<f32>;

            fn blendNormal(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
                return src;
            }

            fn blendMultiply(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
                return src * dst;
            }

            fn blendScreen(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
                return src + dst - src * dst;
            }

            fn blendAdd(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
                return min(src + dst, vec4<f32>(1.0));
            }

            @fragment
            fn main(input: VertexOutput) -> @location(0) vec4<f32> {
                let src = textureSample(srcTexture, srcSampler, input.texCoord);
                let dst = textureSample(dstTexture, dstSampler, input.texCoord);
                
                var result: vec4<f32>;
                
                if (blend.blendMode < 0.5) {
                    result = blendNormal(src, dst);
                } else if (blend.blendMode < 1.5) {
                    result = blendMultiply(src, dst);
                } else if (blend.blendMode < 2.5) {
                    result = blendScreen(src, dst);
                } else {
                    result = blendAdd(src, dst);
                }
                
                return result * input.color;
            }
        `;
    }
}
