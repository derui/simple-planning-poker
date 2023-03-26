import { Suspense } from "react";
import { Outlet } from "react-router";
import { KickedUserNavigator } from "./kicked-user-navigator";

// eslint-disable-next-line func-style
export function RootLayout() {
  return (
    <Suspense>
      <Outlet />
      <KickedUserNavigator />
    </Suspense>
  );
}
