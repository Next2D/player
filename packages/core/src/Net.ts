import { NetImpl } from "@next2d/interface";
import {
    URLRequest,
    URLRequestHeader
} from "@next2d/net";

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