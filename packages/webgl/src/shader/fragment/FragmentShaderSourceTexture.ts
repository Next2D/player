import { FragmentShaderLibrary } from "./FragmentShaderLibrary";

/**
 * @class
 */
export class FragmentShaderSourceTexture
{
    /**
     * @param  {boolean} with_color_transform
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (with_color_transform: boolean): string
    {
        const colorTransformUniform: string = with_color_transform
            ? "uniform vec4 u_mediump[2];"
            : "";

        const colorTransformStatement: string = with_color_transform
            ? FragmentShaderLibrary.STATEMENT_COLOR_TRANSFORM_ON(0)
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
}

`;
    }

    /**
     * @param  {boolean} with_color_transform
     * @return {string}
     * @method
     * @static
     */
    static INSTANCE_TEMPLATE (with_color_transform: boolean): string
    {
        const colorTransformUniform: string = with_color_transform
            ? `
in vec4 mul;
in vec4 add;`
            : "";

        const colorTransformStatement: string = with_color_transform
            ? FragmentShaderLibrary.STATEMENT_INSTANCED_COLOR_TRANSFORM_ON()
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
}

`;
    }
}