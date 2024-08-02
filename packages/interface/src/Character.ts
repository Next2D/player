import type { CharacterImpl } from "./CharacterImpl";

export type Character<T extends CharacterImpl> = T;