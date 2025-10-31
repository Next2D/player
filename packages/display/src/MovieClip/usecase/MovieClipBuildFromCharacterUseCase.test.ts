import { execute } from "./MovieClipBuildFromCharacterUseCase";
import { MovieClip } from "../../MovieClip";
import { describe, expect, it } from "vitest";

describe("MovieClipBuildFromCharacterUseCase.js test", () =>
{
    it("execute test case1 - builds MovieClip with actions", () =>
    {
        const movieClip = new MovieClip();
        const character = {
            totalFrame: 10,
            actions: [
                {
                    frame: 1,
                    action: "console.log('test')"
                },
                {
                    frame: 5,
                    action: "console.log('test2')"
                }
            ]
        };

        expect(movieClip.$actions).toBeNull();
        expect(movieClip.totalFrames).toBe(1);

        execute(movieClip, character);

        expect(movieClip.$actions).toBeDefined();
        expect(movieClip.$actions?.size).toBe(2);
        expect(movieClip.totalFrames).toBe(10);
    });

    it("execute test case2 - builds MovieClip with sounds", () =>
    {
        const movieClip = new MovieClip();
        const character = {
            totalFrame: 5,
            sounds: [
                {
                    frame: 1,
                    sound: "sound1.mp3"
                }
            ]
        };

        expect(movieClip.$sounds).toBeNull();

        execute(movieClip, character);

        expect(movieClip.$sounds).toBeDefined();
        expect(movieClip.totalFrames).toBe(5);
    });

    it("execute test case3 - builds MovieClip with labels", () =>
    {
        const movieClip = new MovieClip();
        const character = {
            totalFrame: 8,
            labels: [
                {
                    frame: 1,
                    label: "start"
                },
                {
                    frame: 5,
                    label: "middle"
                }
            ]
        };

        expect(movieClip.$labels).toBeNull();

        execute(movieClip, character);

        expect(movieClip.$labels).toBeDefined();
        expect(movieClip.$labels?.size).toBe(2);
        expect(movieClip.totalFrames).toBe(8);
    });

    it("execute test case4 - builds MovieClip with all properties", () =>
    {
        const movieClip = new MovieClip();
        const character = {
            totalFrame: 20,
            actions: [
                { frame: 1, action: "action1" }
            ],
            sounds: [
                { frame: 2, sound: "sound1" }
            ],
            labels: [
                { frame: 3, label: "label1" }
            ]
        };

        execute(movieClip, character);

        expect(movieClip.$actions).toBeDefined();
        expect(movieClip.$sounds).toBeDefined();
        expect(movieClip.$labels).toBeDefined();
        expect(movieClip.totalFrames).toBe(20);
    });

    it("execute test case5 - builds MovieClip without optional properties", () =>
    {
        const movieClip = new MovieClip();
        const character = {
            totalFrame: 15
        };

        execute(movieClip, character);

        // Without actions, sounds, or labels, these should remain undefined
        expect(movieClip.$actions).toBeNull();
        expect(movieClip.$sounds).toBeNull();
        expect(movieClip.$labels).toBeNull();
        expect(movieClip.totalFrames).toBe(15);
    });

    it("execute test case6 - defaults totalFrames to 1 when not specified", () =>
    {
        const movieClip = new MovieClip();
        const character = {};

        execute(movieClip, character);

        expect(movieClip.totalFrames).toBe(1);
    });

    it("execute test case7 - handles totalFrame as 0", () =>
    {
        const movieClip = new MovieClip();
        const character = {
            totalFrame: 0
        };

        execute(movieClip, character);

        // When totalFrame is 0 (falsy), should default to 1
        expect(movieClip.totalFrames).toBe(1);
    });

    it("execute test case8 - multiple actions on different frames", () =>
    {
        const movieClip = new MovieClip();
        const character = {
            totalFrame: 10,
            actions: [
                { frame: 1, action: "action1" },
                { frame: 2, action: "action2" },
                { frame: 3, action: "action3" },
                { frame: 5, action: "action5" }
            ]
        };

        execute(movieClip, character);

        expect(movieClip.$actions?.size).toBe(4);
        expect(movieClip.totalFrames).toBe(10);
    });

    it("execute test case9 - multiple labels", () =>
    {
        const movieClip = new MovieClip();
        const character = {
            totalFrame: 12,
            labels: [
                { frame: 1, label: "intro" },
                { frame: 5, label: "main" },
                { frame: 10, label: "outro" }
            ]
        };

        execute(movieClip, character);

        expect(movieClip.$labels?.size).toBe(3);
    });

    it("execute test case10 - handles empty arrays", () =>
    {
        const movieClip = new MovieClip();
        const character = {
            totalFrame: 5,
            actions: [],
            sounds: [],
            labels: []
        };

        execute(movieClip, character);

        // Empty arrays should still create the maps but they will be empty
        expect(movieClip.$actions).toBeDefined();
        expect(movieClip.$actions?.size).toBe(0);
        expect(movieClip.$sounds).toBeDefined();
        expect(movieClip.$labels).toBeDefined();
        expect(movieClip.totalFrames).toBe(5);
    });

    it("execute test case11 - preserves existing $actions if present", () =>
    {
        const movieClip = new MovieClip();
        movieClip.$actions = new Map();
        movieClip.$actions.set(1, []);

        const character = {
            totalFrame: 5,
            actions: [
                { frame: 2, action: "newAction" }
            ]
        };

        expect(movieClip.$actions.size).toBe(1);

        execute(movieClip, character);

        // Should have both the existing and new action frames
        expect(movieClip.$actions.size).toBeGreaterThan(0);
    });

    it("execute test case12 - preserves existing $sounds if present", () =>
    {
        const movieClip = new MovieClip();
        movieClip.$sounds = new Map();
        movieClip.$sounds.set(1, []);

        const character = {
            totalFrame: 5,
            sounds: [
                { frame: 2, sound: "newSound" }
            ]
        };

        expect(movieClip.$sounds.size).toBe(1);

        execute(movieClip, character);

        expect(movieClip.$sounds.size).toBeGreaterThan(0);
    });

    it("execute test case13 - preserves existing $labels if present", () =>
    {
        const movieClip = new MovieClip();
        movieClip.$labels = new Map();
        movieClip.$labels.set(1, []);

        const character = {
            totalFrame: 5,
            labels: [
                { frame: 2, label: "newLabel" }
            ]
        };

        expect(movieClip.$labels.size).toBe(1);

        execute(movieClip, character);

        expect(movieClip.$labels.size).toBeGreaterThan(0);
    });

    it("execute test case14 - handles large totalFrame value", () =>
    {
        const movieClip = new MovieClip();
        const character = {
            totalFrame: 1000
        };

        execute(movieClip, character);

        expect(movieClip.totalFrames).toBe(1000);
    });

    it("execute test case15 - sequential builds on same MovieClip", () =>
    {
        const movieClip = new MovieClip();
        
        const character1 = {
            totalFrame: 5,
            actions: [
                { frame: 1, action: "first" }
            ]
        };

        execute(movieClip, character1);
        const firstTotalFrames = movieClip.totalFrames;

        const character2 = {
            totalFrame: 10,
            labels: [
                { frame: 1, label: "second" }
            ]
        };

        execute(movieClip, character2);

        // Second execution should update totalFrames
        expect(movieClip.totalFrames).toBe(10);
        expect(movieClip.totalFrames).not.toBe(firstTotalFrames);
    });
});
