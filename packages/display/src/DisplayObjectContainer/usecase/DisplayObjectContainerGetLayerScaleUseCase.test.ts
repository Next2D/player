import { execute } from "./DisplayObjectContainerGetLayerScaleUseCase";
import { Shape } from "../../Shape";
import { Sprite } from "../../Sprite";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { Matrix } from "@next2d/geom";
import { describe, expect, it } from "vitest";

describe("DisplayObjectContainerGetLayerScaleUseCase.ts test", () =>
{
    it("子要素がない場合はoutが初期値のまま", () =>
    {
        const container = new DisplayObjectContainer();
        const out = new Float32Array([1, 1]);
        execute(container, out);
        expect(out[0]).toBe(1);
        expect(out[1]).toBe(1);
    });

    it("cacheAsBitmap を持たない子コンテナはoutを変更しない", () =>
    {
        const container = new DisplayObjectContainer();
        const child = new Sprite();
        container.addChild(child);

        const out = new Float32Array([1, 1]);
        execute(container, out);
        expect(out[0]).toBe(1);
        expect(out[1]).toBe(1);
    });

    it("cacheAsBitmap を持つ子コンテナのスケールを反映する", () =>
    {
        const container = new DisplayObjectContainer();
        const child = new Sprite();
        child.cacheAsBitmap = new Matrix(1.5, 0, 0, 2.0, 0, 0);
        container.addChild(child);

        const out = new Float32Array([1, 1]);
        execute(container, out);
        expect(out[0]).toBeCloseTo(1.5, 5);
        expect(out[1]).toBeCloseTo(2.0, 5);
    });

    it("複数子の cacheAsBitmap のうち最大値を採用する", () =>
    {
        const container = new DisplayObjectContainer();

        const childA = new Sprite();
        childA.cacheAsBitmap = new Matrix(1.2, 0, 0, 3.0, 0, 0);
        container.addChild(childA);

        const childB = new Sprite();
        childB.cacheAsBitmap = new Matrix(2.5, 0, 0, 1.5, 0, 0);
        container.addChild(childB);

        const out = new Float32Array([1, 1]);
        execute(container, out);
        expect(out[0]).toBeCloseTo(2.5, 5);
        expect(out[1]).toBeCloseTo(3.0, 5);
    });

    it("孫のcacheAsBitmapも再帰的に収集する", () =>
    {
        const root = new DisplayObjectContainer();
        const middle = new Sprite();
        root.addChild(middle);

        const leaf = new Sprite();
        leaf.cacheAsBitmap = new Matrix(1.5, 0, 0, 1.5, 0, 0);
        middle.addChild(leaf);

        const out = new Float32Array([1, 1]);
        execute(root, out);
        expect(out[0]).toBeCloseTo(1.5, 5);
        expect(out[1]).toBeCloseTo(1.5, 5);
    });

    it("既存のoutの値が大きい場合は上書きしない (max を取る)", () =>
    {
        const container = new DisplayObjectContainer();
        const child = new Sprite();
        child.cacheAsBitmap = new Matrix(1.2, 0, 0, 1.2, 0, 0);
        container.addChild(child);

        const out = new Float32Array([2.0, 2.0]);
        execute(container, out);
        expect(out[0]).toBeCloseTo(2.0, 5);
        expect(out[1]).toBeCloseTo(2.0, 5);
    });

    it("非表示 (visible=false) の子はスキップする", () =>
    {
        const container = new DisplayObjectContainer();

        const hidden = new Sprite();
        hidden.cacheAsBitmap = new Matrix(3.0, 0, 0, 3.0, 0, 0);
        hidden.visible = false;
        container.addChild(hidden);

        const visibleChild = new Sprite();
        visibleChild.cacheAsBitmap = new Matrix(1.5, 0, 0, 1.5, 0, 0);
        container.addChild(visibleChild);

        const out = new Float32Array([1, 1]);
        execute(container, out);
        expect(out[0]).toBeCloseTo(1.5, 5);
        expect(out[1]).toBeCloseTo(1.5, 5);
    });

    it("非Container (Shape) の子はスキップする", () =>
    {
        const container = new DisplayObjectContainer();
        const shape = new Shape();
        container.addChild(shape);

        const out = new Float32Array([1, 1]);
        execute(container, out);
        expect(out[0]).toBe(1);
        expect(out[1]).toBe(1);
    });

    it("cacheAsBitmap に回転成分がある場合も scale 成分を抽出する", () =>
    {
        const container = new DisplayObjectContainer();
        const child = new Sprite();
        // 45度回転 + scale 2 相当: a=cos*2, b=sin*2 ... sqrt(a^2+b^2)=2
        const cos = Math.cos(Math.PI / 4);
        const sin = Math.sin(Math.PI / 4);
        child.cacheAsBitmap = new Matrix(cos * 2, sin * 2, -sin * 2, cos * 2, 0, 0);
        container.addChild(child);

        const out = new Float32Array([1, 1]);
        execute(container, out);
        expect(out[0]).toBeCloseTo(2, 5);
        expect(out[1]).toBeCloseTo(2, 5);
    });
});
