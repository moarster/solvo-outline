import { Context, Next } from "koa";
import semver from "semver";
import { EditorUpdateError } from "@server/errors";
import EDITOR_VERSION from "@shared/editor/version";

export default function editor() {
  /**
   * Middleware to prevent connections from clients with an outdated editor
   * version. See the equivalent logic for collab server in:
   * /server/collaboration/EditorVersionExtension.ts
   */
  return async function editorMiddleware(ctx: Context, next: Next) {
    const clientVersion = ctx.headers["x-editor-version"];

    if (clientVersion) {
      const parsedClientVersion = semver.parse(clientVersion as string);
      const parsedCurrentVersion = semver.parse(EDITOR_VERSION);

      if (
        parsedClientVersion &&
        parsedCurrentVersion &&
        parsedClientVersion.major < parsedCurrentVersion.major
      ) {
        throw EditorUpdateError();
      }
    }

    return next();
  };
}
