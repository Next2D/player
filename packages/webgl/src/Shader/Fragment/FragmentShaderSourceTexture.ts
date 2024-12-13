import { STATEMENT_COLOR_TRANSFORM_ON } from "./FragmentShaderLibrary";

/**
 * @param  {boolean} with_color_transform
 * @return {string}
 * @method
 * @static
 */
export const TEXTURE = (with_color_transform: boolean): string =>
{
    const colorTransformUniform: string = with_color_transform
        ? "uniform vec4 u_mediump[2];"
        : "";

    const colorTransformStatement: string = with_color_transform
        ? STATEMENT_COLOR_TRANSFORM_ON(0)
        : "";

    return `#version 300 es
precision mediump float;

uniform sampler2D u_texture;
${colorTransformUniform}

in vec2 v_coord;
out vec4 o_color;

void main() {
    vec4 src = texture(u_texture, v_coord);
    ${colorTransformStatement}
    o_color = src;
}`;
};

/**
 * @return {string}
 * @method
 * @static
 */
export const INSTANCE_TEXTURE = (): string =>
{
    return `#version 300 es
precision mediump float;

uniform sampler2D u_texture;

in vec4 v_mul;
in vec4 v_add;
in vec2 v_coord;
out vec4 o_color;

void main() {
    vec4 src = texture(u_texture, v_coord);

    if (v_mul.x != 1.0 || v_mul.y != 1.0 || v_mul.z != 1.0 || v_mul.w != 1.0
        || v_add.x != 0.0 || v_add.y != 0.0 || v_add.z != 0.0 || v_add.w != 0.0
    ) {
        src.rgb /= max(0.0001, src.a);
        src = clamp(src * v_mul + v_add, 0.0, 1.0);
        src.rgb *= src.a;
    }
    
    o_color = src;
}`;
};