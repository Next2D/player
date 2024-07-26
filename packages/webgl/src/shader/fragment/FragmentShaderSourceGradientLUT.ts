/**
 * @class
 */
export class FragmentShaderSourceGradientLUT
{
    /**
     * @param  {number}  mediump_length
     * @param  {number}  stops_length
     * @param  {boolean} is_linear_space
     * @return {string}
     * @method
     * @static
     */
    static TEMPLATE (
        mediump_length: number,
        stops_length: number,
        is_linear_space: boolean
    ): string {

        let loopStatement: string = "";
        for (let i: number = 1; i < stops_length; i++) {

            const i0: number = i - 1;
            const i1: number = i;
            const t0: string = `u_mediump[${stops_length + Math.floor(i0 / 4)}][${i0 % 4}]`;
            const t1: string = `u_mediump[${stops_length + Math.floor(i1 / 4)}][${i1 % 4}]`;
            const c0: string = `u_mediump[${i0}]`;
            const c1: string = `u_mediump[${i1}]`;

            loopStatement += `
    if (t <= ${t1}) {
        return mix(${c0}, ${c1}, (t - ${t0}) / (${t1} - ${t0}));
    }
`;
        }

        const colorSpaceStatement: string = is_linear_space
            ? "color = pow(color, vec4(0.45454545));"
            : "";

        return `#version 300 es
precision mediump float;

uniform vec4 u_mediump[${mediump_length}];

in vec2 v_coord;
out vec4 o_color;

vec4 getGradientColor(in float t) {
    if (t <= u_mediump[${stops_length}][0]) {
        return u_mediump[0];
    }
    ${loopStatement}
    return u_mediump[${stops_length - 1}];
}

void main() {
    vec4 color = getGradientColor(v_coord.x);
    ${colorSpaceStatement}
    color.rgb *= color.a;

    o_color = color;
}

`;
    }
}