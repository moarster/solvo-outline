import { allow } from "./cancan";
import { isOwner } from "./utils";
import { User, Star } from "@server/models";

allow(User, ["read", "update", "delete"], Star, isOwner);
