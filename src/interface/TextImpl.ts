import { TextField } from "../next2d/text/TextField";
import { TextFormat } from "../next2d/text/TextFormat";

export interface TextImpl {
    TextField: typeof TextField;
    TextFormat: typeof TextFormat;
}