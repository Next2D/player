import { execute } from "./ContextStrokeUseCase";
import { describe, expect, it, beforeEach, vi } from "vitest";

describe("ContextStrokeUseCase.js method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should execute stroke drawing", () =>
    {
        expect(() => {
            execute();
        }).not.toThrow();
    });
});
