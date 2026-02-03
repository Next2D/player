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
    var vertices = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(1.0, 1.0)
    );
    var texCoords = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 1.0),
        vec2<f32>(0.0, 0.0),
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 1.0),
        vec2<f32>(1.0, 0.0)
    );
    let vertex = vertices[vertexIndex];
    output.texCoord = texCoords[vertexIndex];
    var position = vertex * uniforms.size + uniforms.offset;
    position = position / uniforms.viewport;
    position = position * 2.0 - 1.0;
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
