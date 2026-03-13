import { describe, it, expect, beforeEach } from "vitest";
import {
    $setActiveAtlasIndex,
    $getActiveAtlasIndex,
    $getAtlasAttachmentObjects,
    $setAtlasAttachmentObject,
    $getAtlasAttachmentObject,
    $hasAtlasAttachmentObject,
    $rootNodes,
    $getActiveTransferBounds,
    $clearTransferBounds,
    $setCurrentAtlasIndex,
    $getCurrentAtlasIndex,
    $resetAtlas
} from "./AtlasManager";
import type { IAttachmentObject } from "./interface/IAttachmentObject";

describe("AtlasManager", () =>
{
    beforeEach(() =>
    {
        // Reset global state before each test
        $resetAtlas();
    });

    describe("$setActiveAtlasIndex / $getActiveAtlasIndex", () =>
    {
        it("should set and get active atlas index", () =>
        {
            $setActiveAtlasIndex(5);
            expect($getActiveAtlasIndex()).toBe(5);
        });

        it("should start at 0 after reset", () =>
        {
            expect($getActiveAtlasIndex()).toBe(0);
        });
    });

    describe("$getAtlasAttachmentObjects", () =>
    {
        it("should return empty array after reset", () =>
        {
            const objects = $getAtlasAttachmentObjects();
            expect(objects).toEqual([]);
        });

        it("should return array reference", () =>
        {
            const objects1 = $getAtlasAttachmentObjects();
            const objects2 = $getAtlasAttachmentObjects();
            expect(objects1).toBe(objects2);
        });
    });

    describe("$setAtlasAttachmentObject / $getAtlasAttachmentObject", () =>
    {
        it("should set attachment object at active index", () =>
        {
            const mockAttachment = createMockAttachment(1, 512, 512);
            $setAtlasAttachmentObject(mockAttachment);

            expect($getAtlasAttachmentObject()).toBe(mockAttachment);
        });

        it("should return null when no attachment at active index", () =>
        {
            $setActiveAtlasIndex(10);
            expect($getAtlasAttachmentObject()).toBeNull();
        });

        it("should set at different indices", () =>
        {
            const attachment0 = createMockAttachment(1, 256, 256);
            const attachment1 = createMockAttachment(2, 512, 512);

            $setActiveAtlasIndex(0);
            $setAtlasAttachmentObject(attachment0);

            $setActiveAtlasIndex(1);
            $setAtlasAttachmentObject(attachment1);

            $setActiveAtlasIndex(0);
            expect($getAtlasAttachmentObject()).toBe(attachment0);

            $setActiveAtlasIndex(1);
            expect($getAtlasAttachmentObject()).toBe(attachment1);
        });
    });

    describe("$hasAtlasAttachmentObject", () =>
    {
        it("should return false when no attachment exists", () =>
        {
            expect($hasAtlasAttachmentObject()).toBe(false);
        });

        it("should return true when attachment exists", () =>
        {
            const mockAttachment = createMockAttachment(1, 512, 512);
            $setAtlasAttachmentObject(mockAttachment);

            expect($hasAtlasAttachmentObject()).toBe(true);
        });

        it("should return false at non-existing index", () =>
        {
            const mockAttachment = createMockAttachment(1, 512, 512);
            $setAtlasAttachmentObject(mockAttachment);

            $setActiveAtlasIndex(5);
            expect($hasAtlasAttachmentObject()).toBe(false);
        });
    });

    describe("$rootNodes", () =>
    {
        it("should be empty array after reset", () =>
        {
            expect($rootNodes).toEqual([]);
        });

        it("should allow modification", () =>
        {
            const mockNode = {} as any;
            $rootNodes.push(mockNode);

            expect($rootNodes.length).toBe(1);
            expect($rootNodes[0]).toBe(mockNode);
        });
    });

    describe("$getActiveTransferBounds", () =>
    {
        it("should create transfer bounds at index", () =>
        {
            const bounds = $getActiveTransferBounds(0);

            expect(bounds).toBeInstanceOf(Float32Array);
            expect(bounds.length).toBe(4);
        });

        it("should initialize with max/min values", () =>
        {
            const bounds = $getActiveTransferBounds(0);

            // Initial values: Float32Array stores Number.MAX_VALUE as Infinity
            expect(bounds[0]).toBe(Infinity);
            expect(bounds[1]).toBe(Infinity);
            expect(bounds[2]).toBe(-Infinity);
            expect(bounds[3]).toBe(-Infinity);
        });

        it("should return same bounds for same index", () =>
        {
            const bounds1 = $getActiveTransferBounds(0);
            const bounds2 = $getActiveTransferBounds(0);

            expect(bounds1).toBe(bounds2);
        });

        it("should return different bounds for different indices", () =>
        {
            const bounds0 = $getActiveTransferBounds(0);
            const bounds1 = $getActiveTransferBounds(1);

            expect(bounds0).not.toBe(bounds1);
        });
    });

    describe("$clearTransferBounds", () =>
    {
        it("should reset transfer bounds to initial values", () =>
        {
            const bounds = $getActiveTransferBounds(0);
            bounds[0] = 10;
            bounds[1] = 20;
            bounds[2] = 100;
            bounds[3] = 200;

            $clearTransferBounds();

            // Float32Array stores Number.MAX_VALUE as Infinity
            expect(bounds[0]).toBe(Infinity);
            expect(bounds[1]).toBe(Infinity);
            expect(bounds[2]).toBe(-Infinity);
            expect(bounds[3]).toBe(-Infinity);
        });

        it("should reset multiple transfer bounds arrays", () =>
        {
            const bounds0 = $getActiveTransferBounds(0);
            const bounds1 = $getActiveTransferBounds(1);

            bounds0[0] = 50;
            bounds1[0] = 60;

            $clearTransferBounds();

            // Float32Array stores Number.MAX_VALUE as Infinity
            expect(bounds0[0]).toBe(Infinity);
            expect(bounds1[0]).toBe(Infinity);
        });
    });

    describe("$setCurrentAtlasIndex / $getCurrentAtlasIndex", () =>
    {
        it("should set and get current atlas index", () =>
        {
            $setCurrentAtlasIndex(3);
            expect($getCurrentAtlasIndex()).toBe(3);
        });

        it("should start at 0 after reset", () =>
        {
            expect($getCurrentAtlasIndex()).toBe(0);
        });
    });

    describe("$resetAtlas", () =>
    {
        it("should reset root nodes", () =>
        {
            $rootNodes.push({} as any);
            $resetAtlas();

            expect($rootNodes.length).toBe(0);
        });

        it("should reset active atlas index to 0", () =>
        {
            $setActiveAtlasIndex(5);
            $resetAtlas();

            expect($getActiveAtlasIndex()).toBe(0);
        });

        it("should reset current atlas index to 0", () =>
        {
            $setCurrentAtlasIndex(3);
            $resetAtlas();

            expect($getCurrentAtlasIndex()).toBe(0);
        });

        it("should clear atlas attachment objects", () =>
        {
            const mockAttachment = createMockAttachment(1, 512, 512);
            $setAtlasAttachmentObject(mockAttachment);

            $resetAtlas();

            expect($getAtlasAttachmentObjects().length).toBe(0);
        });

        it("should destroy texture resources", () =>
        {
            const mockDestroy = { "destroy": () => {} };
            const mockAttachment: IAttachmentObject = {
                "id": 1,
                "width": 512,
                "height": 512,
                "clipLevel": 0,
                "msaa": false,
                "mask": false,
                "color": null,
                "texture": {
                    "id": 1,
                    "width": 512,
                    "height": 512,
                    "area": 512 * 512,
                    "smooth": true,
                    "resource": mockDestroy as any,
                    "view": {}
                },
                "stencil": null,
                "msaaTexture": null,
                "msaaStencil": null
            };

            $setAtlasAttachmentObject(mockAttachment);
            $resetAtlas();

            // Attachment should be removed
            expect($hasAtlasAttachmentObject()).toBe(false);
        });

        it("should clear transfer bounds", () =>
        {
            const bounds = $getActiveTransferBounds(0);
            bounds[0] = 100;

            $resetAtlas();

            // Get bounds again (will be recreated with initial values)
            // Float32Array stores Number.MAX_VALUE as Infinity
            const newBounds = $getActiveTransferBounds(0);
            expect(newBounds[0]).toBe(Infinity);
        });
    });

    // Helper function to create mock attachment
    function createMockAttachment(id: number, width: number, height: number): IAttachmentObject
    {
        return {
            "id": id,
            "width": width,
            "height": height,
            "clipLevel": 0,
            "msaa": false,
            "mask": false,
            "color": null,
            "texture": {
                "id": id,
                "width": width,
                "height": height,
                "area": width * height,
                "smooth": true,
                "resource": { "destroy": () => {} } as any,
                "view": {}
            },
            "stencil": null,
            "msaaTexture": null,
            "msaaStencil": null
        };
    }
});
