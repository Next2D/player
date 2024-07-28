import type { UIImpl } from "./interface/UIImpl";
import {
    Easing,
    Tween
} from "@next2d/ui";

const ui: UIImpl = {
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