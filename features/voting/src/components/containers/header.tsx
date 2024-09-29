import clsx from "clsx";

const styles = {
  root: clsx("flex", "flex-none", "justify-between", "items-center", "p-4", "z-30"),
  right: clsx("flex", "flex-auto", "align-center", "justify-end", "space-x-4"),
} as const;

// eslint-disable-next-line func-style
export function Header() {
  return (
    <div className={styles.root} data-testid={gen("root")}>
      <GameInfo
        owner={userInfo[0].owner}
        gameName={gameName[0]}
        onLeaveGame={handleLeaveGame}
        onBack={handleBack}
        testid={gen("game-info")}
      />

      <div className={styles.right}>
        <JoinedUserList
          users={joinedPlayers[0]}
          onKick={userInfo[0].owner ? handleKick : undefined}
          testid={gen("joined-user-list")}
        />
        <InvitationToken invitationToken={invitation[0]} testid={gen("invitation")} onCopy={handleCopy} />
        <UserInfoContainer testid={gen("user-info")} />
      </div>
    </div>
  );
}
