import { execute } from "./PlayerResizeEventUseCase";
import { describe, expect, it, vi } from "vitest";
import {
    $renderMatrix,
    $setMainElement
} from "../../CoreUtil";
import { stage } from "@next2d/display";
import { $player } from "../../Player";

describe("PlayerResizeEventUseCase.js test", () =>
{
    it("execute test case", () =>
    {
        const parent  = document.createElement("div");
        const element = document.createElement("div");
        parent.appendChild(element);
        $setMainElement(element);

        stage.rendererScale = 10;
        stage.changed = false;
        stage.stageWidth = 100;
        stage.stageHeight = 100;
        $player.rendererWidth = 100;
        $player.rendererHeight = 100;
        $player.screenWidth = 100;
        $player.screenHeight = 100;

        expect(element.style.width).toBe("");
        expect(element.style.height).toBe("");

        expect(stage.stageWidth).toBe(100);
        expect(stage.stageHeight).toBe(100);
        expect(stage.changed).toBe(false);
        expect(stage.rendererScale).toBe(10);

        expect($player.rendererWidth).toBe(100);
        expect($player.rendererHeight).toBe(100);
        expect($player.screenWidth).toBe(100);
        expect($player.screenHeight).toBe(100);

        expect($renderMatrix[0]).toBe(1);
        expect($renderMatrix[1]).toBe(0);
        expect($renderMatrix[2]).toBe(0);
        expect($renderMatrix[3]).toBe(1);
        expect($renderMatrix[4]).toBe(0);
        expect($renderMatrix[5]).toBe(0);

        execute();
        
        expect(element.style.width).toBe("0px");
        expect(element.style.height).toBe("0px");

        expect(stage.changed).toBe(true);
        expect(stage.rendererScale).toBe(0);

        expect($player.screenWidth).toBe(0);
        expect($player.screenHeight).toBe(0);

        expect($renderMatrix[0]).toBe(0);
        expect($renderMatrix[1]).toBe(0);
        expect($renderMatrix[2]).toBe(0);
        expect($renderMatrix[3]).toBe(0);
        expect($renderMatrix[4]).toBe(0);
        expect($renderMatrix[5]).toBe(0);

        expect(stage.rendererWidth).toBe(0);
        expect(stage.rendererHeight).toBe(0);
        expect($player.rendererWidth).toBe(0);
        expect($player.rendererHeight).toBe(0);
    });
});