import {
    $setFuncCode,
    $funcCode
} from "../../Blend";

export const execute = (): boolean =>
{
    if ($funcCode !== 401) {
        $setFuncCode(401);
        return true;
    }
    return false;
};
