import { allow } from "./cancan";
import { isOwner } from "./utils";
import { SearchQuery, User } from "@server/models";

allow(User, ["read", "delete"], SearchQuery, isOwner);
