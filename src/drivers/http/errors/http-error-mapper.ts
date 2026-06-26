
import { ApplicationError } from "../../../shared/errors/application-error.js";
import { HttpErrorResult } from "./http-error-response.js";

export function mapHttpError(error: unknown): HttpErrorResult {
  if (error instanceof ApplicationError) {
    return {
      statusCode: error.statusCode,
      body: {
          statusCode: error.statusCode,
          error: {
            code: error.code,
            message: error.message,
          }
        },
    };
  }

    if (typeof error === "object" && error !== null && "code" in error && error.code === "FST_ERR_VALIDATION") {
    const validation = error as any;
    return {
      statusCode: 400,
      body: {
        statusCode: 400,
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details: validation.validation.map((err: any) => ({
            field: err.instancePath.replace("/", ""),
            message: err.message,
            code: err.keyword,
          })),
        }
      },
    };
  }

  return {
    statusCode: 500,
    body: {
      statusCode: 500,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
      },
    }
  };
}
