import { TextField } from "../player/next2d/text/TextField";
import { TextFormat } from "../player/next2d/text/TextFormat";

export interface TextImpl {
    TextField: typeof TextField;
    TextFormat: typeof TextFormat;
}