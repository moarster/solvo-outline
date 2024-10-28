import { allow } from "./cancan";
import { isTeamAdmin } from "./utils";
import { User, Pin } from "@server/models";

allow(User, ["update", "delete"], Pin, isTeamAdmin);
