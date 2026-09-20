interface IExternalImageCopy {
    destination: GPUTexture;
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Packs canvas snapshots before uploading them. Each flush submits copies to
 * distinct, frame-owned destination textures before the renderer submits draws.
 * A single 1024-square canvas and GPU staging texture are retained (4 MiB each,
 * excluding browser/driver overhead). No render target is reordered or reused.
 */
export class ExternalImageUploadBatch
{
    private readonly size = 1024;
    private canvas: OffscreenCanvas | null = null;
    private context: OffscreenCanvasRenderingContext2D | null = null;
    private texture: GPUTexture | null = null;
    private readonly copies: IExternalImageCopy[] = [];
    private x = 0;
    private y = 0;
    private rowHeight = 0;
    private usedWidth = 0;

    constructor (private readonly device: GPUDevice) {}

    /** Copies the source synchronously, so the caller may immediately reuse it. */
    append (source: OffscreenCanvas, destination: GPUTexture, width: number, height: number): boolean
    {
        if (width <= 0 || height <= 0 || width > this.size || height > this.size
            || width !== source.width || height !== source.height) {
            return false;
        }
        if (!this.canvas) {
            this.canvas = new OffscreenCanvas(this.size, this.size);
            this.context = this.canvas.getContext("2d");
        }
        if (!this.context) {
            return false;
        }
        if (this.x + width > this.size) {
            this.x = 0;
            this.y += this.rowHeight;
            this.rowHeight = 0;
        }
        if (this.y + height > this.size) {
            this.flush();
        }
        if (!this.texture) {
            this.texture = this.device.createTexture({
                "size": [this.size, this.size], "format": "rgba8unorm",
                // COPY_SRC | COPY_DST | RENDER_ATTACHMENT (external image copy).
                "usage": 0x13
            });
        }
        // Integer, unscaled copy onto a cleared, disjoint region.
        this.context.drawImage(source, this.x, this.y);
        this.copies.push({ destination, "x": this.x, "y": this.y, width, height });
        this.x += width;
        this.usedWidth = Math.max(this.usedWidth, this.x);
        this.rowHeight = Math.max(this.rowHeight, height);
        return true;
    }

    flush (): void
    {
        if (!this.copies.length || !this.canvas || !this.texture) {
            return;
        }
        this.device.queue.copyExternalImageToTexture(
            { "source": this.canvas },
            { "texture": this.texture, "premultipliedAlpha": true },
            { "width": this.usedWidth, "height": this.y + this.rowHeight }
        );
        // Record copies only after the external upload. On WebKit, recording
        // against a staging texture before its first upload can copy blank pixels.
        const encoder = this.device.createCommandEncoder();
        for (const copy of this.copies) {
            encoder.copyTextureToTexture(
                { "texture": this.texture, "origin": [copy.x, copy.y] },
                { "texture": copy.destination }, { "width": copy.width, "height": copy.height }
            );
        }
        // Submit before reusing staging storage; these destinations remain owned
        // by the frame until its later rendering submission.
        this.device.queue.submit([encoder.finish()]);
        this.copies.length = 0;
        this.canvas.width = this.size;
        this.x = this.y = this.rowHeight = this.usedWidth = 0;
    }

    /** Discard pending copies when resize discards the corresponding draw frame. */
    dispose (): void
    {
        this.copies.length = 0;
        this.texture?.destroy();
        this.texture = null;
        this.canvas = null;
        this.context = null;
        this.x = this.y = this.rowHeight = this.usedWidth = 0;
    }
}
