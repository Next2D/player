/** Limits outstanding rendered frames without mixing buffer ownership with GPU completion. */
export class RenderFrameLimiter
{
    private readonly pending: Promise<void>[] = [];

    constructor (private readonly limit: number = 2)
    {
        if (!Number.isInteger(limit) || limit < 1) {
            throw new RangeError("Invalid frame limit");
        }
    }

    /** The caller must await the returned capacity before submitting another frame. */
    track (completion: Promise<void>): Promise<void> | null
    {
        const release = (): void => {
            const index = this.pending.indexOf(settled);
            if (index >= 0) {
                this.pending.splice(index, 1);
            }
        };
        // A failed/lost queue must not leave the renderer's buffer return blocked.
        const settled = completion.then(release, release);
        this.pending.push(settled);
        return this.pending.length >= this.limit ? this.pending[0] : null;
    }
}
