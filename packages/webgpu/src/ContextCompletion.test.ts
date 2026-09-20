import { describe, expect, it, vi } from "vitest";
import { Context } from "./Context";
import { RenderFrameLimiter } from "../../renderer/src/RenderFrameLimiter";

const deferred = () => {
    let resolve!: () => void;
    let reject!: (reason: Error) => void;
    const promise = new Promise<undefined>((yes, no) => {
        resolve = () => yes(undefined);
        reject = no;
    });
    return { promise, resolve, reject };
};

describe("WebGPU completion connected to frame capacity", () => {
    it("does not release an older frame when a later checkpoint settles", async () => {
        const first = deferred(), second = deferred(), third = deferred();
        const queue = { onSubmittedWorkDone: vi.fn()
            .mockReturnValueOnce(first.promise)
            .mockReturnValueOnce(second.promise)
            .mockReturnValueOnce(third.promise) };
        const context = { device: { queue } } as unknown as Context;
        const limiter = new RenderFrameLimiter(2);
        const firstCompletion = Context.prototype.getRenderCompletion.call(context);
        expect(limiter.track(firstCompletion)).toBeNull();
        const secondCompletion = Context.prototype.getRenderCompletion.call(context);
        const capacity = limiter.track(secondCompletion);
        let ready = false;
        capacity!.then(() => { ready = true; });
        second.resolve();
        await secondCompletion;
        expect(ready).toBe(false);
        const thirdCompletion = Context.prototype.getRenderCompletion.call(context);
        expect(limiter.track(thirdCompletion)).toBe(capacity);
        first.resolve();
        await capacity;
        expect(ready).toBe(true);
        third.resolve();
        await thirdCompletion;
        expect(queue.onSubmittedWorkDone).toHaveBeenCalledTimes(3);
    });

    it("settled checkpoints leave capacity available without another submission", async () => {
        const queue = { onSubmittedWorkDone: vi.fn().mockResolvedValue(undefined) };
        const context = { device: { queue } } as unknown as Context;
        const limiter = new RenderFrameLimiter(2);
        for (let index = 0; index < 5; index++) {
            const completion = Context.prototype.getRenderCompletion.call(context);
            expect(limiter.track(completion)).toBeNull();
            await expect(completion).resolves.toBeUndefined();
        }
        expect(queue.onSubmittedWorkDone).toHaveBeenCalledTimes(5);
    });

    it("propagates a queue failure while permitting the limiter to release capacity", async () => {
        const frame = deferred();
        const queue = { onSubmittedWorkDone: vi.fn().mockReturnValueOnce(frame.promise).mockResolvedValue(undefined) };
        const context = { device: { queue } } as unknown as Context;
        const limiter = new RenderFrameLimiter(1);
        const completion = Context.prototype.getRenderCompletion.call(context);
        const capacity = limiter.track(completion);
        const error = new Error("queue lost");
        const rejection = expect(completion).rejects.toBe(error);
        frame.reject(error);
        await rejection;
        await expect(capacity).resolves.toBeUndefined();
        const next = limiter.track(Context.prototype.getRenderCompletion.call(context));
        await expect(next).resolves.toBeUndefined();
    });
});
