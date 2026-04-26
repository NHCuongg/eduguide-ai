import { describe, expect, test } from "vitest"

describe("Inngest function registry", () => {
  test("registers signup and password reset email handlers", async () => {
    const { inngestFunctions } = await import("./function-registry")

    const functionIds = inngestFunctions.map((fn) => fn.opts.id)

    expect(functionIds).toEqual(
      expect.arrayContaining([
        "send-welcome-email",
        "send-password-reset-email",
      ])
    )
  })
})
