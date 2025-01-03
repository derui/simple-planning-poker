import { User, VoterType } from "@spp/shared-domain";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { Atom, atom, WritableAtom } from "jotai";
import { atomWithRefresh, unwrap } from "jotai/utils";
import { VoterMode } from "../components/type.js";

/**
 * Logined user id
 */
const loginUserIdAtom = atom<User.Id | undefined>();

const asyncLoginUserAtom = atomWithRefresh(async (get) => {
  const userId = get(loginUserIdAtom);

  if (!userId) return undefined;

  return await UserRepository.findBy({ id: userId });
});

/**
 * Logined user. Do not provide loading state.
 */
export const loginUserAtom: Atom<User.T | undefined> = unwrap(asyncLoginUserAtom);

/**
 * Load user
 */
export const loadUserAtom: WritableAtom<null, [userId: User.Id], void> = atom(null, (_get, set, userId: User.Id) => {
  set(loginUserIdAtom, userId);
});

const internalEditingUserAtom = atom(false);

/**
 * Get during editing for user
 */
export const editingUserAtom: Atom<boolean> = atom((get) => get(internalEditingUserAtom));

/**
 * Edit user name
 */
export const editUserNameAtom: WritableAtom<null, [name: string], void> = atom(null, (get, set, name: string) => {
  const user = get(loginUserAtom);

  if (!user) {
    return;
  }

  set(internalEditingUserAtom, true);

  UserRepository.save({ user: User.changeName(user, name)[0] })
    .then(() => {
      set(asyncLoginUserAtom);
    })
    .finally(() => {
      set(internalEditingUserAtom, false);
    });
});

/**
 * Change default voter mode
 */
export const changeDefaultVoterModeAtom: WritableAtom<null, [voterMode: VoterMode], void> = atom(
  null,
  (get, set, voterMode: VoterMode) => {
    const user = get(loginUserAtom);
    const editing = get(internalEditingUserAtom);

    if (!user || editing) {
      return;
    }

    set(internalEditingUserAtom, true);

    let revisedVoterMode: VoterType.T = VoterType.Normal;
    if (voterMode === VoterMode.Inspector) {
      revisedVoterMode = VoterType.Inspector;
    }

    UserRepository.save({ user: User.changeDefaultVoterType(user, revisedVoterMode) })
      .then(() => {
        set(asyncLoginUserAtom);
      })
      .finally(() => {
        set(internalEditingUserAtom, false);
      });
  }
);
