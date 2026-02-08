import {
    $setFuncCode,
    $funcCode
} from "../../Blend";

export const execute = (): boolean =>
{
    if ($funcCode !== 101) {
        $setFuncCode(101);
        return true;
    }
    return false;
};
