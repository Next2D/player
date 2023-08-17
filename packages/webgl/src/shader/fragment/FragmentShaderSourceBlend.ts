import { FragmentShaderLibrary } from "./FragmentShaderLibrary";

/**
 * @class
 */
export class FragmentShaderSourceBlend
{
    /**
     * @param  {string}  operation
     * @param  {boolean} with_color_transform
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (operation: string, with_color_transform: boolean): string
    {
        let blendFunction: string;
        switch (operation) {

            case "subtract":
                blendFunction = this.FUNCTION_SUBTRACT();
                break;

            case "multiply":
                blendFunction = this.FUNCTION_MULTIPLY();
                break;

            case "lighten":
                blendFunction = this.FUNCTION_LIGHTEN();
                break;

            case "darken":
                blendFunction = this.FUNCTION_DARKEN();
                break;

            case "overlay":
                blendFunction = this.FUNCTION_OVERLAY();
                break;

            case "hardlight":
                blendFunction = this.FUNCTION_HARDLIGHT();
                break;

            case "difference":
                blendFunction = this.FUNCTION_DIFFERENCE();
                break;

            case "invert":
                blendFunction = this.FUNCTION_INVERT();
                break;

            default:
                blendFunction = this.FUNCTION_NORMAL();
                break;

        }

        const colorTransformUniform: string = with_color_transform
            ? "uniform vec4 u_mediump[2];"
            : "";

        const colorTransformStatement: string = with_color_transform
            ? FragmentShaderLibrary.STATEMENT_COLOR_TRANSFORM_ON(0)
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
}

`;
    }

    /**
     * @param  {string}  operation
     * @param  {boolean} with_color_transform
     * @return {string}
     * @method
     * @static
     */
    static INSTANCE_TEMPLATE (operation: string, with_color_transform: boolean): string
    {
        let blendFunction: string;
        switch (operation) {

            case "subtract":
                blendFunction = this.FUNCTION_SUBTRACT();
                break;

            case "multiply":
                blendFunction = this.FUNCTION_MULTIPLY();
                break;

            case "lighten":
                blendFunction = this.FUNCTION_LIGHTEN();
                break;

            case "darken":
                blendFunction = this.FUNCTION_DARKEN();
                break;

            case "overlay":
                blendFunction = this.FUNCTION_OVERLAY();
                break;

            case "hardlight":
                blendFunction = this.FUNCTION_HARDLIGHT();
                break;

            case "difference":
                blendFunction = this.FUNCTION_DIFFERENCE();
                break;

            case "invert":
                blendFunction = this.FUNCTION_INVERT();
                break;

            default:
                blendFunction = this.FUNCTION_NORMAL();
                break;

        }

        const colorTransformUniform: string = with_color_transform
            ? "uniform vec4 u_mediump[2];"
            : "";

        const colorTransformStatement: string = with_color_transform
            ? FragmentShaderLibrary.STATEMENT_COLOR_TRANSFORM_ON(0)
            : "";

        return `#version 300 es
precision mediump float;

uniform sampler2D u_textures[2];
${colorTransformUniform}

in vec2 v_src_coord;
in vec2 v_dst_coord;
out vec4 o_color;

${blendFunction}

void main() {
    vec4 dst = texture(u_textures[0], v_dst_coord);
    vec4 src = texture(u_textures[1], v_src_coord);
    ${colorTransformStatement}
    o_color = blend(src, dst);
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_NORMAL (): string
    {
        return `

vec4 blend (in vec4 src, in vec4 dst) {
    return src + dst - dst * src.a;
}

`;
    }

    // 各ブレンド式は、前景と背景の両方のアルファを考慮する必要がある
    // https://odashi.hatenablog.com/entry/20110921/1316610121
    // https://hakuhin.jp/as3/blend.html
    //
    // [基本計算式]
    // ・色(rgb)はストレートアルファ
    // ・アルファ(a)が0の場合は例外処理をする
    // 前景色 a: src.rgb * (src.a * (1.0 - dst.a))
    // 背景色 b: dst.rgb * (dst.a * (1.0 - src.a))
    // 合成色 c: mix.rgb * (src.a * dst.a)
    // 最終結果: a + b + c

    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_SUBTRACT (): string
    {
        // [合成色計算式]
        // dst - src
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
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_MULTIPLY (): string
    {
        // [合成色計算式]
        // src * dst
        return `

vec4 blend (in vec4 src, in vec4 dst) {
    vec4 a = src - src * dst.a;
    vec4 b = dst - dst * src.a;
    vec4 c = src * dst;

    return a + b + c;
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_LIGHTEN (): string
    {
        // [合成色計算式]
        // (src > dst) ? src : dst
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
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_DARKEN (): string
    {
        // [合成色計算式]
        // (src < dst) ? src : dst
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
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_OVERLAY (): string
    {
        // [合成色計算式]
        // if (dst < 0.5) {
        //     return 2.0 * src * dst
        // } else {
        //     return 1.0 - 2.0 * (1.0 - src) * (1.0 - dst)
        // }
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
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_HARDLIGHT (): string
    {
        // [合成色計算式]
        // if (src < 0.5) {
        //     return 2.0 * src * dst
        // } else {
        //     return 1.0 - 2.0 * (1.0 - src) * (1.0 - dst)
        // }
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
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_DIFFERENCE (): string
    {
        // [合成色計算式]
        // abs(src - dst)
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
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_INVERT (): string
    {
        // [基本計算式]
        // ((1.0 - dst) * src.a) + (dst * (1.0 - src.a))
        return `

vec4 blend (in vec4 src, in vec4 dst) {
    if (src.a == 0.0) { return dst; }
    if (dst.a == 0.0) { return src; }

    vec4 b = dst - dst * src.a;
    vec4 c = vec4(src.a - dst.rgb * src.a, src.a);

    return b + c;
}

`;
    }
}