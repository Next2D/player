import { execute } from "./ShaderManagerUseProgramService";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { IProgramObject } from "../../../interface/IProgramObject";

vi.mock("../../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../../WebGLUtil.ts")>();
    return {
        ...mod,
        $gl: {
            useProgram: vi.fn()
        }
    };
});

describe("ShaderManagerUseProgramService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should use program when program id is different", () =>
    {
        const mockProgramObject: IProgramObject = {
            id: 100,
            resource: {} as WebGLProgram
        };

        expect(() => execute(mockProgramObject)).not.toThrow();
    });

    it("test case - should not throw when same program id", () =>
    {
        const mockProgramObject: IProgramObject = {
            id: 101,
            resource: {} as WebGLProgram
        };

        execute(mockProgramObject);
        expect(() => execute(mockProgramObject)).not.toThrow();
    });

    it("test case - should switch to different program", () =>
    {
        const mockProgramObject1: IProgramObject = {
            id: 102,
            resource: { name: "program1" } as unknown as WebGLProgram
        };
        const mockProgramObject2: IProgramObject = {
            id: 103,
            resource: { name: "program2" } as unknown as WebGLProgram
        };

        expect(() => {
            execute(mockProgramObject1);
            execute(mockProgramObject2);
        }).not.toThrow();
    });
});
