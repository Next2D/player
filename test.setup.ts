// test/global-setup.ts
class MockOffscreenCanvas {
    width: number;
    height: number;

    constructor (width: number, height: number)
    {
        this.width  = width;
        this.height = height;
    }

    getContext () {
        // CanvasRenderingContext2D などをモック
        return {
            // 必要に応じてメソッドを追加
            "fillRect": (x: number, y: number, w: number, h: number) => {},
            "beginPath": () => {},
            "moveTo": (x: number, y: number) => {},
            "lineTo": (x: number, y: number) => {},
            "quadraticCurveTo": (cpx: number, cpy: number, x: number, y: number) => {},
            "closePath": () => {},
            "isPointInPath": (x: number, y: number) => false
        };
    }
}

if (typeof globalThis.OffscreenCanvas === "undefined") {
    (globalThis as any).OffscreenCanvas = MockOffscreenCanvas;
}

class MockWorker {
    onmessage: ((event: MessageEvent) => void) | null = null;
    onerror: ((event: ErrorEvent) => void) | null = null;
    
    constructor(scriptURL: string | URL, options?: WorkerOptions) {
        // Mock worker that does nothing
    }
    
    postMessage(message: any, transfer?: Transferable[]): void {
        // Mock implementation
    }
    
    terminate(): void {
        // Mock implementation
    }
    
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
        // Mock implementation
    }
    
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
        // Mock implementation
    }
    
    dispatchEvent(event: Event): boolean {
        return true;
    }
}

if (typeof globalThis.Worker === "undefined") {
    (globalThis as any).Worker = MockWorker;
}
