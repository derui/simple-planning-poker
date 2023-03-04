import classnames from "classnames";
import React from "react";
import { BaseProps, generateTestId } from "../base";
import { RadioGroup } from "./radio-group";
import { RadioButton } from "./radio-button";
import { UserMode } from "@/domains/game-player";
import * as User from "@/domains/user";

export interface Props extends BaseProps {
  name: string;
  mode: UserMode;
  onChangeUserInfo: (mode: UserMode, name: string) => void;
}

const styles = {
  root: classnames("flex", "flex-col", "absolute", "t-6", "r-0", "p-4", "border", "border-secondary1-500", "rounded"),

  applier: classnames("text-right", "mt-4"),

  submit: (disabled: boolean) =>
    classnames(
      "rounded",
      "border",
      "border-secondary1-400",
      "bg-secondary1-300",
      "py-3",
      "px-4",
      "cursor-pointer",
      "transition-shadow",
      "transition-color",
      {
        "bg-secondary1-200": disabled,
        "border-secondary1-300": disabled,
        "cursor-default": disabled,
      }
    ),

  nameEditor: classnames("flex", "flex-auto", "flex-col", "border", "border-secondary1-500"),
  nameEditorLabel: classnames("flex-none", "text-center", "px-4", "py-3", "bg-secondary1-500", "text-secondary1-200"),
  nameEditorInput: classnames(
    "flex-auto",
    "w-40",
    "mx-4",
    "my-3",
    "outline-none",
    "border-0",
    "border-b-q",
    "border-b-secondary1-400",
    "border-dashed",
    "focus:border-solid"
  ),
};

// eslint-disable-next-line func-style
export function UserInfoUpdater({ name, mode, onChangeUserInfo, ...rest }: Props) {
  const testid = generateTestId(rest.testid);
  const [currentName, setCurrentName] = React.useState(name);
  const [currentMode, setMode] = React.useState<UserMode>(mode);
  const allowApplying = User.canChangeName(currentName);

  return (
    <div
      data-testid={testid("root")}
      className={styles.root}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <div className={styles.nameEditor} data-testid={testid("nameEditor")}>
        <label className={styles.nameEditorLabel}>Name</label>
        <input
          data-testid={testid("nameEditorInput")}
          className={styles.nameEditorInput}
          type="text"
          defaultValue={name}
          onChange={(e) => setCurrentName(e.target.value)}
        />
      </div>
      <div className={styles.nameEditor}>
        <span className={styles.nameEditorLabel}>User Mode</span>
        <RadioGroup testid={testid("user-mode")}>
          <RadioButton
            testid={testid("inspector")}
            label="Inspector"
            value={UserMode.inspector}
            name="mode"
            onChange={(v) => setMode(v as UserMode)}
            checked={currentMode === UserMode.inspector}
          />
          <RadioButton
            testid={testid("normal")}
            label="Normal"
            value={UserMode.normal}
            name="mode"
            onChange={(v) => setMode(v as UserMode)}
            checked={currentMode === UserMode.normal}
          />
        </RadioGroup>
      </div>

      <div className={styles.applier}>
        <button
          data-testid={testid("submit")}
          disabled={!allowApplying}
          className={styles.submit(!allowApplying)}
          onClick={() => onChangeUserInfo(currentMode, currentName)}
        >
          update
        </button>
      </div>
    </div>
  );
}
