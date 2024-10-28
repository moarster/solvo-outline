import * as React from "react";
import config from "../plugin.json";
import Icon from "./Icon";
import { Hook, PluginManager } from "~/utils/PluginManager";

PluginManager.add([
  {
    ...config,
    type: Hook.Settings,
    value: {
      group: "Integrations",
      icon: Icon,
      component: React.lazy(() => import("./Settings")),
    },
  },
]);
