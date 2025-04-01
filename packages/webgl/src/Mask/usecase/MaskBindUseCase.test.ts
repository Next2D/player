import { execute } from "./MaskBindUseCase";
import { describe, expect, it, vi } from "vitest";
import {
    $isMaskDrawing,
    $setMaskDrawing
} from "../../Mask";

describe("MaskBindUseCase.js method test", () =>
{
    it("test case1", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                "$gl": {
                    "enable": vi.fn((cap) =>
                    {
                        expect(cap).toBe("STENCIL_TEST");
                    }),
                    "STENCIL_TEST": "STENCIL_TEST",
                },
                "$context": {
                    get currentAttachmentObject() {
                        return null;
                    }
                }
            }
        });

        $setMaskDrawing(false);
        expect($isMaskDrawing()).toBe(false);

        execute(true);
        expect($isMaskDrawing()).toBe(true);
        
    });

    it("test case2", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                "$gl": {
                    "disable": vi.fn((cap) =>
                    {
                        console.log(cap);
                        switch (cap) {
                            case "STENCIL_TEST":
                            case "SCISSOR_TEST":
                                return;
                            default:
                                throw new Error("Invalid cap");
                        }
                    }),
                    "enable": vi.fn(),
                    "STENCIL_TEST": "STENCIL_TEST",
                    "SCISSOR_TEST": "SCISSOR_TEST",
                },
                "$context": {
                    get currentAttachmentObject() {
                        return null;
                    }
                }
            }
        });

        $setMaskDrawing(true);
        expect($isMaskDrawing()).toBe(true);

        execute(false);
        expect($isMaskDrawing()).toBe(false);
        
    });
});