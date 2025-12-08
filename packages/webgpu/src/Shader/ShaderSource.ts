/**
 * @description WebGPU用の基本的なシェーダーソース
 *              Basic shader sources for WebGPU
 */
export class ShaderSource
{
    /**
     * @description 単色塗りつぶし用頂点シェーダー（17 floats頂点フォーマット）
     *              行列はすでにビューポートサイズで正規化済み（WebGL版と同じ）
     *
     *              WebGL版のoffsetY調整: atlasHeight - node.y - height
     *              これによりWebGL座標系（下から上）に変換されている
     *
     *              WebGPU座標系: 上から下（Y軸反転なし）
     *              しかし、WebGL版のoffsetY調整がそのまま使われているため、
     *              WebGL版と同じY軸反転を適用する
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
                // 行列はすでにビューポートで正規化済み（MeshFillGenerateUseCaseで実施）
                let matrix = mat3x3<f32>(
                    input.matrix0,
                    input.matrix1,
                    input.matrix2
                );

                // Apply matrix transformation (result is in 0-1 normalized space)
                let transformed = matrix * vec3<f32>(input.position, 1.0);

                // Convert to NDC: 0-1 → -1 to 1
                let ndc = transformed.xy * 2.0 - 1.0;

                // WebGL版と同じY軸反転
                // WebGL版のoffsetY = atlasHeight - node.y - height の調整に対応
                output.position = vec4<f32>(ndc.x, -ndc.y, 0.0, 1.0);

                // Pass through bezier coordinates for fragment shader
                output.bezier = input.bezier;

                // Pass color as-is (premultiplication happens in fragment shader)
                output.color = input.color;

                return output;
            }
        `;
    }

    /**
     * @description 単色塗りつぶし用フラグメントシェーダー（1パスLoop-Blinn）
     *              WebGL版は2パス（MASK + SOLID_FILL_COLOR）だが、
     *              WebGPU版は1パスでLoop-Blinn曲線処理を行う
     *
     *              bezier座標:
     *              - (0.5, 0.5): 内部三角形（直線）→ そのまま描画
     *              - その他: ベジェ曲線三角形 → u² - v で曲線内外を判定
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
                // 内部三角形（直線セグメント）はbezier = (0.5, 0.5)
                // この場合、u² - v = 0.25 - 0.5 = -0.25 < 0 なので曲線内部として描画される

                // ベジェ曲線三角形の場合、Loop-Blinn法で曲線内外を判定
                // 暗黙関数: f(u,v) = u² - v
                // f < 0: 曲線の内側（描画）
                // f >= 0: 曲線の外側（ディスカード）
                let f = input.bezier.x * input.bezier.x - input.bezier.y;

                if (f >= 0.0) {
                    discard;
                }

                // プリマルチプライドアルファで出力
                return vec4<f32>(input.color.rgb * input.color.a, input.color.a);
            }
        `;
    }

    /**
     * @description ステンシル書き込み用頂点シェーダー（Pass1）
     *              WebGL版の2パスステンシルフィルのPass1に相当
     * @return {string}
     */
    static getStencilWriteVertexShader(): string
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
            }

            @vertex
            fn main(input: VertexInput) -> VertexOutput {
                var output: VertexOutput;

                // Build matrix from vertex attributes
                let matrix = mat3x3<f32>(
                    input.matrix0,
                    input.matrix1,
                    input.matrix2
                );

                // Apply matrix transformation (result is in 0-1 normalized space)
                let transformed = matrix * vec3<f32>(input.position, 1.0);

                // Convert to NDC: 0-1 → -1 to 1
                let ndc = transformed.xy * 2.0 - 1.0;

                // WebGL版と同じY軸反転
                output.position = vec4<f32>(ndc.x, -ndc.y, 0.0, 1.0);

                return output;
            }
        `;
    }

    /**
     * @description ステンシル書き込み用フラグメントシェーダー（Pass1）
     *              カラー書き込みなし、ステンシル値のみ更新
     * @return {string}
     */
    static getStencilWriteFragmentShader(): string
    {
        return /* wgsl */`
            @fragment
            fn main() -> @location(0) vec4<f32> {
                // ステンシルのみ更新、カラーは書き込まない（writeMaskで制御）
                return vec4<f32>(0.0, 0.0, 0.0, 0.0);
            }
        `;
    }

    /**
     * @description ステンシルフィル用頂点シェーダー（Pass2）
     *              フルスクリーンクワッドを描画
     * @return {string}
     */
    static getStencilFillVertexShader(): string
    {
        return /* wgsl */`
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
            }

            struct Uniforms {
                color: vec4<f32>,
            }

            @group(0) @binding(0) var<uniform> uniforms: Uniforms;

            // フルスクリーンクワッド用の固定頂点位置
            var<private> positions: array<vec2<f32>, 6> = array<vec2<f32>, 6>(
                vec2<f32>(-1.0, -1.0),
                vec2<f32>( 1.0, -1.0),
                vec2<f32>(-1.0,  1.0),
                vec2<f32>(-1.0,  1.0),
                vec2<f32>( 1.0, -1.0),
                vec2<f32>( 1.0,  1.0),
            );

            @vertex
            fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
                var output: VertexOutput;
                output.position = vec4<f32>(positions[vertexIndex], 0.0, 1.0);
                return output;
            }
        `;
    }

    /**
     * @description ステンシルフィル用フラグメントシェーダー（Pass2）
     *              ステンシルテストに合格した部分に色を描画
     * @return {string}
     */
    static getStencilFillFragmentShader(): string
    {
        return /* wgsl */`
            struct Uniforms {
                color: vec4<f32>,
            }

            @group(0) @binding(0) var<uniform> uniforms: Uniforms;

            @fragment
            fn main() -> @location(0) vec4<f32> {
                // プリマルチプライドアルファで出力
                return vec4<f32>(
                    uniforms.color.rgb * uniforms.color.a,
                    uniforms.color.a
                );
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

                // カラートランスフォームが必要かチェック
                let needsTransform =
                    input.mulColor.x != 1.0 || input.mulColor.y != 1.0 ||
                    input.mulColor.z != 1.0 || input.mulColor.w != 1.0 ||
                    input.addColor.x != 0.0 || input.addColor.y != 0.0 || input.addColor.z != 0.0;

                if (needsTransform) {
                    // Unpremultiply
                    src = vec4<f32>(src.rgb / max(0.0001, src.a), src.a);

                    // Apply color transform
                    src = clamp(src * input.mulColor + input.addColor, vec4<f32>(0.0), vec4<f32>(1.0));

                    // Premultiply
                    src = vec4<f32>(src.rgb * src.a, src.a);
                }

                return src;
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
