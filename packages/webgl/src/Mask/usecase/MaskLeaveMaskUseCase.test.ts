import { execute } from "./MaskLeaveMaskUseCase";
import { describe, expect, it, vi } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject.ts";
import {
    $setCurrentAttachment,
    $getCurrentAttachment
} from "../../FrameBufferManager.ts";
import {
    $setMaskDrawing,
    $clipBounds,
    $clipLevels,
    $isMaskDrawing
} from "../../Mask";

describe("MaskLeaveMaskUseCase.js method test", () =>
{
    it("test case1", () =>
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
                    "enable": vi.fn((cap) =>
                    {
                        expect(cap).toBe("SCISSOR_TEST");
                    }),
                    "disable": vi.fn((cap) =>
                    {
                        switch (cap) {
                            case "STENCIL_TEST":
                            case "SCISSOR_TEST":
                                break;
                            default:
                                throw new Error("Invalid cap");
                        }
                    }),
                    "stencilFunc": vi.fn((func, ref, mask) =>
                    {
                        expect(func).toBe("ALWAYS");
                        expect(ref).toBe(0);
                        expect(mask).toBe(0x4);
                    }),
                    "stencilOp": vi.fn((fail, zfail, zpass) =>
                    { 
                        expect(fail).toBe("REPLACE");
                        expect(zfail).toBe("REPLACE");
                        expect(zpass).toBe("REPLACE");
                    }),
                    "colorMask": vi.fn((red, green, blue, alpha) =>
                    {
                    }),
                    "stencilMask": vi.fn((mask) =>
                    {
                    }),
                    "scissor": vi.fn((x, y, width, height) =>
                    {
                        expect(x).toBe(10);
                        expect(y).toBe(60);
                        expect(width).toBe(20);
                        expect(height).toBe(20);
                    }),
                    "clear": vi.fn((mask) =>
                    {
                        expect(mask).toBe("STENCIL_BUFFER_BIT");
                    }),
                    "STENCIL_TEST": "STENCIL_TEST",
                    "SAMPLE_ALPHA_TO_COVERAGE": "SAMPLE_ALPHA_TO_COVERAGE",
                    "ALWAYS": "ALWAYS",
                    "ZERO": "ZERO",
                    "REPLACE": "REPLACE",
                    "INVERT": "INVERT",
                    "LEQUAL": "LEQUAL",
                    "SCISSOR_TEST": "SCISSOR_TEST",
                    "STENCIL_BUFFER_BIT": "STENCIL_BUFFER_BIT",
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
            "mask": true,
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

        $clipBounds.set(1, new Float32Array([10, 20, 30, 40]));
        expect($clipBounds.size).toBe(1);

        $clipLevels.set(1, 1);
        expect($clipLevels.size).toBe(1);

        $setMaskDrawing(true);
        expect($isMaskDrawing()).toBe(true);
        
        execute();

        expect($clipBounds.size).toBe(0);
        expect($clipLevels.size).toBe(0);
        expect($isMaskDrawing()).toBe(false);
    });

    it("test case1", () =>
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
                    "enable": vi.fn((cap) =>
                    {
                        expect(cap).toBe("SCISSOR_TEST");
                    }),
                    "disable": vi.fn(),
                    "stencilFunc": vi.fn((func, ref, mask) => 
                    {
                        switch (func) {
                            case "ALWAYS":
                            case "EQUAL":
                                break;
                            default:
                                throw new Error("Invalid func");
                        }
                        switch (mask) {
                            case 0xff:
                            case 0x3:
                                break;
                            default:
                                throw new Error("Invalid mask");
                        }
                        switch (ref) {
                            case 0:
                            case 3:
                            case 0xff:
                                break;
                            default:
                                throw new Error("Invalid ref");
                        }
                    }),
                    "stencilOp": vi.fn((fail, zfail, zpass) =>
                    {
                        switch (fail) {
                            case "REPLACE":
                            case "KEEP":
                                break;
                            default:
                                throw new Error("Invalid fail");
                        }
                        switch (zfail) {
                            case "REPLACE":
                            case "KEEP":
                                break;
                            default:
                                throw new Error("Invalid zfail");
                        }
                        switch (zpass) {
                            case "REPLACE":
                            case "KEEP":
                                break;
                            default:
                                throw new Error("Invalid zpass");
                        }
                    }),
                    "colorMask": vi.fn(),
                    "stencilMask": vi.fn((mask) =>
                    {
                        switch (mask) {
                            case 0xff:
                            case 0x4:
                                break;
                            default:
                                throw new Error("Invalid mask");
                        }
                    }),
                    "scissor": vi.fn(),
                    "clear": vi.fn(),
                    "STENCIL_TEST": "STENCIL_TEST",
                    "SAMPLE_ALPHA_TO_COVERAGE": "SAMPLE_ALPHA_TO_COVERAGE",
                    "ALWAYS": "ALWAYS",
                    "EQUAL": "EQUAL",
                    "ZERO": "ZERO",
                    "KEEP": "KEEP",
                    "REPLACE": "REPLACE",
                    "INVERT": "INVERT",
                    "LEQUAL": "LEQUAL",
                    "SCISSOR_TEST": "SCISSOR_TEST",
                    "STENCIL_BUFFER_BIT": "STENCIL_BUFFER_BIT",
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
            "clipLevel": 3,
            "msaa": false,
            "mask": true,
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
    
        $clipBounds.set(3, new Float32Array([10, 20, 30, 40]));
        $clipBounds.set(2, new Float32Array([10, 20, 30, 40]));
        $clipBounds.set(1, new Float32Array([10, 20, 30, 40]));
        expect($clipBounds.size).toBe(3);

        $clipLevels.set(3, 3);
        $clipLevels.set(2, 2);
        $clipLevels.set(1, 1);
        expect($clipLevels.size).toBe(3);

        $setMaskDrawing(true);
        expect($isMaskDrawing()).toBe(true);
        
        execute();

        expect($clipBounds.size).toBe(2);
        expect($clipLevels.size).toBe(2);
        expect($isMaskDrawing()).toBe(true);
    });
});