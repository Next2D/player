import {
    $setFuncCode,
    $funcCode
} from "../../Blend";

export const execute = (): boolean =>
{
    if ($funcCode !== 613) {
        $setFuncCode(613);
        return true;
    }
    return false;
};
