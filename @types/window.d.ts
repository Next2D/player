import type { Next2D } from "@next2d/core";

declare global {

    const next2d: Next2D;

    interface Window {
        next2d?: Next2D;
    }
}