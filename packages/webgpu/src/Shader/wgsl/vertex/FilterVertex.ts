export const BlurFilterVertex = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@vertex
fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
    var positions = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>(-1.0,  1.0),
        vec2<f32>(-1.0,  1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>( 1.0,  1.0)
    );
    var texCoords = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 1.0),
        vec2<f32>(0.0, 0.0),
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 1.0),
        vec2<f32>(1.0, 0.0)
    );
    output.position = vec4<f32>(positions[vertexIndex], 0.0, 1.0);
    output.texCoord = texCoords[vertexIndex];
    return output;
}
`;

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
    // 頂点座標: (0,0)=左上, (1,1)=右下
    var vertices = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(1.0, 1.0)
    );
    let vertex = vertices[vertexIndex];
    // テクスチャ座標: Y軸を反転（OffscreenCanvas/TextFieldは上が0なのでそのまま、flipYで画像は反転済み）
    output.texCoord = vec2<f32>(vertex.x, 1.0 - vertex.y);
    // WebGPU座標系: offset = (node.x, node.y)を直接使用
    var position = vertex * uniforms.size + uniforms.offset;
    position = position / uniforms.viewport;
    position = position * 2.0 - 1.0;
    // Y軸を反転してNDC座標系に変換（0,0が左上になるように）
    output.position = vec4<f32>(position.x, -position.y, 0.0, 1.0);
    return output;
}
`;

// Bitmap同期用vertex shader
// resolve target（シングルサンプル）の特定領域をMSAAテクスチャにコピーする用
// uniformでnode位置とテクスチャサイズを受け取り、正しい座標を計算
export const BitmapSyncVertex = /* wgsl */`
struct BitmapSyncUniforms {
    nodeRect: vec4<f32>,      // x, y, width, height (in pixels)
    textureSize: vec2<f32>,   // texture width, height
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

    // 単位正方形の頂点（左下から）
    var vertices = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(1.0, 1.0)
    );

    let vertex = vertices[vertexIndex];

    // node領域のピクセル位置を計算
    let pixelPos = vec2<f32>(
        uniforms.nodeRect.x + vertex.x * uniforms.nodeRect.z,
        uniforms.nodeRect.y + vertex.y * uniforms.nodeRect.w
    );

    // ピクセル座標をNDC（-1〜1）に変換
    // Y軸反転：ピクセル座標系（y=0が上）→ NDC座標系（y=+1が上）
    let ndc = pixelPos / uniforms.textureSize * 2.0 - 1.0;
    output.position = vec4<f32>(ndc.x, -ndc.y, 0.0, 1.0);

    // UV座標：node領域のテクスチャ座標（正規化）
    output.texCoord = pixelPos / uniforms.textureSize;

    return output;
}
`;

export const BlendModeVertex = /* wgsl */`
struct VertexInput {
    @location(0) position: vec2<f32>,
    @location(1) texCoord: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    output.position = vec4<f32>(input.position, 0.0, 1.0);
    output.texCoord = input.texCoord;
    return output;
}
`;

// スケール変換用vertex shader（複雑なブレンドモードでスケールが適用されている場合に使用）
export const TextureScaleVertex = /* wgsl */`
struct ScaleUniforms {
    // 2x3 affine matrix: a, b, c, d, tx, ty
    matrix: vec4<f32>,     // a, b, c, d
    translate: vec2<f32>,  // tx, ty
    srcSize: vec2<f32>,    // source texture size
    dstSize: vec2<f32>,    // destination texture size
    padding: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: ScaleUniforms;

@vertex
fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
    // 頂点座標: (0,0)=左上, (1,1)=右下
    var vertices = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(1.0, 1.0)
    );
    let vertex = vertices[vertexIndex];

    // テクスチャ座標: 元のテクスチャ全体を参照
    output.texCoord = vertex;

    // ピクセル座標での位置計算
    var pos = vertex * uniforms.srcSize;

    // アフィン変換適用
    let a = uniforms.matrix.x;
    let b = uniforms.matrix.y;
    let c = uniforms.matrix.z;
    let d = uniforms.matrix.w;
    let tx = uniforms.translate.x;
    let ty = uniforms.translate.y;

    let transformedX = pos.x * a + pos.y * c + tx;
    let transformedY = pos.x * b + pos.y * d + ty;

    // NDC座標に変換
    var position = vec2<f32>(transformedX, transformedY) / uniforms.dstSize;
    position = position * 2.0 - 1.0;
    output.position = vec4<f32>(position.x, -position.y, 0.0, 1.0);

    return output;
}
`;

// フィルター処理用スケール変換vertex shader（Video/Bitmap用）
// BlurFilterVertexのテクスチャ座標Y反転と整合性を取るため、テクスチャ座標をY反転
export const TextureScaleBlendVertex = /* wgsl */`
struct ScaleUniforms {
    // 2x3 affine matrix: a, b, c, d, tx, ty
    matrix: vec4<f32>,     // a, b, c, d
    translate: vec2<f32>,  // tx, ty
    srcSize: vec2<f32>,    // source texture size
    dstSize: vec2<f32>,    // destination texture size
    padding: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: ScaleUniforms;

@vertex
fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
    // 頂点座標: (0,0)=左上, (1,1)=右下
    var vertices = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(1.0, 1.0)
    );
    let vertex = vertices[vertexIndex];

    // テクスチャ座標: Y軸を反転（BlurFilterVertexと整合性を取るため）
    output.texCoord = vec2<f32>(vertex.x, 1.0 - vertex.y);

    // ピクセル座標での位置計算
    var pos = vertex * uniforms.srcSize;

    // アフィン変換適用
    let a = uniforms.matrix.x;
    let b = uniforms.matrix.y;
    let c = uniforms.matrix.z;
    let d = uniforms.matrix.w;
    let tx = uniforms.translate.x;
    let ty = uniforms.translate.y;

    let transformedX = pos.x * a + pos.y * c + tx;
    let transformedY = pos.x * b + pos.y * d + ty;

    // NDC座標に変換
    var position = vec2<f32>(transformedX, transformedY) / uniforms.dstSize;
    position = position * 2.0 - 1.0;
    output.position = vec4<f32>(position.x, -position.y, 0.0, 1.0);

    return output;
}
`;

// 複雑なブレンドモード用スケール変換vertex shader
// ビデオ/ビットマップをアトラスからスケール変換して複雑なブレンド用テクスチャに描画
// 複雑なブレンド処理全体でY反転なしを統一するため、テクスチャ座標は反転しない
export const ComplexBlendScaleVertex = /* wgsl */`
struct ScaleUniforms {
    // 2x3 affine matrix: a, b, c, d, tx, ty
    matrix: vec4<f32>,     // a, b, c, d
    translate: vec2<f32>,  // tx, ty
    srcSize: vec2<f32>,    // source texture size
    dstSize: vec2<f32>,    // destination texture size
    padding: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: ScaleUniforms;

@vertex
fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
    // 頂点座標: (0,0)=左上, (1,1)=右下
    var vertices = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(1.0, 1.0)
    );
    let vertex = vertices[vertexIndex];

    // テクスチャ座標: Y軸反転なし（複雑なブレンド処理で統一）
    output.texCoord = vertex;

    // ピクセル座標での位置計算
    var pos = vertex * uniforms.srcSize;

    // アフィン変換適用
    let a = uniforms.matrix.x;
    let b = uniforms.matrix.y;
    let c = uniforms.matrix.z;
    let d = uniforms.matrix.w;
    let tx = uniforms.translate.x;
    let ty = uniforms.translate.y;

    let transformedX = pos.x * a + pos.y * c + tx;
    let transformedY = pos.x * b + pos.y * d + ty;

    // NDC座標に変換
    var position = vec2<f32>(transformedX, transformedY) / uniforms.dstSize;
    position = position * 2.0 - 1.0;
    output.position = vec4<f32>(position.x, -position.y, 0.0, 1.0);

    return output;
}
`;

// 複雑なブレンドモード用フルスクリーンクワッドvertex shader
// srcAttachmentとdstAttachmentを同じ座標系でサンプリングするため、Y軸反転なし
export const ComplexBlendVertex = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@vertex
fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
    var positions = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>(-1.0,  1.0),
        vec2<f32>(-1.0,  1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>( 1.0,  1.0)
    );
    // テクスチャ座標: Y軸反転なし
    // (0,0)=左下, (1,1)=右上 - 標準的なテクスチャ座標
    var texCoords = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(1.0, 1.0)
    );
    output.position = vec4<f32>(positions[vertexIndex], 0.0, 1.0);
    output.texCoord = texCoords[vertexIndex];
    return output;
}
`;

// 複雑なブレンドモード用テクスチャコピーvertex shader
// mainAttachmentからdstAttachmentへのコピーでY軸反転なし
export const ComplexBlendCopyVertex = /* wgsl */`
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@vertex
fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
    var positions = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>(-1.0,  1.0),
        vec2<f32>(-1.0,  1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>( 1.0,  1.0)
    );
    // テクスチャ座標: Y軸反転なし
    var texCoords = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(1.0, 1.0)
    );
    output.position = vec4<f32>(positions[vertexIndex], 0.0, 1.0);
    output.texCoord = texCoords[vertexIndex];
    return output;
}
`;

// 複雑なブレンドモード結果描画用vertex shader
// ブレンド結果をmainAttachmentに描画する際にY軸反転なしで描画
export const ComplexBlendOutputVertex = /* wgsl */`
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
    // 頂点座標: (0,0)=左上, (1,1)=右下
    var vertices = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(1.0, 1.0)
    );
    let vertex = vertices[vertexIndex];
    // テクスチャ座標: Y軸反転なし（複雑なブレンド処理で統一）
    output.texCoord = vertex;
    // WebGPU座標系: offset = (node.x, node.y)を直接使用
    var position = vertex * uniforms.size + uniforms.offset;
    position = position / uniforms.viewport;
    position = position * 2.0 - 1.0;
    // Y軸を反転してNDC座標系に変換（0,0が左上になるように）
    output.position = vec4<f32>(position.x, -position.y, 0.0, 1.0);
    return output;
}
`;

// フィルター＋複雑なブレンドモード結果描画用vertex shader
// フィルター処理後のテクスチャはBlurFilterVertexと同じ座標系で作成されているため、Y軸反転が必要
export const FilterComplexBlendOutputVertex = /* wgsl */`
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
    // 頂点座標: (0,0)=左上, (1,1)=右下
    var vertices = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(1.0, 1.0)
    );
    let vertex = vertices[vertexIndex];
    // テクスチャ座標: Y軸反転（BlurFilterVertexと同じ座標系に合わせる）
    output.texCoord = vec2<f32>(vertex.x, 1.0 - vertex.y);
    // WebGPU座標系: offset = (node.x, node.y)を直接使用
    var position = vertex * uniforms.size + uniforms.offset;
    position = position / uniforms.viewport;
    position = position * 2.0 - 1.0;
    // Y軸を反転してNDC座標系に変換（0,0が左上になるように）
    output.position = vec4<f32>(position.x, -position.y, 0.0, 1.0);
    return output;
}
`;
