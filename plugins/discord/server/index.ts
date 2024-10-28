import config from "../plugin.json";
import router from "./auth/discord";
import env from "./env";
import { PluginManager, Hook } from "@server/utils/PluginManager";

const enabled = !!env.DISCORD_CLIENT_ID && !!env.DISCORD_CLIENT_SECRET;

if (enabled) {
  PluginManager.add({
    ...config,
    type: Hook.AuthProvider,
    value: { router, id: config.id },
  });
}
