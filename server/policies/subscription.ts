import { allow } from "./cancan";
import { isOwner } from "./utils";
import { Subscription, User } from "@server/models";

allow(User, ["read", "update", "delete"], Subscription, isOwner);
