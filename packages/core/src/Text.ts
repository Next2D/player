import type { TextImpl } from "./interface/TextImpl";
import { TextFormat, TextField } from "@next2d/text";

const text: TextImpl = {
    TextFormat,
    TextField
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