import { describe, it, expect } from "vitest";
import { execute } from "./AttachmentManagerCreateAttachmentObjectService";

describe("AttachmentManagerCreateAttachmentObjectService", () =>
{
    describe("basic creation", () =>
    {
        it("should create attachment object with incremented id", () =>
        {
            const idCounter = { attachmentId: 1 };

            const result = execute(idCounter);

            expect(result.id).toBe(1);
            expect(idCounter.attachmentId).toBe(2);
        });

        it("should increment id for each creation", () =>
        {
            const idCounter = { attachmentId: 5 };

            const result1 = execute(idCounter);
            const result2 = execute(idCounter);
            const result3 = execute(idCounter);

            expect(result1.id).toBe(5);
            expect(result2.id).toBe(6);
            expect(result3.id).toBe(7);
            expect(idCounter.attachmentId).toBe(8);
        });
    });

    describe("default values", () =>
    {
        it("should initialize width to 0", () =>
        {
            const idCounter = { attachmentId: 1 };

            const result = execute(idCounter);

            expect(result.width).toBe(0);
        });

        it("should initialize height to 0", () =>
        {
            const idCounter = { attachmentId: 1 };

            const result = execute(idCounter);

            expect(result.height).toBe(0);
        });

        it("should initialize clipLevel to 0", () =>
        {
            const idCounter = { attachmentId: 1 };

            const result = execute(idCounter);

            expect(result.clipLevel).toBe(0);
        });

        it("should initialize msaa to false", () =>
        {
            const idCounter = { attachmentId: 1 };

            const result = execute(idCounter);

            expect(result.msaa).toBe(false);
        });

        it("should initialize mask to false", () =>
        {
            const idCounter = { attachmentId: 1 };

            const result = execute(idCounter);

            expect(result.mask).toBe(false);
        });

        it("should initialize color to null", () =>
        {
            const idCounter = { attachmentId: 1 };

            const result = execute(idCounter);

            expect(result.color).toBeNull();
        });

        it("should initialize texture to null", () =>
        {
            const idCounter = { attachmentId: 1 };

            const result = execute(idCounter);

            expect(result.texture).toBeNull();
        });

        it("should initialize stencil to null", () =>
        {
            const idCounter = { attachmentId: 1 };

            const result = execute(idCounter);

            expect(result.stencil).toBeNull();
        });

        it("should initialize msaaTexture to null", () =>
        {
            const idCounter = { attachmentId: 1 };

            const result = execute(idCounter);

            expect(result.msaaTexture).toBeNull();
        });

        it("should initialize msaaStencil to null", () =>
        {
            const idCounter = { attachmentId: 1 };

            const result = execute(idCounter);

            expect(result.msaaStencil).toBeNull();
        });
    });

    describe("object independence", () =>
    {
        it("should create independent objects", () =>
        {
            const idCounter = { attachmentId: 1 };

            const result1 = execute(idCounter);
            const result2 = execute(idCounter);

            result1.width = 100;
            result1.height = 200;

            expect(result2.width).toBe(0);
            expect(result2.height).toBe(0);
        });
    });
});
