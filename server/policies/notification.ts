import { allow } from "./cancan";
import { isOwner } from "./utils";
import { Notification, User } from "@server/models";

allow(User, ["read", "update"], Notification, isOwner);
