import { execute } from "./CommandResizeService";
import { $cacheStore } from "@next2d/cache";
import {
    $getRendererWidth,
    $getRendererHeight,
} from "../../RendererUtil";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../RendererUtil.ts", async (importOriginal) =>
{
    const mod = await importOriginal<typeof import("../../RendererUtil.ts")>();
    return {
        ...mod,
        $canvas: {
            "width": vi.fn((width: number) => { expect(width).toBe(500); }),
            "height": vi.fn((height: number) => { expect(height).toBe(600); })
        },
        $context: {
            "resize": vi.fn((width: number, height: number) => {
                expect(width).toBe(500);
                expect(height).toBe(600);
            })
        }
    };
});

describe("CommandResizeService.js test", () =>
{
    it("execute test", () =>
    {
        const spyResetFunction = vi.spyOn($cacheStore, "reset");
        
        expect($getRendererWidth()).toBe(0);
        expect($getRendererHeight()).toBe(0);
        execute(500, 600);

        
        expect(spyResetFunction).toHaveBeenCalled();
    });
});
