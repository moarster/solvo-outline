import CleanupDemotedUserTask from "../tasks/CleanupDemotedUserTask";
import BaseProcessor from "./BaseProcessor";
import { Event as TEvent, UserEvent } from "@server/types";

export default class UserDemotedProcessor extends BaseProcessor {
  static applicableEvents: TEvent["name"][] = ["users.demote", "users.suspend"];

  async perform(event: UserEvent) {
    await new CleanupDemotedUserTask().schedule({ userId: event.userId });
  }
}
