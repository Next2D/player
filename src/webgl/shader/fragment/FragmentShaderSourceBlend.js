/**
 * @class
 */
class FragmentShaderSourceBlend
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @param  {string}  operation
     * @param  {boolean} withColorTransform
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (k, operation, withColorTransform)
    {
        let blendFunction;
        switch (operation) {
            case BlendMode.SUBTRACT:
                blendFunction = this.FUNCTION_SUBTRACT();
                break;
            case BlendMode.MULTIPLY:
                blendFunction = this.FUNCTION_MULTIPLY();
                break;
            case BlendMode.LIGHTEN:
                blendFunction = this.FUNCTION_LIGHTEN();
                break;
            case BlendMode.DARKEN:
                blendFunction = this.FUNCTION_DARKEN();
                break;
            case BlendMode.OVERLAY:
                blendFunction = this.FUNCTION_OVERLAY();
                break;
            case BlendMode.HARDLIGHT:
                blendFunction = this.FUNCTION_HARDLIGHT();
                break;
            case BlendMode.DIFFERENCE:
                blendFunction = this.FUNCTION_DIFFERENCE();
                break;
            case BlendMode.INVERT:
                blendFunction = this.FUNCTION_INVERT();
                break;
            default:
                blendFunction = this.FUNCTION_NORMAL();
                break;
        }

        const colorTransformUniform = (withColorTransform)
            ? `uniform vec4 u_mediump[2];`
            : "";
        const colorTransformStatement = (withColorTransform)
            ? FragmentShaderLibrary.STATEMENT_COLOR_TRANSFORM_ON(0)
            : "";

        return `${k.version()}
precision mediump float;

uniform sampler2D u_textures[2];
${colorTransformUniform}

${k.varyingIn()} vec2 v_coord;
${k.outColor()}

${blendFunction}

void main() {
    vec4 dst = ${k.texture2D()}(u_textures[0], v_coord);
    vec4 src = ${k.texture2D()}(u_textures[1], v_coord);
    ${colorTransformStatement}
    ${k.fragColor()} = blend(src, dst);
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static FUNCTION_NORMAL ()
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
    static FUNCTION_SUBTRACT ()
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
    static FUNCTION_MULTIPLY ()
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
    static FUNCTION_LIGHTEN ()
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
    static FUNCTION_DARKEN ()
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
    static FUNCTION_OVERLAY ()
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
    static FUNCTION_HARDLIGHT ()
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
    static FUNCTION_DIFFERENCE ()
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
    static FUNCTION_INVERT ()
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
