import { WgslFullscreenPositions, WgslUnitQuadVertices, WgslVertexOutput } from "../common/SharedWgsl";

/**
 * @description フルスクリーン四角形の頂点シェーダーを生成する
 *              Generate a full-screen quad vertex shader
 *
 * @param  {boolean} y_flip_tex_coord - テクスチャY座標を反転するかどうか
 * @return {string}
 */
const $createFullscreenQuadVertex = (y_flip_tex_coord: boolean): string => /* wgsl */`
${WgslVertexOutput}

@vertex
fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
${WgslFullscreenPositions}
    var texCoords = array<vec2<f32>, 6>(
        vec2<f32>(0.0, ${y_flip_tex_coord ? "1.0" : "0.0"}),
        vec2<f32>(1.0, ${y_flip_tex_coord ? "1.0" : "0.0"}),
        vec2<f32>(0.0, ${y_flip_tex_coord ? "0.0" : "1.0"}),
        vec2<f32>(0.0, ${y_flip_tex_coord ? "0.0" : "1.0"}),
        vec2<f32>(1.0, ${y_flip_tex_coord ? "1.0" : "0.0"}),
        vec2<f32>(1.0, ${y_flip_tex_coord ? "0.0" : "1.0"})
    );
    output.position = vec4<f32>(positions[vertexIndex], 0.0, 1.0);
    output.texCoord = texCoords[vertexIndex];
    return output;
}
`;

/**
 * @description ブラーフィルター用フルスクリーン頂点シェーダー（Y軸テクスチャ反転）
 *              Full-screen vertex shader for blur filter with Y-axis texture flip
 *
 * @type {string}
 * @constant
 */
export const BlurFilterVertex = $createFullscreenQuadVertex(true);

/**
 * @description 複合ブレンド用フルスクリーン頂点シェーダー
 *              Full-screen vertex shader for complex blend
 *
 * @type {string}
 * @constant
 */
export const ComplexBlendVertex = $createFullscreenQuadVertex(false);

/**
 * @description 複合ブレンドコピー用フルスクリーン頂点シェーダー
 *              Full-screen vertex shader for complex blend copy
 *
 * @type {string}
 * @constant
 */
export const ComplexBlendCopyVertex = $createFullscreenQuadVertex(false);

/**
 * @description ノードクリア用頂点シェーダー（NDC変換のみ）
 *              Node clear vertex shader with NDC transform only
 *
 * @type {string}
 * @constant
 */
export const NodeClearVertex = /* wgsl */`
struct VertexInput {
    @location(0) position: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
}

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    let ndc = input.position * 2.0 - 1.0;
    output.position = vec4<f32>(ndc.x, ndc.y, 0.0, 1.0);
    return output;
}
`;

/**
 * @description 位置指定テクスチャ描画用頂点シェーダー（ビューポート変換付き）
 *              Positioned texture rendering vertex shader with viewport transform
 *
 * @type {string}
 * @constant
 */
export const PositionedTextureVertex = /* wgsl */`
struct PositionUniforms {
    offset: vec2<f32>,
    size: vec2<f32>,
    viewport: vec2<f32>,
    padding: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: PositionUniforms;

@vertex
fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
${WgslUnitQuadVertices}
    let vertex = vertices[vertexIndex];
    output.texCoord = vec2<f32>(vertex.x, 1.0 - vertex.y);
    var position = vertex * uniforms.size + uniforms.offset;
    position = position / uniforms.viewport;
    position = position * 2.0 - 1.0;
    output.position = vec4<f32>(position.x, -position.y, 0.0, 1.0);
    return output;
}
`;

/**
 * @description ビットマップ同期用頂点シェーダー（ノード矩形ベース配置）
 *              Bitmap sync vertex shader with node rectangle-based positioning
 *
 * @type {string}
 * @constant
 */
export const BitmapSyncVertex = /* wgsl */`
struct BitmapSyncUniforms {
    nodeRect: vec4<f32>,
    textureSize: vec2<f32>,
    padding: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: BitmapSyncUniforms;

@vertex
fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
${WgslUnitQuadVertices}
    let vertex = vertices[vertexIndex];
    let pixelPos = vec2<f32>(
        uniforms.nodeRect.x + vertex.x * uniforms.nodeRect.z,
        uniforms.nodeRect.y + vertex.y * uniforms.nodeRect.w
    );
    let ndc = pixelPos / uniforms.textureSize * 2.0 - 1.0;
    output.position = vec4<f32>(ndc.x, -ndc.y, 0.0, 1.0);
    output.texCoord = pixelPos / uniforms.textureSize;
    return output;
}
`;

/**
 * @description スケール変換用Uniform定義と頂点出力構造体のWGSLコード
 *              WGSL code for scale transform uniform definitions and vertex output struct
 *
 * @type {string}
 * @constant
 */
const $ScaleUniformsAndStruct = `
struct ScaleUniforms {
    matrix: vec4<f32>,
    translate: vec2<f32>,
    srcSize: vec2<f32>,
    dstSize: vec2<f32>,
    padding: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: ScaleUniforms;
`;

/**
 * @description スケール変換の頂点位置計算処理のWGSLコード
 *              WGSL code for scale transform vertex position calculation
 *
 * @type {string}
 * @constant
 */
const $ScaleTransformBody = `
    var pos = vertex * uniforms.srcSize;
    let a = uniforms.matrix.x;
    let b = uniforms.matrix.y;
    let c = uniforms.matrix.z;
    let d = uniforms.matrix.w;
    let tx = uniforms.translate.x;
    let ty = uniforms.translate.y;
    let transformedX = pos.x * a + pos.y * c + tx;
    let transformedY = pos.x * b + pos.y * d + ty;
    var position = vec2<f32>(transformedX, transformedY) / uniforms.dstSize;
    position = position * 2.0 - 1.0;
    output.position = vec4<f32>(position.x, -position.y, 0.0, 1.0);
`;

/**
 * @description スケール変換用頂点シェーダーを生成する
 *              Generate a scale transform vertex shader
 *
 * @param  {boolean} y_flip_tex_coord - テクスチャY座標を反転するかどうか
 * @return {string}
 */
const $createScaleVertex = (y_flip_tex_coord: boolean): string => /* wgsl */`
${$ScaleUniformsAndStruct}

@vertex
fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
${WgslUnitQuadVertices}
    let vertex = vertices[vertexIndex];
    output.texCoord = ${y_flip_tex_coord ? "vec2<f32>(vertex.x, 1.0 - vertex.y)" : "vertex"};
${$ScaleTransformBody}
    return output;
}
`;

/**
 * @description テクスチャスケール用頂点シェーダー
 *              Texture scale vertex shader
 *
 * @type {string}
 * @constant
 */
export const TextureScaleVertex = $createScaleVertex(false);

/**
 * @description ブレンド用テクスチャスケール頂点シェーダー（Y軸反転）
 *              Texture scale vertex shader for blend with Y-axis flip
 *
 * @type {string}
 * @constant
 */
export const TextureScaleBlendVertex = $createScaleVertex(true);

/**
 * @description 複合ブレンドスケール用頂点シェーダー
 *              Complex blend scale vertex shader
 *
 * @type {string}
 * @constant
 */
export const ComplexBlendScaleVertex = $createScaleVertex(false);

/**
 * @description 出力用頂点シェーダーを生成する（位置指定・ビューポート変換）
 *              Generate an output vertex shader with positioning and viewport transform
 *
 * @param  {boolean} y_flip_tex_coord - テクスチャY座標を反転するかどうか
 * @return {string}
 */
const $createOutputVertex = (y_flip_tex_coord: boolean): string => /* wgsl */`
struct PositionUniforms {
    offset: vec2<f32>,
    size: vec2<f32>,
    viewport: vec2<f32>,
    padding: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: PositionUniforms;

@vertex
fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
${WgslUnitQuadVertices}
    let vertex = vertices[vertexIndex];
    output.texCoord = ${y_flip_tex_coord ? "vec2<f32>(vertex.x, 1.0 - vertex.y)" : "vertex"};
    var position = vertex * uniforms.size + uniforms.offset;
    position = position / uniforms.viewport;
    position = position * 2.0 - 1.0;
    output.position = vec4<f32>(position.x, -position.y, 0.0, 1.0);
    return output;
}
`;

/**
 * @description 複合ブレンド出力用頂点シェーダー
 *              Complex blend output vertex shader
 *
 * @type {string}
 * @constant
 */
export const ComplexBlendOutputVertex = $createOutputVertex(false);

/**
 * @description フィルター複合ブレンド出力用頂点シェーダー（Y軸反転）
 *              Filter complex blend output vertex shader with Y-axis flip
 *
 * @type {string}
 * @constant
 */
export const FilterComplexBlendOutputVertex = $createOutputVertex(true);
