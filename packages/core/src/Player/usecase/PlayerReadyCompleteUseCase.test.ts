import { execute } from "./PlayerReadyCompleteUseCase";
import { describe, expect, it, vi } from "vitest";
import { stage } from "@next2d/display";
import { $player } from "../../Player";

describe("PlayerReadyCompleteUseCase.js test", () =>
{
    it("execute test case", () =>
    {
        stage.changed = true;
        $player.stopFlag = true;
        
        expect(stage.changed).toBe(true);
        expect($player.stopFlag).toBe(true);

        execute();

        expect(stage.changed).toBe(false);
        expect($player.stopFlag).toBe(false);
    });
});