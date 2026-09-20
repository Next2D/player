import { runBenchmark, createRandom } from "./harness.js";

window.addEventListener("DOMContentLoaded", async () => {
    const root = await next2d.createRootMovieClip(900, 560, 60);
    const { Shape, Sprite } = next2d.display;
    const { ColorMatrixFilter, ConvolutionFilter, BevelFilter, GradientBevelFilter,
        GradientGlowFilter, DisplacementMapFilter } = next2d.filters;
    const containers = location.pathname.endsWith("container-filters.html");
    const random = createRandom(34567);
    const items = [];
    for (let i = 0; i < 120; i++) {
        const shape = new Shape();
        shape.graphics.beginFill((Math.floor(random() * 0xffffff)) | 0x202020)
            .drawRoundRect(0, 0, 32, 28, 8).endFill();
        let item = shape;
        if (containers) {
            item = new Sprite();
            item.addChild(shape);
            const child = new Shape();
            child.graphics.beginFill(0x3388ff, 0.6).drawCircle(25, 18, 12).endFill();
            item.addChild(child);
        }
        item.x = 22 + (i % 12) * 72;
        item.y = 20 + Math.floor(i / 12) * 52;
        item.alpha = 0.8;
        root.addChild(item);
        items.push(item);
    }
    const bitmap = Uint8Array.from({ length: 32 * 32 * 4 }, (_, i) => (i * 29 + 71) % 256);
    await runBenchmark(frame => {
        const amount = 2 + frame % 20 * 0.1;
        for (let i = 0; i < items.length; i++) {
            let filter;
            switch (i % 6) {
                case 0:
                    filter = new ColorMatrixFilter([0.8, 0.1, 0, 0, amount, 0, 0.9, 0.1, 0, 0,
                        0.1, 0, 0.7, 0, 0, 0, 0, 0, 0.8, 0]);
                    break;
                case 1:
                    filter = new ConvolutionFilter(3, 3, [0, -1, 0, -1, 5, -1, 0, -1, 0], 1, amount);
                    break;
                case 2:
                    filter = new BevelFilter(2, 35, 0xffffff, 0.8, 0x003366, 0.6, amount, 3, 1, 1, "inner");
                    break;
                case 3:
                    filter = new GradientBevelFilter(2, 35, [0, 0x4499ff, 0xffffff], [0, 0.7, 1],
                        [0, 128, 255], amount, 3, 1, 1, "full");
                    break;
                case 4:
                    filter = new GradientGlowFilter(2, 35, [0, 0x4499ff, 0xffffff], [0, 0.7, 1],
                        [0, 128, 255], amount, 3, 1, 1, "outer");
                    break;
                default:
                    filter = new DisplacementMapFilter(bitmap, 32, 32, 0, 0, 1, 2, amount, 3, "color", 0x336699, 0.6);
            }
            items[i].filters = [filter];
        }
    });
});
