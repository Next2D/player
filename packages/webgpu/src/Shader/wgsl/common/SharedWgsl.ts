/**
 * @description UV座標が0〜1の範囲内にあるかを判定するWGSLヘルパー関数
 *              WGSL helper function that checks if UV coordinates are within the 0-1 range
 *
 * @type {string}
 * @constant
 */
export const WgslIsInside = `
fn isInside(uv: vec2<f32>) -> f32 {
    let s = step(vec2<f32>(0.0), uv) * step(uv, vec2<f32>(1.0));
    return s.x * s.y;
}`;

/**
 * @description フルスクリーン四角形の頂点座標定義（NDC空間）
 *              Full-screen quad vertex positions definition in NDC space
 *
 * @type {string}
 * @constant
 */
export const WgslFullscreenPositions = `
    const positions = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>(-1.0,  1.0),
        vec2<f32>(-1.0,  1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>( 1.0,  1.0)
    );`;

/**
 * @description 単位四角形の頂点座標定義（0〜1空間）
 *              Unit quad vertex positions definition in 0-1 space
 *
 * @type {string}
 * @constant
 */
export const WgslUnitQuadVertices = `
    const vertices = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(1.0, 1.0)
    );`;

/**
 * @description 標準的な頂点シェーダー出力構造体のWGSL定義
 *              WGSL definition of the standard vertex shader output struct
 *
 * @type {string}
 * @constant
 */
export const WgslVertexOutput = `
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}`;
