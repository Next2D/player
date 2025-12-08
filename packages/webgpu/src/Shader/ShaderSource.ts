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

                // Y軸反転なし - WebGPU座標系
                output.position = vec4<f32>(ndc.x, ndc.y, 0.0, 1.0);

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
     *              WebGL版のMASKシェーダーに相当
     *
     *              ShapeRenderUseCase.tsで offsetY = atlasHeight - node.y - height を計算
     *              これはWebGL座標系（下から上）用の変換
     *
     *              WebGPU座標系（上から下）では、この変換後の座標をそのまま使用
     *              シェーダーでのY軸反転は不要（二重反転を避ける）
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
                @location(0) bezier: vec2<f32>,
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

                // Y軸反転なし - WebGPU座標系（getFillVertexShaderと統一）
                output.position = vec4<f32>(ndc.x, ndc.y, 0.0, 1.0);

                // ベジェ曲線座標を渡す（Loop-Blinn法で使用）
                output.bezier = input.bezier;

                return output;
            }
        `;
    }

    /**
     * @description ステンシル書き込み用フラグメントシェーダー（Pass1）
     *              WebGL版のMASKシェーダーに相当
     *
     *              Loop-Blinn法でベジェ曲線外のピクセルをディスカード
     *              f(u,v) = u² - v >= 0 の場合、曲線の外側としてディスカード
     *
     *              内部三角形（直線セグメント）はbezier = (0.5, 0.5)
     *              この場合 f = 0.25 - 0.5 = -0.25 < 0 なので描画される
     * @return {string}
     */
    static getStencilWriteFragmentShader(): string
    {
        return /* wgsl */`
            struct FragmentInput {
                @builtin(position) position: vec4<f32>,
                @location(0) bezier: vec2<f32>,
            }

            @fragment
            fn main(input: FragmentInput) -> @location(0) vec4<f32> {
                // Loop-Blinn法: f(u,v) = u² - v
                // f < 0: 曲線の内側（描画）
                // f >= 0: 曲線の外側（ディスカード）
                let f = input.bezier.x * input.bezier.x - input.bezier.y;

                if (f >= 0.0) {
                    discard;
                }

                // ステンシルのみ更新、カラーは書き込まない（writeMaskで制御）
                return vec4<f32>(0.0, 0.0, 0.0, 0.0);
            }
        `;
    }

    /**
     * @description ステンシルフィル用頂点シェーダー（Pass2）
     *              WebGL版と同じ: 同じメッシュデータを使って描画
     *              頂点カラーを使用（SOLID_FILL_COLORと同じ）
     *
     *              Y軸反転なし（Pass1と一致させる）
     * @return {string}
     */
    static getStencilFillVertexShader(): string
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
                @location(0) color: vec4<f32>,
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

                // Y軸反転なし - WebGPU座標系（Pass1と一致させる）
                output.position = vec4<f32>(ndc.x, ndc.y, 0.0, 1.0);

                // 頂点カラーを渡す
                output.color = input.color;

                return output;
            }
        `;
    }

    /**
     * @description ステンシルフィル用フラグメントシェーダー（Pass2）
     *              WebGL版のSOLID_FILL_COLORと同じ: 頂点カラーをプリマルチプライドアルファで出力
     * @return {string}
     */
    static getStencilFillFragmentShader(): string
    {
        return /* wgsl */`
            struct FragmentInput {
                @builtin(position) position: vec4<f32>,
                @location(0) color: vec4<f32>,
            }

            @fragment
            fn main(input: FragmentInput) -> @location(0) vec4<f32> {
                // WebGL版のSOLID_FILL_COLORと同じ:
                // o_color = vec4(v_color.rgb * v_color.a, v_color.a);
                return vec4<f32>(
                    input.color.rgb * input.color.a,
                    input.color.a
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
                
                // Convert to NDC: 0-1 → -1 to 1
                let ndc = pos * 2.0 - 1.0;

                // Y軸反転なし（他のシェーダーと統一）
                output.position = vec4<f32>(ndc.x, ndc.y, 0.0, 1.0);
                
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
                // WebGPUのNDC: Y軸は上向き（+1が上、-1が下）
                // 画面座標系: Y軸は下向き（0が上、heightが下）
                // メインキャンバスへの描画時はY軸を反転
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
     * @description グラデーションフィル用頂点シェーダー（行列変換でUV座標を計算）
     * @return {string}
     */
    static getGradientFillVertexShader(): string
    {
        return /* wgsl */`
            struct VertexInput {
                @location(0) position: vec2<f32>,
                @location(1) bezier: vec2<f32>,
                @location(2) color: vec4<f32>,
                @location(3) matrixRow0: vec3<f32>,
                @location(4) matrixRow1: vec3<f32>,
                @location(5) matrixRow2: vec3<f32>,
            }

            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) gradientCoord: vec2<f32>,
                @location(1) bezier: vec2<f32>,
                @location(2) color: vec4<f32>,
            }

            struct GradientUniforms {
                // グラデーション行列（UV変換用）
                gradientMatrix: mat3x3<f32>,
                // グラデーションタイプ (0: linear, 1: radial)
                gradientType: f32,
                // focal point for radial gradient
                focal: f32,
                // spread method (0: pad, 1: reflect, 2: repeat)
                spread: f32,
                // padding
                _pad: f32,
            }

            @group(0) @binding(0) var<uniform> gradient: GradientUniforms;

            @vertex
            fn main(input: VertexInput) -> VertexOutput {
                var output: VertexOutput;

                // 頂点変換行列を構築
                let matrix = mat3x3<f32>(
                    input.matrixRow0,
                    input.matrixRow1,
                    input.matrixRow2
                );

                // NDC座標に変換
                let pos = matrix * vec3<f32>(input.position, 1.0);
                let ndc = vec2<f32>(pos.x * 2.0 - 1.0, pos.y * 2.0 - 1.0);
                output.position = vec4<f32>(ndc.x, ndc.y, 0.0, 1.0);

                // グラデーション座標を計算（グラデーション行列で変換）
                let gradPos = gradient.gradientMatrix * vec3<f32>(input.position, 1.0);
                output.gradientCoord = gradPos.xy;

                output.bezier = input.bezier;
                output.color = input.color;

                return output;
            }
        `;
    }

    /**
     * @description グラデーションフィル用フラグメントシェーダー
     * @return {string}
     */
    static getGradientFillFragmentShader(): string
    {
        return /* wgsl */`
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) gradientCoord: vec2<f32>,
                @location(1) bezier: vec2<f32>,
                @location(2) color: vec4<f32>,
            }

            struct GradientUniforms {
                gradientMatrix: mat3x3<f32>,
                gradientType: f32,
                focal: f32,
                spread: f32,
                _pad: f32,
            }

            @group(0) @binding(0) var<uniform> gradient: GradientUniforms;
            @group(0) @binding(1) var gradientSampler: sampler;
            @group(0) @binding(2) var gradientTexture: texture_2d<f32>;

            fn applySpread(t: f32, spread: f32) -> f32 {
                if (spread < 0.5) {
                    // pad
                    return clamp(t, 0.0, 1.0);
                } else if (spread < 1.5) {
                    // reflect
                    return 1.0 - abs(fract(t * 0.5) * 2.0 - 1.0);
                } else {
                    // repeat
                    return fract(t);
                }
            }

            @fragment
            fn main(input: VertexOutput) -> @location(0) vec4<f32> {
                // ベジェ曲線のディスカード（Loop-Blinn）
                let f = input.bezier.x * input.bezier.x - input.bezier.y;
                if (f >= 0.0 && input.bezier.x != 0.0) {
                    discard;
                }

                var t: f32;

                if (gradient.gradientType < 0.5) {
                    // Linear gradient: t = x座標
                    t = input.gradientCoord.x;
                } else {
                    // Radial gradient
                    let x = input.gradientCoord.x;
                    let y = input.gradientCoord.y;
                    let focal = gradient.focal;

                    if (abs(focal) < 0.001) {
                        // 中心にフォーカル
                        t = sqrt(x * x + y * y);
                    } else {
                        // フォーカルポイントがオフセットされている場合
                        let fx = focal;
                        let dx = x - fx;
                        let dy = y;
                        let d = sqrt(dx * dx + dy * dy);
                        t = d / (1.0 - focal * focal);
                    }
                }

                // スプレッドを適用
                t = applySpread(t, gradient.spread);

                // LUTテクスチャからサンプリング
                let gradientColor = textureSample(gradientTexture, gradientSampler, vec2<f32>(t, 0.5));

                // プリマルチプライドアルファ
                let alpha = gradientColor.a * input.color.a;
                return vec4<f32>(gradientColor.rgb * input.color.a, alpha);
            }
        `;
    }

    /**
     * @description グラデーション用フラグメントシェーダー（レガシー）
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
     * @description ビットマップフィル用頂点シェーダー
     *              17 floats頂点フォーマット対応
     * @return {string}
     */
    static getBitmapFillVertexShader(): string
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
                @location(2) worldPos: vec2<f32>,
            }

            @vertex
            fn main(input: VertexInput) -> VertexOutput {
                var output: VertexOutput;

                // 変換行列を構築
                let matrix = mat3x3<f32>(
                    input.matrix0,
                    input.matrix1,
                    input.matrix2
                );

                // 位置を変換
                let transformedPos = matrix * vec3<f32>(input.position, 1.0);

                // クリップ空間に変換 (0~1 → -1~1)
                let clipX = transformedPos.x * 2.0 - 1.0;
                let clipY = 1.0 - transformedPos.y * 2.0;

                output.position = vec4<f32>(clipX, clipY, 0.0, 1.0);
                output.bezier = input.bezier;
                output.color = input.color;
                output.worldPos = input.position;

                return output;
            }
        `;
    }

    /**
     * @description ビットマップフィル用フラグメントシェーダー
     *              テクスチャマッピングとLoop-Blinn曲線discard
     * @return {string}
     */
    static getBitmapFillFragmentShader(): string
    {
        return /* wgsl */`
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
                // Loop-Blinn 曲線判定
                let u = input.bezier.x;
                let v = input.bezier.y;

                // u*u - v の符号で内外判定
                // bezier = (0.5, 0.5) の場合はスキップ（直線部分）
                if (abs(u - 0.5) > 0.001 || abs(v - 0.5) > 0.001) {
                    let d = u * u - v;
                    if (d > 0.0) {
                        discard;
                    }
                }

                // ビットマップ変換行列でUV座標を計算
                let transformedPos = uniforms.bitmapMatrix * vec3<f32>(input.worldPos, 1.0);
                var uv = vec2<f32>(
                    transformedPos.x / uniforms.textureWidth,
                    transformedPos.y / uniforms.textureHeight
                );

                // Y座標を反転
                uv.y = 1.0 - uv.y;

                // リピートモードの場合はfractでラップ
                if (uniforms.repeat > 0.5) {
                    uv = fract(uv);
                } else {
                    // クリップモード: 範囲外は透明
                    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
                        discard;
                    }
                }

                let bitmapColor = textureSample(bitmapTexture, bitmapSampler, uv);

                // プリマルチプライドアルファ
                let alpha = bitmapColor.a * input.color.a;
                return vec4<f32>(bitmapColor.rgb * input.color.a, alpha);
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

    /**
     * @description ブラーフィルター用頂点シェーダー
     *              フルスクリーンクワッド用
     * @return {string}
     */
    static getBlurFilterVertexShader(): string
    {
        return /* wgsl */`
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
            }

            @vertex
            fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
                var output: VertexOutput;

                // フルスクリーンクワッドの頂点座標を生成
                var positions = array<vec2<f32>, 6>(
                    vec2<f32>(-1.0, -1.0),
                    vec2<f32>( 1.0, -1.0),
                    vec2<f32>(-1.0,  1.0),
                    vec2<f32>(-1.0,  1.0),
                    vec2<f32>( 1.0, -1.0),
                    vec2<f32>( 1.0,  1.0)
                );

                var texCoords = array<vec2<f32>, 6>(
                    vec2<f32>(0.0, 1.0),
                    vec2<f32>(1.0, 1.0),
                    vec2<f32>(0.0, 0.0),
                    vec2<f32>(0.0, 0.0),
                    vec2<f32>(1.0, 1.0),
                    vec2<f32>(1.0, 0.0)
                );

                output.position = vec4<f32>(positions[vertexIndex], 0.0, 1.0);
                output.texCoord = texCoords[vertexIndex];

                return output;
            }
        `;
    }

    /**
     * @description ブラーフィルター用フラグメントシェーダー
     *              WebGL版と同じボックスブラーアルゴリズム
     * @param {number} halfBlur - 半分のブラー値（サンプル数の決定に使用）
     * @return {string}
     */
    static getBlurFilterFragmentShader(halfBlur: number): string
    {
        const halfBlurFixed = halfBlur.toFixed(1);

        return /* wgsl */`
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
            }

            struct BlurUniforms {
                offset: vec2<f32>,
                fraction: f32,
                samples: f32,
            }

            @group(0) @binding(0) var<uniform> uniforms: BlurUniforms;
            @group(0) @binding(1) var textureSampler: sampler;
            @group(0) @binding(2) var inputTexture: texture_2d<f32>;

            @fragment
            fn main(input: VertexOutput) -> @location(0) vec4<f32> {
                let offset = uniforms.offset;
                let fraction = uniforms.fraction;
                let samples = uniforms.samples;

                var color = textureSample(inputTexture, textureSampler, input.texCoord);

                // ブラーサンプリング
                for (var i: f32 = 1.0; i < ${halfBlurFixed}; i += 1.0) {
                    color += textureSample(inputTexture, textureSampler, input.texCoord + offset * i);
                    color += textureSample(inputTexture, textureSampler, input.texCoord - offset * i);
                }

                // 端のサンプル（フラクション適用）
                color += textureSample(inputTexture, textureSampler, input.texCoord + offset * ${halfBlurFixed}) * fraction;
                color += textureSample(inputTexture, textureSampler, input.texCoord - offset * ${halfBlurFixed}) * fraction;

                // サンプル数で平均化
                color /= samples;

                return color;
            }
        `;
    }

    /**
     * @description テクスチャコピー用フラグメントシェーダー
     *              フィルター間のテクスチャ転送に使用
     * @return {string}
     */
    static getTextureCopyFragmentShader(): string
    {
        return /* wgsl */`
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
            }

            struct CopyUniforms {
                scale: vec2<f32>,
                offset: vec2<f32>,
            }

            @group(0) @binding(0) var<uniform> uniforms: CopyUniforms;
            @group(0) @binding(1) var textureSampler: sampler;
            @group(0) @binding(2) var inputTexture: texture_2d<f32>;

            @fragment
            fn main(input: VertexOutput) -> @location(0) vec4<f32> {
                let uv = input.texCoord * uniforms.scale + uniforms.offset;
                return textureSample(inputTexture, textureSampler, uv);
            }
        `;
    }

    /**
     * @description カラーマトリックスフィルター用フラグメントシェーダー
     *              4x4行列 + オフセットで色変換
     * @return {string}
     */
    static getColorMatrixFilterFragmentShader(): string
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
            @group(0) @binding(2) var inputTexture: texture_2d<f32>;

            @fragment
            fn main(input: VertexOutput) -> @location(0) vec4<f32> {
                var color = textureSample(inputTexture, textureSampler, input.texCoord);

                // カラーマトリックス適用: result = matrix * color + offset
                var result = uniforms.matrix * color + uniforms.offset;

                // 0-1にクランプ
                result = clamp(result, vec4<f32>(0.0), vec4<f32>(1.0));

                return result;
            }
        `;
    }

    /**
     * @description グローフィルター用フラグメントシェーダー
     *              ブラー結果に単色を適用
     * @return {string}
     */
    static getGlowFilterFragmentShader(): string
    {
        return /* wgsl */`
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
            }

            struct GlowUniforms {
                color: vec4<f32>,
                strength: f32,
                inner: f32,
                knockout: f32,
                _padding: f32,
            }

            @group(0) @binding(0) var<uniform> uniforms: GlowUniforms;
            @group(0) @binding(1) var textureSampler: sampler;
            @group(0) @binding(2) var blurTexture: texture_2d<f32>;
            @group(0) @binding(3) var baseTexture: texture_2d<f32>;

            @fragment
            fn main(input: VertexOutput) -> @location(0) vec4<f32> {
                let blurColor = textureSample(blurTexture, textureSampler, input.texCoord);
                let baseColor = textureSample(baseTexture, textureSampler, input.texCoord);

                // グロー強度を適用
                let glowAlpha = clamp(blurColor.a * uniforms.strength, 0.0, 1.0);
                let glowColor = vec4<f32>(uniforms.color.rgb * glowAlpha, glowAlpha);

                // inner/outer/knockout モードに応じた合成
                if (uniforms.inner > 0.5) {
                    // インナーグロー: 元画像のアルファ内にグローを適用
                    let innerGlow = glowColor * baseColor.a;
                    if (uniforms.knockout > 0.5) {
                        return innerGlow;
                    } else {
                        return baseColor + innerGlow * (1.0 - baseColor.a);
                    }
                } else {
                    // アウターグロー
                    if (uniforms.knockout > 0.5) {
                        return glowColor * (1.0 - baseColor.a);
                    } else {
                        return baseColor + glowColor * (1.0 - baseColor.a);
                    }
                }
            }
        `;
    }

    /**
     * @description ドロップシャドウフィルター用フラグメントシェーダー
     * @return {string}
     */
    static getDropShadowFilterFragmentShader(): string
    {
        return /* wgsl */`
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
            }

            struct DropShadowUniforms {
                color: vec4<f32>,
                offset: vec2<f32>,
                strength: f32,
                inner: f32,
                knockout: f32,
                hideObject: f32,
                _padding: vec2<f32>,
            }

            @group(0) @binding(0) var<uniform> uniforms: DropShadowUniforms;
            @group(0) @binding(1) var textureSampler: sampler;
            @group(0) @binding(2) var blurTexture: texture_2d<f32>;
            @group(0) @binding(3) var baseTexture: texture_2d<f32>;

            @fragment
            fn main(input: VertexOutput) -> @location(0) vec4<f32> {
                let baseColor = textureSample(baseTexture, textureSampler, input.texCoord);

                // オフセットを適用してシャドウをサンプリング
                let shadowUV = input.texCoord + uniforms.offset;
                let blurColor = textureSample(blurTexture, textureSampler, shadowUV);

                // シャドウ強度を適用
                let shadowAlpha = clamp(blurColor.a * uniforms.strength, 0.0, 1.0);
                let shadowColor = vec4<f32>(uniforms.color.rgb * shadowAlpha, shadowAlpha);

                if (uniforms.inner > 0.5) {
                    // インナーシャドウ
                    let innerShadow = shadowColor * baseColor.a;
                    if (uniforms.knockout > 0.5) {
                        return innerShadow;
                    } else {
                        return baseColor * (1.0 - shadowAlpha) + innerShadow;
                    }
                } else {
                    // アウターシャドウ（ドロップシャドウ）
                    if (uniforms.hideObject > 0.5) {
                        return shadowColor;
                    } else if (uniforms.knockout > 0.5) {
                        return shadowColor * (1.0 - baseColor.a);
                    } else {
                        // 通常のドロップシャドウ: シャドウの上に元画像を重ねる
                        return shadowColor * (1.0 - baseColor.a) + baseColor;
                    }
                }
            }
        `;
    }

    /**
     * @description コンボリューションフィルター用フラグメントシェーダー
     *              畳み込み行列を使用した画像処理
     * @param {number} matrixX - 行列のX方向サイズ
     * @param {number} matrixY - 行列のY方向サイズ
     * @param {boolean} preserveAlpha - アルファを保持するか
     * @param {boolean} clamp - 範囲外をクランプするか
     * @return {string}
     */
    static getConvolutionFilterFragmentShader(
        matrixX: number,
        matrixY: number,
        preserveAlpha: boolean,
        clamp: boolean
    ): string
    {
        const halfX = Math.floor(matrixX * 0.5);
        const halfY = Math.floor(matrixY * 0.5);
        const size = matrixX * matrixY;

        // マトリクス要素を取得するコードを生成
        let matrixCode = "";
        for (let i = 0; i < size; i++) {
            const arrayIndex = Math.floor(i / 4);
            const component = i % 4;
            const componentStr = ["x", "y", "z", "w"][component];
            matrixCode += `
                    weight = uniforms.matrix[${arrayIndex}].${componentStr};
                    offsetX = ${i % matrixX} - ${halfX};
                    offsetY = ${halfY} - ${Math.floor(i / matrixX)};
                    uv = input.texCoord + vec2<f32>(f32(offsetX), f32(offsetY)) * rcpSize;
                    color = textureSample(srcTexture, textureSampler, uv);
                    color = vec4<f32>(color.rgb / max(0.0001, color.a), color.a);
                    ${clamp ? "" : `color = mix(uniforms.substituteColor, color, isInside(uv));`}
                    result += color * weight;
`;
        }

        const preserveAlphaCode = preserveAlpha
            ? "result.a = textureSample(srcTexture, textureSampler, input.texCoord).a;"
            : "";

        // マトリクスサイズに基づいて必要な配列サイズを計算
        const matrixArraySize = Math.ceil(size / 4);

        return /* wgsl */`
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
            }

            struct ConvolutionUniforms {
                rcpSize: vec2<f32>,
                rcpDivisor: f32,
                bias: f32,
                substituteColor: vec4<f32>,
                matrix: array<vec4<f32>, ${matrixArraySize}>,
            }

            @group(0) @binding(0) var<uniform> uniforms: ConvolutionUniforms;
            @group(0) @binding(1) var textureSampler: sampler;
            @group(0) @binding(2) var srcTexture: texture_2d<f32>;

            fn isInside(uv: vec2<f32>) -> f32 {
                let s = step(vec2<f32>(0.0), uv) - step(vec2<f32>(1.0), uv);
                return s.x * s.y;
            }

            @fragment
            fn main(input: VertexOutput) -> @location(0) vec4<f32> {
                let rcpSize = uniforms.rcpSize;
                var result = vec4<f32>(0.0);
                var weight: f32;
                var offsetX: i32;
                var offsetY: i32;
                var uv: vec2<f32>;
                var color: vec4<f32>;

                ${matrixCode}

                result = clamp(result * uniforms.rcpDivisor + uniforms.bias, vec4<f32>(0.0), vec4<f32>(1.0));
                ${preserveAlphaCode}
                result = vec4<f32>(result.rgb * result.a, result.a);

                return result;
            }
        `;
    }

    /**
     * @description ベベルフィルター用フラグメントシェーダー
     *              ハイライトとシャドウを使用した立体効果
     * @return {string}
     */
    static getBevelFilterFragmentShader(): string
    {
        return /* wgsl */`
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
            }

            struct BevelUniforms {
                highlightColor: vec4<f32>,
                shadowColor: vec4<f32>,
                strength: f32,
                inner: f32,
                knockout: f32,
                bevelType: f32, // 0: full, 1: inner, 2: outer
            }

            @group(0) @binding(0) var<uniform> uniforms: BevelUniforms;
            @group(0) @binding(1) var textureSampler: sampler;
            @group(0) @binding(2) var blurTexture: texture_2d<f32>;
            @group(0) @binding(3) var baseTexture: texture_2d<f32>;

            @fragment
            fn main(input: VertexOutput) -> @location(0) vec4<f32> {
                let baseColor = textureSample(baseTexture, textureSampler, input.texCoord);

                // 正方向と逆方向のブラーをサンプリング
                let blur1 = textureSample(blurTexture, textureSampler, input.texCoord);
                let blur2 = textureSample(blurTexture, textureSampler, 1.0 - input.texCoord);

                // ハイライトとシャドウのアルファを計算
                var highlightAlpha = blur1.a - blur2.a;
                var shadowAlpha = blur2.a - blur1.a;

                // 強度を適用
                highlightAlpha *= uniforms.strength;
                shadowAlpha *= uniforms.strength;

                // クランプ
                highlightAlpha = clamp(highlightAlpha, 0.0, 1.0);
                shadowAlpha = clamp(shadowAlpha, 0.0, 1.0);

                // ベベルカラーを計算
                let bevelColor = uniforms.highlightColor * highlightAlpha + uniforms.shadowColor * shadowAlpha;

                // タイプに応じた合成
                var result: vec4<f32>;
                let typeVal = uniforms.bevelType;
                let knockout = uniforms.knockout > 0.5;

                if (typeVal < 0.5) {
                    // full
                    if (knockout) {
                        result = bevelColor;
                    } else {
                        result = baseColor - baseColor * bevelColor.a + bevelColor;
                    }
                } else if (typeVal < 1.5) {
                    // inner
                    result = bevelColor;
                } else {
                    // outer
                    if (knockout) {
                        result = bevelColor - bevelColor * baseColor.a;
                    } else {
                        result = baseColor + bevelColor - bevelColor * baseColor.a;
                    }
                }

                return result;
            }
        `;
    }

    /**
     * @description 複雑なブレンドモード用フラグメントシェーダーを取得
     *              WebGL版と同じブレンド計算式を使用
     * @param {string} blendMode - ブレンドモード名
     * @return {string}
     */
    static getComplexBlendFragmentShader(blendMode: string): string
    {
        let blendFunction: string;

        switch (blendMode) {
            case "subtract":
                blendFunction = `
                    fn blend(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
                        if (src.a == 0.0) { return dst; }
                        if (dst.a == 0.0) { return src; }

                        let a = src - src * dst.a;
                        let b = dst - dst * src.a;

                        let srcRgb = src.rgb / src.a;
                        let dstRgb = dst.rgb / dst.a;

                        var c = vec4<f32>(dstRgb - srcRgb, src.a * dst.a);
                        c = vec4<f32>(c.rgb * c.a, c.a);

                        return a + b + c;
                    }
                `;
                break;

            case "multiply":
                blendFunction = `
                    fn blend(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
                        let a = src - src * dst.a;
                        let b = dst - dst * src.a;
                        let c = src * dst;

                        return a + b + c;
                    }
                `;
                break;

            case "lighten":
                blendFunction = `
                    fn blend(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
                        if (src.a == 0.0) { return dst; }
                        if (dst.a == 0.0) { return src; }

                        let a = src - src * dst.a;
                        let b = dst - dst * src.a;

                        let srcRgb = src.rgb / src.a;
                        let dstRgb = dst.rgb / dst.a;

                        // (src > dst) ? src : dst
                        let mixed = mix(srcRgb, dstRgb, step(srcRgb, dstRgb));
                        var c = vec4<f32>(mixed, src.a * dst.a);
                        c = vec4<f32>(c.rgb * c.a, c.a);

                        return a + b + c;
                    }
                `;
                break;

            case "darken":
                blendFunction = `
                    fn blend(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
                        if (src.a == 0.0) { return dst; }
                        if (dst.a == 0.0) { return src; }

                        let a = src - src * dst.a;
                        let b = dst - dst * src.a;

                        let srcRgb = src.rgb / src.a;
                        let dstRgb = dst.rgb / dst.a;

                        // (src < dst) ? src : dst
                        let mixed = mix(srcRgb, dstRgb, step(dstRgb, srcRgb));
                        var c = vec4<f32>(mixed, src.a * dst.a);
                        c = vec4<f32>(c.rgb * c.a, c.a);

                        return a + b + c;
                    }
                `;
                break;

            case "overlay":
                blendFunction = `
                    fn blend(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
                        if (src.a == 0.0) { return dst; }
                        if (dst.a == 0.0) { return src; }

                        let a = src - src * dst.a;
                        let b = dst - dst * src.a;

                        let srcRgb = src.rgb / src.a;
                        let dstRgb = dst.rgb / dst.a;

                        let mul = srcRgb * dstRgb;
                        let c1 = 2.0 * mul;
                        let c2 = 2.0 * (srcRgb + dstRgb - mul) - 1.0;
                        let mixed = mix(c1, c2, step(vec3<f32>(0.5), dstRgb));
                        var c = vec4<f32>(mixed, src.a * dst.a);
                        c = vec4<f32>(c.rgb * c.a, c.a);

                        return a + b + c;
                    }
                `;
                break;

            case "hardlight":
                blendFunction = `
                    fn blend(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
                        if (src.a == 0.0) { return dst; }
                        if (dst.a == 0.0) { return src; }

                        let a = src - src * dst.a;
                        let b = dst - dst * src.a;

                        let srcRgb = src.rgb / src.a;
                        let dstRgb = dst.rgb / dst.a;

                        let mul = srcRgb * dstRgb;
                        let c1 = 2.0 * mul;
                        let c2 = 2.0 * (srcRgb + dstRgb - mul) - 1.0;
                        let mixed = mix(c1, c2, step(vec3<f32>(0.5), srcRgb));
                        var c = vec4<f32>(mixed, src.a * dst.a);
                        c = vec4<f32>(c.rgb * c.a, c.a);

                        return a + b + c;
                    }
                `;
                break;

            case "difference":
                blendFunction = `
                    fn blend(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
                        if (src.a == 0.0) { return dst; }
                        if (dst.a == 0.0) { return src; }

                        let a = src - src * dst.a;
                        let b = dst - dst * src.a;

                        let srcRgb = src.rgb / src.a;
                        let dstRgb = dst.rgb / dst.a;

                        var c = vec4<f32>(abs(srcRgb - dstRgb), src.a * dst.a);
                        c = vec4<f32>(c.rgb * c.a, c.a);

                        return a + b + c;
                    }
                `;
                break;

            case "invert":
                blendFunction = `
                    fn blend(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
                        if (src.a == 0.0) { return dst; }
                        if (dst.a == 0.0) { return src; }

                        let b = dst - dst * src.a;
                        let c = vec4<f32>(src.a - dst.rgb * src.a, src.a);

                        return b + c;
                    }
                `;
                break;

            default: // normal
                blendFunction = `
                    fn blend(src: vec4<f32>, dst: vec4<f32>) -> vec4<f32> {
                        return src + dst - dst * src.a;
                    }
                `;
                break;
        }

        return /* wgsl */`
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) texCoord: vec2<f32>,
            }

            struct BlendUniforms {
                mulColor: vec4<f32>,
                addColor: vec4<f32>,
            }

            @group(0) @binding(0) var<uniform> uniforms: BlendUniforms;
            @group(0) @binding(1) var textureSampler: sampler;
            @group(0) @binding(2) var dstTexture: texture_2d<f32>;
            @group(0) @binding(3) var srcTexture: texture_2d<f32>;

            ${blendFunction}

            @fragment
            fn main(input: VertexOutput) -> @location(0) vec4<f32> {
                var dst = textureSample(dstTexture, textureSampler, input.texCoord);
                var src = textureSample(srcTexture, textureSampler, input.texCoord);

                // カラートランスフォームを適用
                src = src * uniforms.mulColor + uniforms.addColor;
                src = clamp(src, vec4<f32>(0.0), vec4<f32>(1.0));
                src = vec4<f32>(src.rgb * src.a, src.a); // プリマルチプライドアルファに変換

                return blend(src, dst);
            }
        `;
    }
}
