import { execute } from "./CommandInitializeContextService";
import { $devicePixelRatio } from "../../RendererUtil";
import { describe, expect, it, vi } from "vitest";

describe("CommandInitializeContextService.js test", () =>
{
    it("execute test case1", () =>
    {
        const MockCanvas = vi.fn().mockImplementation(() =>
        {
            return {
                "getContext": vi.fn((contextId: string, options: any) =>
                {
                    expect(contextId).toBe("webgl2");
                    expect(options.stencil).toBe(true);
                    expect(options.premultipliedAlpha).toBe(true);
                    expect(options.antialias).toBe(false);
                    expect(options.depth).toBe(false);
                    expect(options.preserveDrawingBuffer).toBe(true);

                    return {
                        "getParameter": vi.fn(),
                        "createFramebuffer": vi.fn(),
                        "bindFramebuffer": vi.fn(),
                        "pixelStorei": vi.fn(),
                        "createRenderbuffer": vi.fn(),
                        "bindRenderbuffer": vi.fn(),
                        "renderbufferStorageMultisample": vi.fn(),
                        "createTexture": vi.fn(() =>
                        {
                            return {};
                        }),
                        "activeTexture": vi.fn(),
                        "bindTexture": vi.fn(),
                        "texParameteri": vi.fn(),
                        "texStorage2D": vi.fn(),
                        "createBuffer": vi.fn(),
                        "createVertexArray": vi.fn(),
                        "bindBuffer": vi.fn(),
                        "bufferData": vi.fn(),
                        "enableVertexAttribArray": vi.fn(),
                        "vertexAttribPointer": vi.fn(),
                        "vertexAttribDivisor": vi.fn(),
                        "createProgram": vi.fn(() =>
                        {
                            return {};
                        }),
                        "createShader": vi.fn(),
                        "shaderSource": vi.fn(),
                        "compileShader": vi.fn(),
                        "attachShader": vi.fn(),
                        "linkProgram": vi.fn(),
                        "detachShader": vi.fn(),
                        "deleteShader": vi.fn(),
                        "getProgramParameter": vi.fn(),
                        "enable": vi.fn(),
                        "blendFunc": vi.fn(),
                    };
                })
            } as unknown as HTMLCanvasElement;
        });

        expect($devicePixelRatio).toBe(1);
        execute(new MockCanvas(), 2);
        expect($devicePixelRatio).toBe(2);
    });
});