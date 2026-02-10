import {
    $setFuncCode,
    $funcCode
} from "../../Blend";

export const execute = (): boolean =>
{
    if ($funcCode !== 501) {
        $setFuncCode(501);
        return true;
    }
    return false;
};
