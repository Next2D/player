import { ShaderSource } from "/packages/webgpu/src/Shader/ShaderSource.ts";

// Experimental only: bilinear pairing can change RGBA8 rounding.
// Do not import from production without passing exact-pixel validation.
export function experimentalPairedBlurFragment(radius) {
    if (!Number.isInteger(radius) || radius < 1 || radius > 16) {
        throw new RangeError("Expected an integer blur radius from 1 to 16");
    }
    const source = ShaderSource.getBlurFilterFragmentShader(radius);
    if (radius <= 2) return source;
    const loop = "    for (var i: f32 = 1.0; i < " + radius.toFixed(1) + "; i += 1.0) {\n"
        + "        color += textureSample(inputTexture, textureSampler, input.texCoord + offset * i);\n"
        + "        color += textureSample(inputTexture, textureSampler, input.texCoord - offset * i);\n"
        + "    }\n";
    if (!source.includes(loop)) throw new Error("Production blur loop changed; re-audit this experiment");
    let taps = "";
    for (let i = 1; i < radius; i += 2) {
        const paired = i + 1 < radius;
        const distance = (i + (paired ? 0.5 : 0)).toFixed(1);
        const weight = paired ? " * 2.0" : "";
        for (const sign of ["+", "-"]) {
            taps += "    color += textureSample(inputTexture, textureSampler, input.texCoord "
                + sign + " offset * " + distance + ")" + weight + ";\n";
        }
    }
    return source.replace(loop, taps);
}
