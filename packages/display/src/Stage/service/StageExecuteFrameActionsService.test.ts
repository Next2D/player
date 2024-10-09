import { execute } from "./StageExecuteFrameActionsService";
import { $actions } from "../../DisplayObjectUtil";
import { MovieClip } from "../../MovieClip";
import { describe, expect, it } from "vitest";

describe("StageExecuteFrameActionsService.js test", () =>
{
    it("execute test case", () =>
    {
        const movieClip = new MovieClip();
        $actions.push(movieClip);
        
        let result = false;
        const map = new Map();
        map.set(1, [() => { result = true; }]);
        $actions.push(map);

        expect($actions.length).toBe(2);
        expect(result).toBe(false);
        
        execute();
        expect($actions.length).toBe(0);
        expect(result).toBe(true);
    });
});