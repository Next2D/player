import type { INet } from "./interface/INet";
import { URLRequest } from "@next2d/net";

const net: INet = {
    URLRequest
};

Object.entries(net).forEach(([key, NetClass]) =>
{
    Object.defineProperty(net, key, {
        get()
        {
            return NetClass;
        }
    });
});

export { net };