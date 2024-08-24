import { atom, useAtom, useAtomValue } from "jotai";

const messageAtom = atom("hello");

const writeMessageAtom = atom(null, (_get, set, value: string) => {
  set(messageAtom, value);
});

export const useMessage = () => {
  const atom = useAtomValue(messageAtom);
  const [, updateMessage] = useAtom(writeMessageAtom);

  return {
    message: atom,
    updateMessage: (value: string) => updateMessage(value),
  };
};
