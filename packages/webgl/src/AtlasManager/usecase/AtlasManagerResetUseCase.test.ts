import { execute } from "./AtlasManagerResetUseCase";
import { execute as atlasManagerCreateNodeService } from "../service/AtlasManagerCreateNodeService";
import { $rootNodes, $activeAtlasIndex, $setActiveAtlasIndex } from "../../AtlasManager";
import { describe, expect, it } from "vitest";

describe("AtlasManagerResetUseCase.js method test", () =>
{
    it("test case", () =>
    {
        $rootNodes.length = 0;
        atlasManagerCreateNodeService(100, 200);
        
        expect($rootNodes.length).toBe(1);
        expect($activeAtlasIndex).toBe(0);

        $setActiveAtlasIndex(1);
        expect($activeAtlasIndex).toBe(1);

        execute();
        expect($activeAtlasIndex).toBe(0);
        expect($rootNodes.length).toBe(0);
    });
});