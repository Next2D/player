import { execute } from "./PlayerStopService";
import { $player } from "../../Player";
import { describe, expect, it } from "vitest";

describe("PlayerStopService.js test", () =>
{
    it("execute test case1", () =>
    {
        $player.timerId = 1;
        $player.stopFlag = false;
        
        expect($player.stopFlag).toBe(false);
        expect($player.timerId).toBe(1);

        execute();

        expect($player.stopFlag).toBe(true);
        expect($player.timerId).toBe(-1);
    });
});