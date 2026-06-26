import { HttpErrorResponse } from "./http-error.schema.js";

export interface HttpErrorResult {
  statusCode: number;
  body: HttpErrorResponse;
}