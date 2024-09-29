import { test, expect, afterEach, describe } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoundThemeEditor } from "./round-theme-editor";

afterEach(cleanup);

describe("initial theme", () => {
  test("should be able to render", () => {
    render(<RoundThemeEditor />);

    expect(screen.getByTestId("theme").textContent).include("No theme");
  });

  test("should be able to render with null", () => {
    render(<RoundThemeEditor initialTheme={null} />);

    expect(screen.getByTestId("theme").textContent).include("No theme");
  });

  test("print theme when it given", () => {
    render(<RoundThemeEditor initialTheme="initial theme" />);

    expect(screen.getByTestId("theme").textContent).include("initial theme");
  });

  test("update initial theme if update", () => {
    const { container } = render(<RoundThemeEditor initialTheme="initial theme" />);
    render(<RoundThemeEditor initialTheme="updated theme" />, { container });

    expect(screen.getByTestId("theme").textContent).include("updated theme");
  });

  test("show loading", () => {
    render(<RoundThemeEditor initialTheme="updated theme" loading />);

    expect(screen.getByTestId("loading/root")).not.toBeNull();
  });
});

describe("edit theme", () => {
  test("do not show editor before switch", () => {
    render(<RoundThemeEditor initialTheme="initial theme" />);

    expect(screen.getByTestId("editor/root").dataset.shown).toBe("false");
  });

  test("show editor after switch", async () => {
    render(<RoundThemeEditor initialTheme="initial theme" />);

    await userEvent.click(screen.getByTestId("theme"));

    expect(screen.getByTestId("editor/root").dataset.shown).toBe("true");
  });

  test("gen event after edit and submit", async () => {
    expect.assertions(2);
    render(
      <RoundThemeEditor
        initialTheme="initial theme"
        onThemeChange={(v) => {
          expect(v).toBe("changed theme");
        }}
      />
    );

    await userEvent.click(screen.getByTestId("theme"));
    await userEvent.clear(screen.getByTestId("editor/input"));
    await userEvent.type(screen.getByTestId("editor/input"), "changed theme");
    await userEvent.click(screen.getByTestId("editor/submit"));

    expect(screen.getByTestId("editor/root").dataset.shown).toBe("false");
  });

  test("should not hide editor when lost focus on input", async () => {
    render(<RoundThemeEditor initialTheme="initial theme" />);

    await userEvent.click(screen.getByTestId("theme"));

    expect(screen.getByTestId("editor/root").dataset.shown).toBe("true");

    await userEvent.click(screen.getByTestId("root"));

    expect(screen.getByTestId("editor/root").dataset.shown).toBe("true");
  });

  test("should hide editor when type escape", async () => {
    expect.assertions(1);
    render(
      <RoundThemeEditor
        initialTheme="initial theme"
        onThemeChange={() => {
          expect(false);
        }}
      />
    );

    await userEvent.click(screen.getByTestId("theme"));
    await userEvent.type(screen.getByTestId("editor/input"), "abc{Escape}");

    expect(screen.getByTestId("editor/root").dataset.shown).toBe("false");
  });

  test("should change input value after change data", async () => {
    const { container } = render(<RoundThemeEditor initialTheme="initial theme" />);
    render(<RoundThemeEditor initialTheme="updated theme" />, { container });

    await userEvent.click(screen.getByTestId("theme"));

    expect(screen.getByTestId("editor/input").getAttribute("value")).toBe("updated theme");
  });
});
