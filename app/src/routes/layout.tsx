import { Suspense } from "react";
import { Outlet } from "react-router";

// eslint-disable-next-line func-style
export function RootLayout() {
  return (
    <Suspense>
      <Outlet />
    </Suspense>
  );
}
