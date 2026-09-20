/** Sound playback backend. Omission preserves the existing AudioBuffer backend. */
export interface ISoundOptions {
    mode?: "buffer" | "stream";
}
