/**
 * パフォーマンス計測ハーネス
 *
 * requestAnimationFrame のフレーム間隔を計測し、
 * warmup 経過後 frames 分の統計を window.__PERF_RESULT__ に設定する。
 * tick(frameIndex) は毎フレーム呼ばれる（シーンのアニメーション更新用）。
 */
export const runBenchmark = (tick, options = {}) => {
    const warmup = options.warmup ?? 60;
    const frames = options.frames ?? 240;

    return new Promise((resolve) => {
        const deltas = [];
        let count = 0;
        let last = 0;

        const loop = (now) => {
            if (tick) {
                tick(count);
            }
            count++;

            if (count <= warmup) {
                last = now;
                requestAnimationFrame(loop);
                return;
            }

            deltas.push(now - last);
            last = now;

            if (deltas.length >= frames) {
                deltas.sort((a, b) => a - b);
                const median = deltas[deltas.length >> 1];
                const p95 = deltas[Math.floor(deltas.length * 0.95)];
                const mean = deltas.reduce((a, b) => a + b, 0) / deltas.length;
                const result = {
                    "median": median,
                    "p95": p95,
                    "mean": mean,
                    "frames": deltas.length
                };
                window.__PERF_RESULT__ = result;
                resolve(result);
                return;
            }

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    });
};

/**
 * 再現性のための決定的な擬似乱数（mulberry32）
 */
export const createRandom = (seed = 1) => {
    let a = seed >>> 0;
    return () => {
        a |= 0;
        a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
};
