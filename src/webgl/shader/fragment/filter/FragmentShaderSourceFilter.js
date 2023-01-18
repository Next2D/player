/**
 * @class
 */
class FragmentShaderSourceFilter
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @param  {number}  textures_length
     * @param  {number}  mediump_length
     * @param  {boolean} transforms_base
     * @param  {boolean} transforms_blur
     * @param  {boolean} isGlow
     * @param  {string}  type
     * @param  {boolean} knockout
     * @param  {boolean} applies_strength
     * @param  {boolean} is_gradient
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (
        k, textures_length, mediump_length,
        transforms_base, transforms_blur,
        isGlow, type, knockout,
        applies_strength, is_gradient
    ) {
        let index = 0;

        const baseStatement = transforms_base
            ? this.STATEMENT_BASE_TEXTURE_TRANSFORM(k, index++)
            : "";
        const blurStatement = transforms_blur
            ? this.STATEMENT_BLUR_TEXTURE_TRANSFORM(k, index++)
            : this.STATEMENT_BLUR_TEXTURE(k);
        const isInner = type === BitmapFilterType.INNER;

        const colorIndex = index;
        let strengthOffset = index * 4;
        let colorStatement;
        if (is_gradient) {
            colorStatement = isGlow
                ? this.STATEMENT_GLOW(k, false, transforms_base, applies_strength, is_gradient, colorIndex, strengthOffset)
                : this.STATEMENT_BEVEL(k, transforms_base, transforms_blur, applies_strength, is_gradient, colorIndex, strengthOffset);
        } else if (isGlow) {
            strengthOffset += 4;
            colorStatement = this.STATEMENT_GLOW(k, isInner, transforms_base, applies_strength, is_gradient, colorIndex, strengthOffset);
        } else {
            strengthOffset += 8;
            colorStatement = this.STATEMENT_BEVEL(k, transforms_base, transforms_blur, applies_strength, is_gradient, colorIndex, strengthOffset);
        }

        let modeExpression;
        switch (type) {
            case BitmapFilterType.OUTER:
                modeExpression = knockout
                    ? "blur - blur * base.a"
                    : "base + blur - blur * base.a";
                break;
            case BitmapFilterType.FULL:
                modeExpression = knockout
                    ? "blur"
                    : "base - base * blur.a + blur";
                break;
            case BitmapFilterType.INNER:
            default:
                modeExpression = "blur";
                break;
        }

        return `${k.version()}
precision mediump float;

uniform sampler2D u_textures[${textures_length}];
uniform vec4 u_mediump[${mediump_length}];

${k.varyingIn()} vec2 v_coord;
${k.outColor()}

${FragmentShaderLibrary.FUNCTION_IS_INSIDE()}

void main() {
    ${baseStatement}
    ${blurStatement}
    ${colorStatement}
    ${k.fragColor()} = ${modeExpression};
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BASE_TEXTURE_TRANSFORM (k, index)
    {
        return `
    vec2 base_scale  = u_mediump[${index}].xy;
    vec2 base_offset = u_mediump[${index}].zw;

    vec2 uv = v_coord * base_scale - base_offset;
    vec4 base = mix(vec4(0.0), ${k.texture2D()}(u_textures[1], uv), isInside(uv));
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BLUR_TEXTURE (k)
    {
        return `
    vec4 blur = ${k.texture2D()}(u_textures[0], v_coord);
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BLUR_TEXTURE_TRANSFORM (k, index)
    {
        return `
    vec2 blur_scale  = u_mediump[${index}].xy;
    vec2 blur_offset = u_mediump[${index}].zw;

    vec2 st = v_coord * blur_scale - blur_offset;
    vec4 blur = mix(vec4(0.0), ${k.texture2D()}(u_textures[0], st), isInside(st));
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_GLOW (k, isInner, transforms_base, applies_strength, is_gradient, colorIndex, strengthOffset)
    {
        const innerStatement = isInner
            ? "blur.a = 1.0 - blur.a;"
            : "";
        const strengthStatement = applies_strength
            ? this.STATEMENT_GLOW_STRENGTH(strengthOffset)
            : "";
        const colorStatement = is_gradient
            ? this.STATEMENT_GLOW_GRADIENT_COLOR(k, transforms_base)
            : this.STATEMENT_GLOW_SOLID_COLOR(colorIndex);

        return `
    ${innerStatement}
    ${strengthStatement}
    ${colorStatement}
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_GLOW_STRENGTH (offset)
    {
        const index     = $Math.floor(offset / 4);
        const component = offset % 4;
        return `
    float strength = u_mediump[${index}][${component}];
    blur.a = clamp(blur.a * strength, 0.0, 1.0);
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_GLOW_SOLID_COLOR (index)
    {
        return `
    vec4 color = u_mediump[${index}];
    blur = color * blur.a;
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_GLOW_GRADIENT_COLOR (k, transforms_base)
    {
        const unit = transforms_base ? 2 : 1;

        return `
    blur = ${k.texture2D()}(u_textures[${unit}], vec2(blur.a, 0.5));
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BEVEL (k, transforms_base, transforms_blur, applies_strength, is_gradient, colorIndex, strengthOffset)
    {
        const blur2Statement = transforms_blur
            ? this.STATEMENT_BLUR_TEXTURE_TRANSFORM_2(k)
            : this.STATEMENT_BLUR_TEXTURE_2(k);
        const strengthStatement = applies_strength
            ? this.STATEMENT_BEVEL_STRENGTH(strengthOffset)
            : "";
        const colorStatement = is_gradient
            ? this.STATEMENT_BEVEL_GRADIENT_COLOR(k, transforms_base)
            : this.STATEMENT_BEVEL_SOLID_COLOR(colorIndex);

        return `
    ${blur2Statement}
    float highlight_alpha = blur.a - blur2.a;
    float shadow_alpha    = blur2.a - blur.a;
    ${strengthStatement}
    highlight_alpha = clamp(highlight_alpha, 0.0, 1.0);
    shadow_alpha    = clamp(shadow_alpha, 0.0, 1.0);
    ${colorStatement}
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BLUR_TEXTURE_2 (k)
    {
        return `
    vec4 blur2 = ${k.texture2D()}(u_textures[0], 1.0 - v_coord);
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BLUR_TEXTURE_TRANSFORM_2 (k)
    {
        return `
    vec2 pq = (1.0 - v_coord) * blur_scale - blur_offset;
    vec4 blur2 = mix(vec4(0.0), ${k.texture2D()}(u_textures[0], pq), isInside(pq));
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BEVEL_STRENGTH (offset)
    {
        const index     = $Math.floor(offset / 4);
        const component = offset % 4;
        return `
    float strength = u_mediump[${index}][${component}];
    highlight_alpha *= strength;
    shadow_alpha    *= strength;
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BEVEL_SOLID_COLOR (index)
    {
        return `
    vec4 highlight_color = u_mediump[${index}];
    vec4 shadow_color    = u_mediump[${index + 1}];
    blur = highlight_color * highlight_alpha + shadow_color * shadow_alpha;
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BEVEL_GRADIENT_COLOR (k, transforms_base)
    {
        const unit = transforms_base ? 2 : 1;

        return `
    blur = ${k.texture2D()}(u_textures[${unit}], vec2(
        0.5019607843137255 - 0.5019607843137255 * shadow_alpha + 0.4980392156862745 * highlight_alpha,
        0.5
    ));
`;
    }
}
