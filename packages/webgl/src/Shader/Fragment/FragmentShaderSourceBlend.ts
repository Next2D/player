import { STATEMENT_COLOR_TRANSFORM_ON } from "./FragmentShaderLibrary";

const FUNCTION_NORMAL = (): string =>
{
    return `
vec4 blend (in vec4 src, in vec4 dst) {
    return src + dst - dst * src.a;
}`;
};

const FUNCTION_SUBTRACT = (): string =>
{
    return `
vec4 blend (in vec4 src, in vec4 dst) {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }

    vec4 a = src - src * dst.a;
    vec4 b = dst - dst * src.a;

    src.rgb /= src.a;
    dst.rgb /= dst.a;

    vec4 c = vec4(dst.rgb - src.rgb, src.a * dst.a);
    c.rgb *= c.a;

    return a + b + c;
}`;
};

const FUNCTION_MULTIPLY = (): string =>
{
    return `
vec4 blend (in vec4 src, in vec4 dst) {
    vec4 a = src - src * dst.a;
    vec4 b = dst - dst * src.a;
    vec4 c = src * dst;

    return a + b + c;
}`;
};

const FUNCTION_LIGHTEN = (): string =>
{
    return `
vec4 blend (in vec4 src, in vec4 dst) {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }

    vec4 a = src - src * dst.a;
    vec4 b = dst - dst * src.a;

    src.rgb /= src.a;
    dst.rgb /= dst.a;

    vec4 c = vec4(mix(src.rgb, dst.rgb, step(src.rgb, dst.rgb)), src.a * dst.a);
    c.rgb *= c.a;

    return a + b + c;
}`;
};

const FUNCTION_DARKEN = (): string =>
{
    return `
vec4 blend (in vec4 src, in vec4 dst) {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }

    vec4 a = src - src * dst.a;
    vec4 b = dst - dst * src.a;

    src.rgb /= src.a;
    dst.rgb /= dst.a;

    vec4 c = vec4(mix(src.rgb, dst.rgb, step(dst.rgb, src.rgb)), src.a * dst.a);
    c.rgb *= c.a;

    return a + b + c;
}`;
};

const FUNCTION_OVERLAY = (): string =>
{
    return `
vec4 blend (in vec4 src, in vec4 dst) {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }

    vec4 a = src - src * dst.a;
    vec4 b = dst - dst * src.a;

    src.rgb /= src.a;
    dst.rgb /= dst.a;

    vec4 mul = src * dst;
    vec3 c1 = 2.0 * mul.rgb;
    vec3 c2 = 2.0 * (src.rgb + dst.rgb - mul.rgb) - 1.0;
    vec4 c = vec4(mix(c1, c2, step(vec3(0.5), dst.rgb)), mul.a);
    c.rgb *= c.a;

    return a + b + c;
}`;
};

const FUNCTION_HARDLIGHT = (): string =>
{
    return `
vec4 blend (in vec4 src, in vec4 dst) {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }

    vec4 a = src - src * dst.a;
    vec4 b = dst - dst * src.a;

    src.rgb /= src.a;
    dst.rgb /= dst.a;

    vec4 mul = src * dst;
    vec3 c1 = 2.0 * mul.rgb;
    vec3 c2 = 2.0 * (src.rgb + dst.rgb - mul.rgb) - 1.0;
    vec4 c = vec4(mix(c1, c2, step(vec3(0.5), src.rgb)), mul.a);
    c.rgb *= c.a;

    return a + b + c;
}`;
};

const FUNCTION_DIFFERENCE = (): string =>
{
    return `
vec4 blend (in vec4 src, in vec4 dst) {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }

    vec4 a = src - src * dst.a;
    vec4 b = dst - dst * src.a;

    src.rgb /= src.a;
    dst.rgb /= dst.a;

    vec4 c = vec4(abs(src.rgb - dst.rgb), src.a * dst.a);
    c.rgb *= c.a;

    return a + b + c;
}`;
};

const FUNCTION_INVERT = (): string =>
{
    return `
vec4 blend (in vec4 src, in vec4 dst) {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }

    vec4 b = dst - dst * src.a;
    vec4 c = vec4(src.a - dst.rgb * src.a, src.a);

    return b + c;
}`;
};

export const BLEND_TEMPLATE = (operation: string, with_color_transform: boolean): string =>
{
    let blendFunction: string;
    switch (operation) {

        case "subtract":
            blendFunction = FUNCTION_SUBTRACT();
            break;

        case "multiply":
            blendFunction = FUNCTION_MULTIPLY();
            break;

        case "lighten":
            blendFunction = FUNCTION_LIGHTEN();
            break;

        case "darken":
            blendFunction = FUNCTION_DARKEN();
            break;

        case "overlay":
            blendFunction = FUNCTION_OVERLAY();
            break;

        case "hardlight":
            blendFunction = FUNCTION_HARDLIGHT();
            break;

        case "difference":
            blendFunction = FUNCTION_DIFFERENCE();
            break;

        case "invert":
            blendFunction = FUNCTION_INVERT();
            break;

        default:
            blendFunction = FUNCTION_NORMAL();
            break;

    }

    const colorTransformUniform = with_color_transform
        ? "uniform vec4 u_mediump[2];"
        : "";

    const colorTransformStatement = with_color_transform
        ? STATEMENT_COLOR_TRANSFORM_ON(0)
        : "";

    return `#version 300 es
precision mediump float;

uniform sampler2D u_textures[2];
${colorTransformUniform}

in vec2 v_coord;
out vec4 o_color;

${blendFunction}

void main() {
    vec4 dst = texture(u_textures[0], v_coord);
    vec4 src = texture(u_textures[1], v_coord);
    ${colorTransformStatement}
    o_color = blend(src, dst);
}`;
};
