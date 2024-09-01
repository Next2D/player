import { IProgramObject } from "../../../interface/IProgramObject";
import { $gl } from "../../../WebGLUtil";

/**
 * @description 現在利用中のプログラムID
 *              Currently used program ID
 *
 * @type {number}
 * @private
 */
let $currentProgramId: number = -1;

/**
 * @description ProgramObjectのプログラムの利用を開始します。
 *              Start using the program of the ProgramObject.
 *
 * @param  {IProgramObject} program_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = (program_object: IProgramObject): void =>
{
    if ($currentProgramId === program_object.id) {
        return ;
    }

    $currentProgramId = program_object.id;
    $gl.useProgram(program_object.resource);
};