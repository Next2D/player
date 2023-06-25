import { TextField } from "../../text/src/TextField";
import { TextFormat } from "../../text/src/TextFormat";

export interface TextImpl {
    TextField: typeof TextField;
    TextFormat: typeof TextFormat;
}