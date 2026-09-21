import { useDispatch, useSelector } from "react-redux";
import type { UseDispatch, UseSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

export const useAppDispatch: UseDispatch<AppDispatch> = useDispatch.withTypes<AppDispatch>();
export const useAppSelector: UseSelector<RootState> = useSelector.withTypes<RootState>();
