import { Epic } from "redux-observable";
import type { Action } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Dependencies } from "@/dependencies";
import { DependencyRegistrar } from "@/utils/dependency-registrar";

type Epics = "";

export const authEpic = (
  registrar: DependencyRegistrar<Dependencies>
): Record<Epics, Epic<Action, Action, RootState>> => ({
  // implement epics
});
