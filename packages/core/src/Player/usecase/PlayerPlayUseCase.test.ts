import { execute } from "./PlayerPlayUseCase";
import { describe, expect, it } from "vitest";
import { $player } from "../../Player";

describe("PlayerPlayUseCase.js test", () =>
{
    it("execute test case", () =>
    {
        $player.stopFlag = true;
        $player.timerId = -1;
        
        expect($player.stopFlag).toBe(true);
        expect($player.timerId).toBe(-1);
        execute();
        expect($player.stopFlag).toBe(false);
        expect($player.timerId).not.toBe(-1);
    });
});