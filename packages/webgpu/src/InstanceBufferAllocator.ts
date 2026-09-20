/**
 * @description フレーム内のインスタンスを別々の領域へ格納し、submit前に一括転送する。
 *              Stage instance batches in disjoint ranges and upload before submission.
 */
export class InstanceBufferAllocator
{
    private readonly device: GPUDevice;
    private readonly maxSize: number;
    private capacity: number;
    private buffer: GPUBuffer | null = null;
    private staging: Float32Array;
    private offset: number = 0;
    private dirtyStart: number = 0;
    private readonly retiredBuffers: GPUBuffer[] = [];

    constructor (device: GPUDevice, capacity: number = 65536)
    {
        this.device = device;
        this.maxSize = device.limits?.maxBufferSize ?? 268435456;
        this.capacity = Math.min(this.maxSize, capacity);
        this.staging = new Float32Array(this.capacity / 4);
    }

    getBuffer (): GPUBuffer
    {
        if (!this.buffer) {
            this.buffer = this.device.createBuffer({
                "size": this.capacity,
                "usage": GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
            });
        }
        return this.buffer;
    }

    allocate (data: Float32Array): number
    {
        if (data.byteLength > this.maxSize) {
            throw new RangeError("Instance batch exceeds maxBufferSize");
        }

        if (this.offset + data.byteLength > this.capacity) {
            // 記録済みのdrawは旧GPUBufferを参照する。旧領域への転送を完了し、
            // submit後までそのバッファを生存させる。
            this.flush();
            if (this.buffer) {
                this.retiredBuffers.push(this.buffer);
                this.buffer = null;
            }
            this.capacity = Math.min(this.maxSize, Math.max(this.capacity * 2, data.byteLength));
            this.staging = new Float32Array(this.capacity / 4);
            this.offset = 0;
            this.dirtyStart = 0;
        }

        const offset = this.offset;
        // 大きなバッチは既に転送が集約されているため、CPUでの二重コピーを省く。
        // 前後の小バッチは別の範囲としてflushし、直接転送した領域を上書きしない。
        if (data.byteLength >= 16384) {
            this.flush();
            this.device.queue.writeBuffer(this.getBuffer(), offset, data.buffer, data.byteOffset, data.byteLength);
            this.dirtyStart = offset + data.byteLength;
        } else {
            this.staging.set(data, offset / 4);
        }
        this.offset += data.byteLength;
        return offset;
    }

    flush (): void
    {
        if (this.offset > this.dirtyStart) {
            this.device.queue.writeBuffer(this.getBuffer(), this.dirtyStart,
                this.staging.buffer, this.dirtyStart, this.offset - this.dirtyStart);
            this.dirtyStart = this.offset;
        }
    }

    /**
     * @description コマンド送信後にのみ呼び出す。確保済み領域は次フレームで再利用する。
     *              Call only after submission; reuse the current buffer next frame.
     */
    resetFrame (): void
    {
        for (const buffer of this.retiredBuffers) {
            buffer.destroy();
        }
        this.retiredBuffers.length = 0;
        this.offset = 0;
        this.dirtyStart = 0;
    }

    dispose (): void
    {
        this.resetFrame();
        this.buffer?.destroy();
        this.buffer = null;
    }
}
