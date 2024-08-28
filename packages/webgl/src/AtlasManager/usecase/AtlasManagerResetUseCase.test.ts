import { execute } from "./AtlasManagerResetUseCase";
import { execute as atlasManagerCreateNodeService } from "../service/AtlasManagerCreateNodeService";
import { $rootNodes, $getActiveAtlasIndex, $setActiveAtlasIndex } from "../../AtlasManager";
import { describe, expect, it } from "vitest";

describe("AtlasManagerResetUseCase.js method test", () =>
{
    it("test case", () =>
    {
        $rootNodes.length = 0;
        atlasManagerCreateNodeService(100, 200);
        
        expect($rootNodes.length).toBe(1);
        expect($getActiveAtlasIndex()).toBe(0);

        $setActiveAtlasIndex(1);
        expect($getActiveAtlasIndex()).toBe(1);

        execute();
        expect($getActiveAtlasIndex()).toBe(0);
        expect($rootNodes.length).toBe(0);
    });
});