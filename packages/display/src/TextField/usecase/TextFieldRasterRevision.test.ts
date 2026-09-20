import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TextField } from "@next2d/text";
import { LoaderInfo, Sprite } from "@next2d/display";
import { Matrix } from "@next2d/geom";
import { $cacheStore } from "@next2d/cache";
import { renderQueue } from "@next2d/render-queue";
import { execute } from "./TextFieldGenerateRenderQueueUseCase";
import { execute as applyTextChanges } from "../../../../text/src/TextField/service/TextFieldApplyChangesService";

describe("TextField raster cache revisions", () => {
    const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
    const color = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
    const fields: TextField[] = [];
    let buffer: Float32Array;
    let offset: number;
    const make = (): TextField => {
        const field = new TextField();
        field.text = "Text cache";
        field.x = 200;
        field.y = 200;
        fields.push(field);
        return field;
    };
    const draw = (field: TextField): Float32Array => {
        renderQueue.offset = 0;
        execute(field, matrix, color, 1200, 900);
        const result = renderQueue.buffer.slice(0, renderQueue.offset);
        field.changed = false;
        return result;
    };
    beforeEach(() => {
        buffer = renderQueue.buffer;
        offset = renderQueue.offset;
        renderQueue.buffer = new Float32Array(16384);
        renderQueue.offset = 0;
    });
    afterEach(() => {
        vi.restoreAllMocks();
        for (const field of fields) if (field.uniqueKey) $cacheStore.removeById(field.uniqueKey);
        fields.length = 0;
        renderQueue.buffer = buffer;
        renderQueue.offset = offset;
    });

    it.each(["x", "y", "rotation"] as const)("reuses pixels after changing %s", property => {
        const field = make();
        expect(draw(field)[30]).toBe(0);
        const revision = field.$rasterRevision;
        field[property] += 15;
        const encode = vi.spyOn(TextEncoder.prototype, "encode");
        const next = draw(field);
        expect(field.$rasterRevision).toBe(revision);
        expect(next[26]).toBe(1); // Keep general changed for filter invalidation.
        expect(next[30]).toBe(1);
        expect(next.length).toBe(33);
        expect(encode).not.toHaveBeenCalled();
    });

    it.each([
        ["text", (f: TextField) => { f.text = "Changed"; }],
        ["htmlText", (f: TextField) => { f.htmlText = "<b>Changed</b>"; }],
        ["background", (f: TextField) => { f.background = true; }],
        ["backgroundColor", (f: TextField) => { f.backgroundColor = 0x123456; }],
        ["border", (f: TextField) => { f.border = true; }],
        ["borderColor", (f: TextField) => { f.borderColor = 0xabcdef; }],
        ["thickness", (f: TextField) => { f.thickness = 2; }],
        ["thicknessColor", (f: TextField) => { f.thicknessColor = 0xabcdef; }],
        ["format", (f: TextField) => { const format = f.defaultTextFormat; format.size = 24; f.defaultTextFormat = format; }],
        ["stopIndex", (f: TextField) => { f.stopIndex = 2; }],
        ["wordWrap", (f: TextField) => { f.wordWrap = true; }],
        ["autoSize", (f: TextField) => { f.autoSize = "left"; }],
        ["cursor", (f: TextField) => { f.focusVisible = true; f.focusIndex = 1; applyTextChanges(f); }],
        ["selection", (f: TextField) => { f.selectIndex = 1; f.focusIndex = 3; applyTextChanges(f); }]
    ] as const)("refreshes pixels after %s changes", (_name, change) => {
        const field = make();
        draw(field);
        const revision = field.$rasterRevision;
        change(field);
        expect(field.$rasterRevision).not.toBe(revision);
        expect(draw(field)[30]).toBe(0);
        expect(draw(field)[30]).toBe(1);
    });

    it.each([false, true])("refreshes all previously cached scales, cacheAsBitmap=%s", bitmap => {
        const field = make();
        if (bitmap) field.cacheAsBitmap = new Matrix();
        draw(field);
        field.scaleX = 2;
        expect(draw(field)[30]).toBe(0);
        field.scaleX = 1;
        expect(draw(field)[30]).toBe(1);
        field.background = true;
        const updated = draw(field);
        expect(updated[30]).toBe(0);
        expect(updated[31]).toBe(1); // Existing atlas node is retained.
        field.scaleX = 2;
        const oldScale = draw(field);
        expect(oldScale[30]).toBe(0);
        expect(oldScale[31]).toBe(1);
        expect(draw(field)[30]).toBe(1);
    });

    it("retains content invalidation while culled even if changed is cleared", () => {
        const field = make();
        draw(field);
        field.background = true;
        field.visible = false;
        expect(Array.from(draw(field))).toEqual([0]);
        field.visible = true;
        expect(draw(field)[30]).toBe(0);
    });

    it("rebuilds evicted cache entries", () => {
        const field = make();
        draw(field);
        expect(draw(field)[30]).toBe(1);
        $cacheStore.removeById(field.uniqueKey);
        const next = draw(field);
        expect(next[30]).toBe(0);
        expect(next[31]).toBe(0);
    });

    it("uses globally distinct revisions for fields sharing a character key", () => {
        const first = make();
        const second = make();
        first.uniqueKey = second.uniqueKey = "raster-shared-test";
        first.backgroundColor = 0x123456;
        second.backgroundColor = 0x654321;
        expect(first.$rasterRevision).not.toBe(second.$rasterRevision);
        draw(first);
        expect(draw(second)[30]).toBe(0);
        expect(draw(first)[30]).toBe(0);
    });

    it("invalidates only text pixels and propagates general changes to the parent", () => {
        const parent = new Sprite();
        const field = make();
        parent.addChild(field);
        parent.changed = false;
        draw(field);
        const revision = field.$rasterRevision;
        applyTextChanges(field);
        expect(field.$rasterRevision).not.toBe(revision);
        expect(parent.changed).toBe(true);
        expect("$rasterRevision" in parent).toBe(false);
    });

    it("preserves shared timeline-character hits and their legacy changed rule", () => {
        const first = make();
        const second = make();
        const loader = new LoaderInfo();
        for (const field of [first, second]) {
            vi.spyOn(field, "loaderInfo", "get").mockReturnValue(loader);
            field.characterId = 123;
        }
        draw(first);
        draw(second);
        expect(first.uniqueKey).toBe(second.uniqueKey);
        expect(first.$rasterRevision).not.toBe(second.$rasterRevision);
        expect(draw(first)[30]).toBe(1);
        expect(draw(second)[30]).toBe(1);
        first.x += 1;
        expect(draw(first)[30]).toBe(0);
    });
});
