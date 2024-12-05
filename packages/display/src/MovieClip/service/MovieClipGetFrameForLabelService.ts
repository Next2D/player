import type { MovieClip } from "../../MovieClip";

/**
 * @description ラベル名に対応するフレーム番号を取得します。
 *              Get the frame number corresponding to the label name.
 *
 * @param  {MovieClip} movie_clip
 * @param  {string} name
 * @return {number}
 * @method
 * @protected
 */
export const execute = (movie_clip: MovieClip, name: string): number =>
{
    if (!movie_clip.$labels || !movie_clip.$labels.size) {
        return 0;
    }

    for (const [frame, frameLabel] of movie_clip.$labels) {
        if (frameLabel.name !== name) {
            continue;
        }
        return frame;
    }

    return 0;
};