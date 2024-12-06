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
        movieClip.$actions = new Map();
        movieClip.$actions.set(1, [() => { result = true; }]);

        expect($actions.length).toBe(1);
        expect(result).toBe(false);
        
        execute();
        expect($actions.length).toBe(0);
        expect(result).toBe(true);
    });
});