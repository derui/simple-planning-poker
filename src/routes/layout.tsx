import { Outlet } from "react-router";
import { GameRoutingNavigator } from "./game-routing-navigator";

// eslint-disable-next-line func-style
export function RootLayout() {
  return (
    <>
      <GameRoutingNavigator />
      <Outlet />
    </>
  );
}
