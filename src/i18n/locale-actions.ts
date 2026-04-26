'use server'

import { cookies } from "next/headers"
import { LOCALE_COOKIE, type Locale } from "./locale"

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export async function setUserLocale(locale: Locale): Promise<void> {
    const store = await cookies()
    store.set(LOCALE_COOKIE, locale, {
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        sameSite: "lax",
    })
}
