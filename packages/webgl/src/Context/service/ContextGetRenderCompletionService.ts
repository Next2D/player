import { $gl } from "../../WebGLUtil";

interface ICompletion
{
    sync: WebGLSync;
    resolve: () => void;
    reject: (reason: unknown) => void;
}

interface ICompletionQueue
{
    entries: ICompletion[];
    poll: () => void;
}

const $queues = new WeakMap<WebGL2RenderingContext, ICompletionQueue>();

/** Observe preceding GL commands after yielding to the worker event loop. */
export const execute = (): Promise<void> =>
{
    const gl = $gl;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    if (!sync) {
        return Promise.reject(new Error("Unable to create render fence"));
    }
    return new Promise<void>((resolve, reject): void => {
        gl.flush();
        let queue = $queues.get(gl);
        if (!queue) {
            const entries: ICompletion[] = [];
            const poll = (): void => {
                // Work added during this task must wait for a later task.
                let remaining = entries.length;
                while (remaining-- && entries.length) {
                    const entry = entries[0];
                    let status: number;
                    try {
                        status = gl.clientWaitSync(entry.sync, 0, 0);
                    } catch (error) {
                        entries.shift();
                        entry.reject(error);
                        continue;
                    }
                    if (status === gl.TIMEOUT_EXPIRED) {
                        setTimeout(poll, 4);
                        return;
                    }
                    entries.shift();
                    if (status === gl.ALREADY_SIGNALED || status === gl.CONDITION_SATISFIED) {
                        entry.resolve();
                    } else {
                        entry.reject(new Error("Render fence wait failed"));
                    }
                }
                if (entries.length) {
                    setTimeout(poll, 4);
                }
            };
            queue = { entries, poll };
            $queues.set(gl, queue);
        }
        queue.entries.push({ sync, resolve, reject });
        if (queue.entries.length === 1) {
            setTimeout(queue.poll, 4);
        }
    }).finally((): void => {
        gl.deleteSync(sync);
    });
};
