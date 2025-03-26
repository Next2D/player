import type { IDictionaryTag } from "../../interface/IDictionaryTag";
import { execute } from "./DisplayObjectBaseBuildService";
import { DisplayObject } from "../../DisplayObject";
import { MovieClip } from "../../MovieClip";
import { LoaderInfo } from "../../LoaderInfo";
import { describe, expect, it } from "vitest";
import {
    $loaderInfoMap,
    $rootMap
} from "../../DisplayObjectUtil";

describe("DisplayObjectBaseBuildService.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();
        const movieClip = new MovieClip();

        $loaderInfoMap.set(movieClip, new LoaderInfo());

        const mockTag = {
            "characterId": 1,
            "clipDepth": 1,
            "startFrame": 2,
            "endFrame": 10,
            "name": "test"
        } as IDictionaryTag;

        expect(displayObject.dictionaryId).toBe(-1);
        expect(displayObject.characterId).toBe(-1);
        expect(displayObject.clipDepth).toBe(0);
        expect(displayObject.startFrame).toBe(1);
        expect(displayObject.endFrame).toBe(0);
        expect(displayObject.name).toBe("");
        expect(displayObject.placeId).toBe(-1);
        expect(displayObject.parent).toBe(null);
        expect($rootMap.has(displayObject)).toBe(false);
        expect($loaderInfoMap.has(displayObject)).toBe(false);

        execute(displayObject, 99, mockTag, movieClip, 22);

        expect(displayObject.dictionaryId).toBe(99);
        expect(displayObject.characterId).toBe(mockTag.characterId);
        expect(displayObject.clipDepth).toBe(mockTag.clipDepth);
        expect(displayObject.startFrame).toBe(mockTag.startFrame);
        expect(displayObject.endFrame).toBe(mockTag.endFrame);
        expect(displayObject.name).toBe(mockTag.name);
        expect(displayObject.placeId).toBe(22);
        expect(displayObject.parent).toBe(movieClip);
        expect($rootMap.has(displayObject)).toBe(true);
        expect($loaderInfoMap.has(displayObject)).toBe(true);

        $rootMap.delete(displayObject);
        $loaderInfoMap.delete(movieClip);
    });
});