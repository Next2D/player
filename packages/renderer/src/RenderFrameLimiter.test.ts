import { describe, it, expect } from "vitest";
import { RenderFrameLimiter } from "./RenderFrameLimiter";

const deferred = () => {
    let resolve!: () => void;
    let reject!: (reason: Error) => void;
    const promise = new Promise<void>((yes, no) => { resolve = yes; reject = no; });
    return { promise, resolve, reject };
};

describe("RenderFrameLimiter", () => {
    it.each([1, 3])("waits at capacity %s and releases exactly one slot", async limit => {
        const limiter = new RenderFrameLimiter(limit);
        const frames = Array.from({ length: limit + 1 }, deferred);
        for (let index = 0; index < limit - 1; index++) {
            expect(limiter.track(frames[index].promise)).toBeNull();
        }
        const capacity = limiter.track(frames[limit - 1].promise);
        expect(capacity).toBeInstanceOf(Promise);
        let ready = false;
        capacity!.then(() => { ready = true; });
        await Promise.resolve();
        expect(ready).toBe(false);
        frames[0].resolve();
        await capacity;
        expect(ready).toBe(true);
        const next = limiter.track(frames[limit].promise);
        expect(next).toBeInstanceOf(Promise);
        ready = false;
        next!.then(() => { ready = true; });
        await Promise.resolve();
        expect(ready).toBe(false);
        frames[1].resolve();
        await next;
        expect(ready).toBe(true);
        for (const frame of frames) frame.resolve();
    });
    it("permits two frames and waits for the older completion", async () => {
        const limiter = new RenderFrameLimiter(2);
        const a = deferred(), b = deferred(), c = deferred();
        expect(limiter.track(a.promise)).toBeNull();
        const capacity = limiter.track(b.promise);
        expect(capacity).toBeInstanceOf(Promise);
        let ready = false;
        capacity!.then(() => { ready = true; });
        await Promise.resolve();
        expect(ready).toBe(false);
        a.resolve(); await capacity;
        expect(ready).toBe(true);
        const next = limiter.track(c.promise);
        expect(next).toBeInstanceOf(Promise);
        b.resolve(); await next;
        c.resolve();
    });
    it("a completed frame does not occupy capacity", async () => {
        const limiter = new RenderFrameLimiter(2);
        expect(limiter.track(Promise.resolve())).toBeNull();
        await Promise.resolve();
        expect(limiter.track(Promise.resolve())).toBeNull();
    });
    it("never rejects capacity on a failed queue", async () => {
        const limiter = new RenderFrameLimiter(1);
        const a = deferred();
        const capacity = limiter.track(a.promise);
        a.reject(new Error("device lost"));
        await expect(capacity).resolves.toBeUndefined();
        const b = deferred();
        const next = limiter.track(b.promise);
        b.resolve(); await next;
    });
    it("later completion cannot remove an older frame", async () => {
        const limiter = new RenderFrameLimiter(2);
        const a = deferred(), b = deferred(), c = deferred();
        limiter.track(a.promise);
        const capacity = limiter.track(b.promise);
        b.resolve(); await Promise.resolve();
        expect(limiter.track(c.promise)).toBe(capacity);
        a.resolve(); await capacity;
        c.resolve();
    });
    it.each([0, -1, 1.5, Infinity, NaN])("rejects invalid capacity %s", limit => {
        expect(() => new RenderFrameLimiter(limit)).toThrow(RangeError);
    });
});
