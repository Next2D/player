import {
    TextField,
    TextFormat
} from "@next2d/text";

export interface TextImpl {
    TextField: typeof TextField;
    TextFormat: typeof TextFormat;
}