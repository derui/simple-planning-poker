import classnames from "classnames";
import React from "react";
import { BaseProps, generateTestId } from "../base";
import { baseInput } from "../common-styles";
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
  root: classnames(
    "flex",
    "flex-col",
    "absolute",
    "top-10",
    "right-0",
    "p-3",
    "pt-1",
    "border",
    "border-secondary1-500",
    "rounded"
  ),

  applier: classnames("text-right", "mt-3"),

  submit: (disabled: boolean) =>
    classnames(
      "rounded",
      "border",
      "py-2",
      "px-3",
      "transition-all",
      "active:shadow-md",
      {
        "border-secondary1-400": !disabled,
        "bg-secondary1-300": !disabled,
        "cursor-pointer": !disabled,
        "text-secondary1-500": !disabled,
      },
      {
        "bg-secondary1-200": disabled,
        "border-secondary1-300": disabled,
        "cursor-default": disabled,
        "text-secondary1-400": disabled,
      }
    ),

  nameEditor: classnames("flex", "flex-auto", "flex-col", "border", "border-secondary1-500", "rounded", "mt-3"),
  nameEditorLabel: classnames("flex-none", "text-center", "px-3", "py-2", "bg-secondary1-500", "text-secondary1-200"),
  nameEditorInput: classnames(baseInput),
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
            key="inspector"
            testid={testid("inspector")}
            label="Inspector"
            value={UserMode.inspector}
            name="mode"
            onCheck={() => {
              setMode(UserMode.inspector);
            }}
            checked={currentMode === UserMode.inspector}
          />
          <RadioButton
            key="normal"
            testid={testid("normal")}
            label="Normal"
            value={UserMode.normal}
            name="mode"
            onCheck={() => setMode(UserMode.normal)}
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
