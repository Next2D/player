import type { Video } from "@next2d/media";
import type { IVideoCharacter } from "../../interface/IVideoCharacter";

/**
 * @description characterを元にTextFieldを構築
 *              Build TextField based on character
 *
 * @param  {Video} video
 * @param  {IVideoCharacter} character
 * @return {void}
 * @method
 * @protected
 */
export const execute = (video: Video, character: IVideoCharacter): void =>
{
    if (!character.videoData) {
        character.videoData = new Uint8Array(character.buffer as number[]);
        character.buffer = null;
    }

    video.loop        = character.loop;
    video.autoPlay    = character.autoPlay;
    video.videoWidth  = character.bounds.xMax;
    video.videoHeight = character.bounds.yMax;
    video.volume      = character.volume;

    video.src = URL.createObjectURL(new Blob(
        [character.videoData],
        { "type": "video/mp4" }
    ));
};