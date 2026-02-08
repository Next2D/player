import {
    $setFuncCode,
    $funcCode
} from "../../Blend";

export const execute = (): boolean =>
{
    if ($funcCode !== 301) {
        $setFuncCode(301);
        return true;
    }
    return false;
};
