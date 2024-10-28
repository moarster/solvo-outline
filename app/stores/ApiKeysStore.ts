import { computed } from "mobx";
import RootStore from "./RootStore";
import Store, { RPCAction } from "./base/Store";
import ApiKey from "~/models/ApiKey";

export default class ApiKeysStore extends Store<ApiKey> {
  actions = [RPCAction.List, RPCAction.Create, RPCAction.Delete];

  constructor(rootStore: RootStore) {
    super(rootStore, ApiKey);
  }

  @computed
  get personalApiKeys() {
    const userId = this.rootStore.auth.user?.id;
    return userId
      ? this.orderedData.filter((key) => key.userId === userId)
      : [];
  }
}
