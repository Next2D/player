import { Easing } from "../next2d/ui/Easing";
import { Job } from "../next2d/ui/Job";
import { Tween } from "../next2d/ui/Tween";
import { UIImpl } from "../../interface/UIImpl";

const ui: UIImpl = {
    Easing,
    Job,
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