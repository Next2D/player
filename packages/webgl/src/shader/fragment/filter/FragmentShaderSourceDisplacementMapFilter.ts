import { FragmentShaderLibrary } from "../FragmentShaderLibrary";

/**
 * @class
 */
export class FragmentShaderSourceDisplacementMapFilter
{
    /**
     * @param  {number} mediump_length
     * @param  {number} component_x
     * @param  {number} component_y
     * @param  {string} mode
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (
        mediump_length: number,
        component_x: number, component_y: number,
        mode: string
    ): string {

        let cx: string;
        let cy: string;
        let modeStatement: string;

        switch (component_x) {

            case 1: // BitmapDataChannel.RED
                cx = "map_color.r";
                break;

            case 2: // BitmapDataChannel.GREEN
                cx = "map_color.g";
                break;

            case 4: // BitmapDataChannel.BLUE
                cx = "map_color.b";
                break;

            case 8: // BitmapDataChannel.ALPHA
                cx = "map_color.a";
                break;

            default:
                cx = "0.5";
                break;

        }

        switch (component_y) {

            case 1: // BitmapDataChannel.RED
                cy = "map_color.r";
                break;

            case 2: // BitmapDataChannel.GREEN
                cy = "map_color.g";
                break;

            case 4: // BitmapDataChannel.BLUE
                cy = "map_color.b";
                break;

            case 8: // BitmapDataChannel.ALPHA
                cy = "map_color.a";
                break;

            default:
                cy = "0.5";
                break;

        }

        switch (mode) {

            case "clamp":
                modeStatement = `
    vec4 source_color = texture(u_textures[0], uv);
`;
                break;

            case "ignore":
                // 置き換え後の座標が範囲外なら、置き換え前の座標をとる（x軸とy軸を別々に判定する）
                modeStatement = `
    vec4 source_color =texture(u_textures[0], mix(v_coord, uv, step(abs(uv - vec2(0.5)), vec2(0.5))));
`;
                break;

            case "color":
                modeStatement = `
    vec4 substitute_color = u_mediump[2];
    vec4 source_color = mix(substitute_color, texture(u_textures[0], uv), isInside(uv));
`;
                break;

            case "wrap":
            default:
                modeStatement = `
    vec4 source_color = texture(u_textures[0], fract(uv));
`;
                break;
        }

        return `#version 300 es
precision mediump float;

uniform sampler2D u_textures[2];
uniform vec4 u_mediump[${mediump_length}];

in vec2 v_coord;
out vec4 o_color;

${FragmentShaderLibrary.FUNCTION_IS_INSIDE()}

void main() {
    vec2 uv_to_st_scale  = u_mediump[0].xy;
    vec2 uv_to_st_offset = u_mediump[0].zw;
    vec2 scale           = u_mediump[1].xy;

    vec2 st = v_coord * uv_to_st_scale - uv_to_st_offset;
    vec4 map_color = texture(u_textures[1], st);

    vec2 offset = vec2(${cx}, ${cy}) - 0.5;
    vec2 uv = v_coord + offset * scale;
    ${modeStatement}

    o_color = mix(texture(u_textures[0], v_coord), source_color, isInside(st));
}`;
    }
}
