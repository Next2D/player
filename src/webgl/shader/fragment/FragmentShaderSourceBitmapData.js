/**
 * @class
 */
class FragmentShaderSourceBitmapData
{
    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static FILL_COLOR (k)
    {
        return `${k.version()}
precision mediump float;

uniform vec4 u_mediump;

${k.outColor()}

void main() {
    ${k.fragColor()} = u_mediump;
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static COPY_SRC_TEX (k)
    {
        return `${k.version()}
precision mediump float;

uniform sampler2D u_src_tex;

${k.varyingIn()} vec2 v_src_tex_coord;
${k.outColor()}

void main() {
    ${k.fragColor()} = ${k.texture2D()}(u_src_tex, v_src_tex_coord);
}

`;
    }

    /**
     * @param  {boolean} transparent
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static COPY_CHANNEL (transparent, k)
    {
        transparent |= 0;

        return `${k.version()}
precision mediump float;

uniform sampler2D u_textures[2];
uniform vec4 u_mediump[2];

${k.varyingIn()} vec2 v_src_tex_coord;
${k.varyingIn()} vec2 v_dst_tex_coord;
${k.outColor()}

void main() {
    vec4 src_ch = u_mediump[0];
    vec4 dst_ch = u_mediump[1];

    vec4 src_color = ${k.texture2D()}(u_textures[0], v_src_tex_coord);
    vec4 dst_color = ${k.texture2D()}(u_textures[1], v_dst_tex_coord);

    src_color = vec4(src_color.rgb/max(0.0001, src_color.a), src_color.a);
    dst_color = vec4(dst_color.rgb/max(0.0001, dst_color.a), dst_color.a);

    // src_color から必要なチャンネルのスカラー値を取り出したもの
    float src_value = dot(src_color, src_ch);

    // コピー先の他のチャンネルと合成
    vec4 mixed = mix(dst_color, vec4(src_value), dst_ch);

#if ${transparent}
    ${k.fragColor()} = vec4(mixed.rgb * mixed.a, mixed.a);
#else
    ${k.fragColor()} = vec4(mixed.rgb, 1.0);
#endif
}

`;
    }

    /**
     * @param  {boolean} transparent
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static MERGE (transparent, k)
    {
        transparent |= 0;

        return `${k.version()}
precision mediump float;

uniform sampler2D u_textures[2];
uniform vec4 u_mediump;

${k.varyingIn()} vec2 v_src_tex_coord;
${k.varyingIn()} vec2 v_dst_tex_coord;
${k.outColor()}

void main() {
    vec4 src_color = ${k.texture2D()}(u_textures[0], v_src_tex_coord);
    vec4 dst_color = ${k.texture2D()}(u_textures[1], v_dst_tex_coord);

    src_color = vec4(src_color.rgb/max(0.0001, src_color.a), src_color.a);
    dst_color = vec4(dst_color.rgb/max(0.0001, dst_color.a), dst_color.a);

    vec4 merged = mix(dst_color, src_color, u_mediump);

#if ${transparent}
    ${k.fragColor()} = vec4(merged.rgb * merged.a, merged.a);
#else
    ${k.fragColor()} = vec4(merged.rgb, 1.0);
#endif
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static COPY_PIXELS_WITH_ALPHA_BITMAP_DATA (k)
    {
        return `${k.version()}
precision mediump float;

uniform sampler2D u_textures[2];

${k.varyingIn()} vec2 v_src_tex_coord;
${k.varyingIn()} vec2 v_alpha_tex_coord;
${k.outColor()}

void main() {
    vec4 src_color = ${k.texture2D()}(u_textures[0], v_src_tex_coord);
    float alpha = ${k.texture2D()}(u_textures[1], v_alpha_tex_coord).a;

    src_color = vec4(src_color.rgb/max(0.0001, src_color.a), src_color.a);
    alpha *= src_color.a;

    ${k.fragColor()} = vec4(src_color.rgb * alpha, alpha);
}

`;
    }

    /**
     * @param  {boolean} transparent
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static PALETTE_MAP (transparent, k)
    {
        transparent |= 0;

        return `${k.version()}
precision mediump float;

uniform sampler2D u_textures[2];

${k.varyingIn()} vec2 v_src_tex_coord;
${k.outColor()}

void main() {
    vec4 src_color = ${k.texture2D()}(u_textures[0], v_src_tex_coord);
    src_color = vec4(src_color.rgb/max(0.0001, src_color.a), src_color.a);

                                                // ↓ 256*4のテクスチャの画素の中心をサンプリング
    vec4 map_r = ${k.texture2D()}(u_textures[1], vec2((0.5+src_color.r*255.0)/256.0, 0.125));
    vec4 map_g = ${k.texture2D()}(u_textures[1], vec2((0.5+src_color.g*255.0)/256.0, 0.375));
    vec4 map_b = ${k.texture2D()}(u_textures[1], vec2((0.5+src_color.b*255.0)/256.0, 0.625));
    vec4 map_a = ${k.texture2D()}(u_textures[1], vec2((0.5+src_color.a*255.0)/256.0, 0.875));

    // u_plt_tex(u_textures[1]) のパレットデータは BGRA で格納されているので、これを取り出すには .bgra
    // TODO プラットフォームのバイトオーダーがビッグエンディアンの場合は ARGB で格納されるので、これを取り出すには .gbar
    vec4 color = (map_r + map_g + map_b + map_a).bgra;

    // fract は 1.0, 2.0, ... のときに 0.0 を返すが 1.0 が欲しい
    vec4 color_fract = fract(color);
    color = color_fract + sign(color) - sign(color_fract);

#if ${transparent}
    ${k.fragColor()} = vec4(color.rgb * color.a, color.a);
#else
    ${k.fragColor()} = vec4(color.rgb, 1.0);
#endif
}

`;
    }

    /**
     * @param  {boolean} transparent
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static PIXEL_DISSOLVE_TEXTURE (transparent, k)
    {
        transparent |= 0;

        return `${k.version()}
precision mediump float;

uniform sampler2D u_src_tex;

${k.varyingIn()} vec2 v_src_tex_coord;
${k.outColor()}

void main() {
    vec4 src_color = ${k.texture2D()}(u_src_tex, v_src_tex_coord);

#if ${transparent}
    ${k.fragColor()} = src_color;
#else
    ${k.fragColor()} = vec4(src_color.rgb, 1.0);
#endif
}

`;
    }

    /**
     * @param  {boolean} transparent
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static COLOR_TRANSFORM (transparent, k)
    {
        transparent |= 0;

        return `${k.version()}
precision mediump float;

uniform sampler2D u_src_tex;
uniform vec4 u_mediump[2];

${k.varyingIn()} vec2 v_src_tex_coord;
${k.outColor()}

void main() {
    vec4 ct_mul = u_mediump[0];
    vec4 ct_add = u_mediump[1];

    vec4 src_color = ${k.texture2D()}(u_src_tex, v_src_tex_coord);
    src_color = vec4(src_color.rgb/max(0.0001, src_color.a), src_color.a);

    vec4 color = clamp(ct_mul * src_color + ct_add, 0.0, 1.0);

    color = vec4(color.rgb * color.a, color.a);

#if !${transparent}
    color.a = 1.0;
#endif

    ${k.fragColor()} = color * sign(src_color.a);  // 元の色が無色透明の場合、結果も常に無色透明になる。
}

`;
    }

    /**
     * @return {string}
     * @method
     * @static
     */
    static bitwiseAnd() {
        return `
#if __VERSION__ < 130
// 8bitまでの整数どうしのビット積
int bitwiseAnd(int a, int b) {
    //ivec4 c1 = ivec4(1,2,4,8);
    //ivec4 c2 = ivec4(16,32,64,128);

    //ivec4 a1 = ivec4(a) / c1;
    //ivec4 a2 = ivec4(a) / c2;
    //ivec4 b1 = ivec4(b) / c1;
    //ivec4 b2 = ivec4(b) / c2;

    //ivec4 r = (a1-a1/2*2) * (b1-b1/2*2) * c1
    //        + (a2-a2/2*2) * (b2-b2/2*2) * c2;

    //return r.x + r.y + r.z + r.w;

    // ↑ intのままで計算した場合（rakusanの開発環境ではintの方が遅かった）
    // ↓ floatに変換してから計算した場合

    vec4 a0 = vec4(float(a));
    vec4 b0 = vec4(float(b));
    vec4 a1 = floor(a0 * vec4(1.0, 0.5, 0.25, 0.125));
    vec4 a2 = floor(a0 * vec4(0.0625, 0.03125, 0.015625, 0.0078125));
    vec4 b1 = floor(b0 * vec4(1.0, 0.5, 0.25, 0.125));
    vec4 b2 = floor(b0 * vec4(0.0625, 0.03125, 0.015625, 0.0078125));

    return int(dot((a1-floor(a1*0.5)*2.0)*(b1-floor(b1*0.5)*2.0), vec4(1.0,2.0,4.0,8.0))
             + dot((a2-floor(a2*0.5)*2.0)*(b2-floor(b2*0.5)*2.0), vec4(16.0,32.0,64.0,128.0)));
}

ivec4 bitwiseAnd(ivec4 a, ivec4 b) {
    return ivec4(bitwiseAnd(a.r, b.r),
                 bitwiseAnd(a.g, b.g),
                 bitwiseAnd(a.b, b.b),
                 bitwiseAnd(a.a, b.a));
}
#else
#define bitwiseAnd(a, b) ((a)&(b))
#endif
`;
    }

    /**
     * @param  {string} operation
     * @param  {boolean} copy_source
     * @param  {boolean} transparent
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static THRESHOLD (operation, copy_source, transparent, k)
    {
        copy_source |= 0;
        transparent |= 0;

        return `${k.version()}
#if __VERSION__ < 130
#extension GL_EXT_draw_buffers : require
#endif

precision mediump float;

uniform sampler2D u_src_tex;
uniform vec4 u_mediump[2]; // u_threshold(u_mediump[0]) はJS側でマスク済み
uniform ivec4 u_integer;

${k.varyingIn()} vec2 v_src_tex_coord;

#if __VERSION__ < 130
#define outColor0 gl_FragData[0]
#define outColor1 gl_FragData[1]
#else
layout (location = 0) out vec4 outColor0;
layout (location = 1) out vec4 outColor1;
#endif

${FragmentShaderSourceBitmapData.bitwiseAnd()}

bool less(vec4 x) {
    return dot(sign(x - u_mediump[0]), vec4(4.0, 2.0, 1.0, 8.0)) < 0.0;
}

bool greater(vec4 x) {
    return dot(sign(x - u_mediump[0]), vec4(4.0, 2.0, 1.0, 8.0)) > 0.0;
}

bool lessEqual(vec4 x) {
    return !greater(x);
}

bool greaterEqual(vec4 x) {
    return !less(x);
}

// 組込関数に equal があるので thresholdEqual にしている。
bool thresholdEqual(vec4 x) {
    return all(equal(x, u_mediump[0]));
}

// 組込関数に notEqual があるので thresholdNotEqual にしている。
bool thresholdNotEqual(vec4 x) {
    return any(notEqual(x, u_mediump[0]));
}

void main() {
    // 乗算済みのままで比較するとFlash Playerと一致する。

    vec4 src_color = ${k.texture2D()}(u_src_tex, v_src_tex_coord);
    ivec4 masked = bitwiseAnd(ivec4(src_color * 255.0), u_integer);

    if (${operation}(vec4(masked))) {
        outColor0 = u_mediump[1];
        outColor1 = vec4(1.0);
    } else {
#if ${copy_source}
    #if ${transparent}
        outColor0 = src_color;
    #else
        outColor0 = vec4(src_color.rgb, 1.0);
    #endif
        outColor1 = vec4(0.0);
#else
        discard;
#endif
    }
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static THRESHOLD_SUBTOTAL (k)
    {
        return `${k.version()}
precision mediump float;

uniform sampler2D u_src_tex;
uniform vec4 u_mediump;

${k.varyingIn()} vec2 v_src_tex_coord;
${k.outColor()}

void main() {
    vec2 src_tex_step   = u_mediump.xy;
    float subtotal_loop = u_mediump.z;

    float subtotal = 0.0;

#if __VERSION__ < 130
    float j = 0.0;
    for (float i = 0.0; i < 4095.0; ++i) {      // この 4095.0 というマジックナンバーについては
        if (j++ >= subtotal_loop) {           // BitmapData.prototype.threshold のコメントを見てください。
            break;
        }
#else
    for (float i = 0.0; i < subtotal_loop; ++i) {
#endif
        subtotal += ${k.texture2D()}(u_src_tex, v_src_tex_coord + src_tex_step * i).a;
    }

    vec4 v1 = floor(subtotal * vec4(1.0, 0.00390625, 0.0000152587890625, 5.960464477539063e-8));  // vec4(1.0, 1.0/256.0, 1.0/65536.0, 1.0/16777216.0)
    vec4 v2 = vec4(v1.yzw, 0.0);
    ${k.fragColor()} = (v1 - v2*256.0) * 0.00392156862745098;  // 1.0/255.0
}

`;
    }

    /**
     * @param  {boolean} find_color
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static GET_COLOR_BOUNDS_RECT (find_color, k)
    {
        find_color |= 0;

        return `${k.version()}
precision mediump float;

uniform sampler2D u_src_tex;
uniform vec4 u_mediump;
uniform ivec4 u_integer[2];

${k.varyingIn()} vec2 v_src_tex_coord;
${k.outColor()}

${FragmentShaderSourceBitmapData.bitwiseAnd()}

void main() {
    vec2 src_tex_step = u_mediump.xy;
    float scan_loop   = u_mediump.z;
    ivec4 mask  = u_integer[0];
    ivec4 color = u_integer[1];

    float found = 0.0;

#if __VERSION__ < 130
    float j = 0.0;
    for (float i = 0.0; i < 8191.0; ++i) {      // BitmapData の幅または高さの最大サイズは 8191 ピクセル
        if (j++ >= scan_loop) {
            break;
        }
#else
    for (float i = 0.0; i < scan_loop; ++i) {
#endif
        vec4 src_color = ${k.texture2D()}(u_src_tex, v_src_tex_coord + src_tex_step * i);
        ivec4 masked = bitwiseAnd(ivec4(src_color * 255.0), mask);

#if ${find_color}
        if (all(equal(masked, color))) {
#else
        if (any(notEqual(masked, color))) {
#endif
            found = 1.0;
            break;
        }
    }

    ${k.fragColor()} = vec4(found);
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static NOISE (k)
    {
        return `${k.version()}
precision mediump float;

uniform vec4 u_mediump[3];

${k.outColor()}

// https://stackoverflow.com/a/28095165
//
// Gold Noise ©2015 dcerisano@standard3d.com
// - based on the Golden Ratio
// - uniform normalized distribution
// - fastest static noise generator function (also runs at low precision)

float PHI = 1.61803398874989484820459;  // Φ = Golden Ratio

vec4 gold_noise(vec2 xy, vec4 seed) {
    return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);
}

void main() {
    vec4 seed = u_mediump[0];
    vec4 amp  = u_mediump[1];
    vec4 low  = u_mediump[2];

    vec4 noise = gold_noise(gl_FragCoord.xy, seed);
    vec4 color = noise * amp + low;
    ${k.fragColor()} = vec4(color.rgb * color.a, color.a);
}

`;
    }

    /**
     * @param  {string} byteOrder
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static GET_PIXELS (byteOrder, k)
    {
        switch (byteOrder) {
            case "RGBA":
                byteOrder = 1;
                break;
            case "BGRA":
                byteOrder = 2;
                break;
            default: // ARGB
                byteOrder = 0;
                break;
        }

        return `${k.version()}
precision mediump float;

uniform sampler2D u_src_tex;

${k.varyingIn()} vec2 v_src_tex_coord;
${k.outColor()}

void main() {
    vec4 color = ${k.texture2D()}(u_src_tex, v_src_tex_coord);

#if ${byteOrder} == 1  // RGBA
    ${k.fragColor()} = vec4(color.rgb / max(0.0001, color.a), color.a);
#elif ${byteOrder} == 2  // BGRA
    ${k.fragColor()} = vec4(color.bgr / max(0.0001, color.a), color.a);
#else  // ARGB
    ${k.fragColor()} = vec4(color.a, color.rgb / max(0.0001, color.a));
#endif
}

`;
    }

    /**
     * @param  {string} byteOrder
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static SET_PIXELS (byteOrder, k)
    {
        switch (byteOrder) {
            case "RGBA":
                byteOrder = 1;
                break;
            case "BGRA":
                byteOrder = 2;
                break;
            default: // ARGB
                byteOrder = 0;
                break;
        }

        return `${k.version()}
precision mediump float;

uniform sampler2D u_src_tex;

${k.varyingIn()} vec2 v_src_tex_coord;
${k.outColor()}

void main() {
    vec4 color = ${k.texture2D()}(u_src_tex, v_src_tex_coord);

#if ${byteOrder} == 1  // RGBA
    ${k.fragColor()} = vec4(color.rgb * color.a, color.a);
#elif ${byteOrder} == 2  // BGRA
    ${k.fragColor()} = vec4(color.bgr * color.a, color.a);
#else  // ARGB
    ${k.fragColor()} = vec4(color.gba * color.r, color.r);
#endif
}

`;
    }

    /**
     * @param  {WebGLShaderKeyword} k
     * @return {string}
     * @method
     * @static
     */
    static SET_PIXEL_QUEUE (k)
    {
        return `${k.version()}
precision mediump float;

uniform sampler2D u_dst_tex;

${k.varyingIn()} vec2 v_dst_tex_coord;
${k.varyingIn()} vec4 v_color;
${k.outColor()}

void main() {
    float da = ${k.texture2D()}(u_dst_tex, v_dst_tex_coord).a;
    float a = v_color.a;

    ${k.fragColor()} = max( a, 0.0) * v_color
                     + max(-a, 0.0) * vec4(v_color.rgb * da, da);
}

`;
    }
}
