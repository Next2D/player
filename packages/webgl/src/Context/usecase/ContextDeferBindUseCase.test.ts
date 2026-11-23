import { Context } from "../../Context";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    $attachmentDeferred,
    $currentAttachment,
    $physicalAttachment
} from "../../FrameBufferManager";
import {
    $viewportWidth,
    $viewportHeight
} from "../../WebGLUtil";

/**
 * 呼ばれた GL の関数を名前で記録する WebGL2RenderingContext の代用品
 */
const createGL = (calls: string[]): WebGL2RenderingContext =>
{
    const functions = new Map<string, (...args: unknown[]) => unknown>();
    return new Proxy({}, {
        "get": (_target, name: string): unknown =>
        {
            // 定数 (大文字だけの名前) は適当な数値を返す
            if (/^[A-Z0-9_]+$/.test(name)) {
                return 1;
            }
            let fn = functions.get(name);
            if (!fn) {
                fn = (...args: unknown[]): unknown =>
                {
                    calls.push(name === "framebufferRenderbuffer" ? `${name}:${String(args[3])}` : name);
                    return name === "getParameter" ? 4096 : {};
                };
                functions.set(name, fn);
            }
            return fn;
        }
    }) as unknown as WebGL2RenderingContext;
};

const createAttachment = (id: number, width: number, height: number): IAttachmentObject =>
{
    return {
        id, width, height,
        "clipLevel": 0,
        "msaa": true,
        "mask": false,
        "texture": null,
        "color": { "resource": `color${id}`, "width": width, "height": height, "area": width * height, "dirty": false },
        "stencil": { "resource": `stencil${id}`, "width": width, "height": height, "area": width * height, "dirty": false }
    } as unknown as IAttachmentObject;
};

describe("ContextDeferBindUseCase.js method test", () =>
{
    const calls: string[] = [];
    let context: Context;
    const main  = createAttachment(1, 100, 200);
    const atlas = createAttachment(2, 4096, 4096);
    const other = createAttachment(3, 64, 32);

    // 描画先を付け替える GL の呼び出しだけを取り出す
    const attaches = (): string[] => calls.filter((name) => name.startsWith("framebufferRenderbuffer"));

    beforeEach(() =>
    {
        context = new Context(createGL(calls), 4);
        context.bind(main);
        context.bind(atlas);
        calls.length = 0;
    });

    it("test case - going back is recorded without touching GL", () =>
    {
        context.deferBind(main);

        expect(calls).toEqual([]);
        expect($attachmentDeferred).toBe(true);
        expect(context.currentAttachmentObject).toBe(main);
        expect($currentAttachment).toBe(main);
        expect($physicalAttachment).toBe(atlas);
        expect($viewportWidth).toBe(100);
        expect($viewportHeight).toBe(200);
    });

    it("test case - switching straight back to the atlas costs nothing", () =>
    {
        context.deferBind(main);
        context.bind(atlas);

        expect(attaches()).toEqual([]);
        expect(calls).not.toContain("viewport");
        expect($attachmentDeferred).toBe(false);
        expect($currentAttachment).toBe(atlas);
        expect($viewportWidth).toBe(4096);
        expect($viewportHeight).toBe(4096);

        // 何度繰り返しても同じ
        for (let idx = 0; idx < 5; ++idx) {
            context.deferBind(main);
            context.bind(atlas);
        }
        expect(attaches()).toEqual([]);
    });

    it("test case - the switch happens before anything is drawn with GL", () =>
    {
        context.deferBind(main);
        context.clearRect(0, 0, 10, 10);

        expect(attaches()).toEqual(["framebufferRenderbuffer:color1", "framebufferRenderbuffer:stencil1"]);
        // 付け替えは、描画 (clear) より前
        expect(calls.indexOf("framebufferRenderbuffer:stencil1")).toBeLessThan(calls.lastIndexOf("clear"));
        expect(calls).toContain("viewport");
        expect($attachmentDeferred).toBe(false);
        expect($physicalAttachment).toBe(main);

        // 2 回目以降は何もしない
        calls.length = 0;
        context.clearRect(0, 0, 10, 10);
        expect(attaches()).toEqual([]);
    });

    it("test case - binding the pending target performs the switch", () =>
    {
        context.deferBind(main);
        context.bind(main);

        expect(attaches()).toEqual(["framebufferRenderbuffer:color1", "framebufferRenderbuffer:stencil1"]);
        expect($attachmentDeferred).toBe(false);
        expect($physicalAttachment).toBe(main);
    });

    it("test case - binding a third target skips the pending one", () =>
    {
        context.deferBind(main);
        context.bind(other);

        expect(attaches()).toEqual(["framebufferRenderbuffer:color3", "framebufferRenderbuffer:stencil3"]);
        expect($attachmentDeferred).toBe(false);
        expect($currentAttachment).toBe(other);
        expect($physicalAttachment).toBe(other);
        expect($viewportWidth).toBe(64);
        expect($viewportHeight).toBe(32);
    });

    it("test case - deferring to the current target does nothing", () =>
    {
        context.deferBind(atlas);

        expect(calls).toEqual([]);
        expect($attachmentDeferred).toBe(false);
        expect($currentAttachment).toBe(atlas);
    });

    it("test case - a target of the same size still gets its viewport size back", () =>
    {
        const sameSize = createAttachment(4, 4096, 4096);
        context.deferBind(main);
        context.bind(sameSize);

        // GL のビューポートは同じ大きさなので設定し直さないが、JavaScript 側の値は合わせる
        expect(calls).not.toContain("viewport");
        expect($viewportWidth).toBe(4096);
        expect($viewportHeight).toBe(4096);
        expect($physicalAttachment).toBe(sameSize);
    });
});
