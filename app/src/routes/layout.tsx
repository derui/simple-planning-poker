import { themeClass } from "@spp/ui-theme";
import { Suspense } from "react";
import { Outlet } from "react-router";

// eslint-disable-next-line func-style
export function RootLayout() {
  return (
    <Suspense>
      <div id="theme" className={themeClass}>
        <Outlet />
      </div>
    </Suspense>
  );
}
