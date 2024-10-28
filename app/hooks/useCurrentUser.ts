import invariant from "invariant";
import useStores from "./useStores";
import User from "~/models/User";

/**
 * Returns the current user, or undefined if there is no current user and `rejectOnEmpty` is set to
 * false.
 *
 * @param options.rejectOnEmpty - If true, throws an error if there is no current user. Defaults to true.
 */
function useCurrentUser(options: { rejectOnEmpty: false }): User | undefined;
function useCurrentUser(options?: { rejectOnEmpty: true }): User;
function useCurrentUser({
  rejectOnEmpty = true,
}: { rejectOnEmpty?: boolean } = {}) {
  const { auth } = useStores();
  if (rejectOnEmpty) {
    invariant(auth.user, "user required");
  }
  return auth.user || undefined;
}

export default useCurrentUser;
