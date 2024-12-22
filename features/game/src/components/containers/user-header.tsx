import { useEffect, useState } from "react";
import { hooks } from "../../hooks/facade.js";
import { UserHeaderLayout } from "./user-header.layout.js";

/**
 * Container for the user header.
 */
export const UserHeader = function UserHeader(): JSX.Element {
  const { loginUser, loading: status, changeDefaultVoterMode, editName } = hooks.useUserHeader();
  const [mode, setMode] = useState<"edit" | "view">("view");

  useEffect(() => {
    if (status == "edited") {
      setMode("view");
    }
  }, [status]);

  return (
    <UserHeaderLayout
      user={loginUser}
      mode={mode}
      onSubmitEdit={editName}
      onChangeDefaultVoterMode={changeDefaultVoterMode}
      onRequestUserNameEdit={() => setMode("edit")}
      onCancelUserNameEdit={() => setMode("view")}
    />
  );
};
