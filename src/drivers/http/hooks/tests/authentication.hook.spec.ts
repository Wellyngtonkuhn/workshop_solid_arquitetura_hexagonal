import { beforeAll, describe, expect, it } from "vitest";
import { makeAuthenticationHook } from "../authentication.hook.js";
import { FakeTokenProvider } from "@/shared/tests/unit/doubles/FakeTokenProvider.js";
import { makeRequest } from "./helpers/make-request.js";
import { InvalidAccessTokenError } from "@/modules/auth/errors/invalid-access-token.error.js";

let authenticationHook: ReturnType<typeof makeAuthenticationHook>;

beforeAll(() => {
  const fakeTokenProvider = new FakeTokenProvider();
  authenticationHook = makeAuthenticationHook(fakeTokenProvider) 
})

describe("Pre-handler Authentication", () => {
  it("should throw an error when authorization header is missing", async () => {
    const request = makeRequest()
    await expect(authenticationHook(request as any)).rejects.toBeInstanceOf(InvalidAccessTokenError);
  })
})
// should throw an error when authorization header is missing
// should throw an error when authorization scheme is not Bearer
// should throw an error when bearer token is missing
// should throw an error when token is invalid
// should throw an error when token purpose is invalid
// should throw an error when token type is not access
// should throw an error when token subject is missing
// should authenticate the request when access token is valid
// should set the authenticated user id from token subject