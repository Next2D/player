const GradientUniformsAndSpread = `
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
`;

const GradientCalculation = `
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

                // Solve quadratic equation for unit circle intersection
                let a_coef = dot(dir, dir);
                let b_coef = 2.0 * dot(dir, focal);
                let c_coef = dot(focal, focal) - 1.0;
                let discriminant = b_coef * b_coef - 4.0 * a_coef * c_coef;
                let x = (-b_coef + sqrt(max(discriminant, 0.0))) / (2.0 * a_coef);

                let edgePoint = focal + dir * x;
                t = distance(focal, coord) / distance(focal, edgePoint);
            }
        }
    }
    t = applySpread(t, gradient.spread);
    let gradientColor = textureSample(gradientTexture, gradientSampler, vec2<f32>(t, 0.5));
`;

export const GradientFillFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) v_uv: vec2<f32>,
    @location(1) bezier: vec2<f32>,
    @location(2) color: vec4<f32>,
}
${GradientUniformsAndSpread}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let p = input.v_uv;
${GradientCalculation}
    let result = gradientColor * input.color;
    return vec4<f32>(result.rgb * result.a, result.a);
}
`;

export const GradientFillStencilFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) v_uv: vec2<f32>,
    @location(1) bezier: vec2<f32>,
    @location(2) color: vec4<f32>,
}
${GradientUniformsAndSpread}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let p = input.v_uv;
${GradientCalculation}
    return vec4<f32>(gradientColor.rgb * gradientColor.a, gradientColor.a);
}
`;

export const GradientFragment = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
    @location(1) color: vec4<f32>,
}
${GradientUniformsAndSpread}

@fragment
fn main(input: VertexOutput) -> @location(0) vec4<f32> {
    let p = input.texCoord;
${GradientCalculation}
    let result = gradientColor * input.color;
    return vec4<f32>(result.rgb * result.a, result.a);
}
`;
