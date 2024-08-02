import type { TextFormat } from "@next2d/text";
import type { TextField } from "@next2d/text";

export interface TextImpl {
    TextFormat: typeof TextFormat;
    TextField: typeof TextField;
}