import type { IUI } from "./interface/IUI";
import {
    Easing,
    Tween
} from "@next2d/ui";

const ui: IUI = {
    Easing,
    Tween
};

Object.entries(ui).forEach(([key, UIClass]) =>
{
    Object.defineProperty(ui, key, {
        get()
        {
            return UIClass;
        }
    });
});

export { ui };