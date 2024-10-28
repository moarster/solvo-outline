import config from "../plugin.json";
import Icon from "./Icon";
import { Hook, PluginManager } from "~/utils/PluginManager";

PluginManager.add([
  {
    ...config,
    type: Hook.Icon,
    value: Icon,
  },
]);
