import { observable } from "mobx";
import Collection from "./Collection";
import User from "./User";
import Model from "./base/Model";
import { AfterRemove } from "./decorators/Lifecycle";
import Relation from "./decorators/Relation";
import { CollectionPermission } from "@shared/types";

class Membership extends Model {
  static modelName = "Membership";

  userId: string;

  @Relation(() => User, { onDelete: "cascade" })
  user: User;

  collectionId: string;

  @Relation(() => Collection, { onDelete: "cascade" })
  collection: Collection;

  @observable
  permission: CollectionPermission;

  // hooks

  @AfterRemove
  public static removeFromPolicies(model: Membership) {
    model.store.rootStore.policies.removeForMembership(model.id);
  }
}

export default Membership;
