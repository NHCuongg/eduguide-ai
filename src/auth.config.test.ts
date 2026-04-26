import { describe, expect, test, vi } from "vitest"

describe("authConfig callbacks", () => {
  test("copies the authenticated user id into the JWT and session", async () => {
    vi.resetModules()
    vi.stubEnv("AUTH_SECRET", "test-auth-secret")
    vi.stubEnv("OPENROUTER_API_KEY", "test-openrouter-key")

    const { authConfig } = await import("./auth.config")

    const jwtCallback = authConfig.callbacks?.jwt
    const sessionCallback = authConfig.callbacks?.session

    expect(jwtCallback).toBeTypeOf("function")
    expect(sessionCallback).toBeTypeOf("function")

    const token = await jwtCallback?.({
      token: {},
      user: { id: "user-123", email: "learner@example.com" },
      account: null,
      profile: undefined,
      trigger: "signIn",
      isNewUser: false,
      session: undefined,
    })

    expect(token).toMatchObject({ id: "user-123" })

    const session = await sessionCallback?.({
      session: {
        user: {
          name: "Learner",
          email: "learner@example.com",
          image: null,
        },
        expires: "2099-01-01T00:00:00.000Z",
      },
      token: token ?? {},
      user: undefined,
      newSession: undefined,
      trigger: undefined,
    })

    expect(session?.user).toMatchObject({ id: "user-123" })
  })
})
