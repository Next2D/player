import { runBenchmark, createRandom } from "./harness.js";

window.addEventListener("DOMContentLoaded", async () => {
    const root = await next2d.createRootMovieClip(900, 560, 60);
    const { Shape, Sprite } = next2d.display;
    const { BlurFilter } = next2d.filters;
    const parent = new Sprite();
    root.addChild(parent);
    const withColor = location.pathname.endsWith("cached-filters-ct.html");
    const random = createRandom(34567);
    for (let i = 0; i < 240; i++) {
        const item = new Sprite();
        for (let j = 0; j < 2; j++) {
            const shape = new Shape();
            shape.graphics.beginFill(Math.floor(random() * 0xffffff) | 0x202020, 0.8)
                .drawRoundRect(j * 8, j * 6, 24, 20, 6).endFill();
            item.addChild(shape);
        }
        item.x = 12 + (i % 20) * 44;
        item.y = 12 + Math.floor(i / 20) * 44;
        item.filters = [new BlurFilter(2, 2, 1)];
        parent.addChild(item);
    }
    // Only the ancestor moves/changes alpha. Descendant pixels and filter keys
    // stay unchanged, exercising cached output rather than filter regeneration.
    await runBenchmark(frame => {
        parent.x = frame % 4;
        if (withColor) parent.alpha = 0.6 + (frame % 20) * 0.015;
    });
});
