import { TextImpl } from "@next2d/interface";
import { TextFormat } from "@next2d/text";

const text: TextImpl = {
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