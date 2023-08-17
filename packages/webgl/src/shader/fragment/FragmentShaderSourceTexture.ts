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
     * @return {string}
     * @method
     * @static
     */
    static INSTANCE_TEMPLATE (): string
    {
        return `#version 300 es
precision mediump float;

uniform sampler2D u_texture;

in vec4 mul;
in vec4 add;
in vec2 v_coord;
out vec4 o_color;

void main() {
    vec4 src = texture(u_texture, v_coord);

    if (mul.x != 1.0 || mul.y != 1.0 || mul.z != 1.0 || mul.w != 1.0
        || add.x != 0.0 || add.y != 0.0 || add.z != 0.0 || add.w != 0.0
    ) {
        src.rgb /= max(0.0001, src.a);
        src = clamp(src * mul + add, 0.0, 1.0);
        src.rgb *= src.a;
    }
    
    o_color = src;
}

`;
    }
}