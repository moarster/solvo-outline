import * as React from "react";
import config from "../plugin.json";
import Icon from "./Icon";
import { UserRole } from "@shared/types";
import { Hook, PluginManager } from "~/utils/PluginManager";

PluginManager.add([
  {
    ...config,
    type: Hook.Settings,
    value: {
      group: "Integrations",
      icon: Icon,
      component: React.lazy(() => import("./Settings")),
      enabled: (_, user) => user.role === UserRole.Admin,
    },
  },
]);
