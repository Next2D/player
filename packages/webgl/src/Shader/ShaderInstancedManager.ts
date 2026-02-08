import { ShaderManager } from "./ShaderManager";
import { renderQueue } from "@next2d/render-queue";

export class ShaderInstancedManager extends ShaderManager
{
    public count: number;

    constructor (vertex_source: string, fragment_source: string, atlas: boolean = true)
    {
        super(vertex_source, fragment_source, atlas);
        this.count = 0;
    }

    clear (): void
    {
        this.count = renderQueue.offset = 0;
    }
}
