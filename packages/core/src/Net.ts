import type { NetImpl } from "./interface/NetImpl";
import { URLRequest } from "@next2d/net";

const net: NetImpl = {
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