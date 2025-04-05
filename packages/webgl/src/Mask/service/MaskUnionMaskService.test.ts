import { execute } from "./MaskUnionMaskService";
import { describe, expect, it, vi } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject.ts";
import {
    $setCurrentAttachment,
    $getCurrentAttachment
} from "../../FrameBufferManager.ts";

describe("MaskUnionMaskService.js method test", () =>
{
    it("test case", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "createTexture": vi.fn(() => { return "createTexture" }),
                    "activeTexture": vi.fn(() => { return "activeTexture" }),
                    "bindTexture": vi.fn(() => { return "bindTexture" }),
                    "texParameteri": vi.fn(() => { return "texParameteri" }),
                    "texStorage2D": vi.fn(() => { return "texStorage2D" }),
                    "createRenderbuffer": vi.fn(() => { return "createRenderbuffer" }),
                    "bindRenderbuffer": vi.fn(() => { return "bindRenderbuffer" }),
                    "renderbufferStorage": vi.fn(() => { return "renderbufferStorage" }),
                    "createProgram": vi.fn(() => { return "createProgram" }),
                    "createShader": vi.fn(() => { return "createShader" }),
                    "shaderSource": vi.fn(() => { return "shaderSource" }),
                    "compileShader": vi.fn(() => { return "compileShader" }),
                    "attachShader": vi.fn(() => { return "attachShader" }),
                    "linkProgram": vi.fn(() => { return "linkProgram" }),
                    "detachShader": vi.fn(() => { return "detachShader" }),
                    "deleteShader": vi.fn(() => { return "deleteShader" }),
                    "createVertexArray": vi.fn(() => { return "createVertexArray" }),
                    "createBuffer": vi.fn(() => { return "createBuffer" }),
                    "enableVertexAttribArray": vi.fn(() => { return "enableVertexAttribArray" }),
                    "vertexAttribPointer": vi.fn(() => { return "vertexAttribPointer" }),
                    "bindVertexArray": vi.fn(() => { return "bindVertexArray" }),
                    "useProgram": vi.fn(() => { return "useProgram" }),
                    "bindBuffer": vi.fn(() => { return "bindBuffer" }),
                    "bufferData": vi.fn(() => { return "bufferData" }),
                    "drawArrays": vi.fn(() => { return "drawArrays" }),
                    "blendFunc": vi.fn(() => { return "blendFunc" }),
                    "getProgramParameter": vi.fn(() => { return 0 }),
                    "disable": vi.fn((cap) => {
                        switch (cap) {
                            case "SCISSOR_TEST":
                            case "SAMPLE_ALPHA_TO_COVERAGE":
                                return ;

                            default:
                                throw new Error("Unknown capability: " + cap);
                            
                        }
                    }),
                    "stencilFunc": vi.fn((func, ref, mask) => {
                        switch (func) {
                            case "ALWAYS":
                            case "LEQUAL":
                                break;

                            default:
                                throw new Error("Unknown function: " + func);
                        }

                        switch (ref) {
                            case 0:
                            case 1:
                                break;

                            default:
                                throw new Error("Unknown function: " + func);
                        }

                        switch (mask) {
                            case 255:
                                break;

                            default:
                                throw new Error("Unknown function: " + func);
                        }
                    }),
                    "stencilOp": vi.fn((fail, zfail, zpass) =>
                    { 
                        switch (fail) {
                            case "ZERO":
                            case "REPLACE":
                                break;

                            default:
                                throw new Error("Unknown function: " + fail);
                        }
                        switch (zfail) {
                            case "REPLACE":
                            case "INVERT":
                                break;

                            default:
                                throw new Error("Unknown function: " + zfail);
                        }
                        switch (zpass) {
                            case "REPLACE":
                            case "INVERT":
                                break;

                            default:
                                throw new Error("Unknown function: " + zpass);
                        }
                    }),
                    "colorMask": vi.fn((red, green, blue, alpha) =>
                    {
                        expect(red).toBe(true);
                        expect(green).toBe(true);
                        expect(blue).toBe(true);
                        expect(alpha).toBe(true);
                    }),
                    "stencilMask": vi.fn((mask) =>
                    {
                        switch (mask) {
                            case -3:
                            case 2:
                            case 255:
                                break;

                            default:
                                throw new Error("Unknown mask: " + mask);
                        }
                       
                    }),
                    "STENCIL_TEST": "STENCIL_TEST",
                    "SAMPLE_ALPHA_TO_COVERAGE": "SAMPLE_ALPHA_TO_COVERAGE",
                    "ALWAYS": "ALWAYS",
                    "ZERO": "ZERO",
                    "REPLACE": "REPLACE",
                    "INVERT": "INVERT",
                    "LEQUAL": "LEQUAL",
                    "SCISSOR_TEST": "SCISSOR_TEST"
                },
                "$context": {
                    get currentAttachmentObject() {
                        return $getCurrentAttachment();
                    }
                }
            }
        });

        const attachmentObject = {
            "width": 100,
            "height": 100,
            "clipLevel": 1,
            "msaa": false,
            "mask": false,
            "color": null,
            "texture": {
                "id": 0,
                "resource": "createTexture",
                "width": 100,
                "height": 100,
                "area": 100 * 100,
                "smooth": false
            },
            "stencil": {
                "id": 0,
                "resource": "createRenderbuffer",
                "width": 100,
                "height": 100,
                "area": 100 * 100,
                "dirty": false,
            }
        } as unknown as IAttachmentObject;

        $setCurrentAttachment(attachmentObject);
        execute();
    });
});