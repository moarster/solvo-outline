import { allow } from "./cancan";
import { isOwner, or } from "./utils";
import { User, UserMembership } from "@server/models";

allow(User, ["update", "delete"], UserMembership, (actor, membership) =>
  or(
    //
    isOwner(actor, membership),
    actor.isAdmin
  )
);
