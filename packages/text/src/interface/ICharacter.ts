import type { IMovieClipCharacter } from "./IMovieClipCharacter";
import type { IVideoCharacter } from "./IVideoCharacter";
import type { IShapeCharacter } from "./IShapeCharacter";
import type { ITextFieldCharacter } from "./ITextFieldCharacter";

export type ICharacter = IMovieClipCharacter | IVideoCharacter | IShapeCharacter | ITextFieldCharacter;