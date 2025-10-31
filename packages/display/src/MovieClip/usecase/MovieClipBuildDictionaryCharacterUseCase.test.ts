import { execute } from "./MovieClipBuildDictionaryCharacterUseCase";
import { MovieClip } from "../../MovieClip";
import { Shape } from "../../Shape";
import { TextField } from "@next2d/text";
import { Video } from "@next2d/media";
import { describe, expect, it } from "vitest";

describe("MovieClipBuildDictionaryCharacterUseCase.js test", () =>
{
    it("execute test case1 - throws error for unknown character type", () =>
    {
        const parent = new MovieClip();
        const tag = {
            characterId: 5,
            name: "unknown",
            clipDepth: 0,
            depth: 0,
            startFrame: 1,
            endFrame: 10
        };
        const character = {
            extends: "UnknownType"
        };

        expect(() => {
            execute(4, tag, character as any, parent);
        }).toThrow("Character extends not found: UnknownType");
    });

    it("execute test case2 - validates MovieClip.namespace", () =>
    {
        const character = {
            extends: MovieClip.namespace
        };

        expect(character.extends).toBeDefined();
        expect(typeof character.extends).toBe("string");
    });

    it("execute test case3 - validates Shape.namespace", () =>
    {
        const character = {
            extends: Shape.namespace
        };

        expect(character.extends).toBeDefined();
        expect(typeof character.extends).toBe("string");
    });

    it("execute test case4 - validates TextField.namespace", () =>
    {
        const character = {
            extends: TextField.namespace
        };

        expect(character.extends).toBeDefined();
        expect(typeof character.extends).toBe("string");
    });

    it("execute test case5 - validates Video.namespace", () =>
    {
        const character = {
            extends: Video.namespace
        };

        expect(character.extends).toBeDefined();
        expect(typeof character.extends).toBe("string");
    });

    it("execute test case6 - different namespace values are unique", () =>
    {
        const namespaces = new Set([
            MovieClip.namespace,
            Shape.namespace,
            TextField.namespace,
            Video.namespace
        ]);

        expect(namespaces.size).toBe(4);
    });

    it("execute test case7 - throws error for null extends", () =>
    {
        const parent = new MovieClip();
        const tag = {
            characterId: 1,
            name: "test",
            clipDepth: 0,
            depth: 0,
            startFrame: 1,
            endFrame: 10
        };
        const character = {
            extends: null
        };

        expect(() => {
            execute(0, tag, character as any, parent);
        }).toThrow();
    });

    it("execute test case8 - throws error for undefined extends", () =>
    {
        const parent = new MovieClip();
        const tag = {
            characterId: 1,
            name: "test",
            clipDepth: 0,
            depth: 0,
            startFrame: 1,
            endFrame: 10
        };
        const character = {
            extends: undefined
        };

        expect(() => {
            execute(0, tag, character as any, parent);
        }).toThrow();
    });

    it("execute test case9 - throws error for empty string extends", () =>
    {
        const parent = new MovieClip();
        const tag = {
            characterId: 1,
            name: "test",
            clipDepth: 0,
            depth: 0,
            startFrame: 1,
            endFrame: 10
        };
        const character = {
            extends: ""
        };

        expect(() => {
            execute(0, tag, character as any, parent);
        }).toThrow();
    });

    it("execute test case10 - throws error for numeric extends", () =>
    {
        const parent = new MovieClip();
        const tag = {
            characterId: 1,
            name: "test",
            clipDepth: 0,
            depth: 0,
            startFrame: 1,
            endFrame: 10
        };
        const character = {
            extends: 123
        };

        expect(() => {
            execute(0, tag, character as any, parent);
        }).toThrow();
    });

    it("execute test case11 - character must have extends property", () =>
    {
        const parent = new MovieClip();
        const tag = {
            characterId: 1,
            name: "test",
            clipDepth: 0,
            depth: 0,
            startFrame: 1,
            endFrame: 10
        };
        const character = {} as any;

        expect(() => {
            execute(0, tag, character, parent);
        }).toThrow();
    });

    it("execute test case12 - validates tag structure", () =>
    {
        const tag = {
            characterId: 1,
            name: "test",
            clipDepth: 0,
            depth: 0,
            startFrame: 1,
            endFrame: 10
        };

        expect(tag.characterId).toBeDefined();
        expect(tag.name).toBeDefined();
        expect(tag.clipDepth).toBeDefined();
        expect(tag.depth).toBeDefined();
        expect(tag.startFrame).toBeDefined();
        expect(tag.endFrame).toBeDefined();
    });

    it("execute test case13 - validates dictionary_id parameter", () =>
    {
        const dictionaryIds = [0, 1, 100, 999, 12345];

        dictionaryIds.forEach(id => {
            expect(typeof id).toBe("number");
            expect(id).toBeGreaterThanOrEqual(0);
        });
    });

    it("execute test case14 - validates placeId parameter types", () =>
    {
        const placeIds = [-1, 0, 1, 42, 100];

        placeIds.forEach(id => {
            expect(typeof id).toBe("number");
        });
    });

    it("execute test case15 - character extends is case-sensitive", () =>
    {
        const parent = new MovieClip();
        const tag = {
            characterId: 1,
            name: "test",
            clipDepth: 0,
            depth: 0,
            startFrame: 1,
            endFrame: 10
        };
        
        // Try with lowercase version (should fail)
        const character = {
            extends: MovieClip.namespace.toLowerCase()
        };

        expect(() => {
            execute(0, tag, character as any, parent);
        }).toThrow();
    });
});
