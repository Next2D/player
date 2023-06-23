import { TextField } from "../next2d/text/TextField";
import { TextFormat } from "../next2d/text/TextFormat";
import type { TextImpl } from "../interface/TextImpl";

const text: TextImpl = {
    TextField,
    TextFormat
};

Object.entries(text).forEach(([key, TextClass]) =>
{
    Object.defineProperty(text, key, {
        get()
        {
            return TextClass;
        }
    });
});

export { text };