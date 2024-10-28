import compact from "lodash/compact";
import { serialize } from "../policies";
import { traceFunction } from "@server/logging/tracing";
import { User } from "@server/models";

type Policy = {
  id: string;
  abilities: Record<string, boolean | string[]>;
};

function presentPolicy(
  user: User,
  models: (Parameters<typeof serialize>[1] | null)[]
): Policy[] {
  return compact(models).map((model) => ({
    id: model.id,
    abilities: serialize(user, model),
  }));
}

export default traceFunction({
  spanName: "presenters",
})(presentPolicy);
