export const GradientFillFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) v_uv: vec2<f32>,
    @location(1) bezier: vec2<f32>,
    @location(2) color: vec4<f32>,
}

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

fn applySpread(t: f32, spread: f32) -> f32 {
    if (spread < 0.5) {
        return 1.0 - abs(fract(t * 0.5) * 2.0 - 1.0);
    } else if (spread < 1.5) {
        return fract(t);
    } else {
        return clamp(t, 0.0, 1.0);
    }
}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    // WebGL版と同じ: bezierチェックなし
    var t: f32;
    let p = input.v_uv;
    if (gradient.gradientType < 0.5) {
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
        // WebGL版と同じ放射グラデーション計算
        let r = gradient.radius;
        let coord = p / r;  // 座標を正規化（単位円に変換）
        let focalRatio = gradient.focal;

        if (abs(focalRatio) < 0.001) {
            // focal point無し: 単純な距離計算
            t = length(coord);
        } else {
            // focal point有り: WebGL版と同じ二次方程式による計算
            let focal = vec2<f32>(focalRatio, 0.0);
            let diff = coord - focal;
            let lenDiff = length(diff);

            if (lenDiff < 0.0001) {
                t = 0.0;
            } else {
                let dir = diff / lenDiff;

                // 二次方程式 ax^2 + bx + c = 0 を解いて単位円との交点を求める
                let a_coef = dot(dir, dir);
                let b_coef = 2.0 * dot(dir, focal);
                let c_coef = dot(focal, focal) - 1.0;
                let discriminant = b_coef * b_coef - 4.0 * a_coef * c_coef;
                let x = (-b_coef + sqrt(max(discriminant, 0.0))) / (2.0 * a_coef);

                // 焦点から現在位置までの距離 / 焦点から円周までの距離
                let edgePoint = focal + dir * x;
                t = distance(focal, coord) / distance(focal, edgePoint);
            }
        }
    }
    t = applySpread(t, gradient.spread);
    let gradientColor = textureSample(gradientTexture, gradientSampler, vec2<f32>(t, 0.5));
    let result = gradientColor * input.color;
    // プリマルチプライドアルファで出力
    return vec4<f32>(result.rgb * result.a, result.a);
}
`;

// 2パスステンシルフィル用グラデーションフラグメントシェーダー（bezierチェックなし）
// Pass 1でステンシルに書き込み済みのため、Pass 2ではbezierチェックは不要
export const GradientFillStencilFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) v_uv: vec2<f32>,
    @location(1) bezier: vec2<f32>,
    @location(2) color: vec4<f32>,
}

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

fn applySpread(t: f32, spread: f32) -> f32 {
    if (spread < 0.5) {
        return 1.0 - abs(fract(t * 0.5) * 2.0 - 1.0);
    } else if (spread < 1.5) {
        return fract(t);
    } else {
        return clamp(t, 0.0, 1.0);
    }
}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    // bezierチェックなし - ステンシルテストで形状は決定済み
    var t: f32;
    let p = input.v_uv;
    if (gradient.gradientType < 0.5) {
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
        // WebGL版と同じ放射グラデーション計算
        let r = gradient.radius;
        let coord = p / r;  // 座標を正規化（単位円に変換）
        let focalRatio = gradient.focal;

        if (abs(focalRatio) < 0.001) {
            // focal point無し: 単純な距離計算
            t = length(coord);
        } else {
            // focal point有り: WebGL版と同じ二次方程式による計算
            let focal = vec2<f32>(focalRatio, 0.0);
            let diff = coord - focal;
            let lenDiff = length(diff);

            if (lenDiff < 0.0001) {
                t = 0.0;
            } else {
                let dir = diff / lenDiff;

                // 二次方程式 ax^2 + bx + c = 0 を解いて単位円との交点を求める
                let a_coef = dot(dir, dir);
                let b_coef = 2.0 * dot(dir, focal);
                let c_coef = dot(focal, focal) - 1.0;
                let discriminant = b_coef * b_coef - 4.0 * a_coef * c_coef;
                let x = (-b_coef + sqrt(max(discriminant, 0.0))) / (2.0 * a_coef);

                // 焦点から現在位置までの距離 / 焦点から円周までの距離
                let edgePoint = focal + dir * x;
                t = distance(focal, coord) / distance(focal, edgePoint);
            }
        }
    }
    t = applySpread(t, gradient.spread);
    let gradientColor = textureSample(gradientTexture, gradientSampler, vec2<f32>(t, 0.5));
    // グラデーションテクスチャの色をそのまま使用（input.colorは無視）
    // プリマルチプライドアルファで出力
    return vec4<f32>(gradientColor.rgb * gradientColor.a, gradientColor.a);
}
`;

export const GradientFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
    @location(1) color: vec4<f32>,
}

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

fn applySpread(t: f32, spread: f32) -> f32 {
    if (spread < 0.5) {
        return 1.0 - abs(fract(t * 0.5) * 2.0 - 1.0);
    } else if (spread < 1.5) {
        return fract(t);
    } else {
        return clamp(t, 0.0, 1.0);
    }
}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let p = input.texCoord;
    var t: f32;
    if (gradient.gradientType < 0.5) {
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
        // WebGL版と同じ放射グラデーション計算
        let r = gradient.radius;
        let coord = p / r;  // 座標を正規化（単位円に変換）
        let focalRatio = gradient.focal;

        if (abs(focalRatio) < 0.001) {
            // focal point無し: 単純な距離計算
            t = length(coord);
        } else {
            // focal point有り: WebGL版と同じ二次方程式による計算
            let focal = vec2<f32>(focalRatio, 0.0);
            let diff = coord - focal;
            let lenDiff = length(diff);

            if (lenDiff < 0.0001) {
                t = 0.0;
            } else {
                let dir = diff / lenDiff;

                // 二次方程式 ax^2 + bx + c = 0 を解いて単位円との交点を求める
                let a_coef = dot(dir, dir);
                let b_coef = 2.0 * dot(dir, focal);
                let c_coef = dot(focal, focal) - 1.0;
                let discriminant = b_coef * b_coef - 4.0 * a_coef * c_coef;
                let x = (-b_coef + sqrt(max(discriminant, 0.0))) / (2.0 * a_coef);

                // 焦点から現在位置までの距離 / 焦点から円周までの距離
                let edgePoint = focal + dir * x;
                t = distance(focal, coord) / distance(focal, edgePoint);
            }
        }
    }
    t = applySpread(t, gradient.spread);
    let gradientColor = textureSample(gradientTexture, gradientSampler, vec2<f32>(t, 0.5));
    let result = gradientColor * input.color;
    // プリマルチプライドアルファで出力
    return vec4<f32>(result.rgb * result.a, result.a);
}
`;
