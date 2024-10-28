import { Transaction } from "sequelize";
import { ValidationError } from "../errors";
import { User, Event } from "@server/models";

type Props = {
  user: User;
  actorId: string;
  transaction?: Transaction;
  ip: string;
};

/**
 * This command unsuspends a previously suspended user, allowing access to the
 * team again.
 */
export default async function userUnsuspender({
  user,
  actorId,
  transaction,
  ip,
}: Props): Promise<void> {
  if (user.id === actorId) {
    throw ValidationError("Unable to unsuspend the current user");
  }

  await user.update(
    {
      suspendedById: null,
      suspendedAt: null,
    },
    { transaction }
  );
  await Event.create(
    {
      name: "users.activate",
      actorId,
      userId: user.id,
      teamId: user.teamId,
      data: {
        name: user.name,
      },
      ip,
    },
    {
      transaction,
    }
  );
}
