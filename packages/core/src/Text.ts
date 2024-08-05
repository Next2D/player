import type { IText } from "./interface/IText";
import {
    TextFormat,
    TextField
} from "@next2d/text";

const text: IText = {
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