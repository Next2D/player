import { $Math } from "@next2d/share";
import { FragmentShaderLibrary } from "../FragmentShaderLibrary";

/**
 * @class
 */
export class FragmentShaderSourceFilter
{
    /**
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
        textures_length: number, mediump_length: number,
        transforms_base: boolean, transforms_blur: boolean,
        isGlow: boolean, type: string, knockout: boolean,
        applies_strength: boolean, is_gradient: boolean
    ): string {

        let index: number = 0;

        const baseStatement: string = transforms_base
            ? this.STATEMENT_BASE_TEXTURE_TRANSFORM(index++)
            : "";

        const blurStatement: string = transforms_blur
            ? this.STATEMENT_BLUR_TEXTURE_TRANSFORM(index++)
            : this.STATEMENT_BLUR_TEXTURE();

        const isInner: boolean = type === "inner";

        const colorIndex: number   = index;
        let strengthOffset: number = index * 4;
        let colorStatement: string;

        if (is_gradient) {

            colorStatement = isGlow
                ? this.STATEMENT_GLOW(false, transforms_base, applies_strength, is_gradient, colorIndex, strengthOffset)
                : this.STATEMENT_BEVEL(transforms_base, transforms_blur, applies_strength, is_gradient, colorIndex, strengthOffset);

        } else if (isGlow) {

            strengthOffset += 4;
            colorStatement = this.STATEMENT_GLOW(isInner, transforms_base, applies_strength, is_gradient, colorIndex, strengthOffset);

        } else {

            strengthOffset += 8;
            colorStatement = this.STATEMENT_BEVEL(transforms_base, transforms_blur, applies_strength, is_gradient, colorIndex, strengthOffset);

        }

        let modeExpression: string;
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

${FragmentShaderLibrary.FUNCTION_IS_INSIDE()}

void main() {
    ${baseStatement}
    ${blurStatement}
    ${colorStatement}
    o_color = ${modeExpression};
}

`;
    }

    /**
     * @param  {number} index
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BASE_TEXTURE_TRANSFORM (index :number): string
    {
        return `
    vec2 base_scale  = u_mediump[${index}].xy;
    vec2 base_offset = u_mediump[${index}].zw;

    vec2 uv = v_coord * base_scale - base_offset;
    vec4 base = mix(vec4(0.0), texture(u_textures[1], uv), isInside(uv));
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BLUR_TEXTURE (): string
    {
        return `
    vec4 blur = texture(u_textures[0], v_coord);
`;
    }

    /**
     * @param  {number} index
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BLUR_TEXTURE_TRANSFORM (index: number): string
    {
        return `
    vec2 blur_scale  = u_mediump[${index}].xy;
    vec2 blur_offset = u_mediump[${index}].zw;

    vec2 st = v_coord * blur_scale - blur_offset;
    vec4 blur = mix(vec4(0.0), texture(u_textures[0], st), isInside(st));
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_GLOW (
        is_inner: boolean, transforms_base: boolean, applies_strength: boolean,
        is_gradient: boolean, color_index: number, strength_offset: number
    ): string {

        const innerStatement: string = is_inner
            ? "blur.a = 1.0 - blur.a;"
            : "";

        const strengthStatement: string = applies_strength
            ? this.STATEMENT_GLOW_STRENGTH(strength_offset)
            : "";

        const colorStatement: string = is_gradient
            ? this.STATEMENT_GLOW_GRADIENT_COLOR(transforms_base)
            : this.STATEMENT_GLOW_SOLID_COLOR(color_index);

        return `
    ${innerStatement}
    ${strengthStatement}
    ${colorStatement}
`;
    }

    /**
     * @param  {number} offset
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_GLOW_STRENGTH (offset: number): string
    {
        const index: number     = $Math.floor(offset / 4);
        const component: number = offset % 4;
        return `
    float strength = u_mediump[${index}][${component}];
    blur.a = clamp(blur.a * strength, 0.0, 1.0);
`;
    }

    /**
     * @param  {number} index
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_GLOW_SOLID_COLOR (index: number): string
    {
        return `
    vec4 color = u_mediump[${index}];
    blur = color * blur.a;
`;
    }

    /**
     * @param  {boolean} transforms_base
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_GLOW_GRADIENT_COLOR (transforms_base: boolean): string
    {
        return `
    blur = texture(u_textures[${transforms_base ? 2 : 1}], vec2(blur.a, 0.5));
`;
    }

    /**
     * @param  {string}  transforms_base
     * @param  {boolean} transforms_blur
     * @param  {boolean} applies_strength
     * @param  {boolean} is_gradient
     * @param  {number}  color_index
     * @param  {number}  strength_offset
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BEVEL (
        transforms_base: boolean, transforms_blur: boolean, applies_strength: boolean,
        is_gradient: boolean, color_index: number, strength_offset: number
    ): string {

        const blur2Statement: string = transforms_blur
            ? this.STATEMENT_BLUR_TEXTURE_TRANSFORM_2()
            : this.STATEMENT_BLUR_TEXTURE_2();

        const strengthStatement: string = applies_strength
            ? this.STATEMENT_BEVEL_STRENGTH(strength_offset)
            : "";

        const colorStatement: string = is_gradient
            ? this.STATEMENT_BEVEL_GRADIENT_COLOR(transforms_base)
            : this.STATEMENT_BEVEL_SOLID_COLOR(color_index);

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
    static STATEMENT_BLUR_TEXTURE_2 (): string
    {
        return `
    vec4 blur2 = texture(u_textures[0], 1.0 - v_coord);
`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BLUR_TEXTURE_TRANSFORM_2 (): string
    {
        return `
    vec2 pq = (1.0 - v_coord) * blur_scale - blur_offset;
    vec4 blur2 = mix(vec4(0.0), texture(u_textures[0], pq), isInside(pq));
`;
    }

    /**
     * @param  {boolean} offset
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BEVEL_STRENGTH (offset: number): string
    {
        const index: number     = $Math.floor(offset / 4);
        const component: number = offset % 4;

        return `
    float strength = u_mediump[${index}][${component}];
    highlight_alpha *= strength;
    shadow_alpha    *= strength;
`;
    }

    /**
     * @param  {number} index
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BEVEL_SOLID_COLOR (index: number): string
    {
        return `
    vec4 highlight_color = u_mediump[${index}];
    vec4 shadow_color    = u_mediump[${index + 1}];
    blur = highlight_color * highlight_alpha + shadow_color * shadow_alpha;
`;
    }

    /**
     * @param  {boolean} transforms_base
     * @return {string}
     * @method
     * @static
     */
    static STATEMENT_BEVEL_GRADIENT_COLOR (transforms_base: boolean): string
    {
        return `
    blur = texture(u_textures[${transforms_base ? 2 : 1}], vec2(
        0.5019607843137255 - 0.5019607843137255 * shadow_alpha + 0.4980392156862745 * highlight_alpha,
        0.5
    ));
`;
    }
}
