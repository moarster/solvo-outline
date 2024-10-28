import { presentUser } from ".";
import GroupUser from "@server/models/GroupUser";

export default function presentGroupUser(
  membership: GroupUser,
  options?: { includeUser: boolean }
) {
  return {
    id: `${membership.userId}-${membership.groupId}`,
    userId: membership.userId,
    groupId: membership.groupId,
    user: options?.includeUser ? presentUser(membership.user) : undefined,
  };
}
