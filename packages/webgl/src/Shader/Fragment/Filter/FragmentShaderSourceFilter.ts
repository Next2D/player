import { FUNCTION_IS_INSIDE } from "../FragmentShaderLibrary";

const STATEMENT_BASE_TEXTURE_TRANSFORM = (index: number): string =>
{
    return `
    vec2 base_scale  = u_mediump[${index}].xy;
    vec2 base_offset = u_mediump[${index}].zw;

    vec2 uv = v_coord * base_scale - base_offset;
    vec4 base = mix(vec4(0.0), texture(u_textures[1], uv), isInside(uv));
`;
};

const STATEMENT_BLUR_TEXTURE = (): string =>
{
    return `
    vec4 blur = texture(u_textures[0], v_coord);
`;
};

const STATEMENT_BLUR_TEXTURE_TRANSFORM = (index: number): string =>
{
    return `
    vec2 blur_scale  = u_mediump[${index}].xy;
    vec2 blur_offset = u_mediump[${index}].zw;

    vec2 st = v_coord * blur_scale - blur_offset;
    vec4 blur = mix(vec4(0.0), texture(u_textures[0], st), isInside(st));
`;
};

const STATEMENT_GLOW_STRENGTH = (offset: number): string =>
{
    const index     = Math.floor(offset / 4);
    const component = offset % 4;
    return `
    float strength = u_mediump[${index}][${component}];
    blur.a = clamp(blur.a * strength, 0.0, 1.0);
`;
};

const STATEMENT_GLOW_SOLID_COLOR = (index: number): string =>
{
    return `
    vec4 color = u_mediump[${index}];
    blur = color * blur.a;
`;
};

const STATEMENT_GLOW_GRADIENT_COLOR = (transforms_base: boolean): string =>
{
    return `
    blur = texture(u_textures[${transforms_base ? 2 : 1}], vec2(blur.a, 0.5));
`;
};

const STATEMENT_GLOW = (
    is_inner: boolean,
    transforms_base: boolean,
    applies_strength: boolean,
    is_gradient: boolean,
    color_index: number,
    strength_offset: number
): string => {

    const innerStatement = is_inner
        ? "blur.a = 1.0 - blur.a;"
        : "";

    const strengthStatement = applies_strength
        ? STATEMENT_GLOW_STRENGTH(strength_offset)
        : "";

    const colorStatement = is_gradient
        ? STATEMENT_GLOW_GRADIENT_COLOR(transforms_base)
        : STATEMENT_GLOW_SOLID_COLOR(color_index);

    return `
    ${innerStatement}
    ${strengthStatement}
    ${colorStatement}
`;
};

const STATEMENT_BLUR_TEXTURE_2 = (): string =>
{
    return `
    vec4 blur2 = texture(u_textures[0], 1.0 - v_coord);
`;
};

const STATEMENT_BLUR_TEXTURE_TRANSFORM_2 = (): string =>
{
    return `
    vec2 pq = (1.0 - v_coord) * blur_scale - blur_offset;
    vec4 blur2 = mix(vec4(0.0), texture(u_textures[0], pq), isInside(pq));
`;
};

const STATEMENT_BEVEL_STRENGTH = (offset: number): string =>
{
    const index     = Math.floor(offset / 4);
    const component = offset % 4;

    return `
    float strength = u_mediump[${index}][${component}];
    highlight_alpha *= strength;
    shadow_alpha    *= strength;
`;
};

const STATEMENT_BEVEL_SOLID_COLOR = (index: number): string =>
{
    return `
    vec4 highlight_color = u_mediump[${index}];
    vec4 shadow_color    = u_mediump[${index + 1}];
    blur = highlight_color * highlight_alpha + shadow_color * shadow_alpha;
`;
};

const STATEMENT_BEVEL_GRADIENT_COLOR = (transforms_base: boolean): string =>
{
    return `
    blur = texture(u_textures[${transforms_base ? 2 : 1}], vec2(
        0.5019607843137255 - 0.5019607843137255 * shadow_alpha + 0.4980392156862745 * highlight_alpha,
        0.5
    ));
`;
};

export const BITMAP_FILTER_TEMPLATE = (
    textures_length: number,
    mediump_length: number,
    transforms_base: boolean,
    transforms_blur: boolean,
    is_glow: boolean,
    type: string,
    knockout: boolean,
    applies_strength: boolean,
    is_gradient: boolean
): string => {

    let index = 0;

    const baseStatement = transforms_base
        ? STATEMENT_BASE_TEXTURE_TRANSFORM(index++)
        : "";

    const blurStatement = transforms_blur
        ? STATEMENT_BLUR_TEXTURE_TRANSFORM(index++)
        : STATEMENT_BLUR_TEXTURE();

    const isInner = type === "inner";

    const colorIndex   = index;
    let strengthOffset = index * 4;
    let colorStatement;

    if (is_gradient) {

        colorStatement = is_glow
            ? STATEMENT_GLOW(false, transforms_base, applies_strength, is_gradient, colorIndex, strengthOffset)
            : STATEMENT_BEVEL(transforms_base, transforms_blur, applies_strength, is_gradient, colorIndex, strengthOffset);

    } else if (is_glow) {

        strengthOffset += 4;
        colorStatement = STATEMENT_GLOW(isInner, transforms_base, applies_strength, is_gradient, colorIndex, strengthOffset);

    } else {

        strengthOffset += 8;
        colorStatement = STATEMENT_BEVEL(transforms_base, transforms_blur, applies_strength, is_gradient, colorIndex, strengthOffset);

    }

    let modeExpression;
    switch (type) {

        case "outer":
            modeExpression = knockout
                ? "blur - blur * base.a"
                : "base + blur - blur * base.a";
            break;

        case "full":
            modeExpression = knockout
                ? "blur"
                : "base - base * blur.a + blur";
            break;

        case "inner":
        default:
            modeExpression = "blur";
            break;

    }

    return `#version 300 es
precision mediump float;

uniform sampler2D u_textures[${textures_length}];
uniform vec4 u_mediump[${mediump_length}];

in vec2 v_coord;
out vec4 o_color;

${FUNCTION_IS_INSIDE()}

void main() {
    ${baseStatement}
    ${blurStatement}
    ${colorStatement}
    o_color = ${modeExpression};
}`;
};

const STATEMENT_BEVEL = (
    transforms_base: boolean,
    transforms_blur: boolean,
    applies_strength: boolean,
    is_gradient: boolean,
    color_index: number,
    strength_offset: number
): string => {

    const blur2Statement = transforms_blur
        ? STATEMENT_BLUR_TEXTURE_TRANSFORM_2()
        : STATEMENT_BLUR_TEXTURE_2();

    const strengthStatement = applies_strength
        ? STATEMENT_BEVEL_STRENGTH(strength_offset)
        : "";

    const colorStatement = is_gradient
        ? STATEMENT_BEVEL_GRADIENT_COLOR(transforms_base)
        : STATEMENT_BEVEL_SOLID_COLOR(color_index);

    return `
    ${blur2Statement}
    float highlight_alpha = blur.a - blur2.a;
    float shadow_alpha    = blur2.a - blur.a;
    ${strengthStatement}
    highlight_alpha = clamp(highlight_alpha, 0.0, 1.0);
    shadow_alpha    = clamp(shadow_alpha, 0.0, 1.0);
    ${colorStatement}
`;
};
