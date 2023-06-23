import { URLRequest } from "../next2d/net/URLRequest";
import { URLRequestHeader } from "../next2d/net/URLRequestHeader";
import type { NetImpl } from "../interface/NetImpl";

const net: NetImpl = {
    URLRequest,
    URLRequestHeader
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