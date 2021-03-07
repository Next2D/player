/**
 * @class
 */
class FragmentShaderSource
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static SOLID_COLOR (k)
    {
        return `${k.version()}
precision mediump float;

uniform vec4 u_mediump;

${k.outColor()}

void main() {
    ${k.fragColor()} = vec4(u_mediump.rgb * u_mediump.a, u_mediump.a);
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static BITMAP_CLIPPED (k)
    {
        return `${k.version()}
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_mediump[3];

${k.varyingIn()} vec2 v_uv;
${k.outColor()}

void main() {
    vec2 uv = vec2(v_uv.x, u_mediump[0].y - v_uv.y) / u_mediump[0].xy;

    vec4 src = ${k.texture2D()}(u_texture, uv);
    ${FragmentShaderLibrary.STATEMENT_COLOR_TRANSFORM_ON(1)}
    ${k.fragColor()} = src;
}`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static BITMAP_PATTERN (k)
    {
        return `${k.version()}
precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_mediump[3];

${k.varyingIn()} vec2 v_uv;
${k.outColor()}

void main() {
    vec2 uv = fract(vec2(v_uv.x, -v_uv.y) / u_mediump[0].xy);
    
    vec4 src = ${k.texture2D()}(u_texture, uv);
    ${FragmentShaderLibrary.STATEMENT_COLOR_TRANSFORM_ON(1)}
    ${k.fragColor()} = src;
}`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static MASK (k)
    {
        return `${k.version()}
${k.extensionDerivatives()}
precision mediump float;

${k.varyingIn()} vec2 v_bezier;
${k.outColor()}

void main() {
    vec2 px = dFdx(v_bezier);
    vec2 py = dFdy(v_bezier);

    vec2 f = (2.0 * v_bezier.x) * vec2(px.x, py.x) - vec2(px.y, py.y);
    float alpha = 0.5 - (v_bezier.x * v_bezier.x - v_bezier.y) / length(f);

    if (alpha > 0.0) {
        ${k.fragColor()} = vec4(min(alpha, 1.0));
    } else {
        discard;
    }    
}

`;
    }
}
