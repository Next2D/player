import { TEXTURE_PREMULTIPLY } from "../../../Fragment/FragmentShaderSourceTexture";
import { BLEND_TEMPLATE } from "../../../Vertex/VertexShaderSource";
import { ShaderManager } from "../../../ShaderManager";
import { $collection } from "../../BlendVariants";

export const execute = (): ShaderManager =>
{
    const key = "text-batch";
    const cached = $collection.get(key);
    if (cached) {
        return cached;
    }
    const vertex = BLEND_TEMPLATE()
        .replace("uniform vec4 u_highp[2];", "uniform vec4 u_highp[3];")
        .replace("v_coord = a_vertex;", "v_coord = u_highp[2].xy + a_vertex * u_highp[2].zw;");
    const shader = new ShaderManager(vertex, TEXTURE_PREMULTIPLY());
    $collection.set(key, shader);
    return shader;
};
