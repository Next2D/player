import { Stage, stage } from "./Stage";
import { Sprite } from "./Sprite";
import { describe, expect, it, beforeEach } from "vitest";

describe("Stage class test", () =>
{
    let testStage: Stage;

    beforeEach(() =>
    {
        testStage = new Stage();
    });

    describe("constructor test", () =>
    {
        it("should initialize with default values", () =>
        {
            expect(testStage.stageWidth).toBe(0);
            expect(testStage.stageHeight).toBe(0);
            expect(testStage.frameRate).toBe(1);
            expect(testStage.rendererScale).toBe(1);
            expect(testStage.rendererWidth).toBe(0);
            expect(testStage.rendererHeight).toBe(0);
            expect(testStage.backgroundColor).toBe(-1);
        });
    });

    describe("backgroundColor property test", () =>
    {
        it("should set background color from hex string", () =>
        {
            testStage.backgroundColor = "#FF0000";
            expect(testStage.backgroundColor).toBe(0xFF0000);
        });

        it("should set background color from hex string without #", () =>
        {
            testStage.backgroundColor = "00FF00";
            expect(testStage.backgroundColor).toBe(0x00FF00);
        });

        it("should set transparent background color", () =>
        {
            testStage.backgroundColor = "transparent";
            expect(testStage.backgroundColor).toBe(-1);
        });

        it("should handle white color", () =>
        {
            testStage.backgroundColor = "#FFFFFF";
            expect(testStage.backgroundColor).toBe(0xFFFFFF);
        });

        it("should handle black color", () =>
        {
            testStage.backgroundColor = "#000000";
            expect(testStage.backgroundColor).toBe(0x000000);
        });
    });

    describe("pointer property test", () =>
    {
        it("should return pointer object", () =>
        {
            const pointer = testStage.pointer;
            expect(pointer).toBeDefined();
            expect(typeof pointer).toBe("object");
        });
    });

    describe("ready property test", () =>
    {
        it("should not set ready when false", () =>
        {
            testStage.ready = false;
            expect(testStage["_$ready"]).toBe(false);
        });

        it("should set ready to true", () =>
        {
            testStage.ready = true;
            expect(testStage["_$ready"]).toBe(true);
        });

        it("should not change ready once set to true", () =>
        {
            testStage.ready = true;
            expect(testStage["_$ready"]).toBe(true);
            
            testStage.ready = true;
            expect(testStage["_$ready"]).toBe(true);
        });
    });

    describe("addChild method test", () =>
    {
        it("should add child to stage", () =>
        {
            const sprite = new Sprite();
            const result = testStage.addChild(sprite);
            
            expect(result).toBe(sprite);
            expect(testStage.numChildren).toBe(1);
            expect(testStage.getChildAt(0)).toBe(sprite);
        });

        it("should return the added display object", () =>
        {
            const sprite = new Sprite();
            const returnedSprite = testStage.addChild(sprite);
            
            expect(returnedSprite).toBe(sprite);
        });

        it("should add multiple children", () =>
        {
            const sprite1 = new Sprite();
            const sprite2 = new Sprite();
            
            testStage.addChild(sprite1);
            testStage.addChild(sprite2);
            
            expect(testStage.numChildren).toBe(2);
            expect(testStage.getChildAt(0)).toBe(sprite1);
            expect(testStage.getChildAt(1)).toBe(sprite2);
        });
    });

    describe("stage width and height test", () =>
    {
        it("should set and get stageWidth", () =>
        {
            testStage.stageWidth = 800;
            expect(testStage.stageWidth).toBe(800);
        });

        it("should set and get stageHeight", () =>
        {
            testStage.stageHeight = 600;
            expect(testStage.stageHeight).toBe(600);
        });
    });

    describe("frameRate property test", () =>
    {
        it("should set and get frameRate", () =>
        {
            testStage.frameRate = 60;
            expect(testStage.frameRate).toBe(60);
        });

        it("should initialize with frameRate 1", () =>
        {
            expect(testStage.frameRate).toBe(1);
        });
    });

    describe("renderer properties test", () =>
    {
        it("should set and get rendererScale", () =>
        {
            testStage.rendererScale = 2;
            expect(testStage.rendererScale).toBe(2);
        });

        it("should set and get rendererWidth", () =>
        {
            testStage.rendererWidth = 1600;
            expect(testStage.rendererWidth).toBe(1600);
        });

        it("should set and get rendererHeight", () =>
        {
            testStage.rendererHeight = 1200;
            expect(testStage.rendererHeight).toBe(1200);
        });
    });

    describe("exported stage instance test", () =>
    {
        it("should export a stage instance", () =>
        {
            expect(stage).toBeDefined();
            expect(stage).toBeInstanceOf(Stage);
        });

        it("should have default values", () =>
        {
            expect(stage.stageWidth).toBe(0);
            expect(stage.stageHeight).toBe(0);
            expect(stage.frameRate).toBe(1);
        });
    });
});
