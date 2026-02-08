export const WgslIsInside = `
fn isInside(uv: vec2<f32>) -> f32 {
    let s = step(vec2<f32>(0.0), uv) * step(uv, vec2<f32>(1.0));
    return s.x * s.y;
}`;

export const WgslFullscreenPositions = `
    var positions = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>(-1.0,  1.0),
        vec2<f32>(-1.0,  1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>( 1.0,  1.0)
    );`;

export const WgslUnitQuadVertices = `
    var vertices = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 0.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(0.0, 1.0),
        vec2<f32>(1.0, 0.0),
        vec2<f32>(1.0, 1.0)
    );`;
