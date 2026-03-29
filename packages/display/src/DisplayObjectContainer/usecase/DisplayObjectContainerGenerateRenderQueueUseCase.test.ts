import { execute } from "./DisplayObjectContainerGenerateRenderQueueUseCase";
import { describe, expect, it } from "vitest";
import { renderQueue } from "@next2d/render-queue";
import { $cacheStore } from "@next2d/cache";
import { MovieClip } from "../../MovieClip";
import { Shape } from "../../Shape";
import { $RENDERER_CONTAINER_TYPE } from "../../DisplayObjectUtil";
import { Matrix } from "@next2d/geom";
import { stage } from "../../Stage";

describe("DisplayObjectContainerGenerateRenderQueueUseCase.js test", () =>
{
    it("execute test", () =>
    {
        const movieClip = new MovieClip();
        movieClip.addChild(new MovieClip());
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

        renderQueue.offset = 0;
        expect(renderQueue.offset).toBe(0);

        renderQueue.buffer.fill(0);
        expect(renderQueue.buffer.length).toBe(256);

        execute(
            movieClip, [], matrix, colorTransform,
            0, 0
        );

        expect(renderQueue.buffer[0]).toBe(1);
        expect(renderQueue.buffer[1]).toBe($RENDERER_CONTAINER_TYPE);
        expect(renderQueue.buffer[2]).toBe(11);
        expect(renderQueue.buffer[3]).toBe(0); // normal blendMode
        expect(renderQueue.buffer[4]).toBe(0);
        expect(renderQueue.buffer[5]).toBe(movieClip.children.length);
        expect(renderQueue.buffer[6]).toBe(-1);
        expect(renderQueue.buffer[7]).toBe(0);
        expect(renderQueue.buffer[8]).toBe(0);
        expect(renderQueue.offset).toBe(9);

        renderQueue.buffer.fill(0);
        renderQueue.offset = 0;
    });

    it("cacheAsBitmap null の場合は通常パスを使用", () =>
    {
        const movieClip = new MovieClip();
        movieClip.addChild(new MovieClip());
        movieClip.cacheAsBitmap = null;

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

        renderQueue.offset = 0;
        renderQueue.buffer.fill(0);

        execute(movieClip, [], matrix, colorTransform, 0, 0);

        // 通常パス: visible=1, CONTAINER_TYPE, blendMode(11=normal), useLayer=0
        expect(renderQueue.buffer[0]).toBe(1);
        expect(renderQueue.buffer[1]).toBe($RENDERER_CONTAINER_TYPE);
        expect(renderQueue.buffer[2]).toBe(11);
        expect(renderQueue.buffer[3]).toBe(0); // useLayer=0(no filter, normal blend)

        renderQueue.buffer.fill(0);
        renderQueue.offset = 0;
    });

    it("cacheAsBitmap 設定時に cache miss で専用形式を生成", () =>
    {
        const movieClip = new MovieClip();
        const childShape = new Shape();
        movieClip.addChild(childShape);

        movieClip.cacheAsBitmap = new Matrix(1, 0, 0, 1, 0, 0);
        stage.rendererScale = 1;

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

        // キャッシュをクリア
        $cacheStore.removeById(`${movieClip.instanceId}`);

        renderQueue.offset = 0;
        renderQueue.buffer.fill(0);

        execute(movieClip, [], matrix, colorTransform, 800, 600);

        // visible=1, CONTAINER_TYPE
        expect(renderQueue.buffer[0]).toBe(1);
        expect(renderQueue.buffer[1]).toBe($RENDERER_CONTAINER_TYPE);
        // blendMode (normal=11)
        expect(renderQueue.buffer[2]).toBe(11);
        // useLayer=1
        expect(renderQueue.buffer[3]).toBe(1);

        // layerType=2 (cacheAsBitmap), cacheHit=0
        expect(renderQueue.buffer[6]).toBe(2);
        expect(renderQueue.buffer[7]).toBe(0);

        // instanceId
        expect(renderQueue.buffer[8]).toBe(movieClip.instanceId);

        // filterBounds (フィルターなし: すべて0)
        expect(renderQueue.buffer[10]).toBe(0);
        expect(renderQueue.buffer[11]).toBe(0);
        expect(renderQueue.buffer[12]).toBe(0);
        expect(renderQueue.buffer[13]).toBe(0);

        // tMatrix (a,b,c,d) — filterBoundsの後
        expect(renderQueue.buffer[14]).toBe(1);
        expect(renderQueue.buffer[15]).toBe(0);
        expect(renderQueue.buffer[16]).toBe(0);
        expect(renderQueue.buffer[17]).toBe(1);

        // メインスレッドのキャッシュストアにキャッシュキーが設定される
        const cacheKey = $cacheStore.generateKeys(1, 1, colorTransform[7]);
        const cached = $cacheStore.get(
            `${movieClip.instanceId}`,
            "bitmapKey"
        );
        expect(cached).toBe(cacheKey);

        // cleanup
        $cacheStore.removeById(`${movieClip.instanceId}`);
        movieClip.cacheAsBitmap = null;
        renderQueue.buffer.fill(0);
        renderQueue.offset = 0;
    });

    it("cacheAsBitmap cache hit で子要素をスキップ", () =>
    {
        const movieClip = new MovieClip();
        const childShape = new Shape();
        movieClip.addChild(childShape);

        movieClip.cacheAsBitmap = new Matrix(1, 0, 0, 1, 0, 0);
        stage.rendererScale = 1;

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

        // キャッシュストアにキャッシュキーを事前設定（cache hitを模擬）
        const cacheKey = $cacheStore.generateKeys(1, 1, colorTransform[7]);
        $cacheStore.set(
            `${movieClip.instanceId}`,
            "bitmapKey", cacheKey
        );

        renderQueue.offset = 0;
        renderQueue.buffer.fill(0);

        const offsetBefore = renderQueue.offset;
        execute(movieClip, [], matrix, colorTransform, 800, 600);
        const offsetAfter = renderQueue.offset;

        // visible=1, CONTAINER_TYPE
        expect(renderQueue.buffer[0]).toBe(1);
        expect(renderQueue.buffer[1]).toBe($RENDERER_CONTAINER_TYPE);
        // blendMode (normal=11)
        expect(renderQueue.buffer[2]).toBe(11);
        // useLayer=1
        expect(renderQueue.buffer[3]).toBe(1);

        // layerType=2 (cacheAsBitmap), cacheHit=1
        expect(renderQueue.buffer[6]).toBe(2);
        expect(renderQueue.buffer[7]).toBe(1);

        // instanceId
        expect(renderQueue.buffer[8]).toBe(movieClip.instanceId);

        // cache hit の場合、子要素のデータは含まれない（offsetが小さい）
        // cache miss時よりもoffsetが小さいことを確認
        expect(offsetAfter - offsetBefore).toBeLessThan(30);

        // cleanup
        $cacheStore.removeById(`${movieClip.instanceId}`);
        movieClip.cacheAsBitmap = null;
        renderQueue.buffer.fill(0);
        renderQueue.offset = 0;
    });

    it("cacheAsBitmap: 子要素変更後もキャッシュが維持される", () =>
    {
        const movieClip = new MovieClip();
        const childShape = new Shape();
        movieClip.addChild(childShape);

        movieClip.cacheAsBitmap = new Matrix(1, 0, 0, 1, 0, 0);
        stage.rendererScale = 1;

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

        const cacheKey = $cacheStore.generateKeys(1, 1, colorTransform[7]);

        // キャッシュヒット状態を作る
        $cacheStore.set(
            `${movieClip.instanceId}`,
            "bitmapKey", cacheKey
        );

        // 子要素を変更
        movieClip.addChild(new Shape());

        renderQueue.offset = 0;
        renderQueue.buffer.fill(0);

        execute(movieClip, [], matrix, colorTransform, 800, 600);

        // layerType=2 (cacheAsBitmap), cacheHit=1 → キャッシュが維持されている
        expect(renderQueue.buffer[6]).toBe(2);
        expect(renderQueue.buffer[7]).toBe(1);

        // cleanup
        $cacheStore.removeById(`${movieClip.instanceId}`);
        movieClip.cacheAsBitmap = null;
        renderQueue.buffer.fill(0);
        renderQueue.offset = 0;
    });

    it("cacheAsBitmap: cache miss時にmatrix a/b/c/dがrenderScaleを使用（parentScaleを含む）", () =>
    {
        const movieClip = new MovieClip();
        const childShape = new Shape();
        movieClip.addChild(childShape);

        movieClip.cacheAsBitmap = new Matrix(1, 0, 0, 1, 0, 0);
        stage.rendererScale = 1;

        // 親matrixにscale=2を設定
        const matrix = new Float32Array([2, 0, 0, 2, 100, 50]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

        $cacheStore.removeById(`${movieClip.instanceId}`);

        renderQueue.offset = 0;
        renderQueue.buffer.fill(0);

        execute(movieClip, [], matrix, colorTransform, 800, 600);

        // matrix a/b/c/d はrenderScale = cacheScale * ownScale * parentScale
        // ※ parentScaleにrendererScaleが含まれている（$renderMatrix起点）
        // cacheScale=1, ownScale=1, parentScale=2(rs=1含む) → renderScale=2
        expect(renderQueue.buffer[14]).toBe(2); // renderScaleX（parentScale=2を含む）
        expect(renderQueue.buffer[15]).toBe(0);
        expect(renderQueue.buffer[16]).toBe(0);
        expect(renderQueue.buffer[17]).toBe(2); // renderScaleY（parentScale=2を含む）

        // cleanup
        $cacheStore.removeById(`${movieClip.instanceId}`);
        movieClip.cacheAsBitmap = null;
        renderQueue.buffer.fill(0);
        renderQueue.offset = 0;
    });

    it("cacheAsBitmap: cache hit時にもrenderScaleを使用", () =>
    {
        const movieClip = new MovieClip();
        const childShape = new Shape();
        movieClip.addChild(childShape);

        movieClip.cacheAsBitmap = new Matrix(1, 0, 0, 1, 0, 0);
        stage.rendererScale = 1;

        // 親matrixにscale=2を設定
        const matrix = new Float32Array([2, 0, 0, 2, 100, 50]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

        // renderScale = cacheScale(1) * ownScale(1) * parentScale(2) * stageScale(1) = 2
        const cacheKey = $cacheStore.generateKeys(2, 2, colorTransform[7]);
        $cacheStore.set(
            `${movieClip.instanceId}`,
            "bitmapKey", cacheKey
        );

        renderQueue.offset = 0;
        renderQueue.buffer.fill(0);

        execute(movieClip, [], matrix, colorTransform, 800, 600);

        // cache hit
        expect(renderQueue.buffer[7]).toBe(1);

        // matrix a/b/c/d はrenderScale=2（parentScale=2を含む）
        expect(renderQueue.buffer[14]).toBe(2);
        expect(renderQueue.buffer[15]).toBe(0);
        expect(renderQueue.buffer[16]).toBe(0);
        expect(renderQueue.buffer[17]).toBe(2);

        // cleanup
        $cacheStore.removeById(`${movieClip.instanceId}`);
        movieClip.cacheAsBitmap = null;
        renderQueue.buffer.fill(0);
        renderQueue.offset = 0;
    });

    it("cacheAsBitmap: rendererScale変更でキャッシュキーが変わる", () =>
    {
        const movieClip = new MovieClip();
        movieClip.addChild(new Shape());

        movieClip.cacheAsBitmap = new Matrix(1, 0, 0, 1, 0, 0);

        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

        // 実パイプラインでは$renderMatrixにrendererScaleが含まれるため
        // matrixパラメータもrendererScaleを反映する必要がある

        // rendererScale=1 でmatrix=[1,0,0,1]（$renderMatrixシミュレート）
        stage.rendererScale = 1;
        const matrix1 = new Float32Array([1, 0, 0, 1, 0, 0]);
        const cacheKey1 = $cacheStore.generateKeys(1, 1, colorTransform[7]);
        $cacheStore.set(
            `${movieClip.instanceId}`,
            "bitmapKey", cacheKey1
        );

        // rendererScale=2 でmatrix=[2,0,0,2]（$renderMatrixがscale=2に変更）
        stage.rendererScale = 2;
        const matrix2 = new Float32Array([2, 0, 0, 2, 0, 0]);
        const cacheKey2 = $cacheStore.generateKeys(2, 2, colorTransform[7]);
        expect(cacheKey1).not.toBe(cacheKey2);

        renderQueue.offset = 0;
        renderQueue.buffer.fill(0);

        execute(movieClip, [], matrix2, colorTransform, 800, 600);

        // cache miss（cacheHit=0）: parentScaleX=2（rendererScale含む）→ キャッシュキー変更
        expect(renderQueue.buffer[7]).toBe(0);

        // cleanup
        stage.rendererScale = 1;
        $cacheStore.removeById(`${movieClip.instanceId}`);
        movieClip.cacheAsBitmap = null;
        renderQueue.buffer.fill(0);
        renderQueue.offset = 0;
    });
});