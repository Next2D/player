/**
 * @description グラデーションのUniform定義とスプレッドモード処理のWGSLコード
 *              WGSL code for gradient uniform definitions and spread mode handling
 *
 * @type {string}
 * @constant
 */
const $GradientUniformsAndSpread = `
struct GradientUniforms {
    inverseMatrix: mat3x3<f32>,
    gradientType: f32,
    focal: f32,
    spread: f32,
    radius: f32,
    linearPoints: vec4<f32>,
}

@group(0) @binding(0) var<uniform> gradient: GradientUniforms;
@group(0) @binding(1) var gradientSampler: sampler;
@group(0) @binding(2) var gradientTexture: texture_2d<f32>;

override GRADIENT_TYPE: u32 = 0u;
override SPREAD_MODE: u32 = 2u;

fn applySpread(t: f32) -> f32 {
    if (SPREAD_MODE == 0u) {
        return 1.0 - abs(fract(t * 0.5) * 2.0 - 1.0);
    } else if (SPREAD_MODE == 1u) {
        return fract(t);
    } else {
        return clamp(t, 0.0, 1.0);
    }
}
`;

/**
 * @description 線形・放射グラデーションのt値計算WGSLコード
 *              WGSL code for calculating t value in linear and radial gradients
 *
 * @type {string}
 * @constant
 */
const $GradientCalculation = `
    var t: f32;
    if (GRADIENT_TYPE == 0u) {
        let a = gradient.linearPoints.xy;
        let b = gradient.linearPoints.zw;
        let ab = b - a;
        let ap = p - a;
        let dotAB = dot(ab, ab);
        if (dotAB < 0.0001) {
            t = 0.0;
        } else {
            t = dot(ab, ap) / dotAB;
        }
    } else {
        let r = gradient.radius;
        let coord = p / r;
        let focalRatio = gradient.focal;

        if (abs(focalRatio) < 0.001) {
            t = length(coord);
        } else {
            let focal = vec2<f32>(focalRatio, 0.0);
            let diff = coord - focal;
            let lenDiff = length(diff);

            if (lenDiff < 0.0001) {
                t = 0.0;
            } else {
                let dir = diff / lenDiff;

                // Solve quadratic equation for unit circle intersection (a=1 since dir is normalized)
                let b_coef = 2.0 * dot(dir, focal);
                let c_coef = dot(focal, focal) - 1.0;
                let discriminant = b_coef * b_coef - 4.0 * c_coef;
                let x = (-b_coef + sqrt(max(discriminant, 0.0))) * 0.5;
                t = lenDiff / abs(x);
            }
        }
    }
    t = applySpread(t);
    let gradientColor = textureSampleLevel(gradientTexture, gradientSampler, vec2<f32>(t, 0.5), 0);
`;

/**
 * @description グラデーション塗りフラグメントシェーダー（頂点カラー乗算付き）
 *              Gradient fill fragment shader with vertex color multiplication
 *
 * @type {string}
 * @constant
 */
export const GradientFillFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) v_uv: vec2<f32>,
    @location(1) bezier: vec2<f32>,
    @location(2) color: vec4<f32>,
}
${$GradientUniformsAndSpread}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let p = input.v_uv;
${$GradientCalculation}
    let result = gradientColor * input.color;
    return vec4<f32>(result.rgb * result.a, result.a);
}
`;

/**
 * @description ステンシル用グラデーション塗りフラグメントシェーダー
 *              Gradient fill fragment shader for stencil rendering
 *
 * @type {string}
 * @constant
 */
export const GradientFillStencilFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) v_uv: vec2<f32>,
    @location(1) bezier: vec2<f32>,
    @location(2) color: vec4<f32>,
}
${$GradientUniformsAndSpread}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let p = input.v_uv;
${$GradientCalculation}
    return vec4<f32>(gradientColor.rgb * gradientColor.a, gradientColor.a);
}
`;

/**
 * @description テクスチャ座標ベースのグラデーションフラグメントシェーダー
 *              Texture coordinate-based gradient fragment shader
 *
 * @type {string}
 * @constant
 */
export const GradientFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
    @location(1) color: vec4<f32>,
}
${$GradientUniformsAndSpread}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let p = input.texCoord;
${$GradientCalculation}
    let result = gradientColor * input.color;
    return vec4<f32>(result.rgb * result.a, result.a);
}
`;
