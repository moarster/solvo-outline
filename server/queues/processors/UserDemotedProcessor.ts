import CleanupDemotedUserTask from "../tasks/CleanupDemotedUserTask";
import BaseProcessor from "./BaseProcessor";
import { Event as TEvent, UserEvent } from "@server/types";

export default class UserDemotedProcessor extends BaseProcessor {
  static applicableEvents: TEvent["name"][] = ["users.demote"];

  async perform(event: UserEvent) {
    await CleanupDemotedUserTask.schedule({ userId: event.userId });
  }
}
