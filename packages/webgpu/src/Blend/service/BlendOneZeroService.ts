import {
    $setFuncCode,
    $funcCode
} from "../../Blend";

export const execute = (): boolean =>
{
    if ($funcCode !== 10) {
        $setFuncCode(10);
        return true;
    }
    return false;
};
