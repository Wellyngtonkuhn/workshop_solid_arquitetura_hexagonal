import { DrizzleQueryError } from "drizzle-orm";

type ErrorConstructor = new () => Error;

export function mapDrizzleError(error: unknown, duplicateConstraintMap: Record<string, ErrorConstructor>): never {

  if (error instanceof DrizzleQueryError && error.cause && typeof error.cause === "object") {
    const cause = error.cause as {
      code?: string;
      constraint?: string;
    };

    if (cause.code === "23505" && cause.constraint) {
      const ErrorClass = duplicateConstraintMap[cause.constraint];

      if (ErrorClass) {
        throw new ErrorClass();
      }
    }
  }

  throw error;
}