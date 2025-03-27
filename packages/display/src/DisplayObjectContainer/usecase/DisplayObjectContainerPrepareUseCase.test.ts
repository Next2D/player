import { execute } from "./DisplayObjectContainerPrepareUseCase";
import { describe, expect, it } from "vitest";
import { MovieClip } from "../../MovieClip";

describe("DisplayObjectContainerPrepareUseCase.js test", () =>
{
    it("execute test", () =>
    {
        const container = new MovieClip();
        const movieClip = container.addChild(new MovieClip());

        expect(movieClip.$canSound).toBe(true);
        expect(movieClip.$canAction).toBe(true);
        
        execute(container);
        
        expect(movieClip.$canSound).toBe(false);
        expect(movieClip.$canAction).toBe(false);
    });
});