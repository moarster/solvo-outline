import { allow } from "./cancan";
import { and, isTeamAdmin, isTeamMutable } from "./utils";
import { User, Team, WebhookSubscription } from "@server/models";

allow(User, "createWebhookSubscription", Team, (actor, team) =>
  and(
    //
    isTeamAdmin(actor, team),
    isTeamMutable(actor),
    !actor.isSuspended
  )
);

allow(User, "listWebhookSubscription", Team, isTeamAdmin);

allow(User, ["read", "update", "delete"], WebhookSubscription, isTeamAdmin);
