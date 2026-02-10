export const getBevelFilterFragmentShader = (
    type: string,
    knockout: boolean,
    isGradient: boolean
): string => {
    const isInner = type === "inner";
    const isOuter = type === "outer";

    const gradientBinding = isGradient ? `
@group(0) @binding(4) var gradientTexture: texture_2d<f32>;` : "";

    const colorCalculation = isGradient ? `
    let gradientCoord = vec2<f32>(blurAlpha, 0.5);
    var filterColor = textureSample(gradientTexture, sourceSampler, gradientCoord);
` : `
    let highlightWeight = clamp(blurAlpha * 2.0, 0.0, 1.0);
    let shadowWeight = clamp((1.0 - blurAlpha) * 2.0, 0.0, 1.0);
    var filterColor = uniforms.highlightColor * highlightWeight + uniforms.shadowColor * shadowWeight;
`;

    let typeProcessing = "";
    if (isInner) {
        typeProcessing = `
    let baseAlpha = textureSample(baseTexture, sourceSampler, baseTexCoord).a;
    filterColor = filterColor * baseAlpha;
    ${knockout ? "let finalColor = filterColor;" : "let finalColor = mix(baseColor, filterColor, filterColor.a);"}
`;
    } else if (isOuter) {
        typeProcessing = `
    let baseAlpha = textureSample(baseTexture, sourceSampler, baseTexCoord).a;
    filterColor = filterColor * (1.0 - baseAlpha);
    ${knockout ? "let finalColor = filterColor;" : "let finalColor = filterColor + baseColor * (1.0 - filterColor.a);"}
`;
    } else {
        typeProcessing = knockout ? `
    let finalColor = filterColor;
` : `
    let finalColor = filterColor + baseColor * (1.0 - filterColor.a);
`;
    }

    return `
struct BevelUniforms {
    blurTexCoordScale: vec2<f32>,
    blurTexCoordOffset: vec2<f32>,
    baseTexCoordScale: vec2<f32>,
    baseTexCoordOffset: vec2<f32>,
    strength: f32,
    _pad1: f32,
    _pad2: f32,
    _pad3: f32,
    highlightColor: vec4<f32>,
    shadowColor: vec4<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: BevelUniforms;
@group(0) @binding(1) var sourceSampler: sampler;
@group(0) @binding(2) var blurTexture: texture_2d<f32>;
@group(0) @binding(3) var baseTexture: texture_2d<f32>;
${gradientBinding}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var positions = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>(1.0, -1.0),
        vec2<f32>(-1.0, 1.0),
        vec2<f32>(-1.0, 1.0),
        vec2<f32>(1.0, -1.0),
        vec2<f32>(1.0, 1.0)
    );

    var texCoords = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 1.0),
        vec2<f32>(0.0, 0.0),
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 1.0),
        vec2<f32>(1.0, 0.0)
    );

    var output: VertexOutput;
    output.position = vec4<f32>(positions[vertexIndex], 0.0, 1.0);
    output.texCoord = texCoords[vertexIndex];
    return output;
}

@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
    let blurTexCoord = input.texCoord * uniforms.blurTexCoordScale + uniforms.blurTexCoordOffset;
    let baseTexCoord = input.texCoord * uniforms.baseTexCoordScale + uniforms.baseTexCoordOffset;

    let blurColor = textureSample(blurTexture, sourceSampler, blurTexCoord);
    var blurAlpha = blurColor.a * uniforms.strength;
    blurAlpha = clamp(blurAlpha, 0.0, 1.0);

    let baseColor = textureSample(baseTexture, sourceSampler, baseTexCoord);

    ${colorCalculation}
    ${typeProcessing}

    return finalColor;
}
`;
};

export const getBevelFilterShaderKey = (
    type: string,
    knockout: boolean,
    isGradient: boolean
): string => {
    return `bevel_${type}_${knockout ? "ko" : "nko"}_${isGradient ? "g" : "ng"}`;
};
