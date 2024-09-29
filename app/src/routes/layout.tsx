import { Suspense } from "react";
import { Outlet } from "react-router";
import { KickedUserNavigator } from "./kicked-user-navigator";
import { NotificationHolderContainer } from "@/components/containers/notification-holder-container";

// eslint-disable-next-line func-style
export function RootLayout() {
  return (
    <Suspense>
      <Outlet />
      <KickedUserNavigator />
      <NotificationHolderContainer />
    </Suspense>
  );
}
