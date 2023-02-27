import React from "react";
import classnames from "classnames";
import { BaseProps, generateTestId } from "../base";
import { UserInfoUpdater } from "../presentations/user-info-updater";
import { UserMode } from "@/domains/game-player";

interface Props extends BaseProps {
  name: string;
  mode: UserMode;
  onChangeName?: (name: string) => void;
  onChangeMode?: (mode: UserMode) => void;
}

const styles = {
  root: classnames(
    "flex",
    "relative",
    "align-center",
    "px-3",
    "border-1-bt",
    "border-1-bt-transparent",
    "transition-color",
    "cursor-pointer",
    "hover:border-secondary-500"
  ),

  icon: classnames(
    "inline-block",
    "flex-none",
    "w-6",
    "h-6",
    "bg-secondary1-500",
    "mr-3",
    '[mask-image:url("/assets/svg/tabler-icon/user.svg")]',
    "[mask-size:cover]"
  ),

  name: classnames("inline-block", "flex-none", "w-32", "overflow-hidden", "text-ellipsis", "text-primary-500"),

  indicator: (opened: boolean) =>
    classnames(
      "ml-3",
      "inline-block",
      "flex-none",
      '[mask-image:url("/assets/svg/tabler-icon/shevron-down.svg")]',
      "[mask-size:cover]",
      "w-5",
      "h-5",
      "bg-primary-500",
      "transition-transform",
      {
        "[transform:rotateZ(180deg)]": opened,
      }
    ),
};

// eslint-disable-next-line func-style
export function UserInfoContainer(props: Props) {
  const testid = generateTestId(props.testid);
  const [opened, setOpened] = React.useState(false);

  return (
    <div className={styles.root} data-testid={testid("root")} onClick={() => setOpened(!opened)}>
      <span className={styles.icon}></span>
      <span className={styles.name} data-testid={testid("name")}>
        {props.name}
      </span>
      <span className={styles.indicator(opened)} data-testid={testid("indicator")} data-opened={opened}></span>
      {opened ? (
        <UserInfoUpdater
          name={props.name}
          mode={props.mode}
          onChangeUserInfo={(mode, name) => {
            setOpened(false);

            if (props.onChangeName) {
              props.onChangeName(name);
            }

            if (props.onChangeMode) {
              props.onChangeMode(mode);
            }
          }}
        />
      ) : null}
    </div>
  );
}
