import { Session } from "@/modules/auth/domain/entities/Session.js";
import { describe, expect, it } from "vitest";

describe("Session Domain Unit Test", () => {
  it("should create a session", () => {
    const expiresAt = new Date(Date.now() + 1000);

    const session = Session.create({
      userId: "user-123",
      refreshTokenHash: "hash",
      expiresAt,
      revokedAt: null,
    });

    expect(session.propsData.userId).toBe("user-123");
    expect(session.propsData.refreshTokenHash).toBe("hash");
    expect(session.propsData.expiresAt).toBe(expiresAt);
    expect(session.propsData.id).toBeUndefined();
    expect(session.propsData.createdAt).toBeInstanceOf(Date);
    expect(session.propsData.updatedAt).toBeInstanceOf(Date);
  });

  it("should return true when session expiration date has passed", () => {
    const session = Session.create({
      userId: "user-123",
      refreshTokenHash: "hash",
      expiresAt: new Date(Date.now() - 1000),
      revokedAt: null,
    });

    expect(session.isExpired()).toBe(true);
  });

  it("should return false when session has not expired", () => {
    const session = Session.create({
      userId: "user-123",
      refreshTokenHash: "hash",
      expiresAt: new Date(Date.now() + 1000),
      revokedAt: null,
    });

    expect(session.isExpired()).toBe(false);
  });

  it("should return false when session is not revoked", () => {
    const session = Session.create({
      userId: "user-123",
      refreshTokenHash: "hash",
      expiresAt: new Date(Date.now() + 1000),
      revokedAt: null,
    });
    expect(session.isRevoked()).toBe(false);
  });

  it("should return true when session is revoked", () => {
    const session = Session.create({
      userId: "user-123",
      refreshTokenHash: "hash",
      expiresAt: new Date(Date.now() + 1000),
      revokedAt: new Date(Date.now() - 5000),
    });
    expect(session.isRevoked()).toBe(true);
  });

  it("should allow refresh when session is valid", () => {
    const session = Session.create({
      userId: "user-123",
      refreshTokenHash: "hash",
      expiresAt: new Date(Date.now() + 1000),
      revokedAt: null,
    });

    expect(session.canRefresh()).toBe(true);
  })

  it("should not allow refresh when session is expired", () => {
    const session = Session.create({
      userId: "user-123",
      refreshTokenHash: "hash",
      expiresAt: new Date(Date.now() - 1000),
      revokedAt: null,
    });

    expect(session.canRefresh()).toBe(false);
  });

  it("should not allow refresh when session is revoked", () => {
    const session = Session.create({
      userId: "user-123",
      refreshTokenHash: "hash",
      expiresAt: new Date(Date.now() + 1000),
      revokedAt: new Date(),
    });

    expect(session.canRefresh()).toBe(false);
  });

  it("should revoke the session", () => {
    const session = Session.create({
      userId: "user-123",
      refreshTokenHash: "hash",
      expiresAt: new Date(Date.now() + 1000),
      revokedAt: null,
    });

    session.revoke();

    expect(session.isRevoked()).toBe(true);
    expect(session.propsData.revokedAt).toBeInstanceOf(Date);
  });

  it("should update updatedAt when session is revoked", () => {
    const session = Session.create({
      userId: "user-123",
      refreshTokenHash: "hash",
      expiresAt: new Date(Date.now() + 1000),
      revokedAt: null,
    });

    const previousUpdatedAt = session.propsData.updatedAt;

    session.revoke();

    expect(session.propsData.updatedAt.getTime()).toBeGreaterThanOrEqual(previousUpdatedAt.getTime());
  });
})