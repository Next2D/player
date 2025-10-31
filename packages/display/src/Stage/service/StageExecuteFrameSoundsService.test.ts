import { execute } from "./StageExecuteFrameSoundsService";
import { $sounds } from "../../DisplayObjectUtil";
import { MovieClip } from "../../MovieClip";
import { Sound } from "@next2d/media";
import { SoundTransform } from "@next2d/media";
import { describe, expect, it, beforeEach } from "vitest";

describe("StageExecuteFrameSoundsService.js test", () =>
{
    beforeEach(() =>
    {
        // Clear $sounds array before each test
        $sounds.length = 0;
    });

    it("execute test case1 - plays sound on current frame", () =>
    {
        const movieClip = new MovieClip();
        const sound = new Sound();
        let played = false;
        
        sound.play = () => { played = true; };
        
        movieClip.$sounds = new Map();
        movieClip.$sounds.set(1, [sound]);
        movieClip.currentFrame = 1;
        
        $sounds.push(movieClip);
        
        expect($sounds.length).toBe(1);
        expect(played).toBe(false);
        
        execute();
        
        expect($sounds.length).toBe(0);
        expect(played).toBe(true);
    });

    it("execute test case2 - skips movieClip without sounds", () =>
    {
        const movieClip = new MovieClip();
        movieClip.$sounds = null;
        
        $sounds.push(movieClip);
        
        expect($sounds.length).toBe(1);
        
        execute();
        
        expect($sounds.length).toBe(0);
    });

    it("execute test case3 - skips frame without sounds", () =>
    {
        const movieClip = new MovieClip();
        const sound = new Sound();
        let played = false;
        
        sound.play = () => { played = true; };
        
        movieClip.$sounds = new Map();
        movieClip.$sounds.set(5, [sound]);
        movieClip.currentFrame = 1; // Different frame
        
        $sounds.push(movieClip);
        
        execute();
        
        expect(played).toBe(false);
    });

    it("execute test case4 - applies soundTransform to sound", () =>
    {
        const movieClip = new MovieClip();
        const sound = new Sound();
        const soundTransform = new SoundTransform(0.5, 0);
        soundTransform.loopCount = 3;
        
        let played = false;
        sound.play = () => { played = true; };
        
        movieClip.$sounds = new Map();
        movieClip.$sounds.set(1, [sound]);
        movieClip.currentFrame = 1;
        movieClip.soundTransform = soundTransform;
        
        $sounds.push(movieClip);
        
        execute();
        
        expect(played).toBe(true);
        expect(sound.volume).toBe(0.5);
        expect(sound.loopCount).toBe(3);
    });

    it("execute test case5 - plays multiple sounds in frame", () =>
    {
        const movieClip = new MovieClip();
        const sound1 = new Sound();
        const sound2 = new Sound();
        const sound3 = new Sound();
        
        let played1 = false;
        let played2 = false;
        let played3 = false;
        
        sound1.play = () => { played1 = true; };
        sound2.play = () => { played2 = true; };
        sound3.play = () => { played3 = true; };
        
        movieClip.$sounds = new Map();
        movieClip.$sounds.set(1, [sound1, sound2, sound3]);
        movieClip.currentFrame = 1;
        
        $sounds.push(movieClip);
        
        execute();
        
        expect(played1).toBe(true);
        expect(played2).toBe(true);
        expect(played3).toBe(true);
    });

    it("execute test case6 - processes multiple movieClips", () =>
    {
        const movieClip1 = new MovieClip();
        const movieClip2 = new MovieClip();
        const sound1 = new Sound();
        const sound2 = new Sound();
        
        let played1 = false;
        let played2 = false;
        
        sound1.play = () => { played1 = true; };
        sound2.play = () => { played2 = true; };
        
        movieClip1.$sounds = new Map();
        movieClip1.$sounds.set(1, [sound1]);
        movieClip1.currentFrame = 1;
        
        movieClip2.$sounds = new Map();
        movieClip2.$sounds.set(1, [sound2]);
        movieClip2.currentFrame = 1;
        
        $sounds.push(movieClip1);
        $sounds.push(movieClip2);
        
        expect($sounds.length).toBe(2);
        
        execute();
        
        expect($sounds.length).toBe(0);
        expect(played1).toBe(true);
        expect(played2).toBe(true);
    });

    it("execute test case7 - skips null sounds in array", () =>
    {
        const movieClip = new MovieClip();
        const sound1 = new Sound();
        
        let played = false;
        sound1.play = () => { played = true; };
        
        movieClip.$sounds = new Map();
        movieClip.$sounds.set(1, [sound1, null as any, undefined as any]);
        movieClip.currentFrame = 1;
        
        $sounds.push(movieClip);
        
        expect(() => {
            execute();
        }).not.toThrow();
        
        expect(played).toBe(true);
    });

    it("execute test case8 - handles empty $sounds array", () =>
    {
        expect($sounds.length).toBe(0);
        
        expect(() => {
            execute();
        }).not.toThrow();
        
        expect($sounds.length).toBe(0);
    });

    it("execute test case9 - handles empty sounds array for frame", () =>
    {
        const movieClip = new MovieClip();
        
        movieClip.$sounds = new Map();
        movieClip.$sounds.set(1, []);
        movieClip.currentFrame = 1;
        
        $sounds.push(movieClip);
        
        expect(() => {
            execute();
        }).not.toThrow();
    });

    it("execute test case10 - applies soundTransform volume only", () =>
    {
        const movieClip = new MovieClip();
        const sound = new Sound();
        const soundTransform = new SoundTransform(0.75, 0);
        
        let played = false;
        sound.play = () => { played = true; };
        
        movieClip.$sounds = new Map();
        movieClip.$sounds.set(1, [sound]);
        movieClip.currentFrame = 1;
        movieClip.soundTransform = soundTransform;
        
        $sounds.push(movieClip);
        
        execute();
        
        expect(played).toBe(true);
        expect(sound.volume).toBe(0.75);
    });

    it("execute test case11 - handles multiple frames with sounds", () =>
    {
        const movieClip = new MovieClip();
        const sound1 = new Sound();
        const sound2 = new Sound();
        
        let played1 = false;
        let played2 = false;
        
        sound1.play = () => { played1 = true; };
        sound2.play = () => { played2 = true; };
        
        movieClip.$sounds = new Map();
        movieClip.$sounds.set(1, [sound1]);
        movieClip.$sounds.set(5, [sound2]);
        movieClip.currentFrame = 1;
        
        $sounds.push(movieClip);
        
        execute();
        
        expect(played1).toBe(true);
        expect(played2).toBe(false); // Frame 5 not played
    });

    it("execute test case12 - clears $sounds array after execution", () =>
    {
        const movieClip1 = new MovieClip();
        const movieClip2 = new MovieClip();
        const movieClip3 = new MovieClip();
        
        movieClip1.$sounds = null;
        movieClip2.$sounds = null;
        movieClip3.$sounds = null;
        
        $sounds.push(movieClip1);
        $sounds.push(movieClip2);
        $sounds.push(movieClip3);
        
        expect($sounds.length).toBe(3);
        
        execute();
        
        expect($sounds.length).toBe(0);
    });

    it("execute test case13 - without soundTransform", () =>
    {
        const movieClip = new MovieClip();
        const sound = new Sound();
        
        let played = false;
        sound.play = () => { played = true; };
        
        movieClip.$sounds = new Map();
        movieClip.$sounds.set(1, [sound]);
        movieClip.currentFrame = 1;
        movieClip.soundTransform = null;
        
        $sounds.push(movieClip);
        
        execute();
        
        expect(played).toBe(true);
    });

    it("execute test case14 - handles different frame numbers", () =>
    {
        const movieClip = new MovieClip();
        const sound = new Sound();
        
        let played = false;
        sound.play = () => { played = true; };
        
        movieClip.$sounds = new Map();
        movieClip.$sounds.set(10, [sound]);
        movieClip.currentFrame = 10;
        
        $sounds.push(movieClip);
        
        execute();
        
        expect(played).toBe(true);
    });

    it("execute test case15 - preserves sound properties", () =>
    {
        const movieClip = new MovieClip();
        const sound = new Sound();
        const soundTransform = new SoundTransform(0.8, 0.5);
        soundTransform.loopCount = 5;
        
        let played = false;
        sound.play = () => { played = true; };
        
        movieClip.$sounds = new Map();
        movieClip.$sounds.set(1, [sound]);
        movieClip.currentFrame = 1;
        movieClip.soundTransform = soundTransform;
        
        $sounds.push(movieClip);
        
        const originalVolume = soundTransform.volume;
        const originalLoopCount = soundTransform.loopCount;
        
        execute();
        
        expect(played).toBe(true);
        expect(sound.volume).toBe(originalVolume);
        expect(sound.loopCount).toBe(originalLoopCount);
    });
});
