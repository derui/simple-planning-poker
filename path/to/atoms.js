import { atom } from 'jotai';

export const currentVoterRoleAtom = atom((get) => {
  // Assuming there is some way to get the current voter's role
  // For example, from a context or a global state
  const currentVoter = get(currentVoterAtom); // Hypothetical atom that holds the current voter
  return currentVoter ? currentVoter.role : null;
});
