/* eslint-disable no-console */
import { IncomingMessage } from "http";
import chalk from "chalk";
import isEmpty from "lodash/isEmpty";
import winston from "winston";
import * as Tracing from "./tracer";
import env from "@server/env";
import Metrics from "@server/logging/Metrics";
import Sentry from "@server/logging/sentry";
import ShutdownHelper from "@server/utils/ShutdownHelper";

type LogCategory =
  | "lifecycle"
  | "authentication"
  | "multiplayer"
  | "http"
  | "commands"
  | "worker"
  | "task"
  | "processor"
  | "email"
  | "queue"
  | "websockets"
  | "database"
  | "utils"
  | "plugins";
type Extra = Record<string, any>;

class Logger {
  output: winston.Logger;

  public constructor() {
    this.output = winston.createLogger({
      // The check for log level validity is here in addition to the ENV validation
      // as entering an incorrect LOG_LEVEL in env could otherwise prevent the
      // related error message from being displayed.
      level: [
        "error",
        "warn",
        "info",
        "http",
        "verbose",
        "debug",
        "silly",
      ].includes(env.LOG_LEVEL)
        ? env.LOG_LEVEL
        : "info",
    });

    this.output.add(
      new winston.transports.Console({
        format: env.isProduction
          ? winston.format.json()
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.printf(
                ({ message, level, label, ...extra }) =>
                  `${level}: ${
                    label ? chalk.bold("[" + label + "] ") : ""
                  }${message} ${isEmpty(extra) ? "" : JSON.stringify(extra)}`
              )
            ),
      })
    );

    if (
      env.DEBUG &&
      env.DEBUG !== "http" &&
      !["silly", "debug"].includes(env.LOG_LEVEL)
    ) {
      this.warn(
        `"DEBUG" set in configuration but the "LOG_LEVEL" configuration is filtering debug messages. To see all logging, set "LOG_LEVEL" to "debug".`
      );
    }
  }

  /**
   * Log information
   *
   * @param category A log message category that will be prepended
   * @param extra Arbitrary data to be logged that will appear in prod logs
   */
  public info(label: LogCategory, message: string, extra?: Extra) {
    this.output.info(message, { ...this.sanitize(extra), label });
  }

  /**
   * Debug information
   *
   * @param category A log message category that will be prepended
   * @param extra Arbitrary data to be logged that will appear in development logs
   */
  public debug(label: LogCategory, message: string, extra?: Extra) {
    this.output.debug(message, { ...this.sanitize(extra), label });
  }

  /**
   * Detailed information – for very detailed logs, more detailed than debug. "silly" is the
   * lowest priority npm log level.
   *
   * @param category A log message category that will be prepended
   * @param extra Arbitrary data to be logged that will appear in verbose logs
   */
  public silly(label: LogCategory, message: string, extra?: Extra) {
    this.output.silly(message, { ...this.sanitize(extra), label });
  }

  /**
   * Log a warning
   *
   * @param message A warning message
   * @param extra Arbitrary data to be logged that will appear in prod logs
   */
  public warn(message: string, extra?: Extra) {
    Metrics.increment("logger.warning");

    if (env.SENTRY_DSN) {
      Sentry.withScope((scope) => {
        scope.setLevel("warning");

        for (const key in extra) {
          scope.setExtra(key, this.sanitize(extra[key]));
        }

        Sentry.captureMessage(message);
      });
    }

    if (env.isProduction) {
      this.output.warn(message, this.sanitize(extra));
    } else if (extra) {
      console.warn(message, extra);
    } else {
      console.warn(message);
    }
  }

  /**
   * Report a runtime error
   *
   * @param message A description of the error
   * @param error The error that occurred
   * @param extra Arbitrary data to be logged that will appear in prod logs
   * @param request An optional request object to attach to the error
   */
  public error(
    message: string,
    error: Error,
    extra?: Extra,
    request?: IncomingMessage
  ) {
    Metrics.increment("logger.error", {
      name: error.name,
    });
    Tracing.setError(error);

    if (env.SENTRY_DSN) {
      Sentry.withScope((scope) => {
        scope.setLevel("error");

        for (const key in extra) {
          scope.setExtra(key, this.sanitize(extra[key]));
        }

        if (request) {
          scope.addEventProcessor((event) =>
            Sentry.Handlers.parseRequest(event, request)
          );
        }

        Sentry.captureException(error);
      });
    }

    if (env.isProduction) {
      this.output.error(message, {
        error: error.message,
        stack: error.stack,
      });
    } else {
      console.error(message);
      console.error(error);

      if (extra) {
        console.error(extra);
      }
    }
  }

  /**
   * Report a fatal error and shut down the server
   *
   * @param message A description of the error
   * @param error The error that occurred
   * @param extra Arbitrary data to be logged that will appear in prod logs
   */
  public fatal(message: string, error: Error, extra?: Extra) {
    this.error(message, error, extra);
    void ShutdownHelper.execute();
  }

  /**
   * Sanitize data attached to logs and errors to remove sensitive information.
   *
   * @param input The data to sanitize
   * @param level The current recursion level (default: 0)
   * @returns The sanitized data
   */
  private sanitize<T>(input: T, level = 0): T {
    // Short circuit if we're not in production to enable easier debugging
    if (!env.isProduction) {
      return input;
    }

    const sensitiveFields = [
      "accessToken",
      "refreshToken",
      "token",
      "password",
      "content",
    ];
    const maxRecursionLevel = 3;
    const truncatedValue = "[…]";

    // Prevent excessive recursion
    if (level > maxRecursionLevel) {
      return truncatedValue as unknown as T;
    }

    if (typeof input === "string") {
      return this.sanitizeString(input, sensitiveFields);
    }

    if (Array.isArray(input)) {
      return this.sanitizeArray(input, level) as unknown as T;
    }

    if (typeof input === "object" && input !== null) {
      return this.sanitizeObject(input, sensitiveFields, level);
    }

    return input;
  }

  private sanitizeString(input: string, sensitiveFields: string[]): string {
    return sensitiveFields.some((field) => input.includes(field))
      ? "[Filtered]"
      : input;
  }

  private sanitizeArray<T>(input: T[], level: number): T[] {
    return input.map((item) => this.sanitize(item, level + 1));
  }

  private sanitizeObject<T extends object>(
    input: T,
    sensitiveFields: string[],
    level: number
  ): T {
    const output = { ...input };

    for (const [key, value] of Object.entries(output)) {
      if (sensitiveFields.includes(key)) {
        output[key as keyof T] = "[Filtered]" as unknown as T[keyof T];
      } else if (typeof value === "object" && value !== null) {
        output[key as keyof T] = this.sanitize(value, level + 1);
      } else {
        output[key as keyof T] = this.sanitize(value, level + 1);
      }
    }

    return output;
  }
}

export default new Logger();
