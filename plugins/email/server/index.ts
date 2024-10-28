import config from "../plugin.json";
import router from "./auth/email";
import env from "@server/env";
import { Hook, PluginManager } from "@server/utils/PluginManager";

const enabled = !!env.SMTP_HOST || env.isDevelopment;

if (enabled) {
  PluginManager.add({
    ...config,
    type: Hook.AuthProvider,
    value: { router, id: config.id },
  });
}
