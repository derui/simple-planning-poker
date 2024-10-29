import { Suspense } from "react";
import { Outlet } from "react-router";
import { themeClass } from "../../../packages/ui/theme/dist/style.css.js";

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
