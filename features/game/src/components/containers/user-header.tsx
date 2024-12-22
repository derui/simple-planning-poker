import { useEffect, useState } from "react";
import { useUserInfo } from "../../atoms/use-user-info.js";
import { UserHeaderLayout } from "./user-header.layout.js";

/**
 * Container for the user header.
 */
export const UserHeader = function UserHeader(): JSX.Element {
  const { loginUser, loading, changeDefaultVoterMode, editName } = useUserInfo();
  const [mode, setMode] = useState<"edit" | "view">("view");

  useEffect(() => {
    if (!loading) {
      setMode("view");
    }
  }, [loading]);

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
