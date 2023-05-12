/**
 * @class
 */
class FragmentShaderSource
{
    /**
     * @return {string}
     * @method
     * @static
     */
    static SOLID_COLOR ()
    {
        return `#version 300 es
precision mediump float;

uniform vec4 u_mediump;

out vec4 o_color;

void main() {
    o_color = vec4(u_mediump.rgb * u_mediump.a, u_mediump.a);
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static BITMAP_CLIPPED ()
    {
        return `#version 300 es
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_mediump[3];

in vec2 v_uv;
out vec4 o_color;

void main() {
    vec2 uv = vec2(v_uv.x, u_mediump[0].y - v_uv.y) / u_mediump[0].xy;

    vec4 src = texture(u_texture, uv);
    ${FragmentShaderLibrary.STATEMENT_COLOR_TRANSFORM_ON(1)}
    o_color = src;
}`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static BITMAP_PATTERN ()
    {
        return `#version 300 es
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_mediump[3];

in vec2 v_uv;
out vec4 o_color;

void main() {
    vec2 uv = fract(vec2(v_uv.x, -v_uv.y) / u_mediump[0].xy);
    
    vec4 src = texture(u_texture, uv);
    ${FragmentShaderLibrary.STATEMENT_COLOR_TRANSFORM_ON(1)}
    o_color = src;
}`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static MASK ()
    {
        return `#version 300 es
precision mediump float;

in vec2 v_bezier;
out vec4 o_color;

void main() {
    vec2 px = dFdx(v_bezier);
    vec2 py = dFdy(v_bezier);

    vec2 f = (2.0 * v_bezier.x) * vec2(px.x, py.x) - vec2(px.y, py.y);
    float alpha = 0.5 - (v_bezier.x * v_bezier.x - v_bezier.y) / length(f);

    if (alpha > 0.0) {
        o_color = vec4(min(alpha, 1.0));
    } else {
        discard;
    }    
}

`;
    }
}