import { beforeEach, describe, expect, it } from "vitest";
import { makeAuthenticationHook } from "../authentication.hook.js";
import { FakeTokenProvider } from "@/shared/tests/unit/doubles/FakeTokenProvider.js";
import { makeRequest } from "./helpers/make-request.js";
import { InvalidAccessTokenError } from "@/modules/auth/errors/invalid-access-token.error.js";

let fakeTokenProvider: FakeTokenProvider;
let authenticationHook: ReturnType<typeof makeAuthenticationHook>;

beforeEach(() => {
  fakeTokenProvider = new FakeTokenProvider();
  authenticationHook = makeAuthenticationHook(fakeTokenProvider) 
})

describe("Pre-handler Authentication", () => {
  it("should throw an error when authorization header is missing", async () => {
    const request = makeRequest()
    await expect(authenticationHook(request)).rejects.toBeInstanceOf(InvalidAccessTokenError);
  })

  it("should throw an error when authorization scheme is not Bearer", async () => {
    const request = makeRequest('Basic 123')
    await expect(authenticationHook(request)).rejects.toBeInstanceOf(InvalidAccessTokenError);
  })

  it("should throw an error when bearer token is missing", async () => {
    const request = makeRequest('Bearer')
    await expect(authenticationHook(request)).rejects.toBeInstanceOf(InvalidAccessTokenError);
  })

  it("should throw an error when token is invalid", async () => {
    fakeTokenProvider.verify = () => {
      throw new Error("Invalid token");
    };
    const request = makeRequest('Bearer algum-token')
    await expect(authenticationHook(request)).rejects.toBeInstanceOf(InvalidAccessTokenError);
  })

  it("should throw an error when token purpose is invalid", async () => {
    fakeTokenProvider.payload = {
      sub: "fake-user-id",
      purpose: "email_confirmation",
      type: "access",
    };
    const request = makeRequest(`Bearer fake-token`)
    await expect(authenticationHook(request)).rejects.toBeInstanceOf(InvalidAccessTokenError);
  })

  it("should throw an error when token type is not access", async () => {
    fakeTokenProvider.payload = {
      sub: "fake-user-id",
      purpose: "authentication",
      type: "refresh",
    };
    const request = makeRequest(`Bearer fake-refresh`)
    await expect(authenticationHook(request)).rejects.toBeInstanceOf(InvalidAccessTokenError);
  })

  it("should throw an error when token subject is missing", async () => {
    fakeTokenProvider.payload = {
      sub: "",
      purpose: "authentication",
      type: "access",
    };
    const request = makeRequest(`Bearer fake-access`)
    await expect(authenticationHook(request)).rejects.toBeInstanceOf(InvalidAccessTokenError);
  })

  it("should authenticate the request when access token is valid", async () => {
    fakeTokenProvider.payload = {
      sub: "user-123456789",
      purpose: "authentication",
      type: "access",
    };
    const request = makeRequest("Bearer fake-access");
    await expect(authenticationHook(request)).resolves.toBeUndefined();
  });

  it("should set the authenticated user id from token subject", async () => {
    fakeTokenProvider.payload = {
      sub: "user-123",
      purpose: "authentication",
      type: "access",
    };

    const request = makeRequest("Bearer fake-access");

    await authenticationHook(request);
    expect(request.user.id).toBe("user-123")
  })
})