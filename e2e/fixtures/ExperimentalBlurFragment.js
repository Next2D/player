import { WgslVertexOutput } from "/packages/webgpu/src/Shader/wgsl/common/SharedWgsl.ts";

export function experimentalBlurFragment(half_blur)
    {
        const halfBlurFixed = half_blur.toFixed(1);
        // The renderer uses integer radii 1-16. Keep each tap's position and
        // accumulation order while specializing away the shader loop.
        let taps = "";
        if (Number.isInteger(half_blur) && half_blur >= 1 && half_blur <= 16) {
            for (let i = 1; i < half_blur; i++) {
                const distance = i.toFixed(1);
                taps += `    color += textureSample(inputTexture, textureSampler, input.texCoord + offset * ${distance});\n`;
                taps += `    color += textureSample(inputTexture, textureSampler, input.texCoord - offset * ${distance});\n`;
            }
        } else {
            // Preserve the original generator's behavior outside the renderer's variants.
            taps = `    for (var i: f32 = 1.0; i < ${halfBlurFixed}; i += 1.0) {
        color += textureSample(inputTexture, textureSampler, input.texCoord + offset * i);
        color += textureSample(inputTexture, textureSampler, input.texCoord - offset * i);
    }
`;
        }

        return /* wgsl */`
${WgslVertexOutput}

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
${taps}    color += textureSample(inputTexture, textureSampler, input.texCoord + offset * ${halfBlurFixed}) * fraction;
    color += textureSample(inputTexture, textureSampler, input.texCoord - offset * ${halfBlurFixed}) * fraction;
    color /= samples;
    return color;
}
`;
    }
