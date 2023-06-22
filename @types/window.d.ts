import { Next2D } from "../src/player/player/Next2D";
import { IndexRangeImpl } from "../src/interface/IndexRangeImpl";

declare global {

    // eslint-disable-next-line no-unused-vars
    const next2d: Next2D;

    // eslint-disable-next-line no-unused-vars
    interface Location {
        search: string;
        origin: string;
    }

    // eslint-disable-next-line no-unused-vars
    interface Window {
        performance: Performance;
        navigator: Navigator;
        setTimeout: setTimeout;
        Map: Map;
        Number: Number;
        Array: Array;
        document: Document;
        location: Location;
        isNaN: isNaN;
        Math: Math;
        Event: Event;
        next2d: Next2D;
    }

    // eslint-disable-next-line no-unused-vars
    interface WebGLTexture {
        width: number;
        height: number;
        area: number;
        dirty: boolean;
        smoothing: boolean;
        layerWidth: number;
        layerHeight: number;
        matrix: string | null;
        colorTransform: string | null;
        filterState: boolean | null;
        _$offsetX: number;
        _$offsetY: number;
    }

    // eslint-disable-next-line no-unused-vars
    interface WebGLProgram {
        id: number;
    }

    // eslint-disable-next-line no-unused-vars
    interface WebGLRenderbuffer {
        stencil: WebGLRenderbuffer;
        samples: number;
        width: number;
        height: number;
        area: number;
        dirty: boolean;
    }

    // eslint-disable-next-line no-unused-vars
    interface WebGLVertexArrayObject {
        vertexBuffer: WebGLBuffer;
        vertexLength: number;
        indexBuffer: WebGLBuffer;
        indexLength: number;
        indexRanges: IndexRangeImpl[];
        indexCount: number;
    }

    // eslint-disable-next-line no-unused-vars
    interface AudioBufferSourceNode {
        _$gainNode: GainNode | null;
        _$volume: number;
    }
}