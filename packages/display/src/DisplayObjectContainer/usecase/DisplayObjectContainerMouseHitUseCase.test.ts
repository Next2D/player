import { execute } from "./DisplayObjectContainerMouseHitUseCase";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { Shape } from "../../Shape";
import { Sprite } from "../../Sprite";
import { MovieClip } from "../../MovieClip";
import { TextField } from "@next2d/text";
import { Video } from "@next2d/media";
import type { IPlayerHitObject } from "../../interface/IPlayerHitObject";
import { describe, expect, it, beforeEach, vi } from "vitest";

// ShapeHitTestUseCase をモック
vi.mock("../../Shape/usecase/ShapeHitTestUseCase", () => ({
    execute: vi.fn(() => false)
}));

// TextFieldHitTestUseCase をモック
vi.mock("../../TextField/usecase/TextFieldHitTestUseCase", () => ({
    execute: vi.fn(() => false)
}));

// VideoHitTestUseCase をモック
vi.mock("../../Video/usecase/VideoHitTestUseCase", () => ({
    execute: vi.fn(() => false)
}));

import { execute as shapeHitTestMock } from "../../Shape/usecase/ShapeHitTestUseCase";
import { execute as textFieldHitTestMock } from "../../TextField/usecase/TextFieldHitTestUseCase";
import { execute as videoHitTestMock } from "../../Video/usecase/VideoHitTestUseCase";

describe("DisplayObjectContainerMouseHitUseCase.js test", () =>
{
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    let matrix: Float32Array;

    const createHitObject = (x: number = 50, y: number = 50): IPlayerHitObject => {
        return { x, y, pointer: "auto", hit: null };
    };

    beforeEach(() =>
    {
        canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 200;
        context = canvas.getContext("2d") as CanvasRenderingContext2D;
        matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

        vi.mocked(shapeHitTestMock).mockReset().mockReturnValue(false);
        vi.mocked(textFieldHitTestMock).mockReset().mockReturnValue(false);
        vi.mocked(videoHitTestMock).mockReset().mockReturnValue(false);
    });

    it("子要素がない場合はfalseを返す", () =>
    {
        const container = new DisplayObjectContainer();
        const hitObject = createHitObject();

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(false);
    });

    it("Shape子要素でヒットする場合はtrueを返す", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        container.addChild(shape);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(true);
    });

    it("Shape子要素でヒットしない場合はfalseを返す", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(false);

        const container = new DisplayObjectContainer();
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        container.addChild(shape);

        const hitObject = createHitObject(150, 150);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(false);
    });

    it("非表示の子要素はヒット判定から除外される", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        shape.visible = false;
        container.addChild(shape);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(false);
        // 非表示なのでshapeHitTestUseCaseは呼ばれない
        expect(shapeHitTestMock).not.toHaveBeenCalled();
    });

    it("isMaskがtrueの子要素はスキップされる", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        shape.isMask = true;
        container.addChild(shape);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(false);
        // isMaskなのでshapeHitTestUseCaseは呼ばれない
        expect(shapeHitTestMock).not.toHaveBeenCalled();
    });

    it("ネストされたDisplayObjectContainerでヒット判定を行う", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const parent = new DisplayObjectContainer();
        const child = new DisplayObjectContainer();
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        child.addChild(shape);
        parent.addChild(child);

        const hitObject = createHitObject(50, 50);

        const result = execute(parent, context, matrix, hitObject);

        expect(result).toBe(true);
    });

    it("mouseChildren=falseの場合、ヒットしてもbreakして終了する", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        container.addChild(shape);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject, false);

        expect(result).toBe(true);
        // mouseChildren=falseの場合、hit判定後すぐbreakする
        expect(hitObject.hit).toBe(null);
    });

    it("mouseChildrenがfalseのコンテナでは子のhit情報を設定しない", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        container.mouseChildren = false;

        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        container.addChild(shape);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(true);
        // mouseChildren=falseなのでhitは設定されない
        expect(hitObject.hit).toBe(null);
    });

    it("Sprite子要素でbuttonMode+useHandCursorの場合pointerがpointerになる", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const sprite = new Sprite();
        sprite.buttonMode = true;
        sprite.useHandCursor = true;
        sprite.mouseEnabled = true;
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        sprite.addChild(shape);
        container.addChild(sprite);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(true);
        expect(hitObject.pointer).toBe("pointer");
    });

    it("mouseEnabled=falseの子要素ではhit_objectが更新されない", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const sprite = new Sprite();
        sprite.mouseEnabled = false;
        sprite.buttonMode = true;
        sprite.useHandCursor = true;
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        sprite.addChild(shape);
        container.addChild(sprite);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(true);
        // mouseEnabledがfalseなのでpointerは更新されない
        expect(hitObject.pointer).toBe("auto");
    });

    it("Shapeはinteractiveではないのでhit_objectのhitに設定されない", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        container.addChild(shape);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(true);
        // Shapeはinteractive=falseなのでhitには設定されない
        expect(hitObject.hit).toBe(null);
    });

    it("hitAreaが設定されたSpriteでヒット判定を行う", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const sprite = new Sprite();
        const hitAreaSprite = new Sprite();
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        hitAreaSprite.addChild(shape);
        sprite.hitArea = hitAreaSprite;

        // children.lengthが0だとfalseになるので子要素を追加
        const dummyShape = new Shape();
        dummyShape.graphics.xMin = 0;
        dummyShape.graphics.yMin = 0;
        dummyShape.graphics.xMax = 1;
        dummyShape.graphics.yMax = 1;
        sprite.addChild(dummyShape);

        const hitObject = createHitObject(50, 50);

        const result = execute(sprite, context, matrix, hitObject);

        expect(result).toBe(true);
    });

    it("hitAreaが設定されたSpriteでbuttonMode+useHandCursorの場合pointerがpointerになる", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const sprite = new Sprite();
        sprite.buttonMode = true;
        sprite.useHandCursor = true;

        const hitAreaSprite = new Sprite();
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        hitAreaSprite.addChild(shape);
        sprite.hitArea = hitAreaSprite;

        const dummyShape = new Shape();
        dummyShape.graphics.xMin = 0;
        dummyShape.graphics.yMin = 0;
        dummyShape.graphics.xMax = 1;
        dummyShape.graphics.yMax = 1;
        sprite.addChild(dummyShape);

        const hitObject = createHitObject(50, 50);

        const result = execute(sprite, context, matrix, hitObject);

        expect(result).toBe(true);
        expect(hitObject.pointer).toBe("pointer");
        expect(hitObject.hit).toBe(sprite);
    });

    it("hitAreaが設定されたSpriteでヒットしない場合はfalseを返す", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(false);

        const sprite = new Sprite();
        const hitAreaSprite = new Sprite();
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 10;
        shape.graphics.yMax = 10;
        hitAreaSprite.addChild(shape);
        sprite.hitArea = hitAreaSprite;

        const dummyShape = new Shape();
        dummyShape.graphics.xMin = 0;
        dummyShape.graphics.yMin = 0;
        dummyShape.graphics.xMax = 1;
        dummyShape.graphics.yMax = 1;
        sprite.addChild(dummyShape);

        const hitObject = createHitObject(150, 150);

        const result = execute(sprite, context, matrix, hitObject);

        expect(result).toBe(false);
    });

    it("maskがShapeの場合、マスク領域内ならヒットする", () =>
    {
        // maskのヒットテストとtargetのヒットテスト両方true
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const maskShape = new Shape();
        maskShape.graphics.xMin = 0;
        maskShape.graphics.yMin = 0;
        maskShape.graphics.xMax = 100;
        maskShape.graphics.yMax = 100;
        container.mask = maskShape;

        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        container.addChild(shape);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(true);
    });

    it("maskが設定されたコンテナでマスク領域外ならfalseを返す", () =>
    {
        // maskのヒットテストはfalse
        vi.mocked(shapeHitTestMock).mockReturnValue(false);

        const container = new DisplayObjectContainer();
        const maskShape = new Shape();
        maskShape.graphics.xMin = 0;
        maskShape.graphics.yMin = 0;
        maskShape.graphics.xMax = 10;
        maskShape.graphics.yMax = 10;
        container.mask = maskShape;

        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 200;
        shape.graphics.yMax = 200;
        container.addChild(shape);

        const hitObject = createHitObject(150, 150);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(false);
    });

    it("複数の子要素がある場合、最後に追加された要素が優先される", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();

        const shape1 = new Shape();
        shape1.graphics.xMin = 0;
        shape1.graphics.yMin = 0;
        shape1.graphics.xMax = 50;
        shape1.graphics.yMax = 50;
        container.addChild(shape1);

        const sprite = new Sprite();
        sprite.buttonMode = true;
        sprite.useHandCursor = true;
        const shape2 = new Shape();
        shape2.graphics.xMin = 0;
        shape2.graphics.yMin = 0;
        shape2.graphics.xMax = 100;
        shape2.graphics.yMax = 100;
        sprite.addChild(shape2);
        container.addChild(sprite);

        const hitObject = createHitObject(25, 25);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(true);
        // targets.pop()で後ろから取得されるのでspriteが先にチェックされる
        expect(hitObject.pointer).toBe("pointer");
        expect(hitObject.hit).toBe(sprite);
    });

    it("TextField子要素でヒットする場合はtrueを返す", () =>
    {
        vi.mocked(textFieldHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const textField = new TextField();
        container.addChild(textField);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(true);
    });

    it("input型TextFieldの場合pointerがtextになる", () =>
    {
        vi.mocked(textFieldHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const textField = new TextField();
        textField.type = "input";
        container.addChild(textField);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(true);
        expect(hitObject.pointer).toBe("text");
        expect(hitObject.hit).toBe(textField);
    });

    it("dynamic型TextFieldの場合pointerはautoのまま", () =>
    {
        vi.mocked(textFieldHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const textField = new TextField();
        textField.type = "dynamic";
        container.addChild(textField);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(true);
        // isTextでinputでない場合はpointer変更なし
        expect(hitObject.pointer).toBe("auto");
    });

    it("Video子要素でヒットする場合はtrueを返す", () =>
    {
        vi.mocked(videoHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const video = new Video(100, 100);
        container.addChild(video);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(true);
    });

    it("MovieClip子要素でヒットした場合hitにMovieClipが設定される", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const movieClip = new MovieClip();
        movieClip.buttonMode = true;
        movieClip.useHandCursor = true;
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        movieClip.addChild(shape);
        container.addChild(movieClip);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(true);
        // MovieClipはSpriteを継承、isSprite=trueでbuttonMode+useHandCursor=true
        expect(hitObject.pointer).toBe("pointer");
        expect(hitObject.hit).toBe(movieClip);
    });

    it("MovieClip子要素でbuttonMode=falseの場合pointerはautoのまま", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const movieClip = new MovieClip();
        // buttonModeはデフォルトfalse
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        movieClip.addChild(shape);
        container.addChild(movieClip);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(true);
        // isSprite=trueだがbuttonMode=falseなのでpointerは変更されない
        expect(hitObject.pointer).toBe("auto");
        expect(hitObject.hit).toBe(movieClip);
    });

    it("clipDepthを持つ子要素はクリップとして扱われる", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();

        // clip
        const clipShape = new Shape();
        clipShape.graphics.xMin = 0;
        clipShape.graphics.yMin = 0;
        clipShape.graphics.xMax = 100;
        clipShape.graphics.yMax = 100;
        clipShape.clipDepth = 10;
        container.addChild(clipShape);

        // target (clip内)
        const targetShape = new Shape();
        targetShape.graphics.xMin = 0;
        targetShape.graphics.yMin = 0;
        targetShape.graphics.xMax = 100;
        targetShape.graphics.yMax = 100;
        targetShape.placeId = 5;
        container.addChild(targetShape);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(true);
    });

    it("clipDepthの範囲外の子要素はクリップされない", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();

        // clip (depth:5まで)
        const clipShape = new Shape();
        clipShape.graphics.xMin = 0;
        clipShape.graphics.yMin = 0;
        clipShape.graphics.xMax = 10;
        clipShape.graphics.yMax = 10;
        clipShape.clipDepth = 5;
        container.addChild(clipShape);

        // clipDepthの範囲外 (placeId > clipDepth)
        const targetShape = new Shape();
        targetShape.graphics.xMin = 0;
        targetShape.graphics.yMin = 0;
        targetShape.graphics.xMax = 100;
        targetShape.graphics.yMax = 100;
        targetShape.placeId = 10;
        container.addChild(targetShape);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        // placeId > clipDepthなのでクリップから外れ、通常のヒット判定となる
        expect(result).toBe(true);
    });

    it("maskがDisplayObjectContainerの場合も正しくヒット判定される", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const maskContainer = new DisplayObjectContainer();
        const maskShape = new Shape();
        maskShape.graphics.xMin = 0;
        maskShape.graphics.yMin = 0;
        maskShape.graphics.xMax = 100;
        maskShape.graphics.yMax = 100;
        maskContainer.addChild(maskShape);
        container.mask = maskContainer;

        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        container.addChild(shape);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(true);
    });

    it("maskがTextFieldの場合も正しくヒット判定される", () =>
    {
        vi.mocked(textFieldHitTestMock).mockReturnValue(true);
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const maskTextField = new TextField();
        container.mask = maskTextField;

        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        container.addChild(shape);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(true);
    });

    it("maskがVideoの場合も正しくヒット判定される", () =>
    {
        vi.mocked(videoHitTestMock).mockReturnValue(true);
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const maskVideo = new Video(100, 100);
        container.mask = maskVideo;

        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        container.addChild(shape);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(true);
    });

    it("hit_objectのpointerが既にauto以外の場合は上書きされない", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const sprite = new Sprite();
        sprite.buttonMode = true;
        sprite.useHandCursor = true;
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        sprite.addChild(shape);
        container.addChild(sprite);

        const hitObject = createHitObject(50, 50);
        hitObject.pointer = "text";

        execute(container, context, matrix, hitObject);

        // pointerが既にauto以外なので上書きされない
        expect(hitObject.pointer).toBe("text");
    });

    it("hit_objectのhitが既に設定されている場合は上書きされない", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const sprite = new Sprite();
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        sprite.addChild(shape);
        container.addChild(sprite);

        const existingHit = new Sprite();
        const hitObject = createHitObject(50, 50);
        hitObject.hit = existingHit;

        execute(container, context, matrix, hitObject);

        // hitが既に設定されているので上書きされない
        expect(hitObject.hit).toBe(existingHit);
    });

    it("mouse_children引数のデフォルト値はtrue", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const sprite = new Sprite();
        sprite.buttonMode = true;
        sprite.useHandCursor = true;
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        sprite.addChild(shape);
        container.addChild(sprite);

        const hitObject = createHitObject(50, 50);

        // mouse_children引数を省略
        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(true);
        expect(hitObject.pointer).toBe("pointer");
        expect(hitObject.hit).toBe(sprite);
    });

    it("全子要素が非表示の場合はfalseを返す", () =>
    {
        const container = new DisplayObjectContainer();
        const shape1 = new Shape();
        shape1.graphics.xMin = 0;
        shape1.graphics.yMin = 0;
        shape1.graphics.xMax = 100;
        shape1.graphics.yMax = 100;
        shape1.visible = false;
        container.addChild(shape1);

        const shape2 = new Shape();
        shape2.graphics.xMin = 0;
        shape2.graphics.yMin = 0;
        shape2.graphics.xMax = 100;
        shape2.graphics.yMax = 100;
        shape2.visible = false;
        container.addChild(shape2);

        const hitObject = createHitObject(50, 50);

        const result = execute(container, context, matrix, hitObject);

        expect(result).toBe(false);
    });

    it("hitAreaのヒットでmouseChildren=falseの場合hitが設定されない", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const sprite = new Sprite();
        sprite.buttonMode = true;
        sprite.useHandCursor = true;
        sprite.mouseChildren = false;

        const hitAreaSprite = new Sprite();
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        hitAreaSprite.addChild(shape);
        sprite.hitArea = hitAreaSprite;

        const dummyShape = new Shape();
        dummyShape.graphics.xMin = 0;
        dummyShape.graphics.yMin = 0;
        dummyShape.graphics.xMax = 1;
        dummyShape.graphics.yMax = 1;
        sprite.addChild(dummyShape);

        const hitObject = createHitObject(50, 50);

        const result = execute(sprite, context, matrix, hitObject);

        expect(result).toBe(true);
        // mouseChildren=falseなのでhitは設定されない
        expect(hitObject.hit).toBe(null);
    });

    it("hitAreaのヒットでmouseEnabled=falseの場合hitが設定されない", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const sprite = new Sprite();
        sprite.buttonMode = true;
        sprite.useHandCursor = true;
        sprite.mouseEnabled = false;

        const hitAreaSprite = new Sprite();
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        hitAreaSprite.addChild(shape);
        sprite.hitArea = hitAreaSprite;

        const dummyShape = new Shape();
        dummyShape.graphics.xMin = 0;
        dummyShape.graphics.yMin = 0;
        dummyShape.graphics.xMax = 1;
        dummyShape.graphics.yMax = 1;
        sprite.addChild(dummyShape);

        const hitObject = createHitObject(50, 50);

        const result = execute(sprite, context, matrix, hitObject);

        expect(result).toBe(true);
        // mouseEnabled=falseなのでhitは設定されない
        expect(hitObject.hit).toBe(null);
    });

    it("Sprite子要素でuseHandCursor=falseの場合pointerはautoのまま", () =>
    {
        vi.mocked(shapeHitTestMock).mockReturnValue(true);

        const container = new DisplayObjectContainer();
        const sprite = new Sprite();
        sprite.buttonMode = true;
        sprite.useHandCursor = false;
        const shape = new Shape();
        shape.graphics.xMin = 0;
        shape.graphics.yMin = 0;
        shape.graphics.xMax = 100;
        shape.graphics.yMax = 100;
        sprite.addChild(shape);
        container.addChild(sprite);

        const hitObject = createHitObject(50, 50);

        execute(container, context, matrix, hitObject);

        // buttonMode=true, useHandCursor=false → isSpriteケースに入るがcondition未達
        // pointerが変更されずautoのまま
        expect(hitObject.pointer).toBe("auto");
        expect(hitObject.hit).toBe(sprite);
    });
});