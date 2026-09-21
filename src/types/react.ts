import type { Dispatch, SetStateAction } from "react";

export type StateTuple<T> = [value: T, setValue: Dispatch<SetStateAction<T>>];
