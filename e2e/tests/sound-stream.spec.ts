import { test, expect } from "@playwright/test";
import type { Sound, SoundMixer } from "../../packages/media/src/index";
import type { URLRequest } from "../../packages/net/src/index";

interface ISoundFixture {
    Sound: typeof Sound;
    SoundMixer: typeof SoundMixer;
    URLRequest: typeof URLRequest;
    context: AudioContext;
    sound: Sound;
    graphs: Array<{ element: HTMLAudioElement; source: MediaElementAudioSourceNode; gain: GainNode }>;
    decodes: number;
    buffers: number;
    completions: number;
}
declare global {
    interface Window { soundTest: ISoundFixture; }
}

// Deterministic, copyright-free 440 Hz fixture, no checked-in binary or external server.
const tone = (seconds: number): Buffer => {
    const rate = 16000;
    const samples = Math.round(seconds * rate);
    const wav = Buffer.alloc(44 + samples * 2);
    wav.write("RIFF", 0); wav.writeUInt32LE(wav.length - 8, 4); wav.write("WAVEfmt ", 8);
    wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
    wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 2, 28);
    wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
    wav.write("data", 36); wav.writeUInt32LE(samples * 2, 40);
    for (let index = 0; index < samples; index++) {
        wav.writeInt16LE(Math.round(12000 * Math.sin(2 * Math.PI * 440 * index / rate)), 44 + index * 2);
    }
    return wav;
};

test.beforeEach(async ({ page }) => {
    await page.route("**/sound-fixture.wav", route => route.fulfill({ contentType: "audio/wav", body: tone(2) }));
    await page.goto("/e2e/pages/media/sound.html");
    await page.waitForFunction(() => !!window.soundTest);
});

test("stream: real gain attenuation, native looping, stop/replay and disposal", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.evaluate(async () => {
        const h = window.soundTest;
        h.sound = new h.Sound({ mode: "stream" });
        h.sound.loopCount = Infinity;
        await h.sound.load(new h.URLRequest("/sound-fixture.wav"));
    });
    await page.click("#play");
    await page.waitForFunction(() => window.soundTest.graphs[0]?.element.currentTime > 0.1);
    for (const volume of [1, 0.25, 0]) {
        const ratio = await page.evaluate(async (value) => {
            const h = window.soundTest;
            const graph = h.graphs[0];
            h.sound.volume = value;
            const before = h.context.createAnalyser();
            const after = h.context.createAnalyser();
            graph.source.connect(before);
            graph.gain.connect(after);
            const rms = (node: AnalyserNode): number => {
                const data = new Float32Array(node.fftSize);
                node.getFloatTimeDomainData(data);
                return Math.sqrt(data.reduce((sum, n) => sum + n * n, 0) / data.length);
            };
            let input = 0;
            let output = 0;
            // WebKit starts processing newly connected analysers asynchronously.
            for (let attempt = 0; attempt < 30; attempt++) {
                await new Promise(resolve => setTimeout(resolve, 100));
                input = rms(before);
                output = rms(after);
                if (input > 0.01 && Math.abs(output / input - value) < 0.05) {
                    break;
                }
            }
            graph.source.disconnect(before);
            graph.gain.disconnect(after);
            return { input, output, ratio: output / input, volume: graph.element.volume };
        }, volume);
        expect(ratio.input).toBeGreaterThan(0.01);
        expect(ratio.ratio).toBeCloseTo(volume, 1);
        expect(ratio.volume).toBe(1);
    }
    // Observe a complete native loop, rather than re-creating the player on ended.
    await page.evaluate(() => { window.soundTest.graphs[0].element.currentTime = 1.8; });
    await page.waitForFunction(() => {
        const element = window.soundTest.graphs[0].element;
        return !element.seeking && element.currentTime > 0 && element.currentTime < 1;
    });
    for (let repeat = 0; repeat < 3; repeat++) {
        await page.evaluate(() => window.soundTest.sound.stop());
        expect(await page.evaluate(() => window.soundTest.graphs[0].element.getAttribute("src"))).toBeNull();
        await page.click("#play");
        await page.waitForFunction(() => window.soundTest.graphs[0].element.currentTime > 0.1);
    }
    expect(await page.evaluate(() => ({
        nodes: window.soundTest.graphs.length, decodes: window.soundTest.decodes, buffers: window.soundTest.buffers
    }))).toEqual({ nodes: 1, decodes: 0, buffers: 0 });
    await page.evaluate(() => window.soundTest.sound.dispose());
    await page.click("#play");
    expect(await page.evaluate(() => window.soundTest.graphs[0].element.paused)).toBe(true);
    expect(errors).toEqual([]);
});

test("stream: finite repetitions and mixer stopAll with independent clones", async ({ page }) => {
    await page.evaluate(async () => {
        const h = window.soundTest;
        h.sound = new h.Sound({ mode: "stream" });
        h.sound.loopCount = 1;
        await h.sound.load(new h.URLRequest("/sound-fixture.wav"));
        h.sound.addEventListener("complete", () => { h.completions++; });
    });
    await page.click("#play");
    await expect.poll(() => page.evaluate(() => window.soundTest.completions), { timeout: 10000 }).toBe(1);
    await page.click("#play");
    await page.evaluate(() => {
        const h = window.soundTest;
        const clone = h.sound.clone();
        clone.play();
        h.SoundMixer.volume = 0.3;
    });
    await page.waitForFunction(() => window.soundTest.graphs.length === 2 && window.soundTest.graphs[1].element.currentTime > 0);
    expect(await page.evaluate(() => window.soundTest.graphs.map(graph => graph.gain.gain.value))).toEqual([
        expect.closeTo(0.3), expect.closeTo(0.3)
    ]);
    await page.evaluate(() => window.soundTest.SoundMixer.stopAll());
    expect(await page.evaluate(() => window.soundTest.graphs.every(graph => graph.element.paused && !graph.element.hasAttribute("src")))).toBe(true);
});

test("unchanged new Sound(): decodes buffer, plays, changes volume and completes", async ({ page }) => {
    await page.evaluate(async () => {
        const h = window.soundTest;
        h.sound = new h.Sound();
        await h.sound.load(new h.URLRequest("/sound-fixture.wav"));
        h.sound.addEventListener("complete", () => { h.completions++; });
    });
    await page.click("#play");
    await page.evaluate(() => { window.soundTest.sound.volume = 0.25; });
    await expect.poll(() => page.evaluate(() => window.soundTest.completions), { timeout: 10000 }).toBe(1);
    expect(await page.evaluate(() => ({
        mode: window.soundTest.sound.mode, decodes: window.soundTest.decodes,
        buffers: window.soundTest.buffers, streams: window.soundTest.graphs.length
    }))).toEqual({ mode: "buffer", decodes: 1, buffers: 1, streams: 0 });
});
