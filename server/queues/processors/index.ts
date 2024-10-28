import BaseProcessor from "./BaseProcessor";
import { Hook, PluginManager } from "@server/utils/PluginManager";
import { requireDirectory } from "@server/utils/fs";

const processors: Record<string, typeof BaseProcessor> = {};

requireDirectory<{ default: typeof BaseProcessor }>(__dirname).forEach(
  ([module, id]) => {
    if (id === "index") {
      return;
    }
    processors[id] = module.default;
  }
);

PluginManager.getHooks(Hook.Processor).forEach((hook) => {
  processors[hook.value.name] = hook.value;
});

export default processors;
