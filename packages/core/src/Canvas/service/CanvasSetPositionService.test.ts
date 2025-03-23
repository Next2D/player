import { execute } from "./CanvasSetPositionService";
import { $mainCanvasPosition } from "@next2d/text";
import { $setMainElement } from "../../CoreUtil";
import { stage } from "@next2d/display";
import { describe, expect, it } from "vitest";

describe("CanvasSetPositionService.js test", () =>
{
    it("execute test case", () =>
    {
        $mainCanvasPosition.x = 0;
        $mainCanvasPosition.y = 0;

        const div = document.createElement("div");
        div.appendChild(document.createElement("canvas"));
        $setMainElement(div);
        
        expect($mainCanvasPosition.x).toBe(0);
        expect($mainCanvasPosition.y).toBe(0);

        stage.rendererWidth  = 100;
        stage.rendererHeight = 200;
        execute();

        expect($mainCanvasPosition.x).toBe(-50);
        expect($mainCanvasPosition.y).toBe(-100);

        stage.rendererWidth  = 0;
        stage.rendererHeight = 0;
    });
});